const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const BASE_API_URL = "https://anime-list-api-5ihb.onrender.com";
const OWNER_UID = "61578952791667";

// সিকিউরিটি চেক
function verifyOwnerUID() {
  return OWNER_UID === "61578952791667";
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

// অ্যালবাম লিস্ট মেসেজ
function generateAlbumList() {
  let msg = "╭──────────────────────────❁\n";
  msg += "│ ✨『 𝐀𝐍𝐈𝐌𝐄 𝐀𝐋𝐁𝐔𝐌 』✨\n";
  msg += "│──────────────────────────\n";
  ALBUMS.forEach(a => (msg += `│ ${a.number}. ${a.name}\n`));
  msg += "│──────────────────────────\n";
  msg += "│ 💬 Reply with album number 🩵\n";
  msg += "╰──────────────────────────❁";
  return msg;
}

// ================= EXPORT =================
module.exports = {
  config: {
    name: "anilist2",
    aliases: ["animealbum", "album"],
    version: "2.0.5",
    role: 0,
    author: "JISAN KHAN/OD'X JADID",
    description: "Anime All Video Mix.",
    category: "ANIME",
    countDown: 5
  },

  // ================= onStart =================
  onStart: async ({ api, event }) => {
    if (!verifyOwnerUID()) {
      return api.sendMessage(
        "❌ Command disabled: owner verification failed.\nContact FD:LXB.JISAN",
        event.threadID
      );
    }

    const msg = generateAlbumList();
    api.sendMessage(msg, event.threadID, (err, info) => {
      if (err) return console.error("Send album list error:", err);
      global.GoatBot = global.GoatBot || {};
      global.GoatBot.onReply = global.GoatBot.onReply || new Map();

      try { api.setMessageReaction("📷", info.messageID, () => {}, true); } catch (e) {}

      global.GoatBot.onReply.set(info.messageID, {
        commandName: "anilist",
        author: event.senderID
      });
    });
  },

  // ================= onReply =================
  onReply: async ({ api, event }) => {
    if (!verifyOwnerUID()) {
      return api.sendMessage(
        "❌ Command disabled: security check failed.\nContact FD:LXB.JISAN",
        event.threadID
      );
    }

    if (!global.GoatBot || !global.GoatBot.onReply) return;

    const handleReply =
      global.GoatBot.onReply.get(event.messageID) ||
      global.GoatBot.onReply.get(event.messageReply?.messageID);
    if (!handleReply) return;

    const input = event.body.trim().toLowerCase();
    const albumNumber = parseInt(input);
    const album = !isNaN(albumNumber)
      ? ALBUMS.find(a => a.number === albumNumber)
      : ALBUMS.find(a => a.keyword === input);

    if (!album)
      return api.sendMessage("❌ Invalid album number or keyword.", event.threadID);

    const albumName = album.name;
    const tempPath = path.join(__dirname, "cache");
    fs.ensureDirSync(tempPath);
    const filePath = path.join(tempPath, `${album.keyword}_${Date.now()}.mp4`);

    try {
      const loadingMsg = await api.sendMessage(
        `🎬 Fetching video from ${albumName}... Please wait.`,
        event.threadID
      );

      // 3 বার পর্যন্ত ট্রাই করবে
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await axios.get(`${BASE_API_URL}/album/${album.number}`, { timeout: 15000 });
          if (!res.data || !res.data.video) throw new Error("Invalid API response");

          const videoUrl = res.data.video;
          const videoStream = await axios.get(videoUrl, {
            responseType: "arraybuffer",
            timeout: 30000,
            headers: { "User-Agent": "Mozilla/5.0" }
          });

          await fs.writeFile(filePath, videoStream.data);
          const stats = fs.statSync(filePath);

          if (stats.size < 10000) throw new Error("Corrupted or empty file");

          await api.sendMessage(
            {
              body: `🎥 𝗛𝗲𝗿𝗲 𝗶𝘀 𝗮 𝘃𝗶𝗱𝗲𝗼 𝗳𝗿𝗼𝗺 ${albumName}!`,
              attachment: fs.createReadStream(filePath)
            },
            event.threadID
          );

          success = true;
          try { api.unsendMessage(loadingMsg.messageID); } catch (e) {}
          break;
        } catch (err) {
          console.log(`⚠️ Attempt ${attempt} failed: ${err.message}`);
          if (attempt === 3) {
            api.sendMessage("❌ Failed to fetch or send video. Try again later.", event.threadID);
          } else {
            await new Promise(r => setTimeout(r, 2000));
          }
        }
      }
    } catch (e) {
      console.error("❌ Error sending video:", e.message);
      api.sendMessage("⚠️ Unexpected error occurred. Try again later.", event.threadID);
    } finally {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }
};
