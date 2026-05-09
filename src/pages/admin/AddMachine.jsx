import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBranches, getBranches } from '../../services/MapService';
import '../../styles/admin.css';

export default function AddMachine() {

    const navigate = useNavigate();

    const [branches, setBranches] = useState([]);
    const [programs, setPrograms] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        programId: '',
        machineType: 'Washer',
        capacity: '7kg',
        branchId: '',
        status: 'Active'
    });

    // LOAD DATA (BRANCHES + PROGRAMS)
    useEffect(() => {

        loadBranches();
        loadPrograms();

    }, []);

    // LOAD BRANCHES
    const loadBranches = async () => {

        try {

            const data = await fetchBranches();

            setBranches(data);

            if (data.length > 0) {

                setFormData(prev => ({
                    ...prev,
                    branchId: data[0].id || data[0].laundryId
                }));
            }

        }
        catch (error) {

            console.error('Branch loading failed:', error);

            const fallback = getBranches();

            setBranches(fallback);
        }
    };

    // LOAD PROGRAMS FROM API
    const loadPrograms = async () => {

        try {

            const res = await fetch(
                'https://localhost:7208/api/program1'
            );

            const data = await res.json();

            setPrograms(data);

            if (data.length > 0) {

                setFormData(prev => ({
                    ...prev,
                    programId: data[0].programId
                }));
            }

        }
        catch (error) {

            console.error('Program loading failed:', error);
        }
    };

    // HANDLE INPUT
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

        const selectedBranch = branches.find(
            b => b.id == formData.branchId || b.laundryId == formData.branchId
        );

        const machineData = {

            name: formData.name,

            machineType: formData.machineType,

            capacity: formData.capacity,

            laundryId: parseInt(formData.branchId),

            programId: parseInt(formData.programId) // IMPORTANT
        };

        try {

            const res = await fetch(
                'https://localhost:7208/api/machines',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(machineData)
                }
            );

            if (!res.ok) throw new Error("Failed to add machine");

            alert(`${formData.name} added successfully! ✅`);

            navigate('/admin/machines');

        }
        catch (error) {

            console.error(error);

            alert('Failed to add machine ❌');
        }
    };

    return (

        <div
            className="admin-container"
            style={{ maxWidth: '800px' }}
        >

            <div className="admin-card animate-in">

                <header style={{ marginBottom: '2rem' }}>

                    <h2 className="admin-page-title" style={{ fontSize: '1.5rem' }}>
                        Deploy New Machine Unit
                    </h2>

                    <p className="text-muted">
                        Add machine and assign program from database
                    </p>

                </header>

                <form onSubmit={handleSubmit} className="flex-column gap-4">

                    {/* MACHINE NAME */}
                    <div className="form-group">

                        <label>Machine Name</label>

                        <input
                            className="input-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. UltraWash 5000"
                            required
                        />

                    </div>

                    {/* PROGRAM COMBOBOX (API) */}
                    <div className="form-group">

                        <label>Select Program</label>

                        <select
                            className="input-control"
                            name="programId"
                            value={formData.programId}
                            onChange={handleChange}
                            required
                        >

                            {programs.map(p => (

                                <option
                                    key={p.programId}
                                    value={p.programId}
                                >
                                    {p.programName}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* MACHINE TYPE */}
                    <div className="form-group">

                        <label>Machine Type</label>

                        <select
                            className="input-control"
                            name="machineType"
                            value={formData.machineType}
                            onChange={handleChange}
                        >

                            <option value="Washer">Washer</option>
                            <option value="Dryer">Dryer</option>
                            <option value="Both">Both</option>

                        </select>

                    </div>

                    {/* CAPACITY */}
                    <div className="form-group">

                        <label>Capacity</label>

                        <select
                            className="input-control"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                        >

                            <option value="5kg">5kg</option>
                            <option value="7kg">7kg</option>
                            <option value="10kg">10kg</option>
                            <option value="15kg">15kg</option>

                        </select>

                    </div>

                    {/* BRANCH */}
                    <div className="form-group">

                        <label>Assign Branch</label>

                        <select
                            className="input-control"
                            name="branchId"
                            value={formData.branchId}
                            onChange={handleChange}
                            required
                        >

                            {branches.map(b => (

                                <option
                                    key={b.id || b.laundryId}
                                    value={b.id || b.laundryId}
                                >
                                    {b.name}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* BUTTONS */}
                    <div
                        className="flex-between gap-4"
                        style={{ marginTop: '2rem' }}
                    >

                        <button
                            type="button"
                            className="btn btn-outline w-full"
                            onClick={() => navigate('/admin/machines')}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                        >
                            Deploy Machine 🚜
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}