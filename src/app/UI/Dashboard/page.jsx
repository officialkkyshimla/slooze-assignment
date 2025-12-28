'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderHistory, setOrderHistory] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch restaurants and menu items from API
    Promise.all([
      fetch('/api/restaurants').then(res => res.json()),
      fetch('/api/menu-items').then(res => res.json())
    ])
      .then(([restaurantsData, menuItemsData]) => {
        setRestaurants(restaurantsData);
        setMenuItems(menuItemsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });

    // Load order history from localStorage or API
    const savedOrders = localStorage.getItem('orderHistory');
    if (savedOrders) {
      setOrderHistory(JSON.parse(savedOrders));
    }
  }, []);

  const categories = ['All', 'Burgers', 'Pizza', 'Pasta', 'Sushi', 'Main Course', 'Sides', 'Salads', 'Soups', 'Appetizers', 'Desserts'];

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    const orderData = {
      customerName: 'Guest Customer', // In a real app, get from user context
      items: cart.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
    };

    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          // Add to order history
          const newOrderHistory = [...orderHistory, {
            id: data.id,
            date: new Date().toISOString().split('T')[0],
            items: cart.map(item => item.name),
            total: getTotalPrice(),
            status: 'Preparing'
          }];
          setOrderHistory(newOrderHistory);
          localStorage.setItem('orderHistory', JSON.stringify(newOrderHistory));

          alert(`Order placed successfully! Order ID: ${data.id}`);
          setCart([]);
          setShowCart(false);
        }
      })
      .catch(error => {
        console.error('Order error:', error);
        alert('Failed to place order. Please try again.');
      });
  };

  const filteredMenuItems = menuItems.filter(item => {
    const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
    const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const popularItems = menuItems.filter(item => item.isPopular);

  const renderHero = () => (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-8 mb-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to FoodieHub! 🍽️</h1>
        <p className="text-xl mb-6">Delicious food delivered to your doorstep</p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPopularItems = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Items 🔥</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {popularItems.slice(0, 4).map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
            <div className="relative">
              <div className="text-3xl mb-2">{item.image}</div>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Popular
              </span>
            </div>
            <h3 className="font-bold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-green-600">${item.price}</span>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-sm ml-1">{item.rating}</span>
              </div>
            </div>
            <button
              onClick={() => addToCart(item)}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRestaurants = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Restaurants 🏪</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{restaurant.image}</div>
              <h3 className="font-bold text-gray-800">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.location}</p>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-sm ml-1">{restaurant.rating}</span>
              </div>
              <span className="text-sm text-gray-600">{restaurant.deliveryTime}</span>
            </div>
            <button className="w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200 transition">
              View Menu
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMenuItems = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Menu Items</h2>
        <div className="flex space-x-2">
          {categories.slice(0, 6).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMenuItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="relative mb-4">
              <div className="text-4xl text-center">{item.image}</div>
              {item.isPopular && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  🔥 Popular
                </span>
              )}
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-green-600">${item.price}</span>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm ml-1">{item.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {item.restaurant.name}
              </span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {item.category}
              </span>
            </div>

            <button
              onClick={() => addToCart(item)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {filteredMenuItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">No items found matching your search.</p>
          <p className="text-sm text-gray-400 mt-2">Try a different search term or category.</p>
        </div>
      )}
    </div>
  );

  const renderOrderHistory = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders 📋</h2>
      <div className="space-y-4">
        {orderHistory.slice(0, 3).map(order => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-sm text-gray-600">{order.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {order.items.join(', ')}
            </p>
            <p className="font-bold text-green-600">${order.total}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCart = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Cart 🛒</h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-2">Add some delicious items!</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    <div className="text-2xl">{item.image}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">${item.price} each</p>
                      <p className="text-xs text-gray-500">{item.restaurant.name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={placeOrder}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-green-700 transition"
                >
                  Place Order 🍽️
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FoodieHub</h1>
              <p className="text-sm text-gray-600">Delicious food, fast delivery</p>
            </div>
            <div className="flex items-center space-x-4">
              
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                🛒 Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition" onClick={() => router.push('/UI/Login')}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {renderHero()}

        {/* Popular Items */}
        {renderPopularItems()}

        {/* Restaurants */}
        {renderRestaurants()}

        {/* Menu Items */}
        {renderMenuItems()}

        {/* Order History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Menu continues above */}
          </div>
          <div>
            {renderOrderHistory()}
          </div>
        </div>

        {/* Cart Modal */}
        {showCart && renderCart()}
      </div>
    </div>
  );
};

export default DashboardPage;
