const fs = require('fs');
const ytdl = require('ytdl-core');
const axios = require('axios');
const Youtube = require('youtube-search-api');

async function downloadMusicFromYoutube(link, path) {
  try {
    const timestart = Date.now();
    if (!link) throw new Error("Missing link");

    return new Promise((resolve, reject) => {
      ytdl(link, {
        filter: format =>
          format.quality == 'tiny' && format.audioBitrate == 48 && format.hasAudio === true
      })
        .pipe(fs.createWriteStream(path))
        .on("close", async () => {
          const data = await ytdl.getInfo(link);
          resolve({
            title: data.videoDetails.title,
            duration: Number(data.videoDetails.lengthSeconds),
            views: data.videoDetails.viewCount,
            likes: data.videoDetails.likes,
            channel: data.videoDetails.author.name,
            timestart
          });
        })
        .on("error", reject);
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error downloading music from YouTube.");
  }
}

module.exports = {
  config: {
    name: "song",
    aliases: ["play"],
    version: "2.0.0",
    author: "Nayan - Modified for Goat Bot V2",
    description: "Download and play songs from YouTube",
    category: "media",
    usage: "<song title/link>",
    cooldown: 5,
    dependencies: {
      "ytdl-core": "",
      "youtube-search-api": ""
    }
  },

  onReply: async function ({ api, event, Reply }) {
    try {
      const path = `${__dirname}/cache/song.mp3`;
      const data = await downloadMusicFromYoutube(`https://www.youtube.com/watch?v=${Reply.link[event.body - 1]}`, path);

      if (fs.statSync(path).size > 26214400) {
        fs.unlinkSync(path);
        return api.sendMessage("The file is too large to send (above 25MB).", event.threadID, event.messageID);
      }

      api.unsendMessage(Reply.messageID);
      return api.sendMessage({
        body: `🎵 Title: ${data.title}\n🎶 Channel: ${data.channel}\n⏱️ Duration: ${convertHMS(data.duration)}\n👀 Views: ${data.views}\n👍 Likes: ${data.likes}\n⏳ Processing Time: ${Math.floor((Date.now() - data.timestart) / 1000)} sec\n💿====GOAT BOT====💿`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
  },

  run: async function ({ api, event, args }) {
    try {
      if (!args.length) return api.sendMessage('» Please provide a song name or YouTube link.', event.threadID, event.messageID);

      const keywordSearch = args.join(" ");
      const path = `${__dirname}/cache/song.mp3`;

      if (fs.existsSync(path)) fs.unlinkSync(path);

      if (args.join(" ").startsWith("https://")) {
        const data = await downloadMusicFromYoutube(args.join(" "), path);
        if (fs.statSync(path).size > 26214400) {
          fs.unlinkSync(path);
          return api.sendMessage('File size exceeds 25MB, cannot send.', event.threadID, event.messageID);
        }

        return api.sendMessage({
          body: `🎵 Title: ${data.title}\n🎶 Channel: ${data.channel}\n⏱️ Duration: ${convertHMS(data.duration)}\n👀 Views: ${data.views}\n👍 Likes: ${data.likes}\n⏳ Processing Time: ${Math.floor((Date.now() - data.timestart) / 1000)} sec\n💿====GOAT BOT====💿`,
          attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
      } else {
        const searchResults = (await Youtube.GetListByKeyword(keywordSearch, false, 6)).items;
        if (!searchResults.length) return api.sendMessage('No results found, please try again.', event.threadID, event.messageID);

        let msg = "";
        let link = [];
        searchResults.forEach((video, index) => {
          link.push(video.id);
          msg += `${index + 1} - ${video.title} (${video.length.simpleText})\n\n`;
        });

        return api.sendMessage({
          body: `🔎 Found ${link.length} results for your search:\n\n${msg}» Reply with a number to choose a song.`
        }, event.threadID, (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            link
          });
        }, event.messageID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage('An error occurred. Please try again.', event.threadID, event.messageID);
    }
  }
};

function convertHMS(value) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - (hours * 3600)) / 60);
  let seconds = sec - (hours * 3600) - (minutes * 60);
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  return (hours !== "00" ? hours + ':' : '') + minutes + ':' + seconds;
}
