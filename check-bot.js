#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

console.log(chalk.blue.bold('🔍 VERIFICACIÓN DEL BOT\n'))

// Verificar archivos críticos
const criticalFiles = [
  'handler.js',
  'sisked.js', 
  'settings.js',
  'src/database/database.json',
  'package.json'
]

console.log(chalk.yellow('📁 Verificando archivos críticos...'))
let missingFiles = []

for (const file of criticalFiles) {
  if (existsSync(file)) {
    console.log(chalk.green(`✅ ${file}`))
  } else {
    console.log(chalk.red(`❌ ${file} - FALTANTE`))
    missingFiles.push(file)
  }
}

if (missingFiles.length > 0) {
  console.log(chalk.red.bold(`\n⚠️  Archivos faltantes: ${missingFiles.length}`))
} else {
  console.log(chalk.green.bold('\n✅ Todos los archivos críticos están presentes'))
}

// Verificar base de datos
console.log(chalk.yellow('\n🗄️  Verificando base de datos...'))
try {
  const dbPath = 'src/database/database.json'
  if (existsSync(dbPath)) {
    const dbContent = readFileSync(dbPath, 'utf8')
    const db = JSON.parse(dbContent)
    
    if (db && typeof db === 'object') {
      console.log(chalk.green('✅ Base de datos válida'))
      console.log(chalk.cyan(`   - Estructura: ${Object.keys(db).join(', ')}`))
    } else {
      console.log(chalk.red('❌ Base de datos inválida'))
    }
  } else {
    console.log(chalk.red('❌ Base de datos no encontrada'))
  }
} catch (error) {
  console.log(chalk.red(`❌ Error al leer base de datos: ${error.message}`))
}

// Verificar configuración
console.log(chalk.yellow('\n⚙️  Verificando configuración...'))
try {
  const settingsPath = 'settings.js'
  if (existsSync(settingsPath)) {
    console.log(chalk.green('✅ Archivo de configuración encontrado'))
  } else {
    console.log(chalk.red('❌ Archivo de configuración no encontrado'))
  }
} catch (error) {
  console.log(chalk.red(`❌ Error al verificar configuración: ${error.message}`))
}

// Verificar plugins
console.log(chalk.yellow('\n🔌 Verificando plugins...'))
try {
  const pluginsDir = 'plugins'
  if (existsSync(pluginsDir)) {
    console.log(chalk.green('✅ Directorio de plugins encontrado'))
  } else {
    console.log(chalk.red('❌ Directorio de plugins no encontrado'))
  }
} catch (error) {
  console.log(chalk.red(`❌ Error al verificar plugins: ${error.message}`))
}

// Verificar package.json
console.log(chalk.yellow('\n📦 Verificando dependencias...'))
try {
  const packagePath = 'package.json'
  if (existsSync(packagePath)) {
    const packageContent = readFileSync(packagePath, 'utf8')
    const packageJson = JSON.parse(packageContent)
    
    console.log(chalk.green('✅ package.json válido'))
    console.log(chalk.cyan(`   - Nombre: ${packageJson.name || 'No especificado'}`))
    console.log(chalk.cyan(`   - Versión: ${packageJson.version || 'No especificada'}`))
    
    if (packageJson.dependencies) {
      console.log(chalk.cyan(`   - Dependencias: ${Object.keys(packageJson.dependencies).length}`))
    }
  } else {
    console.log(chalk.red('❌ package.json no encontrado'))
  }
} catch (error) {
  console.log(chalk.red(`❌ Error al leer package.json: ${error.message}`))
}

// Resumen
console.log(chalk.blue.bold('\n📊 RESUMEN DE VERIFICACIÓN'))
console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'))

if (missingFiles.length === 0) {
  console.log(chalk.green.bold('✅ El bot parece estar configurado correctamente'))
  console.log(chalk.yellow('\n💡 Para diagnosticar problemas específicos:'))
  console.log(chalk.cyan('   1. Ejecuta el bot'))
  console.log(chalk.cyan('   2. Usa /debug en un grupo'))
  console.log(chalk.cyan('   3. Usa /config info para ver configuraciones'))
  console.log(chalk.cyan('   4. Usa /resetconfig all si hay problemas'))
} else {
  console.log(chalk.red.bold('❌ Se encontraron problemas en la configuración'))
  console.log(chalk.yellow('\n🔧 Soluciones:'))
  console.log(chalk.cyan('   1. Verifica que todos los archivos estén presentes'))
  console.log(chalk.cyan('   2. Reinstala las dependencias: npm install'))
  console.log(chalk.cyan('   3. Verifica la estructura de carpetas'))
}

console.log(chalk.blue.bold('\n🎯 Comandos útiles para diagnóstico:'))
console.log(chalk.cyan('   /debug - Diagnóstico completo'))
console.log(chalk.cyan('   /config info - Estado de configuraciones'))
console.log(chalk.cyan('   /resetconfig all - Resetear todo'))
console.log(chalk.cyan('   /unbanchat - Desbanear grupo'))
console.log(chalk.cyan('   /unbanuser @usuario - Desbanear usuario'))

console.log(chalk.blue.bold('\n📖 Para más información, consulta: SOLUCION_PROBLEMAS.md')) 