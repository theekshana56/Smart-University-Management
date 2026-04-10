import { useEffect, useState } from "react";
import ResourceLayout from "../components/resource/ResourceLayout.jsx";
import ResourceList from "../components/resource/ResourceList.jsx";
import { resourceService } from "../services/resourceService.js";
import ResourceStats from "../components/resource/ResourceStats.jsx";
import ResourceChart from "../components/resource/ResourceChart.jsx";

const emptyForm = {
  name: "",
  type: "LAB",
  capacity: 0,
  location: "",
  status: "ACTIVE",
  availabilityWindows: "AVAILABLE",
};

export default function ResourcesPage({ onLogout, user }) {
  const canManageResources = String(user?.role || "").toUpperCase() === "ADMIN";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    q: "",
    type: "",
    status: "",
    minCap: "",
    location: "",
  });

  const load = async () => {
    setLoading(true);
    const params = {};
    if (filters.q) params.q = filters.q;
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.minCap) params.minCap = Number(filters.minCap);
    if (filters.location) params.location = filters.location;

    try {
      const data = await resourceService.list(params);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.q, filters.type, filters.status, filters.minCap, filters.location]);

  const submit = async (form, editingId, closeModal) => {
    if (form.status === "ACTIVE" && form.availabilityWindows !== "AVAILABLE") {
      alert("Conflict: Active resource must be AVAILABLE");
      return;
    }

    const payload = {
      ...form,
      capacity: Number(form.capacity),
    };

    try {
      if (editingId) {
        await resourceService.update(editingId, payload);
      } else {
        await resourceService.create(payload);
      }
      closeModal();
      load();
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Could not save resource.";
      alert(msg);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this resource?")) return;
    await resourceService.remove(id);
    load();
  };

  return (
    <ResourceLayout onLogout={onLogout} user={user}>
      <ResourceStats items={items} />
      <ResourceChart items={items} />

      <ResourceList
        items={items}
        loading={loading}
        canManageResources={canManageResources}
        filters={filters}
        setFilters={setFilters}
        onDelete={remove}
        onSubmit={submit}
      />
    </ResourceLayout>
  );
}