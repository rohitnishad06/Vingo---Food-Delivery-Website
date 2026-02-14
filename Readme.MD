

<div align="center">

  <h1>🍔 VINGO-FOOD-DELIVERY-WEBSITE</h1>
  <i>Delighting Taste, Connecting People Instantly</i>
  
  <br><br>
  
  ![last commit](https://img.shields.io/badge/last%20commit-today-blue)
  ![javascript](https://img.shields.io/badge/javascript-99.7%25-yellow)
  ![languages](https://img.shields.io/badge/languages-3-red)
  
  <br>
  
  <i>Built with the tools and technologies:</i>
  
  <br><br>
  
  ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
  ![JSON](https://img.shields.io/badge/JSON-000000?style=flat&logo=json&logoColor=white)
  ![Markdown](https://img.shields.io/badge/Markdown-000000?style=flat&logo=markdown&logoColor=white)
  ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
  ![npm](https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white)
  ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
  ![.ENV](https://img.shields.io/badge/.ENV-ECD53F?style=flat&logo=.env&logoColor=black)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
  
  ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=flat&logo=nodemon&logoColor=white)
  ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)
  ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
  ![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=flat&logo=razorpay&logoColor=white)
  ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
  ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)
  ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)
  
</div>

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

---

## 🌟 Overview

**VINGO** is a modern full-stack food delivery web application designed to provide a seamless ordering experience. Users can browse restaurants, place orders, complete secure payments, and track deliveries in real time.

### 🚀 Key Highlights

- MERN stack based full-stack architecture
- Real-time order tracking using Socket.io
- Secure and reliable payment gateway integration
- Live delivery tracking using maps
- Modern and responsive UI built with React


---

## ✨ Features

### 👤 User Features

- 🔐 User Authentication (Signup / Login using Firebase)
- 🍽️ Browse restaurants and food items
- 🔎 Search and filter food items
- 🛒 Add to cart & manage quantity
- 💳 Secure online payment integration (Razorpay)
- 📦 Real-time order status updates
- 🗺️ Live delivery tracking using maps (Leaflet)
- 🧾 Order history & previous orders view

---

### 🏪 Shop Owner Features

- ➕ Add new food items with image upload (Cloudinary)
- ✏️ Edit / update existing food items
- ❌ Delete food items
- 📋 Manage incoming orders
- 🔄 Update order status (Preparing → Out for Delivery → Delivered)

---

### 🚴 Delivery Boy Features

- 🔐 Secure login for delivery partners
- 📋 View assigned delivery orders
- 📍 Access customer delivery location via map
- 🚚 Update delivery status (Picked Up → On the Way → Delivered)
- 📡 Real-time location updates
- 🔔 Instant notification when new order is assigned
- 📦 Delivery history tracking

---

### 🚚 Real-Time System

- ⚡ Instant order notifications using Socket.io
- 📡 Live order tracking
- 🔔 Real-time status updates without page refresh
- 👨‍🍳 Shop owner & user socket connection handling

---

### 🛡️ Security & Performance

- 🔑 JWT-based authentication
- 🌐 Protected API routes
- ⚙️ Optimized REST APIs
- 📁 Secure environment variable configuration (.env)

---

## 🛠️ Tech Stack

### 🎨 Frontend
- ⚛️ React.js (User Interface)
- ⚡ Vite (Build Tool)
- 📡 Axios (API Requests)
- 🗺️ Leaflet (Live Map Tracking)
- 🎨 CSS / Tailwind (Styling)

---

### 🖥️ Backend
- 🟢 Node.js (Runtime Environment)
- 🚀 Express.js (Backend Framework)
- 🔌 Socket.io (Real-time Communication)
- 🔐 JWT (Authentication & Authorization)

---

### 🗄️ Database
- 🍃 MongoDB (NoSQL Database)
- 🧩 Mongoose (ODM)

---

### 🔥 Third-Party Services
- 🔐 Firebase (Authentication)
- ☁️ Cloudinary (Image Upload & Storage)
- 💳 Razorpay (Payment Gateway)

---

### 🛠️ Development Tools
- 📦 npm (Package Manager)
- 🔄 Nodemon (Auto Server Restart)
- 🧹 ESLint (Code Linting)
- 📁 dotenv (.env Configuration)
- 🧪 Postman (API Testing)


---

## 🚀 Installation

Follow these steps to run the project locally on your system

1. Clone the repository
```bash
git clone https://github.com/yourusername/vingo-food-delivery-website.git
cd vingo-food-delivery-website
```

### Backend Setup
2. Install Backend dependencies
```bash
cd backend
npm install
```

### Create Backend .env File

3. Create a .env file inside the backend folder and add:
```bash

PORT=8000
MONGODB_URL=MONGO_URL
JWT_SECRET=JWT_SECRET

EMAIL=Your_Email
PASS=Your_Email_Password

NODE_ENV="development"

CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

RAZORPAY_KEY_ID=your_Razorpay_Id
RAZORPAY_KEY_SECRET=your_Razorpay_Secret

```

4. Run the development server
```bash
npm run dev
```


### Frontend Setup
2. Install Frontend dependencies
```bash
cd frontend
npm install
```

### Create Frontend .env File

3. Create a .env file inside the Frontend folder and add:
```bash

VITE_FIREBASE_API=your_firebase_api
VITE_GEOAPIKEY=your_GEOAPIKEY
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

```

4. Run the development server
```bash
npm run dev
```


---

## 💻 Usage

Once the application is running locally, follow these steps:

---

### 👤 For Users

1. Register or Login using Firebase authentication.
2. Browse restaurants and explore available food items.
3. Add desired items to your cart.
4. Proceed to checkout.
5. Choose payment method (Online via Razorpay).
6. Track your order in real-time.
7. View order history anytime from your profile.

---

### 🚴 For Delivery Partners

1. Login with delivery credentials.
2. View assigned delivery orders.
3. Access customer location via live map.
4. Update delivery status:
   - Picked Up
   - Delivered
5. Share live location updates.

---

### 🏪 For Shop Owners

1. Login to owner dashboard.
2. Add / Edit / Delete food items.
3. Manage customer orders.
4. Assign delivery partners.
5. Update order status in real-time.

---

### 🔄 Real-Time Workflow

- User places order.
- owner receives instant notification.
- Delivery partner gets assigned.
- Live tracking starts.
- Order marked as delivered.

---

## 🤝 Contributing

Contributions are welcome! 🚀  
If you'd like to improve this project, follow the steps below:

---

### 📌 How to Contribute

1. Fork the repository.
2. Clone your forked repository:

```bash
git clone https://github.com/your-username/vingo-food-delivery-website.git
```

### Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

### Make your changes and commit:
```bash
git commit -m "Add: your feature description"
```

### Push to your branch:
```bash
git push origin feature/your-feature-name
```

Open a Pull Request.

---


<div align="center">
  Made with ❤️ by Rohit
</div>