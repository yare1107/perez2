import yts from "yt-search";
import axios from "axios";

// 🎵 DESCARGADOR DE AUDIO SIMPLIFICADO Y CONFIABLE
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `🎵 *Descargador de Música*\n\n` +
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

    // Intentar descargar usando diferentes métodos
    const downloadResult = await tryDownloadMethods(videoId, videoInfo);
    
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
        `🔧 *Método:* ${downloadResult.method}\n\n` +
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

// Función para intentar diferentes métodos de descarga
async function tryDownloadMethods(videoId, videoInfo) {
  const methods = [
    {
      name: "Y2Mate",
      func: () => downloadWithY2Mate(videoId)
    },
    {
      name: "Loader.to",
      func: () => downloadWithLoader(videoId)
    },
    {
      name: "SSYoutube",
      func: () => downloadWithSSYoutube(videoId)
    }
  ];

  for (const method of methods) {
    try {
      console.log(`🔧 Probando ${method.name}...`);
      const result = await method.func();
      
      if (result.success && result.downloadUrl) {
        console.log(`✅ ${method.name} exitoso!`);
        return {
          success: true,
          downloadUrl: result.downloadUrl,
          method: method.name
        };
      }
    } catch (error) {
      console.log(`❌ ${method.name} falló:`, error.message);
      continue;
    }
    
    // Pausa entre intentos
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return {
    success: false,
    error: "Todos los métodos de descarga fallaron"
  };
}

// Método 1: Y2Mate
async function downloadWithY2Mate(videoId) {
  try {
    const response = await axios.get(`https://y2mate.com/api/convert`, {
      params: {
        video_id: videoId,
        format: 'mp3',
        quality: '128'
      },
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data?.success && response.data?.download_url) {
      return {
        success: true,
        downloadUrl: response.data.download_url
      };
    }
    
    throw new Error('Y2Mate no retornó URL válida');
  } catch (error) {
    throw new Error(`Y2Mate: ${error.message}`);
  }
}

// Método 2: Loader.to
async function downloadWithLoader(videoId) {
  try {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    const response = await axios.post('https://loader.to/ajax/download.php', {
      url: youtubeUrl,
      format: 'mp3'
    }, {
      timeout: 20000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://loader.to/',
        'Origin': 'https://loader.to'
      }
    });

    if (response.data?.success && response.data?.download_url) {
      return {
        success: true,
        downloadUrl: response.data.download_url
      };
    }
    
    throw new Error('Loader.to no retornó URL válida');
  } catch (error) {
    throw new Error(`Loader.to: ${error.message}`);
  }
}

// Método 3: SSYoutube
async function downloadWithSSYoutube(videoId) {
  try {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const ssUrl = youtubeUrl.replace('youtube.com', 'ssyoutube.com');
    
    const response = await axios.post('https://ssyoutube.com/api/convert', {
      url: ssUrl,
      format: 'mp3'
    }, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://ssyoutube.com/',
        'Origin': 'https://ssyoutube.com'
      }
    });

    if (response.data?.success && response.data?.download_url) {
      return {
        success: true,
        downloadUrl: response.data.download_url
      };
    }
    
    throw new Error('SSYoutube no retornó URL válida');
  } catch (error) {
    throw new Error(`SSYoutube: ${error.message}`);
  }
}

// Función auxiliar para extraer ID del video
function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Configuración
handler.help = ['music', 'song', 'audio', 'mp3', 'aud'];
handler.tags = ['downloader'];
handler.command = /^(aud|music|song|audio|mp3)$/i;
handler.register = true;
handler.limit = true;

export default handler;
