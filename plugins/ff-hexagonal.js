let partidasHexagonal = {};

const handler = async (m, { conn, args }) => {
    // Verificar si se proporcionaron los argumentos necesarios
    if (args.length < 2) {
        conn.reply(m.chat, '_Debes proporcionar la hora (HH:MM) y el color de ropa._', m);
        return;
    }

    // Validar el formato de la hora
    const horaRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/;
    if (!horaRegex.test(args[0])) {
        conn.reply(m.chat, '_Formato de hora incorrecto. Debe ser HH:MM en formato de 24 horas._', m);
        return;
    }

    const horaUsuario = args[0]; // Hora proporcionada por el usuario
    const colorRopa = args.slice(1).join(' '); // Color de ropa proporcionado por el usuario

    // Calcular la hora adelantada
    const horaUsuarioSplit = horaUsuario.split(':');
    let horaAdelantada = '';
    if (horaUsuarioSplit.length === 2) {
        const horaNumerica = parseInt(horaUsuarioSplit[0], 10);
        const minutoNumerico = parseInt(horaUsuarioSplit[1], 10);
        const horaAdelantadaNumerica = horaNumerica + 1; // Adelantar 1 hora
        horaAdelantada = `${horaAdelantadaNumerica.toString().padStart(2, '0')}:${minutoNumerico.toString().padStart(2, '0')}`;
    }

    const message = `
    _*HEXAGONAL*_
    
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

    ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
    🥷🏻 ┇ 
    🥷🏻 ┇

(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎)
    `.trim();
    
    let msg = await conn.sendMessage(m.chat, {text: message}, {quoted: m});
    partidasHexagonal[msg.key.id] = {
        chat: m.chat,
        jugadores: [],
        suplentes: [],
        horaUsuario: horaUsuario,
        horaAdelantada: horaAdelantada,
        colorRopa: colorRopa,
        originalMsg: msg,
    };
};

handler.help = ['hexagonal']
handler.tags = ['freefire']
handler.command = /^(hexa|hexagonal)$/i;
handler.group = true
handler.admin = true

// Función para manejar las reacciones
handler.before = async function (m) {
    if (!m.message?.reactionMessage) return false
    
    let reaction = m.message.reactionMessage
    let key = reaction.key
    let emoji = reaction.text
    let sender = m.key.participant || m.key.remoteJid

    // Solo procesar reacciones de corazón o pulgar arriba
    if (!['❤️', '👍🏻', '❤', '👍'].includes(emoji)) return false
    
    // Verificar si existe la partida
    if (!partidasHexagonal[key.id]) return false

    let data = partidasHexagonal[key.id]

    // Verificar si el usuario ya está en la lista
    if (data.jugadores.includes(sender) || data.suplentes.includes(sender)) return false

    // Agregar a jugadores principales o suplentes (8 jugadores + 2 suplentes)
    if (data.jugadores.length < 8) {
        data.jugadores.push(sender)
    } else if (data.suplentes.length < 2) {
        data.suplentes.push(sender)
    } else {
        return false // Lista llena
    }

    // Crear las menciones para jugadores y suplentes
    let jugadores = data.jugadores.map(u => `@${u.split('@')[0]}`)
    let suplentes = data.suplentes.map(u => `@${u.split('@')[0]}`)

    const message = `
    _*HEXAGONAL*_
    
    𝐇𝐎𝐑𝐀𝐑𝐈𝐎
    🇲🇽 𝐌𝐄𝐗 : ${data.horaUsuario}
    🇨🇴 𝐂𝐎𝐋 : ${data.horaAdelantada}
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

    ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
    🥷🏻 ┇ ${suplentes[0] || ''}
    🥷🏻 ┇ ${suplentes[1] || ''}

${data.jugadores.length < 8 || data.suplentes.length < 2 ? '(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎)' : '✅ 𝐋𝐈𝐒𝐓𝐀 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀'}
    `.trim();

    try {
        await this.sendMessage(data.chat, {
            text: message,
            edit: data.originalMsg.key,
            mentions: [...data.jugadores, ...data.suplentes]
        })
    } catch (error) {
        console.error('Error al editar mensaje:', error)
    }

    return false
}

export default handler;
