const authRoute = require('./authRoute');
const dashboardRoutes = require('./dashboardRoute');
const playgroundRoutes = require('../playground/play');
const uploadRoutes = require('./uploadRoutes');
const postsRoutes = require('./postRoute');
const apiRoutes = require('../api/routes/apiRoutes');
const exploreRoutes = require('./exploreRoute');
const searchRoute = require('./searchRoute');
const authorRoute = require('./authorRoute');

const routes = [
	{
		path: '/auth',
		handler: authRoute
	},
	{
		path: '/dashboard',
		handler: dashboardRoutes
	},

	{
		path: '/playground',
		handler: playgroundRoutes
	},
	{
		path: '/uploads',
		handler: uploadRoutes
	},
	{
		path: '/posts',
		handler: postsRoutes
	},
	{
		path: '/search',
		handler: searchRoute
	},
	{
		path: '/author',
		handler: authorRoute
	},
	{
		path: '/api',
		handler: apiRoutes
	},
	{
		path: '/explorer',
		handler: exploreRoutes
	},
	{
		path: '/',
		handler: (req, res) => {
			res.redirect('/explorer');
		}
	}
];

module.exports = (app) => {
	routes.forEach((r) => {
		if (r.path === '/') {
			app.get(r.path, r.handler);
		} else {
			app.use(r.path, r.handler);
		}
	});
};
