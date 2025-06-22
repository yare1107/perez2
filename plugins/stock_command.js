// ARCHIVO: stock.js
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
  const stock = readStock();
  
  // Si no hay texto, mostrar el stock actual (CUALQUIER USUARIO)
  if (!text) {
    if (Object.keys(stock).length === 0) {
      return m.reply(`📦 *STOCK VACÍO*\n\n_No hay productos disponibles en este momento_`);
    }
    
    let stockList = '📦 *STOCK DISPONIBLE*\n\n';
    for (const [key, value] of Object.entries(stock)) {
      stockList += `🔸 *${key}:*\n${value.content}\n\n`;
    }
    stockList += `_Última actualización: ${new Date().toLocaleDateString()}_`;
    
    return m.reply(stockList);
  }
  
  // SOLO EL OWNER PUEDE CREAR/EDITAR STOCK
  if (!isOwner) {
    return m.reply('❌ *Solo el propietario del bot puede crear o editar stock*');
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
// Sin restricciones - cualquiera puede ver el stock

export default handler;
