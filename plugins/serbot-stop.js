
let handler  = async (m, { conn }) => {
if (global.conn.user.jid == conn.user.jid) conn.reply(m.chat, `🚩 El Bot Principal No Se Puede Apagar`, m,  )
else {
await conn.reply(m.chat, `😐 Subbot Desactivado`, m,  )
conn.ws.close()
}}
handler.command = handler.help = ['stop', 'byebot'];
handler.tags = ['jadibot'];
handler.owner = true
handler.private = true
export default handler
