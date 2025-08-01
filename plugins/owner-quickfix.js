let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('Este comando solo funciona en grupos')
  
  const isROwner = [conn.decodeJid(conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
  const isOwner = isROwner || m.fromMe
  
  if (!isOwner) {
    return m.reply('❌ Solo el owner puede usar este comando')
  }
  
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  
  // Diagnóstico específico para problemas de lectura de comandos
  let diagnosticInfo = `*🔍 DIAGNÓSTICO DE LECTURA DE COMANDOS*\n\n`
  diagnosticInfo += `*📋 Grupo:* ${m.chat}\n`
  diagnosticInfo += `*👤 Usuario:* ${m.sender}\n\n`
  
  let blockingReasons = []
  let fixes = []
  
  // Verificar si el grupo está baneado
  if (chat?.isBanned) {
    blockingReasons.push('🚫 Grupo baneado')
    fixes.push('• /unbanchat - Desbanear grupo')
  }
  
  // Verificar modo solo admin
  if (chat?.modoadmin && !isOwner) {
    blockingReasons.push('🔒 Modo solo admin activado')
    fixes.push('• /config modoadmin off - Desactivar modo admin')
  }
  
  // Verificar modo solo Dios
  if (chat?.onlyGod && !isOwner) {
    blockingReasons.push('👑 Modo solo Dios activado')
    fixes.push('• /config onlygod off - Desactivar modo Dios')
  }
  
  // Verificar si el usuario está baneado
  if (user?.banned) {
    blockingReasons.push('🚫 Usuario baneado')
    fixes.push('• /unbanuser @usuario - Desbanear usuario')
  }
  
  // Verificar spam del usuario
  if (user?.spam > 10) {
    blockingReasons.push('🚨 Usuario con mucho spam')
    fixes.push('• /resetconfig user - Resetear usuario')
  }
  
  // Verificar si el bot es admin
  const groupMetadata = await conn.groupMetadata(m.chat).catch(_ => null)
  const participants = groupMetadata ? groupMetadata.participants : []
  const botParticipant = participants.find(u => conn.decodeJid(u.id) == conn.user.jid)
  const isBotAdmin = botParticipant?.admin || false
  
  if (!isBotAdmin) {
    blockingReasons.push('🤖 Bot no es administrador')
    fixes.push('• Hacer al bot administrador del grupo')
  }
  
  if (blockingReasons.length === 0) {
    diagnosticInfo += `✅ *No se detectaron bloqueos*\n\n`
    diagnosticInfo += `*💡 Posibles causas:*\n`
    diagnosticInfo += `• El bot no está conectado correctamente\n`
    diagnosticInfo += `• Problema de red o conexión\n`
    diagnosticInfo += `• El grupo no está en la base de datos\n`
    diagnosticInfo += `• Error en el procesamiento de mensajes\n\n`
  } else {
    diagnosticInfo += `*🚨 BLOQUEOS DETECTADOS:*\n`
    diagnosticInfo += blockingReasons.join('\n') + '\n\n'
    diagnosticInfo += `*💡 SOLUCIONES:*\n`
    diagnosticInfo += fixes.join('\n') + '\n\n'
  }
  
  // Aplicar soluciones automáticas
  let changes = []
  
  if (chat) {
    if (chat.isBanned) {
      chat.isBanned = false
      changes.push('• Grupo desbaneado')
    }
    
    if (chat.modoadmin) {
      chat.modoadmin = false
      changes.push('• Modo solo admin desactivado')
    }
    
    if (chat.onlyGod) {
      chat.onlyGod = false
      changes.push('• Modo solo Dios desactivado')
    }
    
    if (chat.onlyLatinos) {
      chat.onlyLatinos = false
      changes.push('• Solo Latinos desactivado')
    }
    
    if (chat.antiLink) {
      chat.antiLink = false
      changes.push('• Antilink desactivado')
    }
    
    if (chat.delete) {
      chat.delete = false
      changes.push('• Antidelete desactivado')
    }
    
    if (chat.nsfw) {
      chat.nsfw = false
      changes.push('• NSFW desactivado')
    }
    
    if (chat.audios) {
      chat.audios = false
      changes.push('• Audios automáticos desactivados')
    }
    
    // Activar configuraciones necesarias
    if (!chat.bienvenida) {
      chat.bienvenida = true
      changes.push('• Bienvenida activada')
    }
    
    if (!chat.detect) {
      chat.detect = true
      changes.push('• Detect activado')
    }
  }
  
  if (user) {
    if (user.banned) {
      user.banned = false
      changes.push('• Usuario desbaneado')
    }
    
    if (user.muto) {
      user.muto = false
      changes.push('• Usuario desmuteado')
    }
    
    if (user.spam > 0) {
      user.spam = 0
      changes.push('• Contador de spam reseteado')
    }
    
    if (user.warning > 0) {
      user.warning = 0
      changes.push('• Warnings reseteados')
    }
  }
  
  if (bot) {
    if (!bot.jadibotmd) {
      bot.jadibotmd = true
      changes.push('• JadiBot MD activado')
    }
    
    if (bot.antiPrivate) {
      bot.antiPrivate = false
      changes.push('• Anti privado desactivado')
    }
    
    if (!bot.antiSpam) {
      bot.antiSpam = true
      changes.push('• Anti spam activado')
    }
  }
  
  if (changes.length > 0) {
    diagnosticInfo += `*🔧 CAMBIOS APLICADOS:*\n`
    diagnosticInfo += changes.join('\n') + '\n\n'
    diagnosticInfo += `*✅ Problemas solucionados automáticamente*\n\n`
  }
  
  diagnosticInfo += `*📝 Información:*\n`
  diagnosticInfo += `• Grupo: ${m.chat}\n`
  diagnosticInfo += `• Owner: ${m.name}\n`
  diagnosticInfo += `• Fecha: ${new Date().toLocaleString()}\n\n`
  
  diagnosticInfo += `*🔍 Próximos pasos:*\n`
  diagnosticInfo += `• Probar comandos básicos como /menu\n`
  diagnosticInfo += `• Si persisten problemas, usar /debug\n`
  diagnosticInfo += `• Para reset completo usar /resetconfig all\n`
  diagnosticInfo += `• Verificar conexión del bot\n`
  
  m.reply(diagnosticInfo)
}

handler.help = ['quickfix', 'solucionrapida']
handler.tags = ['owner']
handler.command = /^(quickfix|solucionrapida)$/i
handler.owner = true

export default handler 