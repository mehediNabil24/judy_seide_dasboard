import React, { useState } from 'react';
import { useAddMaterialMutation } from '../../redux/api/material/materialApi';


const AddMaterial: React.FC = () => {
  const [name, setName] = useState('18k gold');
  const [addMaterial, { isLoading }] = useAddMaterialMutation();

  const handleAddMaterial = async () => {
    if (!name.trim()) return;

    try {
      await addMaterial(name).unwrap();
      setName(''); // clear input on success
      alert('Material added successfully!');
    } catch (error) {
      console.error('Failed to add material:', error);
      alert('Failed to add material');
    }
  };

  const handleCancel = () => {
    setName('18k gold');
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <h2 className="text-orange-500 font-semibold text-lg mb-6">Add Material</h2>

      <label className="block text-sm font-medium text-black mb-1">
        Material Name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-sm p-2 text-sm mb-16"
        placeholder="Enter material"
      />

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCancel}
          className="border border-orange-400 text-black px-6 py-2 text-sm rounded-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleAddMaterial}
          disabled={isLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 text-sm rounded-sm"
        >
          Add Material
        </button>
      </div>
    </div>
  );
};

export default AddMaterial;
