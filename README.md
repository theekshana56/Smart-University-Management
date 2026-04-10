# Resource feature (frontend)

This document describes the **campus resources** UI: listing, filtering, charts, PDF export, and admin-only create/update/delete. It is intentionally **not committed** to the remote repository (see root `.gitignore`).

---

## Overview

The resources screen lets authenticated users **browse** labs, lecture halls, meeting rooms, and equipment with search and filters, switch between **table** and **grid** views, download a **PDF report**, and see simple **stats** and **charts**.

- **ADMIN** users see full management UI: add resource (floating action button), edit/delete row actions, bulk delete, and the add/edit modal form.
- **Non-admin** users get **read-only** access: no checkboxes, no actions column, no FAB, no form modal; they can still filter, change view, open grid detail modal, and download PDF.

---

## Route and page entry

| File | Role |
|------|------|
| `frontend/src/pages/ResourcesPage.jsx` | Route `/resources` composition: loads data, owns filters state, wires layout + stats + chart + list. |

Key behavior:

- **`canManageResources`** — `true` only when `user.role` (case-insensitive) is `ADMIN`; passed to `ResourceList`.
- **`load()`** — Calls `resourceService.list(params)` when filters change (`q`, `type`, `status`, `minCap`, `location`).
- **`submit(form, editingId, closeModal)`** — Validates “ACTIVE status requires AVAILABLE availability”; builds payload with numeric `capacity`; `create` or `update` via service; on success closes modal and reloads. Errors surfaced with `alert()` (includes API message when present).
- **`remove(id)`** — Confirms then `resourceService.remove(id)` and reloads.

---

## Component map

All paths below are under `frontend/src/components/resource/` unless noted.

### `ResourceLayout.jsx`

App shell for the resources area: branding, side navigation, profile block, logout. Shared pattern with other feature layouts.

### `ResourceList.jsx`

Main interactive surface:

- Top row: search input, table/grid toggle, PDF download, bulk delete (admins only, when rows selected).
- **Table view**: columns depend on `canManageResources` (checkbox + actions only for admins). Uses `loading` prop for skeleton/loader row.
- **Grid view**: cards open a **read-only detail modal** (name, type, capacity, location, status, availability).
- **Add/edit modal** (admins only): wraps `ResourceForm`.
- **Floating “+” button** (admins only) opens add flow.

**Submit contract:** the list calls `onSubmit(form, editingId, closeModal)` after `event.preventDefault()` — the parent receives the form object, not the DOM event.

### `ResourceForm.jsx`

Controlled form: name, type (`LECTURE_HALL`, `LAB`, `MEETING_ROOM`, `EQUIPMENT`), capacity, location, status (`ACTIVE`, `OUT_OF_SERVICE`), availability (`AVAILABLE`, `MAINTENANCE`, `UNAVAILABLE`). Warns when status/availability imply “not bookable.”

### `ResourceStats.jsx` / `ResourceChart.jsx`

Present aggregate views over the `items` array passed from `ResourcesPage` (counts, distribution — see component source for exact metrics).

### `ResourceCard.jsx` (module)

A standalone `ResourceCard` component exists in this folder but is **not** imported by `ResourceList.jsx`. The grid view uses an **inline** `ResourceCard` function defined inside `ResourceList.jsx`. The separate file may be kept for reuse or legacy; prefer checking imports before editing.

---

## Styling

| File | Purpose |
|------|---------|
| `resource.css` | Layout shell, cards, nav-related resource page styling. |
| `table.css` | Table, pills, buttons, modals used by the list and form. |

---

## API layer

| File | Purpose |
|------|---------|
| `frontend/src/services/resourceService.js` | Thin axios wrappers around `/resources`. |
| `frontend/src/api/apiClient.js` | `baseURL` = `import.meta.env.VITE_API_BASE_URL` or `http://localhost:8085/api`; **`withCredentials: true`** for session cookies (e.g. OAuth). |

Endpoints (relative to `apiClient` base URL, which already includes `/api`):

| Method | Path | Use |
|--------|------|-----|
| GET | `/resources` | List with optional query params |
| GET | `/resources/{id}` | Single resource (if used elsewhere) |
| POST | `/resources` | Create (admin) |
| PUT | `/resources/{id}` | Update (admin) |
| DELETE | `/resources/{id}` | Delete/soft-delete (admin) |
| GET | `/resources/report/pdf` | PDF blob (`responseType: 'blob'`) |

---

## Backend alignment

Server: `backend/src/main/java/com/smartcampus/controller/ResourceController.java`

- **GET** list, GET by id, and PDF report: any **authenticated** user.
- **POST / PUT / DELETE**: `@PreAuthorize("hasRole('ADMIN')")` — must match the UI’s `canManageResources` flag so admins are not confused by 403 responses.

DTO validation (e.g. `ResourceRequestDTO`) requires non-blank fields and allowed `status` values; the form should stay aligned with those rules.

---

## Local copy of this file

This `README.md` is listed in the project `.gitignore` so it stays on your machine and is not pushed. Teammates who want the same doc can copy this content or maintain their own local file.
