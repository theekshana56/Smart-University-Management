import "./table.css";
import { resourceService } from "../../services/resourceService";

export default function ResourceList({ items, loading, filters, setFilters, onEdit, onDelete }) {

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
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Report download failed. Check backend is running.");
      console.log(e);
    }
  };

  return (
    <div className="card">
      <div className="topRow">
        <div className="searchWrap">
          <input
            className="input"
            placeholder="Search by name..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>

        <select className="input mini" value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="LECTURE_HALL">LECTURE_HALL</option>
          <option value="LAB">LAB</option>
          <option value="MEETING_ROOM">MEETING_ROOM</option>
          <option value="EQUIPMENT">EQUIPMENT</option>
        </select>

        <select className="input mini" value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
        </select>
      </div>

      <div className="topRow">
        <input className="input mini" placeholder="Min capacity"
          value={filters.minCap}
          onChange={(e) => setFilters({ ...filters, minCap: e.target.value })}
        />
        <input className="input" placeholder="Location contains..."
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />

        <button
          className="btnGhost"
          onClick={() => setFilters({ q:"", type:"", status:"", minCap:"", location:"" })}
        >
          Clear
        </button>

        <button className="btnGhost" onClick={downloadReport}>
          Download Report
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Status</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="muted">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="8" className="muted">No resources found.</td></tr>
            ) : (
              items.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.type}</td>
                  <td>{r.capacity}</td>
                  <td>{r.location}</td>
                  <td>
                    <span className={r.status === "ACTIVE" ? "pill ok" : "pill bad"}>
                      {r.status}
                    </span>
                  </td>

                  {/* ✅ show availability */}
                  <td>{r.availabilityWindows}</td>

                  <td className="actions">
                    <button className="btnMini" onClick={() => onEdit(r)}>Edit</button>
                    <button className="btnMini danger" onClick={() => onDelete(r.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}