import { useState } from "react";

function formatResourceOption(resource) {
  if (!resource) return "";
  const name = String(resource.name || "").trim();
  const location = String(resource.location || "").trim();
  if (name && location) return `${name} - ${location}`;
  return name || location || "";
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  .tf-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    overflow: hidden;
    font-family: 'Inter', system-ui, sans-serif;
  }

  .tf-header {
    background: #1e293b;
    padding: 22px 26px;
  }
  .tf-header-title {
    font-size: 15px;
    font-weight: 600;
    color: #f1f5f9;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .tf-header-sub {
    font-size: 12px;
    color: #64748b;
    margin-top: 4px;
  }

  .tf-body {
    padding: 24px 26px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .tf-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .tf-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 480px) {
    .tf-field-row { grid-template-columns: 1fr; }
  }

  .tf-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .tf-inp {
    width: 100%;
    padding: 10px 13px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13px;
    color: #0f172a;
    font-family: 'Inter', system-ui, sans-serif;
    background: #fff;
    outline: none;
    transition: border 0.15s, box-shadow 0.15s;
    appearance: none;
  }
  .tf-inp:hover { border-color: #cbd5e1; }
  .tf-inp:focus { border-color: #1e293b; box-shadow: 0 0 0 3px rgba(30,41,59,.08); }
  textarea.tf-inp { resize: vertical; min-height: 90px; }

  /* Priority toggle buttons */
  .tf-prio-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
  .tf-prio-btn {
    padding: 8px 6px;
    border-radius: 9px;
    border: 1.5px solid #e2e8f0;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: all 0.12s;
    background: #fff;
    font-family: 'Inter', system-ui, sans-serif;
    color: #94a3b8;
  }
  .tf-prio-btn:hover { border-color: #94a3b8; color: #334155; }
  .tf-prio-LOW.tf-prio-on   { background: #d1fae5; border-color: #6ee7b7; color: #065f46; }
  .tf-prio-MEDIUM.tf-prio-on{ background: #dbeafe; border-color: #93c5fd; color: #1e40af; }
  .tf-prio-HIGH.tf-prio-on  { background: #fef3c7; border-color: #fcd34d; color: #92400e; }
  .tf-prio-CRITICAL.tf-prio-on { background: #fee2e2; border-color: #fca5a5; color: #b91c1c; }

  /* Upload zone */
  .tf-upload-zone {
    border: 1.5px dashed #e2e8f0;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
    position: relative;
  }
  .tf-upload-zone:hover { border-color: #94a3b8; background: #f8fafc; }
  .tf-upload-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  .tf-upload-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #f1f5f9;
    margin: 0 auto 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tf-upload-text { font-size: 12px; color: #64748b; }
  .tf-upload-sub  { font-size: 11px; color: #cbd5e1; margin-top: 3px; }

  /* Image chips */
  .tf-img-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }
  .tf-img-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: #f1f5f9;
    border-radius: 20px;
    font-size: 11px;
    color: #334155;
    font-weight: 500;
  }
  .tf-img-remove {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #cbd5e1;
    border: none;
    cursor: pointer;
    color: #fff;
    font-size: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    line-height: 1;
    font-family: 'Inter', system-ui, sans-serif;
    transition: background 0.12s;
  }
  .tf-img-remove:hover { background: #94a3b8; }

  /* Counter pips */
  .tf-counter {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    font-size: 11px;
    color: #94a3b8;
    margin-top: 6px;
  }
  .tf-pip {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e2e8f0;
    transition: background 0.2s;
  }
  .tf-pip-on { background: #1e293b; }

  .tf-divider { height: 1px; background: #f1f5f9; }

  .tf-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px;
    background: #1e293b;
    color: #fff;
    border: none;
    border-radius: 11px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', system-ui, sans-serif;
    transition: background 0.12s, transform 0.1s;
  }
  .tf-submit:hover { background: #0f172a; }
  .tf-submit:active { transform: scale(0.99); }
`;

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const PRIORITY_LABELS = { LOW: "Low", MEDIUM: "Medium", HIGH: "High", CRITICAL: "Critical" };

export default function TicketForm({ onCreate, resources = [] }) {
  const [form, setForm] = useState({
    resourceLocation: "",
    category: "",
    description: "",
    priority: "MEDIUM",
    preferredContact: "",
    images: [],
  });

  const handleImageSelection = (e) => {
    const selected = Array.from(e.target.files || []);
    setForm((prev) => {
      const merged = [...prev.images];
      for (const file of selected) {
        const exists = merged.some(
          (f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
        );
        if (!exists) merged.push(file);
      }
      return { ...prev, images: merged.slice(0, 3) };
    });
    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    onCreate(form);
    setForm({
      resourceLocation: "",
      category: "",
      description: "",
      priority: "MEDIUM",
      preferredContact: "",
      images: [],
    });
  };

  return (
    <>
      <style>{STYLES}</style>
      <form onSubmit={submit} className="tf-card">

        {/* Header */}
        <div className="tf-header">
          <div className="tf-header-title">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="1" width="12" height="14" rx="2"/>
              <path d="M5 5h6M5 8h6M5 11h4"/>
            </svg>
            Create a new ticket
          </div>
          <div className="tf-header-sub">Fill in the details below to submit a support request</div>
        </div>

        <div className="tf-body">

          {/* Resource / location */}
          <div className="tf-field">
            <label className="tf-label">Resource / location</label>
            <select
              className="tf-inp"
              value={form.resourceLocation}
              onChange={(e) => setForm((p) => ({ ...p, resourceLocation: e.target.value }))}
              required
            >
              <option value="">Select a resource or location</option>
              {resources.map((resource) => {
                const label = formatResourceOption(resource);
                return label ? (
                  <option key={resource.id} value={label}>{label}</option>
                ) : null;
              })}
            </select>
          </div>

          {/* Category + Contact side by side */}
          <div className="tf-field-row">
            <div className="tf-field">
              <label className="tf-label">Category</label>
              <input
                className="tf-inp"
                placeholder="e.g. Hardware, Network…"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                required
              />
            </div>
            <div className="tf-field">
              <label className="tf-label">Preferred contact</label>
              <input
                className="tf-inp"
                placeholder="Email or phone"
                value={form.preferredContact}
                onChange={(e) => setForm((p) => ({ ...p, preferredContact: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="tf-field">
            <label className="tf-label">Description</label>
            <textarea
              className="tf-inp"
              placeholder="Describe the issue in detail…"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </div>

          {/* Priority */}
          <div className="tf-field">
            <label className="tf-label">Priority</label>
            <div className="tf-prio-grid">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`tf-prio-btn tf-prio-${p}${form.priority === p ? " tf-prio-on" : ""}`}
                  onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="tf-field">
            <label className="tf-label">Attachments</label>
            <div className="tf-upload-zone">
              <input
                type="file"
                className="tf-upload-input"
                accept="image/*"
                multiple
                onChange={handleImageSelection}
              />
              <div className="tf-upload-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 11V4M5 6l3-3 3 3"/>
                  <path d="M2 12v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1"/>
                </svg>
              </div>
              <div className="tf-upload-text">Click to upload images</div>
              <div className="tf-upload-sub">PNG, JPG, GIF · up to 3 files</div>
            </div>

            {form.images.length > 0 && (
              <div className="tf-img-chips">
                {form.images.map((file, i) => (
                  <div key={i} className="tf-img-chip">
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="1" width="14" height="14" rx="2"/>
                      <path d="M1 11l4-4 3 3 2-2 5 4"/>
                      <circle cx="11" cy="5" r="1.5"/>
                    </svg>
                    {file.name.length > 22 ? file.name.slice(0, 20) + "…" : file.name}
                    <button
                      type="button"
                      className="tf-img-remove"
                      onClick={() => removeImage(i)}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="tf-counter">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`tf-pip${i < form.images.length ? " tf-pip-on" : ""}`} />
              ))}
              <span style={{ marginLeft: 4 }}>{form.images.length}/3</span>
            </div>
          </div>

          <div className="tf-divider" />

          {/* Submit */}
          <button type="submit" className="tf-submit">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 8h12M9 4l5 4-5 4"/>
            </svg>
            Create ticket
          </button>

        </div>
      </form>
    </>
  );
}