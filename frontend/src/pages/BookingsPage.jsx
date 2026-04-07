import React, { useState, useEffect } from 'react';
import ResourceLayout from '../components/resource/ResourceLayout';
import { bookingService } from '../services/bookingService';
import '../components/resource/table.css';

export default function BookingsPage({ onLogout, user }) {
  const [myBookings, setMyBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [formData, setFormData] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: ''
  });
  const [rejectionReasons, setRejectionReasons] = useState({});

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      loadMyBookings();
    } else {
      loadAllBookings();
    }
  }, [user]);

  const loadMyBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setMyBookings(data);
    } catch (error) {
      console.error("Error loading my bookings", error);
    }
  };

  const loadAllBookings = async () => {
    try {
      const data = await bookingService.getAllBookings();
      setAllBookings(data);
    } catch (error) {
      console.error("Error loading all bookings", error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, attendees: Number(formData.attendees) };
      await bookingService.createBooking(payload);
      alert('Booking created successfully');
      setFormData({
        resourceId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: ''
      });
      loadMyBookings();
    } catch (error) {
      console.error(error);
      let errorMessage = 'Failed to create booking';
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          errorMessage = JSON.stringify(error.response.data, null, 2);
        } else {
          errorMessage = String(error.response.data);
        }
      }
      alert("Error: " + errorMessage);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingService.cancelBooking(id);
      alert('Booking cancelled');
      loadMyBookings();
    } catch (error) {
      console.error(error);
      alert('Failed to cancel booking');
    }
  };

  const handleApproveBooking = async (id) => {
    try {
      await bookingService.approveBooking(id);
      alert('Booking approved');
      loadAllBookings();
    } catch (error) {
      console.error(error);
      alert('Failed to approve booking');
    }
  };

  const handleRejectBooking = async (id) => {
    const reason = rejectionReasons[id];
    if (!reason) {
      alert("Please provide a rejection reason");
      return;
    }
    try {
      await bookingService.rejectBooking(id, reason);
      alert('Booking rejected');
      setRejectionReasons(prev => ({ ...prev, [id]: '' }));
      loadAllBookings();
    } catch (error) {
      console.error(error);
      alert('Failed to reject booking');
    }
  };

  const handleReasonChange = (id, val) => {
    setRejectionReasons(prev => ({ ...prev, [id]: val }));
  };

  const getStatusBadge = (status) => {
    if (status === 'APPROVED') return <span className="pill ok">APPROVED</span>;
    if (status === 'REJECTED') return <span className="pill bad">REJECTED</span>;
    if (status === 'CANCELLED') return <span className="pill">CANCELLED</span>;
    if (status === 'PENDING') return <span className="pill">PENDING</span>;
    return <span className="pill">{status}</span>;
  };

  return (
    <ResourceLayout onLogout={onLogout} user={user}>
      
      <section className="card resourcePageHeader" style={{ width: '100%' }}>
        <div>
          <h1 className="resourcePageTitle">Bookings Management</h1>
          <p className="resourcePageSubtitle">Schedule and manage your campus resource reservations.</p>
        </div>
        <span className={user?.role === 'ADMIN' ? 'roleBadge manager' : 'roleBadge viewer'}>
          {user?.role === 'ADMIN' ? 'Admin Access' : 'User Access'}
        </span>
      </section>

      {user?.role !== 'ADMIN' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card resourceSectionIntro">
              <h2 className="resourceSectionTitle">Create Booking</h2>
              <p className="resourceSectionText">Fill out the details to request a resource.</p>
            </div>
              
            <form className="card" onSubmit={handleCreateBooking} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="grid2" style={{ flex: 1 }}>
                <div>
                  <label className="label">Purpose</label>
                  <input className="input" type="text" name="purpose" value={formData.purpose} onChange={handleFormChange} required placeholder="e.g. Study Group" />
                </div>
                <div>
                  <label className="label">Resource ID</label>
                  <input className="input" type="number" name="resourceId" value={formData.resourceId} onChange={handleFormChange} required placeholder="ID" />
                </div>
                <div>
                  <label className="label">Attendees</label>
                  <input className="input" type="number" name="attendees" value={formData.attendees} onChange={handleFormChange} required min="1" placeholder="Estimated count" />
                </div>
                <div>
                  <label className="label">Date</label>
                  <input className="input" type="date" name="date" value={formData.date} onChange={handleFormChange} required />
                </div>
                <div>
                  <label className="label">Start Time</label>
                  <input className="input" type="time" name="startTime" value={formData.startTime} onChange={handleFormChange} required />
                </div>
                <div>
                  <label className="label">End Time</label>
                  <input className="input" type="time" name="endTime" value={formData.endTime} onChange={handleFormChange} required />
                </div>
              </div>

              <div className="row" style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <button type="submit" className="btnPrimary" style={{ width: '100%', maxWidth: '350px', padding: '12px' }}>Submit Booking</button>
              </div>
            </form>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="resourceSectionIntro">
                <h2 className="resourceSectionTitle">My Bookings</h2>
                <p className="resourceSectionText">Your recent reservation requests and their statuses.</p>
              </div>
              
              {myBookings.length === 0 ? (
                <div className="muted" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  You haven't made any bookings yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto', flex: 1 }}>
                  <table className="table" style={{ width: '100%', minWidth: '700px' }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Resource</th>
                        <th>Date & Time</th>
                        <th>Purpose</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myBookings.map(b => (
                        <tr key={b.id}>
                          <td>#{b.id}</td>
                          <td>{b.resourceId || b.resource?.id}</td>
                          <td>
                            <div>{b.date}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{b.startTime} - {b.endTime}</div>
                          </td>
                          <td>{b.purpose}</td>
                          <td>{getStatusBadge(b.status)}</td>
                          <td className="actions">
                            {b.status !== 'CANCELLED' && b.status !== 'REJECTED' && (
                              <button className="btnMini danger" onClick={() => handleCancelBooking(b.id)}>Cancel</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="card" style={{ minHeight: '75vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div className="resourceSectionIntro">
            <h2 className="resourceSectionTitle">All Bookings (Admin)</h2>
            <p className="resourceSectionText">Review and manage campus-wide resource requests.</p>
          </div>
          
          {allBookings.length === 0 ? (
            <div className="muted" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              No bookings found in the system.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', flex: 1 }}>
              <table className="table" style={{ width: '100%', minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Resource</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Rejection Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.map(b => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td>{b.userId || b.user?.id || b.user?.email || 'Unknown'}</td>
                      <td>{b.resourceId || b.resource?.id}</td>
                      <td>
                        <div>{b.date}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{b.startTime} - {b.endTime}</div>
                      </td>
                      <td>{getStatusBadge(b.status)}</td>
                      <td>
                        {b.status === 'PENDING' ? (
                          <input
                            type="text"
                            className="input"
                            style={{ minWidth: '160px' }}
                            placeholder="Reason..."
                            value={rejectionReasons[b.id] || ''}
                            onChange={(e) => handleReasonChange(b.id, e.target.value)}
                          />
                        ) : (
                          <span className="muted" style={{ padding: 0 }}>{b.rejectionReason || '-'}</span>
                        )}
                      </td>
                      <td className="actions">
                        {b.status === 'PENDING' && (
                          <>
                            <button className="btnMini ok" onClick={() => handleApproveBooking(b.id)}>Approve</button>
                            <button className="btnMini danger" onClick={() => handleRejectBooking(b.id)}>Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </ResourceLayout>
  );
}