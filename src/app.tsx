import React, { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'JKa1!j2R3#m41998';

type SermonPoint = { title: string; verses: string; reveal: string };
type Sermon = {
  id: number;
  date: string;
  title: string;
  passage: string;
  mainPoint: string;
  points: SermonPoint[];
  questions: string[];
  live: boolean;
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const [sermons, setSermons] = useState<Sermon[]>([
    {
      id: 1,
      date: '18 January',
      title: 'Believing the Word Before Seeing the Work',
      passage: 'John 4:43–54',
      mainPoint: 'Jesus creates true faith by calling people to trust His Word before they see the result.',
      points: [
        { title: 'Superficial Faith', verses: 'John 4:43–45', reveal: 'EXPOSED' },
        { title: 'Desperate Need', verses: 'John 4:46–47', reveal: 'URGENT' },
        { title: 'A Shallow Faith', verses: 'John 4:48', reveal: 'CONFRONTED' },
        { title: 'Christ’s Authoritative', verses: 'John 4:49–50a', reveal: 'WORD' },
        { title: 'Saving Faith', verses: 'John 4:50b', reveal: 'BELIEVED' },
        { title: 'Faith Power', verses: 'John 4:51–54', reveal: 'CONFIRMED' }
      ],
      questions: [
        'How can we distinguish between genuine and superficial faith in our lives?',
        'How can suffering or trials lead us to a deeper faith in Christ?',
        "What does it mean to trust Jesus' words?",
        "How can we trust in God's timing and sovereignty in difficult situations?"
      ],
      live: true
    }
  ]);

  const liveSermon = sermons.find((s) => s.live);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
    } else alert('Incorrect password');
  };

  const setLive = (id: number) => setSermons(sermons.map((s) => ({ ...s, live: s.id === id })));
  const updateSermon = (id: number, updated: Sermon) =>
    setSermons(sermons.map((s) => (s.id === id ? updated : s)));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Harmony Sermon Notes</h1>
      </header>

      {isAdmin && (
        <div className="max-w-5xl mx-auto mb-6 bg-white rounded shadow p-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Sermon Library</h3>
            {sermons
              .slice()
              .sort((a, b) => b.id - a.id)
              .map((s) => (
                <div key={s.id} className="flex justify-between items-center border-b py-2">
                  <div>
                    <strong>{s.title}</strong>
                    <div className="text-sm text-gray-500">
                      {s.passage} - {s.date}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingId(s.id)} className="px-2 py-1 text-sm bg-gray-200 rounded">
                      Edit
                    </button>
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
            <div className="border rounded p-4">
              <h3>Edit Sermon (coming soon)</h3>
              <button onClick={() => setEditingId(null)}>Close</button>
            </div>
          )}
        </div>
      )}

      {liveSermon && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
          <h2 className="font-bold text-xl mb-2">{liveSermon.title}</h2>
          <div className="text-gray-500 mb-4">
            {liveSermon.passage} - {liveSermon.date}
          </div>
          <p className="italic mb-4">{liveSermon.mainPoint}</p>
          <h3 className="font-bold mb-2">Questions</h3>
          <ul className="list-disc ml-6">
            {liveSermon.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}

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
              <button onClick={handleLogin} className="bg-black text-white px-4 py-2 rounded">
                Login
              </button>
              <button onClick={() => setShowLogin(false)} className="bg-gray-200 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
