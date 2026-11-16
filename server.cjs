// Precifica Doce - servidor local
// Serve a interface (pasta www) e grava ingredients.json / receitas.json em disco.
// Uso: npm install && npm start  ->  http://localhost:8000
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const express = require('express');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const ROOT = __dirname;
const WEB_DIR = path.join(ROOT, 'www');
// Os JSONs ficam junto da interface (www/) para também irem para o app Android.
const INGREDIENTES_FILE = path.join(WEB_DIR, 'ingredients.json');
const RECEITAS_FILE = path.join(WEB_DIR, 'receitas.json');
// Compatibilidade: estrutura antiga mantinha ingredients.json na raiz.
const LEGACY_INGREDIENTES = path.join(ROOT, 'ingredients.json');

function resolveIngredientesFile() {
  if (!fs.existsSync(INGREDIENTES_FILE) && fs.existsSync(LEGACY_INGREDIENTES)) return LEGACY_INGREDIENTES;
  return INGREDIENTES_FILE;
}

app.use(express.json({ limit: '2mb' }));

// ---------- utilitários ----------

async function readJson(file, fallback) {
  try {
    const raw = await fsp.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

// Escrita atômica: grava em .tmp e renomeia sobre o destino.
async function writeJson(file, data) {
  const tmp = file + '.tmp';
  const text = JSON.stringify(data, null, 2) + '\n';
  await fsp.writeFile(tmp, text, 'utf8');
  await fsp.rename(tmp, file);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function slugify(text) {
  return String(text).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Validação mínima do catálogo: lista de itens com id/nome/peso/preço.
function sanitizeCatalog(raw) {
  if (!Array.isArray(raw)) throw new Error('O catálogo precisa ser uma lista JSON.');
  const seen = new Set();
  const items = [];
  for (const item of raw) {
    if (!isPlainObject(item)) continue;
    const name = String(item.name || '').trim();
    const packageGrams = Number(item.packageGrams);
    const packagePrice = Number(item.packagePrice);
    if (!name || !Number.isFinite(packageGrams) || packageGrams <= 0 || !Number.isFinite(packagePrice) || packagePrice < 0) continue;
    let id = String(item.id || '').trim() || slugify(name) || ('item-' + items.length);
    while (seen.has(id)) id = id + '-' + items.length;
    seen.add(id);
    items.push({ id, name, packageGrams, packagePrice });
  }
  return items;
}

// Validação das receitas salvas.
function sanitizeRecipes(raw) {
  if (!Array.isArray(raw)) throw new Error('As receitas precisam ser uma lista JSON.');
  const seen = new Set();
  const recipes = [];
  for (const recipe of raw) {
    if (!isPlainObject(recipe)) continue;
    const name = String(recipe.name || '').trim();
    if (!name) continue;
    let id = String(recipe.id || '').trim() || ('receita-' + slugify(name) + '-' + recipes.length);
    while (seen.has(id)) id = id + '-' + recipes.length;
    seen.add(id);
    const overheadRate = Number.isFinite(Number(recipe.overheadRate)) ? Math.max(0, Number(recipe.overheadRate)) : 3.5;
    const items = (Array.isArray(recipe.items) ? recipe.items : [])
      .filter(isPlainObject)
      .map((item, index) => ({
        rowId: String(item.rowId || `row-${index}-${Math.random().toString(36).slice(2, 7)}`),
        catalogId: item.catalogId ? String(item.catalogId) : null,
        name: String(item.name || 'Ingrediente'),
        packageGrams: Math.max(0, Number(item.packageGrams) || 0),
        packagePrice: Math.max(0, Number(item.packagePrice) || 0),
        usedGrams: Math.max(0, Number(item.usedGrams) || 0)
      }));
    recipes.push({
      id,
      name,
      overheadRate,
      items,
      updatedAt: Number(recipe.updatedAt) || Date.now()
    });
  }
  return recipes;
}

// ---------- rotas da API ----------

app.get('/api/ingredients', async (req, res) => {
  try {
    res.json(sanitizeCatalog(await readJson(resolveIngredientesFile(), [])));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/ingredients', async (req, res) => {
  try {
    const items = sanitizeCatalog(req.body);
    await writeJson(resolveIngredientesFile(), items);
    res.json({ ok: true, count: items.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/recipes', async (req, res) => {
  try {
    res.json(sanitizeRecipes(await readJson(RECEITAS_FILE, [])));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/recipes', async (req, res) => {
  try {
    const recipes = sanitizeRecipes(req.body);
    await writeJson(RECEITAS_FILE, recipes);
    res.json({ ok: true, count: recipes.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Interface em www/ primeiro; o build do Vite (dist/) e a raiz ficam como fallback.
const DIST_DIR = path.join(ROOT, 'dist');
app.use(express.static(WEB_DIR, { extensions: ['html'] }));
app.use(express.static(DIST_DIR, { extensions: ['html'] }));
app.use(express.static(ROOT, { extensions: ['html'] }));

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'JSON inválido enviado pelo navegador.' });
  }
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`Precifica Doce rodando em http://localhost:${PORT}`);
  console.log('Arquivos: www/ingredients.json (catálogo) e www/receitas.json (receitas salvas)');
});
