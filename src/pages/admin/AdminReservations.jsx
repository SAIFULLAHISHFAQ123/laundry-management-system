import { useState, useEffect } from 'react';
import { getBranches } from '../../services/MapService';
import { useBooking } from '../../context/BookingContext';

export default function AdminReservations() {
    const { reservations, cancelBooking, completeBooking } = useBooking();
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('All');

    useEffect(() => {
        setBranches(getBranches());
    }, []);

    const filtered = (reservations || []).filter(b => 
        (selectedBranch === 'All' || b.branch?.name === selectedBranch) && b.status === 'Upcoming'
    ).sort((a, b) => {
        // Sort by date then timeSlot then queuePosition
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        if (a.timeSlot?.time !== b.timeSlot?.time) return a.timeSlot?.time.localeCompare(b.timeSlot?.time);
        return a.queuePosition - b.queuePosition;
    });

    return (
        <div style={{ maxWidth: '1200px', margin: 'auto' }}>
            <div className="card" style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Live Queue Monitoring</h3>
                    <select 
                        className="input-control" 
                        style={{ width: '250px', margin: 0 }} 
                        value={selectedBranch} 
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        <option value="All">All Branches</option>
                        {branches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                    </select>
                </div>
                <p className="text-muted">Currently tracking <strong>{filtered.length}</strong> active reservations in the queue system.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {filtered.length === 0 ? (
                    <div className="card text-center text-muted" style={{ gridColumn: '1 / -1', padding: '5rem' }}>
                        <h3>Queue is clear</h3>
                        <p>No upcoming reservations found for the selected branch.</p>
                    </div>
                ) : (
                    filtered.map((b, idx) => (
                        <div key={b.bookingId} className="card" style={{ 
                            position: 'relative', 
                            borderLeft: `6px solid ${idx < 3 ? 'var(--primary)' : 'var(--border)'}`,
                            backgroundColor: idx < 3 ? 'var(--primary-light)' : 'white'
                        }}>
                            {idx < 3 && (
                                <span style={{ 
                                    position: 'absolute', 
                                    right: '1rem', 
                                    top: '1rem', 
                                    backgroundColor: 'var(--primary)', 
                                    color: 'white', 
                                    fontSize: '0.65rem', 
                                    fontWeight: '900', 
                                    padding: '2px 8px', 
                                    borderRadius: '4px' 
                                }}>
                                    PRIORITY
                                </span>
                            )}
                            
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    borderRadius: '12px', 
                                    backgroundColor: 'white', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    boxShadow: 'var(--shadow-sm)',
                                    fontWeight: 'bold',
                                    color: 'var(--primary)'
                                }}>
                                    #{b.queuePosition}
                                </div>
                                <div>
                                    <strong style={{ fontSize: '1.1rem', display: 'block' }}>{b.branch?.name}</strong>
                                    <small className="text-muted">Unit: {b.machineId || 'M-Slot'}</small>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                <div>
                                    <small className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Arrival</small>
                                    <div style={{ fontWeight: '700' }}>
                                        {b.timeSlots && b.timeSlots.length > 0 
                                            ? b.timeSlots.map(s => s.time).join(', ') 
                                            : (b.timeSlot?.time || 'N/A')}
                                    </div>
                                </div>
                                <div>
                                    <small className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Date</small>
                                    <div style={{ fontWeight: '700' }}>{b.date}</div>
                                </div>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <small className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Service</small>
                                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{b.machineType}</div>
                                </div>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <small className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Program</small>
                                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{b.clothType?.type || 'Standard'}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border)', paddingTop: '1rem' }}>
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>ID: {b.bookingId}</small>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        className="btn btn-outline" 
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                        onClick={() => {
                                            if (window.confirm('Cancel this reservation?')) {
                                                cancelBooking(b.bookingId);
                                            }
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="btn btn-primary" 
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                        onClick={() => {
                                            if (window.confirm('Mark this reservation as Completed?')) {
                                                completeBooking(b.bookingId);
                                            }
                                        }}
                                    >
                                        Complete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
