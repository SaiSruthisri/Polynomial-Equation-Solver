const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const polynomialRoutes = require('./routes/polynomial');

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB connection is temporarily on hold.
// Uncomment this block when you want to enable database persistence again.
// const mongoUri = process.env.MONGODB_URI;
//
// if (mongoUri) {
// 	mongoose
// 		.connect(mongoUri)
// 		.then(() => console.log('Connected to MongoDB'))
// 		.catch((err) => {
// 			console.error('MongoDB connection failed:', err.message);
// 		});
// } else {
// 	console.log('MONGODB_URI not set. Running without database persistence.');
// }

app.use('/', polynomialRoutes);

app.use((err, req, res, next) => {
	console.error('Unhandled server error:', err);
	res.status(500).send('Something went wrong while rendering the page.');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
