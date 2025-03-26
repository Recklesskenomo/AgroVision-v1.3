import { query } from "../config/database.js"

export const getAnimals = async() => {
    const {rows} = await query('SELECT * FROM animals');
    return rows;
}

export const createAnimal = async (animalData) => {
    try {
        console.log('Processing animal data in service:', animalData); // Debug log

        const {
            name,
            species,
            breed,
            age,
            use,
            status,
            weight,
            milkProduction,
            woolType,
            eggProduction,
            lastVaccination
        } = animalData;

        // Validate required fields
        if (!name || !species || !breed || !age || !use) {
            throw new Error('Missing required fields');
        }

        const { rows } = await query(
            `INSERT INTO animals (
                name, 
                species, 
                breed, 
                age, 
                use, 
                is_active, 
                weight, 
                milk_production, 
                wool_type, 
                egg_production, 
                last_vaccination
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *`,
            [
                name,
                species,
                breed,
                parseInt(age),
                use,
                status || false, // Default to false if not provided
                weight ? parseFloat(weight) : null,
                milkProduction ? parseFloat(milkProduction) : null,
                woolType || null,
                eggProduction ? parseInt(eggProduction) : null,
                lastVaccination || null
            ]
        );

        console.log('Successfully created animal:', rows[0]); // Debug log
        return rows[0];
    } catch (error) {
        console.error('Error in createAnimal service:', error);
        throw error;
    }
};

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