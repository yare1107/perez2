let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('Este comando solo funciona en grupos')
  
  const isROwner = [conn.decodeJid(conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
  const isOwner = isROwner || m.fromMe
  
  if (!isOwner) {
    return m.reply('❌ Solo el owner puede usar este comando')
  }
  
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  
  let unlockInfo = `*🔓 DESBLOQUEANDO GRUPO COMPLETAMENTE*\n\n`
  unlockInfo += `*📋 Grupo:* ${m.chat}\n`
  unlockInfo += `*👤 Usuario:* ${m.sender}\n\n`
  
  let changes = []
  
  // DESBLOQUEO COMPLETO: Crear/actualizar grupo en base de datos
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
    changes.push('• Grupo creado en base de datos')
  } else {
    // Si ya existe, forzar desbloqueo
    global.db.data.chats[m.chat].isBanned = false
    global.db.data.chats[m.chat].modoadmin = false
    global.db.data.chats[m.chat].onlyGod = false
    global.db.data.chats[m.chat].onlyLatinos = false
    global.db.data.chats[m.chat].bienvenida = true
    global.db.data.chats[m.chat].detect = true
    global.db.data.chats[m.chat].antiLink = false
    global.db.data.chats[m.chat].delete = false
    global.db.data.chats[m.chat].nsfw = false
    global.db.data.chats[m.chat].audios = false
    changes.push('• Grupo desbloqueado completamente')
  }
  
  // DESBLOQUEO COMPLETO: Crear/actualizar usuario en base de datos
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
    changes.push('• Usuario creado en base de datos')
  } else {
    // Si ya existe, forzar desbloqueo
    global.db.data.users[m.sender].banned = false
    global.db.data.users[m.sender].muto = false
    global.db.data.users[m.sender].spam = 0
    global.db.data.users[m.sender].warning = 0
    global.db.data.users[m.sender].antispam = 0
    global.db.data.users[m.sender].antispam2 = 0
    changes.push('• Usuario desbloqueado completamente')
  }
  
  // DESBLOQUEO COMPLETO: Forzar grupo en lista de chats del bot
  if (!conn.chats[m.chat]) {
    conn.chats[m.chat] = {
      id: m.chat,
      isChats: true,
      metadata: null
    }
    changes.push('• Grupo agregado a lista de chats del bot')
  }
  
  // DESBLOQUEO COMPLETO: Configurar bot correctamente
  let bot = global.db.data.settings[conn.user.jid]
  if (!bot) {
    global.db.data.settings[conn.user.jid] = {
      self: false,
      jadibotmd: true,
      autobio: false,
      antiPrivate: false,
      autoread: false,
      antiSpam: true,
      status: 0
    }
    changes.push('• Configuración del bot creada')
  } else {
    bot.jadibotmd = true
    bot.antiPrivate = false
    bot.antiSpam = true
    bot.autoread = false
    changes.push('• Configuración del bot actualizada')
  }
  
  if (changes.length === 0) {
    unlockInfo += `✅ *No se necesitaron cambios*\n\n`
    unlockInfo += `*💡 El grupo ya está completamente desbloqueado*\n`
  } else {
    unlockInfo += `✅ *DESBLOQUEOS APLICADOS:*\n`
    unlockInfo += changes.join('\n') + '\n\n'
    unlockInfo += `*🔓 Grupo completamente desbloqueado*\n`
  }
  
  unlockInfo += `\n*📝 Información:*\n`
  unlockInfo += `• Grupo: ${m.chat}\n`
  unlockInfo += `• Owner: ${m.name}\n`
  unlockInfo += `• Fecha: ${new Date().toLocaleString()}\n\n`
  
  unlockInfo += `*🔍 Próximos pasos:*\n`
  unlockInfo += `• Probar comandos básicos como /menu\n`
  unlockInfo += `• Si persisten problemas, usar /debug\n`
  unlockInfo += `• Verificar que el bot sea administrador\n`
  unlockInfo += `• Reiniciar el bot si es necesario\n`
  
  m.reply(unlockInfo)
}

handler.help = ['unlockgroup', 'desbloqueargrupo']
handler.tags = ['owner']
handler.command = /^(unlockgroup|desbloqueargrupo)$/i
handler.owner = true

export default handler 