import { useEffect, useState } from "react";
import ResourceLayout from "../components/resource/ResourceLayout.jsx";
import ResourceForm from "../components/resource/ResourceForm.jsx";
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

export default function ResourcesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [filters, setFilters] = useState({
    q: "",
    type: "",
    status: "",
    minCap: "",
    location: "",
  });

  const load = async () => {
    const params = {};
    if (filters.q) params.q = filters.q;
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.minCap) params.minCap = Number(filters.minCap);
    if (filters.location) params.location = filters.location;

    const data = await resourceService.list(params);
    setItems(data);
  };

  useEffect(() => {
    load();
  }, [filters.q, filters.type, filters.status, filters.minCap, filters.location]);

  const submit = async (e) => {
    e.preventDefault();

    const payload = { ...form, capacity: Number(form.capacity) };

    if (editingId) {
      await resourceService.update(editingId, payload);
    } else {
      await resourceService.create(payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    load();
  };

  const edit = (r) => {
    setEditingId(r.id);
    setForm({
      name: r.name,
      type: r.type,
      capacity: r.capacity,
      location: r.location,
      status: r.status,
      availabilityWindows: r.availabilityWindows || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this resource?")) return;
    await resourceService.remove(id);
    load();
  };

  return (
    <ResourceLayout>

      <ResourceStats items={items} />
      <ResourceChart items={items} />

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 360px" }}>
          <h2 style={{ margin: 0 }}>Resources</h2>
          <p style={{ marginTop: 6, color: "var(--muted)" }}>
            Add / update / delete and filter campus resources.
          </p>

          <ResourceForm
            form={form}
            setForm={setForm}
            onSubmit={submit}
            editingId={editingId}
            onCancel={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          />
        </div>

        <div style={{ flex: "2 1 600px" }}>
          <ResourceList
            items={items}
            filters={filters}
            setFilters={setFilters}
            onEdit={edit}
            onDelete={remove}
          />
        </div>
      </div>
    </ResourceLayout>
  );
}