import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'sonner';

export default function Products() {
  const [products, setProducts] = useState([]);
  const { token, role } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:4000/products/for-user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (role === 'user') fetchProducts();
  }, [token, role]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`); // feedback rapid pentru user
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Products for Your Pets</h1>

      <div className="flex-1 overflow-auto">
        {products.length === 0 ? (
          <p className="text-gray-500">No products available for your pets.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg flex flex-col">
                <div className="h-48 w-full mb-4 overflow-hidden rounded-md bg-gray-200 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={`http://localhost:4000/uploads/${product.image}`}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-500 flex-1 mt-1">{product.description}</p>
                <p className="text-indigo-600 font-bold mt-2">${product.price}</p>
                <button
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
