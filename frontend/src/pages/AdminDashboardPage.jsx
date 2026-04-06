import { useEffect, useState } from "react";
import ResourceLayout from "../components/resource/ResourceLayout.jsx";
import ResourceStats from "../components/resource/ResourceStats.jsx";
import ResourceChart from "../components/resource/ResourceChart.jsx";
import { resourceService } from "../services/resourceService.js";
import { apiClient } from "../api/apiClient.js";
import AppLoader from "../components/common/AppLoader.jsx";

export default function AdminDashboardPage({ onLogout, user }) {
  const [items, setItems] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    pictureUrl: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoadingDashboard(true);
      try {
        const data = await resourceService.list({});
        setItems(data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoadingDashboard(false);
      }
    };
    load();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    setCreateSuccess("");

    try {
      await apiClient.post("/auth/admin/users", newUser);
      setCreateSuccess("User created successfully.");
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "USER",
        pictureUrl: "",
      });
    } catch (err) {
      const msg =
        err.response?.data ||
        err.message ||
        "Failed to create user. Please try again.";
      setCreateError(msg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <ResourceLayout onLogout={onLogout} user={user}>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <h2 style={{ marginBottom: 6 }}>Admin Dashboard</h2>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Overview of campus resources, user management, and quick access to modules.
          </p>
        </div>

        {loadingDashboard ? (
          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <AppLoader label="Loading dashboard..." variant="inline" />
          </div>
        ) : (
          <>
            <ResourceStats items={items} />
            <ResourceChart items={items} />
          </>
        )}

        <section className="card" style={{ padding: 20 }}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Create User</h3>
          <p style={{ marginTop: 0, marginBottom: 16, color: "var(--muted)" }}>
            Add staff or students to the system. Only admins can perform this action.
          </p>

          {createError && (
            <div style={{ marginBottom: 10, color: "#b71c1c", fontWeight: 500 }}>
              {String(createError)}
            </div>
          )}
          {createSuccess && (
            <div style={{ marginBottom: 10, color: "#1b5e20", fontWeight: 500 }}>
              {createSuccess}
            </div>
          )}

          <form
            onSubmit={handleCreateUser}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}
          >
            <div>
              <label style={{ display: "block", marginBottom: 4 }}>Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4 }}>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4 }}>Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4 }}>Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                required
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
                <option value="LECTURER">LECTURER</option>
                <option value="STUDENT">STUDENT</option>
                <option value="STAFF">STAFF</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4 }}>Picture URL (optional)</label>
              <input
                type="url"
                value={newUser.pictureUrl}
                onChange={(e) => setNewUser({ ...newUser, pictureUrl: e.target.value })}
              />
            </div>

            <div style={{ alignSelf: "end" }}>
              <button type="submit" disabled={creating}>
                {creating ? (
                  <AppLoader label="Creating..." variant="button" />
                ) : (
                  "Create User"
                )}
              </button>
            </div>
          </form>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
            marginTop: 10,
          }}
        >
          <a href="/resources" className="card quickLink">
            <h3 style={{ marginBottom: 4 }}>Manage Resources</h3>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Add, update, and organize campus facilities and equipment.
            </p>
          </a>

          <a href="/bookings" className="card quickLink">
            <h3 style={{ marginBottom: 4 }}>Bookings</h3>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              View and control room and lab reservations.
            </p>
          </a>

          <a href="/tickets" className="card quickLink">
            <h3 style={{ marginBottom: 4 }}>IT Tickets</h3>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Track and resolve support requests from staff and students.
            </p>
          </a>

          <a href="/notifications" className="card quickLink">
            <h3 style={{ marginBottom: 4 }}>Notifications</h3>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Send announcements and alerts across the campus.
            </p>
          </a>

          <a href="/settings" className="card quickLink">
            <h3 style={{ marginBottom: 4 }}>System Settings</h3>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Configure system preferences and integrations.
            </p>
          </a>
        </div>
      </div>
    </ResourceLayout>
  );
}

