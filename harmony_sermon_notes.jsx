import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'JKa1!j2R3#m41998';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [sermons, setSermons] = useState([
    {
      id: 1,
      title: 'Believing the Word Before Seeing the Work',
      passage: 'John 4:43–54',
      mainPoint:
        'Jesus creates true faith by calling people to trust His Word before they see the result.',
      points: [
        { title: 'Superficial Faith', verses: 'John 4:43–45', reveal: 'EXPOSED' },
        { title: 'Desperate Need', verses: 'John 4:46–47', reveal: 'URGENT' },
        { title: 'A Shallow Faith', verses: 'John 4:48', reveal: 'CONFRONTED' },
        { title: 'Christ’s Authoritative', verses: 'John 4:49–50a', reveal: 'WORD' },
        { title: 'Saving Faith', verses: 'John 4:50b', reveal: 'BELIEVED' },
        { title: 'Faith Power', verses: 'John 4:51–54', reveal: 'CONFIRMED' },
      ],
      questions: [
        'How can we distinguish between genuine and superficial faith in our lives?',
        'How can suffering or trials lead us to a deeper faith in Christ?',
        "What does it mean to trust Jesus' words?",
        "How can we trust in God's timing and sovereignty in difficult situations?",
      ],
      live: true,
    },
  ]);

  const liveSermon = sermons.find((s) => s.live);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const setLive = (id) => {
    setSermons(sermons.map((s) => ({ ...s, live: s.id === id })));
  };

  const updateSermon = (id, updated) => {
    setSermons(sermons.map((s) => (s.id === id ? updated : s)));
  };

    return (
    <div className="min-h-screen bg-gray-100 p-6">
      {isAdmin && (
        <div className="max-w-5xl mx-auto mb-6 bg-white rounded shadow p-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Sermon Library</h3>
            {sermons.map((s) => (
              <div key={s.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <strong>{s.title}</strong>
                  <div className="text-sm text-gray-500">{s.passage}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingId(s.id)} className="px-2 py-1 text-sm bg-gray-200 rounded">Edit</button>
                  <button
                    onClick={() => setLive(s.id)}
                    className={`px-2 py-1 text-sm rounded ${s.live ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                  >
                    {s.live ? 'Live' : 'Set Live'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingId && (
            <SermonEditor
              sermon={sermons.find((s) => s.id === editingId)}
              onSave={(updated) => updateSermon(editingId, updated)}
              onClose={() => setEditingId(null)}
            />
          )}
        </div>
      )}

      {liveSermon && <SermonView sermon={liveSermon} />}

      {!isAdmin && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowLogin(true)}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Pastor Login
          </button>
        </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow max-w-sm w-full">
            <h3 className="font-bold mb-2">Pastor Login</h3>
            <input
              type="password"
              className="w-full border p-2 mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <div className="flex gap-2">
              <button onClick={handleLogin} className="bg-black text-white px-4 py-2 rounded">Login</button>
              <button onClick={() => setShowLogin(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SermonEditor({ sermon, onSave, onClose }) {
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(sermon)));

  const updatePoint = (index, field, value) => {
    const updated = [...draft.points];
    updated[index] = { ...updated[index], [field]: value };
    setDraft({ ...draft, points: updated });
  };

  const addPoint = () => {
    setDraft({ ...draft, points: [...draft.points, { title: '', verses: '', reveal: '' }] });
  };

  const removePoint = (index) => {
    setDraft({ ...draft, points: draft.points.filter((_, i) => i !== index) });
  };

  return (
    <div className="border rounded p-4">
      <h3 className="font-bold mb-2">Edit Sermon</h3>

      <label className="block text-sm font-semibold">Title</label>
      <input className="w-full border p-2 mb-2" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />

      <label className="block text-sm font-semibold">Passage</label>
      <input className="w-full border p-2 mb-2" value={draft.passage} onChange={(e) => setDraft({ ...draft, passage: e.target.value })} />

      <label className="block text-sm font-semibold">Main Point</label>
      <textarea className="w-full border p-2 mb-4" value={draft.mainPoint} onChange={(e) => setDraft({ ...draft, mainPoint: e.target.value })} />

      <h4 className="font-semibold mb-2">Outline Points</h4>
      <div className="space-y-2">
        {draft.points.map((p, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input className="col-span-4 border p-1" placeholder="Point title" value={p.title} onChange={(e) => updatePoint(i, 'title', e.target.value)} />
            <input className="col-span-4 border p-1" placeholder="Verses" value={p.verses} onChange={(e) => updatePoint(i, 'verses', e.target.value)} />
            <input className="col-span-3 border p-1" placeholder="Reveal word" value={p.reveal} onChange={(e) => updatePoint(i, 'reveal', e.target.value)} />
            <button onClick={() => removePoint(i)} className="col-span-1 text-red-600 text-sm">✕</button>
          </div>
        ))}
      </div>

      <button onClick={addPoint} className="mt-2 text-sm underline">+ Add Point</button>

      <div className="flex gap-2 mt-4">
        <button onClick={() => onSave(draft)} className="bg-black text-white px-4 py-2 rounded">Save</button>
        <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
}

function SermonView({ sermon }) {
  const [mode, setMode] = useState('sermon'); // sermon | print | group
  const liveUrl = typeof window !== 'undefined' ? window.location.href : '';
  const storageKey = `harmony-notes-${sermon.id}`;

  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [revealed, setRevealed] = useState({});

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes, storageKey]);

  const handleTap = (i) => {
    setRevealed({ ...revealed, [i]: true });
    setOpen(open === i ? null : i);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">

      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setMode('sermon')} className={`px-3 py-1 text-sm rounded ${mode === 'sermon' ? 'bg-black text-white' : 'bg-gray-200'}`}>Sermon</button>
        <button onClick={() => setMode('print')} className={`px-3 py-1 text-sm rounded ${mode === 'print' ? 'bg-black text-white' : 'bg-gray-200'}`}>Print</button>
        <button onClick={() => setMode('group')} className={`px-3 py-1 text-sm rounded ${mode === 'group' ? 'bg-black text-white' : 'bg-gray-200'}`}>Small Group</button>
      </div>

      {mode !== 'print' && (
      <div className="text-center mb-6">
        <div className="h-16 bg-gray-200 rounded mb-2 flex items-center justify-center">Logo</div>
        <h1 className="text-2xl font-bold">Harmony Baptist Church</h1>
        <h2 className="text-xl mt-2">{sermon.title}</h2>
        <p className="text-sm text-gray-600">{sermon.passage}</p>
      </div>)}

      {mode !== 'group' && <p className="italic mb-4">{sermon.mainPoint}</p>}

      {mode === 'sermon' && ({sermon.mainPoint}</p>

              {sermon.points.map((p, i) => (
        <div key={i} className="border rounded-xl p-4 mb-4">
          <button onClick={() => handleTap(i)} className="w-full text-left font-semibold">
            {i + 1}. {p.title} (<span className="font-bold">{revealed[i] ? p.reveal : '______'}</span>){' '}
            <span className="text-sm text-gray-500">({p.verses})</span>
          </button>

          {open === i && (
            <textarea
              className="w-full mt-2 p-2 border rounded"
              placeholder="Your notes..."
              value={notes[i] || ''}
              onChange={(e) => setNotes({ ...notes, [i]: e.target.value })}
            />
          )}
        </div>
      )        )}
      )}

      {mode === 'print' && (
        <div className="space-y-4">
          {sermon.points.map((p, i) => (
            <div key={i} className="border-b pb-2">
              <strong>{i + 1}. {p.title}</strong> ({p.verses})
              <div className="mt-2 h-12 border"></div>
            </div>
          ))}
        </div>
      )}

      {mode === 'group' && (
        <div>
          <h3 className="font-bold mb-4">Small Group Discussion</h3>
          <ul className="space-y-3">
            {sermon.questions.map((q, i) => (
              <li key={i} className="border rounded p-3">
                <strong>Q{i + 1}:</strong> {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-bold mb-2">Questions for the Week</h3>
        <ul className="list-disc ml-6 text-sm">
          {sermon.questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
