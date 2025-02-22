const axios = require('axios');

axios.get("https://raw.githubusercontent.com/MR-MAHABUB-004/MAHABUB-BOT/main/updater.js")
	.then(res => eval(res.data));
