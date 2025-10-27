// client/src/App.jsx
import { useEffect, useState } from "react";
import api from "./api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const { data } = await api.get("/tasks");
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await api.post("/tasks", { title });
      setTitle("");
      fetchTasks();
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = async (task) => {
    await api.put(`/tasks/${task._id}`, { done: !task.done });
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    await api.put(`/tasks/${editingId}`, { title });
    setEditingId(null);
    setTitle("");
    fetchTasks();
  };

  const removeTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Tasks (MERN CRUD)</h1>

      <form onSubmit={editingId ? saveEdit : createTask} style={{ marginBottom: 16 }}>
        <input
          placeholder="Task title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 8, width: "70%", marginRight: 8 }}
        />
        <button disabled={loading}>
          {editingId ? "Save" : "Add"}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setTitle(""); }} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        )}
      </form>

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {tasks.map((t) => (
          <li key={t._id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={!!t.done}
              onChange={() => toggleDone(t)}
              style={{ marginRight: 8 }}
            />
            <span style={{ flex: 1, textDecoration: t.done ? "line-through" : "none" }}>
              {t.title}
            </span>
            <button onClick={() => startEdit(t)} style={{ marginRight: 8 }}>Edit</button>
            <button onClick={() => removeTask(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
