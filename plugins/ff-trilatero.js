let partidasTrilatero = {};

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
_*TRILATERO*_

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
    
    // Guardar la partida en el objeto global
    partidasTrilatero[msg.key.id] = {
        chat: m.chat,
        escuadra1: [],
        escuadra2: [],
        escuadra3: [],
        escuadra4: [],
        suplentes: [],
        horaUsuario: horaUsuario,
        horaAdelantada: horaAdelantada,
        colorRopa: colorRopa,
        originalMsg: msg,
    };
};

handler.help = ['trilatero']
handler.tags = ['freefire']
handler.command = /^(trila|trilatero)$/i;
handler.group = true;
handler.admin = true;

// Función para manejar las reacciones
handler.before = async function (m) {
    if (!m.message?.reactionMessage) return false;
    
    let reaction = m.message.reactionMessage;
    let key = reaction.key;
    let emoji = reaction.text;
    let sender = m.key.participant || m.key.remoteJid;

    // Solo procesar reacciones de corazón o pulgar arriba
    if (!['❤️', '👍🏻', '❤', '👍'].includes(emoji)) return false;
    
    // Verificar si existe la partida
    if (!partidasTrilatero[key.id]) return false;

    let data = partidasTrilatero[key.id];

    // Verificar si el usuario ya está en alguna escuadra o suplentes
    if (data.escuadra1.includes(sender) || 
        data.escuadra2.includes(sender) || 
        data.escuadra3.includes(sender) || 
        data.escuadra4.includes(sender) || 
        data.suplentes.includes(sender)) return false;

    // Agregar a la primera escuadra disponible
    if (data.escuadra1.length < 4) {
        data.escuadra1.push(sender);
    } else if (data.escuadra2.length < 4) {
        data.escuadra2.push(sender);
    } else if (data.escuadra3.length < 4) {
        data.escuadra3.push(sender);
    } else if (data.escuadra4.length < 4) {
        data.escuadra4.push(sender);
    } else if (data.suplentes.length < 2) {
        data.suplentes.push(sender);
    } else {
        return false; // Todas las listas están llenas
    }

    // Crear las menciones para cada escuadra
    let escuadra1 = data.escuadra1.map(u => `@${u.split('@')[0]}`);
    let escuadra2 = data.escuadra2.map(u => `@${u.split('@')[0]}`);
    let escuadra3 = data.escuadra3.map(u => `@${u.split('@')[0]}`);
    let escuadra4 = data.escuadra4.map(u => `@${u.split('@')[0]}`);
    let suplentes = data.suplentes.map(u => `@${u.split('@')[0]}`);

    // Verificar si todas las listas están completas
    let listaCompleta = data.escuadra1.length === 4 && 
                       data.escuadra2.length === 4 && 
                       data.escuadra3.length === 4 && 
                       data.escuadra4.length === 4 && 
                       data.suplentes.length === 2;

    let plantilla = `
_*TRILATERO*_

𝐇𝐎𝐑𝐀𝐑𝐈𝐎
🇲🇽 𝐌𝐄𝐗 : ${data.horaUsuario}
🇨🇴 𝐂𝐎𝐋 : ${data.horaAdelantada}
𝐂𝐎𝐋𝐎𝐑 𝐃𝐄 𝐑𝐎𝐏𝐀: ${data.colorRopa}

¬ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐏𝐑𝐄𝐒𝐄𝐍𝐓𝐄𝐒

     𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1

👑 ┇ ${escuadra1[0] || ''}
🥷🏻 ┇ ${escuadra1[1] || ''}
🥷🏻 ┇ ${escuadra1[2] || ''}
🥷🏻 ┇ ${escuadra1[3] || ''}
      
     𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2

👑 ┇ ${escuadra2[0] || ''}
🥷🏻 ┇ ${escuadra2[1] || ''}
🥷🏻 ┇ ${escuadra2[2] || ''}
🥷🏻 ┇ ${escuadra2[3] || ''}

     𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 3

👑 ┇ ${escuadra3[0] || ''}
🥷🏻 ┇ ${escuadra3[1] || ''}
🥷🏻 ┇ ${escuadra3[2] || ''}
🥷🏻 ┇ ${escuadra3[3] || ''}
      
     𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 4

👑 ┇ ${escuadra4[0] || ''}
🥷🏻 ┇ ${escuadra4[1] || ''}
🥷🏻 ┇ ${escuadra4[2] || ''}
🥷🏻 ┇ ${escuadra4[3] || ''}

  ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:

🥷🏻 ┇ ${suplentes[0] || ''}
🥷🏻 ┇ ${suplentes[1] || ''}

${!listaCompleta ? '(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎)' : '✅ 𝐋𝐈𝐒𝐓𝐀 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀'}
    `.trim();

    try {
        await this.sendMessage(data.chat, {
            text: plantilla,
            edit: data.originalMsg.key,
            mentions: [...data.escuadra1, ...data.escuadra2, ...data.escuadra3, ...data.escuadra4, ...data.suplentes]
        });
    } catch (error) {
        console.error('Error al editar mensaje:', error);
    }

    return false;
};

export default handler;
