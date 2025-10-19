<?php

namespace App\MediaLibrary\PathGenerator;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class AvatarPathGenerator implements PathGenerator
{
    public function getPath(Media $media): string
    {
        return $this->basePath($media).'/';
    }

    public function getPathForConversions(Media $media): string
    {
        return $this->basePath($media).'/conversions/';
    }

    public function getPathForResponsiveImages(Media $media): string
    {
        return $this->basePath($media).'/responsive-images/';
    }

    protected function basePath(Media $media): string
    {
        $prefix = config('media-library.prefix', '');

        $userDirectory = 'avatar/'.$media->model_id;

        if ($prefix !== '') {
            return $prefix.'/'.$userDirectory;
        }

        return $userDirectory;
    }
}
