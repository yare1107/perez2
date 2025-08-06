const handler = async (m, {conn, isAdmin, groupMetadata }) => {
  // Verificar participantes correctamente
  const participants = groupMetadata ? groupMetadata.participants : []
  const user = participants.find(u => conn.decodeJid(u.id || u.jid) === m.sender)
  const userIsAdmin = user?.admin == 'admin' || user?.admin == 'superadmin' || false
  
  if (userIsAdmin) return m.reply('⭐ *¡YA ERES ADM JEFE!*');
  try {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
  await m.react('✅')
   m.reply('⭐ *¡YA TE DI ADM MI JEFE!*');
    let nn = conn.getName(m.sender);
     conn.reply('544123989549@s.whatsapp.net', `⭐ *${nn}* se dio Auto Admin en:\n> ${groupMetadata.subject}.`, m,  );
  } catch {
    m.reply('Demasiado Bueno 👻');
  }
};
handler.tags = ['owner'];
handler.help = ['autoadmin'];
handler.command = ['autoadmin' ,'tenerpoder'];
handler.mods = true;
handler.group = true;
handler.botAdmin = true;
export default handler;