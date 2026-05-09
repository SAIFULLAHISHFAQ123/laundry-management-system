# 🧺 LaundryStream: Premium Laundry Management System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**LaundryStream** is a state-of-the-art, multi-tenant Laundry Management System (LMS) designed to revolutionize the laundry experience. Built with a premium "White & Sky Blue" aesthetic, it provides a seamless interface for users to discover laundry branches, book machine slots in real-time, and track their orders.

---

## 🔗 Repository
**GitHub:** [https://github.com/SAIFULLAHISHFAQ123/laundry-management-system](https://github.com/SAIFULLAHISHFAQ123/laundry-management-system)

---

## ✨ Key Features

### 🌍 User Discovery & Mapping
- **Interactive Live Map**: Real-time branch discovery powered by Leaflet and OpenStreetMap.
- **Smart Occupancy Indicators**: Instant visual cues for branch availability (Available, Busy, or Near-Free).
- **Live Location Tracking**: Real-time geolocation sync to show users exactly where they are relative to laundry centers.
- **Distance-Aware Queueing**: Advanced logic that calculates travel time and allows users to join a priority queue if a branch is full.

### 📅 Advanced Booking Wizard
- **Multi-Step Flow**: Intuitive selection process from Fabric Treatment -> Machine Config -> Time Slot.
- **Real-Time Availability**: Dynamic time-slot generation that accounts for wash cycle durations to prevent overlaps.
- **Multi-Machine Reservations**: Book multiple machines (5kg, 7kg, 10kg) in a single transaction.
- **Interactive Legend**: Professional slot styling with green "Free" borders and disabled "Busy" states.

### 🛠️ Administrative Control
- **Inventory Management**: Full control over laundry branches, machine units, and specialized wash programs.
- **Live Monitoring Dashboard**: Real-time tracking of active, pending, and completed reservations.
- **GPS Configuration**: Precise coordinate management for branch map placement.

---

## 🎨 Design Language (Premium White & Sky Blue)
The application follows a curated design system emphasizing:
- **Glassmorphism**: Elegant backdrop filters and soft elevations.
- **Fluid Responsiveness**: Seamless transitions between Desktop, Tablet, and Mobile viewports.
- **Micro-Animations**: Subtle entry transitions and pulse effects for interactive elements.
- **Modern Typography**: Utilizing *Plus Jakarta Sans* for high readability and professional feel.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0 or higher)
- .NET 6.0/7.0 SDK (for Backend)
- SQL Server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SAIFULLAHISHFAQ123/laundry-management-system.git
   cd laundry-management-system
   ```

2. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

3. **Backend Setup**
   - Open the `.sln` file in Visual Studio.
   - Update the connection string in `appsettings.json`.
   - Run the project (Default port: `7208`).

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, React Router 6, Context API, Leaflet.js.
- **Backend**: ASP.NET Core Web API, Entity Framework Core.
- **Database**: SQL Server.
- **Styling**: Vanilla CSS with CSS Variables (Custom Design System).

### API Endpoints (Core)
- `POST /api/auth/login`: Secure JWT-based authentication.
- `GET /api/branches`: Fetch real-time laundry branch data.
- `GET /api/reservations`: Sync global booking states.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---

**Developed with ❤️ by [SAIFULLAH ISHFAQ]**