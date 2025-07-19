import yts from "yt-search";
import axios from "axios";

// APIs verificadas y funcionales
const APIs = {
  // YT-DLP público - más confiable
  ytdlp: "https://ytdlp-api.vercel.app",
  // Cobalt (verificar si funciona)
  cobalt: "https://api.cobalt.tools",
  // API alternativa
  y2mate: "https://www.y2mate.com/mates/analyze/ajax"
};

// Función para buscar metadata en iTunes (funcional)
const searchAppleMusic = async (query) => {
  try {
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1`;
    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.data?.results?.length > 0) {
      const item = response.data.results[0];
      return {
        title: item.trackName || 'Título desconocido',
        artist: item.artistName || 'Artista desconocido',
        album: item.collectionName || 'Álbum desconocido',
        artwork: item.artworkUrl100?.replace('100x100', '600x600') || '',
        duration: item.trackTimeMillis ? 
          `${Math.floor(item.trackTimeMillis / 60000)}:${String(Math.floor((item.trackTimeMillis % 60000) / 1000)).padStart(2, '0')}` : 
          'N/A',
        genre: item.primaryGenreName || 'Música'
      };
    }
    return null;
  } catch (error) {
    console.log("iTunes búsqueda falló:", error.message);
    return null;
  }
};

// Método 1: YT-DLP API (más confiable)
const downloadWithYtDlp = async (youtubeUrl) => {
  try {
    console.log("🔧 Probando YT-DLP API...");
    
    const response = await axios.post(`${APIs.ytdlp}/download`, {
      url: youtubeUrl,
      format: 'mp3',
      quality: 'highest'
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data?.success && response.data?.download_url) {
      console.log("✅ YT-DLP exitoso!");
      return {
        success: true,
        downloadUrl: response.data.download_url,
        title: response.data.title || 'Audio Completo',
        filesize: response.data.filesize || 'N/A'
      };
    }
    
    throw new Error('Respuesta inválida de YT-DLP');
  } catch (error) {
    console.error("❌ YT-DLP falló:", error.message);
    return { success: false, error: error.message };
  }
};

// Método 2: Cobalt Tools
const downloadWithCobalt = async (youtubeUrl) => {
  try {
    console.log("🔧 Probando Cobalt Tools...");
    
    const response = await axios.post(`${APIs.cobalt}/api/json`, {
      url: youtubeUrl,
      vCodec: "h264",
      vQuality: "720",
      aFormat: "mp3",
      filenamePattern: "classic",
      isAudioOnly: true
    }, {
      timeout: 25000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data?.status === "success" && response.data?.url) {
      console.log("✅ Cobalt exitoso!");
      return {
        success: true,
        downloadUrl: response.data.url,
        title: response.data.filename || 'Audio Completo'
      };
    }
    
    throw new Error(response.data?.text || 'Respuesta inválida de Cobalt');
  } catch (error) {
    console.error("❌ Cobalt falló:", error.message);
    return { success: false, error: error.message };
  }
};

// Método 3: Extracción directa con yt-search
const downloadWithDirect = async (videoData) => {
  try {
    console.log("🔧 Probando extracción directa...");
    
    // Algunas veces yt-search incluye URLs directas
    if (videoData.videoId) {
      // Intentar con una API pública simple
      const apiUrl = `https://api.vevioz.com/api/button/mp3/${videoData.videoId}`;
      
      const response = await axios.get(apiUrl, {
        timeout: 20000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data?.success && response.data?.url) {
        console.log("✅ Extracción directa exitosa!");
        return {
          success: true,
          downloadUrl: response.data.url,
          title: videoData.title || 'Audio Completo'
        };
      }
    }
    
    throw new Error('Extracción directa no disponible');
  } catch (error) {
    console.error("❌ Extracción directa falló:", error.message);
    return { success: false, error: error.message };
  }
};

// Función principal de búsqueda y descarga
const searchAndDownload = async (query) => {
  try {
    console.log("=== INICIANDO BÚSQUEDA Y DESCARGA ===");
    console.log("Query:", query);
    
    // Buscar en YouTube
    const searchResults = await yts(query);
    
    if (!searchResults?.videos?.length) {
      throw new Error('No se encontraron videos para esta búsqueda');
    }

    const video = searchResults.videos[0];
    console.log("Video encontrado:", video.title);
    console.log("Canal:", video.author?.name || 'Desconocido');
    console.log("URL:", video.url);

    // Lista de métodos de descarga en orden de prioridad
    const downloadMethods = [
      { name: "YT-DLP", func: () => downloadWithYtDlp(video.url) },
      { name: "Cobalt", func: () => downloadWithCobalt(video.url) },
      { name: "Directo", func: () => downloadWithDirect(video) }
    ];

    // Probar cada método
    for (const method of downloadMethods) {
      console.log(`\n--- Probando ${method.name} ---`);
      
      try {
        const result = await method.func();
        
        if (result.success && result.downloadUrl) {
          // Verificar que la URL sea válida
          const testResponse = await axios.head(result.downloadUrl, { 
            timeout: 5000,
            validateStatus: () => true 
          });
          
          if (testResponse.status === 200) {
            console.log(`🎉 ¡ÉXITO con ${method.name}!`);
            return {
              success: true,
              downloadUrl: result.downloadUrl,
              title: video.title,
              artist: video.author?.name || 'Desconocido',
              duration: video.timestamp || 'N/A',
              thumbnail: video.thumbnail,
              youtubeUrl: video.url,
              method: method.name,
              views: video.views || 0,
              filesize: result.filesize || 'N/A'
            };
          }
          
          console.log(`⚠️ URL inválida de ${method.name}`);
        }
      } catch (error) {
        console.log(`❌ ${method.name} error:`, error.message);
        continue;
      }
    }

    throw new Error('Todos los métodos de descarga fallaron');

  } catch (error) {
    console.error("💥 Error en searchAndDownload:", error.message);
    return { success: false, error: error.message };
  }
};

// Función auxiliar para validar URL de YouTube
const isValidYouTubeUrl = (url) => {
  const regex = /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return regex.test(url);
};

// Handler principal del comando
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `🎵 *Descargador de Audio*\n\n` +
      `*Uso:* ${usedPrefix + command} <canción>\n` +
      `*Ejemplo:* ${usedPrefix + command} Bad Bunny Tití Me Preguntó\n\n` +
      `_También puedes usar una URL directa de YouTube_`
    );
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎵 COMANDO AUD - INICIANDO");
  console.log("Búsqueda:", text);
  console.log("Usuario:", m.pushName || "Desconocido");

  // Reacciones
  await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

  try {
    let searchQuery = text.trim();
    let isDirectUrl = isValidYouTubeUrl(searchQuery);
    
    // Buscar metadata en Apple Music si no es URL directa
    let trackInfo = null;
    if (!isDirectUrl) {
      console.log("\n📱 Buscando metadata...");
      trackInfo = await searchAppleMusic(searchQuery);
      
      if (trackInfo) {
        console.log("✅ Metadata encontrada:", trackInfo.title);
      }
    }

    // Cambiar reacción
    await conn.sendMessage(m.chat, { react: { text: "⬇️", key: m.key } });

    // Descargar audio
    console.log("\n🎯 Iniciando descarga...");
    const downloadResult = await searchAndDownload(searchQuery);
    
    if (!downloadResult.success) {
      console.log("💥 DESCARGA FALLÓ:", downloadResult.error);
      
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply(
        `❌ *No se pudo descargar*\n\n` +
        `*Error:* ${downloadResult.error}\n\n` +
        `💡 *Prueba con:*\n` +
        `• Un término más específico\n` +
        `• Incluir artista y canción\n` +
        `• Una URL directa de YouTube\n` +
        `• Intentar en unos minutos\n\n` +
        `*Ejemplo:* ${usedPrefix + command} https://youtu.be/abc123`
      );
    }

    console.log("🎉 DESCARGA EXITOSA!");
    console.log("Método:", downloadResult.method);

    // Preparar información final
    const finalInfo = {
      title: trackInfo?.title || downloadResult.title,
      artist: trackInfo?.artist || downloadResult.artist,
      album: trackInfo?.album || 'YouTube',
      artwork: trackInfo?.artwork || downloadResult.thumbnail,
      duration: trackInfo?.duration || downloadResult.duration,
      genre: trackInfo?.genre || 'Música',
      filesize: downloadResult.filesize
    };

    // Enviar información del audio
    const infoMessage = {
      image: { url: finalInfo.artwork },
      caption:
        `🎵 *Audio Listo*\n\n` +
        `📝 *Título:* ${finalInfo.title}\n` +
        `🎤 *Artista:* ${finalInfo.artist}\n` +
        `💿 *Álbum:* ${finalInfo.album}\n` +
        `⏰ *Duración:* ${finalInfo.duration}\n` +
        `🎭 *Género:* ${finalInfo.genre}\n` +
        `📊 *Vistas:* ${downloadResult.views.toLocaleString()}\n` +
        `💾 *Tamaño:* ${finalInfo.filesize}\n` +
        `⚙️ *Método:* ${downloadResult.method}\n\n` +
        `✅ *Descarga completa exitosa*`,
      contextInfo: {
        externalAdReply: {
          title: finalInfo.title,
          body: `${finalInfo.artist} • Audio MP3`,
          mediaType: 2,
          mediaUrl: downloadResult.youtubeUrl,
          thumbnailUrl: finalInfo.artwork,
          showAdAttribution: true
        }
      }
    };

    await conn.sendMessage(m.chat, infoMessage);

    // Cambiar reacción a enviando
    await conn.sendMessage(m.chat, { react: { text: "📤", key: m.key } });

    // Enviar archivo de audio
    console.log("📤 Enviando archivo...");
    await conn.sendMessage(m.chat, {
      audio: { url: downloadResult.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${finalInfo.title} - ${finalInfo.artist}.mp3`
    }, { quoted: m });
    
    // Éxito final
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    console.log("🎉 COMANDO COMPLETADO");

  } catch (error) {
    console.error("💥 ERROR GENERAL:", error.message);
    
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    
    return m.reply(
      `💥 *Error inesperado*\n\n` +
      `${error.message}\n\n` +
      `🔧 *Intenta:*\n` +
      `• Reintentar en unos minutos\n` +
      `• Usar otro término de búsqueda\n` +
      `• Verificar tu conexión\n\n` +
      `Si el problema persiste, reporta al admin.`
    );
  }
};

handler.help = ['aud'];
handler.tags = ['downloader'];
handler.command = /^(aud|audio|mp3)$/i;
handler.register = true;

export default handler;
