/** Custom Islamic Quotes Bot **/
const fs = require("fs-extra");
const request = require("request");
const asanic = require("asanic");

module.exports = {
  config: {
    name: "islamic_quote",
    version: "1.1.0",
    permission: 0,
    credits: "nayan (modified by [Your Name])",
    description: "Sends a random Islamic quote with an image.",
    prefix: true,
    category: "user",
    usages: "!islamic_quote",
    cooldowns: 5,
    dependencies: {}
  },

  start: asanic(async function ({ api, event }) {
    const quotes = [
      "আল্লাহ সবকিছু দেখছেন, তাই ধৈর্য ধরো। 🌙",
      "নামাজ কায়েম করো, সফলতা আসবেই! ☪️",
      "সর্বদা সত্য বলো, কারণ ইসলাম শান্তির ধর্ম। 🤍",
      "যারা ধৈর্য ধরে, তাদের জন্য আছে জান্নাতের সুসংবাদ। 🌷"
    ];

    const images = [
      "https://example.com/my-islamic-image1.jpg",
      "https://example.com/my-islamic-image2.jpg"
    ];

    const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const selectedImage = images[Math.floor(Math.random() * images.length)];

    const filePath = `${__dirname}/cache/islamic.jpg`;

    request(selectedImage).pipe(fs.createWriteStream(filePath)).on("close", () => {
      api.sendMessage(
        { body: `「 ${selectedQuote} 」`, attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );
    });
  })
};
