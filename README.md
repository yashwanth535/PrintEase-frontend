# PrintEase 🖨️

A full-stack web application that connects users with local printing vendors, enabling seamless document printing services with real-time location tracking and secure payment processing.

## 🌟 Live Demo

- **Main Application**: [https://printease.yashwanth.site](https://printease.yashwanth.site)
- **Docker Deployment**: [https://printease-docker-full-stack.onrender.com](https://printease-docker-full-stack.onrender.com)

## ✨ Features

### For Users
- **Vendor Discovery**: Find nearby printing vendors with interactive map integration
- **Document Upload**: Secure PDF upload and management
- **Order Management**: Create and track printing orders
- **Shopping Cart**: Add multiple items to cart before checkout
- **Real-time Tracking**: Monitor order status and vendor location
- **Secure Payments**: Integrated payment gateway with Cashfree
- **Vendor Reviews**: View vendor profiles and ratings

### For Vendors
- **Dashboard**: Comprehensive order management and analytics
- **Profile Management**: Update business information and services
- **Payment Tracking**: Monitor earnings and transaction history
- **Location Services**: Set and update business location on map
- **Order Notifications**: Real-time order alerts and updates

### General Features
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Authentication**: Secure JWT-based authentication system
- **Real-time Updates**: Live order status and notifications
- **File Management**: Secure document handling and storage

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **React Icons** - Icon library
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **@react-google-maps/api** - Google Maps integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email functionality
- **Supabase** - Additional database and storage services
- **CORS** - Cross-origin resource sharing

### DevOps & Deployment
- **Docker** - Containerization
- **Render** - Cloud deployment platform
- **Vercel** - Frontend deployment (alternative)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Google Maps API key
- Cashfree payment gateway credentials

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd printEase
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**
   
   **Backend (.env file in PrintEase-backend directory):**
   ```env
   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT Secret for token signing
   JWT_SECRET=your_jwt_secret_here
   
   # Session Secret
   SESSION_SECRET=your_session_secret_here
   
   # Frontend URLs for CORS (comma-separated)
   FRONTEND_URL=http://localhost:5173,https://your-frontend-domain.com
   
   # Backend URLs for CSP (comma-separated) - optional, defaults to localhost:3000
   BACKEND_URL=http://localhost:3000,https://your-backend-domain.com
   
   # Google Maps API Key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   
   # Cashfree Payment Gateway
   CASHFREE_CLIENT_ID=your_cashfree_client_id
   CASHFREE_CLIENT_SECRET=your_cashfree_client_secret
   PROD=false
   
   # Email Configuration
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   
   # Supabase Configuration
   supabase_url=your_supabase_url
   supabase_service_secret=your_supabase_service_secret
   
   # Environment Settings
   NODE_ENV=development
   docker=false
   ```

   **Frontend (.env file in PrintEase-frontend directory):**
   ```env
   # Backend API URL - used for all API calls
   # For development: http://localhost:3000
   # For production: https://your-backend-domain.com
   VITE_API_URL=http://localhost:3000
   
   # Google Maps API Key - required for location services and geocoding
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   
   # Supabase Configuration - for file storage
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t printease .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 printease
   ```

## 📁 Project Structure

```
printEase/
├── backend/                 # Backend server
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   └── package.json
├── Dockerfile             # Docker configuration
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Routes
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/orders` - Get user orders

### Vendor Routes
- `GET /api/vendor/profile` - Get vendor profile
- `PUT /api/vendor/profile` - Update vendor profile
- `GET /api/vendor/orders` - Get vendor orders
- `GET /api/vendor/payments` - Get payment history

### Vendors (Public)
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get specific vendor
- `GET /api/vendors/nearby` - Get nearby vendors

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Maps**: Google Maps integration for vendor discovery
- **Modern Components**: Built with Tailwind CSS and Lucide React icons

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Secure file upload handling
- Environment variable protection

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Render (Docker)
The application is deployed on Render using Docker containers, providing:

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Yashwanth** - yashwanth535

## 🙏 Acknowledgments

- Google Maps API for location services
- Cashfree for payment processing
- MongoDB for database services
- Supabase for additional backend services
- React and Vite communities for excellent tooling

---

**PrintEase** - Making printing services accessible and convenient for everyone! 🖨️✨ 