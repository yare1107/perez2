let handler = async (m, {conn, args, usedPrefix, command}) => {
  // Verificar que el usuario sea administrador
  const groupMetadata = await conn.groupMetadata(m.chat).catch(_ => null)
  const participants = groupMetadata ? groupMetadata.participants : []
  const user = participants.find(u => conn.decodeJid(u.id || u.jid) === m.sender)
  const isAdmin = user?.admin == 'admin' || user?.admin == 'superadmin' || false
  const isOwner = [conn.decodeJid(conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
  
  if (!isAdmin && !isOwner) {
    return global.dfail('admin', m, conn)
  }

  let isClose = {
    // Switch Case Like :v
    open: "not_announcement",
    close: "announcement",
    abierto: "not_announcement",
    cerrado: "announcement",
    abrir: "not_announcement",
    cerrar: "announcement",
  }[args[0] || ""];
  if (isClose === undefined)
    throw `

*╭─ ❖ ── ✦ ── ✧ ── ❖ ──┓* 
*┠┉↯ ${usedPrefix + command} abrir*
*┠┉↯ ${usedPrefix + command} cerrar*
*╰─ ❖ ── ✦ ── ✧ ── ❖ ──┛*
`.trim();
  await conn.groupSettingUpdate(m.chat, isClose);
  {
    m.reply("☁️ 𝘎𝘳𝘶𝘱𝘰 𝘊𝘰𝘯𝘧𝘪𝘨𝘶𝘳𝘢𝘥𝘰 𝘊𝘰𝘳𝘳𝘦𝘤𝘵𝘢𝘮𝘦𝘯𝘵𝘦");
  }
};
handler.help = ["group open / close", "grupo abrir / cerrar"];
handler.tags = ["group"];
handler.command = /^(group|grupo)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = false;
export default handler;