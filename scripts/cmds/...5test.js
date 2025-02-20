const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "test",
        version: "1.0",
        author: "Converted from Mirai",
        countDown: 5,
        role: 0,
        shortDescription: "Sends a random Islamic quote with an image",
        longDescription: "This command will send a random Islamic quote along with a relevant image.",
        category: "religion",
        guide: "{prefix}islamic"
    },
    
    onStart: async function ({ api, event }) {
        const quotes = [
            "ღ••\n– কোনো নেতার পিছনে নয়.!!🤸‍♂️\n– মসজিদের ইমামের পিছনে দাড়াও জীবন বদলে যাবে ইনশাআল্লাহ.!!🖤🌻",
            "🌼 এত অহংকার করে লাভ নেই! 🌺 \nমৃত্যুটা নিশ্চিত,, শুধু সময়টা অ'নিশ্চিত।🖤🙂 ",
            "_আল্লাহর ভালোবাসা পেতে চাও•••!🤗\n_তবে রাসুল (সা:)কে অনুসরণ করো••!🥰",
            "🥀😒কেউ পছন্দ না করলে,,,,\n        কি যায় আসে,,🙂\n                😇আল্লাহ তো,,\n        পছন্দ করেই বানিয়েছে,,♥️🥀",
            "_বুকে হাজারো কষ্ট নিয়ে\n                  আলহামদুলিল্লাহ বলাটা••!☺️\n_আল্লাহর প্রতি অগাধ বিশ্বাসের নমুনা❤️🥀"
        ];

        const images = [
            "https://i.postimg.cc/7LdGnyjQ/images-31.jpg",
            "https://i.postimg.cc/65c81ZDZ/images-30.jpg",
            "https://i.postimg.cc/Y0wvTzr6/images-29.jpg",
            "https://i.postimg.cc/1Rpnw2BJ/images-28.jpg",
            "https://i.postimg.cc/mgrPxDs5/images-27.jpg",
            "https://i.postimg.cc/yxXDK3xw/images-26.jpg",
            "https://i.postimg.cc/kXqVcsh9/muslim-boy-having-worship-praying-fasting-eid-islamic-culture-mosque-73899-1334.webp",
            "https://i.postimg.cc/hGzhj5h8/muslims-reading-from-quran-53876-20958.webp",
            "https://i.postimg.cc/x1Fc92jT/blue-mosque-istanbul-1157-8841.webp",
            "https://i.postimg.cc/j5y56nHL/muhammad-ali-pasha-cairo-219717-5352.webp"
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const randomImage = images[Math.floor(Math.random() * images.length)];

        const imgPath = __dirname + "/cache/islamic.jpg";

        request(randomImage)
            .pipe(fs.createWriteStream(imgPath))
            .on("close", () => {
                api.sendMessage({
                    body: `「 ${randomQuote} 」`,
                    attachment: fs.createReadStream(imgPath)
                }, event.threadID, () => fs.unlinkSync(imgPath));
            });
    }
};
