const fs = require("fs");
const moment = require("moment-timezone");

module.exports = {
	config: {
		name: "info",
		version: "1.0",
		author: "Jadid",
		countDown: 20,
		role: 0,
		shortDescription: { vi: "", en: "" },
		longDescription: { vi: "", en: "" },
		category: "owner",
		guide: { en: "" },
		envConfig: {}
	},
	onStart: async function ({ message }) {
		const authorName = "⩸𝐑𝐀𝐉⩸";
		const ownAge = "『 ⩸__17__⩸ 』";
		const messenger = "https://www.facebook.com/UC.OBITO.2008";
		const authorFB = "https://www.facebook.com/UC.OBITO.2008";
		const authorNumber = "+8801319039003";
		const status = "Single";
		const urls = [
			"https://ik.imagekit.io/ylceaheqh/GCcrOFehYWohdcSbYwWdgGpFA0P.jpg", // Replace with your valid image URLs
			"https://ik.imagekit.io/ylceaheqh/GCcrOFehYWohdcSbYwWdgGpFA0P.jpg"
		];
		const link = urls[Math.floor(Math.random() * urls.length)];
		const now = moment().tz("Asia/Jakarta");
		const date = now.format("MMMM Do YYYY");
		const time = now.format("h:mm:ss A");
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime / 60) % 60);
		const hours = Math.floor((uptime / (60 * 60)) % 24);
		const days = Math.floor(uptime / (60 * 60 * 24));
		const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

		message.reply({
			body: `💫《 ⩸__𝐁𝐨𝐭 𝐀𝐧𝐝 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧__⩸ 》💫
🤖 彡𝐵𝑜𝑡 𝑁𝑎𝑚𝑒 : ${global.GoatBot.config.nickNameBot}__⩸
👾 彡𝐵𝑜𝑡 𝑆𝑦𝑠𝑡𝑒𝑚 𝑃𝑟𝑒𝑓𝑖𝑥 : ${global.GoatBot.config.prefix}
💙 彡𝑂𝑤𝑛𝑒𝑟 𝑁𝑎𝑚𝑒 : ${authorName}
📝 彡𝐴𝑔𝑒 : ${ownAge}
💕 彡𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑆ℎ𝑖𝑝 : ${status}
🌐 彡𝑊𝑝 : আমার ex এর কাছে আছে 😬
🌍 彡𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐿𝑖𝑛𝑘 : ${authorFB}
🗓 彡𝐷𝑎𝑡𝑒 : ${date}
⏰ 彡𝑁𝑜𝑤 𝑇𝑖𝑚𝑒 : ${time}
🔰 彡𝐴𝑛𝑦 𝐻𝑒𝑙𝑝 𝐶𝑜𝑛𝑡𝑎𝑐𝑡 : ${messenger}
📛 彡𝐵𝑜𝑡 𝐼𝑠 𝑅𝑢𝑛𝑛𝑖𝑛𝑔 𝐹𝑜𝑟 : ${uptimeString}

𝑻𝒈: @xa8ko9ad8d
𝑰𝒏𝒔𝒕𝒂: দিব না শরম করে 🤐  
𝑪𝒂𝒑𝑪𝒖𝒕: একাউন্ট নাই। কিন্তু ইডিট করি 😗  
𝑻𝒊𝒌𝑻𝒐𝒌: xaiko_obito_007/xaiko_obito_009
𝒀𝒐𝒖𝑻𝒖𝒃𝒆: itsmeobito007  
===============`,
			attachment: await global.utils.getStreamFromURL(link)
		});
	},
	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "info") {
			this.onStart({ message });
		}
	}
};
