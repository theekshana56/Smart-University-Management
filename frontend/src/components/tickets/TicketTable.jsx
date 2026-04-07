import AdminAssignment from "./AdminAssignment";
import CommentSection from "./CommentSection";
import TechnicianActions from "./TechnicianActions";

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
            <span>{ticket.status}</span>
          </div>
          <div>{ticket.description}</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>{ticket.resourceLocation} | Priority: {ticket.priority}</div>
          {ticket.assignedTechnicianName ? <div style={{ fontSize: 13 }}>Assigned: {ticket.assignedTechnicianName}</div> : null}
          {ticket.resolutionNotes ? <div style={{ fontSize: 13 }}>Resolution: {ticket.resolutionNotes}</div> : null}
          {ticket.rejectionReason ? <div style={{ fontSize: 13, color: "#b71c1c" }}>Rejected: {ticket.rejectionReason}</div> : null}

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
