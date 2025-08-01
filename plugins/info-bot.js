import fs from 'fs';
const handler = (m) => m;
handler.all = async function(m) {

const chat = global.db.data.chats[m.chat];
if (chat.isBaneed) return
if (/^bot$/i.test(m.text)) {
conn.reply(m.chat, `🌟 ¡Hola! Soy 𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳 ᡣ, en que puedo ayudarte hoy?\n\n👑 Usa *.menu* para ver mis comandos.`, m, rcanal, )
}

return !0;
};
export default handler;
