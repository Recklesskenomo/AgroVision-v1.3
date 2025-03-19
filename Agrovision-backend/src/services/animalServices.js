import { query } from "../db.js"

export const getAnimals = async() => {
    const {rows} = await query('SELECT * FROM animals');
    return rows;
}

export const createAnimal = async(animalData) => {
    const { name, species, breed, age, use, status } = animalData;
    const is_active = status; // Map status to is_active

    const { rows } = await query(
        `INSERT INTO animals (name, species, breed, age, is_active, use) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, species, breed, age, is_active, use]
    );

    return rows[0];
}

export const updateAnimal = async (animalId, animalData) => {
    const { name, species, breed, age, use, status } = animalData;
    const is_active = status; // Map status to is_active

    const { rows } = await query(
        `UPDATE animals SET name = $1, species = $2, breed = $3, age = $4, is_active = $5, use = $6 
       WHERE id = $7 RETURNING *`,
        [name, species, breed, age, is_active, use, animalId]
    );

    return rows[0];
};


export const deleteAnimal = async (animalId) => {
    const { rowCount } = await query(`DELETE FROM animals WHERE id = $1`, [animalId]);
    return rowCount > 0; // Returns true if a row was deleted, false otherwise
};

export const searchAnimals = async (searchTerm) => {
    const { rows } = await query(
        `SELECT * FROM animals WHERE name ILIKE $1 OR species ILIKE $1 OR breed ILIKE $1 `,
        [`%${searchTerm}%`]
    );
    return rows;
};