const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables
const path = require('path');
const jwt = require('jsonwebtoken');
const isAuthenticated = require('./middlewares/authMiddleware'); // Import middleware
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { SitemapStream, streamToPromise } = require("sitemap");

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Add this to parse JSON requests
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define Referral model
const referralSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  referralLink: String,
});

const Referral = mongoose.model('Referral', referralSchema);

// Define Submission model
const submissionSchema = new mongoose.Schema({
  referralLink: String,
  name: String,
  email: String,
  message: String,
});

const Submission = mongoose.model('Submission', submissionSchema);

const maintenanceSchema = new mongoose.Schema({
  isMaintenance: { type: Boolean, default: false }
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

const adminSchema = new mongoose.Schema({
  username: String,
  password: String, // Hashed password
  googleAuthSecret: String, // Store secret for OTP verification
});

adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hash password before saving
  }
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

// Middleware to check maintenance mode
app.use(async (req, res, next) => {
  // Allow access to admin routes even in maintenance mode
  if (req.path.startsWith("/admin")) {
    return next();
  }

  const maintenance = await Maintenance.findOne();
  if (maintenance && maintenance.isMaintenance) {
    return res.render("maintenance");
  }
  next();
});



// Admin credentials (you may hash this password in production)
let admin = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Terms and Conditions route
app.get('/termsandcondition', (req, res) => {
  res.render('terms');
});

// Privacy Policy route
app.get('/privacypolicy', (req, res) => {
  res.render('policy');
});


// Privacy Policy route
app.get('/privacypolicy', (req, res) => {
  res.render('policy');
});

// Legal Notice route
app.get('/legal', (req, res) => {
  res.render('legalnotice');
});

// Home route
app.get('/admin/maintenance', isAuthenticated, async (req, res) => {
  const maintenance = await Maintenance.findOne();
  res.render("maitenanceToggle", { isMaintenance: maintenance ? maintenance.isMaintenance : false });
});


app.get('/admin/bac', (req, res) => {
  res.render('adminLogin');
});

// Referral form page
app.get('/contact/:referralLink', (req, res) => {
  const referralLink = req.params.referralLink;
  res.render('referralForm', { referralLink });
});

// Handle referral form submission
app.post('/submitReferralForm', (req, res) => {
  const { referralLink, name, email, message } = req.body;

  const newSubmission = new Submission({
    referralLink,
    name,
    email,
    message,
  });

  newSubmission.save()
    .then(() => {
      res.render('submited', { success: 'Developer Contact You Soon' });
    })
    .catch(err => {
      console.log(err);
      res.render('submited', { success: 'Internal Server Error Occured' });
    });
});

// Admin login
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === admin.username && password === admin.password) {
    // Generate a JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token in response and set it as an HTTP-only cookie
    res.cookie('token', token, { httpOnly: true, secure: true });

    return res.redirect('/admin/dashboard'); // Redirect to admin dashboard
  } else {
    return res.status(401).send('Invalid credentials!');
  }
});

// Admin dashboard
app.get('/admin/dashboard', isAuthenticated, async (req, res) => {
  try {
    const referrals = await Referral.find();
    const submissions = await Submission.find();
    res.render('admin', { referrals, submissions });
  } catch (err) {
    console.log(err);
    res.send('Error fetching data');
  }
});

app.get('/admin/logout', (req, res) => {
  res.clearCookie('token'); // Remove the JWT token cookie
  res.redirect('/bac'); // Redirect to login page
});


// Create referral link (Admin action)
app.post('/admin/createReferral', (req, res) => {
  const { name, phone, email } = req.body;
  const referralLink = generateReferralLink(name, phone);

  const newReferral = new Referral({
    name,
    phone,
    email,
    referralLink,
  });

  newReferral.save()
    .then(() => {
      res.redirect('/admin/dashboard');
    })
    .catch(err => {
      console.log(err);
      res.send('Error creating referral link');
    });
});

// Generate a unique referral link
function generateReferralLink(name, phone) {
  return Buffer.from(`${name}-${phone}`).toString('base64'); // Simple encoding for the link
}


// Admin route to enable/disable maintenance mode
app.post("/admin/toggle-maintenance", async (req, res) => {
  let maintenance = await Maintenance.findOne();
  if (!maintenance) {
    maintenance = new Maintenance();
  }
  maintenance.isMaintenance = !maintenance.isMaintenance;
  await maintenance.save();
  res.redirect("/admin/maintenance");
});

app.get("/sitemap.xml", async (req, res) => {
  try {
    const sitemap = new SitemapStream({ hostname: "https://www.officialbac.xyz" });

    // Add website pages dynamically
    sitemap.write({ url: "/", changefreq: "daily", priority: 1.0 });
    sitemap.write({ url: "/#about", changefreq: "monthly", priority: 0.8 });
    sitemap.write({ url: "/#team", changefreq: "monthly", priority: 0.7 });
    sitemap.write({ url: "/#packages", changefreq: "weekly", priority: 0.9 });
    sitemap.write({ url: "/#contact", changefreq: "monthly", priority: 0.7 });

    sitemap.end();

    const xml = await streamToPromise(sitemap).then((data) => data.toString());

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).end();
  }
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *\nDisallow: /admin\nDisallow: /private\nSitemap: https://www.officialbac.xyz/sitemap.xml`);
});


// 404 Error Handling
app.use((req, res, next) => {
  res.status(404).render('error404');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
