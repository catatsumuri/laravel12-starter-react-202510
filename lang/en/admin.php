<?php

return [
    'settings' => [
        'locale_updated' => 'Language updated.',
        'timezone_updated' => 'Timezone updated.',
        'timezone_title' => 'Application timezone',
        'timezone_description' => 'Select the timezone that the application should use.',
        'timezone_label' => 'Select timezone',
        'application_updated' => 'Application settings updated.',
        'allow_registration_title' => 'Self sign-up',
        'allow_registration_label' => 'Allow users to create their own accounts',
        'allow_registration_description' => 'When disabled, new accounts can only be created by administrators.',
        'allow_appearance_title' => 'Appearance customization',
        'allow_appearance_label' => 'Allow users to personalize their theme',
        'allow_appearance_description' => 'When disabled, all users will see the default light theme and personal theme choices are cleared.',
        'default_appearance_title' => 'Default appearance',
        'default_appearance_description' => 'Choose the base theme that applies before any user customization.',
        'default_appearance_light' => 'Light',
        'default_appearance_dark' => 'Dark',
        'default_appearance_system' => 'System',
        'section_general_title' => 'General settings',
        'section_general_description' => 'Control the application name, interface language, and timezone.',
        'section_access_title' => 'Access & registration',
        'section_access_description' => 'Manage whether users can self-register or require admin provisioning.',
        'section_appearance_title' => 'Appearance defaults',
        'section_appearance_description' => 'Define the default theme and whether users can override the appearance.',
        'section_security_title' => 'Security features',
        'section_security_description' => 'Control two-factor authentication availability and related security defaults.',
        'allow_two_factor_label' => 'Allow users to enable two-factor authentication',
        'allow_two_factor_description' => 'When disabled, the two-factor settings page is hidden and logins skip TOTP challenges.',
    ],
    'notifications' => [
        'new_user_registered' => [
            'title' => 'New user registered',
            'message' => ':name has created an account.',
        ],
    ],
];
