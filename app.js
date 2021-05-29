const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.json({
		message: 'Hello world'
	});
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is running in port ${PORT}`);
});
