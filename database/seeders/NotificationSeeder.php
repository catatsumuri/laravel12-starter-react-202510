<?php

namespace Database\Seeders;

use App\Models\User;
use App\Notifications\SystemNotification;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::find(1);

        if (! $user) {
            return;
        }

        DB::table('notifications')
            ->where('notifiable_type', User::class)
            ->where('notifiable_id', $user->getKey())
            ->delete();

        $now = CarbonImmutable::now();

        $notifications = [
            [
                'type' => 'success',
                'title' => 'New user registered',
                'message' => 'Taro Tanaka has created an account',
                'created_at' => $now->subMinutes(2),
                'read_at' => null,
            ],
            [
                'type' => 'warning',
                'title' => 'Scheduled maintenance',
                'message' => 'Maintenance will run tomorrow from 2:00 to 4:00 AM',
                'created_at' => $now->subHour(),
                'read_at' => null,
            ],
            [
                'type' => 'info',
                'title' => 'Feature update',
                'message' => 'A new analytics feature is now available on the dashboard',
                'created_at' => $now->subHours(3),
                'read_at' => null,
            ],
            [
                'type' => 'success',
                'title' => 'Report generated',
                'message' => 'The monthly report export has completed successfully',
                'created_at' => $now->subHours(5),
                'read_at' => $now->subHours(4)->addMinutes(30),
            ],
            [
                'type' => 'error',
                'title' => 'Sync error detected',
                'message' => 'An error occurred while syncing the latest data',
                'created_at' => $now->subDay(),
                'read_at' => $now->subHours(20),
            ],
        ];

        $payload = [];

        foreach ($notifications as $notification) {
            $id = (string) Str::uuid();
            $createdAt = $notification['created_at'];

            $payload[] = [
                'id' => $id,
                'type' => SystemNotification::class,
                'notifiable_type' => User::class,
                'notifiable_id' => $user->getKey(),
                'data' => json_encode([
                    'type' => $notification['type'],
                    'title' => $notification['title'],
                    'message' => $notification['message'],
                ]),
                'read_at' => $notification['read_at'],
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];
        }

        DB::table('notifications')->insert($payload);
    }
}
