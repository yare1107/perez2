import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let chat = global.db.data.chats[m.chat]
  if (!chat) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://qu.ax/UJDsS.png')
  let img = await (await fetch(pp)).buffer()  
  let welcome = ''
  let bye = ''
  // Bienvenida cuando alguien se une al grupo (messageStubType 27)
  if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    if (chat.sWelcome){
      let user = `@${m.messageStubParameters[0].split`@`[0]}`
      welcome = chat.sWelcome
        .replace('@user', () => user)
        .replace('@group', () => groupMetadata.subject)
        .replace('@desc', () => groupMetadata.desc || 'sin descripción');
    } else {
    let user = `@${m.messageStubParameters[0].split`@`[0]}`
    welcome = `Bienvenido usuario ${user}\nAl grupo: ${groupMetadata.subject}\nLee esto\n🩸 ${groupMetadata.desc || '𝙎𝙞𝙣 𝙙𝙚𝙨𝙘𝙧𝙞𝙥𝙘𝙞𝙤́𝙣'}\n> @𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳 - ʟᴏᴄᴀʟ - 𝟢𝟨`
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
          thumbnailUrl: 'https://qu.ax/UJDsS.png',
          thumbnail: img
        }
      },
      image: img,
    }
    
    await conn.sendMessage(m.chat, message, { quoted: m })
  }
  // Despedida cuando alguien sale del grupo (messageStubType 28)
  if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
    if (chat.sBye) {
          let user = `@${m.messageStubParameters[0].split`@`[0]}`
      bye = chat.sBye
        .replace('@user', () => user)
        .replace('@group', () => groupMetadata.subject)
        .replace('@desc', () => groupMetadata.desc || 'sin descripción');
    } else {
    let user = `@${m.messageStubParameters[0].split`@`[0]}`
    bye = `👋🏻 𝙂𝙤𝙤𝙙𝙗𝙮𝙚 𝘽𝙤𝙩\n👤 𝙐𝙨𝙪𝙖𝙧𝙞𝙤: ${user}\n😗 𝙐𝙣𝙖 𝙚𝙨𝙘𝙤𝙧𝙞𝙖 𝙢𝙖́𝙨 \n> @𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳 - ʟᴏᴄᴀʟ - 𝟢𝟨`
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
          thumbnailUrl: 'https://qu.ax/UJDsS.png',
          thumbnail: img
        }
      },
      image: img,
    }
    await conn.sendMessage(m.chat, message, { quoted: m })
  }
  // Despedida cuando alguien se va del grupo (messageStubType 32)
  if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    let user = `@${m.messageStubParameters[0].split`@`[0]}`
    let text = chat.sBye || `👋🏻 𝙂𝙤𝙤𝙙𝙗𝙮𝙚 𝘽𝙤𝙩\n👤 𝙐𝙨𝙪𝙖𝙧𝙞𝙤: ${user}\n😗 𝙐𝙣𝙖 𝙚𝙨𝙘𝙤𝙧𝙞𝙖 𝙢𝙖́𝙨\n> @𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳 - ʟᴏᴄᴀʟ - 𝟢𝟨`
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
          thumbnailUrl: 'https://qu.ax/UJDsS.png',
          thumbnail: img
        }
      },
      image: img,
    }
    await conn.sendMessage(m.chat, message, { quoted: m })
  }
}
