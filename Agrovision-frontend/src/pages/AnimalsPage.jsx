import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import AnimalTable from "../components/AnimalTable.jsx";
import ModalForm from "../components/ModalForm.jsx";

const AnimalsPage = () => {
    const { onOpen: parentOnOpen } = useOutletContext();
    const [isOpen, setIsOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [animalData, setAnimalData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
const fetchAnimals = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/animals');
        console.log("Data received:", response.data); // Add this to check what's coming back
        setTableData(response.data);
    } catch (err) {
        console.error("Error fetching animals:", err);
        setError(err.message);
    }
};

useEffect(() => {
    fetchAnimals();
}, []);
const handleOpen = (mode, animal) => {
    setAnimalData(animal);
    setModalMode(mode);
    setIsOpen(true);
};

const handleSubmit = async (newAnimalData) => {
    if (modalMode === 'add') {
        try {
            const response = await axios.post('http://localhost:3000/api/animals', newAnimalData); // Replace with your actual API URL
            console.log('Animal added:', response.data); // Log the response
            setTableData((prevData) => [...prevData, response.data]);
            // Optionally, update your state here to reflect the newly added animal
        } catch (error) {
            console.error('Error adding animal:', error); // Log any errors
        }
        console.log('modal mode Add');

    } else {
        console.log('Updating animal with ID:', animalData.id); // Log the ID being updated
        try {
            const response = await axios.put(`http://localhost:3000/api/animals/${animalData.id}`, newAnimalData);
            console.log('Animal updated:', response.data);
            setTableData((prevData) =>
                prevData.map((animal) => (animal.id === animalData.id ? response.data : animal))
            );
        } catch (error) {
            console.error('Error updating animal:', error);
        }

    }
};
    return (
        <>
            <AnimalTable
                setTableData={setTableData}
                tableData={tableData}
                handleOpen={handleOpen}
                searchTerm={searchTerm}
            />
            <ModalForm
                isOpen={isOpen}
                OnSubmit={handleSubmit}
                onClose={() => setIsOpen(false)}
                mode={modalMode}
                animalData={animalData}
            />
        </>
    );
};

export default AnimalsPage;