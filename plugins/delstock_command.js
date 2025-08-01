// ARCHIVO: delstock.js
import fs from 'fs';
import path from 'path';

// Archivo donde se guardará el stock
const stockFile = './data/stock.json';

// Función para asegurar que existe el directorio
const ensureDataDir = () => {
  const dataDir = path.dirname(stockFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Función para leer el stock
const readStock = () => {
  try {
    ensureDataDir();
    if (fs.existsSync(stockFile)) {
      const data = fs.readFileSync(stockFile, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Error leyendo stock:', error);
    return {};
  }
};

// Función para escribir el stock
const writeStock = (data) => {
  try {
    ensureDataDir();
    fs.writeFileSync(stockFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error escribiendo stock:', error);
    return false;
  }
};

let handler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
  // SOLO EL OWNER PUEDE ELIMINAR STOCK
  if (!isOwner) {
    return m.reply('❌ *Solo el propietario del bot puede eliminar stock*');
  }

  const stock = readStock();
  
  if (!text) {
    if (Object.keys(stock).length === 0) {
      return m.reply(`📦 *No hay stock para eliminar*`);
    }
    
    let stockList = '🗑️ *STOCK DISPONIBLE PARA ELIMINAR*\n\n';
    for (const key of Object.keys(stock)) {
      stockList += `🔸 ${key}\n`;
    }
    stockList += `\n*Uso:* ${usedPrefix + command} <nombre>`;
    
    return m.reply(stockList);
  }
  
  const name = text.toLowerCase().trim();
  
  // Verificar si existe el stock
  if (!stock[name]) {
    const availableStock = Object.keys(stock);
    let message = `❌ *Stock "${name}" no encontrado*\n\n`;
    
    if (availableStock.length > 0) {
      message += '*Stock disponible:*\n';
      availableStock.forEach(item => {
        message += `🔸 ${item}\n`;
      });
    }
    
    return m.reply(message);
  }
  
  // Guardar contenido para mostrar
  const deletedContent = stock[name].content;
  
  // Eliminar del stock
  delete stock[name];
  
  if (writeStock(stock)) {
    let response = `🗑️ *Stock "${name}" eliminado exitosamente*\n\n`;
    response += `📝 *Contenido eliminado:*\n${deletedContent}`;
    
    m.reply(response);
  } else {
    m.reply('❌ Error al eliminar el stock');
  }
};

handler.help = ['delstock'];
handler.tags = ['tools'];
handler.command = /^(delstock|stockdel)$/i;
handler.owner = true; // Solo el propietario puede usar este comando

export default handler;
