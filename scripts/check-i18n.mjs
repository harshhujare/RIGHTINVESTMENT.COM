import fs from 'node:fs';
import path from 'node:path';

const messagesDir = path.resolve(process.cwd(), 'messages');
const enPath = path.join(messagesDir, 'en.json');
const mrPath = path.join(messagesDir, 'mr.json');

function flatten(obj, prefix = '') {
  const out = new Map();
  if (Array.isArray(obj)) {
    out.set(prefix, obj);
    obj.forEach((item, index) => {
      for (const [k, v] of flatten(item, `${prefix}[${index}]`)) {
        out.set(k, v);
      }
    });
    return out;
  }
  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (value !== null && typeof value === 'object') {
        for (const [k, v] of flatten(value, nextKey)) {
          out.set(k, v);
        }
      } else {
        out.set(nextKey, value);
      }
    }
    return out;
  }
  out.set(prefix, obj);
  return out;
}

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const mr = JSON.parse(fs.readFileSync(mrPath, 'utf8'));

const enFlat = flatten(en);
const mrFlat = flatten(mr);

const missingInMr = [...enFlat.keys()].filter((k) => !mrFlat.has(k));
const extraInMr = [...mrFlat.keys()].filter((k) => !enFlat.has(k));
const emptyEn = [...enFlat.entries()]
  .filter(([, v]) => typeof v === 'string' && v.trim() === '')
  .map(([k]) => k);
const emptyMr = [...mrFlat.entries()]
  .filter(([, v]) => typeof v === 'string' && v.trim() === '')
  .map(([k]) => k);

let hasError = false;
if (missingInMr.length > 0) {
  console.error('Missing keys in mr.json:', missingInMr);
  hasError = true;
}
if (extraInMr.length > 0) {
  console.error('Extra keys in mr.json:', extraInMr);
  hasError = true;
}
if (emptyEn.length > 0) {
  console.error('Empty string values in en.json:', emptyEn);
  hasError = true;
}
if (emptyMr.length > 0) {
  console.error('Empty string values in mr.json:', emptyMr);
  hasError = true;
}

if (hasError) {
  process.exit(1);
}

console.log(`i18n parity check passed: ${enFlat.size} keys verified across en.json and mr.json.`);
