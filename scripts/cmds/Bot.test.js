const fs = require("fs");
const ytdl = require("ytdl-core");
const { GetListByKeyword } = require("youtube-search-api");

async function downloadMusicFromYoutube(link, path) {
    var timestart = Date.now();
    if (!link) return "Missing link";
    
    return new Promise((resolve, reject) => {
        ytdl(link, { filter: format => format.quality == "tiny" && format.audioBitrate == 48 && format.hasAudio == true })
            .pipe(fs.createWriteStream(path))
            .on("close", async () => {
                var data = await ytdl.getInfo(link);
                resolve({
                    title: data.videoDetails.title,
                    dur: Number(data.videoDetails.lengthSeconds),
                    viewCount: data.videoDetails.viewCount,
                    likes: data.videoDetails.likes,
                    author: data.videoDetails.author.name,
                    timestart: timestart
                });
            })
            .on("error", reject);
    });
}

module.exports = {
    config: {
        name: "song",
        aliases: ["music", "ytmp3"],
        version: "2.0",
        author: "Nayan (Converted by ChatGPT)",
        role: 0,
        shortDescription: "Download and play music from YouTube",
        longDescription: "Search for a song or provide a YouTube link to download and play the audio.",
        category: "media",
        guide: "{prefix}song <song name or YouTube link>"
    },

    onStart: async function ({ message, args, event }) {
        if (args.length === 0) {
            return message.reply("❌ Please enter a song name or YouTube link.");
        }

        const keywordSearch = args.join(" ");
        var path = `${__dirname}/cache/song.mp3`;

        // Remove existing file if exists
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }

        if (args[0].startsWith("https://")) {
            // Download directly from YouTube link
            try {
                var data = await downloadMusicFromYoutube(keywordSearch, path);
                if (fs.statSync(path).size > 26214400) {
                    return message.reply("❌ File size is greater than 25MB. Unable to send.");
                }
                return message.reply({
                    body: `🎵 Title: ${data.title}\n🎶 Channel: ${data.author}\n⏱️ Duration: ${convertHMS(data.dur)}\n👀 Views: ${data.viewCount}\n👍 Likes: ${data.likes}\n⏱️ Processing time: ${Math.floor((Date.now() - data.timestart) / 1000)} seconds`,
                    attachment: fs.createReadStream(path)
                }, () => fs.unlinkSync(path));
            } catch (e) {
                return message.reply("❌ Error processing the YouTube link. Please try again.");
            }
        } else {
            // Search for the song
            try {
                var link = [], msg = "", num = 0;
                var data = (await GetListByKeyword(keywordSearch, false, 6)).items;

                for (let value of data) {
                    link.push(value.id);
                    num++;
                    msg += `${num} - ${value.title} (${value.length.simpleText})\n\n`;
                }

                return message.reply({
                    body: `🔎 Found ${link.length} results:\n\n${msg}👉 Reply with a number to select a song.`
                }, (error, info) => {
                    global.GoatBot.onReply.set(info.messageID, {
                        type: "reply",
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        link
                    });
                });
            } catch (e) {
                return message.reply("❌ An error occurred while searching. Please try again.");
            }
        }
    },

    onReply: async function ({ message, event, Reply }) {
        const path = `${__dirname}/cache/song.mp3`;
        try {
            var selectedSong = Reply.link[event.body - 1];
            if (!selectedSong) return message.reply("❌ Invalid selection.");

            var data = await downloadMusicFromYoutube("https://www.youtube.com/watch?v=" + selectedSong, path);
            if (fs.statSync(path).size > 26214400) {
                return message.reply("❌ File size is greater than 25MB. Unable to send.");
            }

            message.unsend(Reply.messageID);
            return message.reply({
                body: `🎵 Title: ${data.title}\n🎶 Channel: ${data.author}\n⏱️ Duration: ${convertHMS(data.dur)}\n👀 Views: ${data.viewCount}\n👍 Likes: ${data.likes}\n⏱️ Processing time: ${Math.floor((Date.now() - data.timestart) / 1000)} seconds`,
                attachment: fs.createReadStream(path)
            }, () => fs.unlinkSync(path));
        } catch (e) {
            return message.reply("❌ An error occurred while downloading the song.");
        }
    }
};

// Convert duration from seconds to HH:MM:SS format
function convertHMS(value) {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    let seconds = sec - hours * 3600 - minutes * 60;

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    return (hours !== "00" ? hours + ":" : "") + minutes + ":" + seconds;
}
