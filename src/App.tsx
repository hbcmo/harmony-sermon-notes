import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'JKa1!j2R3#m41998';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPastModal, setShowPastModal] = useState(false);

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
      date: '18 January',
    },
  ]);

  const [logo, setLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('church-logo');
    }
    return null;
  });

  const liveSermon = sermons.find((s) => s.live);
  const [selectedSermon, setSelectedSermon] = useState(liveSermon);

  useEffect(() => {
    if (liveSermon) setSelectedSermon(liveSermon);
  }, [liveSermon]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const setLive = (id: number) => {
    setSermons(sermons.map((s) => ({ ...s, live: s.id === id })));
    setSelectedSermon(sermons.find((s) => s.id === id)!);
  };

  const updateSermon = (id: number, updated: any) => {
    setSermons(sermons.map((s) => (s.id === id ? updated : s)));
    setSelectedSermon(updated);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogo(result);
        localStorage.setItem('church-logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    localStorage.removeItem('church-logo');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with logo */}
      <div className="max-w-2xl mx-auto mb-6 text-center">
        {logo && <img src={logo} alt="Church Logo" className="mx-auto h-20 mb-2" />}
      </div>

      {/* Admin Panel */}
      {isAdmin && (
        <div className="max-w-5xl mx-auto mb-6 bg-white rounded shadow p-4 grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Sermon Library</h3>
              <button
                onClick={() => {
                  const newSermon = {
                    id: sermons.length + 1,
                    title: 'New Sermon',
                    passage: '',
                    mainPoint: '',
                    points: [],
                    questions: [],
                    live: false,
                    date: '',
                  };
                  setSermons([newSermon, ...sermons]);
                  setEditingId(newSermon.id);
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                + New Sermon
              </button>
            </div>

            {sermons.map((s) => (
              <div key={s.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <strong>{s.title || 'Untitled'}</strong>
                  <div className="text-sm text-gray-500">{s.passage || 'No passage yet'}</div>
                  <div className="text-xs text-gray-400">{s.date || 'No date yet'}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(s.id)}
                    className="px-2 py-1 text-sm bg-gray-200 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setLive(s.id)}
                    className={`px-2 py-1 text-sm rounded ${
                      s.live ? 'bg-green-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {s.live ? 'Live' : 'Set Live'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingId && (
            <SermonEditor
              sermon={sermons.find((s) => s.id === editingId)!}
              onSave={(updated) => updateSermon(editingId, updated)}
              onClose={() => setEditingId(null)}
              logo={logo}
              setLogo={setLogo}
              handleLogoUpload={handleLogoUpload}
              removeLogo={removeLogo}
            />
          )}
        </div>
      )}

      {/* Sermon View */}
      {selectedSermon && (
        <SermonView
          sermon={selectedSermon}
          sermons={sermons}
          openPastModal={() => setShowPastModal(true)}
        />
      )}

      {/* Past Sermons Modal */}
      {showPastModal && (
        <PastSermonsModal
          sermons={sermons}
          liveSermonId={liveSermon?.id}
          onClose={() => setShowPastModal(false)}
        />
      )}

      {/* Pastor Login */}
      {!isAdmin && (
        <div className="mt-24 text-center">
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
              <button
                onClick={handleLogin}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Login
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sermon Editor
function SermonEditor({ sermon, onSave, onClose, logo, handleLogoUpload, removeLogo }: any) {
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(sermon)));

  const updatePoint = (index: number, field: string, value: string) => {
    const updated = [...draft.points];
    updated[index] = { ...updated[index], [field]: value };
    setDraft({ ...draft, points: updated });
  };

  const addPoint = () => {
    setDraft({
      ...draft,
      points: [...draft.points, { title: '', verses: '', reveal: '' }],
    });
  };

  const removePoint = (index: number) => {
    setDraft({ ...draft, points: draft.points.filter((_: any, i: number) => i !== index) });
  };

  const updateQuestion = (index: number, value: string) => {
    const updated = [...draft.questions];
    updated[index] = value;
    setDraft({ ...draft, questions: updated });
  };

  const addQuestion = () => {
    setDraft({ ...draft, questions: [...draft.questions, ''] });
  };

  const removeQuestion = (index: number) => {
    setDraft({ ...draft, questions: draft.questions.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="border rounded p-4 overflow-y-auto max-h-[80vh]">
      <h3 className="font-bold mb-2">Edit Sermon</h3>

      <label className="block text-sm font-semibold">Title</label>
      <input
        className="w-full border p-2 mb-2"
        value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
      />

      <label className="block text-sm font-semibold">Passage</label>
      <input
        className="w-full border p-2 mb-2"
        value={draft.passage}
        onChange={(e) => setDraft({ ...draft, passage: e.target.value })}
      />

      <label className="block text-sm font-semibold">Date</label>
      <input
        type="text"
        className="w-full border p-2 mb-2"
        placeholder="e.g., 18 January"
        value={draft.date || ''}
        onChange={(e) => setDraft({ ...draft, date: e.target.value })}
      />

      <label className="block text-sm font-semibold">Main Point</label>
      <textarea
        className="w-full border p-2 mb-4"
        value={draft.mainPoint}
        onChange={(e) => setDraft({ ...draft, mainPoint: e.target.value })}
      />

      <h4 className="font-semibold mb-2">Outline Points</h4>
      <div className="space-y-2">
        {draft.points.map((p: any, i: number) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input
              className="col-span-4 border p-1"
              placeholder="Point title"
              value={p.title}
              onChange={(e) => updatePoint(i, 'title', e.target.value)}
            />
            <input
              className="col-span-4 border p-1"
              placeholder="Verses"
              value={p.verses}
              onChange={(e) => updatePoint(i, 'verses', e.target.value)}
            />
            <input
              className="col-span-3 border p-1"
              placeholder="Reveal word"
              value={p.reveal}
              onChange={(e) => updatePoint(i, 'reveal', e.target.value)}
            />
            <button
              onClick={() => removePoint(i)}
              className="col-span-1 text-red-600 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button onClick={addPoint} className="mt-2 text-sm underline">
        + Add Point
      </button>

      <h4 className="font-semibold mb-2 mt-4">Questions for the Week</h4>
      <div className="space-y-2">
        {draft.questions.map((q: string, i: number) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="flex-1 border p-1"
              placeholder={`Question ${i + 1}`}
              value={q}
              onChange={(e) => updateQuestion(i, e.target.value)}
            />
            <button
              onClick={() => removeQuestion(i)}
              className="text-red-600 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button onClick={addQuestion} className="mt-2 text-sm underline">
        + Add Question
      </button>

      {/* Logo Management */}
      <h4 className="font-semibold mb-2 mt-4">Church Logo</h4>
      {logo ? (
        <div className="flex flex-col items-start gap-2">
          <img src={logo} alt="Church Logo" className="h-20" />
          <div className="flex gap-2">
            <button
              onClick={removeLogo}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <input type="file" accept="image/*" onChange={handleLogoUpload} />
      )}

      <div className="flex gap-2 mt-4">
        <button onClick={() => onSave(draft)} className="bg-black text-white px-4 py-2 rounded">
          Save
        </button>
        <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}

// Sermon View
function SermonView({ sermon, sermons, openPastModal }: any) {
  const [mode, setMode] = useState<'sermon' | 'print' | 'group'>('sermon');
  const storageKey = `harmony-notes-${sermon.id}`;
  const [open, setOpen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes, storageKey]);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleSaveNotes = () => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleTap = (i: number) => {
    setRevealed({ ...revealed, [i]: true });
    setOpen(open === i ? null : i);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6 mb-6">
      {/* Date, Title & Passage */}
      <div className="mb-4 text-center">
        <div className="text-gray-500 mb-1">{sermon.date}</div>
        <h2 className="text-2xl font-bold">{sermon.title}</h2>
        <p className="text-gray-600">{sermon.passage}</p>
      </div>

      {/* Mode Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {['sermon', 'print', 'group'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            className={`px-3 py-1 text-sm rounded ${
              mode === m ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            {m === 'group' ? 'Questions' : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* View Past Sermons Button */}
      <div className="text-center mb-4">
        <button
          onClick={openPastModal}
          className="px-3 py-1 text-sm bg-gray-300 rounded"
        >
          View Past Sermons
        </button>
      </div>

      <div className="text-center mb-6">
        <button
          onClick={handleSaveNotes}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Save Notes
        </button>
        {saveStatus === 'saved' && (
          <div className="mt-2 text-sm text-green-700">Notes saved</div>
        )}
      </div>

      {/* Sermon Mode */}
      {mode === 'sermon' && (
        <>
          <p className="italic mb-4">{sermon.mainPoint}</p>
          {sermon.points.map((p: any, i: number) => (
            <div key={i} className="border rounded-xl p-4 mb-4">
              <button
                onClick={() => handleTap(i)}
                className="w-full text-left font-semibold"
              >
                {i + 1}. {p.title} (
                <span className="font-bold">{revealed[i] ? p.reveal : '______'}</span>) {' '}
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
          ))}
        </>
      )}

      {/* Print Mode */}
{mode === 'print' && (
  <div className="space-y-8">
    {sermon.points.map((p: any, i: number) => (
      <div key={i} className="border-b pb-6">
        {/* Title */}
        <div className="font-semibold">
          {i + 1}. {p.title}{' '}
          <span className="text-sm font-normal">({p.verses})</span>
        </div>

        {/* Reveal / Blank */}
        <div className="mt-3 text-lg">
          {revealed[i] ? (
            <span className="font-bold">{p.reveal}</span>
          ) : (
            <span className="tracking-widest">______________</span>
          )}
        </div>

        {/* Personal Notes */}
        {notes[i] && notes[i].trim() !== '' && (
          <div className="mt-3 whitespace-pre-wrap text-base">
            <strong>Notes:</strong> {notes[i]}
          </div>
        )}
      </div>
    ))}
  </div>
)}

      {/* Questions Mode */}
      {mode === 'group' && (
        <div>
          <h3 className="font-bold mb-4">Questions for the Week</h3>
          <ul className="space-y-3">
            {sermon.questions.map((q: string, i: number) => (
              <li key={i} className="border rounded p-3">
                <strong>Q{i + 1}:</strong> {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Past Sermons Modal
function PastSermonsModal({ sermons, liveSermonId, onClose }: any) {
  const [selected, setSelected] = useState<any>(null);
  const storageKey = selected ? `harmony-notes-${selected.id}` : '';
  const [notes, setNotes] = useState<Record<number, string>>(() => {
    if (selected) {
      try {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  const handleTap = (i: number) => {
    setNotes({ ...notes, [i]: true });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow max-w-3xl w-full max-h-full overflow-y-auto p-4">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold">Past Sermons</h3>
          <button onClick={onClose} className="text-red-600 font-bold">✕</button>
        </div>

        {!selected && (
          <ul className="space-y-2">
            {sermons
              .filter((s: any) => s.id !== liveSermonId)
              .sort((a: any, b: any) => b.id - a.id)
              .map((s: any) => (
                <li
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="border p-2 rounded cursor-pointer hover:bg-gray-100"
                >
                  <div className="text-sm text-gray-500">{s.date}</div>
                  <strong>{s.title}</strong> — <span className="text-gray-500">{s.passage}</span>
                </li>
              ))}
          </ul>
        )}

        {selected && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-gray-500 underline"
              >
                ← Back to list
              </button>
            </div>

            <div className="text-center mb-4">
              <div className="text-gray-500 mb-1">{selected.date}</div>
              <h2 className="text-xl font-bold">{selected.title}</h2>
              <p className="text-gray-600">{selected.passage}</p>
            </div>

            <p className="italic mb-4">{selected.mainPoint}</p>
            {selected.points.map((p: any, i: number) => (
              <div key={i} className="border rounded-xl p-4 mb-4">
                <strong>{i + 1}. {p.title}</strong> ({p.verses}) — Reveal: {p.reveal}
                <textarea
                  className="w-full mt-2 p-2 border rounded"
                  placeholder="Your notes..."
                  value={notes[i] || ''}
                  onChange={(e) => setNotes({ ...notes, [i]: e.target.value })}
                />
              </div>
            ))}

            <h4 className="font-bold mt-4">Questions</h4>
            <ul className="list-disc ml-6">
              {selected.questions.map((q: string, i: number) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
