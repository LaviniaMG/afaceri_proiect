import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function AdminProducts() {
  const { token } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    targetAnimal: "",
    image: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [popupProduct, setPopupProduct] = useState(null); // product to delete

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.data);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  // CLOSE POPUP ON ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setPopupProduct(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("targetAnimal", formData.targetAnimal);
      if (formData.image) data.append("image", formData.image);

      if (editingProduct) {
        await axios.put(
          `http://localhost:4000/products/${editingProduct.id}`,
          data,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
        setEditingProduct(null);
      } else {
        await axios.post(
          `http://localhost:4000/products`,
          data,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
      }

      setFormData({ name: "", description: "", price: "", stock: "", targetAnimal: "", image: null });
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err);
    }
  };

  const handleDelete = async () => {
    if (!popupProduct) return;
    try {
      await axios.delete(`http://localhost:4000/products/${popupProduct.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== popupProduct.id));
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err);
    } finally {
      setPopupProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Admin Products</h1>

      {/* Form for add/update */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow-md grid gap-4 md:grid-cols-3 lg:grid-cols-4"
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
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          name="targetAnimal"
          value={formData.targetAnimal}
          onChange={handleChange}
          required
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Target Animal</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Hamster">Hamster</option>
        </select>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Products list */}
      <div className="flex-1 overflow-y-auto max-h-[70vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 && <p className="text-gray-500 col-span-full">No products found.</p>}
          {products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg flex flex-col">
              <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                {p.image ? (
                  <img
                    src={`http://localhost:4000/uploads/${p.image}`}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">🐾</span>
                )}
              </div>
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="text-gray-500">{p.description}</p>
              <p className="text-indigo-600 font-bold mt-1">${p.price}</p>
              <p className="text-gray-500 mt-1">Stock: {p.stock}</p>
              <p className="text-gray-500 mt-1">For: {p.targetAnimal}</p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(p);
                    setFormData({
                      name: p.name,
                      description: p.description,
                      price: p.price,
                      stock: p.stock,
                      targetAnimal: p.targetAnimal,
                      image: null,
                    });
                  }}
                  className="flex-1 bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => setPopupProduct(p)}
                  className="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DELETE CONFIRM POPUP */}
      {popupProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setPopupProduct(null)}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-xl font-semibold mb-3">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <b>{popupProduct.name}</b>?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-200"
                onClick={() => setPopupProduct(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
