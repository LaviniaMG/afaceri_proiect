// client/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Dashboard() {
  const { token } = useSelector(state => state.user);
  const [pets, setPets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //animale user
        const petsRes = await axios.get('http://localhost:4000/pets', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPets(petsRes.data.data);

        //comenzi user cu prod
        const ordersRes = await axios.get('http://localhost:4000/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(ordersRes.data.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  if (loading) {
    return <p className="p-6 text-lg">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>

      {/* User Info */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Your Profile</h2>
        <p>Total Pets: <span className="font-bold">{pets.length}</span></p>
        {pets.length > 0 && (
          <ul className="mt-2 list-disc list-inside">
            {pets.map(p => (
              <li key={p.id}>{p.name} ({p.type})</li>
            ))}
          </ul>
        )}
      </div>

      {/* Orders */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">You have no orders yet.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Order #{order.id}</h3>
              <p>Status: <span className="font-bold">{order.status || 'Pending'}</span></p>
              <p>Total: <span className="font-bold">${order.total?.toFixed(2) || 0}</span></p>

              {/* Products in order */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Products:</h4>
                {order.Products && order.Products.length > 0 ? (
                  <ul className="space-y-2">
                    {order.Products.map(prod => (
                      <li key={prod.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                          {prod.image ? (
                            <img
                              src={`http://localhost:4000/uploads/${prod.image}`}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 text-sm flex items-center justify-center h-full">No Image</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{prod.name}</p>
                          <p className="text-gray-500">{prod.description}</p>
                          <p className="text-indigo-600 font-bold">
                            Qty: {prod.OrderProducts?.quantity || 0} | Price: ${prod.OrderProducts?.price || prod.price}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No products in this order.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
