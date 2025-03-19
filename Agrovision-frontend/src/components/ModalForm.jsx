import {useState, useEffect} from "react";

export default function ModalForm({ isOpen , onClose, mode, OnSubmit,animalData}) {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [use, setUse] = useState('');
    const [status, setStatus] = useState(false);

    // Handle the change of status
    const handleStatusChange = (e) => {
        setStatus(e.target.value === 'Active'); // Set status as boolean
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const animalData = {
                name,
                species,
                breed,
                age,
                use,
                status  // This will be mapped to is_active in the backend
            }
            await OnSubmit(animalData)
            onClose();
        } catch (err) {
            console.error("Error adding animal", err);
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
            } else {
                // Reset fields when adding a new animal
                setName('');
                setSpecies('');
                setBreed('');
                setAge('');
                setUse('');
                setStatus(false);
            }
        }, [mode, animalData]);

    return (
        <>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="my_modal_3" className="modal" open={isOpen}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg py-4">{mode === 'edit' ? 'Edit Animal' : 'Animal Details'}</h3>
                    <form method="dialog" onSubmit={handleSubmit}>
                        {/* if there is a button in form, it will close the modal */}
                        <label className="input input-bordered my-4 flex items-center gap-2">
                            Name
                            <input type="text" className="grow" value={name} onChange={(e) => setName(e.target.value)}/>
                        </label>

                        <label className="input input-bordered my-4 flex items-center gap-2">
                            Species
                            <input type="text" className="grow" value={species}
                                   onChange={(e) => setSpecies(e.target.value)}/>
                        </label>

                        <label className="input input-bordered my-4 flex items-center gap-2">
                            Breed
                            <input type="text" className="grow" value={breed}
                                   onChange={(e) => setBreed(e.target.value)}/>
                        </label>

                        <label className="input input-bordered my-4 flex items-center gap-2">
                            Age
                            <input type="text" className="grow" value={age}
                                   onChange={(e) => setAge(e.target.value)}/>
                        </label>
                        <label className="input input-bordered my-4 flex items-center gap-2">
                            Use
                            <input type="text" className="grow" value={use}
                                   onChange={(e) => setUse(e.target.value)}/>
                        </label>

                        <div className="flex mb-4 justify-between my-4">
                            <select value={status ? 'Active' : 'Inactive'} className="select select-bordered w-full max-w-xs" onChange={handleStatusChange}>
                                <option>Inactive</option>
                                <option>Active</option>
                            </select>
                        </div>



                        <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"  onClick={onClose}>✕</button>

                        <button type="submit" className="btn btn-success"> {mode === 'edit' ? 'Save Changes' : 'Add Animal' }</button>
                    </form>
                </div>
            </dialog>
        </>
        )
    }
