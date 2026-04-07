import { useState } from "react";
import ResourceLayout from "../components/resource/ResourceLayout.jsx";
import { profileService } from "../services/profileService.js";
import "../components/resource/table.css";

export default function ProfilePage({ onLogout, user, onProfileUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [pictureUrl, setPictureUrl] = useState(user?.pictureUrl || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getErrorMessage = (err) => {
    const payload = err?.response?.data;
    if (typeof payload === "string") return payload;
    if (payload?.message) return String(payload.message);
    if (payload?.error) return String(payload.error);
    return "Failed to update profile.";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedUser = await profileService.updateProfile({
        name,
        pictureUrl,
      });
      onProfileUpdate(updatedUser);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ResourceLayout onLogout={onLogout} user={user}>
      <div className="card" style={{ maxWidth: 720 }}>
        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Edit Profile</h2>
        <p style={{ marginTop: 0, color: "var(--muted)" }}>
          Update your personal details. Email and role are managed by the system.
        </p>

        {error ? (
          <div style={{ color: "#b42318", marginBottom: 10, fontWeight: 600 }}>{String(error)}</div>
        ) : null}
        {success ? (
          <div style={{ color: "#027a48", marginBottom: 10, fontWeight: 600 }}>{success}</div>
        ) : null}

        <form onSubmit={onSubmit}>
          <div className="grid2">
            <div>
              <label className="label">Full Name</label>
              <input
                className="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={user?.email || ""} disabled />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="label">Profile Picture URL</label>
              <input
                className="input"
                type="url"
                value={pictureUrl}
                onChange={(e) => setPictureUrl(e.target.value)}
                placeholder="https://example.com/profile.jpg"
              />
            </div>
          </div>

          <div className="row">
            <button className="btnPrimary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </ResourceLayout>
  );
}
