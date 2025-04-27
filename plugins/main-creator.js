let handler = async (m, { conn, usedPrefix, isOwner }) => {
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;perez 👑;\nFN:perez 👑\nORG:perez 👑\nTITLE:\nitem1.TEL;waid=529162788919:529162788919\nitem1.X-ABLabel:perez 👑\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:perez 👑\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: 'おperez ⁩', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño'] 

export default handler
