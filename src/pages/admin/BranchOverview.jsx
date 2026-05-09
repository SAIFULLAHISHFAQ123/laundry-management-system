import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BranchOverview() {

    const [branches, setBranches] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        fetchBranches();

    }, []);

    const fetchBranches = async () => {

        try {

            const res = await fetch(
                'https://localhost:7208/api/Laundry'
            );

            const data = await res.json();

            setBranches(data);

        } catch (error) {

            console.log(error);

        }
    };

    const deleteLaundry = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure?'
        );

        if (!confirmDelete) return;

        try {

            const res = await fetch(
                `https://localhost:7208/api/Laundry/${id}`,
                {
                    method: 'DELETE'
                }
            );

            if (!res.ok) {
                throw new Error('Delete failed');
            }

            alert('Laundry deleted ✅');

            fetchBranches();

        } catch (error) {

            console.log(error);

            alert('Delete failed ❌');
        }
    };

    return (
        <div className="admin-container animate-in">

            <div className="admin-header">
                <h2 className="admin-page-title">Laundry Branches</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/add-laundry')}
                >
                    + Add New Branch
                </button>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Branch Name</th>
                                <th>City</th>
                                <th>Contact Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {branches.map(branch => (
                                <tr key={branch.laundryId}>
                                    <td style={{ fontWeight: '600' }}>{branch.name}</td>
                                    <td>{branch.city}</td>
                                    <td>{branch.contactNumber}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                onClick={() => navigate(`/admin/edit-laundry/${branch.laundryId}`)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                onClick={() => deleteLaundry(branch.laundryId)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}