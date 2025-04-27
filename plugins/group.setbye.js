let handler = async (m, { conn, text, isROwner, isOwner }) => {
m.react('👋🏻')

if (text) {
global.db.data.chats[m.chat].sBye = text
conn.reply(m.chat, `𝘿𝙀𝙎𝙋𝙀𝘿𝙄𝘿𝘼 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘿𝘼 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼𝙈𝙀𝙉𝙏𝙀 🚩`, m)  

} else {
    conn.reply(m.chat, `𝙍𝙀𝘿𝘼𝘾𝙏𝘼 𝙀𝙇 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝘿𝙀 𝘿𝙀𝙎𝙋𝙀𝘿𝙄𝘿𝘼 \n𝙊𝙋𝘾𝙄𝙊𝙉𝘼𝙇 𝙋𝙐𝙀𝘿𝙀 𝙐𝙎𝘼𝙍 𝙇𝙊 𝙌𝙐𝙀 𝙀𝙎𝙏𝘼 𝘾𝙊𝙉 "@" 𝙋𝘼𝙍𝘼 𝘼𝙂𝙍𝙀𝙂𝘼𝙍 𝙈𝘼́𝙎 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊́𝙉:\n\n🚩 @𝘶𝘴𝘦𝘳 *(𝘔𝘦𝘯𝘤𝘪𝘰́𝘯 𝘢𝘭 𝘶𝘴𝘶𝘢𝘳𝘪𝘰(𝘢))*\n\n𝘙𝘌𝘊𝘜𝘌𝘙𝘋𝘌 𝘘𝘜𝘌 𝘓𝘖𝘚 "@" 𝘚𝘖𝘕 𝘖𝘗𝘊𝘐𝘖𝘕𝘈𝘓𝘌𝘚 ⭐`, m)
}
}

handler.help = ['setbye @user + texto']
handler.tags = ['group']
handler.command = ['setbye', 'despedida'] 
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
