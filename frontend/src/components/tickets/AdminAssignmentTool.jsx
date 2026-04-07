import { useMemo, useState } from "react";

export default function AdminAssignmentTool({ ticket, users, onAssign, onReject }) {
  const [technicianId, setTechnicianId] = useState(ticket.assignedTechnicianId || "");
  const technicians = useMemo(
    () => (Array.isArray(users) ? users.filter((u) => u.role === "TECHNICIAN") : []),
    [users]
  );

  const handleAssign = async () => {
    if (!technicianId) return;
    await onAssign(ticket.id, Number(technicianId));
  };

  const handleReject = async () => {
    const reason = window.prompt("Reason for rejection:");
    if (!reason || !reason.trim()) return;
    await onReject(ticket.id, reason.trim());
  };

  if (ticket.status !== "OPEN") return null;

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <select className="input" value={technicianId} onChange={(e) => setTechnicianId(e.target.value)}>
        <option value="">Select technician</option>
        {technicians.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} ({t.email})
          </option>
        ))}
      </select>
      <button type="button" className="btnMini" onClick={handleAssign} disabled={!technicianId}>
        Assign Tech
      </button>
      <button type="button" className="btnMini danger" onClick={handleReject}>
        Admin Reject
      </button>
    </div>
  );
}
