<?php

namespace App\Services;

use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class UploadImageService
{
    public function handleImageUpload($file, $originalPath, $thumbnailPath)
    {
        // Paths where images will be saved
        $originalFullPath = public_path($originalPath);
        $thumbnailFullPath = public_path($thumbnailPath);

        // Move the original image file to the designated location
        $file->move(dirname($originalFullPath), basename($originalFullPath));
        
        $manager = new ImageManager(Driver::class);
        $image = $manager->read($originalFullPath);

        $image->resize(300, 300);
        $image->toPng()->save($thumbnailFullPath);

        // Return the paths to save them in the database
        return [
            'original_path' => "/".$originalPath,
            'thumbnail_path' => "/".$thumbnailPath,
        ];
    }
}