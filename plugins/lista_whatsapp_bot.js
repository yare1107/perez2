let listasActivas = {};

let handler = async (m, { conn, args, text }) => {
  // Verificar si se proporcionó un título
  if (!text) {
    conn.reply(m.chat, '_Debes proporcionar un título para la lista._\n\n*Ejemplo:* .lista Torneo de Free Fire', m);
    return;
  }

  const titulo = text.trim();

  let plantilla = `
📋 ${titulo.toUpperCase()}

👥 𝐏𝐀𝐑𝐓𝐈𝐂𝐈𝐏𝐀𝐍𝐓𝐄𝐒:

(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎)
  `.trim()

  let msg = await conn.sendMessage(m.chat, { text: plantilla }, { quoted: m })
  
  listasActivas[msg.key.id] = {
    chat: m.chat,
    participantes: [],
    titulo: titulo,
    originalMsg: msg,
    creador: m.sender
  }
}

handler.help = ['lista']
handler.tags = ['group']
handler.command = /^(lista)$/i
handler.group = true

// Función para manejar las reacciones
handler.before = async function (m) {
  if (!m.message?.reactionMessage) return false
  
  let reaction = m.message.reactionMessage
  let key = reaction.key
  let emoji = reaction.text
  let sender = m.key.participant || m.key.remoteJid

  // Solo procesar reacciones de corazón
  if (!['❤️', '❤', '♥️'].includes(emoji)) return false
  
  // Verificar si existe la lista
  if (!listasActivas[key.id]) return false

  let data = listasActivas[key.id]

  // Verificar si el usuario ya está en la lista
  if (data.participantes.includes(sender)) return false

  // Agregar participante
  data.participantes.push(sender)

  // Crear las menciones para participantes
  let participantes = data.participantes.map((u, index) => 
    `${index + 1}. @${u.split('@')[0]}`
  ).join('\n')

  let plantilla = `
📋 ${data.titulo.toUpperCase()}

👥 𝐏𝐀𝐑𝐓𝐈𝐂𝐈𝐏𝐀𝐍𝐓𝐄𝐒:
${participantes || 'Ninguno aún'}

${data.participantes.length === 0 ? '(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎)' : `✅ ${data.participantes.length} participante${data.participantes.length > 1 ? 's' : ''} registrado${data.participantes.length > 1 ? 's' : ''}`}
  `.trim()

  try {
    await this.sendMessage(data.chat, {
      text: plantilla,
      edit: data.originalMsg.key,
      mentions: data.participantes
    })
  } catch (error) {
    console.error('Error al editar mensaje:', error)
  }

  return false
}

export default handler