let partidasCuadrilatero = {};

const handler = async (m, { conn, args }) => {
    // Verificar si se proporcionaron los argumentos necesarios
    if (args.length < 3) {
        conn.reply(m.chat, '_Debes proporcionar la hora (HH:MM), el país (MX, CO, VE, EC) y el color de ropa._', m);
        return;
    }

    // Validar el formato de la hora
    const horaRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/;
    if (!horaRegex.test(args[0])) {
        conn.reply(m.chat, '_Formato de hora incorrecto. Debe ser HH:MM en formato de 24 horas._', m);
        return;
    }

    const horaUsuario = args[0]; // Hora proporcionada por el usuario
    const paisReferencia = args[1].toUpperCase(); // País de referencia proporcionado por el usuario
    const colorRopa = args.slice(2).join(' '); // Color de ropa proporcionado por el usuario

    // Definir las zonas horarias UTC para cada país (aproximadas)
    const zonasHorarias = {
        MX: -6, // México (UTC-6)
        CO: -5, // Colombia (UTC-5)
        VE: -4, // Venezuela (UTC-4)
        EC: -5  // Ecuador (UTC-5)
    };

    if (!(paisReferencia in zonasHorarias)) {
        conn.reply(m.chat, '_País no válido. Usa MX para México, CO para Colombia, VE para Venezuela o EC para Ecuador._', m);
        return;
    }

    // Extraer hora y minutos
    const hora = parseInt(horaUsuario.split(':')[0], 10);
    const minutos = parseInt(horaUsuario.split(':')[1], 10);

    // Crear fecha base con la hora del país de referencia
    const fechaReferencia = new Date();
    fechaReferencia.setHours(hora);
    fechaReferencia.setMinutes(minutos);
    fechaReferencia.setSeconds(0);
    fechaReferencia.setMilliseconds(0);

    // Convertir la hora del país de referencia a UTC
    const horaUTC = new Date(fechaReferencia.getTime() - (zonasHorarias[paisReferencia] * 3600000));

    // Calcular la hora para cada país
    const paises = ['MX', 'CO', 'VE', 'EC'];
    const horasEnPais = [];
    
    for (let pais of paises) {
        // Convertir de UTC a la hora local de cada país
        const horaLocal = new Date(horaUTC.getTime() + (zonasHorarias[pais] * 3600000));
        horasEnPais.push(horaLocal);
    }

    // Formatear las horas según el formato de 24 horas y obtener solo la hora y minutos
    const formatTime = (date) => {
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    const message = `
    _*CUADRILATERO*_
    
    𝐇𝐎𝐑𝐀𝐑𝐈𝐎
    🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${formatTime(horasEnPais[0])}
    🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${formatTime(horasEnPais[1])}
    🇻🇪 𝐕𝐄𝐍𝐄𝐙𝐔𝐄𝐋𝐀 : ${formatTime(horasEnPais[2])}
    🇪🇨 𝐄𝐂𝐔𝐀𝐃𝐎𝐑 : ${formatTime(horasEnPais[3])}
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
    
    ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
    🥷🏻 ┇ 
    🥷🏻 ┇

(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎)
(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 😂 𝚙𝚊𝚛𝚊 𝚜𝚎𝚛 𝚜𝚞𝚙𝚕𝚎𝚗𝚝𝚎)
    `.trim();
    
    let msg = await conn.sendMessage(m.chat, {text: message}, {quoted: m});
    partidasCuadrilatero[msg.key.id] = {
        chat: m.chat,
        jugadores: [],
        suplentes: [],
        horarios: {
            mexico: formatTime(horasEnPais[0]),
            colombia: formatTime(horasEnPais[1]),
            venezuela: formatTime(horasEnPais[2]),
            ecuador: formatTime(horasEnPais[3])
        },
        colorRopa: colorRopa,
        originalMsg: msg,
    };
};

handler.help = ['cuadrilatero']
handler.tags = ['freefire']
handler.command = /^(cuadri|cuadrilatero)$/i;
handler.group = true
handler.admin = true

// Función para manejar las reacciones
handler.before = async function (m) {
    if (!m.message?.reactionMessage) return false
    
    let reaction = m.message.reactionMessage
    let key = reaction.key
    let emoji = reaction.text
    let sender = m.key.participant || m.key.remoteJid
    let operation = reaction.operation || 'add' // 'add' para agregar, 'remove' para quitar

    // Debug: Log para ver qué está pasando
    console.log('Reacción detectada:', {
        emoji,
        sender: sender.split('@')[0],
        operation,
        keyId: key.id
    })

    // Verificar si existe la partida
    if (!partidasCuadrilatero[key.id]) return false

    let data = partidasCuadrilatero[key.id]
    let wasInJugadores = data.jugadores.includes(sender)
    let wasInSuplentes = data.suplentes.includes(sender)
    let shouldUpdate = false

    console.log('Estado antes:', {
        jugadores: data.jugadores.map(u => u.split('@')[0]),
        suplentes: data.suplentes.map(u => u.split('@')[0]),
        wasInJugadores,
        wasInSuplentes
    })

    // Si es operación de remover reacción O si el emoji es null/undefined (indica remoción)
    if (operation === 'remove' || emoji === null || emoji === undefined || emoji === '') {
        console.log('Procesando remoción de reacción')
        // Remover de cualquier lista donde esté el usuario
        if (wasInJugadores) {
            data.jugadores = data.jugadores.filter(u => u !== sender)
            shouldUpdate = true
            console.log('Removido de jugadores')
        }
        if (wasInSuplentes) {
            data.suplentes = data.suplentes.filter(u => u !== sender)
            shouldUpdate = true
            console.log('Removido de suplentes')
        }
    } 
    // Si es operación de agregar reacción
    else if (operation === 'add') {
        console.log('Procesando adición de reacción')
        // Si el usuario ya está en alguna lista, lo removemos primero (cambio de reacción)
        if (wasInJugadores) {
            data.jugadores = data.jugadores.filter(u => u !== sender)
        } else if (wasInSuplentes) {
            data.suplentes = data.suplentes.filter(u => u !== sender)
        }

        // Lógica para diferentes emojis
        if (['❤️', '👍🏻', '❤', '👍'].includes(emoji)) {
            // Para jugadores principales (12 jugadores para cuadrilátero)
            if (data.jugadores.length < 12) {
                data.jugadores.push(sender)
                shouldUpdate = true
                console.log('Agregado a jugadores')
            } else if (!wasInJugadores && !wasInSuplentes) {
                console.log('Lista de jugadores llena')
                return false // Lista de jugadores llena y es usuario nuevo
            }
        } else if (emoji === '😂') {
            // Para suplentes
            if (data.suplentes.length < 2) {
                data.suplentes.push(sender)
                shouldUpdate = true
                console.log('Agregado a suplentes')
            } else if (!wasInJugadores && !wasInSuplentes) {
                console.log('Lista de suplentes llena')
                return false // Lista de suplentes llena y es usuario nuevo
            }
        } else {
            console.log('Emoji no válido:', emoji)
            // Emoji no válido, si estaba en alguna lista lo mantenemos
            if (wasInJugadores && data.jugadores.length < 12) {
                data.jugadores.push(sender)
            } else if (wasInSuplentes && data.suplentes.length < 2) {
                data.suplentes.push(sender)
            }
            return false
        }
    }

    console.log('Estado después:', {
        jugadores: data.jugadores.map(u => u.split('@')[0]),
        suplentes: data.suplentes.map(u => u.split('@')[0]),
        shouldUpdate
    })

    // Solo actualizar si hubo cambios
    if (!shouldUpdate) return false

    // Crear las menciones para jugadores y suplentes
    let jugadores = data.jugadores.map(u => `@${u.split('@')[0]}`)
    let suplentes = data.suplentes.map(u => `@${u.split('@')[0]}`)

    const message = `
    _*CUADRILATERO*_
    
    𝐇𝐎𝐑𝐀𝐑𝐈𝐎
    🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${data.horarios.mexico}
    🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${data.horarios.colombia}
    🇻🇪 𝐕𝐄𝐍𝐄𝐙𝐔𝐄𝐋𝐀 : ${data.horarios.venezuela}
    🇪🇨 𝐄𝐂𝐔𝐀𝐃𝐎𝐑 : ${data.horarios.ecuador}
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
    
    ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
    🥷🏻 ┇ ${suplentes[0] || ''}
    🥷🏻 ┇ ${suplentes[1] || ''}

${data.jugadores.length < 12 || data.suplentes.length < 2 ? '(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎)\n(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 😂 𝚙𝚊𝚛𝚊 𝚜𝚎𝚛 𝚜𝚞𝚙𝚕𝚎𝚗𝚝𝚎)' : '✅ 𝐋𝐈𝐒𝐓𝐀 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀'}
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
