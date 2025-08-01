import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import * as fs from 'fs';

const handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
  try {
    const users = participants.map((u) => conn.decodeJid(u.id));
    const watermark = '\n\n> 𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳';

    const q = m.quoted ? m.quoted : m || m.text || m.sender;
    const c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender;

    let messageText = (text || q.text);
    if (!messageText.includes(watermark)) {
      messageText += watermark;
    }

    const msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        { [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted ? c.message[q.mtype] : { text: '' || c } },
        { quoted: m, userJid: conn.user.id }
      ),
      messageText,
      conn.user.jid,
      { mentions: users }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch {
    const users = participants.map((u) => conn.decodeJid(u.id));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const isMedia = /image|video|sticker|audio/.test(mime);
    const watermark = '\n\n> 𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳';

    if (isMedia) {
      const mediax = await quoted.download?.();
      const options = { mentions: users, quoted: m };

      if (quoted.mtype === 'imageMessage') {
        conn.sendMessage(m.chat, { image: mediax, caption: (text || '') + watermark, ...options });
      } else if (quoted.mtype === 'videoMessage') {
        conn.sendMessage(m.chat, { video: mediax, caption: (text || '') + watermark, mimetype: 'video/mp4', ...options });
      } else if (quoted.mtype === 'audioMessage') {
        conn.sendMessage(m.chat, { audio: mediax, caption: watermark, mimetype: 'audio/mpeg', fileName: `Hidetag.mp3`, ...options });
      } else if (quoted.mtype === 'stickerMessage') {
        conn.sendMessage(m.chat, { sticker: mediax, ...options });
      }
    } else {
      const more = String.fromCharCode(8206);
      const masss = more.repeat(850) + watermark;

      await conn.relayMessage(
        m.chat,
        {
          extendedTextMessage: {
            text: `${masss}`,
            contextInfo: {
              mentionedJid: users,
              externalAdReply: {
                thumbnail: icons,
                sourceUrl: channel
              }
            }
          }
        },
        {}
      );
    }
  }
};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i;

handler.group = true;
handler.admin = true;

export default handler;
