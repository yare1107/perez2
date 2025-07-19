import fetch from "node-fetch";
import yts from "yt-search";

// APIs actualizadas que realmente funcionan para descarga completa
const APIs = {
  // API principal - confiable y gratuita
  primary: "https://api.cobalt.tools/api/json",
  // APIs de respaldo funcionales
  backup1: "https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/",
  backup2: "https://youtube-to-mp315.p.rapidapi.com/download",
  backup3: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl"
};

// Función para buscar en Apple Music (solo para metadata)
const searchAppleMusic = async (query) => {
  try {
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=3`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 8000
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results.map(item => ({
        title: item.trackName || 'Título desconocido',
        artist: item.artistName || 'Artista desconocido',
        album: item.collectionName || 'Álbum desconocido',
        artwork: item.artworkUrl100?.replace('100x100', '500x500'),
        duration: item.trackTimeMillis,
        genre: item.primaryGenreName || 'Música'
      }));
    }
    return [];
  } catch (error) {
    console.error("Error buscando en Apple Music:", error.message);
    return [];
  }
};

// Método 1: Cobalt Tools (más confiable)
const downloadWithCobalt = async (youtubeUrl) => {
  try {
    console.log("🔧 Probando Cobalt Tools...");
    
    const response = await fetch(APIs.primary, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        url: youtubeUrl,
        vCodec: "h264",
        vQuality: "720",
        aFormat: "mp3",
        filenamePattern: "classic",
        isAudioOnly: true
      }),
      timeout: 20000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Respuesta Cobalt:", JSON.stringify(data, null, 2));
    
    if (data.status === "success" && data.url) {
      console.log("✅ Cobalt exitoso!");
      return {
        success: true,
        downloadUrl: data.url,
        title: data.filename || 'Audio Completo'
      };
    } else if (data.status === "error") {
      throw new Error(data.text || 'Error desconocido de Cobalt');
    }
    
    throw new Error('Respuesta inválida de Cobalt');
  } catch (error) {
    console.error("❌ Cobalt falló:", error.message);
    return { success: false, error: error.message };
  }
};

// Método 2: YT-DLP style API
const downloadWithYtDlp = async (youtubeUrl) => {
  try {
    console.log("🔧 Probando YT-DLP style API...");
    
    const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (!videoId) throw new Error("ID de video inválido");

    // Usando una API pública que funcione
    const apiUrl = `https://api.onlinevideoconverter.pro/api/convert`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        url: youtubeUrl,
        format: 'mp3',
        quality: '320'
      }),
      timeout: 25000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("Respuesta YT-DLP:", JSON.stringify(data, null, 2));
    
    if (data && data.success && data.download_url) {
      console.log("✅ YT-DLP exitoso!");
      return {
        success: true,
        downloadUrl: data.download_url,
        title: data.title || 'Audio Completo'
      };
    }
    
    throw new Error('No se obtuvo URL de descarga válida');
  } catch (error) {
    console.error("❌ YT-DLP falló:", error.message);
    return { success: false, error: error.message };
  }
};

// Método 3: API alternativa confiable
const downloadWithAlternativeAPI = async (youtubeUrl) => {
  try {
    console.log("🔧 Probando API alternativa...");
    
    // Usar una API diferente y confiable
    const response = await fetch(`https://api.download-youtube.com/api/json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        url: youtubeUrl,
        format: 'mp3',
        quality: 'high'
      }),
      timeout: 20000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("Respuesta API alternativa:", JSON.stringify(data, null, 2));
    
    if (data && data.status === 'success' && data.result && data.result.url) {
      console.log("✅ API alternativa exitosa!");
      return {
        success: true,
        downloadUrl: data.result.url,
        title: data.result.title || 'Audio Completo'
      };
    }
    
    throw new Error('Respuesta inválida de API alternativa');
  } catch (error) {
    console.error("❌ API alternativa falló:", error.message);
    return { success: false, error: error.message };
  }
};

// Método 4: Scraping directo con yt-dlp
const downloadWithScraping = async (youtubeUrl) => {
  try {
    console.log("🔧 Probando método de scraping...");
    
    // Este método intentaría hacer scraping directo
    // Por ahora retornamos false para que no se use hasta implementar completamente
    const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (!videoId) throw new Error("ID de video inválido");

    // Placeholder para implementación futura de scraping real
    // Requeriría puppeteer o similar para ser completamente funcional
    
    throw new Error('Método de scraping no implementado completamente');
  } catch (error) {
    console.error("❌ Scraping falló:", error.message);
    return { success: false, error: error.message };
  }
};

// Función principal de búsqueda y descarga
const searchAndDownload = async (query) => {
  try {
    console.log("=== INICIANDO BÚSQUEDA Y DESCARGA COMPLETA ===");
    console.log("Query:", query);
    
    // Buscar en YouTube primero
    const searchResults = await yts(query);
    
    if (!searchResults || !searchResults.videos || !searchResults.videos.length) {
      throw new Error('No se encontraron videos en YouTube para esta búsqueda');
    }

    const video = searchResults.videos[0];
    console.log("Video seleccionado:", video.title);
    console.log("Canal:", video.author.name);
    console.log("Duración:", video.timestamp);
    console.log("URL:", video.url);

    // Lista de métodos de descarga (solo para audio completo)
    const downloadMethods = [
      { name: "Cobalt Tools", func: () => downloadWithCobalt(video.url) },
      { name: "YT-DLP API", func: () => downloadWithYtDlp(video.url) },
      { name: "API Alternativa", func: () => downloadWithAlternativeAPI(video.url) }
      // Método de scraping deshabilitado hasta implementación completa
    ];

    // Probar cada método hasta que uno funcione
    for (let i = 0; i < downloadMethods.length; i++) {
      const method = downloadMethods[i];
      console.log(`\n--- Probando ${method.name} (${i + 1}/${downloadMethods.length}) ---`);
      
      try {
        const result = await method.func();
        
        if (result.success && result.downloadUrl) {
          console.log(`🎉 ¡ÉXITO con ${method.name}!`);
          console.log("URL de descarga obtenida:", result.downloadUrl);
          
          // Verificar que la URL de descarga sea válida
          const testResponse = await fetch(result.downloadUrl, { method: 'HEAD', timeout: 5000 });
          if (!testResponse.ok) {
            console.log(`⚠️ URL inválida de ${method.name}, continuando...`);
            continue;
          }
          
          return {
            success: true,
            downloadUrl: result.downloadUrl,
            title: video.title,
            artist: video.author.name,
            duration: video.timestamp,
            thumbnail: video.thumbnail,
            youtubeUrl: video.url,
            method: method.name,
            views: video.views
          };
        }
        
        console.log(`❌ ${method.name} no retornó resultado válido`);
      } catch (error) {
        console.error(`❌ Error con ${method.name}:`, error.message);
        continue;
      }
    }

    // Si llegamos aquí, todos los métodos fallaron
    throw new Error(
      'Todos los métodos de descarga fallaron. ' +
      'Las APIs podrían estar temporalmente no disponibles o el video podría tener restricciones.'
    );

  } catch (error) {
    console.error("💥 Error general en searchAndDownload:", error.message);
    return { success: false, error: error.message };
  }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`*🎵 Descargador de Audio Completo*\n\n*Ejemplo:* ${usedPrefix + command} Bad Bunny Tití Me Preguntó`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎵 COMANDO AUD - DESCARGA COMPLETA");
  console.log("=".repeat(50));
  console.log("Búsqueda solicitada:", text);
  console.log("Usuario:", m.pushName || "Desconocido");

  // Reacción inicial
  await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

  try {
    // Buscar metadata en Apple Music (opcional, solo para info extra)
    console.log("\n📱 Buscando metadata en Apple Music...");
    const appleResults = await searchAppleMusic(text);
    const trackInfo = appleResults.length > 0 ? appleResults[0] : null;
    
    if (trackInfo) {
      console.log("✅ Metadata encontrada:", trackInfo.title, "por", trackInfo.artist);
    } else {
      console.log("ℹ️ No se encontró metadata en Apple Music, solo usaremos YouTube");
    }

    // Cambiar reacción a descarga
    await conn.sendMessage(m.chat, { react: { text: "⬇️", key: m.key } });

    // Iniciar proceso de descarga
    console.log("\n🎯 Iniciando descarga de audio completo...");
    const downloadResult = await searchAndDownload(text);
    
    if (!downloadResult.success) {
      console.log("💥 DESCARGA FALLÓ");
      console.log("Error:", downloadResult.error);
      
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply(
        `❌ *No se pudo descargar el audio completo*\n\n` +
        `*Error:* ${downloadResult.error}\n\n` +
        `*💡 Sugerencias:*\n` +
        `• Intenta con un término más específico\n` +
        `• Incluye el nombre del artista y canción\n` +
        `• Verifica que la canción exista en YouTube\n` +
        `• Prueba en unos minutos\n\n` +
        `*Ejemplo:* ${usedPrefix + command} Shakira La La La`
      );
    }

    console.log("🎉 ¡DESCARGA EXITOSA!");
    console.log("Método usado:", downloadResult.method);
    console.log("URL final:", downloadResult.downloadUrl);

    // Preparar información final
    const finalInfo = {
      title: trackInfo?.title || downloadResult.title,
      artist: trackInfo?.artist || downloadResult.artist,
      album: trackInfo?.album || 'YouTube',
      artwork: trackInfo?.artwork || downloadResult.thumbnail,
      duration: trackInfo ? 
        `${Math.floor(trackInfo.duration / 60000)}:${String(Math.floor((trackInfo.duration % 60000) / 1000)).padStart(2, '0')}` : 
        downloadResult.duration,
      genre: trackInfo?.genre || 'Música'
    };

    // Mensaje de información
    const infoMessage = {
      image: { url: finalInfo.artwork },
      caption:
        `🎵 *Audio Completo Descargado*\n\n` +
        `📝 *Título:* ${finalInfo.title}\n` +
        `🎤 *Artista:* ${finalInfo.artist}\n` +
        `💿 *Álbum:* ${finalInfo.album}\n` +
        `⏰ *Duración:* ${finalInfo.duration}\n` +
        `🎭 *Género:* ${finalInfo.genre}\n` +
        `👁️ *Vistas:* ${downloadResult.views ? downloadResult.views.toLocaleString() : 'N/A'}\n` +
        `⚙️ *Método:* ${downloadResult.method}\n` +
        `📱 *Fuente:* ${trackInfo ? 'Apple Music + YouTube' : 'YouTube'}\n\n` +
        `✅ *Audio completo - Sin límite de tiempo*\n\n` +
        `> @sxnt - ʟᴏᴄᴀʟ - 𝟢𝟨`,
      contextInfo: {
        externalAdReply: {
          title: finalInfo.title,
          body: `${finalInfo.artist} • Audio Completo`,
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

    // Enviar archivo de audio completo
    console.log("📤 Enviando archivo de audio...");
    const audioMessage = {
      audio: { url: downloadResult.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${finalInfo.title} - ${finalInfo.artist}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: finalInfo.title,
          body: `${finalInfo.artist} • Audio Completo`,
          mediaType: 2,
          thumbnailUrl: finalInfo.artwork
        }
      }
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });
    
    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    
    console.log("🎉 COMANDO COMPLETADO EXITOSAMENTE");
    console.log("=".repeat(50));

  } catch (error) {
    console.error("\n💥 ERROR GENERAL:");
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);
    
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    
    return m.reply(
      `💥 *Error inesperado*\n\n` +
      `*Detalle:* ${error.message}\n\n` +
      `*🔧 Posibles soluciones:*\n` +
      `• Reintentar en unos minutos\n` +
      `• Usar un término más específico\n` +
      `• Verificar conexión a internet\n` +
      `• Reportar al administrador si persiste\n\n` +
      `*Ejemplo:* ${usedPrefix + command} Karol G Bichota`
    );
  }
};

handler.help = ['aud'];
handler.tags = ['downloader'];
handler.command = /^(aud)$/i;
handler.register = true;

export default handler;
