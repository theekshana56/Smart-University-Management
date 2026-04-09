import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import { adminUserService } from "../services/adminUserService";
import TicketTable from "../components/tickets/TicketTable";

export default function AdminTicketManager({ user }) {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [commentsByTicket, setCommentsByTicket] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [filter, setFilter] = useState("ALL");

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

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "ALL") return true;
    if (filter === "UNASSIGNED") return !ticket.assignedTechnicianId;
    if (filter === "IN_PROGRESS") return ticket.status === "IN_PROGRESS";
    if (filter === "RESOLVED") return ticket.status === "RESOLVED";
    return true;
  });

  const filterButtonStyle = (key) => ({
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    padding: "6px 10px",
    background: filter === key ? "#1e293b" : "#fff",
    color: filter === key ? "#fff" : "#0f172a",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 12,
          background: "#f8fafc",
        }}
      >
        <div style={{ fontSize: 13, color: "#334155" }}>
          <strong>{filteredTickets.length}</strong> of <strong>{tickets.length}</strong> tickets
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" style={filterButtonStyle("ALL")} onClick={() => setFilter("ALL")}>All</button>
          <button type="button" style={filterButtonStyle("UNASSIGNED")} onClick={() => setFilter("UNASSIGNED")}>Unassigned</button>
          <button type="button" style={filterButtonStyle("IN_PROGRESS")} onClick={() => setFilter("IN_PROGRESS")}>In Progress</button>
          <button type="button" style={filterButtonStyle("RESOLVED")} onClick={() => setFilter("RESOLVED")}>Resolved</button>
        </div>
      </div>

      <TicketTable
        tickets={filteredTickets}
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
    </div>
  );
}
