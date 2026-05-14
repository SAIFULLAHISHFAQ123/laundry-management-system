import React from 'react';
import { useBooking } from '../../context/BookingContext';

const Ratings = () => {
    const { ratings } = useBooking();

    return (
        <div className="container animate-in" style={{ maxWidth: '1100px', margin: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>User Feedback & Ratings</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Monitor customer satisfaction across all branches.</p>
                </div>
                <div style={{ background: 'var(--primary-light)', padding: '1rem 2rem', borderRadius: '15px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                        {(ratings.reduce((a, b) => a + b.rating, 0) / ratings.length).toFixed(1)} / 5.0
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: '700' }}>AVERAGE SCORE</div>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Branch (Admin ID)</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comment</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.map((rate) => (
                            <tr key={rate.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                                <td style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>
                                            U
                                        </div>
                                        <span style={{ fontWeight: '700' }}>#{rate.userId}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.5rem', fontWeight: '600' }}>{rate.adminId}</td>
                                <td style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} style={{ color: i < rate.rating ? '#fbbf24' : '#e5e7eb', fontSize: '1.1rem' }}>★</span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '1.5rem', color: 'var(--text-muted)', maxWidth: '300px' }}>{rate.comment}</td>
                                <td style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{rate.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .table-row-hover:hover {
                    background-color: var(--primary-light) !important;
                }
            `}</style>
        </div>
    );
};

export default Ratings;
