# Smart-University-Management

## Branch Scope

This README is for branch `feature/Auth-&-notifications`.

This branch implements only:

- Notifications (Module D)
- Role management (admin user management)
- OAuth integration improvements

## Implemented Features

### 1) Notifications

Implemented persistent in-app notifications for:

- booking approval/rejection
- ticket status changes
- new comments on user's tickets

Backend:

- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PUT /api/notifications/{id}/read`
- `PUT /api/notifications/read-all`

Frontend:

- Notifications page at `/notifications`
- Mark-as-read and mark-all-read actions
- Unread count badge in navigation

### 2) Role Management

Implemented admin-managed user roles and user management flows.

Backend admin user endpoints:

- `GET /api/auth/admin/users`
- `POST /api/auth/admin/users`
- `PUT /api/auth/admin/users/{id}`
- `DELETE /api/auth/admin/users/{id}`

Frontend:

- Manage Users page at `/manage-users`
- Access restricted to admin users

### 3) OAuth Integration Improvements

Implemented/updated OAuth2 login integration with Google and improved user principal handling.

Includes:

- Google OAuth login flow from frontend login page
- OAuth user provisioning/update in backend
- Role authority mapping for OAuth-authenticated users
- Authenticated user resolution via OAuth principal email across relevant controllers

## Notes

- This README intentionally lists only features implemented in this branch.
- It does not document unrelated modules.