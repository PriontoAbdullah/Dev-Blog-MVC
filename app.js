const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoute');

const app = express();

// Setup View Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware Array
const middleware = [ morgan('dev'), express.static('public'), express.urlencoded({ extended: true }), express.json() ];
app.use(middleware);

// Using Routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
	res.json({
		message: 'Hello world'
	});
});

const PORT = process.env.PORT || 8080;
mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4bhwg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.then(() => {
		console.log('Database Connected');
		app.listen(PORT, () => {
			console.log(`Server is running in port ${PORT}`);
		});
	})
	.catch((err) => {
		return console.error(err);
	});
