<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileAvatarRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class ProfileAvatarController extends Controller
{
    /**
     * Accept the uploaded avatar, strip metadata, and store via Media Library.
     */
    public function store(ProfileAvatarRequest $request): RedirectResponse
    {
        /** @var UploadedFile $avatar */
        $avatar = $request->file('avatar');

        $temporaryPath = $this->sanitizeImage($avatar);

        try {
            $request->user()
                ->addMedia($temporaryPath)
                ->usingFileName($this->determineFilename($avatar))
                ->withCustomProperties([
                    'original_name' => $avatar->getClientOriginalName(),
                ])
                ->toMediaCollection('avatar');
        } finally {
            if (is_file($temporaryPath)) {
                @unlink($temporaryPath);
            }
        }

        return to_route('profile.edit')
            ->with('success', __('frontend.settings.profile.avatar.success'));
    }

    protected function sanitizeImage(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'jpg');
        $temporaryPath = tempnam(sys_get_temp_dir(), 'avatar_clean_');

        if ($temporaryPath === false) {
            throw new RuntimeException('Unable to create temporary file for avatar sanitization.');
        }

        $sanitizedPath = $temporaryPath.'.'.$extension;

        if (! @rename($temporaryPath, $sanitizedPath)) {
            throw new RuntimeException('Unable to prepare temporary path for avatar sanitization.');
        }

        $image = null;

        try {
            $image = $this->createImageResource($file, $extension);

            if ($image === null) {
                copy($file->getRealPath(), $sanitizedPath);

                return $sanitizedPath;
            }

            $this->encodeImage($image, $sanitizedPath, $extension);
        } catch (Throwable $exception) {
            copy($file->getRealPath(), $sanitizedPath);
        } finally {
            if ($image instanceof \GdImage) {
                imagedestroy($image);
            }
        }

        return $sanitizedPath;
    }

    protected function determineFilename(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'jpg');

        return Str::uuid()->toString().'.'.$extension;
    }

    protected function createImageResource(UploadedFile $file, string $extension): ?\GdImage
    {
        $extension = strtolower($extension);

        return match ($extension) {
            'jpg', 'jpeg' => function_exists('imagecreatefromjpeg') ? @imagecreatefromjpeg($file->getRealPath()) : null,
            'png' => function_exists('imagecreatefrompng') ? @imagecreatefrompng($file->getRealPath()) : null,
            'webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($file->getRealPath()) : null,
            default => null,
        };
    }

    protected function encodeImage(\GdImage $image, string $path, string $extension): void
    {
        $extension = strtolower($extension);

        match ($extension) {
            'jpg', 'jpeg' => imagejpeg($image, $path, 90),
            'png' => $this->encodePng($image, $path),
            'webp' => $this->encodeWebp($image, $path),
            default => imagejpeg($image, $path, 90),
        };
    }

    protected function encodePng(\GdImage $image, string $path): void
    {
        if (function_exists('imagesavealpha')) {
            imagealphablending($image, false);
            imagesavealpha($image, true);
        }

        imagepng($image, $path, 6);
    }

    protected function encodeWebp(\GdImage $image, string $path): void
    {
        if (function_exists('imagewebp')) {
            imagewebp($image, $path, 90);

            return;
        }

        imagejpeg($image, $path, 90);
    }

    public function show(Request $request, Media $media): StreamedResponse
    {
        $user = $request->user();

        if (! $media->model instanceof User || $media->model->isNot($user)) {
            abort(403);
        }

        $disk = Storage::disk($media->disk);
        $relativePath = $media->getPathRelativeToRoot();

        if (! $disk->exists($relativePath)) {
            abort(404);
        }

        $stream = $disk->readStream($relativePath);

        if ($stream === false) {
            abort(404);
        }

        return response()->stream(
            function () use ($stream): void {
                fpassthru($stream);

                if (is_resource($stream)) {
                    fclose($stream);
                }
            },
            200,
            [
                'Content-Type' => $media->mime_type ?? $disk->mimeType($relativePath) ?? 'application/octet-stream',
                'Content-Length' => (string) $media->size,
                'Cache-Control' => 'private, max-age=0, must-revalidate',
                'Content-Disposition' => 'inline; filename="'.$media->file_name.'"',
                'Last-Modified' => optional($media->updated_at)->toRfc7231String(),
            ]
        );
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();
        $media = $user->getFirstMedia('avatar');

        if ($media) {
            $media->delete();
        }

        return to_route('profile.edit')
            ->with('success', __('frontend.settings.profile.avatar.deleted'));
    }
}
