import { useEffect, useState } from "react";
import ResourceLayout from "../components/resource/ResourceLayout";
import { notificationService } from "../services/notificationService";

export default function NotificationsPage({ onLogout, user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preferences, setPreferences] = useState({
    bookingUpdates: true,
    ticketStatusChanges: true,
    ticketComments: true,
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [data, prefData] = await Promise.all([
        notificationService.list(),
        notificationService.getPreferences(),
      ]);
      setItems(Array.isArray(data) ? data : []);
      setPreferences({
        bookingUpdates: Boolean(prefData?.bookingUpdates),
        ticketStatusChanges: Boolean(prefData?.ticketStatusChanges),
        ticketComments: Boolean(prefData?.ticketComments),
      });
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

  const updatePreference = async (key) => {
    const next = { ...preferences, [key]: !preferences[key] };
    setPreferences(next);
    setSavingPrefs(true);
    try {
      const saved = await notificationService.updatePreferences(next);
      setPreferences({
        bookingUpdates: Boolean(saved?.bookingUpdates),
        ticketStatusChanges: Boolean(saved?.ticketStatusChanges),
        ticketComments: Boolean(saved?.ticketComments),
      });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || "Failed to update preferences");
      setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    } finally {
      setSavingPrefs(false);
    }
  };

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
        <div className="card" style={{ marginBottom: 12 }}>
          <h3 style={{ marginBottom: 10 }}>Notification Preferences</h3>
          <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
            {[
              { key: "bookingUpdates", label: "Booking approval/rejection" },
              { key: "ticketStatusChanges", label: "Ticket status changes" },
              { key: "ticketComments", label: "New comments on your tickets" },
            ].map((pref) => (
              <label
                key={pref.key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "18px 1fr",
                  alignItems: "start",
                  columnGap: 10,
                  justifyItems: "start",
                  cursor: "pointer",
                  lineHeight: 1.3,
                }}
              >
                <input
                  type="checkbox"
                  checked={preferences[pref.key]}
                  onChange={() => updatePreference(pref.key)}
                  disabled={savingPrefs}
                  style={{ marginTop: 2 }}
                />
                <span>{pref.label}</span>
              </label>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
            {savingPrefs ? "Saving preferences..." : "Changes apply immediately."}
          </p>
        </div>

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
