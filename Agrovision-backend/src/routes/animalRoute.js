import express from 'express';
import * as animalController from '../controllers/animalController.js'

const router = express.Router();

// Put specific routes before generic ones
router.get('/animals/search', animalController.searchAnimals);
router.get('/animals', animalController.getAnimals);
router.post('/animals', animalController.createAnimal);
router.put('/animals/:id', animalController.updateAnimal);
router.delete('/animals/:id', animalController.deleteAnimal);

export default router;