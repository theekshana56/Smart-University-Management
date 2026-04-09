import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import TicketTable from "../components/tickets/TicketTable";
import "../components/resource/resource.css";

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
    <main style={{ minHeight: "100vh", padding: "24px", background: "linear-gradient(180deg, #d9dce3 0, #ced3dc 100%)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 8 }}>Technician Dashboard</h2>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>Assigned tasks connected to your account.</p>
            </div>
            <button onClick={onLogout} className="sideLogout" style={{ width: "auto", justifyContent: "center", padding: "10px 14px" }}>
              Logout
            </button>
          </div>
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
      </div>
    </main>
  );
}
