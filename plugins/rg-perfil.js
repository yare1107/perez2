import { xpRange } from '../lib/levelling.js'
import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let user = global.db.data.users[who]

  // Verificamos si el usuario está registrado en la base de datos
  if (!user) {
    user = { exp: 0, limit: 0, name: 'Desconocido', level: 0 }
  }

  let { exp, limit, name, level } = user
  let { min, xp, max } = xpRange(user.level, global.multiplier)
  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://qu.ax/FPVnV.jpg')
  let img = await (await fetch(`${pp}`)).buffer()

  let txt = `👤「 *User Perfil* 」⬣\n`
  txt += `*🪴 Nombre ∙* ${name}\n`
  txt += `*📞 Numero ∙* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}\n`
  txt += `*🍬 Dulces ∙* ${limit}\n`
  txt += `*💫 Experiencia ∙* Total ${exp} ( *${user.exp - min}/${xp}* )\n`
  txt += `*🚩 Nivel ∙* ${level}`

  let mentionedJid = [who]
  await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m)
}

handler.help = ['perfil', 'perfil *@user*']
handler.tags = ['start']
handler.command = /^(perfil|profile)$/i

export default handler
