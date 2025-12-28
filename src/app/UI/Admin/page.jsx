'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([
    { id: 1, customer: 'John Doe', items: ['Burger', 'Fries'], total: 15.99, status: 'pending' },
    { id: 2, customer: 'Jane Smith', items: ['Pizza', 'Salad'], total: 22.50, status: 'completed' },
  ]);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Credit Card', last4: '1234', expiry: '12/25' },
    { id: 2, type: 'PayPal', email: 'admin@example.com' },
  ]);

  const restaurants = [
    { id: 1, name: 'Burger Palace', location: 'Downtown', rating: 4.5 },
    { id: 2, name: 'Pizza Corner', location: 'Uptown', rating: 4.2 },
  ];

  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Classic Burger', price: 8.99, category: 'Main Course' },
    { id: 2, name: 'Margherita Pizza', price: 12.99, category: 'Main Course' },
    { id: 3, name: 'French Fries', price: 3.99, category: 'Sides' },
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: 'Main Course'
  });

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

  const createOrder = () => {
    if (newOrder.customer && selectedItems.length > 0) {
      const order = {
        id: orders.length + 1,
        customer: newOrder.customer,
        items: newOrder.items,
        total: newOrder.total,
        status: 'pending'
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

  const addPaymentMethod = () => {
    const newMethod = {
      id: paymentMethods.length + 1,
      type: 'Credit Card',
      last4: '5678',
      expiry: '06/26'
    };
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  const createItem = () => {
    if (newItem.name && newItem.price) {
      const itemData = {
        name: newItem.name,
        price: newItem.price,
        category: newItem.category,
        restaurantId: 'restaurant-1' // Default restaurant ID - in real app, this would be selected
      };

      fetch('/api/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            // Add to local state
            setMenuItems([...menuItems, data]);
            setNewItem({ name: '', price: '', category: 'Main Course' });
            alert('Menu item created successfully!');
          }
        })
        .catch(error => {
          console.error('Create item error:', error);
          alert('Failed to create menu item. Please try again.');
        });
    } else {
      alert('Please fill in all fields');
    }
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
        <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
        <p className="text-3xl font-bold text-blue-600">
          ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );

  const renderRestaurants = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold">{restaurant.name}</h3>
            <p className="text-gray-600">{restaurant.location}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{restaurant.rating}</span>
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
          <div key={item.id} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600">{item.category}</p>
            <p className="text-green-600 font-bold">${item.price}</p>
            <button
              onClick={() => addToOrder(item)}
              className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
            >
              Add to Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders Management</h2>

      {/* Create New Order */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Create New Order</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={newOrder.customer}
            onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          />
          <div className="flex items-center">
            <span className="font-semibold">Total: ${newOrder.total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={createOrder}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Order
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600">Customer: {order.customer}</p>
                <p className="text-sm text-gray-500">Items: {order.items.join(', ')}</p>
                <p className="font-bold text-green-600">${order.total}</p>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => checkoutOrder(order.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Checkout
                  </button>
                )}
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h2>
      <button
        onClick={addPaymentMethod}
        className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Add Payment Method
      </button>
      <div className="space-y-4">
        {paymentMethods.map(method => (
          <div key={method.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{method.type}</h3>
                {method.last4 && <p className="text-gray-600">**** **** **** {method.last4}</p>}
                {method.email && <p className="text-gray-600">{method.email}</p>}
                {method.expiry && <p className="text-sm text-gray-500">Expires: {method.expiry}</p>}
              </div>
              <button className="text-indigo-600 hover:text-indigo-800">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreateItem = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Menu Item</h2>

      <div className="max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              placeholder="Enter item name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
            >
              <option value="Main Course">Main Course</option>
              <option value="Sides">Sides</option>
              <option value="Beverages">Beverages</option>
              <option value="Desserts">Desserts</option>
              <option value="Appetizers">Appetizers</option>
            </select>
          </div>

          <button
            onClick={createItem}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Create Menu Item
          </button>
        </div>
      </div>

      {/* Preview */}
      {newItem.name && newItem.price && (
        <div className="mt-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Preview:</h3>
          <div className="border rounded-lg p-4 bg-white">
            <h4 className="font-semibold">{newItem.name}</h4>
            <p className="text-gray-600">{newItem.category}</p>
            <p className="text-green-600 font-bold">${parseFloat(newItem.price).toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={() => router.push('/UI/Login')}>
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
              { id: 'create', label: 'Create Item' },
              { id: 'orders', label: 'Orders' },
              { id: 'payments', label: 'Payment Methods' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:text-indigo-600'
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
        {activeTab === 'create' && renderCreateItem()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'payments' && renderPaymentMethods()}
      </div>
    </div>
  );
};

export default AdminPage;
