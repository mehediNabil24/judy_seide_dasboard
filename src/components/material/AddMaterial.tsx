import React, { useState } from 'react';
import { useAddMaterialMutation } from '../../redux/api/material/materialApi';
import { toast } from 'sonner';

const AddMaterial: React.FC = () => {
  const [materialName, setMaterialName] = useState('');
  const [addMaterial, { isLoading }] = useAddMaterialMutation();

  const handleAddMaterial = async () => {
    if (!materialName.trim()) return;

    try {
      await addMaterial({ materialName }).unwrap(); // 👈 Changed from { name }
      setMaterialName('');
      toast.success('Material added successfully!');
    } catch (error) {
      toast.error(`Failed to add material: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    setMaterialName('');
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <h2 className="text-[#FB923C] font-semibold text-lg mb-6">Add Material</h2>

      <label className="block text-sm font-medium text-black mb-1">
        Material Name
      </label>
      <input
        type="text"
        value={materialName}
        onChange={(e) => setMaterialName(e.target.value)}
        className="w-full border border-[#FB923C] focus:outline-none focus:ring-2 focus:ring-orange-300 rounded-sm p-2 text-sm mb-16"
        placeholder="Enter material"
      />

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCancel}
          className="border border-[#FB923C] text-black px-6 py-2 text-sm rounded-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleAddMaterial}
          disabled={isLoading}
          className="bg-[#FB923C] hover:bg-orange-600 text-white font-semibold px-6 py-2 text-sm rounded-sm"
        >
          {isLoading ? 'Adding...' : 'Add Material'}
        </button>
      </div>
    </div>
  );
};

export default AddMaterial;
