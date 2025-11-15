// client/src/pages/User/Pets.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({ name: "", type: "", age: "" });
  const [editingPet, setEditingPet] = useState(null);
  const [petToDelete, setPetToDelete] = useState(null);

  const { token } = useSelector((state) => state.user);

  // Fetch pets
  const fetchPets = async () => {
    try {
      const res = await axios.get("http://localhost:4000/pets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [token]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update pet
// funcția handleSubmit actualizată
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingPet) {
      // Update pet
      const res = await axios.put(
        `http://localhost:4000/pets/${editingPet.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Pet updated:", res.data.data);
      setEditingPet(null);
    } else {
      // Add new pet
      const res = await axios.post(
        `http://localhost:4000/pets`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Pet added:", res.data.data);
    }
    setFormData({ name: "", type: "", age: "" });
    fetchPets(); 
  } catch (err) {
    console.error("Error saving pet:", err.response?.data || err);
  }
};


const handleDelete = async (petId) => {
  try {
    await axios.delete(`http://localhost:4000/pets/${petId}`, { 
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPets(); //reincarc
    setPetToDelete(null); //inchid modal
  } catch (err) {
    console.error("Error deleting pet:", err.response?.data || err);
  }
};



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My Pets</h1>

      {/* Form for add/update */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow-md grid gap-4 md:grid-cols-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Type</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Hamster">Hamster</option>
        </select>
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {editingPet ? "Update Pet" : "Add Pet"}
        </button>
      </form>

      {/* Pets list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pets.length === 0 && (
          <p className="text-gray-500 col-span-full">No pets found.</p>
        )}
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{pet.name}</h2>
              <p className="text-gray-500">Type: {pet.type}</p>
              <p className="text-gray-500">Age: {pet.age}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setEditingPet(pet);
                  setFormData({
                    name: pet.name,
                    type: pet.type,
                    age: pet.age,
                  });
                }}
                className="flex-1 bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => setPetToDelete(pet)}
                className="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {petToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <p className="mb-4">
              Are you sure you want to delete <strong>{petToDelete.name}</strong>?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => handleDelete(petToDelete.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setPetToDelete(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
