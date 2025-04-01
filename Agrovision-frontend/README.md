# AgroVision Frontend

## Overview
The frontend application for the AgroVision Farm Management System, built with React and Vite. This application provides a modern, responsive interface for managing agricultural operations across different departments.

## Key Features

### User Interface
- Modern, responsive design using Tailwind CSS
- Role-based access control components
- Department-specific dashboards
- Interactive data tables and forms

### Components
1. **User Management**
   - User registration and login forms
   - Profile management
   - Role and department assignment interfaces

2. **Department Management**
   - Department creation and configuration
   - User-department association
   - Department-specific views

3. **Animals Department**
   - Animal tracking interface
   - Health record management
   - Inventory tracking
   - Reporting tools

4. **Feed Department**
   - Feed inventory management
   - Consumption tracking interface
   - Stock management tools

### Security
- JWT-based authentication
- Role-based access control components
- Protected routes
- Secure API communication

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- Axios for API communication
- React Router for navigation
- Context API for state management

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   Create a `.env` file with:
   ```
   VITE_API_URL=your_backend_url
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Building for Production
```bash
npm run build
```

## Project Structure
```
src/
├── components/     # Reusable UI components
├── context/       # React Context providers
├── pages/         # Main application pages
├── services/      # API service functions
├── styles/        # Global styles and Tailwind config
└── utils/         # Utility functions
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests (when implemented)

## Contributing
Please follow our coding standards and submit pull requests for review.

## Version
Current Version: 2.3 (matching main application version)
