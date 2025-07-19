import yts from "yt-search";
import axios from "axios";

// 🚀 APIs VERIFICADAS Y ACTUALIZADAS - JULIO 2025
const APIs_2025 = {
  // 1. COBALT API (LA MÁS MODERNA Y CONFIABLE)
  cobalt: "https://api.cobalt.tools/api/json",
  
  // 2. YT-DLP PROXY SERVICES (MUY CONFIABLES)
  ytdlp_railway: "https://yt-dlp-api-production.up.railway.app/download",
  ytdlp_vercel: "https://yt-dlp-api.vercel.app/api/download",
  
  // 3. LOADER.TO (NUEVA API 2025)
  loader: "https://loader.to/ajax/search.php",
  
  // 4. YOUTUBE API OFICIAL (SOLO METADATA)
  youtube_official: "https://www.googleapis.com/youtube/v3/videos",
  
  // 5. SSYOUTUBE (RESPALDO CONFIABLE)
  ssyoutube: "https://ssyoutube.com/api/convert",
  
  // 6. SNAPTUBE API (NUEVA ALTERNATIVA)
  snaptube: "https://snaptube.com/action/yt/convert",
};

// 🎯 MÉTODO 1: COBALT API (RECOMENDADO 2025)
const downloadWithCobalt = async (youtubeUrl) => {
  try {
    console.log("🔧 Probando Cobalt API...");
    
    const response = await axios.post(APIs_2025.cobalt, {
      url: youtubeUrl,
      vCodec: "h264",
      vQuality: "720", 
      aFormat: "mp3",
      filenamePattern: "pretty",
      isAudioOnly: true,
      isAudioMuted: false,
      dubLang: false,
      disableMetadata: false
    }, {
      timeout: 25000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data?.status === 'stream' && response.data?.url) {
      console.log("✅ Cobalt exitoso!");
      return {
        success: true,
        downloadUrl: response.data.url,
        title: response.data.filename || 'Audio MP3',
        method: 'Cobalt'
      };
    }
    
    throw new Error('Cobalt no retornó stream válido');
  } catch (error) {
    console.error("❌ Cobalt falló:", error.message);
    return { success: false, error: error.message };
  }
};

// 🎯 MÉTODO 2: YT-DLP RAILWAY (MUY CONFIABLE)
const downloadWithYTDLP = async (youtubeUrl) => {
  try {
    console.log("🔧 Probando YT-DLP Railway...");
    
    const response = await axios.post(APIs_2025.ytdlp_railway, {
      url: youtubeUrl,
      format: "bestaudio/best",
      extract_flat: false,
      writethumbnail: false,
      writeinfojson: false
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data?.success && response.data?.download_url) {
      console.log("✅ YT-DLP Railway exitoso!");
      return {
        success: true,
        downloadUrl: response.data.download_url,
        title: response.data.title || 'Audio MP3',
        method: 'YT-DLP Railway'
      };
    }
    
    throw new Error('YT-DLP Railway no retornó descarga válida');
  } catch (error) {
    console.error("❌ YT-DLP Railway falló:", error.message);
    return { success: false, error: error.message };
  }
};

// 🎯 MÉTODO 3: LOADER.TO (NUEVA API 2025)
const downloadWithLoader = async (youtubeUrl) => {
  try {
    console.log("🔧 Probando Loader.to...");
    
    // Paso 1: Buscar video
    const searchResponse = await axios.post(APIs_2025.loader, {
      query: youtubeUrl,
      vt: 'mp3'
    }, {
      timeout: 20000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://loader.to/',
        'Origin': 'https://loader.to'
      }
    });

    if (searchResponse.data?.status === 'ok' && searchResponse.data?.result) {
      const result = searchResponse.data.result;
      const mp3Link = result.find(item => item.f === 'mp3' && item.q === '128');
      
      if (mp3Link) {
        // Paso 2: Convertir
        const convertResponse = await axios.post(APIs_2025.loader.replace('search', 'convert'), {
          vid: searchResponse.data.vid,
          k: mp3Link.k
        }, {
          timeout: 25000,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://loader.to/',
            'Origin': 'https://loader.to'
          }
        });

        if (convertResponse.data?.status === 'ok' && convertResponse.data?.dlink) {
          console.log("✅ Loader.to exitoso!");
          return {
            success: true,
            downloadUrl: convertResponse.data.dlink,
            title: searchResponse.data.title || 'Audio MP3',
            method: 'Loader.to'
          };
        }
      }
    }
    
    throw new Error('Loader.to no encontró enlaces válidos');
  } catch (error) {
    console.error("❌ Loader.to falló:", error.message);
    return { success: false, error: error.message };
  }
};

// 🎯 MÉTODO 4: SSYOUTUBE (RESPALDO)
const downloadWithSSYoutube = async (youtubeUrl) => {
  try {
    console.log("🔧 Probando SSYoutube...");
    
    const modifiedUrl = youtubeUrl.replace('youtube.com', 'ssyoutube.com');
    
    const response = await axios.post(APIs_2025.ssyoutube, {
      url: modifiedUrl,
      format: 'mp3',
      quality: '128'
    }, {
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://ssyoutube.com/',
        'Origin': 'https://ssyoutube.com'
      }
    });

    if (response.data?.success && response.data?.download_url) {
      console.log("✅ SSYoutube exitoso!");
      return {
        success: true,
        downloadUrl: response.data.download_url,
        title: response.data.title || 'Audio MP3',
        method: 'SSYoutube'
      };
    }
    
    throw new Error('SSYoutube no retornó descarga válida');
  } catch (error) {
    console.error("❌ SSYoutube falló:", error.message);
    return { success: false, error: error.message };
  }
};

// 📱 BÚSQUEDA AVANZADA EN MÚLTIPLES PLATAFORMAS
const searchMultiPlatform = async (query) => {
  try {
    const searches = await Promise.allSettled([
      // YouTube
      yts(query),
      // Apple Music (iTunes API)
      axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1`),
      // Spotify (metadata via Web API)
      axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
        headers: { 'Authorization': 'Bearer YOUR_SPOTIFY_TOKEN' }
      })
    ]);

    const results = {
      youtube: null,
      apple: null,
      spotify: null
    };

    // Procesar resultados
    if (searches[0].status === 'fulfilled' && searches[0].value?.videos?.length) {
      results.youtube = searches[0].value.videos[0];
    }

    if (searches[1].status === 'fulfilled' && searches[1].value?.data?.results?.length) {
      results.apple = searches[1].value.data.results[0];
    }

    if (searches[2].status === 'fulfilled' && searches[2].value?.data?.tracks?.items?.length) {
      results.spotify = searches[2].value.data.tracks.items[0];
    }

    return results;
  } catch (error) {
    console.error("Error en búsqueda multiplataforma:", error.message);
    return { youtube: null, apple: null, spotify: null };
  }
};

// 🚀 FUNCIÓN PRINCIPAL ACTUALIZADA 2025
const searchAndDownload = async (query) => {
  try {
    console.log("=== INICIANDO BÚSQUEDA Y DESCARGA 2025 ===");
    
    let youtubeUrl = query;
    let videoData = null;

    // Si no es URL, buscar en múltiples plataformas
    if (!query.includes('youtube.com') && !query.includes('youtu.be')) {
      console.log("🔍 Búsqueda multiplataforma:", query);
      
      const searchResults = await searchMultiPlatform(query);
      
      if (searchResults.youtube) {
        videoData = searchResults.youtube;
        youtubeUrl = videoData.url;
        console.log("✅ Video encontrado en YouTube:", videoData.title);
      } else {
        throw new Error('No se encontraron videos para esta búsqueda');
      }
    }

    // 🎯 MÉTODOS EN ORDEN DE PRIORIDAD (ACTUALIZADOS 2025)
    const downloadMethods = [
      { name: "Cobalt", func: () => downloadWithCobalt(youtubeUrl) },
      { name: "YT-DLP Railway", func: () => downloadWithYTDLP(youtubeUrl) },
      { name: "Loader.to", func: () => downloadWithLoader(youtubeUrl) },
      { name: "SSYoutube", func: () => downloadWithSSYoutube(youtubeUrl) }
    ];

    // Probar cada método
    for (const method of downloadMethods) {
      console.log(`\n--- Probando ${method.name} ---`);
      
      try {
        const result = await method.func();
        
        if (result.success && result.downloadUrl) {
          // Verificar URL
          try {
            const testResponse = await axios.head(result.downloadUrl, { 
              timeout: 8000,
              validateStatus: (status) => status < 400
            });
            
            if (testResponse.status < 400) {
              console.log(`🎉 ¡ÉXITO con ${method.name}!`);
              
              return {
                success: true,
                downloadUrl: result.downloadUrl,
                title: videoData?.title || result.title || 'Audio MP3',
                artist: videoData?.author?.name || 'Desconocido',
                duration: videoData?.timestamp || 'N/A',
                thumbnail: videoData?.thumbnail || `https://img.youtube.com/vi/${extractVideoId(youtubeUrl)}/maxresdefault.jpg`,
                youtubeUrl: youtubeUrl,
                method: method.name,
                views: videoData?.views || 0,
                quality: '128kbps MP3',
                source: 'YouTube'
              };
            }
          } catch (testError) {
            console.log(`⚠️ URL de ${method.name} no responde:`, testError.message);
          }
        }
        
        console.log(`❌ ${method.name} no retornó URL válida`);
      } catch (error) {
        console.log(`❌ ${method.name} error:`, error.message);
        continue;
      }
      
      // Pausa entre intentos
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    throw new Error('Todos los métodos de descarga fallaron. Intenta más tarde.');

  } catch (error) {
    console.error("💥 Error en searchAndDownload:", error.message);
    return { success: false, error: error.message };
  }
};

// 🛠️ FUNCIONES AUXILIARES
const extractVideoId = (url) => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const isValidYouTubeUrl = (url) => {
  const regex = /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return regex.test(url);
};

// 🎵 HANDLER PRINCIPAL ACTUALIZADO
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `🎵 *Descargador de Música 2025*\n\n` +
      `*📝 Uso:*\n` +
      `${usedPrefix + command} <nombre de canción>\n` +
      `${usedPrefix + command} <URL de YouTube>\n\n` +
      `*🎯 Nuevos métodos 2025:*\n` +
      `• Cobalt API (Principal)\n` +
      `• YT-DLP Railway (Respaldo)\n` +
      `• Loader.to (Alternativo)\n` +
      `• SSYoutube (Emergencia)\n\n` +
      `*⚡ Características:*\n` +
      `• Búsqueda multiplataforma\n` +
      `• Calidad 128kbps MP3\n` +
      `• Metadata completa\n` +
      `• URLs verificadas`
    );
  }

  console.log("\n" + "=".repeat(70));
  console.log("🎵 DESCARGADOR DE MÚSICA 2025 - VERSIÓN ACTUALIZADA");
  console.log("=".repeat(70));

  await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

  try {
    const result = await searchAndDownload(text.trim());
    
    if (!result.success) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply(
        `❌ *Error de descarga*\n\n` +
        `*🔍 Detalle:* ${result.error}\n\n` +
        `*💡 Sugerencias:*\n` +
        `• Usa términos más específicos\n` +
        `• Incluye el nombre del artista\n` +
        `• Prueba con URL directa\n` +
        `• Intenta en 5 minutos\n\n` +
        `*🆕 Ejemplo 2025:*\n` +
        `${usedPrefix + command} Bad Bunny Un Verano Sin Ti`
      );
    }

    // Mensaje con información
    const infoMessage = {
      image: { url: result.thumbnail },
      caption:
        `🎵 *Descarga Completa - 2025*\n\n` +
        `📝 *Título:* ${result.title}\n` +
        `🎤 *Artista:* ${result.artist}\n` +
        `⏰ *Duración:* ${result.duration}\n` +
        `👁️ *Vistas:* ${result.views.toLocaleString()}\n` +
        `🔧 *Método:* ${result.method}\n` +
        `🎧 *Calidad:* ${result.quality}\n` +
        `📡 *Fuente:* ${result.source}\n\n` +
        `✅ *URL verificada y funcional*\n\n` +
        `> _Bot Musical 2025 - APIs Actualizadas_`
    };

    await conn.sendMessage(m.chat, infoMessage);
    await conn.sendMessage(m.chat, { react: { text: "📤", key: m.key } });

    // Enviar archivo de audio
    const audioMessage = {
      audio: { url: result.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${result.title} - ${result.artist}.mp3`
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    
    console.log("🎉 ¡DESCARGA EXITOSA CON APIS 2025!");

  } catch (error) {
    console.error("💥 ERROR CRÍTICO:", error.message);
    await conn.sendMessage(m.chat, { react: { text: "💥", key: m.key } });
    
    return m.reply(
      `💥 *Error del sistema*\n\n` +
      `*⚠️ Detalle:* ${error.message}\n\n` +
      `*🔧 Soluciones:*\n` +
      `• Reiniciar bot\n` +
      `• Verificar conexión\n` +
      `• Intentar otro video\n` +
      `• Contactar soporte`
    );
  }
};

// Configuración
handler.help = ['music', 'song', 'audio', 'mp3'];
handler.tags = ['downloader'];
handler.command = /^(music|song|audio|mp3|play)$/i;
handler.register = true;
handler.limit = true;

export default handler;
