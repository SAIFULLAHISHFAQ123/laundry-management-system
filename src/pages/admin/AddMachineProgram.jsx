import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

export default function AddMachineProgram() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        programName: '',
        machineId: 1,
        time: '45',
        price: '300',
        duration: '45',
        temperature: '40',
        spinSpeed: '1200',
        isActive: true
    });

    // HANDLE CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // SUBMIT
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            // STEP 1 → CREATE PROGRAM

            const programResponse = await fetch(
                'https://localhost:7208/api/program1',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        programName: formData.programName
                    })
                }
            );

            if (!programResponse.ok) {

                throw new Error("Failed to create program");
            }

            const programData = await programResponse.json();

            const createdProgram =
                programData.data || programData;

            // STEP 2 → SAVE MACHINE PROGRAM

            const apiData = {

                machineId: formData.machineId,

                programId: createdProgram.programId,

                programTime: parseInt(formData.time),

                programPrice: parseFloat(formData.price),

                durationMinutes: parseInt(formData.duration),

                waterTemperature: formData.temperature,

                spinSpeedRPM: parseInt(formData.spinSpeed),

                isActive: true
            };

            const machineProgramResponse = await fetch(
                'https://localhost:7208/api/machineprograms',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(apiData)
                }
            );

            if (!machineProgramResponse.ok) {

                throw new Error("Failed to save machine program");
            }

            alert('Machine Program saved successfully! ✨');

            navigate('/admin/machine-programs');

        }
        catch (error) {

            console.error(error);

            alert('Failed to save machine program');
        }
    };

    return (

        <div
            className="admin-container"
            style={{ maxWidth: '900px' }}
        >

            <div className="admin-card animate-in">

                <header style={{ marginBottom: '2.5rem' }}>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}
                    >

                        <div>

                            <h2
                                className="admin-page-title"
                                style={{
                                    fontSize: '1.8rem',
                                    color: 'var(--primary)'
                                }}
                            >
                                Configure Machine Program
                            </h2>

                            <p className="text-muted">
                                Define operational cycles and pricing.
                            </p>

                        </div>

                        <div
                            className="brand-icon"
                            style={{
                                width: '50px',
                                height: '50px',
                                fontSize: '1.5rem'
                            }}
                        >
                            🧬
                        </div>

                    </div>

                </header>

                <form
                    onSubmit={handleSubmit}
                    className="flex-column gap-4"
                >

                    {/* PROGRAM NAME */}

                    <div className="form-group">

                        <label>Program Name</label>

                        <input
                            className="input-control"
                            type="text"
                            name="programName"
                            value={formData.programName}
                            onChange={handleChange}
                            placeholder="Enter Program Name"
                            required
                        />

                    </div>

                    {/* PRICE + DURATION */}

                    <div className="grid-2">

                        <div className="form-group">

                            <label>Base Price</label>

                            <input
                                className="input-control"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>Duration (Minutes)</label>

                            <input
                                className="input-control"
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    {/* PROGRAM TIME */}

                    <div className="form-group">

                        <label>Program Time</label>

                        <input
                            className="input-control"
                            type="number"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            placeholder="45"
                            required
                        />

                    </div>

                    {/* TEMP + RPM */}

                    <div className="grid-2">

                        <div className="form-group">

                            <label>Water Temperature</label>

                            <select
                                className="input-control"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                            >

                                <option value="Cold">Cold</option>
                                <option value="20">20°C</option>
                                <option value="30">30°C</option>
                                <option value="40">40°C</option>
                                <option value="60">60°C</option>
                                <option value="90">90°C</option>

                            </select>

                        </div>

                        <div className="form-group">

                            <label>Spin Speed RPM</label>

                            <select
                                className="input-control"
                                name="spinSpeed"
                                value={formData.spinSpeed}
                                onChange={handleChange}
                            >

                                <option value="400">400 RPM</option>
                                <option value="800">800 RPM</option>
                                <option value="1000">1000 RPM</option>
                                <option value="1200">1200 RPM</option>
                                <option value="1400">1400 RPM</option>

                            </select>

                        </div>

                    </div>

                    {/* BUTTONS */}

                    <div
                        className="flex-between gap-4"
                        style={{ marginTop: '2rem' }}
                    >

                        <button
                            type="button"
                            className="btn btn-outline w-full"
                            onClick={() =>
                                navigate('/admin/machine-programs')
                            }
                        >
                            Back to List
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Save Program Strategy 🚀
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}