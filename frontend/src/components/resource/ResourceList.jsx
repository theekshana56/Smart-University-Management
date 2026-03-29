import "./table.css";
import { useState } from "react";
import { resourceService } from "../../services/resourceService";

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

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

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

  // ✅ SMART STATUS FUNCTION
  const getStatus = (r) => {
    if (r.status === "INACTIVE") return { text: "INACTIVE", class: "bad" };
    if (r.status === "OUT_OF_SERVICE") return { text: "OUT", class: "bad" };
    if (r.availabilityWindows === "MAINTENANCE") return { text: "MAINTENANCE", class: "warn" };
    return { text: "READY", class: "ok" };
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

        <button className="btnGhost" onClick={() => setView("table")}>Table</button>
        <button className="btnGhost" onClick={() => setView("grid")}>Grid</button>

        <button className="btnGhost" onClick={downloadReport}>Download PDF</button>

        {selected.length > 0 && (
          <button className="btnMini danger" onClick={bulkDelete}>
            Delete Selected ({selected.length})
          </button>
        )}
      </div>

      {/* TABLE VIEW */}
      {view === "table" && (
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" className="muted">No data</td>
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

                    <td>{r.type}</td>

                    <td>
                      <span className={`pill ${status.class}`}>
                        {status.text}
                      </span>
                    </td>

                    <td>
                      <button className="btnMini" onClick={() => onEdit(r)}>Edit</button>
                      <button className="btnMini danger" onClick={() => onDelete(r.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      {/* GRID VIEW */}
      {view === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {items.map((r) => {
            const status = getStatus(r);

            return (
              <div
                className="card"
                key={r.id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedResource(r)}
              >
                <h4>{r.name}</h4>
                <p>{r.type}</p>

                <span className={`pill ${status.class}`}>
                  {status.text}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {selectedResource && (
        <div className="modal">
          <div className="modalContent">
            <h3>{selectedResource.name}</h3>

            <p><b>Type:</b> {selectedResource.type}</p>
            <p><b>Capacity:</b> {selectedResource.capacity}</p>
            <p><b>Location:</b> {selectedResource.location}</p>
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