module.exports = {
  config: {
    name: "link",
    version: "1.0.0",
    permission: 0,
    credits: "Mastermind X Rocky", // do not change
    description: "FB UID/mention/reply theke profile link dey",
    commandCategory: "utility",
    usages: "link [uid | @mention]\n- reply kore: link\n- mention: link @user\n- self: link",
    cooldowns: 2
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const getName = async (id) => {
        try {
          const info = await new Promise((resolve, reject) =>
            api.getUserInfo([id], (err, data) => (err ? reject(err) : resolve(data)))
          );
          return info?.[id]?.name || id;
        } catch {
          return id;
        }
      };

      const unique = arr => [...new Set(arr.filter(Boolean))];

      let targets = [];

      // 1) UID passed as arg (allow multiple UIDs separated by space/line)
      if (args.length) {
        for (const token of args) {
          // strip non-digit for UID; if not numeric, treat as vanity username
          if (/^\d+$/.test(token)) targets.push(token);
          else if (/^[A-Za-z0-9.\-]+$/.test(token)) targets.push(token); // vanity/username
        }
      }

      // 2) Mentions
      if (event.mentions && Object.keys(event.mentions).length) {
        targets.push(...Object.keys(event.mentions));
      }

      // 3) Reply target
      if (event.type === "message_reply" && event.messageReply?.senderID) {
        targets.push(event.messageReply.senderID);
      }

      // 4) Default to sender
      if (targets.length === 0) {
        targets.push(event.senderID);
      }

      targets = unique(targets);

      // Build lines
      const lines = [];
      for (const id of targets) {
        if (/^\d+$/.test(id)) {
          const name = await getName(id);
          lines.push(`👤 ${name}\n🔗 https://www.facebook.com/profile.php?id=${id}`);
        } else {
          // looks like a vanity/username
          lines.push(`👤 ${id}\n🔗 https://www.facebook.com/${id}`);
        }
      }

      return message.reply(lines.join("\n\n"));
    } catch (e) {
      return message.reply("❌ Error: kichu ekta vul hoyeche. Pore abar try korun.");
    }
  }
};
