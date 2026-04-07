import { useState } from "react";
import "../styles/Cases.css";

interface Case {
  id: number;
  title: string;
  description: string;
  status: "Open" | "Investigating" | "Resolved";
  priority: "Low" | "Medium" | "High";
  camera: string;
  created: string;
  notes: string[];
}

export default function Cases() {

  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    camera: "Camera 1",
    priority: "Medium"
  });

  const createCase = () => {

    if (!form.title) return;

    const newCase: Case = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      camera: form.camera,
      priority: form.priority as any,
      status: "Open",
      created: new Date().toLocaleString(),
      notes: []
    };

    setCases(prev => [newCase, ...prev]);
    setForm({ title: "", description: "", camera: "Camera 1", priority: "Medium" });

  };

  const updateStatus = (id: number, status: Case["status"]) => {

    setCases(prev =>
      prev.map(c => (c.id === id ? { ...c, status } : c))
    );

  };

  const addNote = (note: string) => {

    if (!selectedCase || !note) return;

    const updated = {
      ...selectedCase,
      notes: [...selectedCase.notes, note]
    };

    setSelectedCase(updated);

    setCases(prev =>
      prev.map(c => (c.id === selectedCase.id ? updated : c))
    );

  };

  return (

    <div className="cases">

      <h1>Case Management</h1>

      <div className="cases-grid">

        {/* CREATE CASE PANEL */}
        <div className="card create-case">

          <h3>Create Case</h3>

          <input
            placeholder="Case title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <select
            value={form.camera}
            onChange={e => setForm({ ...form, camera: e.target.value })}
          >
            <option>Camera 1</option>
            <option>Camera 2</option>
            <option>Camera 3</option>
          </select>

          <select
            value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button onClick={createCase}>Create Case</button>

        </div>

        {/* CASE LIST */}
        <div className="card case-list">

          <h3>Active Cases</h3>

          <div className="case-items">

            {cases.map(c => (

              <div
                key={c.id}
                className={`case-item priority-${c.priority}`}
                onClick={() => setSelectedCase(c)}
              >

                <div className="case-title">{c.title}</div>

                <div className="case-meta">

                  <span>{c.camera}</span>
                  <span>{c.status}</span>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* CASE DETAILS */}
        <div className="card case-details">

          {!selectedCase && <p>Select a case to view details</p>}

          {selectedCase && (

            <>
              <h3>{selectedCase.title}</h3>

              <p className="description">
                {selectedCase.description}
              </p>

              <div className="case-info">

                <span>Camera: {selectedCase.camera}</span>
                <span>Priority: {selectedCase.priority}</span>
                <span>Status: {selectedCase.status}</span>

              </div>

              <div className="status-controls">

                <button
                  onClick={() =>
                    updateStatus(selectedCase.id, "Investigating")
                  }
                >
                  Investigate
                </button>

                <button
                  onClick={() =>
                    updateStatus(selectedCase.id, "Resolved")
                  }
                >
                  Resolve
                </button>

              </div>

              <NotesPanel caseData={selectedCase} addNote={addNote} />

            </>
          )}

        </div>

      </div>

    </div>

  );
}

/* NOTES PANEL */

function NotesPanel({ caseData, addNote }: any) {

  const [note, setNote] = useState("");

  return (

    <div className="notes">

      <h4>Investigation Notes</h4>

      <div className="note-list">

        {caseData.notes.map((n: string, i: number) => (
          <div key={i} className="note">
            {n}
          </div>
        ))}

      </div>

      <div className="note-input">

        <input
          placeholder="Add note..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        <button
          onClick={() => {
            addNote(note);
            setNote("");
          }}
        >
          Add
        </button>

      </div>

    </div>

  );

}