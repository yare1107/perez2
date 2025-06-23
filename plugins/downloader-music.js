import fetch from "node-fetch";
import yts from "yt-search";

const fetchWithRetries = async (url, maxRetries = 2) => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.status === 200 && data.result && data.result.download && data.result.download.url) {
        return data.result;
      }
    } catch (error) {
      console.error(`Error en el intento ${attempt + 1}:`, error.message);
    }
    attempt++;
  }
  throw new Error("No se pudo obtener una respuesta válida.");
};

const decodeBase64 = (encoded) => Buffer.from(encoded, "base64").toString("utf-8");
const encodedApiUrl = "aHR0cHM6Ly9hcGkudnJlZGVuLndlYi5pZC9hcGkveXRtcDM=";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `[🚨] Solicitud incompleta. Intente nuevamente proporcionando un título de YouTube.\n\n[✅] *Ejemplo:* *${usedPrefix}play* Falsas Promesas.`,
    });
  }

  const key = await conn.sendMessage(m.chat, {
    text: `> @sxnt - ʟᴏᴄᴀʟ - 𝟢𝟨\n> 𝙱𝚞𝚜𝚌𝚊𝚗𝚍𝚘 𝚅𝚒́𝚍𝚎𝚘 🎬`,
  });

  try {
    const searchResults = await yts(text);
    if (!searchResults || !searchResults.videos.length) {
      throw new Error("No se encontraron resultados en YouTube.");
    }

    const video = searchResults.videos[0];
    const { title, timestamp: duration, views, author, ago, url: videoUrl } = video;
    
    const apiUrl = decodeBase64(encodedApiUrl) + `?url=${encodeURIComponent(videoUrl)}`;
    const apiData = await fetchWithRetries(apiUrl);

    const { metadata, download } = apiData;
    const { url: downloadUrl } = download;
    const descriptionVideo = `𝚈𝚘𝚞𝚃𝚞𝚋𝚎 𝙿𝚕𝚊𝚢 \n🎵 *Título:* ${metadata.title}\n👤 *Autor:* ${metadata.author.name}\n🖇️ *URL:* ${metadata.url}\n\n> @sxnt - ʟᴏᴄᴀʟ - 𝟢𝟨`;
    await conn.sendMessage(m.chat, { text: descriptionVideo, edit: key });
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${metadata.title}.mp3`,
        caption: "@sxnt - ʟᴏᴄᴀʟ - 𝟢𝟨",
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error al intentar procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
      edit: key,
    });
  }
};

handler.tags = ['downloader']
handler.help = ['music']
handler.command = /^music$/i
export default handler;
