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
  
  let forceInfo = `*🔧 FORZANDO LECTURA DE COMANDOS*\n\n`
  forceInfo += `*📋 Grupo:* ${m.chat}\n`
  forceInfo += `*👤 Usuario:* ${m.sender}\n\n`
  
  let changes = []
  
  // Forzar configuración del grupo para permitir comandos
  if (chat) {
    // Desactivar todas las restricciones
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
    
    // Activar configuraciones necesarias
    if (!chat.bienvenida) {
      chat.bienvenida = true
      changes.push('• Bienvenida activada')
    }
    
    if (!chat.detect) {
      chat.detect = true
      changes.push('• Detect activado')
    }
    
    // Desactivar configuraciones que pueden interferir
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
  }
  
  // Forzar configuración del usuario
  if (user) {
    if (user.banned) {
      user.banned = false
      changes.push('• Usuario desbaneado')
    }
    
    if (user.muto) {
      user.muto = false
      changes.push('• Usuario desmuteado')
    }
    
    // Resetear contadores de spam
    if (user.spam > 0) {
      user.spam = 0
      changes.push('• Contador de spam reseteado')
    }
    
    if (user.warning > 0) {
      user.warning = 0
      changes.push('• Warnings reseteados')
    }
    
    if (user.antispam > 0) {
      user.antispam = 0
      changes.push('• Antispam reseteado')
    }
    
    if (user.antispam2 > 0) {
      user.antispam2 = 0
      changes.push('• Antispam2 reseteado')
    }
  }
  
  // Forzar configuración del bot
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
    
    if (bot.autoread) {
      bot.autoread = false
      changes.push('• Auto read desactivado')
    }
  }
  
  // Verificar si el grupo existe en la base de datos
  if (!global.db.data.chats[m.chat]) {
    global.db.data.chats[m.chat] = {
      isBanned: false,
      bienvenida: true,
      modoadmin: false,
      onlyGod: false,
      onlyLatinos: false,
      detect: true,
      audios: false,
      antiLink: false,
      delete: false,
      nsfw: false,
      expired: 0
    }
    changes.push('• Grupo agregado a la base de datos')
  }
  
  // Verificar si el usuario existe en la base de datos
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = {
      exp: 0,
      limit: 5,
      comida: 8,
      muto: false,
      registered: false,
      name: m.name,
      age: -1,
      regTime: -1,
      afk: -1,
      afkReason: '',
      banned: false,
      useDocument: false,
      bank: 0,
      level: 0,
      spam: 0,
      warning: 0,
      antispam: 0,
      antispam2: 0
    }
    changes.push('• Usuario agregado a la base de datos')
  }
  
  if (changes.length === 0) {
    forceInfo += `✅ *No se necesitaron cambios*\n\n`
    forceInfo += `*💡 El grupo ya está configurado correctamente*\n`
  } else {
    forceInfo += `✅ *CAMBIOS APLICADOS:*\n`
    forceInfo += changes.join('\n') + '\n\n'
    forceInfo += `*🔧 Configuración forzada para lectura de comandos*\n`
  }
  
  forceInfo += `\n*📝 Información:*\n`
  forceInfo += `• Grupo: ${m.chat}\n`
  forceInfo += `• Owner: ${m.name}\n`
  forceInfo += `• Fecha: ${new Date().toLocaleString()}\n\n`
  
  forceInfo += `*🔍 Próximos pasos:*\n`
  forceInfo += `• Probar comandos básicos como /menu\n`
  forceInfo += `• Si persisten problemas, usar /debug\n`
  forceInfo += `• Verificar que el bot sea administrador\n`
  forceInfo += `• Reiniciar el bot si es necesario\n`
  
  m.reply(forceInfo)
}

handler.help = ['forceread', 'forzarlectura']
handler.tags = ['owner']
handler.command = /^(forceread|forzarlectura)$/i
handler.owner = true

export default handler 