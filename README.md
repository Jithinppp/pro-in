<<<<<<< HEAD
i made a change

/
├── home -> shows login page
=======
src/
>>>>>>> 72c1cccdeee793f210ceda7dfc0e877a333c22f5
│
├── app/
│ ├── App.jsx
│ │ // Root component
│ │ // Wraps layouts and renders RouterProvider
│
│ ├── main.jsx
│ │ // App entry point (Vite)
│ │ // Mounts React app and wraps all Context Providers
│
│ └── router.jsx
│ // All application routes
│ // Handles public, protected, and role-based routes
│
├── assets/
│ ├── images/
│ │ // Static images (logos, banners, placeholders)
│ │
│ └── icons/
│ // Custom SVGs or icon assets
│
├── components/
│ ├── common/
│ │ ├── Loader.jsx
│ │ │ // Global loading spinner
│ │ │ // Used during auth, data fetch, route change
│ │ │
│ │ ├── ProtectedRoute.jsx
│ │ │ // Blocks routes if user is not logged in
│ │ │ // Redirects to Home/Login
│ │ │
│ │ ├── RoleGuard.jsx
│ │ │ // Allows route access only for specific roles
│ │ │ // Prevents PM/Tech/Inventory cross-access
│ │ │
│ │ └── SearchBar.jsx
│ │ // Reusable search input
│ │ // Used in Tech and Inventory dashboards
│ │
│ ├── layout/
│ │ ├── MainLayout.jsx
│ │ │ // Layout for public pages (Home/Login)
│ │ │
│ │ ├── DashboardLayout.jsx
│ │ │ // Layout for all dashboards
│ │ │ // Contains Sidebar, Header, and <Outlet />
│ │ │
│ │ └── Sidebar.jsx
│ │ // Role-based sidebar navigation
│ │ // Menu items change based on user role
│ │
│ └── ui/
│ ├── Button.jsx
│ │ // Reusable button component
│ │
│ ├── Input.jsx
│ │ // Reusable input component
│ │
│ └── Modal.jsx
│ // Reusable modal/dialog component
│
├── contexts/
│ ├── AuthContext.jsx
│ │ // Handles authentication state
│ │ // login, logout, user session (Supabase)
│ │
│ ├── RoleContext.jsx
│ │ // Stores and manages user role
│ │ // Handles role-based redirects
│ │
│ ├── EventContext.jsx
│ │ // Global event state
│ │ // Fetch, create, and view events
│ │
│ ├── EquipmentContext.jsx
│ │ // Global equipment/inventory state
│ │ // CRUD operations and equipment search
│ │
│ └── UIContext.jsx
│ // Global UI state
│ // Sidebar toggle, modals, loaders
│
├── hooks/
│ ├── useAuth.js
│ │ // Custom hook to access AuthContext
│ │
│ ├── useRole.js
│ │ // Custom hook to access RoleContext
│ │
│ ├── useEvents.js
│ │ // Custom hook for event-related logic
│ │
│ ├── useEquipment.js
│ │ // Custom hook for equipment-related logic
│ │
│ └── useSearch.js
│ // Shared search/filter logic
│
├── pages/
│ ├── Home/
│ │ ├── Home.jsx
│ │ │ // Landing page
│ │ │ // Shows login option only
│ │ │
│ │ └── Login.jsx
│ │ // Login form
│ │ // Calls Supabase auth
│ │
│ ├── ProjectManager/
│ │ ├── PMDashboard.jsx
│ │ │ // PM overview dashboard
│ │ │
│ │ ├── CreateEvent.jsx
│ │ │ // PM creates events
│ │ │
│ │ ├── EquipmentList.jsx
│ │ │ // PM views available equipment
│ │ │
│ │ └── Reports.jsx
│ │ // PM reports and analytics
│ │
│ ├── Technician/
│ │ ├── TechDashboard.jsx
│ │ │ // Technician overview dashboard
│ │ │
│ │ ├── Events.jsx
│ │ │ // Tech sees assigned and all events
│ │ │
│ │ ├── EventDetails.jsx
│ │ │ // Detailed view of a single event
│ │ │
│ │ └── SearchEquipment.jsx
│ │ // Search equipment from inventory
│ │
│ ├── InventoryManager/
│ │ ├── InventoryDashboard.jsx
│ │ │ // Inventory overview
│ │ │
│ │ ├── EquipmentList.jsx
│ │ │ // List of all equipment in warehouse
│ │ │
│ │ ├── AddEquipment.jsx
│ │ │ // Add new equipment
│ │ │
│ │ ├── EditEquipment.jsx
│ │ │ // Edit or delete equipment
│ │ │
│ │ └── Events.jsx
│ │ // Events with assigned equipment
│ │
│ └── NotFound.jsx
│ // 404 page for invalid routes
│
├── services/
│ ├── supabaseClient.js
│ │ // Supabase client initialization
│ │
│ ├── authService.js
│ │ // Auth-related Supabase queries
│ │
│ ├── equipmentService.js
│ │ // Equipment CRUD queries
│ │
│ ├── eventService.js
│ │ // Event-related queries
│ │
│ └── reportService.js
│ // Report and analytics queries
│
├── utils/
│ ├── constants.js
│ │ // App-wide constants (roles, statuses)
│ │
│ ├── roleRoutes.js
│ │ // Maps roles to dashboard routes
│ │
│ └── helpers.js
│ // Reusable helper functions
│
├── styles/
│ └── global.css
│ // Global styles and CSS resets
│
└── index.css
// Base CSS imported by main.jsx
