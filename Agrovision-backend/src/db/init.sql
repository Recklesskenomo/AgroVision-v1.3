CREATE TABLE IF NOT EXISTS animals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(255) NOT NULL,
    breed VARCHAR(255),
    age INTEGER,
    is_active BOOLEAN DEFAULT true,
    use VARCHAR(255),
    weight DECIMAL,
    milk_production DECIMAL,
    wool_type VARCHAR(50),
    egg_production INTEGER,
    last_vaccination DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 