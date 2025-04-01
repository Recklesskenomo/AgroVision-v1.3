# AgroVision Farm Management System

## Overview
AgroVision is a comprehensive farm management system designed to streamline agricultural operations through department-based organization and role-based access control. The system provides specialized interfaces and functionalities for different departments while maintaining secure access control and data management.

## System Architecture

### Frontend
- Built with React + Vite
- Modern UI using Tailwind CSS
- Role-based access control components
- Department-specific interfaces

### Backend
- Node.js with Express
- PostgreSQL database
- JWT-based authentication
- RESTful API architecture

## Departments and Roles

### Department Structure

1. **Administration Group**
   - Administration
   - Logistics
   - Sales
   - Maintenance
   - HR

2. **Animals Group**
   - Animals Department
   - Features:
     - Animal tracking
     - Health records
     - Inventory management
     - Reporting tools

3. **Feed Group**
   - Feed Department
   - Features:
     - Feed inventory
     - Consumption tracking
     - Stock management
     - Quality control

### User Roles
- **Admin**: Full system access and management capabilities
- **Manager**: Department and cross-department management
- **Department Manager**: Specific department management
- **Field Worker**: Basic operational access
- **Data Analyst**: Data analysis and reporting access
- **Consultant**: External access for veterinarians/agronomists
- **User**: Basic access (default role)

### User Types
- Internal (Regular employees)
- External (Consultants)
- Admin (System administrators)

## Current Implementation Status

### Completed Features
1. **User Management**
   - User registration and authentication
   - Role-based access control
   - Department assignment
   - Profile management

2. **Department Management**
   - Department creation and configuration
   - User-department association
   - Department-specific dashboards

3. **Animals Department**
   - Animal tracking system
   - Health record management
   - Inventory tracking
   - Reporting functionality

### In Progress
1. **Feed Department**
   - Basic structure implemented
   - Ongoing development of specialized features
   - Integration with existing systems

### Planned Features
1. **Enhanced Reporting**
   - Cross-department analytics
   - Custom report generation
   - Data visualization improvements

2. **Mobile Responsiveness**
   - Enhanced mobile interface
   - Offline capabilities

## Security Features
- JWT-based authentication
- Role-based access control
- Secure password hashing
- Protected API endpoints
- Session management

## API Documentation

### Department Endpoints
- GET `/departments` - List all departments
- GET `/departments/:id` - Get department details
- GET `/departments/:id/users` - List department users
- POST `/departments` - Create new department
- DELETE `/departments/:id` - Remove department

### User Endpoints
- POST `/auth/login` - User login
- POST `/auth/register` - User registration
- GET `/users` - List users
- PUT `/users/:id` - Update user
- DELETE `/users/:id` - Remove user

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd Agrovision-backend
   npm install

   # Frontend
   cd Agrovision-frontend
   npm install
   ```

3. Configure environment variables:
   - Create `.env` files in both frontend and backend directories
   - Set required environment variables

4. Initialize the database:
   ```bash
   npm run db:init
   ```

5. Start the development servers:
   ```bash
   # Backend
   npm run dev

   # Frontend
   npm run dev
   ```

## Contributing
Please read our contributing guidelines before submitting pull requests.

## License
This project is proprietary and confidential.

## Version
Current Version: 2.3