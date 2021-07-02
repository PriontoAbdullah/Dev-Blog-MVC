const authRoute = require('./authRoute');
const dashboardRoutes = require('./dashboardRoute');
const playgroundRoutes = require('../playground/play');
const uploadRoutes = require('./uploadRoutes');
const postRoutes = require('./postRoute');

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
		path: '/posts',
		handler: postRoutes
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
		path: '/',
		handler: (req, res) => {
			res.json({
				message: 'Hello World'
			});
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
