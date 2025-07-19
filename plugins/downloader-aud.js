import fetch from "node-fetch";
import yts from "yt-search";

// APIs actualizadas y funcionales
const APIs = {
  // API principal para YouTube to MP3
  primary: "https://api.cobalt.tools/api/json",
  // API de respaldo 1 - YouTube downloader alternativo
  backup1: "https://api.y2mate.com/v2/download",
  // API de respaldo 2 - usando yt-dlp style
  backup2: "https://yt-api.p.rapidapi.com/dl"
};

// Función para buscar en Apple Music usando scraping ligero
const searchAppleMusic = async (query) => {
  try {
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=5`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results.map(item => ({
        title: item.trackName || 'Título desconocido',
        artist: item.artistName || 'Artista desconocido',
        album: item.collectionName || 'Álbum desconocido',
        artwork: item.artworkUrl100?.replace('100x100', '500x500') || null,
        preview: item.previewUrl || null,
        duration: item.trackTimeMillis || null,
        appleUrl: item.trackViewUrl || null,
        genre: item.primaryGenreName || 'Género desconocido'
      }));
    }
    return [];
  } catch (error) {
    console.error("Error buscando en Apple Music:", error.message);
    return [];
  }
};

// Función mejorada para descargar desde YouTube usando Cobalt
const downloadFromCobalt = async (youtubeUrl) => {
  try {
    const response = await fetch(APIs.primary, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        url: youtubeUrl,
        vCodec: "h264",
        vQuality: "720",
        aFormat: "mp3",
        filenamePattern: "classic",
        isAudioOnly: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === "success" && data.url) {
      return {
        success: true,
        downloadUrl: data.url,
        title: data.filename || 'Audio'
      };
    }
    return { success: false, error: data.text || 'Error desconocido' };
  } catch (error) {
    console.error("Error con Cobalt API:", error.message);
    return { success: false, error: error.message };
  }
};

// Función de respaldo usando yt-dlp style API
const downloadFromYtDlp = async (youtubeUrl) => {
  try {
    // Usando una API pública alternativa
    const apiUrl = `https://api.vevioz.com/api/button/mp3/${encodeURIComponent(youtubeUrl)}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.success && data.url) {
      return {
        success: true,
        downloadUrl: data.url,
        title: data.title || 'Audio'
      };
    }
    return { success: false, error: 'No se pudo obtener URL de descarga' };
  } catch (error) {
    console.error("Error con API de respaldo:", error.message);
    return { success: false, error: error.message };
  }
};

// Función principal para buscar y descargar audio
const searchAndDownload = async (query) => {
  try {
    // Buscar en YouTube
    console.log("Buscando en YouTube:", query);
    const searchResults = await yts(query);
    
    if (!searchResults || !searchResults.videos || !searchResults.videos.length) {
      return { success: false, error: 'No se encontraron resultados en YouTube' };
    }

    const video = searchResults.videos[0];
    console.log("Video encontrado:", video.title);

    // Intentar descargar con Cobalt
    let downloadResult = await downloadFromCobalt(video.url);
    
    // Si falla, intentar con la API de respaldo
    if (!downloadResult.success) {
      console.log("Cobalt falló, intentando con API de respaldo...");
      downloadResult = await downloadFromYtDlp(video.url);
    }

    if (downloadResult.success) {
      return {
        success: true,
        downloadUrl: downloadResult.downloadUrl,
        title: video.title,
        artist: video.author.name,
        duration: video.timestamp,
        thumbnail: video.thumbnail,
        youtubeUrl: video.url
      };
    }

    return { success: false, error: downloadResult.error || 'Error desconocido en descarga' };
  } catch (error) {
    console.error("Error en searchAndDownload:", error.message);
    return { success: false, error: error.message };
  }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`°Ejemplo *${usedPrefix + command} Mi Niña Ozuna*`);
  }

  // Enviar reacción de carga
  await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

  try {
    console.log("Iniciando búsqueda para:", text);
    
    // Primero buscar en Apple Music para obtener información detallada
    const appleResults = await searchAppleMusic(text);
    let trackInfo = null;
    
    if (appleResults.length > 0) {
      trackInfo = appleResults[0];
      console.log("Encontrado en Apple Music:", trackInfo.title);
    }

    // Cambiar reacción a descarga
    await conn.sendMessage(m.chat, { react: { text: "⬇️", key: m.key } });

    // Buscar y descargar desde YouTube
    const downloadResult = await searchAndDownload(text);
    
    if (!downloadResult.success) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply(`Error: ${downloadResult.error}\nIntenta con otro término de búsqueda.`);
    }

    console.log("Descarga exitosa, URL:", downloadResult.downloadUrl);

    // Usar información de Apple Music si está disponible, sino usar la de YouTube
    const finalTrackInfo = {
      title: trackInfo?.title || downloadResult.title,
      artist: trackInfo?.artist || downloadResult.artist,
      album: trackInfo?.album || 'YouTube',
      artwork: trackInfo?.artwork || downloadResult.thumbnail,
      duration: trackInfo?.duration ? 
        `${Math.floor(trackInfo.duration / 60000)}:${String(Math.floor((trackInfo.duration % 60000) / 1000)).padStart(2, '0')}` : 
        downloadResult.duration,
      genre: trackInfo?.genre || 'Música'
    };

    // Enviar información del track
    const infoMessage = {
      image: { url: finalTrackInfo.artwork || 'https://via.placeholder.com/500x500/1e1e1e/ffffff?text=🎵' },
      caption:
        `🎵 *${finalTrackInfo.title}*\n\n` +
        `🗣️ *Artista:* ${finalTrackInfo.artist}\n` +
        `💿 *Álbum:* ${finalTrackInfo.album}\n` +
        `⏱️ *Duración:* ${finalTrackInfo.duration}\n` +
        `🎭 *Género:* ${finalTrackInfo.genre}\n` +
        `📱 *Fuente:* ${trackInfo ? 'Apple Music + YouTube' : 'YouTube'}\n\n` +
        `> @sxnt - ʟᴏᴄᴀʟ - 𝟢𝟨`,
      contextInfo: {
        externalAdReply: {
          title: finalTrackInfo.title,
          body: `${finalTrackInfo.artist} • ${finalTrackInfo.album}`,
          mediaType: 2,
          mediaUrl: downloadResult.youtubeUrl,
          thumbnailUrl: finalTrackInfo.artwork,
          showAdAttribution: true
        }
      }
    };

    await conn.sendMessage(m.chat, infoMessage);

    // Cambiar reacción a enviando
    await conn.sendMessage(m.chat, { react: { text: "📤", key: m.key } });

    // Enviar el archivo de audio
    const audioMessage = {
      audio: { url: downloadResult.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${finalTrackInfo.title} - ${finalTrackInfo.artist}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: finalTrackInfo.title,
          body: finalTrackInfo.artist,
          mediaType: 2,
          thumbnailUrl: finalTrackInfo.artwork
        }
      }
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });
    
    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error general:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply(`Error inesperado: ${error.message}\nIntenta nuevamente en unos momentos.`);
  }
};

handler.help = ['aud'];
handler.tags = ['downloader'];
handler.command = /^(aud)$/i;
handler.register = true;

export default handler;
