const schedule = require('node-schedule');
const moment = require('moment-timezone');

let messages = [
    "☀️ Good afternoon! Hope you're having a great day!",  // 1:00 PM
    "📖 Take some time to read and learn something new!",   // 2:00 PM
    "💪 Stay motivated! Keep pushing forward.",            // 3:00 PM
    "☕ Coffee break time! Relax and recharge.",           // 4:00 PM
    "🚶 Take a short walk and refresh your mind.",        // 5:00 PM
    "🍽️ Time for dinner! Enjoy your meal!",              // 6:00 PM
    "🎧 Listen to some music and unwind.",               // 7:00 PM
    "📺 Watch your favorite show or movie.",             // 8:00 PM
    "📱 Take a break from your phone & relax.",         // 9:00 PM
    "🌆 Good evening! How was your day?",               // 10:00 PM
    "📝 Plan your tasks for tomorrow.",                 // 11:00 PM
    "🌙 Time to sleep! Have a good night. 😴",         // 12:00 AM
    "💤 Rest well! See you tomorrow. 🛌",             // 1:00 AM
];

module.exports = {
    config: {
        name: "autotime",
        version: "1.0",
        author: "YourName",
        role: 1, // 1 = admin only, change to 0 if for everyone
        description: "Schedules different messages from 1:00 PM to 1:00 AM (Asia/Dhaka)",
        category: "utility",
        usage: "autotime",
        cooldown: 5
    },

    onStart: async function ({ message, event }) {
        let chatId = event.threadID;
        let index = 0;

        message.reply("✅ Hourly message scheduling started from 1:00 PM to 1:00 AM (Asia/Dhaka)!");

        // Schedule messages from 1:00 PM to 1:00 AM (GMT+6)
        for (let hour = 13; hour <= 24; hour++) {
            let formattedHour = hour === 24 ? 0 : hour; // Convert 24:00 to 00:00
            let cronTime = `0 ${formattedHour} * * *`;

            schedule.scheduleJob(cronTime, function () {
                let msg = messages[index];
                message.send(msg, chatId);

                // Move to the next message, reset if end of list
                index = (index + 1) % messages.length;
            });
        }
    }
};
