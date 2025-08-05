let handler = async (m, { isPrems, conn }) => {

    let videoUrl = 'https://qu.ax/PWOGh.mp4';
    let texto = `
𝐓𝐑𝐀𝐍𝐒𝐅𝐄𝐑𝐄𝐍𝐂𝐈𝐀𝐒  💸
728969000119672904
Stp 
*Franklin Pérez Méndez*

𝐃𝐄𝐏𝐎𝐒𝐈𝐓𝐎 💸
2242 1701 0032 1516
_SPIN OXXO_ 

𝐌𝐚𝐧𝐝𝐚𝐫 𝐜𝐨𝐦𝐩𝐫𝐨𝐛𝐚𝐧𝐭𝐞 𝐝𝐞 𝐩𝐚𝐠𝐨 🫶🏻

*MOTIVÓ*
_-Carne_
_-Despensa_
_-Comida_
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

export default handler
