'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';

const DocumentationPage = () => {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    setIsGenerating(true);

    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.text('Slooze - Complete Food Ordering System Documentation', 20, yPosition);
    yPosition += 20;

    // Project Overview
    doc.setFontSize(16);
    doc.text('1. What is Slooze?', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    const overview = `Slooze is a comprehensive, modern food ordering and restaurant management platform designed to revolutionize the way customers order food and restaurants manage their operations. Built with cutting-edge web technologies, Slooze provides a seamless experience for food lovers, restaurant owners, and administrators.

Project Name: Slooze
Version: 1.0.0
Release Date: December 2025
Platform: Web Application
Target Audience: Food customers, restaurant managers, system administrators

Slooze aims to bridge the gap between traditional food ordering methods and modern digital solutions, offering features that cater to all stakeholders in the food industry ecosystem.`;

    const overviewLines = doc.splitTextToSize(overview, 170);
    doc.text(overviewLines, 20, yPosition);
    yPosition += overviewLines.length * 5 + 10;

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Core Features
    doc.setFontSize(16);
    doc.text('2. Core Features & Capabilities', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    const features = `2.1 Customer-Facing Features:
• Intuitive food browsing and search functionality
• Advanced filtering by cuisine type, price range, and ratings
• Real-time cart management with quantity controls
• Secure user authentication and profile management
• Order history and tracking
• Password reset and account recovery
• Responsive design for mobile and desktop

2.2 Restaurant Management Features:
• Complete menu management (add, edit, delete items)
• Restaurant profile customization
• Order management and status updates
• Sales analytics and reporting
• Menu categorization and pricing control

2.3 Administrative Features:
• User role management (Customer, Manager, Admin)
• Restaurant onboarding and approval
• System-wide analytics and monitoring
• Database management and backups
• Security and access control

2.4 Technical Features:
• RESTful API architecture
• Real-time data synchronization
• Secure authentication with JWT tokens
• SQLite database with Prisma ORM
• Responsive UI with Tailwind CSS
• Server-side rendering with Next.js`;

    const featuresLines = doc.splitTextToSize(features, 170);
    doc.text(featuresLines, 20, yPosition);
    yPosition += featuresLines.length * 5 + 10;

    // User Roles
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.text('3. User Roles & Permissions', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    const roles = `3.1 Customer (Default User):
• Browse restaurants and menu items
• Search and filter food options
• Add items to cart and place orders
• View order history and status
• Manage personal profile
• Reset password functionality

3.2 Manager (Restaurant Staff):
• All customer permissions
• Manage restaurant menu items
• Update menu prices and availability
• View restaurant-specific orders
• Access restaurant analytics
• Manage restaurant profile

3.3 Administrator (System Admin):
• All permissions across the platform
• Create and manage user accounts
• Approve new restaurants
• Access system-wide analytics
• Database management
• System configuration and maintenance

3.4 Guest User:
• Browse menu items and restaurants
• Limited functionality without account
• Cannot place orders or access history`;

    const rolesLines = doc.splitTextToSize(roles, 170);
    doc.text(rolesLines, 20, yPosition);
    yPosition += rolesLines.length * 5 + 10;

    // Technical Architecture
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.text('4. Technical Architecture', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    const architecture = `4.1 Frontend:
• Framework: Next.js 16.1.1 (React-based)
• Styling: Tailwind CSS v4
• State Management: React useState/useEffect hooks
• Routing: Next.js App Router
• UI Components: Custom JSX components
• Responsive Design: Mobile-first approach

4.2 Backend:
• Runtime: Node.js (via Next.js API routes)
• API: RESTful endpoints
• Authentication: JWT (jsonwebtoken)
• Password Hashing: bcryptjs
• Database ORM: Prisma
• Database: SQLite

4.3 Database Schema:
• User: Authentication and profile data
• Restaurant: Restaurant information and settings
• MenuItem: Food items with pricing and categories
• Order: Order management and tracking
• PaymentMethod: Payment information storage

4.4 Security Features:
• Password encryption with bcrypt
• JWT token-based authentication
• Input validation and sanitization
• SQL injection prevention via Prisma
• CORS configuration
• Secure API endpoints with role-based access`;

    const archLines = doc.splitTextToSize(architecture, 170);
    doc.text(archLines, 20, yPosition);
    yPosition += archLines.length * 5 + 10;

    // API Endpoints
    doc.setFontSize(16);
    doc.text('5. API Endpoints', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);

    const endpoints = [
      {
        title: 'Authentication',
        apis: [
          'POST /api/auth/login - User login',
          'POST /api/auth/forgot-password - Request password reset',
          'POST /api/auth/reset-password - Reset password with token'
        ]
      },
      {
        title: 'Users',
        apis: [
          'GET /api/users - Get all users (Admin only)',
          'POST /api/users - Create new user'
        ]
      },
      {
        title: 'Restaurants',
        apis: [
          'GET /api/restaurants - Get all restaurants',
          'POST /api/restaurants - Create new restaurant (Admin only)'
        ]
      },
      {
        title: 'Menu Items',
        apis: [
          'GET /api/menu-items - Get menu items (with optional category/restaurant filters)',
          'POST /api/menu-items - Create new menu item (Manager/Admin only)'
        ]
      },
      {
        title: 'Orders',
        apis: [
          'GET /api/orders - Get orders (filtered by user role)',
          'POST /api/orders - Create new order'
        ]
      }
    ];

    endpoints.forEach(section => {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text(section.title, 20, yPosition);
      yPosition += 8;

      doc.setFontSize(11);
      section.apis.forEach(api => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${api}`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    });

    // Database Schema
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.text('6. Database Schema', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    const schema = `Models:
• User: id, name, email, username, password, type, resetToken, orders, paymentMethods
• Restaurant: id, name, location, description, rating, image, isActive, menuItems
• MenuItem: id, name, description, price, image, category, isAvailable, isPopular, restaurant
• Order: id, userId, restaurantId, items, total, status, createdAt
• PaymentMethod: id, userId, type, details`;

    const schemaLines = doc.splitTextToSize(schema, 170);
    doc.text(schemaLines, 20, yPosition);
    yPosition += schemaLines.length * 5 + 10;

    // Setup Instructions
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.text('7. Setup Instructions', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    const setup = `1. Install dependencies: npm install
2. Set up database: npx prisma migrate dev
3. Seed database: npm run db:seed
4. Start development server: npm run dev
5. Access the application at http://localhost:3000`;

    const setupLines = doc.splitTextToSize(setup, 170);
    doc.text(setupLines, 20, yPosition);

    // Save the PDF
    doc.save('Slooze_Documentation.pdf');
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
              <p className="text-sm text-gray-600">Slooze - Food Ordering System</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={() => router.push('/UI/Dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Slooze - Complete Food Ordering System</h2>

          {/* What is Slooze */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">1. What is Slooze?</h3>
            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <p className="text-gray-700 mb-4">
                Slooze is a comprehensive, modern food ordering and restaurant management platform designed to revolutionize the way customers order food and restaurants manage their operations. Built with cutting-edge web technologies, Slooze provides a seamless experience for food lovers, restaurant owners, and administrators.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Project Name:</strong> Slooze</div>
                <div><strong>Version:</strong> 1.0.0</div>
                <div><strong>Release Date:</strong> December 2025</div>
                <div><strong>Platform:</strong> Web Application</div>
                <div><strong>Target Audience:</strong> Food customers, restaurant managers, system administrators</div>
              </div>
            </div>
            <p className="text-gray-600">
              Slooze aims to bridge the gap between traditional food ordering methods and modern digital solutions, offering features that cater to all stakeholders in the food industry ecosystem.
            </p>
          </section>

          {/* Core Features */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">2. Core Features & Capabilities</h3>

            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-green-800 mb-3">👤 Customer-Facing Features</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Intuitive food browsing and search functionality</li>
                  <li>Advanced filtering by cuisine type, price range, and ratings</li>
                  <li>Real-time cart management with quantity controls</li>
                  <li>Secure user authentication and profile management</li>
                  <li>Order history and tracking</li>
                  <li>Password reset and account recovery</li>
                  <li>Responsive design for mobile and desktop</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-orange-800 mb-3">🏪 Restaurant Management Features</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Complete menu management (add, edit, delete items)</li>
                  <li>Restaurant profile customization</li>
                  <li>Order management and status updates</li>
                  <li>Sales analytics and reporting</li>
                  <li>Menu categorization and pricing control</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-purple-800 mb-3">⚙️ Administrative Features</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>User role management (Customer, Manager, Admin)</li>
                  <li>Restaurant onboarding and approval</li>
                  <li>System-wide analytics and monitoring</li>
                  <li>Database management and backups</li>
                  <li>Security and access control</li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-indigo-800 mb-3">🔧 Technical Features</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>RESTful API architecture</li>
                  <li>Real-time data synchronization</li>
                  <li>Secure authentication with JWT tokens</li>
                  <li>SQLite database with Prisma ORM</li>
                  <li>Responsive UI with Tailwind CSS</li>
                  <li>Server-side rendering with Next.js</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Roles */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">3. User Roles & Permissions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-blue-800 mb-3">👥 Customer (Default User)</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Browse restaurants and menu items</li>
                  <li>Search and filter food options</li>
                  <li>Add items to cart and place orders</li>
                  <li>View order history and status</li>
                  <li>Manage personal profile</li>
                  <li>Reset password functionality</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-green-800 mb-3">👨‍🍳 Manager (Restaurant Staff)</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>All customer permissions</li>
                  <li>Manage restaurant menu items</li>
                  <li>Update menu prices and availability</li>
                  <li>View restaurant-specific orders</li>
                  <li>Access restaurant analytics</li>
                  <li>Manage restaurant profile</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-red-800 mb-3">👑 Administrator (System Admin)</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>All permissions across the platform</li>
                  <li>Create and manage user accounts</li>
                  <li>Approve new restaurants</li>
                  <li>Access system-wide analytics</li>
                  <li>Database management</li>
                  <li>System configuration and maintenance</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-800 mb-3">👤 Guest User</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Browse menu items and restaurants</li>
                  <li>Limited functionality without account</li>
                  <li>Cannot place orders or access history</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Architecture */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">4. Technical Architecture</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">🎨 Frontend</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Framework:</strong> Next.js 16.1.1 (React-based)</li>
                    <li><strong>Styling:</strong> Tailwind CSS v4</li>
                    <li><strong>State Management:</strong> React useState/useEffect hooks</li>
                    <li><strong>Routing:</strong> Next.js App Router</li>
                    <li><strong>UI Components:</strong> Custom JSX components</li>
                    <li><strong>Responsive Design:</strong> Mobile-first approach</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">⚙️ Backend</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Runtime:</strong> Node.js (via Next.js API routes)</li>
                    <li><strong>API:</strong> RESTful endpoints</li>
                    <li><strong>Authentication:</strong> JWT (jsonwebtoken)</li>
                    <li><strong>Password Hashing:</strong> bcryptjs</li>
                    <li><strong>Database ORM:</strong> Prisma</li>
                    <li><strong>Database:</strong> SQLite</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">🗄️ Database Schema</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>User:</strong> Authentication and profile data</li>
                    <li><strong>Restaurant:</strong> Restaurant information and settings</li>
                    <li><strong>MenuItem:</strong> Food items with pricing and categories</li>
                    <li><strong>Order:</strong> Order management and tracking</li>
                    <li><strong>PaymentMethod:</strong> Payment information storage</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">🔒 Security Features</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Password encryption with bcrypt</li>
                    <li>JWT token-based authentication</li>
                    <li>Input validation and sanitization</li>
                    <li>SQL injection prevention via Prisma</li>
                    <li>CORS configuration</li>
                    <li>Secure API endpoints with role-based access</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* API Endpoints */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">5. API Endpoints</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Authentication</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 bg-gray-50 p-4 rounded">
                  <li>POST /api/auth/login - User login</li>
                  <li>POST /api/auth/forgot-password - Request password reset</li>
                  <li>POST /api/auth/reset-password - Reset password with token</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Users</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 bg-gray-50 p-4 rounded">
                  <li>GET /api/users - Get all users (Admin only)</li>
                  <li>POST /api/users - Create new user</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Restaurants</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 bg-gray-50 p-4 rounded">
                  <li>GET /api/restaurants - Get all restaurants</li>
                  <li>POST /api/restaurants - Create new restaurant (Admin only)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Menu Items</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 bg-gray-50 p-4 rounded">
                  <li>GET /api/menu-items - Get menu items (with optional category/restaurant filters)</li>
                  <li>POST /api/menu-items - Create new menu item (Manager/Admin only)</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Orders</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1 bg-gray-50 p-4 rounded">
                  <li>GET /api/orders - Get orders (filtered by user role)</li>
                  <li>POST /api/orders - Create new order</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Database Schema */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">6. Database Schema</h3>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-lg font-medium text-gray-700 mb-2">Models:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li><strong>User:</strong> id, name, email, username, password, type, resetToken, orders, paymentMethods</li>
                <li><strong>Restaurant:</strong> id, name, location, description, rating, image, isActive, menuItems</li>
                <li><strong>MenuItem:</strong> id, name, description, price, image, category, isAvailable, isPopular, restaurant</li>
                <li><strong>Order:</strong> id, userId, restaurantId, items, total, status, createdAt</li>
                <li><strong>PaymentMethod:</strong> id, userId, type, details</li>
              </ul>
            </div>
          </section>

          {/* Setup Instructions */}
          <section>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">7. Setup Instructions</h3>
            <div className="bg-gray-50 p-4 rounded">
              <ol className="list-decimal list-inside text-gray-600 space-y-2">
                <li>Install dependencies: <code className="bg-gray-200 px-2 py-1 rounded">npm install</code></li>
                <li>Set up database: <code className="bg-gray-200 px-2 py-1 rounded">npx prisma migrate dev</code></li>
                <li>Seed database: <code className="bg-gray-200 px-2 py-1 rounded">npm run db:seed</code></li>
                <li>Start development server: <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code></li>
                <li>Access the application at <code className="bg-gray-200 px-2 py-1 rounded">http://localhost:3000</code></li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;