let handler = async (m, { conn, usedPrefix, command, args }) => {
  if (!m.isGroup) return m.reply('Este comando solo funciona en grupos')
  
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  
  const isROwner = [conn.decodeJid(conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
  const isOwner = isROwner || m.fromMe
  
  if (!isOwner) {
    return m.reply('❌ Solo el owner puede usar este comando')
  }
  
  let type = args[0]?.toLowerCase()
  
  if (!type) {
    return m.reply(`*🔧 RESET CONFIGURACIONES*\n\n*Uso:* ${usedPrefix}${command} <tipo>\n\n*Tipos disponibles:*\n• all - Resetear todo\n• chat - Resetear configuraciones del grupo\n• user - Resetear configuraciones del usuario\n• bot - Resetear configuraciones del bot\n\n*💡 Recomendado:* Usar \`all\` para solucionar problemas`)
  }
  
  let resetInfo = `*🔄 RESETEANDO CONFIGURACIONES*\n\n`
  
  switch (type) {
    case 'all':
      // Resetear todo
      if (chat) {
        chat.isBanned = false
        chat.modoadmin = false
        chat.onlyGod = false
        chat.onlyLatinos = false
        chat.detect = true
        chat.audios = false
        chat.antiLink = false
        chat.delete = false
        chat.nsfw = false
        chat.bienvenida = true
        chat.expired = 0
        chat.reaction = false
      }
      
      if (user) {
        user.banned = false
        user.muto = false
        user.spam = 0
        user.antispam = 0
        user.antispam2 = 0
        user.warning = 0
      }
      
      // Resetear configuraciones del bot
      let bot = global.db.data.settings[conn.user.jid]
      if (bot) {
        bot.jadibotmd = true
        bot.autobio = false
        bot.antiPrivate = false
        bot.autoread = false
        bot.antiSpam = true
      }
      
      resetInfo += `✅ *TODO RESETEADO CORRECTAMENTE*\n\n`
      resetInfo += `*📋 Configuraciones del Grupo:*\n`
      resetInfo += `• Baneo: Desactivado\n`
      resetInfo += `• Modo solo admin: Desactivado\n`
      resetInfo += `• Modo solo Dios: Desactivado\n`
      resetInfo += `• Solo Latinos: Desactivado\n`
      resetInfo += `• Antilink: Desactivado\n`
      resetInfo += `• Antidelete: Desactivado\n`
      resetInfo += `• NSFW: Desactivado\n`
      resetInfo += `• Audios: Desactivado\n`
      resetInfo += `• Bienvenida: Activado\n`
      resetInfo += `• Detect: Activado\n\n`
      
      resetInfo += `*👤 Configuraciones del Usuario:*\n`
      resetInfo += `• Baneo: Desactivado\n`
      resetInfo += `• Muteo: Desactivado\n`
      resetInfo += `• Spam: Reseteado\n`
      resetInfo += `• Warnings: Reseteado\n\n`
      
      resetInfo += `*🤖 Configuraciones del Bot:*\n`
      resetInfo += `• JadiBot MD: Activado\n`
      resetInfo += `• Auto Bio: Desactivado\n`
      resetInfo += `• Anti Privado: Desactivado\n`
      resetInfo += `• Auto Read: Desactivado\n`
      resetInfo += `• Anti Spam: Activado\n`
      break
      
    case 'chat':
      // Resetear solo configuraciones del grupo
      if (chat) {
        chat.isBanned = false
        chat.modoadmin = false
        chat.onlyGod = false
        chat.onlyLatinos = false
        chat.detect = true
        chat.audios = false
        chat.antiLink = false
        chat.delete = false
        chat.nsfw = false
        chat.bienvenida = true
        chat.expired = 0
        chat.reaction = false
      }
      
      resetInfo += `✅ *CONFIGURACIONES DEL GRUPO RESETEADAS*\n\n`
      resetInfo += `*📋 Cambios realizados:*\n`
      resetInfo += `• Baneo del grupo: Desactivado\n`
      resetInfo += `• Modo solo admin: Desactivado\n`
      resetInfo += `• Modo solo Dios: Desactivado\n`
      resetInfo += `• Solo Latinos: Desactivado\n`
      resetInfo += `• Antilink: Desactivado\n`
      resetInfo += `• Antidelete: Desactivado\n`
      resetInfo += `• NSFW: Desactivado\n`
      resetInfo += `• Audios: Desactivado\n`
      resetInfo += `• Bienvenida: Activado\n`
      resetInfo += `• Detect: Activado\n`
      resetInfo += `• Reacciones: Desactivado\n`
      break
      
    case 'user':
      // Resetear solo configuraciones del usuario
      if (user) {
        user.banned = false
        user.muto = false
        user.spam = 0
        user.antispam = 0
        user.antispam2 = 0
        user.warning = 0
      }
      
      resetInfo += `✅ *CONFIGURACIONES DEL USUARIO RESETEADAS*\n\n`
      resetInfo += `*👤 Cambios realizados:*\n`
      resetInfo += `• Baneo del usuario: Desactivado\n`
      resetInfo += `• Muteo: Desactivado\n`
      resetInfo += `• Contadores de spam: Reseteados\n`
      resetInfo += `• Warnings: Reseteado\n`
      break
      
    case 'bot':
      // Resetear configuraciones del bot
      let botSettings = global.db.data.settings[conn.user.jid]
      if (botSettings) {
        botSettings.jadibotmd = true
        botSettings.autobio = false
        botSettings.antiPrivate = false
        botSettings.autoread = false
        botSettings.antiSpam = true
      }
      
      resetInfo += `✅ *CONFIGURACIONES DEL BOT RESETEADAS*\n\n`
      resetInfo += `*🤖 Cambios realizados:*\n`
      resetInfo += `• JadiBot MD: Activado\n`
      resetInfo += `• Auto Bio: Desactivado\n`
      resetInfo += `• Anti Privado: Desactivado\n`
      resetInfo += `• Auto Read: Desactivado\n`
      resetInfo += `• Anti Spam: Activado\n`
      break
      
    default:
      return m.reply(`❌ Tipo de reset inválido\n\n*Tipos disponibles:*\n• all - Resetear todo\n• chat - Resetear configuraciones del grupo\n• user - Resetear configuraciones del usuario\n• bot - Resetear configuraciones del bot\n\n*💡 Recomendado:* Usar \`all\` para solucionar problemas`)
  }
  
  resetInfo += `\n*📝 Información:*\n`
  resetInfo += `• Grupo: ${m.chat}\n`
  resetInfo += `• Usuario: ${m.sender}\n`
  resetInfo += `• Owner: ${m.name}\n`
  resetInfo += `• Fecha: ${new Date().toLocaleString()}\n\n`
  
  resetInfo += `*💡 Próximos pasos:*\n`
  resetInfo += `• Usar /debug para verificar que todo esté bien\n`
  resetInfo += `• Probar comandos básicos como /menu\n`
  resetInfo += `• Si persisten problemas, contactar al desarrollador\n`
  
  m.reply(resetInfo)
}

handler.help = ['resetconfig', 'reset']
handler.tags = ['owner']
handler.command = /^(resetconfig|reset)$/i
handler.owner = true

export default handler 