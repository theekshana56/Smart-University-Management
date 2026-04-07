import "./table.css";
import { useState } from "react";
import { resourceService } from "../../services/resourceService";
import ResourceCard from "./ResourceCard";

const TYPE_CONFIG = {
  LAB:          { icon: "🔬", label: "Lab",          cls: "lab" },
  LECTURE_HALL: { icon: "🏛️", label: "Lecture Hall", cls: "lecture_hall" },
  MEETING_ROOM: { icon: "🤝", label: "Meeting Room", cls: "meeting_room" },
  EQUIPMENT:    { icon: "📷", label: "Equipment",    cls: "equipment" },
};

export default function ResourceList({ items, filters, setFilters, onEdit, onDelete }) {

  const [selected, setSelected] = useState([]);
  const [view, setView] = useState("table");
  const [selectedResource, setSelectedResource] = useState(null);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkDelete = async () => {
    if (!confirm("Delete selected resources?")) return;
    for (let id of selected) {
      await resourceService.remove(id);
    }
    setSelected([]);
    window.location.reload();
  };

  const downloadReport = async () => {
    try {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.minCap) params.minCap = Number(filters.minCap);
      if (filters.location) params.location = filters.location;

      const blob = await resourceService.downloadReportPdf(params);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "resources_report.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.log(e);
      alert("PDF download failed");
    }
  };

  const getStatus = (r) => {
    if (r.status === "INACTIVE") return { text: "INACTIVE", class: "bad" };
    if (r.status === "OUT_OF_SERVICE") return { text: "OUT", class: "bad" };
    if (r.availabilityWindows === "MAINTENANCE") return { text: "MAINTENANCE", class: "warn" };
    return { text: "READY", class: "ok" };
  };

  const getTypePill = (type) => {
    const cfg = TYPE_CONFIG[type] || { icon: "📦", label: type, cls: "lab" };
    return (
      <span className={`typePill ${cfg.cls}`}>
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  return (
    <div className="card">

      <div className="topRow">
        <input
          className="input"
          placeholder="Search..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />

        <button
          className="btnGhost"
          onClick={() => setView("table")}
          style={view === "table" ? { borderColor: "var(--accent)", color: "var(--accent)" } : {}}
        >
          Table
        </button>
        <button
          className="btnGhost"
          onClick={() => setView("grid")}
          style={view === "grid" ? { borderColor: "var(--accent)", color: "var(--accent)" } : {}}
        >
          Grid
        </button>

        <button className="btnGhost" onClick={downloadReport}>⬇ PDF</button>

        {selected.length > 0 && (
          <button className="btnMini danger" onClick={bulkDelete}>
            🗑 Delete ({selected.length})
          </button>
        )}
      </div>

      {/* TABLE VIEW */}
      {view === "table" && (
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="muted">No resources found</td>
                </tr>
              ) : (
                items.map((r) => {
                  const status = getStatus(r);

                  return (
                    <tr key={r.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(r.id)}
                          onChange={() => toggleSelect(r.id)}
                        />
                      </td>

                      <td
                        style={{ cursor: "pointer", fontWeight: "600" }}
                        onClick={() => setSelectedResource(r)}
                      >
                        {r.name}
                      </td>

                      <td>{getTypePill(r.type)}</td>

                      <td>
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>
                          {r.capacity ?? "—"}
                        </span>
                      </td>

                      <td style={{ fontSize: "13px", color: "var(--muted)" }}>
                        📍 {r.location || "—"}
                      </td>

                      <td>
                        <span className={`pill ${status.class}`}>
                          {status.text}
                        </span>
                      </td>

                      <td>
                        <div className="actions">
                          <button className="btnMini" onClick={() => onEdit(r)}>Edit</button>
                          <button className="btnMini danger" onClick={() => onDelete(r.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* GRID VIEW */}
      {view === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {items.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              onClick={() => setSelectedResource(r)}
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedResource && (
        <div className="modal">
          <div className="modalContent">
            <div style={{ marginBottom: "12px" }}>
              {getTypePill(selectedResource.type)}
            </div>

            <h3 style={{ margin: "0 0 12px" }}>{selectedResource.name}</h3>

            <p><b>Capacity:</b> 👥 {selectedResource.capacity}</p>
            <p><b>Location:</b> 📍 {selectedResource.location}</p>
            <p><b>Status:</b> {selectedResource.status}</p>
            <p><b>Availability:</b> {selectedResource.availabilityWindows}</p>

            {selectedResource.availabilityWindows !== "AVAILABLE" && (
              <p style={{ color: "red", fontWeight: "600" }}>
                ⚠️ This resource is currently NOT AVAILABLE
              </p>
            )}

            <button className="btnPrimary" onClick={() => setSelectedResource(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}