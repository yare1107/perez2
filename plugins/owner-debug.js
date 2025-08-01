let handler = async (m, { conn, usedPrefix, command, args }) => {
  if (!m.isGroup) return m.reply('Este comando solo funciona en grupos')
  
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  
  const groupMetadata = await conn.groupMetadata(m.chat).catch(_ => null)
  const participants = groupMetadata ? groupMetadata.participants : []
  const userParticipant = participants.find(u => conn.decodeJid(u.id) === m.sender)
  const botParticipant = participants.find(u => conn.decodeJid(u.id) == conn.user.jid)
  
  const isRAdmin = userParticipant?.admin == 'superadmin' || false
  const isAdmin = isRAdmin || userParticipant?.admin == 'admin' || false
  const isBotAdmin = botParticipant?.admin || false
  
  const isROwner = [conn.decodeJid(conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
  const isOwner = isROwner || m.fromMe
  
  let debugInfo = `*🔍 DIAGNÓSTICO COMPLETO DEL GRUPO*\n\n`
  debugInfo += `*📋 Información del Grupo:*\n`
  debugInfo += `• ID: ${m.chat}\n`
  debugInfo += `• Nombre: ${groupMetadata?.subject || 'Desconocido'}\n`
  debugInfo += `• Participantes: ${participants?.length || 0}\n`
  debugInfo += `• Descripción: ${groupMetadata?.desc || 'Sin descripción'}\n\n`
  
  debugInfo += `*👤 Información del Usuario:*\n`
  debugInfo += `• ID: ${m.sender}\n`
  debugInfo += `• Nombre: ${m.name}\n`
  debugInfo += `• Es Owner: ${isOwner ? '✅' : '❌'}\n`
  debugInfo += `• Es Admin: ${isAdmin ? '✅' : '❌'}\n`
  debugInfo += `• Es Super Admin: ${isRAdmin ? '✅' : '❌'}\n\n`
  
  debugInfo += `*🤖 Información del Bot:*\n`
  debugInfo += `• Es Bot Admin: ${isBotAdmin ? '✅' : '❌'}\n`
  debugInfo += `• Modo Solo Admin: ${chat?.modoadmin ? '✅' : '❌'}\n`
  debugInfo += `• Modo Solo Dios: ${chat?.onlyGod ? '✅' : '❌'}\n`
  debugInfo += `• Grupo Baneado: ${chat?.isBanned ? '✅' : '❌'}\n\n`
  
  debugInfo += `*⚙️ Configuraciones del Grupo:*\n`
  debugInfo += `• Antilink: ${chat?.antiLink ? '✅' : '❌'}\n`
  debugInfo += `• Antidelete: ${chat?.delete ? '✅' : '❌'}\n`
  debugInfo += `• NSFW: ${chat?.nsfw ? '✅' : '❌'}\n`
  debugInfo += `• Audios: ${chat?.audios ? '✅' : '❌'}\n`
  debugInfo += `• Bienvenida: ${chat?.bienvenida ? '✅' : '❌'}\n`
  debugInfo += `• Detect: ${chat?.detect ? '✅' : '❌'}\n`
  debugInfo += `• Solo Latinos: ${chat?.onlyLatinos ? '✅' : '❌'}\n\n`
  
  debugInfo += `*🔧 Configuraciones del Bot:*\n`
  debugInfo += `• JadiBot MD: ${bot?.jadibotmd ? '✅' : '❌'}\n`
  debugInfo += `• Auto Bio: ${bot?.autobio ? '✅' : '❌'}\n`
  debugInfo += `• Anti Privado: ${bot?.antiPrivate ? '✅' : '❌'}\n`
  debugInfo += `• Auto Read: ${bot?.autoread ? '✅' : '❌'}\n`
  debugInfo += `• Anti Spam: ${bot?.antiSpam ? '✅' : '❌'}\n\n`
  
  debugInfo += `*📊 Estado del Usuario:*\n`
  debugInfo += `• Registrado: ${user?.registered ? '✅' : '❌'}\n`
  debugInfo += `• Baneado: ${user?.banned ? '✅' : '❌'}\n`
  debugInfo += `• Premium: ${user?.premium ? '✅' : '❌'}\n`
  debugInfo += `• Muteado: ${user?.muto ? '✅' : '❌'}\n`
  debugInfo += `• XP: ${user?.exp || 0}\n`
  debugInfo += `• Nivel: ${user?.level || 0}\n`
  debugInfo += `• Límite: ${user?.limit || 0}\n`
  debugInfo += `• Spam: ${user?.spam || 0}\n\n`
  
  debugInfo += `*⚠️ PROBLEMAS DETECTADOS:*\n`
  let problems = []
  let solutions = []
  
  if (chat?.isBanned && !isROwner) {
    problems.push('• 🚫 Grupo está baneado')
    solutions.push('• /unbanchat - Desbanear grupo')
  }
  
  if (chat?.modoadmin && !isAdmin && !isOwner) {
    problems.push('• 🔒 Modo solo admin activado')
    solutions.push('• /config modoadmin off - Desactivar modo admin')
  }
  
  if (chat?.onlyGod && !isOwner && !isAdmin) {
    problems.push('• 👑 Modo solo Dios activado')
    solutions.push('• /config onlygod off - Desactivar modo Dios')
  }
  
  if (user?.banned && !isROwner) {
    problems.push('• 🚫 Usuario está baneado')
    solutions.push('• /unbanuser @usuario - Desbanear usuario')
  }
  
  if (!isBotAdmin) {
    problems.push('• 🤖 Bot no es administrador')
    solutions.push('• Hacer al bot administrador del grupo')
  }
  
  if (user?.spam > 10) {
    problems.push('• 🚨 Usuario con mucho spam')
    solutions.push('• /resetconfig user - Resetear usuario')
  }
  
  if (problems.length === 0) {
    debugInfo += '✅ No se detectaron problemas\n\n'
  } else {
    debugInfo += problems.join('\n') + '\n\n'
    debugInfo += `*💡 SOLUCIONES RECOMENDADAS:*\n`
    debugInfo += solutions.join('\n') + '\n\n'
  }
  
  debugInfo += `*🔧 COMANDOS DE SOLUCIÓN RÁPIDA:*\n`
  debugInfo += `• /quickfix - Solución automática\n`
  debugInfo += `• /resetconfig all - Resetear todo\n`
  debugInfo += `• /resetconfig chat - Resetear solo grupo\n`
  debugInfo += `• /resetconfig user - Resetear solo usuario\n`
  debugInfo += `• /config info - Ver estado actual\n`
  
  debugInfo += `\n*📝 Información Técnica:*\n`
  debugInfo += `• Conexión: ${conn.user ? '✅ Conectado' : '❌ Desconectado'}\n`
  debugInfo += `• Base de datos: ${global.db.data ? '✅ Activa' : '❌ Inactiva'}\n`
  debugInfo += `• Timestamp: ${new Date().toLocaleString()}\n`
  
  m.reply(debugInfo)
}

handler.help = ['debug', 'diagnostico']
handler.tags = ['owner']
handler.command = /^(debug|diagnostico)$/i
handler.owner = true

export default handler 