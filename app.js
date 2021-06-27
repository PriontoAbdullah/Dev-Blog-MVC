const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoute');
const dashboardRoutes = require('./routes/dashboardRoute');

// Import Middleware
const { bindUserWithRequest } = require('./middleware/authMiddleware');
const setLocals = require('./middleware/setLocals');

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4bhwg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Store Sessions
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions',
	expires: 1000 * 60 * 60 * 2
});

const app = express();

// Setup View Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware Array
const middleware = [
	morgan('dev'),
	express.static('public'),
	express.urlencoded({ extended: true }),
	express.json(),
	session({
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 2
		},
		store: store
	}),
	bindUserWithRequest(),
	setLocals()
];

app.use(middleware);

// Using Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
	res.json({
		message: 'Hello world'
	});
});

const PORT = process.env.PORT || 8080;
mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Database Connected');
		app.listen(PORT, () => {
			console.log(`Server is running in port ${PORT}`);
		});
	})
	.catch((err) => {
		return console.error(err);
	});
