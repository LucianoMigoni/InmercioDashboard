import { defineConfig, type Plugin } from 'vite'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Tablas guardadas en src/data
const TABLAS = [
  'rubros', 'unidades_medida', 'planes', 'negocios', 'perfiles',
  'negocio_perfiles', 'negocio_telefonos', 'preferencias_notificaciones',
  'suscripciones', 'metodos_pago', 'cobros', 'categorias', 'productos',
  'movimientos',
] as const

// Backend simple que lee y guarda los JSON de datos
function backendJson(): Plugin {
  const dir = path.resolve(__dirname, 'src/data')
  return {
    name: 'backend-json',
    configureServer(server) {
      server.middlewares.use('/api/db', (req, res, next) => {
        if (req.method === 'GET') {
          const db: Record<string, unknown> = {}
          for (const t of TABLAS) {
            db[t] = JSON.parse(readFileSync(path.join(dir, `${t}.json`), 'utf8'))
          }
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(db))
          return
        }
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => (body += chunk))
          req.on('end', () => {
            const db = JSON.parse(body)
            for (const t of TABLAS) {
              writeFileSync(
                path.join(dir, `${t}.json`),
                JSON.stringify(db[t] ?? [], null, 2) + '\n'
              )
            }
            res.end('ok')
          })
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), backendJson()],
  resolve: {
    alias: {
      // Atajo para importar desde src
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    watch: {
      // Evita que la pagina se recargue cada vez que se guardan datos
      ignored: ['**/src/data/*.json'],
    },
  },

  // Archivos que se importan tal cual
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
