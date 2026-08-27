# 📅 Appointopia - Online Appointment Schedule

A modern, full-featured appointment scheduling application built with React. Manage your meetings, appointments, and schedules with an intuitive interface.

![Appointopia Banner](https://img.shields.io/badge/Appointopia-Appointment%20Scheduler-8755D5)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![Vite](https://img.shields.io/badge/Vite-4.0.0-646CFF)
![Firebase](https://img.shields.io/badge/Firebase-9.0.0-FFCA28)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Features

### 📊 Calendar Management
- **Multiple Views**: Day, Week, and Month views for flexible scheduling
- **Event Creation**: Create, edit, and delete meetings with ease
- **Color Coding**: Assign colors to different event types for better visualization
- **Smart Reminders**: Get notified about upcoming meetings with automatic reminders
- **Search Meetings**: Quick search functionality to find any meeting instantly
- **+X More**: Smart event grouping with expandable views
- **Meeting Invites**: Add invitees with email notifications
- **Share Meetings**: Copy meeting links or share via native share API

### 📋 Appointment Scheduling
- **Appointment Cards**: Visual representation of all appointments with V-shape hover effect
- **Booking Pages**: Each appointment gets a unique booking page
- **Duration Management**: Set custom durations for appointments (30, 60, 90 mins)
- **Availability Settings**: Define your working hours and availability per day
- **Workflow Automation**: Set up automations around your events
- **Edit Mode**: Inline editing with full form controls
- **Color Picker**: 10+ colors to customize appointment appearance
- **Calendar Grid**: Professional week view with time slots

### 🔔 Toast Notification System
- **Real-time Feedback**: Instant notifications for all user actions
- **Multiple Types**: Success, Error, Warning, Info, and Loading states
- **Auto-Dismiss**: Configurable duration with progress bar
- **Stack Support**: Multiple notifications stack gracefully
- **Responsive Design**: Works on all screen sizes
- **Loading Transitions**: Seamless loading to success/error transitions

### 👤 User Management
- **Authentication**: Secure sign-in and sign-up with Firebase
- **Profile Management**: Update personal information and preferences
- **User Settings**: Customize your experience (notifications, default view, dark mode)
- **Session Management**: Auto-logout and session persistence
- **Delete Account**: Securely delete account with confirmation

### 📱 Responsive Design
- **Mobile-Friendly**: Works seamlessly on all devices
- **Touch Optimized**: Smooth interactions on touch devices
- **Adaptive Layouts**: Auto-adjusts to screen sizes

### 🎨 User Interface
- **Modern Design**: Clean, professional UI with purple theme
- **Animations**: Smooth transitions and interactions
- **V-Shape Hover**: Unique card hover effects in appointment grid
- **Iconography**: Rich icon set for better visual communication
- **Typography**: Clean, readable fonts for better user experience

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **React Router DOM 6** - Navigation & Routing
- **React Icons** - Icon library
- **CSS3** - Custom styling with responsive design

### Backend & Services
- **Firebase Authentication** - User authentication
- **Firebase Firestore** - Real-time database
- **EmailJS** - Email notifications for invites

### State Management
- **React Context API** - Global state management (Toast, Notifications, Appointments)
- **Local Storage** - Persistent data storage and caching

### Development Tools
- **Vite** - Build tool and development server
- **ESLint** - Code quality & linting
- **Git** - Version control

---

## 📁 Project Structure
src/
├── assets/ # Images, icons, fonts
├── component/
│ ├── AppointmentSchedule/ # Appointment management
│ ├── AuthPage/ # SignIn, SignUp
│ ├── Calendar/ # Calendar views (Day, Week, Month)
│ ├── Comman/ # Topbar, Shared components
│ ├── CreateAppointment/ # Appointment creation modal
│ ├── Profile/ # User profile
│ ├── Settings/ # User settings
│ ├── Toast/ # Notification system
│ └── Workflows/ # Workflow automation
├── context/ # React Context providers
├── hooks/ # Custom React hooks
├── services/ # Firebase services
└── utils/ # Utility functions


---

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account (for backend services)

### Installation

```bash
# Clone the repository
git clone https://github.com/lalit-sahu-iphtech/Online-Appointment-Schedule.git
cd Online-Appointment-Schedule

# Install dependencies
npm install

# Create .env file and add your Firebase credentials
cp .env.example .env

# Start the development server
npm run dev

Environment Variables
Create a .env file with the following:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

Author
Lalit Sahu


Made with ❤️ by Lalit Sahu
