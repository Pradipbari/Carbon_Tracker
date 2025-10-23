
# Project Title
## GreenTrack: Personal Carbon Footprint Tracker 🌿
GreenTrack is a full-stack web application designed to help users monitor, visualize, and actively reduce their environmental impact. By logging daily activities (transport, diet, energy), users receive instant feedback on their CO2 emissions and can track their progress against a global community.



## Demo

https://carbon-tracker3.onrender.com


## Features

- Full MERN Stack: Built on a robust MongoDB, Express, React, and Node.js foundation.
- Secure Authentication (JWT): Implements a secure login/register system using JSON Web Tokens (JWT) for stateless session management and protected routing.
- Custom Calculation Engine: Node.js backend calculates CO2 emissions instantly based on user-logged activity inputs (transport, diet, energy).
- Data Visualization: Dynamic Chart.js integration on the Dashboard provides:-Pie Chart: Breakdown of footprint by category.
- Line Graph: Trend analysis of the daily footprint over time.
- Global Leaderboard: Features a community ranking system powered by a complex MongoDB Aggregation Pipeline that sorts users by the lowest total lifetime footprint.
- Full CRUD Functionality: Users can Create new activity logs and securely Read, Update (implicitly, by deleting and re-logging), and Delete entries for accurate data management.
- Responsive Design: Styled entirely with Tailwind CSS for a modern, mobile-first user experience.
- Deployment Ready: Configured for separate client/server deployment (e.g., Vercel/Render) using environment variables and secure CORS handling.


## Tech Stack

**Client:** 
- **Core:** React.js (for building the UI components).
- **Bundler/Dev Server:** Vite (for fast development and production builds).
- **Styling:** Tailwind CSS (for utility-first, responsive styling).
- **Routing:** React Router DOM (for navigation between pages).
- **Data Fetching:** Axios (for making HTTP requests to the server).
- **Visualization:** Chart.js / react-chartjs-2 (for dynamic graphs and charts on the dashboard).

**Server:** 
- **Runtime:** Node.js (for executing server-side JavaScript).
- **Web Framework:** Express.js (for creating RESTful API routes and middleware).
- **Database:** MongoDB (for storing user and activity data).
- **ODM (Object Data Modeling):** Mongoose (for schema definition and interaction with MongoDB).
- **Security:** JWT (JSON Web Tokens) and Bcrypt.js (for authentication and password hashing).
- **Aggregation:** MongoDB Aggregation Pipeline (for calculating the Leaderboard and complex statistics).
- **Connectivity:** CORS (to allow secure communication with the frontend).


