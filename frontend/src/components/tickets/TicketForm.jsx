import { useState } from "react";

function formatResourceOption(resource) {
  if (!resource) return "";
  const name = String(resource.name || "").trim();
  const location = String(resource.location || "").trim();
  if (name && location) return `${name} - ${location}`;
  return name || location || "";
}

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
          (f) =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified
        );
        if (!exists) merged.push(file);
      }
      return { ...prev, images: merged.slice(0, 3) };
    });
    e.target.value = "";
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
    <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
      <select
        className="input"
        value={form.resourceLocation}
        onChange={(e) => setForm((p) => ({ ...p, resourceLocation: e.target.value }))}
        required
      >
        <option value="">Select resource / location</option>
        {resources.map((resource) => {
          const label = formatResourceOption(resource);
          return label ? (
            <option key={resource.id} value={label}>
              {label}
            </option>
          ) : null;
        })}
      </select>
      <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} required />
      <textarea className="input" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
      <select className="input" value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
        <option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option><option value="CRITICAL">CRITICAL</option>
      </select>
      <input className="input" placeholder="Preferred contact details" value={form.preferredContact} onChange={(e) => setForm((p) => ({ ...p, preferredContact: e.target.value }))} required />
      <input
        className="input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelection}
      />
      <small style={{ color: "var(--text-muted)" }}>
        Up to 3 images. Selected: {form.images.length}/3
      </small>
      <button className="btnPrimary" type="submit">Create Ticket</button>
    </form>
  );
}
