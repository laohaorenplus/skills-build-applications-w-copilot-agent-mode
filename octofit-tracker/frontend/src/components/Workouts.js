import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  const fetchWorkouts = () => {
    console.log('Workouts: fetching from', apiUrl);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        console.log('Workouts: fetched data', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => {
        console.error('Workouts: fetch error', err);
        setError(err.message);
      });
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => { setForm({ name: '', description: '' }); setShowModal(false); fetchWorkouts(); })
      .catch(err => setError(err.message));
  };

  const handleDelete = (id) => {
    fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
      .then(() => fetchWorkouts())
      .catch(err => setError(err.message));
  };

  return (
    <div className="page-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">&#x1F4AA; Workouts</h2>
        <button className="btn btn-octofit" onClick={() => setShowModal(true)}>+ Add Workout</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr><th>#</th><th>Workout Name</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {workouts.length === 0 && (
              <tr><td colSpan="4" className="text-center text-muted">No workouts found.</td></tr>
            )}
            {workouts.map(workout => (
              <tr key={workout.id}>
                <td>{workout.id}</td>
                <td><strong>{workout.name}</strong></td>
                <td className="text-muted">{workout.description}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(workout.id)}>Delete</button>
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
                <h5 className="modal-title">Add Workout</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAdd}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Workout Name</label>
                    <input className="form-control" placeholder="e.g. Morning Run" required value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea className="form-control" rows="3" placeholder="Describe the workout..." value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-octofit">Save Workout</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workouts;
