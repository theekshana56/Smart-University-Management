import React from 'react';
import ResourceLayout from '../components/resource/ResourceLayout.jsx';

export default function HomePage({ onLogout, user, onNavigate }) {
    return (
        <ResourceLayout onLogout={onLogout} user={user} onNavigate={onNavigate} currentPage="Home">
            <div className="home-container" style={{ padding: '20px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: 'var(--text)' }}>
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
                        Smart University Management System Dashboard
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                    {[
                        { label: 'Active Resources', value: '42', icon: '🏛️', trend: '+5 this week' },
                        { label: 'Upcoming Bookings', value: '18', icon: '📅', trend: 'Next in 2h' },
                        { label: 'Open Tickets', value: '7', icon: '🎫', trend: '3 high priority' },
                        { label: 'System Notifications', value: '12', icon: '🔔', trend: 'New alerts' }
                    ].map((stat, i) => (
                        <div key={i} style={{
                            background: 'var(--panel)',
                            padding: '24px',
                            borderRadius: '20px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            border: '1px solid var(--border)',
                            color: 'var(--text)'
                        }}>
                            <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                            <div>
                                <div style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                                <div style={{ fontSize: '28px', fontWeight: '800', margin: '4px 0', color: 'var(--accent)' }}>{stat.value}</div>
                                <div style={{ fontSize: '13px', color: 'var(--success)', fontWeight: '500' }}>{stat.trend}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, var(--sidebar) 0%, var(--sidebar2) 100%)',
                    padding: '40px',
                    borderRadius: '24px',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Quick Start Guide</h2>
                        <p style={{ opacity: 0.9, lineHeight: '1.6', maxWidth: '600px', marginBottom: '24px' }}>
                            Manage your university resources, check availability for labs and halls, and handle students tickets all in one unified dashboard.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => onNavigate('Resources')}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: '#fff',
                                    color: 'var(--sidebar)',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}>Manage Resources</button>
                            <button style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.3)',
                                background: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>View Appointments</button>
                        </div>
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-10%',
                        fontSize: '15rem',
                        opacity: 0.1,
                        transform: 'rotate(-15deg)'
                    }}>🏛️</div>
                </div>
            </div>
        </ResourceLayout>
    );
}
