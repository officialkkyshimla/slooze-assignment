'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ManagerPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([
    { id: 1, customer: 'John Doe', items: ['Burger', 'Fries'], total: 15.99, status: 'pending' },
    { id: 2, customer: 'Jane Smith', items: ['Pizza', 'Salad'], total: 22.50, status: 'completed' },
    { id: 3, customer: 'Bob Johnson', items: ['Pasta', 'Bread'], total: 18.75, status: 'pending' },
  ]);

  const restaurants = [
    { id: 1, name: 'Burger Palace', location: 'Downtown', rating: 4.5 },
    { id: 2, name: 'Pizza Corner', location: 'Uptown', rating: 4.2 },
    { id: 3, name: 'Italian Kitchen', location: 'Midtown', rating: 4.7 },
  ];

  const menuItems = [
    { id: 1, name: 'Classic Burger', price: 8.99, category: 'Main Course' },
    { id: 2, name: 'Margherita Pizza', price: 12.99, category: 'Main Course' },
    { id: 3, name: 'French Fries', price: 3.99, category: 'Sides' },
    { id: 4, name: 'Caesar Salad', price: 6.99, category: 'Salads' },
    { id: 5, name: 'Spaghetti Carbonara', price: 14.99, category: 'Main Course' },
    { id: 6, name: 'Garlic Bread', price: 4.99, category: 'Sides' },
  ];

  const [newOrder, setNewOrder] = useState({ customer: '', items: [], total: 0 });
  const [selectedItems, setSelectedItems] = useState([]);

  const addToOrder = (item) => {
    setSelectedItems([...selectedItems, item]);
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, item.name],
      total: newOrder.total + item.price
    });
  };

  const removeFromOrder = (index) => {
    const itemToRemove = selectedItems[index];
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((_, i) => i !== index),
      total: newOrder.total - itemToRemove.price
    });
  };

  const createOrder = () => {
    if (newOrder.customer && selectedItems.length > 0) {
      const order = {
        id: orders.length + 1,
        customer: newOrder.customer,
        items: newOrder.items,
        total: newOrder.total,
        status: 'pending',
        createdAt: new Date().toLocaleString()
      };
      setOrders([...orders, order]);
      setNewOrder({ customer: '', items: [], total: 0 });
      setSelectedItems([]);
    }
  };

  const cancelOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const checkoutOrder = (orderId) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'completed' } : order
    ));
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">Total Orders</h3>
        <p className="text-3xl font-bold text-indigo-600">{orders.length}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">Pending Orders</h3>
        <p className="text-3xl font-bold text-yellow-600">
          {orders.filter(o => o.status === 'pending').length}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">Completed Orders</h3>
        <p className="text-3xl font-bold text-green-600">
          {orders.filter(o => o.status === 'completed').length}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800">Today's Revenue</h3>
        <p className="text-3xl font-bold text-blue-600">
          ${orders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.total, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );

  const renderRestaurants = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Restaurant Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
            <p className="text-gray-600">{restaurant.location}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-500 text-lg">★</span>
              <span className="ml-1 font-medium">{restaurant.rating}</span>
              <span className="text-gray-500 text-sm ml-1">/ 5.0</span>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMenuItems = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map(item => (
          <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <span className="text-green-600 font-bold">${item.price}</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{item.category}</p>
            <button
              onClick={() => addToOrder(item)}
              className="w-full bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700 transition"
            >
              Add to Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      {/* Create New Order */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Order</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Form */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="Enter customer name"
                value={newOrder.customer}
                onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Selected Items</h3>
              {selectedItems.length === 0 ? (
                <p className="text-gray-500">No items selected</p>
              ) : (
                <div className="space-y-2">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span>{item.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">${item.price}</span>
                        <button
                          onClick={() => removeFromOrder(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-green-600">${newOrder.total.toFixed(2)}</span>
              </div>

              <button
                onClick={createOrder}
                disabled={!newOrder.customer || selectedItems.length === 0}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                Create Order
              </button>
            </div>
          </div>

          {/* Quick Menu */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Add Menu Items</h3>
            <div className="grid grid-cols-2 gap-2">
              {menuItems.slice(0, 6).map(item => (
                <button
                  key={item.id}
                  onClick={() => addToOrder(item)}
                  className="text-left p-3 border rounded hover:bg-gray-50 transition"
                >
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-green-600 text-sm">${item.price}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h2>

        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-1"><strong>Customer:</strong> {order.customer}</p>
                  <p className="text-gray-600 mb-2"><strong>Items:</strong> {order.items.join(', ')}</p>
                  <p className="text-sm text-gray-500 mb-3"><strong>Created:</strong> {order.createdAt || 'Just now'}</p>
                  <p className="text-xl font-bold text-green-600"><strong>Total:</strong> ${order.total}</p>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => checkoutOrder(order.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Checkout & Pay
                    </button>
                  )}

                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No orders yet. Create your first order above!</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-sm text-gray-600">Restaurant Management System</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition" onClick={() => router.push('/UI/Login')}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'restaurants', label: 'Restaurants' },
              { id: 'menu', label: 'Menu Items' },
              { id: 'orders', label: 'Orders' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-md text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'restaurants' && renderRestaurants()}
        {activeTab === 'menu' && renderMenuItems()}
        {activeTab === 'orders' && renderOrders()}
      </div>
    </div>
  );
};

export default ManagerPage;
