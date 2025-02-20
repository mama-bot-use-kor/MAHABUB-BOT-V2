module.exports = {
    name: "admin", // Command name (should match how you call it in the bot)
    version: "1.0.0",
    permission: 0,
    credits: "nayan",
    description: "Admin details and image",
    prefix: true, // You can set this to true if you want it to be triggered with a prefix
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": ""
    },
    run: async function({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) {
        const axios = require("axios");
        const fs = require("fs-extra");
        const moment = require("moment-timezone");

        // Get bot uptime and format the time
        const time = process.uptime();
        const hours = Math.floor(time / (60 * 60));
        const minutes = Math.floor((time % (60 * 60)) / 60);
        const seconds = Math.floor(time % 60);

        // Set the timezone to Asia/Dhaka and format the current time
        var juswa = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【hh:mm:ss】");

        // Send the response with personal information and the image
        var callback = () => {
            api.sendMessage({
                body: `
--------------------------------------------
𝐍𝐚𝐦𝐞       : 𝐌𝐚𝐡𝐚𝐛𝐮𝐛 𝐑𝐚𝐡𝐦𝐚𝐧
𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧   : 𝐈𝐬𝐥𝐚𝐦
𝐏𝐞𝐫𝐦𝐚𝐧𝐞𝐧𝐭 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: 𝐁𝐨𝐠𝐮𝐫𝐚, 𝐑𝐚𝐣𝐬𝐡𝐚𝐡𝐢
𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: 𝐊𝐮𝐧𝐝𝐨𝐠𝐫𝐚𝐦, 𝐀𝐝𝐨𝐦𝐝𝐢𝐠𝐡𝐢, 𝐁𝐨𝐠𝐮𝐫𝐚
𝐆𝐞𝐧𝐝𝐞𝐫.   : 𝐌𝐚𝐥𝐞
𝐀𝐠𝐞           : 𝟏𝟖+
𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 : 𝐒𝐢𝐧𝐠𝐥𝐞
𝐖𝐨𝐫𝐤        : 𝐒𝐭𝐮𝐝𝐞𝐧𝐭
𝐆𝐦𝐚𝐢𝐥       : mahaburpk479@gmail.com
𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: wa.me/+8801312737981
𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦  : t.me/.....
𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : ミ𝐌　𝐀　𝐇　𝐀　𝐁　𝐔　 𝐁ミ
𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/www.xnxx.com140`,
                attachment: fs.createReadStream(__GLOBAL.cache + "/1.png")
            }, event.threadID, () => fs.unlinkSync(__GLOBAL.cache + "/1.png"));
        };

        // Fetch the image from Facebook and save it
        axios.get(encodeURI(`https://graph.facebook.com/100014754734049/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`), {
            responseType: 'stream'
        }).then(response => {
            response.data.pipe(fs.createWriteStream(__GLOBAL.cache + '/1.png')).on('close', () => callback());
        }).catch(error => {
            console.error("Error fetching image:", error);
            api.sendMessage("Sorry, there was an error fetching the image.", event.threadID);
        });
    }
};
