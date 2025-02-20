const fs = require("fs");
const request = require("request");

module.exports = {
    config: {
        name: "test",
        version: "1.4",
        author: "NTKhang",
        countDown: 5,
        role: 0,
        description: {
            vi: "Xem số lượng tin nhắn của tất cả thành viên hoặc bản thân (tính từ lúc bot vào nhóm)",
            en: "View the number of messages of all members or yourself (since the bot joined the group)"
        },
        category: "box chat",
        guide: {
            vi: "   {pn}: dùng để xem số lượng tin nhắn của bạn"
                + "\n   {pn} @tag: dùng để xem số lượng tin nhắn của những người được tag"
                + "\n   {pn} all: dùng để xem số lượng tin nhắn của tất cả thành viên",
            en: "   {pn}: used to view the number of messages of you"
                + "\n   {pn} @tag: used to view the number of messages of those tagged"
                + "\n   {pn} all: used to view the number of messages of all members"
        }
    },

    langs: {  
        vi: {  
            count: "Số tin nhắn của các thành viên:",  
            endMessage: "Những người không có tên trong danh sách là chưa gửi tin nhắn nào.",  
            page: "Trang [%1/%2]",  
            reply: "Phản hồi tin nhắn này kèm số trang để xem tiếp",  
            result: "%1 hạng %2 với %3 tin nhắn",  
            yourResult: "Bạn đứng hạng %1 và đã gửi %2 tin nhắn trong nhóm này",  
            invalidPage: "Số trang không hợp lệ"  
        },  
        en: {  
            count: "Number of messages of members:",  
            endMessage: "Those who do not have a name in the list have not sent any messages.",  
            page: "Page [%1/%2]",  
            reply: "Reply to this message with the page number to view more",  
            result: "%1 rank %2 with %3 messages",  
            yourResult: "You are ranked %1 and have sent %2 messages in this group",  
            invalidPage: "Invalid page number"  
        }  
    },  

    onStart: async function ({ args, threadsData, message, event, api, commandName, getLang }) {  
        const { threadID, senderID } = event;  
        const threadData = await threadsData.get(threadID);  
        const { members } = threadData;  
        const usersInGroup = (await api.getThreadInfo(threadID)).participantIDs;  
        let arraySort = [];  

        for (const user of members) {  
            if (!usersInGroup.includes(user.userID)) continue;
            arraySort.push({  
                name: user.name,  
                count: user.count,  
                uid: user.userID  
            });  
        }  

        let stt = 1;  
        arraySort.sort((a, b) => b.count - a.count);  
        arraySort.map(item => item.stt = stt++);  

        // **Random message & photo feature**  
        const quotes = [
            "ღ••\n– কোনো নেতার পিছনে নয়.!!🤸‍♂️\n– মসজিদের ইমামের পিছনে দাড়াও জীবন বদলে যাবে ইনশাআল্লাহ.!!🖤🌻\n۵",
            "-!\n__আল্লাহর রহমত থেকে নিরাশ হওয়া যাবে না!” আল্লাহ অবশ্যই তোমাকে ক্ষমা করে দিবেন☺️🌻\nসুরা যুমাহ্ আয়াত ৫২..৫৩💙🌸\n-!",
            "- ইসলাম অহংকার করতে শেখায় না!🌸\n\n- ইসলাম শুকরিয়া আদায় করতে শেখায়!🤲🕋🥀",
        ];

        const images = [
            "https://i.postimg.cc/7LdGnyjQ/images-31.jpg",
            "https://i.postimg.cc/65c81ZDZ/images-30.jpg",
            "https://i.postimg.cc/8zNpKGFb/motivation1.jpg",
            "https://i.postimg.cc/zXDFJfNc/motivation2.jpg",
            "https://i.postimg.cc/qMFVbJNF/motivation3.jpg"
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const randomImage = images[Math.floor(Math.random() * images.length)];

        const callback = () => api.sendMessage(
            { body: `「 ${randomQuote} 」`, attachment: fs.createReadStream(__dirname + "/cache/random.jpg") },
            event.threadID,
            () => fs.unlinkSync(__dirname + "/cache/random.jpg")
        );

        request(encodeURI(randomImage)).pipe(fs.createWriteStream(__dirname + "/cache/random.jpg")).on("close", () => callback());

        // **Count Messages Logic**
        if (args[0]) {  
            if (args[0].toLowerCase() == "all") {  
                let msg = getLang("count");  
                const endMessage = getLang("endMessage");  

                for (const item of arraySort) {  
                    if (item.count > 0) msg += `\n${item.stt}/ ${item.name}: ${item.count}`;  
                }  

                if ((msg + endMessage).length > 19999) {  
                    msg = "";  
                    let page = parseInt(args[1]);  
                    if (isNaN(page)) page = 1;  
                    const splitPage = global.utils.splitPage(arraySort, 50);  
                    arraySort = splitPage.allPage[page - 1];  
                    for (const item of arraySort) {  
                        if (item.count > 0) msg += `\n${item.stt}/ ${item.name}: ${item.count}`;  
                    }  
                    msg += getLang("page", page, splitPage.totalPage) + `\n${getLang("reply")}` + `\n\n${endMessage}`;  

                    return message.reply(msg, (err, info) => {  
                        if (err) return message.err(err);  
                        global.GoatBot.onReply.set(info.messageID, {  
                            commandName,  
                            messageID: info.messageID,  
                            splitPage,  
                            author: senderID  
                        });  
                    });  
                }  
                message.reply(msg);  
            } else if (event.mentions) {  
                let msg = "";  
                for (const id in event.mentions) {  
                    const findUser = arraySort.find(item => item.uid == id);  
                    msg += `\n${getLang("result", findUser.name, findUser.stt, findUser.count)}`;  
                }  
                message.reply(msg);  
            }  
        } else {  
            const findUser = arraySort.find(item => item.uid == senderID);  
            return message.reply(getLang("yourResult", findUser.stt, findUser.count));  
        }  
    },

    onChat: async ({ usersData, threadsData, event }) => {  
        const { senderID, threadID } = event;  
        const members = await threadsData.get(threadID, "members");  
        const findMember = members.find(user => user.userID == senderID);  

        if (!findMember) {  
            members.push({  
                userID: senderID,  
                name: await usersData.getName(senderID),  
                nickname: null,  
                inGroup: true,  
                count: 1  
            });  
        } else {  
            findMember.count += 1;  
        }  
        await threadsData.set(threadID, members, "members");  
    }
};
