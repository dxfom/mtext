import fs from 'fs'
import path from 'path'
import url from 'url'
import peg from 'pegjs'
import acorn from 'acorn'
import cjs_es from 'cjs-es'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const grammer = fs.readFileSync(path.resolve(__dirname, 'mtext.pegjs'), 'utf8')
const code = peg.generate(grammer, { format: 'commonjs', output: 'source' })
cjs_es.transform({ code, parse: acorn.parse }).then(esm => fs.writeFileSync(path.resolve(__dirname, 'mtext.mjs'), esm.code, 'utf8'))
