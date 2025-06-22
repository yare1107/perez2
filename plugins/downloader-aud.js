import axios from 'axios';
import cheerio from 'cheerio';
import qs from 'qs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`°Ejemplo *${usedPrefix + command} Mi Niña Ozuna*`);
  }

  const appleMusic = {
    search: async (query) => {
      const url = `https://music.apple.com/us/search?term=${encodeURIComponent(query)}`;
      try {
        const { data } = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 10000
        });
        const $ = cheerio.load(data);
        const results = [];
        
        // Múltiples selectores para mayor compatibilidad
        const selectors = [
          '.desktop-search-page .section[data-testid="section-container"] .grid-item',
          '.search-results .grid-item',
          '.lockup'
        ];
        
        for (const selector of selectors) {
          $(selector).each((index, element) => {
            const title = $(element).find('.top-search-lockup__primary__title, .lockup__title, .song-name').text().trim();
            const subtitle = $(element).find('.top-search-lockup__secondary, .lockup__subtitle, .artist-name').text().trim();
            const link = $(element).find('.click-action, a').attr('href');
            
            if (title && link) {
              // Construir URL completa si es necesario
              const fullLink = link.startsWith('http') ? link : `https://music.apple.com${link}`;
              results.push({ title, subtitle, link: fullLink });
            }
          });
          
          if (results.length > 0) break;
        }
        
        return results;
      } catch (error) {
        console.error("Error en búsqueda de Apple Music:", error.message);
        return [];
      }
    }
  };

  const appledown = {
    getData: async (urls) => {
      const url = `https://aaplmusicdownloader.com/api/applesearch.php?url=${encodeURIComponent(urls)}`;
      try {
        const response = await axios.get(url, {
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://aaplmusicdownloader.com/'
          },
          timeout: 15000
        });
        
        if (response.data && typeof response.data === 'object') {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error obteniendo datos de Apple Music Downloader:", error.message);
        return null;
      }
    },

    download: async (url) => {
      try {
        const musicData = await appledown.getData(url);
        if (!musicData || !musicData.name) {
          return { success: false, message: "No se encontraron datos de música." };
        }

        // Validar datos antes de proceder
        const requiredFields = ['name', 'albumname', 'artist', 'thumb', 'duration', 'url'];
        for (const field of requiredFields) {
          if (!musicData[field]) {
            console.warn(`Campo faltante: ${field}`);
          }
        }

        // Codificar datos necesarios
        const dataArray = [
          musicData.name || '',
          musicData.albumname || '',
          musicData.artist || '',
          musicData.thumb || '',
          musicData.duration || '',
          musicData.url || url
        ];
        
        const encodedData = encodeURIComponent(JSON.stringify(dataArray));

        const downloadUrl = 'https://aaplmusicdownloader.com/song.php';
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Origin': 'https://aaplmusicdownloader.com',
          'Referer': 'https://aaplmusicdownloader.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        };

        const response = await axios.post(downloadUrl, `data=${encodedData}`, { 
          headers,
          timeout: 20000
        });
        
        const $ = cheerio.load(response.data);
        
        // Extraer información con múltiples selectores
        const trackName = $('td:contains("Track Name:")').next().text().trim() || 
                         $('[data-label="Track Name"]').text().trim() || 
                         musicData.name;
        
        const albumName = $('td:contains("Album:")').next().text().trim() || 
                         $('[data-label="Album"]').text().trim() || 
                         musicData.albumname;
        
        const artist = $('td:contains("Artist:")').next().text().trim() || 
                      $('[data-label="Artist"]').text().trim() || 
                      musicData.artist;
        
        const thumb = $('figure.image img').attr('src') || 
                     $('.cover-art img').attr('src') || 
                     musicData.thumb;
        
        const duration = $('td:contains("Duration:")').next().text().trim() || 
                        $('[data-label="Duration"]').text().trim() || 
                        musicData.duration;
        
        const token = $('a#download_btn').attr('token') || 
                     $('[data-token]').attr('data-token') ||
                     $('.download-btn').attr('token');

        if (!token) {
          return { success: false, message: "No se pudo obtener el token de descarga." };
        }

        // Obtener enlace de descarga
        const audioUrl = await appledown.getAudio(trackName, artist, musicData.url || url, token);
        
        if (!audioUrl || audioUrl.success === false) {
          return { success: false, message: "No se pudo obtener el enlace de descarga del audio." };
        }

        return {
          success: true,
          name: trackName,
          albumname: albumName,
          artist: artist,
          thumb: thumb,
          duration: duration,
          download: audioUrl
        };
      } catch (error) {
        console.error("Error descargando música de Apple Music:", error.message);
        return { success: false, message: `Error en descarga: ${error.message}` };
      }
    },

    getAudio: async (trackName, artist, urlMusic, token) => {
      const url = 'https://aaplmusicdownloader.com/api/composer/swd.php';
      const data = {
        song_name: trackName || '',
        artist_name: artist || '',
        url: urlMusic || '',
        token: token || ''
      };
      
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://aaplmusicdownloader.com/song.php'
      };
      
      try {
        const response = await axios.post(url, qs.stringify(data), { 
          headers,
          timeout: 30000
        });
        
        if (response.data && response.data.dlink) {
          return response.data.dlink;
        } else if (response.data && response.data.download_url) {
          return response.data.download_url;
        } else {
          console.error("Respuesta inesperada del servidor:", response.data);
          return null;
        }
      } catch (error) {
        console.error("Error obteniendo audio de Apple Music:", error.message);
        return null;
      }
    }
  };

  // Mostrar reacción de carga
  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
  } catch (error) {
    console.error("Error enviando reacción:", error.message);
  }

  try {
    // Buscar resultados
    const searchResults = await appleMusic.search(text);
    if (!searchResults || searchResults.length === 0) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply("No se encontraron resultados para tu búsqueda. Intenta con otros términos.");
    }

    // Descargar la música
    const musicData = await appledown.download(searchResults[0].link);
    if (!musicData.success) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply(`Error: ${musicData.message}`);
    }

    const { name, albumname, artist, thumb, duration, download } = musicData;

    // Validar que tenemos los datos mínimos necesarios
    if (!name || !artist) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply("Error: No se pudieron obtener los datos completos de la canción.");
    }

    // Enviar información detallada con una miniatura
    const infoMessage = {
      image: { url: thumb },
      caption:
        `💎 *Nombre:* ${name}\n` +
        `🗣️ *Artista:* ${artist}\n` +
        `💿 *Álbum:* ${albumname || 'N/A'}\n` +
        `⏱️ *Duración:* ${duration || 'N/A'}\n\n` +
        `> @perez - ʟᴏᴄᴀʟ - 𝟢𝟨`,
      contextInfo: {
        externalAdReply: {
          title: name,
          body: `${artist} • ${albumname || 'Álbum desconocido'}`,
          mediaType: 2,
          mediaUrl: searchResults[0].link,
          thumbnailUrl: thumb,
          showAdAttribution: true
        }
      }
    };

    await conn.sendMessage(m.chat, infoMessage);

    // Validar que tenemos el enlace de descarga
    if (!download) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply("Error: No se pudo obtener el enlace de descarga del audio.");
    }

    // Enviar el audio
    const audioMessage = {
      audio: { url: download },
      mimetype: 'audio/mp4',
      fileName: `${name.replace(/[^\w\s-]/g, '')}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: name,
          body: artist,
          mediaType: 2,
          thumbnailUrl: thumb,
          showAdAttribution: false
        }
      }
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error general en el handler:", error.message);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply(`Error inesperado: ${error.message}`);
  }
};

handler.help = ['aud'];
handler.tags = ['downloader'];
handler.command = /^(aud)$/i;

export default handler;
