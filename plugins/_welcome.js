import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;
  
  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.bienvenida) return true;
  
  if (!m.messageStubParameters || !m.messageStubParameters[0]) return true;

  try {
    let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://qu.ax/UJDsS.png')
    let img = await (await fetch(pp)).buffer()  
    let user = `@${m.messageStubParameters[0].split('@')[0]}`

    // BIENVENIDA - cuando alguien se une
    if (m.messageStubType == 27) {
      let welcome = ''
      if (chat.sWelcome) {
        welcome = chat.sWelcome
          .replace('@user', user)
          .replace('@group', groupMetadata.subject)
          .replace('@desc', groupMetadata.desc || 'sin descripción');
      } else {
        welcome = `Bienvenido usuario ${user}\nAl grupo: ${groupMetadata.subject}\nLee esto\n🩸 ${groupMetadata.desc || '𝙎𝙞𝙣 𝙙𝙚𝙨𝙘𝙧𝙞𝙥𝙘𝙞𝙤́𝙣'}\n> @𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳 - ʟᴏᴄᴀʟ - 𝟢𝟨`
      }
      
      await conn.sendMessage(m.chat, {
        image: img,
        caption: welcome,
        mentions: [m.messageStubParameters[0]],
        contextInfo: {
          mentionedJid: [m.messageStubParameters[0]]
        }
      })
    }

    // DESPEDIDA - cuando alguien sale o es removido
    if (m.messageStubType == 28 || m.messageStubType == 32) {
      let bye = ''
      if (chat.sBye) {
        bye = chat.sBye
          .replace('@user', user)
          .replace('@group', groupMetadata.subject)
          .replace('@desc', groupMetadata.desc || 'sin descripción');
      } else {
        bye = `👋🏻 𝙂𝙤𝙤𝙙𝙗𝙮𝙚 𝘽𝙤𝙩\n👤 𝙐𝙨𝙪𝙖𝙧𝙞𝙤: ${user}\n😗 𝙐𝙣𝙖 𝙚𝙨𝙘𝙤𝙧𝙞𝙖 𝙢𝙖́𝙨\n> @𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳 - ʟᴏᴄᴀʟ - 𝟢𝟨`
      }
      
      await conn.sendMessage(m.chat, {
        image: img,
        caption: bye,
        mentions: [m.messageStubParameters[0]],
        contextInfo: {
          mentionedJid: [m.messageStubParameters[0]]
        }
      })
    }

  } catch (error) {
    console.log('Error en welcome plugin:', error)
    
    // Si falla con imagen, enviar solo texto como respaldo
    let user = `@${m.messageStubParameters[0].split('@')[0]}`
    if (m.messageStubType == 27) {
      let welcome = chat.sWelcome ? 
        chat.sWelcome.replace('@user', user).replace('@group', groupMetadata.subject).replace('@desc', groupMetadata.desc || 'sin descripción') :
        `Bienvenido usuario ${user}\nAl grupo: ${groupMetadata.subject}`
      
      await conn.sendMessage(m.chat, {
        text: welcome,
        mentions: [m.messageStubParameters[0]]
      })
    }
    
    if (m.messageStubType == 28 || m.messageStubType == 32) {
      let bye = chat.sBye ? 
        chat.sBye.replace('@user', user).replace('@group', groupMetadata.subject).replace('@desc', groupMetadata.desc || 'sin descripción') :
        `👋🏻 𝙂𝙤𝙤𝙙𝙗𝙮𝙚 ${user}`
      
      await conn.sendMessage(m.chat, {
        text: bye,
        mentions: [m.messageStubParameters[0]]
      })
    }
  }
  
  return true;
}
