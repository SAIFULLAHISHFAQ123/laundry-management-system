import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

const CLOTH_TYPES = [
  { 
    id: 'cotton', 
    type: 'Cotton', 
    price: 150, 
    timeLimit: '45 mins', 
    icon: '👕',
    desc: 'Standard wash for everyday cotton items like t-shirts and jeans.',
    features: ['Standard Wash', '40°C Temp', '800 RPM Spin']
  },
  { 
    id: 'wool', 
    type: 'Wool', 
    price: 250, 
    timeLimit: '50 mins', 
    icon: '🧣',
    desc: 'Gentle low-temperature wash designed for delicates and wool sweaters.',
    features: ['Delicate Wash', 'Cold/30°C Temp', '400 RPM Spin']
  },
  { 
    id: 'white', 
    type: 'White', 
    price: 200, 
    timeLimit: '60 mins', 
    icon: '👔',
    desc: 'Intensive cycle with pre-wash to maintain the brightness of white fabrics.',
    features: ['Pre-Wash Included', '60°C Temp', '1200 RPM Spin']
  },
  { 
    id: 'blanket', 
    type: 'Blanket', 
    price: 350, 
    timeLimit: '90 mins', 
    icon: '🛌',
    desc: 'Heavy-duty deep cleaning cycle suited for large blankets and comforters.',
    features: ['Extra Rinse', 'Deep Clean', 'Max Load Capacity']
  }
];

export default function ClothType() {
  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();

  useEffect(() => {
    if (!bookingData.timeSlots || bookingData.timeSlots.length === 0) {
      navigate('/time-availability');
    }
  }, [bookingData, navigate]);

  const [selectedCloth, setSelectedCloth] = useState(bookingData.clothType || null);
  const [numLoads, setNumLoads] = useState(bookingData.numLoads || 1);

  const handleNext = () => {
    if (!selectedCloth) {
      alert('Please select a washing program.');
      return;
    }
    updateBooking('clothType', selectedCloth);
    updateBooking('numLoads', numLoads);
    navigate('/detergent'); // Step 4
  };

  return (
    <div className="container animate-in" style={{ maxWidth: '800px', margin: 'auto' }}>
      {/* Selection context */}
      <div style={{ backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius)', padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--primary-dark)', fontWeight: '600', textTransform: 'uppercase' }}>Selected Slots</p>
          <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{bookingData.date} @ {bookingData.timeSlots?.map(s => s.time).join(', ')}</strong>
        </div>
        <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subtotal</p>
            <strong style={{ fontSize: '0.95rem' }}>PKR {bookingData.timeSlots?.reduce((sum, s) => sum + s.price, 0)}</strong>
        </div>
      </div>

      <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem', textAlign: 'center' }}>Step 3: Cloth Type</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>Select a wash program and load count.</p>

      <div className="card">

        <h3 style={{ marginBottom: '1.25rem' }}>Washing Programs</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>
          {CLOTH_TYPES.map((cloth) => {
            const isSelected = selectedCloth?.id === cloth.id;
            return (
              <div
                key={cloth.id}
                onClick={() => setSelectedCloth(cloth)}
                style={{
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                  padding: '1.25rem',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'center',
                  backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-white)',
                  transition: 'all 0.2s',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none'
                }}
              >
                <div style={{ fontSize: '2.5rem', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? 'var(--bg-white)' : 'var(--bg-light)', borderRadius: '12px' }}>
                  {cloth.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, color: isSelected ? 'var(--primary)' : 'var(--text-main)', fontSize: '1.1rem' }}>{cloth.type}</h3>
                  </div>
                  <p className="text-muted" style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', lineHeight: '1.4' }}>{cloth.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-outline" onClick={() => navigate('/time-availability')}>← Back</button>
          

          <button className="btn btn-primary" onClick={handleNext}>Next: Detergent →</button>
        </div>
      </div>
    </div>
  );
}
