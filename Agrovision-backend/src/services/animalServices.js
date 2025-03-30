import { query } from "../config/database.js"

export const getAnimals = async() => {
    const {rows} = await query('SELECT * FROM animals');
    return rows;
}

export const getAnimalById = async(id) => {
    const {rows} = await query('SELECT * FROM animals WHERE id = $1', [id]);
    return rows[0];
}

export const createAnimal = async (animalData) => {
    try {
        console.log('Processing animal data in service:', animalData);
        
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

        const is_active = status === true || status === 'true' ? true : false;

        const sql = `
            INSERT INTO animals (
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
                last_vaccination, 
                "createdAt", 
                "updatedAt"
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
            RETURNING *
        `;

        const values = [
            name,
            species,
            breed,
            age,
            use,
            is_active,
            weight ? parseFloat(weight) : null,
            milkProduction ? parseFloat(milkProduction) : null,
            woolType || null,
            eggProduction ? parseInt(eggProduction) : null,
            lastVaccination || null
        ];

        console.log('Executing SQL with values:', values);
        const { rows } = await query(sql, values);
        return rows[0];
    } catch (error) {
        console.error('Error in createAnimal service:', error);
        throw error;
    }
};

export const updateAnimal = async (id, animalData) => {
    try {
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

        const is_active = status === true || status === 'true' ? true : false;

        const sql = `
            UPDATE animals 
            SET 
                name = $1, 
                species = $2, 
                breed = $3, 
                age = $4, 
                use = $5, 
                is_active = $6,
                weight = $7,
                milk_production = $8,
                wool_type = $9,
                egg_production = $10,
                last_vaccination = $11,
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $12
            RETURNING *
        `;

        const values = [
            name,
            species,
            breed,
            age,
            use,
            is_active,
            weight ? parseFloat(weight) : null,
            milkProduction ? parseFloat(milkProduction) : null,
            woolType || null,
            eggProduction ? parseInt(eggProduction) : null,
            lastVaccination || null,
            id
        ];

        console.log('Executing UPDATE with values:', values);
        const { rows } = await query(sql, values);
        return rows[0];
    } catch (error) {
        console.error('Error in updateAnimal service:', error);
        throw error;
    }
};

export const deleteAnimal = async (id) => {
    try {
        const { rows } = await query('DELETE FROM animals WHERE id = $1 RETURNING *', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error in deleteAnimal service:', error);
        throw error;
    }
};

export const searchAnimals = async (searchTerm) => {
    const { rows } = await query(
        `SELECT * FROM animals WHERE name ILIKE $1 OR species ILIKE $1 OR breed ILIKE $1 `,
        [`%${searchTerm}%`]
    );
    return rows;
};