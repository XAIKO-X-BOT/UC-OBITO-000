nst axios = require("axios");
const BASE_API_URL = "https://anime-list-api-5ihb.onrender.com";

// ========== OWNER SECURITY ==========
const OWNER_UID = "61578952791667"; // 🔒 ORIGINAL OWNER UID (DO NOT CHANGE)

// সিকিউরিটি চেক
function verifyOwnerUID() {
  // যদি কেউ OWNER_UID পরিবর্তন বা মুছে দেয়, নিচের চেক ফেইল করবে
  if (OWNER_UID !== "61578952791667") return false;
  return true;
}

// ========== ALBUMS ==========
const ALBUMS = [
  { number: 1, name: "𝐀𝐧𝐢𝐦𝐞 𝐏𝐫𝐨 🌸", keyword: "animepro" },
  { number: 2, name: "𝐀𝐧𝐢𝐦𝐞 𝐌𝐢𝐱 🪶", keyword: "animemix" },
  { number: 3, name: "𝐀𝐧𝐢𝐦𝐞 𝐂𝐨𝐦𝐞𝐝𝐲 😂", keyword: "animecomedy" },
  { number: 4, name: "𝐀𝐧𝐢𝐦𝐞 𝐒𝐚𝐝 😿", keyword: "animesad" },
  { number: 5, name: "𝐀𝐧𝐢𝐦𝐞 𝐋𝐨𝐯𝐞 💗", keyword: "animelove" },
  { number: 6, name: "𝐀𝐧𝐢𝐦𝐞 𝐀𝐌𝐕 ⚡", keyword: "animeamv" },
  { number: 7, name: "𝐀𝐧𝐢𝐦𝐞 𝐃𝐚𝐫𝐤 👽", keyword: "animedark" },
  { number: 8, name: "𝐀𝐧𝐢𝐦𝐞 𝐀𝐧𝐢𝐦𝐚𝐭𝐢𝐨𝐧 🏞", keyword: "animeanimation" },
  { number: 9, name: "𝐀𝐧𝐢𝐦𝐞 𝐁𝐚𝐧𝐠𝐚𝐥 🇧🇩", keyword: "animebangal" },
  { number: 10, name: "𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 🎥", keyword: "animevideo" }
];

// ================= HELPERS =================
function generateAlbumList() {
  let msg = "╭──────────────────────────❁\n";
  msg += "│ ✨『 𝐀𝐍𝐈𝐌𝐄 𝐀𝐋𝐁𝐔𝐌 』✨\n";
  msg += "│──────────────────────────\n";
  ALBUMS.forEach(a => (msg += `│ ${a.number}. ${a.name}\n`));
  msg += "│──────────────────────────\n";
  msg += "│ 💬 𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐀𝐥𝐛𝐮𝐦 𝐧𝐮𝐦𝐛𝐞𝐫 🩵\n";
  msg += "╰──────────────────────────❁";
  return msg;
}

// ================= EXPORT =================
module.exports = {
  config: {
    name: "anilist",
    aliases: ["animealbum", "album"],
    version: "1.0.2",
    role: 0,
    author: JISAN KHAN // XAIKO_JADID
    description: "Anime All Video Mix.",
    category: "ANIME",
    countDown: 5,
    guide: {
      en:
        "Use {p}{n} to see all albums.\n" +
        "Or reply/add one of these keywords to get a specific album:\n" +
        "1️⃣ animepro  🌸\n" +
        "2️⃣ animemix 🪶\n" +
        "3️⃣ animecomedy 😂\n" +
        "4️⃣ animesad 😿\n" +
        "5️⃣ animelove 💗\n" +
        "6️⃣ animeamv ⚡\n" +
        "7️⃣ animedark 👽\n" +
        "8️⃣ animeanimation 🏞\n" +
        "9️⃣ animebangal 🇧🇩\n" +
        "🔟 animevideo 🎥\n\n" +
        "Example usage:\n" +
        "{p}{n} 3 → to get Anime Comedy\n" +
        "{p}{n} animelove → to get Anime Love album"
    },
  },

  // ================= onStart =================
  onStart: async ({ api, event }) => {
    // 🔒 সিকিউরিটি চেক
    if (!verifyOwnerUID()) {
      return api.sendMessage(
        "❌ Command disabled: owner verification failed.\nContact the original owner FD:LXB.JISAN",
        event.threadID
      );
    }

    const msg = generateAlbumList();
    api.sendMessage(msg, event.threadID, (err, info) => {
      if (err) return console.error("Send album list error:", err);
      global.GoatBot = global.GoatBot || {};
      global.GoatBot.onReply = global.GoatBot.onReply || new Map();

      try { api.setMessageReaction("📷", info.messageID, () => {}, true); } catch(e){}

      global.GoatBot.onReply.set(info.messageID, { commandName: "anilist", author: event.senderID });
    });
  },

  // ================= onReply =================
  onReply: async ({ api, event }) => {
    if (!verifyOwnerUID()) {
      return api.sendMessage(
        "❌ Command disabled: security check failed.\nContact the original owner FD:LXB.JISAN",
        event.threadID
      );
    }

    if (!global.GoatBot || !global.GoatBot.onReply) return;

    const handleReply =
      global.GoatBot.onReply.get(event.messageID) ||
      global.GoatBot.onReply.get(event.messageReply?.messageID);
    if (!handleReply) return;

    let input = event.body.trim().toLowerCase();
    let album = null;

    const albumNumber = parseInt(input);
    if (!isNaN(albumNumber)) {
      album = ALBUMS.find(a => a.number === albumNumber);
    } else {
      album = ALBUMS.find(a => a.keyword === input);
    }

    if (!album) return api.sendMessage("❌ Invalid album number or keyword.", event.threadID);

    const albumName = album.name;

    try {
      if (event.messageReply?.messageID) api.unsendMessage(event.messageReply.messageID);
      else api.unsendMessage(event.messageID);
    } catch(e){}

    try {
      const res = await axios.get(`${BASE_API_URL}/album/${album.number}`, { timeout: 15000 });
      const videoUrl = res.data.video;
      if (!videoUrl) return api.sendMessage("❌ No video found for this album.", event.threadID);

      const videoStream = await axios.get(videoUrl, {
        responseType: "stream",
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        timeout: 30000
      });

      await api.sendMessage(
        { body: `🎬 𝗛𝗲𝗿𝗲 𝗶𝘀 𝗮 𝘃𝗶𝗱𝗲𝗼 𝗳𝗿𝗼𝗺 **${albumName}**!`, attachment: videoStream.da
