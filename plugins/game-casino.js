import db from '../lib/database.js'

let buatall = 1
let cooldowns = {}

let handler = async (m, { conn, args, usedPrefix, command, DevMode }) => {
	let user = global.db.data.users[m.sender]
        let randomaku = `${Math.floor(Math.random() * 101)}`.trim()
        let randomkamu = `${Math.floor(Math.random() * 55)}`.trim()
        let Aku = (randomaku * 1)
        let Kamu = (randomkamu * 1)
        let count = args[0]
		let who = m.fromMe ? conn.user.jid : m.sender
	    let username = conn.getName(who)
	    
	    let tiempoEspera = 15
	    
	    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    conn.reply(m.chat, `🥷🏻 Ya has iniciado una apuesta recientemente, espera *⏱ ${tiempoRestante}* para apostar nuevamente`, m)
    return
  }
  
  cooldowns[m.sender] = Date.now()
	    
        count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].limit / buatall) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
        count = Math.max(1, count)
        if (args.length < 1) return conn.reply(m.chat, '🥷🏻 Ingresa la cantidad de ' + `*🍬 Dulces*` + ' que deseas aportar contra' + ` 𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳 - 𝑴𝑫` + `\n\n` + '`Ejemplo:`\n' + `> *${usedPrefix + command}* 100`, m)

        if (user.limit >= count * 1) {
            user.limit -= count * 1
            if (Aku > Kamu) {
                conn.reply(m.chat, '`🍟 Veamos que numeros tienen!`\n\n'+ `➠ *🍫 𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳 - 𝑴𝑫* : ${Aku}\n➠ *${username}* : ${Kamu}\n\n> ${username}, *PERDISTE* ${formatNumber(count)} 🍬 Dulces.`.trim(), m)
            } else if (Aku < Kamu) {
                user.limit += count * 2
                conn.reply(m.chat, '`🍟 Veamos que numeros tienen!`\n\n'+ `➠ *🍫 𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳 - 𝑴𝑫* : ${Aku}\n➠ *${username}* : ${Kamu}\n\n> ${username}, *GANASTE* ${formatNumber(count * 2)} 🍬 Dulces.`.trim(), m)
            } else {
                user.limit += count * 1
                conn.reply(m.chat, '`🍟 Veamos que numeros tienen!`\n\n'+ `➠ *🍫 𝐁𝐨𝐭 𝐕𝐞𝐧𝐭𝐚𝐬𝐏𝐞𝐫𝐳𝐳𝐳 - 𝑴𝑫* : ${Aku}\n➠ *${username}* : ${Kamu}\n\n> ${username} obtienes ${formatNumber(count * 1)} 🍬 Dulces.`.trim(), m)
            }
        } else conn.reply(m.chat, `No tienes *${formatNumber(count)} 🍬 dulces* para apostar!`.trim(), m)
    
}
    
handler.help = ['apostar *<cantidad>*']
handler.tags = ['game']
handler.command = /^(apostar|casino)$/i

handler.fail = null

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function segundosAHMS(segundos) {
  let segundosRestantes = segundos % 60
  return `${segundosRestantes} segundos`
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
