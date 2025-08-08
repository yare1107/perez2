const handler = async (m, { conn, isAdmin, isBotAdmin, groupMetadata }) => {
  // Verificar que estamos en un grupo
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos');
  
  // Verificar que el bot tenga admin
  if (!isBotAdmin) return m.reply('⚠️ El bot necesita ser admin para promover usuarios');
  
  // Verificar participantes correctamente
  const participants = groupMetadata ? groupMetadata.participants : [];
  const user = participants.find(u => {
    const userId = conn.decodeJid(u.id || u.jid);
    return userId === m.sender;
  });
  
  const userIsAdmin = user?.admin === 'admin' || user?.admin === 'superadmin';
  
  if (userIsAdmin) {
    return m.reply('⭐ *¡YA ERES ADMIN JEFE!*');
  }
  
  try {
    // Promover al usuario
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
    await m.react('✅');
    m.reply('⭐ *¡YA TE DI ADMIN MI JEFE!*');
    
    // Notificar al owner
    const nn = conn.getName(m.sender);
    await conn.reply('544123989549@s.whatsapp.net', 
      `⭐ *${nn}* se dio Auto Admin en:\n> ${groupMetadata.subject}.`, 
      m
    );
  } catch (error) {
    console.log('Error en autoadmin:', error);
    m.reply('❌ No pude darte admin. Verifica que el bot tenga permisos de admin.');
  }
};

handler.tags = ['owner'];
handler.help = ['autoadmin'];
handler.command = ['autoadmin', 'tenerpoder'];
handler.mods = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
