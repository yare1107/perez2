import { canLevelUp, xpRange } from '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn, usedPrefix, command}) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let user = global.db.data.users[who]
  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './storage/img/avatar_contact.png')
  let { exp, limit, name, registered, regTime, age, level } = global.db.data.users[who]
  let { min, xp, max } = xpRange(user.level, global.multiplier)
  let username = conn.getName(who)
  let prem = global.prems.includes(who.split`@`[0])
  let txt = `👤「 *User Perfil* 」⬣\n`
     txt += `*🪴 Nombre ∙* ${name}\n`
     txt += `*🐢 Edad ∙* ${age} años\n`
     
     txt += `*📞 Numero ∙* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}\n`
     txt += `*🍬 Dulces ∙* ${limit}\n`
     txt += `*💫 Experiencia ∙* Total ${exp} ( *${user.exp - min}/${xp}* )\n`
     txt += `*👑 Premium ∙* ${prem ? 'Si' : 'No'}\n`
     txt += `🚩`
await conn.sendFile(m.chat, pp, 'thumbnail.jpg', txt, m)
}
handler.help = ['perfil', 'perfil @user']
handler.tags = ['rg']
handler.command = ['perfil', 'profile']
export default handler
