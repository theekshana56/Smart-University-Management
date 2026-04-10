import AdminAssignment from "./AdminAssignment";
import CommentSection from "./CommentSection";
import TechnicianActions from "./TechnicianActions";

import { API_BASE_URL as API_BASE } from "../../api/apiClient";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

function toAttachmentUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}/${String(path).replace(/^\/+/, "")}`;
}

function statusPillStyle(status) {
  const value = String(status || "").toUpperCase();
  if (value === "OPEN") return { background: "#fef3c7", color: "#92400e" };
  if (value === "IN_PROGRESS") return { background: "#dbeafe", color: "#1d4ed8" };
  if (value === "RESOLVED") return { background: "#dcfce7", color: "#166534" };
  if (value === "REJECTED") return { background: "#fee2e2", color: "#b91c1c" };
  if (value === "CLOSED") return { background: "#e2e8f0", color: "#0f172a" };
  return { background: "#e5e7eb", color: "#111827" };
}

export default function TicketTable({
  tickets,
  isAdmin,
  isTechnician,
  users,
  commentsByTicket,
  commentDrafts,
  user,
  onAssign,
  onReject,
  onStatus,
  onCommentDraft,
  onCommentPost,
  onCommentEdit,
  onCommentDelete,
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {tickets.map((ticket) => (
        <div key={ticket.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <strong>#{ticket.id} - {ticket.category}</strong>
            <span
              style={{
                ...statusPillStyle(ticket.status),
                borderRadius: 999,
                padding: "3px 10px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.2,
              }}
            >
              {ticket.status}
            </span>
          </div>
          {isAdmin ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 10,
                marginTop: 8,
              }}
            >
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 10, background: "#f8fafc" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>USER REQUEST DETAILS</div>
                <div style={{ marginBottom: 4 }}>{ticket.description}</div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>{ticket.resourceLocation}</div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>Priority: {ticket.priority}</div>
                {ticket.createdAt ? <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>Created: {new Date(ticket.createdAt).toLocaleString()}</div> : null}
              </div>

              <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 10, background: "#f8fafc" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>TECHNICIAN WORKFLOW</div>
                <div style={{ fontSize: 13 }}>
                  Assigned: <strong>{ticket.assignedTechnicianName || "Not assigned yet"}</strong>
                </div>
                {ticket.resolutionNotes ? <div style={{ fontSize: 13, marginTop: 6 }}>Resolution: {ticket.resolutionNotes}</div> : null}
                {ticket.rejectionReason ? <div style={{ fontSize: 13, color: "#b71c1c", marginTop: 6 }}>Rejected: {ticket.rejectionReason}</div> : null}
              </div>
            </div>
          ) : (
            <>
              <div>{ticket.description}</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>{ticket.resourceLocation} | Priority: {ticket.priority}</div>
              {ticket.assignedTechnicianName ? <div style={{ fontSize: 13 }}>Assigned: {ticket.assignedTechnicianName}</div> : null}
              {ticket.resolutionNotes ? <div style={{ fontSize: 13 }}>Resolution: {ticket.resolutionNotes}</div> : null}
              {ticket.rejectionReason ? <div style={{ fontSize: 13, color: "#b71c1c" }}>Rejected: {ticket.rejectionReason}</div> : null}
            </>
          )}
          {Array.isArray(ticket.attachments) && ticket.attachments.length > 0 ? (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Attachments</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ticket.attachments.map((path, idx) => {
                  const src = toAttachmentUrl(path);
                  return (
                    <a key={`${ticket.id}-attachment-${idx}`} href={src} target="_blank" rel="noreferrer">
                      <img
                        src={src}
                        alt={`ticket-${ticket.id}-attachment-${idx + 1}`}
                        style={{
                          width: 90,
                          height: 90,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid #d1d5db",
                        }}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}

          {isAdmin ? <div style={{ marginTop: 8 }}><AdminAssignment ticket={ticket} users={users} onAssign={onAssign} onReject={onReject} /></div> : null}
          {isTechnician ? <TechnicianActions ticket={ticket} onStatusChange={onStatus} /> : null}

          <CommentSection
            comments={commentsByTicket[ticket.id] || []}
            currentUser={user}
            draft={commentDrafts[ticket.id] || ""}
            onDraft={(value) => onCommentDraft(ticket.id, value)}
            onPost={() => onCommentPost(ticket.id)}
            onEdit={onCommentEdit}
            onDelete={onCommentDelete}
          />
        </div>
      ))}
    </div>
  );
}
