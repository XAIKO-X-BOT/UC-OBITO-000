const axios = require('axios');
const baseApiUrl = async () => {
 return "https://www.noobs-api.rf.gd/dipto";
};

module.exports.config = {
 name: "risu",
 aliases: ["baby", "bbe", "bot", "jadid", "babe"],
 version: "6.9.0",
 author: "YOUR ROCKY",
 countDown: 0,
 role: 0,
 description: "better then all sim simi",
 category: "𝗔𝗜 & 𝗚𝗣𝗧",
 guide: {
 en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
 }
};

module.exports.onStart = async ({
 api,
 event,
 args,
 usersData
}) => {
 const link = `${await baseApiUrl()}/baby`;
 const dipto = args.join(" ").toLowerCase();
 const uid = event.senderID;
 let command, comd, final;

 try {
 if (!args[0]) {
 const ran = ["জাদিদ ভালো হয়ে যাও প্রেম পিরিতি ভালো না 😑🦧", "hum", "type help baby", "type +baby hi"];
 return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
 }

 if (args[0] === 'remove') {
 const fina = dipto.replace("remove ", "");
 const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
 return api.sendMessage(dat, event.threadID, event.messageID);
 }

 if (args[0] === 'rm' && dipto.includes('-')) {
 const [fi, f] = dipto.replace("rm ", "").split(' - ');
 const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
 return api.sendMessage(da, event.threadID, event.messageID);
 }

 if (args[0] === 'list') {
 if (args[1] === 'all') {
 const data = (await axios.get(`${link}?list=all`)).data;
 const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
 const number = Object.keys(item)[0];
 const value = item[number];
 const name = (await usersData.get(number)).name;
 return {
 name,
 value
 };
 }));
 teachers.sort((a, b) => b.value - a.value);
 const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
 return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
 } else {
 const d = (await axios.get(`${link}?list=all`)).data.length;
 return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
 }
 }

 if (args[0] === 'msg') {
 const fuk = dipto.replace("msg ", "");
 const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
 return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
 }

 if (args[0] === 'edit') {
 const command = dipto.split(' - ')[1];
 if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
 const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
 return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
 [comd, command] = dipto.split(' - ');
 final = comd.replace("teach ", "");
 if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
 const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
 const tex = re.data.message;
 const teacher = (await usersData.get(re.data.teacher)).name;
 return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] === 'amar') {
 [comd, command] = dipto.split(' - ');
 final = comd.replace("teach ", "");
 if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
 const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
 return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
 }

 if (args[0] === 'teach' && args[1] === 'react') {
 [comd, command] = dipto.split(' - ');
 final = comd.replace("teach react ", "");
 if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
 const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
 return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
 }

 if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
 const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
 return api.sendMessage(data, event.threadID, event.messageID);
 }

 const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
 api.sendMessage(d, event.threadID, (error, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 d,
 apiUrl: link
 });
 }, event.messageID);

 } catch (e) {
 console.log(e);
 api.sendMessage("Check console for error", event.threadID, event.messageID);
 }
};

module.exports.onReply = async ({
 api,
 event,
 Reply
}) => {
 try {
 if (event.type == "message_reply") {
 const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
 await api.sendMessage(a, event.threadID, (error, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 a
 });
 }, event.messageID);
 }
 } catch (err) {
 return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
 }
};

module.exports.onChat = async ({
 api,
 event,
 message
}) => {
 try {
 const body = event.body ? event.body?.toLowerCase() : ""
 if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("বেবি") || body.startsWith("bot") || body.startsWith("rocky") || body.startsWith("babu") || body.startsWith("বট")) {
 const arr = body.replace(/^\S+\s*/, "")
 const randomReplies = [
  "😏 𝐔𝐦𝐦𝐚𝐚 𝐝𝐢𝐥𝐞 5 𝐓𝐚𝐤𝐚 𝐝𝐢𝐦𝐮😚",
  "😉 𝐂𝐨𝐥𝐨 𝐣𝐚𝐍 𝐝𝐮𝐫𝐲 𝐤𝐨𝐭𝐡𝐚𝐨 𝐡𝐚𝐫𝐢𝐲𝐞 𝐣𝐚𝐢😆",
  "💋 𝐉𝐚𝐧 𝐇𝐚𝐧𝐠𝐚 𝐤𝐨𝐫𝐛𝐚😙🤭",
  "😼𝐛𝐛𝐲 𝐛𝐨𝐥𝐛𝐢𝐧𝐚 𝐥𝐮𝐧𝐠𝐢 𝐤𝐡𝐮𝐥𝐞 𝐝𝐢𝐛𝐨😤😈",
  "😇 𝐒𝐡𝐮𝐧𝐥𝐚𝐦 𝐓𝐮𝐦𝐢 𝐧𝐚𝐤𝐢 𝐥𝐮𝐜𝐜𝐡𝐚☹🧐",
  "🥀 𝐀𝐦𝐢 𝐓𝐮𝐫 𝐊𝐨𝐲 𝐍𝐮𝐦𝐛𝐞𝐫 𝐛𝐛𝐲,🥴🤒",
  "👀 𝐈𝐧𝐛𝐨𝐱 𝐍𝐨𝐤 𝐃𝐢𝐥𝐞 𝐛𝐚𝐬𝐡 𝐅𝐢𝐫𝐞𝐞🤧😌", 
  "😣𝐚𝐤𝐭𝐮 𝐯𝐚𝐥𝐥𝐨𝐛𝐚𝐬𝐡𝐚 𝐝𝐢𝐛𝐚😢",
  "😼𝐚𝐢𝐭𝐞 𝐝𝐞𝐤𝐡𝐢 𝐣𝐚𝐢𝐭𝐞 𝐝𝐞𝐤𝐡𝐢 𝐛𝐚𝐤𝐢 𝐥𝐢𝐧𝐞 𝐭𝐮𝐦𝐢 𝐤𝐨𝐮💟😽",
  "💋𝐩𝐫𝐞𝐦𝐞 𝐩𝐨𝐫𝐞 𝐠𝐚𝐥𝐞 𝐛𝐚𝐬𝐡 𝐟𝐢𝐫𝐞𝐞🙊",
  "🤔𝐕𝐚𝐢 𝐓𝐮𝐢 𝐤𝐞🤐",
  "😔𝐯𝐡𝐮𝐥𝐞 𝐣𝐚𝐮 𝐚𝐦𝐚𝐤𝐞🤒",
  "😑𝐚𝐦𝐚𝐤𝐞 𝐝𝐞𝐤𝐨𝐧𝐚 𝐚𝐦𝐢 𝐚𝐤𝐭𝐚 𝐚𝐛𝐚𝐥 𝐛𝐨𝐭🤫",
  "🥀𝐓𝐮𝐦𝐚𝐫 𝐚𝐤𝐭𝐚𝐢 𝐤𝐨𝐬𝐭𝐨 𝐭𝐮𝐦𝐢 𝐭𝐮𝐦𝐚𝐫 𝐚𝐦𝐦𝐮 𝐚𝐛𝐛𝐮𝐫 𝐛𝐢𝐲𝐞 𝐭𝐞 𝐝𝐚𝐰𝐚𝐭 𝐩𝐚𝐨 𝐧𝐚𝐢 𝐭𝐚𝐢𝐧𝐚☹",
  "😎𝐒𝐡𝐮𝐧𝐥𝐚𝐦 𝐓𝐮𝐢 𝐍𝐚𝐤𝐢 𝐁𝐢𝐲𝐞 𝐊𝐨𝐫𝐬𝐨𝐭🙈",
  "😿𝐁𝐚𝐛𝐮 𝐂𝐞𝐤𝐡𝐚 𝐃𝐢𝐥𝐞 𝐤𝐚𝐧𝐧𝐚 𝐤𝐨𝐫𝐛𝐚💢👁‍🗨",
  "🗯𝐚𝐤𝐭𝐚 𝐠𝐚𝐧 𝐬𝐡𝐮𝐧𝐚𝐨💤💣",
  "👽𝐓𝐮𝐦𝐚𝐫 𝐢𝐧𝐭𝐫𝐨 𝐝𝐞𝐮😽",
  "👺𝐀𝐦𝐚𝐤𝐞 𝐛𝐢𝐲𝐞 𝐤𝐨𝐫𝐛𝐢 𝐤𝐨😠",
  "😡𝐓𝐮𝐫 𝐊𝐮𝐧 𝐉𝐨𝐧𝐦𝐞𝐫 𝐛𝐚𝐛𝐲 𝐚𝐦𝐢🤬",
  "😾𝐤𝐨𝐢𝐬𝐢𝐧𝐚 𝐝𝐚𝐤𝐛𝐢𝐧𝐚 𝐚𝐦𝐚𝐲 𝐭𝐮𝐫 𝐛𝐨𝐮 𝐚𝐫 𝐤𝐚𝐬𝐞 𝐣𝐚 𝐥𝐮𝐜𝐜𝐡𝐚 𝐛𝐞𝐝𝐚👻",
  "😌𝐕𝐚𝐥𝐥𝐨𝐛𝐚𝐬𝐡𝐚𝐫 𝐀𝐫𝐞𝐤 𝐍𝐚𝐦𝐞 𝐊𝐨𝐭 𝐊𝐡𝐞𝐲𝐞 𝐩𝐮𝐫𝐧𝐨𝐭𝐚😪",
  "🤨𝐉𝐚𝐧 𝐂𝐨𝐥𝐨 𝐂𝐢𝐩𝐚𝐲 𝐤𝐨𝐭 𝐤𝐡𝐞𝐲𝐞 𝐩𝐮𝐫𝐧𝐨𝐭𝐚 𝐨𝐫𝐣𝐨𝐧 𝐤𝐨𝐫𝐛𝐨🤗🤭", 
  " 😗𝐉𝐚𝐧 𝐀𝐢 𝐍𝐞𝐮 𝐧𝐮𝐦𝐛𝐞𝐫 01319****** 𝐀𝐫𝐭𝐞𝐥 𝐧𝐮𝐦𝐛𝐞𝐫 𝐠𝐢𝐯𝐞 𝐦𝐞 𝐦𝐛🤗",
  "🙃𝐌𝐲 𝐎𝐰𝐧𝐞𝐫 𝐰𝐩 𝐧𝐮𝐦𝐛𝐞𝐫 013190***** 𝐍𝐨𝐤 𝐧𝐨𝐰",
  "😉𝐁𝐛𝐲 𝐍𝐚 𝐁𝐨𝐥𝐞 𝐛𝐚𝐛𝐲 𝐛𝐨𝐥𝐨 😚",
  "🤕𝐓𝐞𝐚𝐜𝐇 𝐃𝐞𝐮 𝐀𝐦𝐚𝐤𝐞🤤",
  "🥶𝐎𝐍𝐊 𝐒𝐇𝐈𝐓 𝐊𝐎𝐑𝐄 𝐆𝐎𝐑𝐎𝐌 𝐊𝐀𝐋𝐄🧐",
  "😵𝐚𝐦𝐢 𝐭𝐮𝐦𝐚𝐫 𝐚𝐦𝐨𝐧 𝐛𝐚𝐛𝐲 𝐠𝐨𝐫𝐨𝐦 𝐤𝐚𝐥𝐞𝐮 𝐬𝐡𝐢𝐭 𝐤𝐚𝐥 𝐦𝐨??𝐞 𝐤𝐨𝐑𝐢🥱",
  "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤",
  "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘",
  "দেখা হলে কাঠগোলাপ দিও..🤗",
  "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺",
  "আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_🙄",
  "আরে Bolo আমার জান, কেমন আসো? 😚"‚
  "এই এই তোর পরীক্ষা কবে? শুধু 𝗕𝗯𝘆 𝗯𝗯𝘆 করিস 😾",
  "𝗪𝗵𝗮𝘁’𝘀 𝘂𝗽?🐤",
  "𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো 😘",
  "amr JaNu lagbe,Tumi ki single aso?",
  "তোরা যে হারে 𝗕𝗯𝘆 ডাকছিস আমি তো সত্যি বাচ্চা হয়ে যাবো_☹😑",
  "ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম🥹🫣",
  "__ফ্রী ফে'সবুক চালাই কা'রন ছেলেদের মুখ দেখা হারাম 😌",
  "babu khuda lagse🥺",
  "𝗕𝗯𝘆 বললে চাকরি থাকবে না",
  "ওই তুমি single না?🫵🤨 😑😒",
  "একটা BF খুঁজে দাও 😿",
  "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
  "ফ্রেন্ড রিকোয়েস্ট দিলে ৫ টাকা দিবো 😗",
  "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘",
  "𝗧𝗮𝗿𝗽𝗼𝗿 𝗯𝗼𝗹𝗼_🙂",
  "meww",
  "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂",
  "আজব তো__😒",
  "বলো কি করতে পারি তোমার জন্য 😚",
  "চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫",
  "দেখা হলে কাঠগোলাপ দিও..🤗"
  
];
 if (!arr) {

 await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
 if (!info) message.reply("info obj not found")
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID
 });
 }, event.messageID)
 }
 const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
 await api.sendMessage(a, event.threadID, (error, info) => {
 global.GoatBot.onReply.set(info.messageID, {
 commandName: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 a
 });
 }, event.messageID)
 }
 } catch (err) {
 return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
 }
};
