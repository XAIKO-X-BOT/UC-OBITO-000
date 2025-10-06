const axios = require("axios");

async function streamFromLink(link) {
  const res = await axios({
    method: "GET",
    url: link,
    responseType: "stream"
  });
  return res.data;
}

async function searchAnimeTiktok(text) {
  const endpoint = `https://mahi-apis.onrender.com/api/tiktok?search=${encodeURIComponent(text)}`;
  try {
    const get = await axios.get(endpoint);
    if (get?.data?.data?.length) return get.data.data;
    return [];
  } catch (err) {
    console.log("❌ API fetch failed:", err.message);
    return [];
  }
}

module.exports = {
  config: {
    name: "animix",
    aliases: ["tiktokedit", "animemix", "anifind"],
    version: "3.0",
    author: "JISΛN",
    cooldowns: 4,
    role: 0,
    shortDescription: { en: "Search Anime 4K Videos 🎥" },
    longDescription: { en: "Search random anime edit videos from TikTok API." },
    category: "fun",
    guide: { en: "{p}{n} <anime name>" }
  },

  onStart: async function ({ api, event, args }) {
    api.setMessageReaction("🎬", event.messageID, () => {}, true);

    const keyword = args.join(" ").trim();
    if (!keyword) {
      return api.sendMessage("⚠️ Please type something to search anime edits.", event.threadID, event.messageID);
    }

    // extra keyword for better result
    const finalSearch = `${keyword} anime edit`;
    const allVideos = await searchAnimeTiktok(finalSearch);

    if (!allVideos.length) {
      return api.sendMessage(`🚫 No results found for "${keyword}". Try another name.`, event.threadID, event.messageID);
    }

    const pick = allVideos[Math.floor(Math.random() * allVideos.length)];
    const vidLink = pick.video;
    const caption = pick.title ? pick.title : "🎞️ Untitled Video";

    if (!vidLink) {
      return api.sendMessage("⚠️ Couldn’t find video URL from the API.", event.threadID, event.messageID);
    }

    try {
      const stream = await streamFromLink(vidLink);
      await api.sendMessage(
        {
          body: `🎥 Anime Edit Randomly Selected!\n🎧 Title: ${caption}\n\nEnjoy your video! 🌸`,
          attachment: stream
        },
        event.threadID,
        event.messageID
      );
    } catch (e) {
      console.error("Video Stream Error:", e.message);
      api.sendMessage("❌ Failed to send video, try again later.", event.threadID, event.messageID);
    }
  }
};
