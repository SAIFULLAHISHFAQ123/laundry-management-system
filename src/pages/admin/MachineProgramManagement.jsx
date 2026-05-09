import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

export default function MachineProgramManagement() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('machine_programs') || '[]');
        setPrograms(stored);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this program?')) {
            const updated = programs.filter(p => p.id !== id);
            setPrograms(updated);
            localStorage.setItem('machine_programs', JSON.stringify(updated));
        }
    };

    return (
        <div className="admin-container">
            <header className="flex-between mb-8">
                <div>
                    <h2 className="admin-page-title">Program Catalog</h2>
                    <p className="text-muted">Manage available washing and drying configurations.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/admin/add-machine-program')}>
                    + New Program
                </button>
            </header>

            {programs.length === 0 ? (
                <div className="admin-card text-center" style={{ padding: '5rem 2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📜</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>No Programs Defined</h3>
                    <p className="text-muted mb-6">Start by creating your first machine operation program.</p>
                    <button className="btn btn-outline" onClick={() => navigate('/admin/add-machine-program')}>Create Program</button>
                </div>
            ) : (
                <div className="grid-2">
                    {programs.map(program => (
                        <div key={program.id} className="admin-card program-card" style={{ position: 'relative' }}>
                            <div className="flex-between mb-4">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div className="brand-icon" style={{ width: '40px', height: '40px' }}>🧬</div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{program.name}</h3>
                                        <span className="badge badge-primary">₱{program.price}</span>
                                    </div>
                                </div>
                                <button 
                                    className="btn btn-danger" 
                                    style={{ padding: '0.5rem', minWidth: '40px' }}
                                    onClick={() => handleDelete(program.id)}
                                >
                                    🗑️
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <div className="stat-mini">
                                    <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Duration</span>
                                    <div style={{ fontWeight: '700' }}>⏱️ {program.duration}m</div>
                                </div>
                                <div className="stat-mini">
                                    <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Temp</span>
                                    <div style={{ fontWeight: '700' }}>🌡️ {program.temperature}°C</div>
                                </div>
                                <div className="stat-mini">
                                    <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Spin</span>
                                    <div style={{ fontWeight: '700' }}>🌀 {program.spinSpeed}</div>
                                </div>
                                <div className="stat-mini">
                                    <span className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Created</span>
                                    <div style={{ fontWeight: '700', fontSize: '0.8rem' }}>📅 {new Date(program.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>

                            {program.description && (
                                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                    {program.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
