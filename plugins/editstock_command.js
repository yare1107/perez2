// ARCHIVO: editstock.js
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
  // SOLO EL OWNER PUEDE EDITAR STOCK
  if (!isOwner) {
    return m.reply('❌ *Solo el propietario del bot puede editar stock*');
  }

  const stock = readStock();
  
  if (!text) {
    if (Object.keys(stock).length === 0) {
      return m.reply(`📦 *No hay stock para editar*\n\nPrimero crea stock con: *${usedPrefix}stock <nombre> <contenido>*`);
    }
    
    let stockList = '📝 *STOCK DISPONIBLE PARA EDITAR*\n\n';
    for (const key of Object.keys(stock)) {
      stockList += `🔸 ${key}\n`;
    }
    stockList += `\n*Uso:* ${usedPrefix + command} <nombre> <nuevo contenido>`;
    
    return m.reply(stockList);
  }
  
  // Dividir el texto en nombre y contenido
  const args = text.split(' ');
  const name = args[0].toLowerCase();
  const newContent = args.slice(1).join(' ');
  
  if (!newContent) {
    return m.reply(`❌ *Formato incorrecto*\n\nUsa: *${usedPrefix + command} <nombre> <nuevo contenido>*\n\n*Ejemplo:* ${usedPrefix + command} productos Nueva lista actualizada`);
  }
  
  // Verificar si existe el stock
  if (!stock[name]) {
    const availableStock = Object.keys(stock);
    let message = `❌ *Stock "${name}" no encontrado*\n\n`;
    
    if (availableStock.length > 0) {
      message += '*Stock disponible:*\n';
      availableStock.forEach(item => {
        message += `🔸 ${item}\n`;
      });
    } else {
      message += 'No hay stock creado aún.';
    }
    
    return m.reply(message);
  }
  
  // Guardar contenido anterior para mostrar
  const oldContent = stock[name].content;
  
  // Actualizar el stock
  stock[name].content = newContent;
  stock[name].updatedAt = new Date().toISOString();
  
  if (writeStock(stock)) {
    let response = `✅ *Stock "${name}" actualizado exitosamente*\n\n`;
    response += `📝 *Contenido anterior:*\n${oldContent}\n\n`;
    response += `📝 *Contenido nuevo:*\n${newContent}`;
    
    m.reply(response);
  } else {
    m.reply('❌ Error al actualizar el stock');
  }
};

handler.help = ['editstock'];
handler.tags = ['tools'];
handler.command = /^(editstock|stockedit)$/i;
handler.owner = true; // Solo el propietario puede usar este comando

export default handler;
