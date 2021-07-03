require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const config = require('config');

const { bindeUserWithRequest } = require('./authMiddleware');
const setLocals = require('./setLocals');

const mongoDB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4bhwg.mongodb.net/${process
	.env.DB_NAME}?retryWrites=true&w=majority`;

const store = new MongoDBStore({
	uri: mongoDB_URI,
	collection: 'sessions',
	expires: 1000 * 60 * 60 * 2
});

const middlewares = [
	morgan('dev'),
	express.static('public'),
	express.urlencoded({ extended: true }),
	express.json(),
	session({
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: false,
		store: store
	}),
	flash(),
	bindeUserWithRequest(),
	setLocals()
];

module.exports = (app) => {
	middlewares.forEach((m) => {
		app.use(m);
	});
};
