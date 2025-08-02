let handler = async (m, { conn, text, isROwner, isOwner }) => {
m.react('🙌🏻')
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

if (text) {
global.db.data.chats[m.chat].sWelcome = text
conn.reply(m.chat, '𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙄𝘿𝘼 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘿𝘼 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼𝙈𝙀𝙉𝙏𝙀  🚩', fkontak, m)

} else {
    conn.reply(m.chat, `𝙍𝙀𝘿𝘼𝘾𝙏𝘼 𝙀𝙇 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝘿𝙀 𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙄𝘿𝘼\n𝙊𝙋𝘾𝙄𝙊𝙉𝘼𝙇 𝙋𝙐𝙀𝘿𝙀 𝙐𝙎𝘼𝙍 𝙇𝙊 𝙌𝙐𝙀 𝙀𝙎𝙏𝘼 𝘾𝙊𝙉 "@" 𝙋𝘼𝙍𝘼 𝘼𝙂𝙍𝙀𝙂𝘼𝙍 𝙈𝘼́𝙎 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊́𝙉:\n\n🚩 @𝘶𝘴𝘦𝘳 *(𝘔𝘦𝘯𝘤𝘪𝘰́𝘯 𝘢𝘭 𝘶𝘴𝘶𝘢𝘳𝘪𝘰(𝘢))*\n🏳️ @𝘨𝘳𝘰𝘶𝘱 *(𝘕𝘰𝘮𝘣𝘳𝘦 𝘥𝘦 𝘨𝘳𝘶𝘱𝘰)*\n🏴 @𝘥𝘦𝘴𝘤 *(𝘋𝘦𝘴𝘤𝘳𝘪𝘱𝘤𝘪𝘰́𝘯 𝘥𝘦 𝘨𝘳𝘶𝘱𝘰)*\n\n𝘙𝘌𝘊𝘜𝘌𝘙𝘋𝘌 𝘘𝘜𝘌 𝘓𝘖𝘚 "@" 𝘚𝘖𝘕 𝘖𝘗𝘊𝘐𝘖𝘕𝘈𝘓𝘌𝘚 ⭐`, m)
}
}
handler.help = ['setwelcome @user + texto']
handler.tags = ['group']
handler.command = ['setwelcome', 'bienvenida'] 
handler.botAdmin = false
handler.admin = true
handler.group = true
export default handler
