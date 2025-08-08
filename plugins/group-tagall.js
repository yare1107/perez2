const handler = async (m, { conn, text, participants, args, isOwner, isAdmin }) => {
  // Verificación de permisos de administrador - ESTO ES LO QUE FALTABA
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  let chat = global.db.data.chats[m.chat];
  let emoji = chat.emojiTag || '👑'; 
  
  const pesan = args.join` `;
  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupName = groupMetadata.subject;
  
  const countryFlags = {
    '1': '🇺🇸',      // Estados Unidos/Canadá
    '7': '🇷🇺',      // Rusia
    '20': '🇪🇬',     // Egipto
    '27': '🇿🇦',     // Sudáfrica
    '30': '🇬🇷',     // Grecia
    '31': '🇳🇱',     // Países Bajos
    '32': '🇧🇪',     // Bélgica
    '33': '🇫🇷',     // Francia
    '34': '🇪🇸',     // España
    '36': '🇭🇺',     // Hungría
    '39': '🇮🇹',     // Italia
    '40': '🇷🇴',     // Rumania
    '41': '🇨🇭',     // Suiza
    '43': '🇦🇹',     // Austria
    '44': '🇬🇧',     // Reino Unido
    '45': '🇩🇰',     // Dinamarca
    '46': '🇸🇪',     // Suecia
    '47': '🇳🇴',     // Noruega
    '48': '🇵🇱',     // Polonia
    '49': '🇩🇪',     // Alemania
    '51': '🇵🇪',     // Perú
    '52': '🇲🇽',     // México
    '53': '🇨🇺',     // Cuba
    '54': '🇦🇷',     // Argentina
    '55': '🇧🇷',     // Brasil
    '56': '🇨🇱',     // Chile
    '57': '🇨🇴',     // Colombia
    '58': '🇻🇪',     // Venezuela
    '60': '🇲🇾',     // Malasia
    '61': '🇦🇺',     // Australia
    '62': '🇮🇩',     // Indonesia
    '63': '🇵🇭',     // Filipinas
    '64': '🇳🇿',     // Nueva Zelanda
    '65': '🇸🇬',     // Singapur
    '66': '🇹🇭',     // Tailandia
    '81': '🇯🇵',     // Japón
    '82': '🇰🇷',     // Corea del Sur
    '84': '🇻🇳',     // Vietnam
    '86': '🇨🇳',     // China
    '90': '🇹🇷',     // Turquía
    '91': '🇮🇳',     // India
    '92': '🇵🇰',     // Pakistán
    '93': '🇦🇫',     // Afganistán
    '94': '🇱🇰',     // Sri Lanka
    '95': '🇲🇲',     // Myanmar
    '98': '🇮🇷',     // Irán
    '212': '🇲🇦',    // Marruecos
    '213': '🇩🇿',    // Argelia
    '216': '🇹🇳',    // Túnez
    '218': '🇱🇾',    // Libia
    '220': '🇬🇲',    // Gambia
    '221': '🇸🇳',    // Senegal
    '222': '🇲🇷',    // Mauritania
    '223': '🇲🇱',    // Malí
    '224': '🇬🇳',    // Guinea
    '225': '🇨🇮',    // Costa de Marfil
    '226': '🇧🇫',    // Burkina Faso
    '227': '🇳🇪',    // Níger
    '228': '🇹🇬',    // Togo
    '229': '🇧🇯',    // Benín
    '230': '🇲🇺',    // Mauricio
    '231': '🇱🇷',    // Liberia
    '232': '🇸🇱',    // Sierra Leona
    '233': '🇬🇭',    // Ghana
    '234': '🇳🇬',    // Nigeria
    '235': '🇹🇩',    // Chad
    '236': '🇨🇫',    // República Centroafricana
    '237': '🇨🇲',    // Camerún
    '238': '🇨🇻',    // Cabo Verde
    '239': '🇸🇹',    // Santo Tomé y Príncipe
    '240': '🇬🇶',    // Guinea Ecuatorial
    '241': '🇬🇦',    // Gabón
    '242': '🇨🇬',    // República del Congo
    '243': '🇨🇩',    // República Democrática del Congo
    '244': '🇦🇴',    // Angola
    '245': '🇬🇼',    // Guinea-Bissau
    '246': '🇮🇴',    // Territorio Británico del Océano Índico
    '248': '🇸🇨',    // Seychelles
    '249': '🇸🇩',    // Sudán
    '250': '🇷🇼',    // Ruanda
    '251': '🇪🇹',    // Etiopía
    '252': '🇸🇴',    // Somalia
    '253': '🇩🇯',    // Yibuti
    '254': '🇰🇪',    // Kenia
    '255': '🇹🇿',    // Tanzania
    '256': '🇺🇬',    // Uganda
    '257': '🇧🇮',    // Burundi
    '258': '🇲🇿',    // Mozambique
    '260': '🇿🇲',    // Zambia
    '261': '🇲🇬',    // Madagascar
    '262': '🇷🇪',    // Reunión/Mayotte
    '263': '🇿🇼',    // Zimbabue
    '264': '🇳🇦',    // Namibia
    '265': '🇲🇼',    // Malaui
    '266': '🇱🇸',    // Lesotho
    '267': '🇧🇼',    // Botsuana
    '268': '🇸🇿',    // Esuatini
    '269': '🇰🇲',    // Comoras
    '290': '🇸🇭',    // Santa Elena
    '291': '🇪🇷',    // Eritrea
    '297': '🇦🇼',    // Aruba
    '298': '🇫🇴',    // Islas Feroe
    '299': '🇬🇱',    // Groenlandia
    '350': '🇬🇮',    // Gibraltar
    '351': '🇵🇹',    // Portugal
    '352': '🇱🇺',    // Luxemburgo
    '353': '🇮🇪',    // Irlanda
    '354': '🇮🇸',    // Islandia
    '355': '🇦🇱',    // Albania
    '356': '🇲🇹',    // Malta
    '357': '🇨🇾',    // Chipre
    '358': '🇫🇮',    // Finlandia
    '359': '🇧🇬',    // Bulgaria
    '370': '🇱🇹',    // Lituania
    '371': '🇱🇻',    // Letonia
    '372': '🇪🇪',    // Estonia
    '373': '🇲🇩',    // Moldavia
    '374': '🇦🇲',    // Armenia
    '375': '🇧🇾',    // Bielorrusia
    '376': '🇦🇩',    // Andorra
    '377': '🇲🇨',    // Mónaco
    '378': '🇸🇲',    // San Marino
    '380': '🇺🇦',    // Ucrania
    '381': '🇷🇸',    // Serbia
    '382': '🇲🇪',    // Montenegro
    '383': '🇽🇰',    // Kosovo
    '385': '🇭🇷',    // Croacia
    '386': '🇸🇮',    // Eslovenia
    '387': '🇧🇦',    // Bosnia y Herzegovina
    '389': '🇲🇰',    // Macedonia del Norte
    '420': '🇨🇿',    // República Checa
    '421': '🇸🇰',    // Eslovaquia
    '423': '🇱🇮',    // Liechtenstein
    '500': '🇫🇰',    // Islas Malvinas
    '501': '🇧🇿',    // Belice
    '502': '🇬🇹',    // Guatemala
    '503': '🇸🇻',    // El Salvador
    '504': '🇭🇳',    // Honduras
    '505': '🇳🇮',    // Nicaragua
    '506': '🇨🇷',    // Costa Rica
    '507': '🇵🇦',    // Panamá
    '508': '🇵🇲',    // San Pedro y Miquelón
    '509': '🇭🇹',    // Haití
    '590': '🇬🇵',    // Guadalupe
    '591': '🇧🇴',    // Bolivia
    '592': '🇬🇾',    // Guyana
    '593': '🇪🇨',    // Ecuador
    '594': '🇬🇫',    // Guayana Francesa
    '595': '🇵🇾',    // Paraguay
    '596': '🇲🇶',    // Martinica
    '597': '🇸🇷',    // Surinam
    '598': '🇺🇾',    // Uruguay
    '599': '🇧🇶',    // Bonaire/Curazao
    '670': '🇹🇱',    // Timor Oriental
    '672': '🇦🇶',    // Antártida
    '673': '🇧🇳',    // Brunéi
    '674': '🇳🇷',    // Nauru
    '675': '🇵🇬',    // Papúa Nueva Guinea
    '676': '🇹🇴',    // Tonga
    '677': '🇸🇧',    // Islas Salomón
    '678': '🇻🇺',    // Vanuatu
    '679': '🇫🇯',    // Fiyi
    '680': '🇵🇼',    // Palaos
    '681': '🇼🇫',    // Wallis y Futuna
    '682': '🇨🇰',    // Islas Cook
    '683': '🇳🇺',    // Niue
    '684': '🇦🇸',    // Samoa Americana
    '685': '🇼🇸',    // Samoa
    '686': '🇰🇮',    // Kiribati
    '687': '🇳🇨',    // Nueva Caledonia
    '688': '🇹🇻',    // Tuvalu
    '689': '🇵🇫',    // Polinesia Francesa
    '690': '🇹🇰',    // Tokelau
    '691': '🇫🇲',    // Micronesia
    '692': '🇲🇭',    // Islas Marshall
    '850': '🇰🇵',    // Corea del Norte
    '852': '🇭🇰',    // Hong Kong
    '853': '🇲🇴',    // Macao
    '855': '🇰🇭',    // Camboya
    '856': '🇱🇦',    // Laos
    '880': '🇧🇩',    // Bangladés
    '886': '🇹🇼',    // Taiwán
    '960': '🇲🇻',    // Maldivas
    '961': '🇱🇧',    // Líbano
    '962': '🇯🇴',    // Jordania
    '963': '🇸🇾',    // Siria
    '964': '🇮🇶',    // Irak
    '965': '🇰🇼',    // Kuwait
    '966': '🇸🇦',    // Arabia Saudí
    '967': '🇾🇪',    // Yemen
    '968': '🇴🇲',    // Omán
    '970': '🇵🇸',    // Palestina
    '971': '🇦🇪',    // Emiratos Árabes Unidos
    '972': '🇮🇱',    // Israel
    '973': '🇧🇭',    // Baréin
    '974': '🇶🇦',    // Catar
    '975': '🇧🇹',    // Bután
    '976': '🇲🇳',    // Mongolia
    '977': '🇳🇵',    // Nepal
    '992': '🇹🇯',    // Tayikistán
    '993': '🇹🇲',    // Turkmenistán
    '994': '🇦🇿',    // Azerbaiyán
    '995': '🇬🇪',    // Georgia
    '996': '🇰🇬',    // Kirguistán
    '998': '🇺🇿'     // Uzbekistán
  };
  
  const getCountryFlag = (id) => {
    const phoneNumber = id.split('@')[0]; 
    
    // Buscar coincidencia empezando por prefijos más largos
    for (let i = 4; i >= 1; i--) {
      const prefix = phoneNumber.slice(0, i);
      if (countryFlags[prefix]) {
        return countryFlags[prefix];
      }
    }
    
    return '🏳️‍🌈'; // Bandera por defecto si no se encuentra
  }; 
  
  let teks = `*${groupName}*\n\n*Integrantes : ${participants.length}*\n${pesan}\n┌──⭓ *Despierten*\n`; 
  
  for (const mem of participants) {
    const userId = mem.id || mem.jid;
    teks += `${emoji} ${getCountryFlag(userId)} @${userId.split('@')[0]}\n`;
  }
  
  teks += `└───────⭓\n\n> 𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳`; 
  
  await conn.sendMessage(m.chat, {
    text: teks, 
    mentions: participants.map((a) => a.id || a.jid)
  });
}; 

handler.help = ['todos']; 
handler.tags = ['group']; 
handler.command = /^(tagall|invocar|marcar|todos|invocación)$/i; 
handler.group = true; 
handler.admin = true;

export default handler;
