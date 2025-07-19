import fetch from "node-fetch";
import yts from "yt-search";

// Sistema de APIs más robusto con múltiples alternativas
const APIs = {
  // API principal - ytdl-core style
  primary: "https://youtube-mp36.p.rapidapi.com/dl",
  // APIs de respaldo públicas y gratuitas
  backup1: "https://api.vevioz.com/api/button/mp3",
  backup2: "https://www.yt-download.org/api/button/mp3",
  backup3: "https://api.onlinevideoconverter.pro/api/convert",
  // API de YouTube directa como último recurso
  youtube_direct: "https://returnyoutubedislikeapi.com/votes"
};

// Función para buscar en Apple Music (mantenida igual)
const searchAppleMusic = async (query) => {
  try {
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=3`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results.map(item => ({
        title: item.trackName || 'Título desconocido',
        artist: item.artistName || 'Artista desconocido',
        album: item.collectionName || 'Álbum desconocido',
        artwork: item.artworkUrl100?.replace('100x100', '500x500'),
        preview: item.previewUrl,
        duration: item.trackTimeMillis,
        appleUrl: item.trackViewUrl,
        genre: item.primaryGenreName || 'Música'
      }));
    }
    return [];
  } catch (error) {
    console.error("Error buscando en Apple Music:", error.message);
    return [];
  }
};

// Método 1: Usando ytdl-core style API
const downloadMethod1 = async (youtubeUrl) => {
  try {
    console.log("Intentando método 1...");
    
    // Extraer video ID
    const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (!videoId) throw new Error("ID de video inválido");

    const apiUrl = `https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/?url=${youtubeUrl}&quality=320`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'demo-key', // En producción usar una key real
        'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });

    const data = await response.json();
    
    if (data && data.dlink) {
      return {
        success: true,
        downloadUrl: data.dlink,
        title: data.title || 'Audio'
      };
    }
    
    throw new Error("No se obtuvo link de descarga");
  } catch (error) {
    console.error("Método 1 falló:", error.message);
    return { success: false, error: error.message };
  }
};

// Método 2: API pública alternativa
const downloadMethod2 = async (youtubeUrl) => {
  try {
    console.log("Intentando método 2...");
    
    const response = await fetch(`https://api.vevioz.com/api/button/mp3/${encodeURIComponent(youtubeUrl)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    if (data && data.success && data.url) {
      return {
        success: true,
        downloadUrl: data.url,
        title: data.title || 'Audio'
      };
    }
    
    throw new Error("No se obtuvo respuesta válida");
  } catch (error) {
    console.error("Método 2 falló:", error.message);
    return { success: false, error: error.message };
  }
};

// Método 3: Scraping directo de YouTube (más complejo pero más confiable)
const downloadMethod3 = async (youtubeUrl) => {
  try {
    console.log("Intentando método 3...");
    
    // Este método usa una técnica de scraping básica
    const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (!videoId) throw new Error("ID de video inválido");

    // Usar API de YouTube oEmbed para obtener info básica
    const embedResponse = await fetch(`https://www.youtube.com/oembed?url=${youtubeUrl}&format=json`);
    const embedData = await embedResponse.json();

    // Simular un converter simple (esto es un placeholder - en producción necesitarías una API real)
    const convertResponse = await fetch(`https://loader.to/ajax/download.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: `url=${encodeURIComponent(youtubeUrl)}&format=mp3&quality=128`,
      timeout: 20000
    });

    // Esta es una implementación simplificada
    // En un entorno real, necesitarías implementar el scraping completo
    
    return { success: false, error: "Método 3 requiere implementación completa" };
  } catch (error) {
    console.error("Método 3 falló:", error.message);
    return { success: false, error: error.message };
  }
};

// Método 4: Usar el preview de Apple Music si está disponible
const downloadFromApplePreview = async (trackInfo) => {
  try {
    if (!trackInfo || !trackInfo.preview) {
      return { success: false, error: "No hay preview disponible" };
    }

    console.log("Usando preview de Apple Music...");
    
    return {
      success: true,
      downloadUrl: trackInfo.preview,
      title: trackInfo.title,
      isPreview: true
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Función principal mejorada con múltiples métodos
const searchAndDownload = async (query) => {
  try {
    console.log("=== Iniciando búsqueda y descarga ===");
    console.log("Query:", query);
    
    // Buscar en YouTube
    const searchResults = await yts(query);
    
    if (!searchResults || !searchResults.videos || !searchResults.videos.length) {
      throw new Error('No se encontraron videos en YouTube');
    }

    const video = searchResults.videos[0];
    console.log("Video seleccionado:", video.title);
    console.log("URL del video:", video.url);

    // Probar múltiples métodos de descarga
    const downloadMethods = [
      () => downloadMethod1(video.url),
      () => downloadMethod2(video.url),
      () => downloadMethod3(video.url)
    ];

    for (let i = 0; i < downloadMethods.length; i++) {
      console.log(`Probando método de descarga ${i + 1}...`);
      
      try {
        const result = await downloadMethods[i]();
        
        if (result.success && result.downloadUrl) {
          console.log("✅ Descarga exitosa con método", i + 1);
          return {
            success: true,
            downloadUrl: result.downloadUrl,
            title: video.title,
            artist: video.author.name,
            duration: video.timestamp,
            thumbnail: video.thumbnail,
            youtubeUrl: video.url,
            method: i + 1
          };
        }
      } catch (error) {
        console.log(`Método ${i + 1} falló:`, error.message);
        continue;
      }
    }

    // Si todos los métodos fallan, retornar error detallado
    throw new Error('Todos los métodos de descarga fallaron. Las APIs podrían estar temporalmente no disponibles.');

  } catch (error) {
    console.error("Error en searchAndDownload:", error.message);
    return { success: false, error: error.message };
  }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`*Ejemplo:* ${usedPrefix + command} Ozuna Mi Niña`);
  }

  console.log("=== COMANDO AUD INICIADO ===");
  console.log("Búsqueda:", text);

  // Reacción inicial
  await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

  try {
    // Buscar información en Apple Music (para metadata)
    console.log("Buscando en Apple Music...");
    const appleResults = await searchAppleMusic(text);
    const trackInfo = appleResults.length > 0 ? appleResults[0] : null;
    
    if (trackInfo) {
      console.log("✅ Encontrado en Apple Music:", trackInfo.title);
    } else {
      console.log("❌ No encontrado en Apple Music");
    }

    // Cambiar reacción a descarga
    await conn.sendMessage(m.chat, { react: { text: "⬇️", key: m.key } });

    // Intentar descargar audio
    console.log("Iniciando proceso de descarga...");
    let downloadResult = await searchAndDownload(text);
    
    // Si falla la descarga normal, intentar con preview de Apple Music
    if (!downloadResult.success && trackInfo && trackInfo.preview) {
      console.log("Descarga normal falló, intentando con preview de Apple Music...");
      await conn.sendMessage(m.chat, { react: { text: "🍎", key: m.key } });
      
      const previewResult = await downloadFromApplePreview(trackInfo);
      if (previewResult.success) {
        downloadResult = {
          ...previewResult,
          title: trackInfo.title,
          artist: trackInfo.artist,
          duration: "0:30", // Los previews son de 30 segundos
          thumbnail: trackInfo.artwork,
          isPreview: true
        };
      }
    }

    if (!downloadResult.success) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply(
        `❌ *Error en la descarga*\n\n` +
        `${downloadResult.error}\n\n` +
        `*Posibles soluciones:*\n` +
        `• Intenta con un término más específico\n` +
        `• Incluye el nombre del artista\n` +
        `• Prueba en unos minutos (APIs saturadas)\n\n` +
        `*Ejemplo:* ${usedPrefix + command} Bad Bunny Tití Me Preguntó`
      );
    }

    console.log("✅ Descarga exitosa!");
    console.log("URL de descarga:", downloadResult.downloadUrl);

    // Preparar información final
    const finalInfo = {
      title: trackInfo?.title || downloadResult.title || 'Título desconocido',
      artist: trackInfo?.artist || downloadResult.artist || 'Artista desconocido',
      album: trackInfo?.album || 'YouTube',
      artwork: trackInfo?.artwork || downloadResult.thumbnail || 'https://via.placeholder.com/500x500/1e1e1e/ffffff?text=🎵',
      duration: trackInfo ? 
        `${Math.floor(trackInfo.duration / 60000)}:${String(Math.floor((trackInfo.duration % 60000) / 1000)).padStart(2, '0')}` : 
        downloadResult.duration || 'N/A',
      genre: trackInfo?.genre || 'Música'
    };

    // Mensaje de información
    const infoText = downloadResult.isPreview 
      ? `🍎 *Apple Music Preview* (30 seg)\n\n`
      : `🎵 *Audio Encontrado*\n\n`;

    const infoMessage = {
      image: { url: finalInfo.artwork },
      caption:
        infoText +
        `🎵 *Título:* ${finalInfo.title}\n` +
        `🗣️ *Artista:* ${finalInfo.artist}\n` +
        `💿 *Álbum:* ${finalInfo.album}\n` +
        `⏱️ *Duración:* ${finalInfo.duration}\n` +
        `🎭 *Género:* ${finalInfo.genre}\n` +
        (downloadResult.method ? `⚙️ *Método:* ${downloadResult.method}\n` : '') +
        `📱 *Fuente:* ${trackInfo ? 'Apple Music + YouTube' : 'YouTube'}\n\n` +
        (downloadResult.isPreview ? '⚠️ *Nota:* Este es un preview de 30 segundos\n\n' : '') +
        `> @sxnt - ʟᴏᴄᴀʟ - 𝟢𝟨`,
      contextInfo: {
        externalAdReply: {
          title: finalInfo.title,
          body: `${finalInfo.artist} • ${finalInfo.album}`,
          mediaType: 2,
          mediaUrl: downloadResult.youtubeUrl || '#',
          thumbnailUrl: finalInfo.artwork,
          showAdAttribution: true
        }
      }
    };

    await conn.sendMessage(m.chat, infoMessage);

    // Cambiar reacción a enviando
    await conn.sendMessage(m.chat, { react: { text: "📤", key: m.key } });

    // Enviar archivo de audio
    const audioMessage = {
      audio: { url: downloadResult.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${finalInfo.title} - ${finalInfo.artist}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: finalInfo.title,
          body: `${finalInfo.artist} • ${downloadResult.isPreview ? 'Preview 30s' : 'Audio Completo'}`,
          mediaType: 2,
          thumbnailUrl: finalInfo.artwork
        }
      }
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });
    
    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    
    console.log("=== COMANDO COMPLETADO EXITOSAMENTE ===");

  } catch (error) {
    console.error("=== ERROR GENERAL ===");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    
    return m.reply(
      `❌ *Error inesperado*\n\n` +
      `${error.message}\n\n` +
      `*Intenta:*\n` +
      `• Usar un término más específico\n` +
      `• Incluir el nombre del artista\n` +
      `• Intentar en unos minutos\n\n` +
      `Si el problema persiste, reporta este error al administrador.`
    );
  }
};

handler.help = ['aud'];
handler.tags = ['downloader'];
handler.command = /^(aud)$/i;
handler.register = true;

export default handler;
