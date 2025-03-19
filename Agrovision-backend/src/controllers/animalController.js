import * as animalService from "../services/animalServices.js";


export const getAnimals = async (req, res) => {
    try {
        const animals = await animalService.getAnimals();
        res.status(200).json(animals);
    } catch (err) {
        console.error('Error fetching animals:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const createAnimal = async (req, res) => {
    try {
        const animalData = req.body;
        const newAnimal = await animalService.createAnimal(animalData);
        res.status(200).json(newAnimal);
    } catch (err) {
        console.error('Error adding animal:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateAnimal = async (req, res) => {
    try {
        const animalId = req.params.id;
        const animalData = req.body;
        const updatedAnimal = await animalService.updateAnimal(animalId, animalData);
        if (!updatedAnimal) {
            return res.status(404).json({ message: 'Animal not found' });
        }
        res.status(200).json(updatedAnimal);

    } catch (err) {
        console.error('Error updating animal:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const deleteAnimal = async (req, res) => {
    try {
        const animalId = req.params.id;
        const deleted = await animalService.deleteAnimal(animalId);
        if (!deleted) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        res.status(200).send();

    } catch (err) {
        console.error('Error deleting animal:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const searchAnimals = async (req, res) => {
    try {
        const searchTerm = req.query.q; // Get the search term from the query parameters
        const animals = await animalService.searchAnimals(searchTerm);
        res.status(200).json(animals);
    } catch (error) {
        console.error('Error searching animals:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
