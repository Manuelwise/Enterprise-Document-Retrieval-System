# Enterprise Document Retrieval System
Note!!!
Decontructing an incomplete project frontend and recontructing it to suit enterprise level. Changes are weekly and project is still under consrtucting. Please leave any issues if you feel a better approach can be taken on any aspect of the work. Contructive Criticism is always welcome.

A comprehensive document request and management system built with React, Node.js, and MongoDB. This system streamlines the process of creating, tracking, and managing document requests within an organization.

## ✨ Features

- **User Authentication**
  - Role-based access control (Admin, Approval Officer, Dispatch Officer, Regular User)
  - Secure login/logout functionality
  - Session management

- **Dashboard**
  - Real-time statistics and analytics
  - Recent activities feed
  - Quick access to common actions

- **Document Request Management**
  - Create and submit new document requests
  - Track request status (Pending, Approved, Rejected, Dispatched, Returned)
  - View request history and details
  - Attach supporting documents

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Hero Icons, Lucide Icons
- **Form Handling**: React Hook Form
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Data Visualization**: Recharts

### Backend
- **Runtime**: Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API architecture

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm (v9 or later)
- MongoDB (v6.0 or later)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Create a [.env](cci:7://file:///d:/full%20stack%20path/Sample%20Management%20System/Enterprise-Sample-Management-System/.env:0:0-0:0) file in the root directory
   - Add the following environment variables:
     ```
     VITE_API_BASE_URL=http://localhost:5000/api
     # Add other environment variables as needed
     ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📂 Project Structure

```
src/
├── assets/          # Static assets
├── common/          # Shared utilities and constants
├── components/      # Reusable UI components
│   └── admin/       # Admin-specific components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── pages/           # Application pages
├── services/        # API services
└── styles/          # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

