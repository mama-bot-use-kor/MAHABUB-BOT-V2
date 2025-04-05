const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
    name: "autosend",
    version: "1.7",
    role: 0,
    credits: "MR᭄﹅ MAHABUB﹅ メꪜ",
    description: "Automatically sends video from API to recent 5 groups",
    category: "Media",
    usages: "No manual trigger needed",
    cooldowns: 5
};

const lastSent = {};

async function sendVideo(api, threadID, timeSlot) {
    try {
        const { data } = await axios.get("https://mahabub-apis.vercel.app/mahabub");

        const videoUrl = data?.data;
        const title = data?.title || "🔹 No Title Found";

        if (!videoUrl) {
            return api.sendMessage("❌ No videos found! (Invalid API Response)", threadID);
        }

        const res = await axios.get(videoUrl, { responseType: "stream" });

        api.sendMessage({
            body: `====== 𝗔𝗨𝗧𝗢 𝗦𝗘𝗡𝗗 ======\n━━━━━━━━━━━━━━━━\n➝ 𝗡𝗼𝘄 𝗜𝘀: ${timeSlot}\n\n💬: ${title}\n━━━━━━━━━━━━━━━━━━\n➝ 𝗧𝗵𝗶𝘀 𝗜𝘀 𝗔𝗻 𝗔𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗰 𝗠𝗲𝘀𝘀𝗮𝗴𝗲`,
            attachment: res.data
        }, threadID);

        lastSent[threadID] = timeSlot;

    } catch (error) {
        api.sendMessage("❌ Failed to fetch video.", threadID);
    }
}

function scheduleVideo(api) {
    const timeSlots = [
        "1:30 AM", "2:30 AM", "3:30 AM", "4:30 AM", "5:30 AM", "6:30 AM",
        "7:30 AM", "8:00 AM", "8:25 AM", "10:30 AM", "11:30 AM", "12:30 PM",
        "1:30 PM", "2:30 PM", "3:30 PM", "4:30 PM", "5:30 PM", "6:30 PM",
        "7:30 PM", "8:30 PM", "9:30 PM", "10:30 PM", "11:30 PM", "12:30 AM"
    ];

    setInterval(async () => {
        const currentTime = moment().tz("Asia/Dhaka").format("h:mm A").replace(/^0+/, '');

        if (!timeSlots.includes(currentTime)) return;

        try {
            const threads = await api.getThreadList(50, null, ["INBOX"]);
            const recentGroups = threads
                .filter(thread => thread.isGroup)
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 5);

            for (const thread of recentGroups) {
                const threadID = thread.threadID;
                if (lastSent[threadID] !== currentTime) {
                    await sendVideo(api, threadID, currentTime);
                }
            }

        } catch (err) {
            
        }

    }, 60000);
}

module.exports.onStart = function ({ api }) {
    scheduleVideo(api);
};
