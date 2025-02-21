module.exports = {
  name: "auto", // Command name
  version: "0.0.2", // Version
  permission: 0, // Permission level required (0 = everyone)
  prefix: true, // Whether to use a prefix for the command
  credits: "Nayan", // Author credits
  description: "Auto video download", // Command description
  category: "user", // Command category (user commands)
  usages: "[video URL]", // Usage pattern for the command
  cooldowns: 5, // Cooldown time in seconds for repeated use
  
  // Command handler
  run: async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const { alldown } = require("nayan-videos-downloader");

    // Check if the argument contains a valid URL
    const content = args.join(" ");
    if (!content.startsWith("https://")) {
      return api.sendMessage("Please provide a valid video URL.", event.threadID, event.messageID);
    }

    try {
      // Set reaction to indicate that the bot is processing the video download
      api.setMessageReaction("🔍", event.messageID, (err) => {}, true);

      // Fetch video details using the URL provided
      const data = await alldown(content);
      console.log("Video Data:", data);

      // Extract video details like low-quality, high-quality, and title
      const { low, high, title } = data.data;

      // Set reaction to show successful processing
      api.setMessageReaction("✔️", event.messageID, (err) => {}, true);

      // Download the high-quality video
      const video = (await axios.get(high, { responseType: "arraybuffer" })).data;
      
      // Save video to the cache folder
      const videoPath = __dirname + "/cache/auto.mp4";
      fs.writeFileSync(videoPath, Buffer.from(video, "utf-8"));

      // Send the video back to the user
      return api.sendMessage({
        body: `《TITLE》: ${title}`,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error("Error during video download:", error);
      api.sendMessage("Sorry, an error occurred while downloading the video.", event.threadID);
    }
  }
};
