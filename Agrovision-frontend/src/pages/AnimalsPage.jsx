import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import AnimalTable from "../components/AnimalTable.jsx";
import ModalForm from "../components/ModalForm.jsx";

const AnimalsPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [animalData, setAnimalData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const fetchAnimals = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/animals');
            console.log("Data received:", response.data);
            setTableData(response.data);
        } catch (err) {
            console.error("Error fetching animals:", err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, []);

    const handleOpen = (mode, animal = null) => {
        setAnimalData(animal);
        setModalMode(mode);
        setIsOpen(true);
    };

    const handleSubmit = async (newAnimalData) => {
        try {
            if (modalMode === 'add') {
                const response = await axios.post('http://localhost:3000/api/animals', newAnimalData);
                setTableData((prevData) => [...prevData, response.data]);
            } else {
                const response = await axios.put(
                    `http://localhost:3000/api/animals/${animalData.id}`,
                    newAnimalData
                );
                setTableData((prevData) =>
                    prevData.map((animal) =>
                        animal.id === animalData.id ? response.data : animal
                    )
                );
            }
            setIsOpen(false);
        } catch (error) {
            console.error('Error handling animal:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            setError(error.message);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-base-100 shadow-xl rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Animals Management</h1>
                        <button 
                            onClick={() => handleOpen('add')}
                            className="btn btn-primary"
                        >
                            Add New Animal
                        </button>
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search animals..."
                            className="input input-bordered w-full max-w-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="alert alert-error mb-4">
                            {error}
                        </div>
                    )}

                    <AnimalTable
                        tableData={tableData}
                        setTableData={setTableData}
                        handleOpen={handleOpen}
                        searchTerm={searchTerm}
                    />

                    <ModalForm
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        OnSubmit={handleSubmit}
                        mode={modalMode}
                        animalData={animalData}
                    />
                </div>
            </div>
        </div>
    );
};

export default AnimalsPage;