import { useEffect, useState } from "react";
import ResourceLayout from "../components/resource/ResourceLayout";
import { notificationService } from "../services/notificationService";

export default function NotificationsPage({ onLogout, user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await notificationService.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || "Failed to load notifications");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true, isRead: true } : item)));
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || "Failed to mark notification as read");
    }
  };

  const onMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setItems((prev) => prev.map((item) => ({ ...item, read: true, isRead: true })));
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || "Failed to mark all as read");
    }
  };

  const unreadCount = items.filter((item) => !(item.isRead ?? item.read)).length;

  return (
    <ResourceLayout onLogout={onLogout} user={user}>
      <section className="card resourcePageHeader" style={{ width: "100%" }}>
        <div>
          <h1 className="resourcePageTitle">Notifications</h1>
          <p className="resourcePageSubtitle">
            Keep track of booking decisions, ticket updates, and comments.
          </p>
        </div>
        <span className="roleBadge viewer">{user?.role || "USER"}</span>
      </section>

      <section className="card" style={{ width: "100%" }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <strong>Unread: {unreadCount}</strong>
          <button className="btnMini" onClick={onMarkAllRead} disabled={items.length === 0 || unreadCount === 0}>
            Mark all as read
          </button>
        </div>

        {loading ? <p className="muted">Loading notifications...</p> : null}
        {error ? <p className="muted" style={{ color: "#b91c1c" }}>{String(error)}</p> : null}

        {!loading && !error && items.length === 0 ? (
          <p className="muted">No notifications yet.</p>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item) => {
            const isRead = item.isRead ?? item.read;
            return (
              <div
                key={item.id}
                className="card"
                style={{
                  border: isRead ? "1px solid #e5e7eb" : "1px solid #bfdbfe",
                  background: isRead ? "#fff" : "#eff6ff",
                }}
              >
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{item.title}</strong>
                  <span className="muted" style={{ fontSize: 12 }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                  </span>
                </div>
                <p style={{ marginTop: 6, marginBottom: 6 }}>{item.message}</p>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <span className="pill">{item.type}</span>
                  {!isRead ? (
                    <button className="btnMini" onClick={() => onMarkRead(item.id)}>
                      Mark as read
                    </button>
                  ) : (
                    <span className="muted">Read</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </ResourceLayout>
  );
}
