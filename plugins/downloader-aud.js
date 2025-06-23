import fetch from "node-fetch";
import yts from "yt-search";

// Múltiples APIs como respaldo
const APIs = {
  // API principal - más confiable
  primary: "https://api.fabdl.com/apple-music/get",
  // API de respaldo 1
  backup1: "https://api.downloadgram.org/apple-music",
  // API de respaldo 2 - usando YouTube como última opción
  backup2: "aHR0cHM6Ly9hcGkudnJlZGVuLndlYi5pZC9hcGkveXRtcDM=" // base64 encoded
};

const decodeBase64 = (encoded) => Buffer.from(encoded, "base64").toString("utf-8");

// Función para buscar en Apple Music usando scraping ligero
const searchAppleMusic = async (query) => {
  try {
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=5`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results.map(item => ({
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName,
        artwork: item.artworkUrl100?.replace('100x100', '500x500'),
        preview: item.previewUrl,
        duration: item.trackTimeMillis,
        appleUrl: item.trackViewUrl,
        genre: item.primaryGenreName
      }));
    }
    return [];
  } catch (error) {
    console.error("Error buscando en Apple Music:", error);
    return [];
  }
};

// Función para descargar usando la API principal
const downloadFromPrimaryAPI = async (appleUrl) => {
  try {
    const response = await fetch(APIs.primary, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({ url: appleUrl })
    });
    
    const data = await response.json();
    
    if (data.success && data.result && data.result.download_url) {
      return {
        success: true,
        downloadUrl: data.result.download_url,
        title: data.result.title,
        artist: data.result.artist,
        duration: data.result.duration
      };
    }
    return { success: false };
  } catch (error) {
    console.error("Error con API principal:", error);
    return { success: false };
  }
};

// Función de respaldo usando YouTube
const downloadFromYouTube = async (title, artist) => {
  try {
    const searchQuery = `${title} ${artist}`;
    const searchResults = await yts(searchQuery);
    
    if (!searchResults || !searchResults.videos.length) {
      return { success: false };
    }

    const video = searchResults.videos[0];
    const apiUrl = decodeBase64(APIs.backup2) + `?url=${encodeURIComponent(video.url)}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.status === 200 && data.result && data.result.download && data.result.download.url) {
      return {
        success: true,
        downloadUrl: data.result.download.url,
        title: data.result.metadata.title,
        artist: data.result.metadata.author.name,
        duration: video.timestamp,
        thumbnail: video.thumbnail
      };
    }
    return { success: false };
  } catch (error) {
    console.error("Error con respaldo de YouTube:", error);
    return { success: false };
  }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`°Ejemplo *${usedPrefix + command} Mi Niña Ozuna*`);
  }

  // Enviar reacción de carga
  conn.sendMessage(m.chat, { react: { text: "🍎", key: m.key } });

  try {
    // Buscar en Apple Music
    const searchResults = await searchAppleMusic(text);
    
    if (!searchResults.length) {
      // Si no hay resultados en Apple Music, buscar en YouTube directamente
      conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });
      
      const ytResults = await yts(text);
      if (!ytResults || !ytResults.videos.length) {
        return m.reply("No se encontraron resultados para tu búsqueda.");
      }

      const video = ytResults.videos[0];
      const downloadResult = await downloadFromYouTube(video.title, video.author.name);
      
      if (!downloadResult.success) {
        return m.reply("Error al obtener el audio. Intenta con otro término de búsqueda.");
      }

      // Enviar información del audio encontrado en YouTube
      const infoMessage = {
        image: { url: video.thumbnail },
        caption:
          `🎵 *Título:* ${downloadResult.title}\n` +
          `🗣️ *Artista:* ${downloadResult.artist}\n` +
          `⏱️ *Duración:* ${downloadResult.duration}\n` +
          `📱 *Fuente:* YouTube\n\n` +
          `> @sxnt - ʟᴏᴄᴀʟ - 𝟢𝟨`,
        contextInfo: {
          externalAdReply: {
            title: downloadResult.title,
            body: `${downloadResult.artist} • YouTube`,
            mediaType: 2,
            mediaUrl: video.url,
            thumbnailUrl: video.thumbnail,
            showAdAttribution: true
          }
        }
      };

      await conn.sendMessage(m.chat, infoMessage);
      
      // Enviar el audio
      const audioMessage = {
        audio: { url: downloadResult.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${downloadResult.title}.mp3`
      };

      await conn.sendMessage(m.chat, audioMessage, { quoted: m });
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      return;
    }

    const track = searchResults[0];
    conn.sendMessage(m.chat, { react: { text: "⬇️", key: m.key } });

    // Intentar descargar desde Apple Music
    let downloadResult = await downloadFromPrimaryAPI(track.appleUrl);
    
    // Si falla la API principal, usar YouTube como respaldo
    if (!downloadResult.success) {
      console.log("API principal falló, usando respaldo de YouTube...");
      downloadResult = await downloadFromYouTube(track.title, track.artist);
    }

    if (!downloadResult.success) {
      return m.reply("Error al descargar el audio. El servicio podría estar temporalmente no disponible.");
    }

    // Preparar información para mostrar
    const artwork = track.artwork || downloadResult.thumbnail || 'https://via.placeholder.com/500x500/1e1e1e/ffffff?text=🎵';
    const duration = track.duration ? `${Math.floor(track.duration / 60000)}:${String(Math.floor((track.duration % 60000) / 1000)).padStart(2, '0')}` : downloadResult.duration || 'N/A';

    // Enviar información detallada
    const infoMessage = {
      image: { url: artwork },
      caption:
        `🍎 *Apple Music*\n\n` +
        `🎵 *Título:* ${track.title}\n` +
        `🗣️ *Artista:* ${track.artist}\n` +
        `💿 *Álbum:* ${track.album || 'N/A'}\n` +
        `⏱️ *Duración:* ${duration}\n` +
        `🎭 *Género:* ${track.genre || 'N/A'}\n\n` +
        `> @sxnt - ʟᴏᴄᴀʟ - 𝟢𝟨`,
      contextInfo: {
        externalAdReply: {
          title: track.title,
          body: `${track.artist} • ${track.album || 'Apple Music'}`,
          mediaType: 2,
          mediaUrl: track.appleUrl,
          thumbnailUrl: artwork,
          showAdAttribution: true
        }
      }
    };

    await conn.sendMessage(m.chat, infoMessage);

    // Enviar el audio
    const audioMessage = {
      audio: { url: downloadResult.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${track.title} - ${track.artist}.mp3`
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error general:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply(`Error inesperado: ${error.message}`);
  }
};

handler.help = ['aud'];
handler.tags = ['downloader'];
handler.command = /^(aud)$/i;

export default handler;
