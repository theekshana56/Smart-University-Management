import { useEffect, useState } from "react";
import ResourceLayout from "../components/resource/ResourceLayout.jsx";
import AppLoader from "../components/common/AppLoader.jsx";
import { adminUserService } from "../services/adminUserService.js";
import "../components/resource/table.css";

const emptyForm = {
  name: "",
  email: "",
  role: "USER",
  pictureUrl: "",
  password: "",
};

export default function ManageUsersPage({ onLogout, user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getErrorMessage = (err, fallback) => {
    const status = err?.response?.status;
    if (status === 401) return "Session expired. Please log in again.";
    if (status === 403) return "Forbidden: Admin access is required.";
    if (status === 404 || status === 405) {
      return "User management API not available on running backend. Restart backend server.";
    }

    const payload = err?.response?.data;
    if (typeof payload === "string") return payload;
    if (payload?.message) return String(payload.message);
    if (payload?.error) return String(payload.error);
    return fallback;
  };

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminUserService.list();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load users."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        pictureUrl: form.pictureUrl,
        password: form.password,
      };

      if (editingId) {
        await adminUserService.update(editingId, payload);
        setSuccess("User updated successfully.");
      } else {
        if (!form.password) {
          setError("Password is required when creating a new user.");
          setSaving(false);
          return;
        }
        await adminUserService.create(payload);
        setSuccess("User created successfully.");
      }

      resetForm();
      await loadUsers();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save user."));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (targetUser) => {
    setEditingId(targetUser.id);
    setForm({
      name: targetUser.name || "",
      email: targetUser.email || "",
      role: targetUser.role || "USER",
      pictureUrl: targetUser.pictureUrl || "",
      password: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      setError("");
      setSuccess("");
      await adminUserService.remove(id);
      if (editingId === id) resetForm();
      setSuccess("User deleted successfully.");
      await loadUsers();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete user."));
    }
  };

  return (
    <ResourceLayout onLogout={onLogout} user={user}>
      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 6 }}>Manage Users</h2>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Create, update, and remove system users. This section is available to admins only.
          </p>
        </div>

        <form className="card" onSubmit={handleSubmit}>
          {error ? (
            <div style={{ marginBottom: 12, color: "#b71c1c", fontWeight: 600 }}>{String(error)}</div>
          ) : null}
          {success ? (
            <div style={{ marginBottom: 12, color: "#1b5e20", fontWeight: 600 }}>{success}</div>
          ) : null}

          <div className="grid2">
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Role</label>
              <select
                className="input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
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
              <label className="label">
                Password {editingId ? "(leave blank to keep current)" : ""}
              </label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editingId}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="label">Picture URL (optional)</label>
              <input
                className="input"
                value={form.pictureUrl}
                onChange={(e) => setForm({ ...form, pictureUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="row">
            <button className="btnPrimary" type="submit" disabled={saving}>
              {saving
                ? <AppLoader label="Saving..." variant="button" />
                : editingId ? "Update User" : "Create User"}
            </button>
            {editingId ? (
              <button className="btnGhost" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>System Users</h3>
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="muted">
                      <AppLoader label="Loading users..." variant="table" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="muted">No users found.</td>
                  </tr>
                ) : (
                  users.map((rowUser) => (
                    <tr key={rowUser.id}>
                      <td>{rowUser.id}</td>
                      <td>{rowUser.name}</td>
                      <td>{rowUser.email}</td>
                      <td>{rowUser.role}</td>
                      <td className="actions">
                        <button type="button" className="btnMini" onClick={() => startEdit(rowUser)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btnMini danger"
                          onClick={() => handleDelete(rowUser.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ResourceLayout>
  );
}
