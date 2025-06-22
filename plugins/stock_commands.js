// COMANDO STOCK - Ver/Crear stock
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

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const stock = readStock();
  
  // Si no hay texto, mostrar el stock actual
  if (!text) {
    if (Object.keys(stock).length === 0) {
      return m.reply(`📦 *STOCK VACÍO*\n\nUsa: *${usedPrefix + command} <nombre> <contenido>*\n\n*Ejemplo:* ${usedPrefix + command} productos Lista de productos disponibles`);
    }
    
    let stockList = '📦 *STOCK ACTUAL*\n\n';
    for (const [key, value] of Object.entries(stock)) {
      stockList += `🔸 *${key}:*\n${value.content}\n\n`;
    }
    stockList += `_Para editar usa:_ *${usedPrefix}editstock <nombre> <nuevo contenido>*`;
    
    return m.reply(stockList);
  }
  
  // Dividir el texto en nombre y contenido
  const args = text.split(' ');
  const name = args[0].toLowerCase();
  const content = args.slice(1).join(' ');
  
  if (!content) {
    return m.reply(`❌ *Formato incorrecto*\n\nUsa: *${usedPrefix + command} <nombre> <contenido>*\n\n*Ejemplo:* ${usedPrefix + command} productos Lista de productos disponibles`);
  }
  
  // Guardar en el stock
  stock[name] = {
    content: content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (writeStock(stock)) {
    m.reply(`✅ *Stock "${name}" guardado exitosamente*\n\n📝 *Contenido:*\n${content}`);
  } else {
    m.reply('❌ Error al guardar el stock');
  }
};

handler.help = ['stock'];
handler.tags = ['tools'];
handler.command = /^(stock)$/i;
handler.admin = true; // Solo administradores pueden usar este comando

export default handler;

// ================================================================
// COMANDO EDITSTOCK - Editar stock existente
// ================================================================

let editHandler = async (m, { conn, text, usedPrefix, command }) => {
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

editHandler.help = ['editstock'];
editHandler.tags = ['tools'];
editHandler.command = /^(editstock|stockedit)$/i;
editHandler.admin = true; // Solo administradores pueden usar este comando

// ================================================================
// COMANDO DELSTOCK - Eliminar stock
// ================================================================

let deleteHandler = async (m, { conn, text, usedPrefix, command }) => {
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

deleteHandler.help = ['delstock'];
deleteHandler.tags = ['tools'];
deleteHandler.command = /^(delstock|stockdel)$/i;
deleteHandler.admin = true; // Solo administradores pueden usar este comando

// Exportar todos los handlers
export { handler as default, editHandler, deleteHandler };