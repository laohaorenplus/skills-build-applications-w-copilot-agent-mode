import React, { useState, useEffect } from 'react';

const MEDALS = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ team: '', points: '' });

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
  const teamsUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  const fetchEntries = () => {
    console.log('Leaderboard: fetching from', apiUrl);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        console.log('Leaderboard: fetched data', data);
        setEntries(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => {
        console.error('Leaderboard: fetch error', err);
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchEntries();
    fetch(teamsUrl).then(r => r.json()).then(d => setTeams(Array.isArray(d) ? d : d.results || []));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team: parseInt(form.team), points: parseInt(form.points) }),
    })
      .then(res => res.json())
      .then(() => { setForm({ team: '', points: '' }); setShowModal(false); fetchEntries(); })
      .catch(err => setError(err.message));
  };

  const handleDelete = (id) => {
    fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
      .then(() => fetchEntries())
      .catch(err => setError(err.message));
  };

  const sorted = [...entries].sort((a, b) => b.points - a.points);

  return (
    <div className="page-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">&#x1F3C6; Leaderboard</h2>
        <button className="btn btn-octofit" onClick={() => setShowModal(true)}>+ Add Entry</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr><th>Rank</th><th>Team</th><th>Points</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan="4" className="text-center text-muted">No leaderboard entries yet.</td></tr>
            )}
            {sorted.map((entry, index) => (
              <tr key={entry.id}>
                <td><span className="fw-bold">{MEDALS[index] || index + 1}</span></td>
                <td><strong>{entry.team ? (entry.team.name || entry.team) : '—'}</strong></td>
                <td><span className="badge bg-success fs-6">{entry.points} pts</span></td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(entry.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Leaderboard Entry</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAdd}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Team</label>
                    <select className="form-select" required value={form.team}
                      onChange={e => setForm({ ...form, team: e.target.value })}>
                      <option value="">Select Team</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Points</label>
                    <input className="form-control" type="number" min="0" placeholder="Points" required value={form.points}
                      onChange={e => setForm({ ...form, points: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-octofit">Save Entry</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
