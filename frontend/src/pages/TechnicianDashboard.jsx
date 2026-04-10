import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import TicketTable from "../components/tickets/TicketTable";
import { confirmPopup, promptPopup } from "../utils/popup";
import { useNavigate } from "react-router-dom";
import "../components/resource/resource.css";

export default function TechnicianDashboard({ onLogout, user }) {
  const navigate = useNavigate();
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
      await Promise.all(
        all.map(async (t) => {
          byTicket[t.id] = await ticketService.listComments(t.id);
        })
      );
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

  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;
  const pending = tickets.filter((t) => t.status !== "RESOLVED" && t.status !== "REJECTED").length;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "T";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');

        .td-root {
          min-height: 100vh;
          padding: 28px 24px;
          background: linear-gradient(180deg, #d9dce3 0, #ced3dc 100%);
          font-family: 'Geist', system-ui, sans-serif;
        }

        .td-inner {
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          gap: 16px;
        }

        /* ── Top header card ── */
        .td-header {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .td-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .td-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #1e293b;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }

        .td-title-group h2 {
          margin: 0 0 2px;
          font-size: 17px;
          font-weight: 600;
          color: #0f172a;
        }

        .td-title-group p {
          margin: 0;
          font-size: 13px;
          color: #94a3b8;
        }

        .td-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .td-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Geist', system-ui, sans-serif;
          transition: all 0.12s;
          white-space: nowrap;
        }

        .td-btn-ghost {
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #334155;
        }

        .td-btn-ghost:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .td-btn-dark {
          background: #1e293b;
          border: 1px solid #1e293b;
          color: #fff;
        }

        .td-btn-dark:hover {
          background: #0f172a;
        }

        /* ── Stat strip ── */
        .td-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #e2e8f0;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
        }

        .td-stat {
          background: #fff;
          padding: 18px 22px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .td-stat-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .td-stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .td-stat-value {
          font-family: 'Geist Mono', monospace;
          font-size: 28px;
          font-weight: 500;
          color: #0f172a;
          line-height: 1;
        }

        .td-stat-sub {
          font-size: 11px;
          color: #cbd5e1;
        }

        /* ── Table card ── */
        .td-table-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
        }

        .td-table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid #f1f5f9;
          gap: 10px;
          flex-wrap: wrap;
        }

        .td-table-title {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .td-count-badge {
          background: #f1f5f9;
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          font-family: 'Geist Mono', monospace;
        }

        .td-table-body {
          padding: 16px 20px;
        }

        /* ── States ── */
        .td-state {
          padding: 32px 20px;
          text-align: center;
          color: #94a3b8;
          font-size: 14px;
        }

        .td-state-icon {
          font-size: 28px;
          margin-bottom: 10px;
          display: block;
          opacity: 0.4;
        }

        .td-error {
          margin: 0 20px 16px;
          padding: 12px 16px;
          border-radius: 10px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 13px;
        }

        .td-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #e2e8f0;
          border-top-color: #1e293b;
          border-radius: 50%;
          animation: td-spin 0.7s linear infinite;
        }

        @keyframes td-spin { to { transform: rotate(360deg); } }
      `}</style>

      <main className="td-root">
        <div className="td-inner">

          {/* ── Header ── */}
          <div className="td-header">
            <div className="td-header-left">
              <div className="td-avatar">{initials}</div>
              <div className="td-title-group">
                <h2>Technician Dashboard</h2>
                <p>Assigned tasks connected to your account</p>
              </div>
            </div>
            <div className="td-header-actions">
              <button
                className="td-btn td-btn-ghost"
                onClick={() => navigate("/notifications")}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2a5 5 0 0 1 5 5v2l1 2H2l1-2V7a5 5 0 0 1 5-5Z"/>
                  <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
                </svg>
                Notifications
              </button>
              <button
                className="td-btn td-btn-dark"
                onClick={onLogout}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3"/>
                  <polyline points="11 11 14 8 11 5"/>
                  <line x1="14" y1="8" x2="6" y2="8"/>
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* ── Stat strip ── */}
          <div className="td-stats">
            <div className="td-stat">
              <span className="td-stat-label">Total assigned</span>
              <span className="td-stat-value">{tickets.length}</span>
              <span className="td-stat-sub">all tickets</span>
            </div>
            <div className="td-stat">
              <span className="td-stat-label">
                <span className="td-stat-dot" style={{ background: "#3b82f6" }} />
                In progress
              </span>
              <span className="td-stat-value">{inProgress}</span>
            </div>
            <div className="td-stat">
              <span className="td-stat-label">
                <span className="td-stat-dot" style={{ background: "#10b981" }} />
                Resolved
              </span>
              <span className="td-stat-value">{resolved}</span>
            </div>
          </div>

          {/* ── Table card ── */}
          <div className="td-table-card">
            <div className="td-table-header">
              <span className="td-table-title">
                My Tickets
                {!loading && (
                  <span className="td-count-badge">{tickets.length}</span>
                )}
              </span>
              {loading && <span className="td-spinner" />}
            </div>

            {error && (
              <div className="td-error">{String(error)}</div>
            )}

            {!loading && !error && tickets.length === 0 ? (
              <div className="td-state">
                <span className="td-state-icon">📋</span>
                No assigned tickets right now.
              </div>
            ) : (
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
                onCommentDraft={(ticketId, value) =>
                  setCommentDrafts((p) => ({ ...p, [ticketId]: value }))
                }
                onCommentPost={async (ticketId) => {
                  await ticketService.addComment(
                    ticketId,
                    commentDrafts[ticketId] || ""
                  );
                  setCommentDrafts((p) => ({ ...p, [ticketId]: "" }));
                  await loadTickets();
                }}
                onCommentEdit={async (comment) => {
                  const next = await promptPopup({
                    title: "Edit comment",
                    inputValue: comment.content || "",
                    inputPlaceholder: "Update your comment",
                    confirmButtonText: "Save changes",
                    cancelButtonText: "Cancel",
                  });
                  if (next !== null) {
                    await ticketService.updateComment(comment.id, next);
                    await loadTickets();
                  }
                }}
                onCommentDelete={async (commentId) => {
                  const confirmed = await confirmPopup({
                    title: "Delete this comment?",
                    text: "This action cannot be undone.",
                    confirmButtonText: "Yes, delete",
                    cancelButtonText: "Cancel",
                    icon: "warning",
                  });
                  if (confirmed) {
                    await ticketService.deleteComment(commentId);
                    await loadTickets();
                  }
                }}
              />
            )}
          </div>

        </div>
      </main>
    </>
  );
}