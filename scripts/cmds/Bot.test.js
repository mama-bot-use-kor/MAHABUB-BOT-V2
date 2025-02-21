const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "test2",
        version: "2.0",
        author: "MR᭄﹅ MAHABUB﹅ メꪜ",
        countDown: 5,
        role: 0,
        shortDescription: "Automatically responds with an Islamic quote",
        longDescription: "Whenever someone types a related keyword, the bot will reply with an Islamic quote and an image.",
        category: "religion",
        guide: "Just type 'islam', 'Allah', 'prayer', or similar words to trigger the bot.",
        trigger: ["islam", "Allah", "prayer", "quran", "dua"] // Add more keywords if needed
    },

    onChat: async function ({ api, event }) {
        try {
            // Get the message content
            const messageText = event.body.toLowerCase();

            // Define trigger words
            const triggerWords = ["islam", "allah", "prayer", "quran", "dua"];

            // Check if the message contains any trigger word
            if (!triggerWords.some(word => messageText.includes(word))) {
                return;
            }

            const quotes = [
                "📖 আল্লাহর উপর বিশ্বাস রাখো, তিনি সর্বশক্তিমান।",
                "🌿 ধৈর্য ধারণ করো, আল্লাহ ধৈর্যশীলদের সাথে আছেন।",
                "🕌 নামাজ কখনো পরিত্যাগ করো না, এটি সফলতার চাবিকাঠি।",
                "💖 ভালো কাজ করো, আল্লাহ সব দেখেন।",
                "🤲 দোয়া করো, আল্লাহ তোমার দোয়া কবুল করবেন।"
            ];

            // Select a random quote
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            // Get an Islamic image
            const imageUrl = "https://source.unsplash.com/600x400/?islamic,mosque,quran";

            // Send message
            const message = {
                body: randomQuote,
                attachment: await global.utils.getStreamFromURL(imageUrl)
            };

            return api.sendMessage(message, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("দুঃখিত, কিছু সমস্যা হয়েছে। পরে চেষ্টা করুন।", event.threadID, event.messageID);
        }
    }
};
