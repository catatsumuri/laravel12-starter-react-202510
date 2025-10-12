<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    protected $casts = [
        'value' => 'string',
    ];

    public static function value(string $key, ?string $default = null): ?string
    {
        return Cache::rememberForever(static::cacheKey($key), function () use ($key, $default) {
            return static::query()
                ->where('key', $key)
                ->value('value')
                ?? $default;
        });
    }

    public static function updateValue(string $key, string $value): void
    {
        static::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $value],
        );

        Cache::forget(static::cacheKey($key));
    }

    protected static function cacheKey(string $key): string
    {
        return sprintf('settings.%s', $key);
    }
}
