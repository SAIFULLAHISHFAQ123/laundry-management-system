import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

export default function ClothType() {

  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();

  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(
    bookingData.clothType || null
  );

  // LOAD PROGRAMS FROM API
  useEffect(() => {

    fetchPrograms();

    if (!bookingData.branch) {
      navigate('/home');
    }

  }, []);

  const fetchPrograms = async () => {

    try {

      const res = await fetch(
        'https://localhost:7208/api/program1'
      );

      const data = await res.json();

      setPrograms(data);

    }
    catch (error) {

      console.error("Failed to load programs", error);
    }
  };

  // SELECT PROGRAM
  const handleSelect = (program) => {

    setSelectedProgram(program);
  };

  // NEXT STEP
  const handleNext = () => {

    if (!selectedProgram) {
      alert('Please select a washing program.');
      return;
    }

    updateBooking('clothType', selectedProgram);

    navigate('/machine-detail');
  };

    return (
        <div className="container animate-in" style={{ maxWidth: '900px', margin: 'auto', padding: '2rem 1rem' }}>
            {/* Header Section */}
            <div className="text-center mb-12">
                <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '64px', 
                    height: '64px', 
                    background: 'var(--primary-light)', 
                    borderRadius: '50%', 
                    color: 'var(--primary)', 
                    fontSize: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 16px rgba(14, 165, 233, 0.1)'
                }}>
                    🧼
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Select Wash Program</h1>
                <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto' }}>Choose the perfect treatment for your garments based on fabric type and soil level.</p>
            </div>

            {/* Selection Grid */}
            <div className="card" style={{ padding: '2.5rem' }}>
                <div className="flex-between mb-8">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Available Treatments</h3>
                    <span className="badge" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-muted)' }}>{programs.length} Programs</span>
                </div>

                <div className="selection-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    {programs.length === 0 ? (
                        <div className="text-center p-10 w-full" style={{ gridColumn: '1/-1' }}>
                            <p className="text-muted">No programs available at this time.</p>
                        </div>
                    ) : (
                        programs.map((p) => {
                            const isSelected = selectedProgram?.programId === p.programId;
                            return (
                                <div
                                    key={p.programId}
                                    onClick={() => handleSelect(p)}
                                    className={`selection-card ${isSelected ? 'selected' : ''}`}
                                    style={{ 
                                        padding: '2rem 1.5rem', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        textAlign: 'center',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        border: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
                                        background: isSelected ? 'var(--primary-light)' : 'var(--bg-white)'
                                    }}
                                >
                                    <div style={{ 
                                        fontSize: '2.5rem', 
                                        marginBottom: '1.25rem',
                                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'transform 0.3s ease'
                                    }}>
                                        {p.programName.toLowerCase().includes('delicate') ? '🧶' : 
                                         p.programName.toLowerCase().includes('heavy') ? '🧤' : 
                                         p.programName.toLowerCase().includes('quick') ? '⚡' : '👕'}
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem', color: isSelected ? 'var(--primary-dark)' : 'var(--text-main)' }}>
                                        {p.programName}
                                    </h3>
                                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                        {p.durationMinutes || '45'} Mins
                                    </p>
                                    <div style={{ 
                                        fontSize: '1.25rem', 
                                        fontWeight: '800', 
                                        color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                        marginTop: 'auto'
                                    }}>
                                        PKR {p.programPrice}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex-between" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px dashed var(--border)' }}>
                    <button className="btn btn-outline" onClick={() => navigate('/home')} style={{ padding: '0.75rem 2rem' }}>
                        ← Back to Map
                    </button>
                    <button className="btn btn-primary" onClick={handleNext} style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem' }}>
                        Next Step: Select Machines →
                    </button>
                </div>
            </div>
        </div>
    );
}