import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import TicketTable from "../components/tickets/TicketTable";
import { confirmPopup, promptPopup } from "../utils/popup";
import "../components/resource/resource.css";
import "./notifications.css";

export default function TechnicianDashboard({ user }) {
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');

        .td-inner {
          width: 100%;
          display: grid;
          gap: 16px;
          font-family: 'Geist', system-ui, sans-serif;
        }

        .td-pageHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .td-pageHeader .resourcePageTitle {
          margin: 0 0 6px;
          font-size: 1.35rem;
          font-weight: 700;
          color: #0f172a;
        }

        .td-pageHeader .resourcePageSubtitle {
          margin: 0;
          font-size: 14px;
          color: #64748b;
          line-height: 1.4;
        }

        .td-roleBadge {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.12);
          padding: 6px 10px;
          border-radius: 999px;
          flex-shrink: 0;
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

      <div className="td-inner">
          <section className="card resourcePageHeader notificationsHeader td-pageHeader">
            <div>
              <h1 className="resourcePageTitle">Technician Dashboard</h1>
              
            </div>
            <span className="td-roleBadge">{user?.role || "TECHNICIAN"}</span>
          </section>

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
    </>
  );
}