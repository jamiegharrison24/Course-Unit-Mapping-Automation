import express from 'express';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import unit from './routes/unit.js';
import unitConnection from './routes/unitConnection.js';
import authentication from './routes/authentication.js';
import scraper from './routes/webscraperEndpoint.js';
import transferPlan from './routes/transferPlan.js';
import ai from './routes/ai.js';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import authenticateToken from './middleware/authenticateToken.js';
import cumaAdmin from './routes/cumaAdmin.js';
import authorize from './middleware/authorize.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const serverPath = "http://localhost:" + port
// Change the URI to MONGODB_URI for production
const client = new MongoClient(process.env.TEST_MONGODB_URI);

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_TOKEN_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', 'front-end'), { index: false })); // Using all the static files within front-end
app.use('/backend', express.static(path.join(__dirname, '../backend')));  // Serve backend JavaScript files
app.use('/admin', express.static(path.join(__dirname, '..', 'front-end', 'admin')));

// Middleware to attach MongoDB client to requests
app.use((req, res, next) => {
  req.client = client;
  next();
});

// Mount the route handlers
app.use('/api/unit', unit);
app.use('/api/unitConnection/', unitConnection);
app.use('/api/authentication/', authentication);
app.use('/api/cuma-admin', cumaAdmin);
app.use('/api/transferPlan/', transferPlan);
app.use('/api/ai/', ai);
app.use('/api/webscraperEndpoint/',scraper);

// Page Link routes
app.get('/', authenticateToken, (req, res) => {
  if (!req.user || !req.user.role) {
      return res.redirect('/login');
  }
  if (req.user.role === 'course_director') {
      res.redirect('/mapping');
  } else if (req.user.role === 'student' || req.user.role === 'general_user') {
      res.redirect('/transfer-plans');
  } else if (req.user.role === 'admin'){
      res.redirect('/cuma-admin');
  }else {
      res.status(403).send('Unauthorized role');
  }
});

app.get('/mapping', authenticateToken, authorize(['course_director']),  (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'index.html'));
});

app.get('/add-unit', authenticateToken, authorize(['course_director']), (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'nav-add-unit.html'));
});

app.get('/unit-info', authenticateToken, authorize(['student', 'general_user', 'course_director']), (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'nav-unit-info.html'));
});
app.get('/transfer-plans', authenticateToken, authorize(['student', 'general_user']) ,(req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'transfer-planner-home.html'));
});

app.get('/transfer-plans/planner', authenticateToken, authorize(['student', 'general_user']), (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'transfer-planner-mapping.html'));
});

// Example route to log session data
app.get('/view-session', (req, res) => {
  console.log(req.session);  // Logs the entire session object to the console
  res.send('Check the console to see session data.');
}); 

app.get('/profile', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'nav-profile.html'));
});

app.get('/settings', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'nav-setting.html'));
});

app.get('/cuma-admin', authenticateToken, authorize(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'admin', 'pages', 'super-admin-dashboard.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'auth-login.html'));
});

app.get('/login/verify-totp', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'auth-login-verify-totp.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'auth-signup.html'));
});

app.get('/signup/role-verification', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'auth-role-verification.html'));
});

app.get('/signup/mfa-init', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'mfa-init.html'));
});

app.get('/signup/mfa-setup-qr', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'mfa-setup-qr.html'));
});

app.get('/signup/mfa-verify-totp', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'mfa-verify-totp.html'));
});

app.get('/login/request-password-reset', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'pw-reset-request.html'));
});

app.get('/login/request-password-reset-success', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'pw-reset-request-success.html'));
});

app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'pw-create-new.html'));
});

app.get('/reset-password-success', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'pw-create-new-success.html'));
});

// Connect to MongoDB and start the server
async function run() {
  try {
    // Connect to MongoDB native client
    await client.connect();
    console.log("Connected to MongoDB");

    // Connect to MongoDB using Mongoose
    // Change the URI to MONGODB_URI for production
    await mongoose.connect(process.env.TEST_MONGODB_URI);
    console.log("Connected to MongoDB using Mongoose");

    // Start the Express server
    const server = app.listen(port, () => {
      console.log(`Server is running in ${process.env.NODE_ENV} mode on ${serverPath}`);
      console.log(`Admin is running in ${process.env.NODE_ENV} mode on ${serverPath}/cuma-admin`);
    });
    // Function to close server
    const closeServer = async () => {
      // Closing server
      await server.close(() => {
        console.log("HTTP server closed.");
      });
      // Closing Mongodb connection
      await client.close();
      console.log("MongoDB connection closed.");

      // Closing Mongoose connection
      await mongoose.connection.close();
      console.log("Mongoose connection closed.");
    };
    // Signal to close ctrl + c
    process.on('SIGINT', async () => {
      console.log("Shutting down server");
      await closeServer();
      process.exit(0);
    });
  } catch (error) {
    // Catch any error
    console.error("Failed to start the application", error);
    await client.close();
    await mongoose.connection.close();
    process.exit(1);
  }
}

run().catch(async (error) => {
  console.error("An error occurred while running the server", error);
  await client.close();
  await mongoose.connection.close();
  process.exit(1);
});