import axios from 'axios';
import {useState} from "react";

export default function AnimalTable({ handleOpen,tableData, setTableData , searchTerm}) {
    const [error,setError] = useState(null);

    // Filter theAnimalTable based on the searchTerm
    const filteredData =tableData.filter(animal =>
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase())||
        animal.use.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this animal?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/api/animals/${id}`); // API call to delete animal
                setTableData((prevData) => prevData.filter(animal => animal.id !== id)); // Update state
            } catch (err) {
                setError(err.message); // Handle any errors
            }
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

                    </tr>
                    </thead>
                    <tbody className="hover">
                    {/* row 1 */}
                    {filteredData.map((animal => (
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
                                <button onClick={() => handleOpen('edit', animal)}
                                        className="btn btn-secondary">Update
                                </button>
                            </td>
                            <td>

                                <button className="btn bg-red-700 text-black
                                " onClick={() => handleDelete(animal.id)}>Delete
                                </button>
                            </td>
                        </tr>
                    )))}


                    </tbody>
                </table>
            </div>
        </>
    )
}