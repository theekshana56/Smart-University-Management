import { useEffect, useState } from "react";
import ResourceLayout from "../components/resource/ResourceLayout";
import { settingsService } from "../services/settingsService";
import AppLoader from "../components/common/AppLoader.jsx";
import "../components/resource/table.css";
import "./settings.css";

const defaultSettings = {
  campusName: "",
  supportEmail: "",
  timezone: "Asia/Colombo",
  allowPublicSignup: true,
  maintenanceMode: false,
};

export default function SettingsPage({ onLogout, user }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getErrorMessage = (err, fallback) => {
    const status = err?.response?.status;
    if (status === 401) return "Session expired. Please log in again.";
    if (status === 403) return "Forbidden: Admin access is required.";
    if (status === 404) return "Settings API not found. Restart the backend server.";

    const payload = err?.response?.data;
    if (typeof payload === "string") return payload;
    if (payload?.message) return String(payload.message);
    if (payload?.error) return String(payload.error);
    if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
      return String(payload.errors[0]?.defaultMessage || payload.errors[0]?.message || fallback);
    }
    return fallback;
  };

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await settingsService.get();
        setSettings({
          campusName: data?.campusName || "",
          supportEmail: data?.supportEmail || "",
          timezone: data?.timezone || "Asia/Colombo",
          allowPublicSignup: Boolean(data?.allowPublicSignup),
          maintenanceMode: Boolean(data?.maintenanceMode),
        });
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load settings."));
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await settingsService.update(settings);
      setSettings({
        campusName: updated?.campusName || "",
        supportEmail: updated?.supportEmail || "",
        timezone: updated?.timezone || "Asia/Colombo",
        allowPublicSignup: Boolean(updated?.allowPublicSignup),
        maintenanceMode: Boolean(updated?.maintenanceMode),
      });
      setSuccess("System settings updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update settings."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ResourceLayout onLogout={onLogout} user={user}>
      <div className="settingsPageWrap">
        <div className="settingsHeader">
          <h2 className="settingsTitle">System Settings</h2>
          <p className="settingsSubtitle">
            Configure core platform behavior. These settings affect all users.
          </p>
        </div>

        {loading ? (
          <div className="card settingsLoaderCard">
            <AppLoader label="Loading settings..." variant="inline" />
          </div>
        ) : (
          <form className="card settingsFormCard" onSubmit={handleSubmit}>
            {error ? (
              <div className="settingsAlert settingsAlertError">
                {String(error)}
              </div>
            ) : null}
            {success ? (
              <div className="settingsAlert settingsAlertSuccess">
                {success}
              </div>
            ) : null}

            <div className="grid2 settingsGrid">
              <div>
                <label className="label">Campus Name</label>
                <input
                  className="input"
                  value={settings.campusName}
                  onChange={(e) => setSettings({ ...settings, campusName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Support Email</label>
                <input
                  className="input"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Timezone</label>
                <select
                  className="input"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                >
                  <option value="Asia/Colombo">Asia/Colombo</option>
                  <option value="UTC">UTC</option>
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="Asia/Singapore">Asia/Singapore</option>
                </select>
              </div>

              <div className="settingsControlsBlock">
                <label className="label">Access Controls</label>
                <div className="settingsControlList">
                  <label className="settingsControlItem">
                    <input
                      type="checkbox"
                      checked={settings.allowPublicSignup}
                      onChange={(e) =>
                        setSettings({ ...settings, allowPublicSignup: e.target.checked })
                      }
                    />
                    <span>Allow public sign-up</span>
                  </label>
                  <label className="settingsControlItem">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) =>
                        setSettings({ ...settings, maintenanceMode: e.target.checked })
                      }
                    />
                    <span>Maintenance mode</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="row settingsActionRow">
              <button className="btnPrimary" type="submit" disabled={saving}>
                {saving ? <AppLoader label="Saving..." variant="button" /> : "Save Settings"}
              </button>
            </div>
          </form>
        )}
      </div>
    </ResourceLayout>
  );
}
