import fs from 'node:fs';
import path from 'node:path';
const games=JSON.parse(fs.readFileSync('games.json','utf8'));const ids=new Set();
if(!Array.isArray(games)||!games.length)throw Error('Catalog must be a nonempty array');
for(const g of games){for(const key of ['id','title','description','category','author','entry'])if(typeof g[key]!=='string'||!g[key].trim())throw Error(`Missing ${key}`);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(g.id)||ids.has(g.id))throw Error(`Invalid or duplicate id: ${g.id}`);ids.add(g.id);if(!['Arcade','Exploration'].includes(g.category))throw Error(`Add UI support for category: ${g.category}`);if(g.entry!==`games/${g.id}/index.html`)throw Error(`Invalid entry: ${g.entry}`);if(!fs.existsSync(g.entry))throw Error(`Missing entry: ${g.entry}`);}
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules','_site'].includes(entry.name))continue;const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(file.endsWith('.html')){const html=fs.readFileSync(file,'utf8');for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const url=match[1];if(/^(https?:|data:|mailto:)/.test(url))continue;if(url.startsWith('/'))throw Error(`Root path breaks project Pages: ${file}: ${url}`);if(!fs.existsSync(path.resolve(path.dirname(file),url.split(/[?#]/)[0])))throw Error(`Broken reference: ${file}: ${url}`);}}}}
walk('.');console.log(`Validated ${games.length} games and local HTML references.`);

const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
if(manifest.scope!=='./'||manifest.start_url!=='./'||manifest.orientation!=='landscape')throw Error('PWA must use project scope and landscape orientation');
for(const icon of manifest.icons){if(!fs.existsSync(icon.src))throw Error(`Missing PWA icon: ${icon.src}`);}
