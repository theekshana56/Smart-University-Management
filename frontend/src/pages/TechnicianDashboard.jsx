import { useEffect, useState } from "react";
import ResourceLayout from "../components/resource/ResourceLayout";
import { ticketService } from "../services/ticketService";
import TicketTable from "../components/tickets/TicketTable";

export default function TechnicianDashboard({ onLogout, user }) {
  const [tickets, setTickets] = useState([]);
  const [commentsByTicket, setCommentsByTicket] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await ticketService.list();
      const all = Array.isArray(data) ? data : [];
      setTickets(all);
      const byTicket = {};
      await Promise.all(all.map(async (t) => { byTicket[t.id] = await ticketService.listComments(t.id); }));
      setCommentsByTicket(byTicket);
    } catch (err) {
      setError(err?.response?.data || "Failed to load assigned tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleStatus = async (ticketId, payload) => {
    await ticketService.updateStatus(ticketId, payload);
    await loadTickets();
  };

  return (
    <ResourceLayout onLogout={onLogout} user={user}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Technician Dashboard</h2>
        <p style={{ color: "var(--muted)" }}>Assigned Tasks where assignedTechnicianId equals your user ID.</p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        {loading ? <p>Loading...</p> : null}
        {error ? <p style={{ color: "#b71c1c" }}>{String(error)}</p> : null}
        {!loading && tickets.length === 0 ? <p>No assigned tickets right now.</p> : null}
        <TicketTable
          tickets={tickets}
          isAdmin={false}
          isTechnician
          users={[]}
          commentsByTicket={commentsByTicket}
          commentDrafts={commentDrafts}
          user={user}
          onAssign={async () => {}}
          onReject={async () => {}}
          onStatus={handleStatus}
          onCommentDraft={(ticketId, value) => setCommentDrafts((p) => ({ ...p, [ticketId]: value }))}
          onCommentPost={async (ticketId) => { await ticketService.addComment(ticketId, commentDrafts[ticketId] || ""); setCommentDrafts((p) => ({ ...p, [ticketId]: "" })); await loadTickets(); }}
          onCommentEdit={async (comment) => { const v = window.prompt("Edit comment", comment.content); if (v !== null) { await ticketService.updateComment(comment.id, v); await loadTickets(); } }}
          onCommentDelete={async (commentId) => { if (window.confirm("Delete this comment?")) { await ticketService.deleteComment(commentId); await loadTickets(); } }}
        />
      </div>
    </ResourceLayout>
  );
}
