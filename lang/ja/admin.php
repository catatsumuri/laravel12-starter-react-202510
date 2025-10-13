<?php

return [
    'settings' => [
        'locale_updated' => '言語を更新しました。',
        'timezone_updated' => 'タイムゾーンを更新しました。',
        'timezone_title' => 'アプリケーションのタイムゾーン',
        'timezone_description' => 'アプリケーションで使用するタイムゾーンを選択してください。',
        'timezone_label' => 'タイムゾーンを選択',
        'application_updated' => 'アプリケーション設定を更新しました。',
        'allow_registration_title' => 'セルフサインアップ',
        'allow_registration_label' => 'ユーザーによるアカウント作成を許可する',
        'allow_registration_description' => '無効にすると、管理者のみが新規アカウントを作成できます。',
        'allow_appearance_title' => '表示テーマのカスタマイズ',
        'allow_appearance_label' => 'ユーザーによるテーマ変更を許可する',
        'allow_appearance_description' => '無効にすると、すべてのユーザーが既定のライトテーマで表示され、個別設定はクリアされます。',
        'default_appearance_title' => '既定の表示テーマ',
        'default_appearance_description' => 'ユーザーのカスタマイズ前に適用される基準のテーマを選択します。',
        'default_appearance_light' => 'ライト',
        'default_appearance_dark' => 'ダーク',
        'default_appearance_system' => 'システム',
        'section_general_title' => '一般設定',
        'section_general_description' => 'アプリケーション名、言語、タイムゾーンなどの基本設定を管理します。',
        'section_access_title' => 'アクセス設定',
        'section_access_description' => 'ユーザーのセルフサインアップなど、アカウント作成に関する挙動を制御します。',
        'section_appearance_title' => 'アピアランス設定',
        'section_appearance_description' => 'ユーザーに提供するテーマオプションや既定テーマを変更します。',
        'section_security_title' => 'セキュリティ設定',
        'section_security_description' => '二要素認証の利用可否など、セキュリティに関する既定値を管理します。',
        'allow_two_factor_label' => 'ユーザーによる二要素認証の有効化を許可する',
        'allow_two_factor_description' => '無効にすると、設定画面から二要素認証が隠され、ログイン時のTOTP認証もスキップされます。',
    ],
    'notifications' => [
        'new_user_registered' => [
            'title' => '新しいユーザーが登録しました',
            'message' => ':name さんがアカウントを作成しました。',
        ],
    ],
];
