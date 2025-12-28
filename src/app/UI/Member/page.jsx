'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MemberPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('restaurants');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const restaurants = [
    { id: 1, name: 'Burger Palace', location: 'Downtown', rating: 4.5, image: '🍔', description: 'Best burgers in town' },
    { id: 2, name: 'Pizza Corner', location: 'Uptown', rating: 4.2, image: '🍕', description: 'Authentic Italian pizzas' },
    { id: 3, name: 'Italian Kitchen', location: 'Midtown', rating: 4.7, image: '🍝', description: 'Traditional Italian cuisine' },
    { id: 4, name: 'Sushi Express', location: 'Westside', rating: 4.8, image: '🍱', description: 'Fresh sushi and Asian delights' },
  ];

  const menuItems = [
    { id: 1, name: 'Classic Burger', price: 8.99, category: 'Main Course', restaurant: 'Burger Palace', image: '🍔', description: 'Juicy beef patty with fresh vegetables' },
    { id: 2, name: 'Margherita Pizza', price: 12.99, category: 'Main Course', restaurant: 'Pizza Corner', image: '🍕', description: 'Fresh mozzarella, tomato sauce, basil' },
    { id: 3, name: 'French Fries', price: 3.99, category: 'Sides', restaurant: 'Burger Palace', image: '🍟', description: 'Crispy golden fries' },
    { id: 4, name: 'Caesar Salad', price: 6.99, category: 'Salads', restaurant: 'Italian Kitchen', image: '🥗', description: 'Crisp romaine with Caesar dressing' },
    { id: 5, name: 'Spaghetti Carbonara', price: 14.99, category: 'Main Course', restaurant: 'Italian Kitchen', image: '🍝', description: 'Creamy pasta with pancetta and parmesan' },
    { id: 6, name: 'Garlic Bread', price: 4.99, category: 'Sides', restaurant: 'Pizza Corner', image: '🍞', description: 'Toasted bread with garlic butter' },
    { id: 7, name: 'California Roll', price: 9.99, category: 'Main Course', restaurant: 'Sushi Express', image: '🍱', description: 'Crab, avocado, cucumber roll' },
    { id: 8, name: 'Miso Soup', price: 3.49, category: 'Appetizers', restaurant: 'Sushi Express', image: '🍜', description: 'Traditional Japanese soup' },
  ];

  const categories = ['All', 'Main Course', 'Sides', 'Salads', 'Appetizers'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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

    // Here you would typically send the order to your backend
    alert(`Order placed successfully! Total: $${getTotalPrice().toFixed(2)}`);
    setCart([]);
    setShowCart(false);
  };

  const filteredMenuItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const restaurantMatch = !selectedRestaurant || item.restaurant === selectedRestaurant;
    return categoryMatch && restaurantMatch;
  });

  const renderRestaurants = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Restaurant</h2>
        <p className="text-gray-600">Select from our partner restaurants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {restaurants.map(restaurant => (
          <div
            key={restaurant.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 hover:border-indigo-200"
            onClick={() => {
              setSelectedRestaurant(restaurant.name);
              setActiveTab('menu');
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{restaurant.image}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                <p className="text-gray-600">{restaurant.location}</p>
                <p className="text-sm text-gray-500 mt-1">{restaurant.description}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="ml-1 font-medium">{restaurant.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">/ 5.0</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-right">
              <span className="text-indigo-600 font-medium hover:text-indigo-700">View Menu →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-6">
      {/* Restaurant Header */}
      {selectedRestaurant && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">
                {restaurants.find(r => r.name === selectedRestaurant)?.image}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedRestaurant}</h2>
                <p className="text-gray-600">Delicious food waiting for you</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back to Restaurants
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenuItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{item.image}</div>
              <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-green-600">${item.price}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
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
          <p className="text-gray-500 text-lg">No items found in this category.</p>
        </div>
      )}
    </div>
  );

  const renderCart = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500">Your cart is empty</p>
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
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
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
                  Place Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FoodieHub</h1>
              <p className="text-sm text-gray-600">Order delicious food</p>
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
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm max-w-md">
            {[
              { id: 'restaurants', label: 'Restaurants' },
              { id: 'menu', label: 'Menu Items' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 rounded-md text-sm font-medium transition ${
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
        {activeTab === 'restaurants' && renderRestaurants()}
        {activeTab === 'menu' && renderMenu()}

        {/* Cart Modal */}
        {showCart && renderCart()}
      </div>
    </div>
  );
};

export default MemberPage;
