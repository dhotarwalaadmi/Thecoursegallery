'use client';
import { useState, useEffect } from 'react';

export default function AdminCourseRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await fetch('/api/admin/course-requests');
    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);
  };

  const updateStatus = async (id, status) => {
    const res = await fetch('/api/admin/course-requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) fetchRequests();
  };

  const deleteRequest = async (id) => {
    if (!confirm('Delete this course request?')) return;
    const res = await fetch('/api/admin/course-requests', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchRequests();
  };

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <>
      <h1>Course Requests</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'pending', 'noted', 'fulfilled', 'dismissed'].map(f => (
          <button
            key={f}
            className="category-tab"
            style={filter === f ? { background: '#0b2de6', color: 'white', borderColor: '#0b2de6' } : {}}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Course / Trainer Requested</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map(req => (
            <tr key={req.id}>
              <td style={{ fontWeight: '600' }}>{req.name}</td>
              <td>
                <a href={`mailto:${req.email}`} style={{ color: '#0b2de6' }}>{req.email}</a>
              </td>
              <td style={{ maxWidth: '250px' }}>{req.courseName}</td>
              <td style={{ fontSize: '12px' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
              <td>
                <span className={`order-status status-${req.status}`}>{req.status}</span>
              </td>
              <td>
                {req.status === 'pending' && (
                  <>
                    <button className="btn-admin btn-admin-approve" onClick={() => updateStatus(req.id, 'noted')}>Note</button>
                    <button className="btn-admin btn-admin-edit" onClick={() => updateStatus(req.id, 'fulfilled')}>Fulfill</button>
                    <button className="btn-admin btn-admin-reject" onClick={() => updateStatus(req.id, 'dismissed')}>Dismiss</button>
                  </>
                )}
                {req.status === 'noted' && (
                  <button className="btn-admin btn-admin-edit" onClick={() => updateStatus(req.id, 'fulfilled')}>Fulfill</button>
                )}
                <button className="btn-admin btn-admin-delete" onClick={() => deleteRequest(req.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredRequests.length === 0 && (
        <div className="empty-state">
          <h3>No course requests</h3>
          <p>No {filter !== 'all' ? filter : ''} requests to display</p>
        </div>
      )}
    </>
  );
}
