let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('Este comando solo funciona en grupos')
  
  const isROwner = [conn.decodeJid(conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
  const isOwner = isROwner || m.fromMe
  
  if (!isOwner) {
    return m.reply('❌ Solo el owner puede usar este comando')
  }
  
  let fixInfo = `*🔧 SOLUCIONANDO PROBLEMAS DEL HANDLER*\n\n`
  fixInfo += `*📋 Grupo:* ${m.chat}\n`
  fixInfo += `*👤 Usuario:* ${m.sender}\n\n`
  
  let changes = []
  
  // SOLUCIÓN CRÍTICA: Asegurar que el grupo existe y no está baneado
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
    // Forzar desbloqueo del grupo
    global.db.data.chats[m.chat].isBanned = false
    global.db.data.chats[m.chat].modoadmin = false
    global.db.data.chats[m.chat].onlyGod = false
    global.db.data.chats[m.chat].onlyLatinos = false
    changes.push('• Grupo desbloqueado en base de datos')
  }
  
  // SOLUCIÓN CRÍTICA: Asegurar que el usuario existe y no está baneado
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
    // Forzar desbloqueo del usuario
    global.db.data.users[m.sender].banned = false
    global.db.data.users[m.sender].muto = false
    global.db.data.users[m.sender].spam = 0
    global.db.data.users[m.sender].warning = 0
    global.db.data.users[m.sender].antispam = 0
    global.db.data.users[m.sender].antispam2 = 0
    changes.push('• Usuario desbloqueado en base de datos')
  }
  
  // SOLUCIÓN CRÍTICA: Asegurar que el bot no esté baneado
  if (!global.db.data.settings[conn.user.jid]) {
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
    // Asegurar que el bot no esté baneado
    global.db.data.settings[conn.user.jid].banned = false
    changes.push('• Bot desbloqueado')
  }
  
  // SOLUCIÓN CRÍTICA: Forzar grupo en lista de chats
  if (!conn.chats[m.chat]) {
    conn.chats[m.chat] = {
      id: m.chat,
      isChats: true,
      metadata: null
    }
    changes.push('• Grupo agregado a lista de chats del bot')
  }
  
  // SOLUCIÓN ESPECÍFICA: Verificar que el usuario sea owner para evitar bloqueos
  if (!isOwner) {
    // Agregar temporalmente al usuario como owner para evitar bloqueos
    if (!global.owner.some(([number]) => number === m.sender.replace('@s.whatsapp.net', ''))) {
      global.owner.push([m.sender.replace('@s.whatsapp.net', ''), m.name, true])
      changes.push('• Usuario agregado temporalmente como owner')
    }
  }
  
  if (changes.length === 0) {
    fixInfo += `✅ *No se necesitaron cambios*\n\n`
    fixInfo += `*💡 El handler ya está funcionando correctamente*\n`
  } else {
    fixInfo += `✅ *CAMBIOS APLICADOS:*\n`
    fixInfo += changes.join('\n') + '\n\n'
    fixInfo += `*🔧 Problemas del handler solucionados*\n`
  }
  
  fixInfo += `\n*📝 Información:*\n`
  fixInfo += `• Grupo: ${m.chat}\n`
  fixInfo += `• Usuario: ${m.sender}\n`
  fixInfo += `• Owner: ${m.name}\n`
  fixInfo += `• Fecha: ${new Date().toLocaleString()}\n\n`
  
  fixInfo += `*🔍 Próximos pasos:*\n`
  fixInfo += `• Probar comandos básicos como /menu\n`
  fixInfo += `• Si persisten problemas, usar /debug\n`
  fixInfo += `• Verificar que el bot sea administrador\n`
  fixInfo += `• Reiniciar el bot si es necesario\n`
  
  m.reply(fixInfo)
}

handler.help = ['fixhandler', 'arreglarhandler']
handler.tags = ['owner']
handler.command = /^(fixhandler|arreglarhandler)$/i
handler.owner = true

export default handler 