import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Cart() {
  const { items } = useSelector(state => state.cart);
  const { token } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

const handlePlaceOrder = async () => {
  try {
    setLoading(true);

    const orderItems = items.map(item => ({
      productId: item.id, // ID-ul produsului
      quantity: item.quantity
    }));

    const res = await axios.post(
      'http://localhost:4000/orders',
      { items: orderItems },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Order created:', res.data.data);
    toast.success('Order placed successfully!');
    dispatch(clearCart());
    setLoading(false);
  } catch (err) {
    console.error(err);
    toast.error('Failed to place order.');
    setLoading(false);
  }
};


  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product List */}
          <div className="flex-1 space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 mr-4">
                  {item.image ? (
                    <img
                      src={`http://localhost:4000/uploads/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm flex items-center justify-center h-full">
                      No Image
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-500">{item.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-indigo-600 font-bold mr-4">${item.price}</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="w-16 p-1 border rounded-md text-center"
                    />
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="ml-4 text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Items:</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Total:</span>
              <span className="text-indigo-600 font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-2 rounded-md text-white font-medium ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
