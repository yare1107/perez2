let handler = async (m, { isPrems, conn }) => {

    let videoUrl = 'https://qu.ax/PWOGh.mp4';
    let texto = `
*NUEVA TARJETA*
*TRANSFERENCIA*
728969000119672904
Franklin Pérez
SPIN OXXO
`;

    const fkontak = {
        "key": {
            "participants":"0@s.whatsapp.net",
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    };

    await conn.sendMessage(m.chat, { 
        video: { url: videoUrl }, 
        caption: texto, 
        gifPlayback: true 
    }, { quoted: fkontak });

    global.db.data.users[m.sender].lastcofre = new Date * 1;
}

handler.help = ['pago']
handler.tags = ['cash'] 
handler.command = ['pago'] 
handler.register = true
handler.admin = false  // Permite usar el comando sin ser admin
handler.group = true   // Solo funciona en grupos
handler.botAdmin = false // No requiere que el bot sea admin

export default handler
