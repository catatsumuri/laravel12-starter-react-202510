# Admin Settings Management Test Plan

## Scope
- 管理画面 `/admin/settings` によるアプリケーション設定の集中管理機能。
- 以下の設定が `.env` ではなく DB に保存され、アプリ全体で直ちに反映されること。
  - `app.allow_appearance_customization`
  - `app.allow_two_factor_authentication`
  - その他の一般設定（アプリ名、ユーザー登録許可、デフォルトテーマ、言語、タイムゾーン）との連携。
- Fortify を用いた二要素認証 (2FA) の挙動が設定値に一致していること。

## 前提条件
- `php artisan migrate:fresh --seed` を実行済みで、管理者ロールを持つユーザーが存在すること。
- 管理者でログインできる認証情報を保有していること。
- ブラウザは最新の Chromium / Firefox のいずれか。
- Fortify の二要素認証機能が有効化されているプロジェクト設定であること。

## テストケース

| ID | 種別 | シナリオ | 手順 | 期待結果 | 自動化 |
| --- | --- | --- | --- | --- | --- |
| TC-SET-001 | バックエンド | 管理者のみ設定画面を閲覧可能 | 1. 管理者でログイン 2. `/admin/settings` へアクセス | ステータス200、設定フォームが表示される | `tests/Feature/Admin/ApplicationSettingsTest::it_allows_admins_to_view_the_settings_page` |
| TC-SET-002 | バックエンド | 非管理者はアクセス拒否 | 1. 一般ユーザーでログイン 2. `/admin/settings` へアクセス | HTTP 403 が返る | `tests/Feature/Admin/ApplicationSettingsTest::it_forbids_non_admins_from_accessing_the_settings_page` |
| TC-SET-003 | フロント/バック | 2FA トグルで設定が保存される | 1. 管理者で `/admin/settings` にアクセス 2. 「二要素認証を許可する」をオフにして保存 | 成功メッセージ、`Setting::value('app.allow_two_factor_authentication')` と `config('app.allow_two_factor_authentication')` が false | `tests/Feature/Admin/ApplicationSettingsTest::it_updates_the_two_factor_authentication_flag` |
| TC-SET-004 | バックエンド | 2FA 無効時の動作 | 1. `app.allow_two_factor_authentication=false` に設定済み 2. 任意ユーザーで `/settings/two-factor` にアクセス | HTTP 403 が返る | `tests/Feature/Settings/TwoFactorAuthenticationTest::two_factor_settings_page_returns_forbidden_response_when_two_factor_is_disabled` |
| TC-SET-005 | フロント | 2FA 無効時はナビゲーションから非表示 | 1. `app.allow_two_factor_authentication=false` に設定済み 2. `/settings/profile` を開く | `settingsNavigation.twoFactor` が false、UI 上で 2FA リンクが表示されない | `tests/Feature/Settings/TwoFactorAuthenticationTest::settings_navigation_omits_two_factor_link_when_application_disables_it` |
| TC-SET-006 | バックエンド | アピアランス設定と独立した 2FA | 1. `app.allow_appearance_customization=false` かつ `app.allow_two_factor_authentication=true` に設定 2. `/settings/profile` を開く | 2FA リンクは表示される (`settingsNavigation.twoFactor` が true) | `tests/Feature/Settings/TwoFactorAuthenticationTest::settings_navigation_shows_two_factor_link_even_when_appearance_customization_disabled` |
| TC-SET-007 | バックエンド | アピアランス設定更新が即時反映 | 1. 管理者で「表示テーマのカスタマイズ」をオフにして保存 2. `/settings/profile` を開く | `settingsNavigation.appearance` が false、UI でアピアランスリンクが非表示 | `tests/Feature/Admin/ApplicationSettingsTest::it_updates_the_appearance_customization_flag` |
| TC-SET-008 | バックエンド | タイムゾーン更新 | 1. 設定画面でタイムゾーンを `UTC` に変更 2. 保存後に `config('app.timezone')` と `date_default_timezone_get()` を確認 | いずれも `UTC` に更新されている | `tests/Feature/Admin/ApplicationSettingsTest::it_updates_the_timezone_using_the_main_settings_form` |
| TC-SET-009 | フロント | 保存後の UI 反映 | 1. 任意の設定を変更して保存 2. ページを再読込 | 変更した値がフォームに反映された状態で表示される | 手動 |

## 備考
- 上記の自動化テストは `php artisan test --filter=ApplicationSettingsTest --testsuite=Feature` および `php artisan test --filter=TwoFactorAuthenticationTest --testsuite=Feature` で実行可能。
- DB へ保存された設定値が `.env` より優先されるため、環境変数を変更せずとも管理画面からの設定でアプリ全体の挙動を調整できる。
