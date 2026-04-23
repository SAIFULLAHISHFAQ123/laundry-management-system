import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

export default function AddMachine() {
    const navigate = useNavigate();
    const [branches, setBranches] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        machineType: 'Washer',
        capacity: '7kg',
        branchId: '',
        status: 'Active'
    });

    // ✅ Fetch branches from API
    useEffect(() => {
        const fetchBranches = async () => {
            try {
               const res = await fetch('https://localhost:7208/api/laundries');
                const data = await res.json();
                setBranches(data);

                if (data.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        branchId: data[0].laundryId // adjust based on backend
                    }));
                }
            } catch (error) {
                console.error("Error fetching branches:", error);
            }
        };

        fetchBranches();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Submit to backend API
    const handleSubmit = async (e) => {
        e.preventDefault();

        const machineData = {
            name: formData.name,
            machineType: formData.machineType,
            capacity: formData.capacity,
            laundryId: parseInt(formData.branchId)
        };

        try {
          const res = await fetch('https://localhost:7208/api/machines', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(machineData)
            });

            if (!res.ok) throw new Error("Failed to add machine");

            alert(`${formData.name} added successfully!`);
            navigate('/admin/machines');

        } catch (error) {
            console.error(error);
            alert("Error adding machine");
        }
    };

    return (
        <div className="admin-container" style={{ maxWidth: '800px' }}>
            <div className="admin-card animate-in">
                <header style={{ marginBottom: '2rem' }}>
                    <h2 className="admin-page-title" style={{ fontSize: '1.5rem' }}>
                        Deploy New Machine Unit
                    </h2>
                    <p className="text-muted">
                        Add a new washing, drying, or combo unit to a specific branch inventory.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="flex-column gap-4">

                    <div className="grid-2">
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
                                <option value="Both">Both (Washer + Dryer Combo)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label>Capacity</label>
                            <select
                                className="input-control"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                            >
                                <option value="7kg">7kg Standard</option>
                                <option value="10kg">10kg Large</option>
                                <option value="15kg">15kg Industrial</option>
                                <option value="20kg">20kg Heavy Duty</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Assign to Branch</label>
                        <select
                            className="input-control"
                            name="branchId"
                            value={formData.branchId}
                            onChange={handleChange}
                            required
                        >
                            {branches.map(b => (
                                <option key={b.laundryId} value={b.laundryId}>
                                    {b.name} ({b.city})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-between gap-4" style={{ marginTop: '2rem' }}>
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
                            style={{ padding: '1rem' }}
                        >
                            Deploy Machine 🚜
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}