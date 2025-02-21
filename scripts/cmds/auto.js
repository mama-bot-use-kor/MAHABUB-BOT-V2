const axios = require("axios");
const fs = require("fs-extra");
const { alldown } = require("nayan-videos-downloader");

module.exports = {
    config: {
        name: "auto",
        version: "0.0.2",
        permission: 0,
        prefix: true,
        credits: "Nayan",
        description: "Auto video download",
        category: "user",
        usages: "",
        cooldowns: 5,
    },

    start: async function ({ nayan, events, args }) {
        // This can be left empty or add logic if needed
    },

    handleEvent: async function ({ api, event, args }) {
        const content = event.body ? event.body : "";
        const body = content.toLowerCase();

        // Check if the message starts with a YouTube link
        if (body.startsWith("https://")) {
            try {
                api.setMessageReaction("🔍", event.messageID, (err) => {}, true); // React with 'searching'

                // Fetch video download info
                const data = await alldown(content);
                console.log(data);

                const { low, high, title } = data.data;

                // React with 'found' after processing
                api.setMessageReaction("✔️", event.messageID, (err) => {}, true);

                // Download the high quality video
                const video = (await axios.get(high, { responseType: "arraybuffer" })).data;

                // Save the video to the cache
                fs.writeFileSync(__dirname + "/cache/auto.mp4", Buffer.from(video, "utf-8"));

                // Send the video back to the user
                return api.sendMessage(
                    {
                        body: `🎬 Video Title: ${title}`,
                        attachment: fs.createReadStream(__dirname + "/cache/auto.mp4"),
                    },
                    event.threadID,
                    event.messageID
                );
            } catch (e) {
                console.error(e);
                // Handle errors such as if the download fails
                return api.sendMessage("❌ Failed to download the video. Please try again.", event.threadID);
            }
        }
    }
};
