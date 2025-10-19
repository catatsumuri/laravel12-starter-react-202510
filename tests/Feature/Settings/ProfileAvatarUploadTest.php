<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

function uploadedAvatarWithExif(): UploadedFile
{
    $temporaryPath = tempnam(sys_get_temp_dir(), 'avatar_exif_');

    if ($temporaryPath === false) {
        throw new \RuntimeException('Unable to create temporary avatar path.');
    }

    $jpegPath = $temporaryPath.'.jpg';

    if (! @rename($temporaryPath, $jpegPath)) {
        throw new \RuntimeException('Unable to prepare JPEG path for avatar.');
    }

    $image = imagecreatetruecolor(16, 16);
    $color = imagecolorallocate($image, 255, 0, 0);
    imagefill($image, 0, 0, $color);
    imagejpeg($image, $jpegPath, 90);
    imagedestroy($image);

    $contents = file_get_contents($jpegPath);

    $exifData = 'Exif'."\0\0"
        ."II*\0"
        ."\x08\0\0\0"
        ."\x01\0"
        ."\x10\x01"
        ."\x02\0"
        .pack('V', 6)
        .pack('V', 0x1A)
        ."\0\0\0\0"
        ."Canon\0";

    $segment = "\xFF\xE1".pack('n', strlen($exifData) + 2).$exifData;
    $contentsWithExif = substr($contents, 0, 2).$segment.substr($contents, 2);

    file_put_contents($jpegPath, $contentsWithExif);

    return new UploadedFile(
        $jpegPath,
        'avatar-with-exif.jpg',
        'image/jpeg',
        null,
        true
    );
}

test('プロフィールのアバター画像をアップロードするとEXIF情報が除去される', function (): void {
    if (! function_exists('exif_read_data')) {
        $this->markTestSkipped('The exif PHP extension is not available.');
    }

    Storage::fake('local');

    $user = User::factory()->create();

    $this->actingAs($user);

    $avatar = uploadedAvatarWithExif();

    $originalExif = @exif_read_data($avatar->getPathname());
    expect($originalExif)->not->toBeFalse();
    expect($originalExif['Model'] ?? null)->toBe('Canon');

    $response = $this->post(route('profile.avatar.store'), [
        'avatar' => $avatar,
    ]);

    $response->assertRedirect(route('profile.edit'));

    $user->refresh();

    $media = $user->getFirstMedia('avatar');

    expect($media)->not->toBeNull();

    expect($media->disk)->toBe('local');
    expect($media->collection_name)->toBe('avatar');

    $relativePath = $media->getPathRelativeToRoot();
    $mediaId = $media->getKey();

    expect(Str::startsWith($relativePath, 'avatar/'.$user->id.'/'))->toBeTrue();

    expect(Storage::disk('local')->exists($relativePath))->toBeTrue();

    $storedPath = Storage::disk('local')->path($relativePath);

    $exifData = @exif_read_data($storedPath);

    expect($exifData)->not->toBeFalse();
    expect($exifData['Model'] ?? null)->toBeNull();
    expect($exifData['IFD0'] ?? null)->toBeNull();
    expect(str_contains($exifData['SectionsFound'] ?? '', 'IFD0'))->toBeFalse();

    $streamResponse = $this->get(route('profile.avatar.show', ['media' => $media->getKey()]));

    $streamResponse->assertOk();
    $streamResponse->assertHeader('Content-Type', 'image/jpeg');
    $cacheControl = $streamResponse->headers->get('Cache-Control');
    expect($cacheControl)->toContain('private');
    expect($cacheControl)->toContain('max-age=0');
    expect($cacheControl)->toContain('must-revalidate');

    $deleteResponse = $this->delete(route('profile.avatar.destroy'));

    $deleteResponse->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->getFirstMedia('avatar'))->toBeNull();
    expect(Storage::disk('local')->exists($relativePath))->toBeFalse();

    $this->get(route('profile.avatar.show', ['media' => $mediaId]))->assertNotFound();
});
