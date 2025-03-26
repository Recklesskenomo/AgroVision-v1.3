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

    return (
        <>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Species</th>
                        <th>Breed</th>
                        <th>Age</th>
                        <th>Use</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody className="hover">
                    {filteredData.map((animal) => (
                        <tr key={animal.id}>
                            <th></th>
                            <th>{animal.id}</th>
                            <td>{animal.name}</td>
                            <td>{animal.species}</td>
                            <td>{animal.breed}</td>
                            <td>{animal.age}</td>
                            <td>{animal.use}</td>
                            <td>
                                <button
                                    className={`btn btn-rounded-full w-20 ${animal.is_active ? 'btn-primary' : 'btn-outline btn-primary'}`}>
                                    {animal.is_active ? 'Active' : 'Inactive'}
                                </button>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleOpen('edit', animal)}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        Update
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
                                            className="btn bg-red-700 text-black btn-sm"
                                            onClick={() => setDeleteId(animal.id)}
                                        >
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
    )
}