import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import { adminUserService } from "../services/adminUserService";
import TicketTable from "../components/tickets/TicketTable";

export default function AdminTicketManager({ user }) {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [commentsByTicket, setCommentsByTicket] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});

  const load = async () => {
    const data = await ticketService.list();
    const all = Array.isArray(data) ? data : [];
    setTickets(all);
    const byTicket = {};
    await Promise.all(all.map(async (t) => { byTicket[t.id] = await ticketService.listComments(t.id); }));
    setCommentsByTicket(byTicket);
  };

  useEffect(() => {
    load();
    adminUserService.list().then(setUsers).catch(() => setUsers([]));
  }, []);

  return (
    <TicketTable
      tickets={tickets}
      isAdmin
      isTechnician={false}
      users={users}
      commentsByTicket={commentsByTicket}
      commentDrafts={commentDrafts}
      user={user}
      onAssign={async (ticketId, technicianId) => { await ticketService.assign(ticketId, technicianId); await load(); }}
      onReject={async (ticketId, reason) => { await ticketService.updateStatus(ticketId, { status: "REJECTED", rejectionReason: reason }); await load(); }}
      onStatus={async () => {}}
      onCommentDraft={(ticketId, value) => setCommentDrafts((p) => ({ ...p, [ticketId]: value }))}
      onCommentPost={async (ticketId) => { await ticketService.addComment(ticketId, commentDrafts[ticketId] || ""); setCommentDrafts((p) => ({ ...p, [ticketId]: "" })); await load(); }}
      onCommentEdit={async (comment) => { const v = window.prompt("Edit comment", comment.content); if (v !== null) { await ticketService.updateComment(comment.id, v); await load(); } }}
      onCommentDelete={async (commentId) => { if (window.confirm("Delete this comment?")) { await ticketService.deleteComment(commentId); await load(); } }}
    />
  );
}
