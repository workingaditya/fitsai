# Fits AI

A modern React (Vite) SPA with Tailwind, role-based UI, and integrations.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build

## 🔧 Replit Compatibility

This project is fully compatible with Replit and Replit Agent:

### Features
- **Replit Agent Integrations**: Includes authentication, database, and JavaScript integrations
- **Auto-Deploy**: Configured for autoscale deployment on Replit
- **Development Plugins**: Runtime error overlay and cartographer for better debugging
- **Port Configuration**: Automatically uses PORT environment variable (defaults to 5000)

### Configuration Files
- `.replit` - Replit environment configuration with Agent integrations
- `replit.nix` - Pinned Node.js 20 and npm versions
- `vite.config.ts` - Replit-optimized Vite configuration with plugins

### Running on Replit

1. **Development mode**:
   ```bash
   npm run dev
   ```

2. **Production build**:
   ```bash
   npm run build
   npm run start
   ```

3. **Quick start** (for Replit Agent):
   - The project includes pre-configured workflows
   - Click "Run" button to start development server
   - Server will be available on the configured port

### Environment Variables
The project automatically detects Replit environment using `REPL_ID` and loads appropriate plugins for enhanced development experience.

```


