// ff-16vs16.js
let partidasVS16 = {};

const handler16vs16 = async (m, { conn, args }) => {
    if (args.length < 2) {
        conn.reply(m.chat, '_Debes proporcionar la hora (HH:MM) y el color de ropa._', m);
        return;
    }

    const horaRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/;
    if (!horaRegex.test(args[0])) {
        conn.reply(m.chat, '_Formato de hora incorrecto. Debe ser HH:MM en formato de 24 horas._', m);
        return;
    }

    const horaUsuario = args[0];
    const colorRopa = args.slice(1).join(' ');
    const horaUsuarioSplit = horaUsuario.split(':');
    const horaNumerica = parseInt(horaUsuarioSplit[0], 10);
    const minutoNumerico = parseInt(horaUsuarioSplit[1], 10);
    const horaAdelantadaNumerica = horaNumerica + 1;
    const horaAdelantada = `${horaAdelantadaNumerica.toString().padStart(2, '0')}:${minutoNumerico.toString().padStart(2, '0')}`;

    const message = `
16 𝐕𝐄𝐑𝐒𝐔𝐒 16

𝐇𝐎𝐑𝐀𝐑𝐈𝐎
🇲🇽 𝐌𝐄𝐗 : ${horaUsuario}
🇨🇴 𝐂𝐎𝐋 : ${horaAdelantada}
𝐂𝐎𝐋𝐎𝐑 𝐃𝐄 𝐑𝐎𝐏𝐀: ${colorRopa}

¬ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐏𝐑𝐄𝐒𝐄𝐍𝐓𝐄𝐒

      𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1

👑 ┇ 
🥷🏻 ┇  
🥷🏻 ┇ 
🥷🏻 ┇ 
      
     𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2

👑 ┇ 
🥷🏻 ┇ 
🥷🏻 ┇ 
🥷🏻 ┇ 

     𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 3

👑 ┇ 
🥷🏻 ┇ 
🥷🏻 ┇ 
🥷🏻 ┇ 

     𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 4

👑 ┇ 
🥷🏻 ┇ 
🥷🏻 ┇ 
🥷🏻 ┇ 

ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
🥷🏻 ┇ 
🥷🏻 ┇

(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎)
    `.trim();
    
    let msg = await conn.sendMessage(m.chat, {text: message}, {quoted: m});
    partidasVS16[msg.key.id] = {
        chat: m.chat,
        jugadores: [],
        suplentes: [],
        horaUsuario,
        colorRopa,
        originalMsg: msg,
    };
};

handler16vs16.help = ['16vs16'];
handler16vs16.tags = ['freefire'];
handler16vs16.command = /^(16vs16|vs16)$/i;

// Sistema de reacciones para 16vs16
handler16vs16.before = async function (m) {
    if (!m.message?.reactionMessage) return false;
    
    let reaction = m.message.reactionMessage;
    let key = reaction.key;
    let emoji = reaction.text;
    let sender = m.key.participant || m.key.remoteJid;

    if (!['❤️', '👍🏻', '❤', '👍'].includes(emoji)) return false;
    if (!partidasVS16[key.id]) return false;

    let data = partidasVS16[key.id];
    if (data.jugadores.includes(sender) || data.suplentes.includes(sender)) return false;

    if (data.jugadores.length < 16) {
        data.jugadores.push(sender);
    } else if (data.suplentes.length < 2) {
        data.suplentes.push(sender);
    } else {
        return false;
    }

    let jugadores = data.jugadores.map(u => `@${u.split('@')[0]}`);
    let suplentes = data.suplentes.map(u => `@${u.split('@')[0]}`);

    const horaUsuarioSplit = data.horaUsuario.split(':');
    const horaNumerica = parseInt(horaUsuarioSplit[0], 10);
    const minutoNumerico = parseInt(horaUsuarioSplit[1], 10);
    const horaAdelantadaNumerica = horaNumerica + 1;
    const horaAdelantada = `${horaAdelantadaNumerica.toString().padStart(2, '0')}:${minutoNumerico.toString().padStart(2, '0')}`;

    const message = `
16 𝐕𝐄𝐑𝐒𝐔𝐒 16

𝐇𝐎𝐑𝐀𝐑𝐈𝐎
🇲🇽 𝐌𝐄𝐗 : ${data.horaUsuario}
🇨🇴 𝐂𝐎𝐋 : ${horaAdelantada}
𝐂𝐎𝐋𝐎𝐑 𝐃𝐄 𝐑𝐎𝐏𝐀: ${data.colorRopa}

¬ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐏𝐑𝐄𝐒𝐄𝐍𝐓𝐄𝐒

      𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1

👑 ┇ ${jugadores[0] || ''}
🥷🏻 ┇ ${jugadores[1] || ''}
🥷🏻 ┇ ${jugadores[2] || ''}
🥷🏻 ┇ ${jugadores[3] || ''}
      
     𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2

👑 ┇ ${jugadores[4] || ''}
🥷🏻 ┇ ${jugadores[5] || ''}
🥷🏻 ┇ ${jugadores[6] || ''}
🥷🏻 ┇ ${jugadores[7] || ''}

     𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 3

👑 ┇ ${jugadores[8] || ''}
🥷🏻 ┇ ${jugadores[9] || ''}
🥷🏻 ┇ ${jugadores[10] || ''}
🥷🏻 ┇ ${jugadores[11] || ''}

     𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 4

👑 ┇ ${jugadores[12] || ''}
🥷🏻 ┇ ${jugadores[13] || ''}
🥷🏻 ┇ ${jugadores[14] || ''}
🥷🏻 ┇ ${jugadores[15] || ''}

ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
🥷🏻 ┇ ${suplentes[0] || ''}
🥷🏻 ┇ ${suplentes[1] || ''}

${data.jugadores.length < 16 || data.suplentes.length < 2 ? '(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎)' : '✅ 𝐋𝐈𝐒𝐓𝐀 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀'}
    `.trim();

    try {
        await this.sendMessage(data.chat, {
            text: message,
            edit: data.originalMsg.key,
            mentions: [...data.jugadores, ...data.suplentes]
        });
    } catch (error) {
        console.error('Error al editar mensaje:', error);
    }

    return false;
};

export { handler16vs16 as default };
