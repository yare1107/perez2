import yts from "yt-search";
import axios from "axios";

// 🎵 DESCARGADOR SIMPLE Y CONFIABLE
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `🎵 *Descargador Simple*\n\n` +
      `*📝 Uso:*\n` +
      `${usedPrefix + command} <nombre de canción>\n` +
      `${usedPrefix + command} <URL de YouTube>\n\n` +
      `*🎯 Ejemplos:*\n` +
      `${usedPrefix + command} Bad Bunny Un Verano Sin Ti\n` +
      `${usedPrefix + command} https://youtube.com/watch?v=...\n\n` +
      `*⚡ Características:*\n` +
      `• Búsqueda automática\n` +
      `• Calidad MP3\n` +
      `• Descarga directa`
    );
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });
    
    let videoUrl = text;
    let videoInfo = null;

    // Si no es URL, buscar en YouTube
    if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
      console.log("🔍 Buscando:", text);
      
      const searchResults = await yts(text);
      if (!searchResults.videos || searchResults.videos.length === 0) {
        return m.reply(
          `❌ *No se encontraron resultados*\n\n` +
          `*🔍 Búsqueda:* ${text}\n\n` +
          `*💡 Sugerencias:*\n` +
          `• Usa términos más específicos\n` +
          `• Incluye el nombre del artista\n` +
          `• Prueba con URL directa`
        );
      }
      
      videoInfo = searchResults.videos[0];
      videoUrl = videoInfo.url;
      console.log("✅ Video encontrado:", videoInfo.title);
    }

    // Extraer ID del video
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return m.reply("❌ URL de YouTube inválida");
    }

    // Obtener información del video si no la tenemos
    if (!videoInfo) {
      const searchResults = await yts(videoUrl);
      if (searchResults.videos && searchResults.videos.length > 0) {
        videoInfo = searchResults.videos[0];
      }
    }

    // Intentar descargar usando API simple
    const downloadResult = await downloadWithSimpleAPI(videoId);
    
    if (!downloadResult.success) {
      return m.reply(
        `❌ *Error de descarga*\n\n` +
        `*🔍 Detalle:* ${downloadResult.error}\n\n` +
        `*💡 Intenta:*\n` +
        `• Otro video\n` +
        `• URL directa\n` +
        `• Más tarde`
      );
    }

    // Enviar información del video
    const infoMessage = {
      image: { url: videoInfo?.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
      caption:
        `🎵 *Descarga de Música*\n\n` +
        `📝 *Título:* ${videoInfo?.title || 'Desconocido'}\n` +
        `🎤 *Canal:* ${videoInfo?.author?.name || 'Desconocido'}\n` +
        `⏰ *Duración:* ${videoInfo?.timestamp || 'N/A'}\n` +
        `👁️ *Vistas:* ${videoInfo?.views ? videoInfo.views.toLocaleString() : 'N/A'}\n` +
        `🔧 *Método:* API Simple\n\n` +
        `📤 *Enviando audio...*`
    };

    await conn.sendMessage(m.chat, infoMessage);
    await conn.sendMessage(m.chat, { react: { text: "📤", key: m.key } });

    // Enviar archivo de audio
    const audioMessage = {
      audio: { url: downloadResult.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoInfo?.title || 'Audio'}.mp3`
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error en descarga:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    
    return m.reply(
      `❌ *Error del sistema*\n\n` +
      `*⚠️ Detalle:* ${error.message}\n\n` +
      `*🔧 Intenta:*\n` +
      `• Reiniciar bot\n` +
      `• Otro video\n` +
      `• Más tarde`
    );
  }
};

// Función de descarga usando API simple
async function downloadWithSimpleAPI(videoId) {
  try {
    // Usar API de vredenz (más confiable)
    const apiUrl = `https://api.vredenz.web.id/api/ytmp3?url=https://www.youtube.com/watch?v=${videoId}`;
    
    const response = await axios.get(apiUrl, {
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data?.status === 'success' && response.data?.result?.url) {
      return {
        success: true,
        downloadUrl: response.data.result.url
      };
    }
    
    throw new Error('API no retornó URL válida');
  } catch (error) {
    console.error("Error en API simple:", error.message);
    
    // Intentar con API alternativa
    try {
      const altApiUrl = `https://api.akuari.my.id/downloader/ytmp3?link=https://www.youtube.com/watch?v=${videoId}`;
      
      const altResponse = await axios.get(altApiUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (altResponse.data?.respon && altResponse.data?.respon?.url) {
        return {
          success: true,
          downloadUrl: altResponse.data.respon.url
        };
      }
    } catch (altError) {
      console.error("Error en API alternativa:", altError.message);
    }
    
    throw new Error('Todas las APIs fallaron');
  }
}

// Función auxiliar para extraer ID del video
function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Configuración
handler.help = ['play', 'song', 'audio', 'mp3'];
handler.tags = ['downloader'];
handler.command = /^(play|song|audio|mp3)$/i;
handler.register = true;
handler.limit = true;

export default handler; 