import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;


  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://qu.ax/FPVnV.jpg')
  let img = await (await fetch(pp)).buffer()  
  let chat = global.db.data.chats[m.chat]
  let welcome = ''
  let bye = ''

  if (chat.bienvenida && m.messageStubType == 27) {
    if (chat.sWelcome){
      let user = `@${m.messageStubParameters[0].split`@`[0]}`
      welcome = chat.sWelcome
        .replace('@user', () => user)
        .replace('@group', () => groupMetadata.subject)
        .replace('@desc', () => groupMetadata.desc || 'sin descripción');
    } else {
    let user = `@${m.messageStubParameters[0].split`@`[0]}`
    welcome = `Bienvenido usuario ${user}\nAl grupo: ${groupMetadata.subject}\nLee esto\n🩸 ${groupMetadata.desc || '𝙎𝙞𝙣 𝙙𝙚𝙨𝙘𝙧𝙞𝙥𝙘𝙞𝙤́𝙣'}\n> @ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨`
    }
    let text = welcome
    let message = {
      caption: text,
      mentions: [m.messageStubParameters[0]],
      contextInfo: {
        mentionedJid: [m.messageStubParameters[0]],
        externalAdReply: {
          title: packname,
          body: dev,
          mediaUrl: pp,
          mediaType: 2,
          thumbnailUrl: 'https://qu.ax/FPVnV.jpg',
          thumbnail: img
        }
      },
      image: img,
    }
    
    await conn.sendMessage(m.chat, message, { quoted: m })
  }

  if (chat.bienvenida && m.messageStubType == 28) {
    if (chat.sBye) {
          let user = `@${m.messageStubParameters[0].split`@`[0]}`
      bye = chat.sBye
        .replace('@user', () => user)
        .replace('@group', () => groupMetadata.subject)
        .replace('@desc', () => groupMetadata.desc || 'sin descripción');
    } else {
    let user = `@${m.messageStubParameters[0].split`@`[0]}`
    bye = `👋🏻 𝙂𝙤𝙤𝙙𝙗𝙮𝙚 𝘽𝙤𝙩\n👤 𝙐𝙨𝙪𝙖𝙧𝙞𝙤: ${user}\n😗 𝙐𝙣𝙖 𝙚𝙨𝙘𝙤𝙧𝙞𝙖 𝙢𝙖́𝙨 \n> @ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨`
    }
    let text = bye
    let message = {
      caption: text,
      mentions: [m.messageStubParameters[0]],
      contextInfo: {
        mentionedJid: [m.messageStubParameters[0]],
        externalAdReply: {
          title: packname,
          body: dev,
          mediaUrl: pp,
          mediaType: 2,
          thumbnailUrl: 'https://qu.ax/FPVnV.jpg',
          thumbnail: img
        }
      },
      image: img,
    }

    await conn.sendMessage(m.chat, message, { quoted: m })
  }

  if (chat.bienvenida && m.messageStubType == 32) {
    let user = `@${m.messageStubParameters[0].split`@`[0]}`
    let text = chat.sBye || `👋🏻 𝙂𝙤𝙤𝙙𝙗𝙮𝙚 𝘽𝙤𝙩\n👤 𝙐𝙨𝙪𝙖𝙧𝙞𝙤: ${user}\n😗 𝙐𝙣𝙖 𝙚𝙨𝙘𝙤𝙧𝙞𝙖 𝙢𝙖́𝙨\n> @ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨`

    let message = {
      caption: text, 
      mentions: [m.messageStubParameters[0]],
      contextInfo: {
        mentionedJid: [m.messageStubParameters[0]],
        externalAdReply: {
          title: packname,
          body: dev,
          mediaUrl: pp,
          mediaType: 2,
          thumbnailUrl: 'https://qu.ax/FPVnV.jpg',
          thumbnail: img
        }
      },
      image: img,
    }

    await conn.sendMessage(m.chat, message, { quoted: m })
  }
}
