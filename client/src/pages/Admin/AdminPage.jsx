import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  // date statice pentru demo
  const [stats, setStats] = useState({
    totalUsers: 125,
    totalProducts: 42,
    totalOrders: 78,
    ordersPerProduct: [
      { name: "Dog Food", orders: 2},
      { name: "Cat Toy", orders: 3 },
      { name: "Bird Cage", orders: 1 },
      { name: "Hamster Wheel", orders: 0 }
    ]
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

   <h2>Hello, Admin!</h2>
      {/* Orders per Product */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Orders per Product</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.ordersPerProduct}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
