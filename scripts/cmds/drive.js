const axios = require('axios');

module.exports = {
	config: {
		name: "drive",
		version: "1.0.2",
		author: "IMRAN_x_MAHABUB",
		countDown: 5,
		role: 0,
		description: {
			vi: "Tải video và thêm vào drive",
			en: "Upload a video and add it to an drive"
		},
		category: "user",
		guide: {
			vi: "   {pn} <link>: thêm video từ liên kết vào drive"
				+ "\n   Phản hồi tin nhắn có media để thêm video",
			en: "   {pn} <link>: add video from link to drive"
				+ "\n   Reply to a message with media to add video"
		}
	},

	langs: {
		vi: {
			missingInput: "Vui lòng cung cấp liên kết hợp lệ hoặc phản hồi tin nhắn có chứa media.",
			uploadSuccess: "✅ | {title}\n\n🔰\n🔥 | URL: {url}\n👻 ID: {id}",
			albumFail: "Không thể lấy dữ liệu album.",
			error: "Không thể xử lý media.\nLỗi: {error}"
		},
		en: {
			missingInput: "Please provide a valid URL or reply to a message with media.",
			uploadSuccess: "✅ TITTLE: {title}\n\n🔰\n🔥 | URL: {url}\n👻 ID: {id}",
			albumFail: "Failed to retrieve album data.",
			error: "Failed to convert media.\nError: {error}"
		}
	},

	onStart: async function ({ message, event, args, getLang }) {
		const inputUrl = event?.messageReply?.attachments?.[0]?.url || args[0];

		if (!inputUrl)
			return message.reply(getLang("missingInput"));

		try {
			// Upload using your updated API
			const res = await axios.get(`https://glowing-octo-computing-machine-seven.vercel.app/api/upload?url=${encodeURIComponent(inputUrl)}`);
			const { directLink, fileId, name } = res.data;
			const title = args.join(" ") || name || "Uploaded Media";

			// Album API
			const svRes = await axios.get(`http://de3.spaceify.eu:25335/album?title=${encodeURIComponent(title)}&url=${encodeURIComponent(directLink)}`);
			const data = svRes.data;

			if (data && data.data?.title) {
				const successMessage = getLang("uploadSuccess")
					.replace("{title}", data.data.title)
					.replace("{url}", directLink)
					.replace("{id}", fileId);
				message.reply(successMessage);
			} else {
				message.reply(getLang("albumFail"));
			}
		} catch (error) {
			console.error("Upload/Add Error:", error?.response?.data || error.message);
			message.reply(getLang("error").replace("{error}", error.message));
		}
	}
};
