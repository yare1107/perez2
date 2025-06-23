let partidasVS6 = {};

let handler = async (m, { conn, args }) => {
  let plantilla = `
𝟔 𝐕𝐄𝐑𝐒𝐔𝐒 𝟔

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : 
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 :                

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: ${args[0] || ''}
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

      𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇  
    
    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ 
    🥷🏻 ┇

(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎)
  `.trim()

  let msg = await conn.sendMessage(m.chat, { text: plantilla }, { quoted: m })
  partidasVS6[msg.key.id] = {
    chat: m.chat,
    jugadores: [],
    suplentes: [],
    modalidad: args[0] || '',
    originalMsg: msg,
  }
}

handler.help = ['6vs6']
handler.tags = ['freefire']
handler.command = /^(vs6|6vs6|masc6)$/i
handler.group = true
handler.admin = true

// Función para manejar las reacciones
handler.before = async function (m) {
  if (!m.message?.reactionMessage) return false
  
  let reaction = m.message.reactionMessage
  let key = reaction.key
  let emoji = reaction.text
  let sender = m.key.participant || m.key.remoteJid

  // Solo procesar reacciones de corazón o pulgar arriba
  if (!['❤️', '👍🏻', '❤', '👍'].includes(emoji)) return false
  
  // Verificar si existe la partida
  if (!partidasVS6[key.id]) return false

  let data = partidasVS6[key.id]

  // Verificar si el usuario ya está en la lista
  if (data.jugadores.includes(sender) || data.suplentes.includes(sender)) return false

  // Agregar a jugadores principales o suplentes
  if (data.jugadores.length < 6) {
    data.jugadores.push(sender)
  } else if (data.suplentes.length < 2) {
    data.suplentes.push(sender)
  } else {
    return false // Lista llena
  }

  // Crear las menciones para jugadores y suplentes
  let jugadores = data.jugadores.map(u => `@${u.split('@')[0]}`)
  let suplentes = data.suplentes.map(u => `@${u.split('@')[0]}`)

  let plantilla = `
𝟔 𝐕𝐄𝐑𝐒𝐔𝐒 𝟔

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : 
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 :                

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: ${data.modalidad}
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

      𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
    
    👑 ┇ ${jugadores[0] || ''}
    🥷🏻 ┇ ${jugadores[1] || ''}
    🥷🏻 ┇ ${jugadores[2] || ''}
    🥷🏻 ┇ ${jugadores[3] || ''}
    🥷🏻 ┇ ${jugadores[4] || ''}
    🥷🏻 ┇ ${jugadores[5] || ''}
    
    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ ${suplentes[0] || ''}
    🥷🏻 ┇ ${suplentes[1] || ''}

${data.jugadores.length < 6 || data.suplentes.length < 2 ? '(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎)' : '✅ 𝐋𝐈𝐒𝐓𝐀 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀'}
  `.trim()

  try {
    await this.sendMessage(data.chat, {
      text: plantilla,
      edit: data.originalMsg.key,
      mentions: [...data.jugadores, ...data.suplentes]
    })
  } catch (error) {
    console.error('Error al editar mensaje:', error)
  }

  return false
}

export default handler
