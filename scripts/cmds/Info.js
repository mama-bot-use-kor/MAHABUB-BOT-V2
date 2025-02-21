const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "admin",
        version: "1.0.0",
        author: "nayan",
        countDown: 5,
        role: 0,
        shortDescription: "Admin details and image",
        longDescription: "Displays admin details along with an image",
        category: "info",
        guide: "{pn}"
    },

    onStart: async function ({ api, event }) {
        const cachePath = path.join(__dirname, "cache");
        if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

        const imagePath = path.join(cachePath, "admin.png");
        const fbProfileUrl = `https://graph.facebook.com/100014754734049/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        try {
            const response = await axios.get(fbProfileUrl, { responseType: "stream" });
            const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);

            writer.on("finish", async () => {
                await api.sendMessage({
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
                    attachment: fs.createReadStream(imagePath)
                }, event.threadID, () => fs.unlinkSync(imagePath));
            });

        } catch (error) {
            console.error("Error fetching image:", error);
            return api.sendMessage("Sorry, there was an error fetching the image.", event.threadID);
        }
    }
};
