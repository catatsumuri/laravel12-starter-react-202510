<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->with('roles:id,name')
            ->latest('id')
            ->paginate(10)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->all(),
                'deleted_at' => $user->deleted_at,
                'last_login_at' => optional($user->last_login_at)?->toIso8601String(),
            ])
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'roles' => Role::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Role $role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                ])
                ->values(),
        ]);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $user->load('roles:id,name');

        return Inertia::render('admin/users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->all(),
                'email_verified_at' => optional($user->email_verified_at)?->toIso8601String(),
                'created_at' => optional($user->created_at)?->toIso8601String(),
                'updated_at' => optional($user->updated_at)?->toIso8601String(),
                'deleted_at' => optional($user->deleted_at)?->toIso8601String(),
                'last_login_at' => optional($user->last_login_at)?->toIso8601String(),
            ],
            'canDelete' => auth()->id() !== $user->id,
        ]);
    }

    public function activity(User $user): Response
    {
        $activities = Activity::query()
            ->where('subject_type', $user->getMorphClass())
            ->where('subject_id', $user->getKey())
            ->with('causer:id,name')
            ->latest()
            ->paginate(15)
            ->through(fn (Activity $activity) => [
                'id' => $activity->id,
                'description' => $activity->description,
                'causer' => $activity->causer
                    ? [
                        'id' => $activity->causer->id,
                        'name' => $activity->causer->name,
                    ]
                    : null,
                'changes' => [
                    'attributes' => Arr::get($activity->changes(), 'attributes', []),
                    'old' => Arr::get($activity->changes(), 'old', []),
                ],
                'created_at' => optional($activity->created_at)?->toIso8601String(),
            ])
            ->withQueryString();

        return Inertia::render('admin/users/activity', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'activities' => $activities,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:'.User::class,
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', Rule::exists(Role::class, 'name')],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->syncRoles([$data['role']]);

        return to_route('admin.users.index')
            ->with('success', __('User created successfully.'));
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $user->load('roles:id,name');

        return Inertia::render('admin/users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
            ],
            'roles' => Role::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Role $role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                ])
                ->values(),
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', Rule::exists(Role::class, 'name')],
        ]);

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        $user->syncRoles([$data['role']]);

        return to_route('admin.users.edit', $user)
            ->with('success', __('User updated successfully.'));
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->is($user)) {
            return back()->with('error', __('You cannot delete your own account.'));
        }

        $user->delete();

        return to_route('admin.users.index')
            ->with('success', __('User deleted successfully.'));
    }
}
