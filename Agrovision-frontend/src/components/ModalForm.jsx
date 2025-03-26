import {useState, useEffect} from "react";

export default function ModalForm({ isOpen , onClose, mode, OnSubmit,animalData}) {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [use, setUse] = useState('');
    const [status, setStatus] = useState(false);
    
    // Additional fields based on species
    const [weight, setWeight] = useState('');
    const [milkProduction, setMilkProduction] = useState('');
    const [woolType, setWoolType] = useState('');
    const [eggProduction, setEggProduction] = useState('');
    const [lastVaccination, setLastVaccination] = useState('');

    const speciesOptions = [
        { value: 'cattle', label: 'Cattle' },
        { value: 'sheep', label: 'Sheep' },
        { value: 'chicken', label: 'Chicken' },
        { value: 'goat', label: 'Goat' },
        { value: 'pig', label: 'Pig' }
    ];

    // Add breedOptions object after speciesOptions
    const breedOptions = {
        cattle: [
            { value: 'holstein', label: 'Holstein' },
            { value: 'angus', label: 'Angus' },
            { value: 'hereford', label: 'Hereford' },
            { value: 'jersey', label: 'Jersey' },
            { value: 'brahman', label: 'Brahman' },
            { value: 'simmental', label: 'Simmental' },
            { value: 'charolais', label: 'Charolais' },
            { value: 'limousin', label: 'Limousin' }
        ],
        sheep: [
            { value: 'merino', label: 'Merino' },
            { value: 'suffolk', label: 'Suffolk' },
            { value: 'dorper', label: 'Dorper' },
            { value: 'romney', label: 'Romney' },
            { value: 'dorset', label: 'Dorset' },
            { value: 'texel', label: 'Texel' }
        ],
        chicken: [
            { value: 'leghorn', label: 'Leghorn' },
            { value: 'rhode_island_red', label: 'Rhode Island Red' },
            { value: 'plymouth_rock', label: 'Plymouth Rock' },
            { value: 'orpington', label: 'Orpington' },
            { value: 'australorp', label: 'Australorp' },
            { value: 'wyandotte', label: 'Wyandotte' }
        ],
        goat: [
            { value: 'boer', label: 'Boer' },
            { value: 'nubian', label: 'Nubian' },
            { value: 'alpine', label: 'Alpine' },
            { value: 'saanen', label: 'Saanen' },
            { value: 'anglo_nubian', label: 'Anglo Nubian' },
            { value: 'toggenburg', label: 'Toggenburg' }
        ],
        pig: [
            { value: 'duroc', label: 'Duroc' },
            { value: 'yorkshire', label: 'Yorkshire' },
            { value: 'hampshire', label: 'Hampshire' },
            { value: 'landrace', label: 'Landrace' },
            { value: 'berkshire', label: 'Berkshire' },
            { value: 'pietrain', label: 'Pietrain' }
        ]
    };

    const getSpeciesFields = () => {
        switch (species) {
            case 'cattle':
                return (
                    <>
                        <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                            Weight (kg)
                            <input 
                                type="number" 
                                className="grow" 
                                value={weight} 
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </label>
                        {use === 'dairy' && (
                            <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                                Milk Production (L/day)
                                <input 
                                    type="number" 
                                    className="grow" 
                                    value={milkProduction} 
                                    onChange={(e) => setMilkProduction(e.target.value)}
                                />
                            </label>
                        )}
                    </>
                );
            case 'sheep':
                return (
                    <>
                        <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                            Weight (kg)
                            <input 
                                type="number" 
                                className="grow" 
                                value={weight} 
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </label>
                        <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                            Wool Type
                            <select 
                                className="grow bg-transparent border-none focus:outline-none" 
                                value={woolType} 
                                onChange={(e) => setWoolType(e.target.value)}
                            >
                                <option value="" className="bg-base-100">Select Wool Type</option>
                                <option value="fine" className="bg-base-100">Fine</option>
                                <option value="medium" className="bg-base-100">Medium</option>
                                <option value="coarse" className="bg-base-100">Coarse</option>
                            </select>
                        </label>
                    </>
                );
            case 'chicken':
                return (
                    <>
                        <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                            Weight (kg)
                            <input 
                                type="number" 
                                className="grow" 
                                value={weight} 
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </label>
                        <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                            Egg Production (per week)
                            <input 
                                type="number" 
                                className="grow" 
                                value={eggProduction} 
                                onChange={(e) => setEggProduction(e.target.value)}
                            />
                        </label>
                    </>
                );
            default:
                return null;
        }
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value === 'Active'); // Set status as boolean
    }

    // Add useOptions based on species
    const getUseOptions = () => {
        switch (species) {
            case 'cattle':
                return [
                    { value: 'dairy', label: 'Dairy' },
                    { value: 'beef', label: 'Beef' },
                    { value: 'dual_purpose', label: 'Dual Purpose' },
                    { value: 'breeding', label: 'Breeding' }
                ];
            case 'sheep':
                return [
                    { value: 'wool', label: 'Wool Production' },
                    { value: 'meat', label: 'Meat Production' },
                    { value: 'dual_purpose', label: 'Dual Purpose' },
                    { value: 'breeding', label: 'Breeding' }
                ];
            case 'chicken':
                return [
                    { value: 'eggs', label: 'Egg Production' },
                    { value: 'meat', label: 'Meat Production' },
                    { value: 'dual_purpose', label: 'Dual Purpose' },
                    { value: 'breeding', label: 'Breeding' }
                ];
            case 'goat':
                return [
                    { value: 'dairy', label: 'Dairy' },
                    { value: 'meat', label: 'Meat Production' },
                    { value: 'fiber', label: 'Fiber Production' },
                    { value: 'breeding', label: 'Breeding' }
                ];
            case 'pig':
                return [
                    { value: 'meat', label: 'Meat Production' },
                    { value: 'breeding', label: 'Breeding' }
                ];
            default:
                return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const animalData = {
                name,
                species,
                breed,
                age: parseInt(age),
                use,
                status,
                weight: weight || null,
                milkProduction: use === 'dairy' ? milkProduction : null,
                woolType: species === 'sheep' ? woolType : null,
                eggProduction: species === 'chicken' ? eggProduction : null,
                lastVaccination: lastVaccination || null
            };

            console.log('Submitting animal data:', animalData); // Debug log
            await OnSubmit(animalData);
            onClose();
        } catch (err) {
            console.error("Error adding animal:", err);
            if (err.response) {
                console.error("Server error details:", err.response.data);
            }
        }
    };
        useEffect(() => {
            if (mode === 'edit' && animalData) {
                setName(animalData.name);
                setSpecies(animalData.species);
                setBreed(animalData.breed);
                setAge(animalData.age);
                setUse(animalData.use);
                setStatus(animalData.isActive);
                // Set additional fields if they exist
                setWeight(animalData.weight || '');
                setMilkProduction(animalData.milkProduction || '');
                setWoolType(animalData.woolType || '');
                setEggProduction(animalData.eggProduction || '');
                setLastVaccination(animalData.lastVaccination || '');
            } else {
                // Reset all fields
                setName('');
                setSpecies('');
                setBreed('');
                setAge('');
                setUse('');
                setStatus(false);
                setWeight('');
                setMilkProduction('');
                setWoolType('');
                setEggProduction('');
                setLastVaccination('');
            }
        }, [mode, animalData]);

    // Add new useEffect to reset breed when species changes
    useEffect(() => {
        setBreed(''); // Reset breed when species changes
    }, [species]);

    // Add useEffect to reset milk production when use changes
    useEffect(() => {
        if (use !== 'dairy') {
            setMilkProduction('');
        }
    }, [use]);

    return (
        <>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="my_modal_3" className="modal" open={isOpen}>
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-lg py-4">{mode === 'edit' ? 'Edit Animal' : 'Add New Animal'}</h3>
                    <form method="dialog" onSubmit={handleSubmit}>
                        {/* if there is a button in form, it will close the modal */}
                        <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                            Name
                            <input type="text" className="grow" value={name} onChange={(e) => setName(e.target.value)} required/>
                        </label>

                        <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                            Species
                            <select 
                                className="grow bg-transparent border-none focus:outline-none" 
                                value={species} 
                                onChange={(e) => setSpecies(e.target.value)} 
                                required
                            >
                                <option value="" className="bg-base-100">Select Species</option>
                                {speciesOptions.map(option => (
                                    <option key={option.value} value={option.value} className="bg-base-100">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {/* Dynamic fields based on species */}
                        {getSpeciesFields()}

                        <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                            Breed
                            <select 
                                className="grow bg-transparent border-none focus:outline-none" 
                                value={breed} 
                                onChange={(e) => setBreed(e.target.value)}
                                required
                            >
                                <option value="" className="bg-base-100">Select Breed</option>
                                {species && breedOptions[species]?.map(option => (
                                    <option 
                                        key={option.value} 
                                        value={option.value} 
                                        className="bg-base-100"
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                            Age
                            <input type="number" className="grow" value={age} onChange={(e) => setAge(e.target.value)} required/>
                        </label>

                        <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                            Use
                            <select 
                                className="grow bg-transparent border-none focus:outline-none" 
                                value={use} 
                                onChange={(e) => setUse(e.target.value)}
                                required
                            >
                                <option value="" className="bg-base-100">Select Use</option>
                                {getUseOptions().map(option => (
                                    <option key={option.value} value={option.value} className="bg-base-100">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="input input-bordered input-sm my-4 flex items-center gap-2">
                            Last Vaccination Date
                            <input type="date" className="grow" value={lastVaccination} onChange={(e) => setLastVaccination(e.target.value)}/>
                        </label>

                        <div className="flex mb-4 justify-between my-4">
                            <label className="input input-bordered input-sm flex items-center gap-2">
                                Status
                                <select 
                                    value={status ? 'Active' : 'Inactive'} 
                                    className="grow bg-transparent border-none focus:outline-none" 
                                    onChange={handleStatusChange}
                                >
                                    <option className="bg-base-100">Inactive</option>
                                    <option className="bg-base-100">Active</option>
                                </select>
                            </label>
                        </div>

                        <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"  onClick={onClose}>✕</button>

                        <button type="submit" className="btn btn-primary"> {mode === 'edit' ? 'Save Changes' : 'Add Animal' }</button>
                    </form>
                </div>
            </dialog>
        </>
        )
    }
