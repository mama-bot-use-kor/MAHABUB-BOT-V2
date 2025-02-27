//https://raw.githubusercontent.com/MR-MAHABUB-004/MAHABUB-BOT-STORAGE/refs/heads/main/anime.json";

const axios = require("axios");

module.exports = {
  config: {
    name: "anime",
    aliases: ["ani"],
    version: "1.0",
    author: "‎MR᭄﹅ MAHABUB﹅ メꪜ",
    countDown: 10,
    role: 0,
    shortDescription: "anime videos",
    longDescription: "anime videos from mahabub",
    category: "user",
    guide: "{p}{n}rv",
  },

  onStart: async function ({ api, event, message }) {
    const senderID = event.senderID;

    // লোডিং মেসেজ পাঠানো
    const loadingMessage = await message.reply({
      body: "Loading random video... Please wait! (up to 5 sec)...\n𝐍𝐨𝐰 𝐥𝐨𝐚𝐝𝐢𝐧𝐠. . .\n█▒▒▒▒▒▒▒▒▒",
    });

    // JSON ফাইলের URL
    const jsonUrl = "https://raw.githubusercontent.com/MR-MAHABUB-004/MAHABUB-BOT-STORAGE/refs/heads/main/anime.json";

    try {
      // JSON ফাইল থেকে ডাটা নিয়ে আসা
      const response = await axios.get(jsonUrl);
      const videoLinks = response.data.videos;

      if (!videoLinks || videoLinks.length === 0) {
        return message.reply("No videos available.");
      }

      // এলোমেলো একটি ভিডিও লিংক নির্বাচন
      const randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];

      // ভিডিও পাঠানো
      message.reply({
        body: "❰ ANIME VIDEO ❱",
        attachment: await global.utils.getStreamFromURL(randomVideo),
      });

    } catch (error) {
      console.error("Error fetching video links:", error);
      return message.reply("Failed to load video links. Please try again later.");
    }
  }
};
