import axios from 'axios';
import {useState} from "react";

export default function AnimalTable({ handleOpen, tableData, setTableData, searchTerm}) {
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null); // Track which item is being deleted

    // Filter theAnimalTable based on the searchTerm
    const filteredData = tableData.filter(animal =>
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.use.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/animals/${id}`);
            setTableData((prevData) => prevData.filter(animal => animal.id !== id));
            setDeleteId(null); // Reset delete state after successful deletion
        } catch (err) {
            setError(err.message);
        }
    };

    // Function to capitalize first letter
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <>
            {error && (
                <div className="alert alert-error mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
            <div className="overflow-x-auto bg-base-100 rounded-lg">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th className="bg-base-200"></th>
                            <th className="bg-base-200">ID</th>
                            <th className="bg-base-200">Name</th>
                            <th className="bg-base-200">Species</th>
                            <th className="bg-base-200">Breed</th>
                            <th className="bg-base-200">Age</th>
                            <th className="bg-base-200">Use</th>
                            <th className="bg-base-200">Status</th>
                            <th className="bg-base-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((animal) => (
                            <tr key={animal.id} className="hover">
                                <th></th>
                                <td>{animal.id}</td>
                                <td>{animal.name}</td>
                                <td>{capitalize(animal.species)}</td>
                                <td>{capitalize(animal.breed)}</td>
                                <td>{animal.age}</td>
                                <td>{capitalize(animal.use)}</td>
                                <td>
                                    <span className={`badge ${animal.is_active ? 'badge-success' : 'badge-error'}`}>
                                        {animal.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleOpen('edit', animal)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Edit
                                        </button>
                                        
                                        {deleteId === animal.id ? (
                                            <div className="join">
                                                <button 
                                                    className="btn btn-error btn-sm join-item"
                                                    onClick={() => handleDelete(animal.id)}
                                                >
                                                    Confirm
                                                </button>
                                                <button 
                                                    className="btn btn-sm join-item"
                                                    onClick={() => setDeleteId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                className="btn btn-error btn-sm"
                                                onClick={() => setDeleteId(animal.id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}