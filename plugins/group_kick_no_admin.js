let handler = async (m, { conn, participants, usedPrefix, command, isROwner }) => {
    m.react('☠️')
    let kickte = `_Menciona al usuario que deseas eliminar._`

    // Verifica si se mencionó un usuario o si se respondió a un mensaje.
    if (!m.mentionedJid[0] && !m.quoted) return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte)}) 

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
    let botNumber = conn.user.jid.split('@')[0]  // Obtiene el número del bot

    // Verifica si el usuario a expulsar es el bot
    if (user.includes(botNumber)) {
        return m.reply(`⚠️ No puedo Expulsarme a mí mismo.`);
    }

    // Realiza la acción de expulsión
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    m.reply(`☠️ Intruso Eliminado.`)
}

handler.help = ['kick @user']
handler.tags = ['group']
handler.command = ['kick', 'expulsar', 'eliminar'] 
// Eliminé handler.admin = true; para que cualquier usuario pueda usarlo
handler.group = true
handler.botAdmin = false

export default handler