/** Custom Islamic Quotes Bot **/
module.exports.config = {
  name: "test",
  version: "1.1.0",
  permission: 0,
  credits: "nayan (modified by [Your Name])",
  description: "Sends a random Islamic quote with an image.",
  prefix: "!",
  category: "user",
  usages: "!islamic_quote",
  cooldowns: 5,
  dependencies: {}
};

module.exports.run = async({api, event}) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  var quotes = [
    "আল্লাহ সবকিছু দেখছেন, তাই ধৈর্য ধরো। 🌙",
    "নামাজ কায়েম করো, সফলতা আসবেই! ☪️",
    "সর্বদা সত্য বলো, কারণ ইসলাম শান্তির ধর্ম। 🤍",
    "যারা ধৈর্য ধরে, তাদের জন্য আছে জান্নাতের সুসংবাদ। 🌷"
  ];

  var images = [
    "https://example.com/my-islamic-image1.jpg",
    "https://example.com/my-islamic-image2.jpg"
  ];

  var selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
  var selectedImage = images[Math.floor(Math.random() * images.length)];

  var callback = () => api.sendMessage(
    { body: `「 ${selectedQuote} 」`, attachment: fs.createReadStream(__dirname + "/cache/islamic.jpg") },
    event.threadID,
    () => fs.unlinkSync(__dirname + "/cache/islamic.jpg")
  );

  return request(encodeURI(selectedImage))
    .pipe(fs.createWriteStream(__dirname + "/cache/islamic.jpg"))
    .on("close", callback);
};
