# Module C — Maintenance & Incident Ticketing

This document describes **Module C** in **Smart University Management**: how users report incidents, how tickets flow through statuses, how technicians work them, and how comments are governed. It reflects the behavior implemented in this repository.

---

## Scope summary

| Area | What users can do |
|------|-------------------|
| **Create tickets** | Log an incident with resource/location, category, description, priority, preferred contact, and optional images. |
| **Workflow** | Progress from open work through resolution; admins can reject or close when appropriate. |
| **Assignment** | Admins assign a **technician** to a ticket; assigned technicians update status and resolution notes. |
| **Comments** | Eligible users can comment; **only the comment author** may edit or delete their own comment (enforced in API and UI). |

---

## Creating a ticket

Authenticated users (typically the ticket reporter role) can create an incident ticket with:

- **Resource / location** — Where the issue occurs (free-text field).
- **Category** — Short classification for routing and reporting.
- **Description** — What went wrong (e.g. damaged equipment, error context).
- **Priority** — e.g. LOW / MEDIUM / HIGH (as configured in the app).
- **Preferred contact** — How staff should reach the reporter.
- **Attachments** — Up to **three** image uploads (evidence such as a damaged projector or an error screen).

**Frontend:** ticket creation form and list live under the tickets flow (`frontend/src/pages/TicketsPage.jsx`, `TicketForm`).

**Backend:** `POST /api/tickets` (multipart) persists the ticket and stores image attachments.

---

## Ticket workflow

Intended lifecycle:

```text
OPEN → IN_PROGRESS → RESOLVED → CLOSED
```

Additional path for admins:

- **REJECTED** — Admin-only; requires a **rejection reason** (notified to the ticket creator).

**Rules (as implemented):**

| Actor | Typical actions |
|-------|-----------------|
| **Technician** (assigned) | `OPEN` → `IN_PROGRESS`; `IN_PROGRESS` → `RESOLVED` (resolution notes required). |
| **Admin** | May set `REJECTED` with reason; may move `RESOLVED` → `CLOSED`. |
| **Others** | Cannot perform transitions they are not authorized for (API returns an error). |

Notifications are sent on relevant status changes so stakeholders stay informed.

---

## Assignment and technician work

- **Admin** assigns a ticket to a user with the **TECHNICIAN** role (`PUT /api/tickets/{id}/assign`).
- The **assigned technician** sees their tickets on the **Technician Dashboard** (`frontend/src/pages/TechnicianDashboard.jsx`), can filter by summary categories, update status as above, add **resolution notes** when resolving, add comments, and (for resolved/closed tickets they own) remove tickets per current product rules.
- **Staff / admin** views: users with roles that receive the full ticket list (e.g. admin workflow) use the **Admin Ticket Manager** (`frontend/src/pages/AdminTicketManager.jsx`) for assignment, rejection, PDF export where enabled, and moderation-style actions.

---

## Comments and ownership

- Users who **can access** a ticket (reporter, assigned technician, and privileged roles per `canAccessTicket` rules) may **add** comments.
- **Edit** and **delete** are allowed **only for comments authored by the current user** (`canModifyComment` / author match). Attempts by other users are rejected by the API with a clear error.
- **Frontend** mirrors this: edit/delete controls appear only for the viewer’s own comments where applicable.

**API (examples):**

- `GET /api/tickets/{id}/comments` — list (with access check).
- `POST /api/tickets/{id}/comments` — add.
- `PUT /api/tickets/comments/{commentId}` — update (author only).
- `DELETE /api/tickets/comments/{commentId}` — delete (author only).

---

## Key code locations

| Layer | Location |
|-------|----------|
| Ticket API | `backend/.../controller/TicketController.java` |
| Ticket logic & workflow | `backend/.../service/TicketService.java` |
| Status enum | `backend/.../model/TicketStatus.java` |
| User ticket UI | `frontend/src/pages/TicketsPage.jsx` |
| Admin tickets | `frontend/src/pages/AdminTicketManager.jsx` |
| Technician dashboard | `frontend/src/pages/TechnicianDashboard.jsx` |
| Table / comments UI | `frontend/src/components/tickets/` |
| HTTP client helpers | `frontend/src/services/ticketService.js` |

---

## Module owner notes

Use this file as the **Module C** handoff for grading or demos: it ties the specification (maintenance & incident ticketing) to the actual routes, roles, and UI entry points in this project.
