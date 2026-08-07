-- Invite-only accounts: close public self-registration by default.
update public.app_settings
set registration_open = false
where id = 1;
