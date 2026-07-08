// Quick MongoDB connection test.
// Usage:  node scripts/test-db.mjs
// Reads MONGODB_URI from .env.local, connects, pings, lists collections.
// Never prints the connection string / password.
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';

function loadEnv() {
  const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();
const uri = process.env.MONGODB_URI;
if (!uri) { console.error('❌ MONGODB_URI not set in .env.local'); process.exit(1); }

const host = uri.includes('mongodb+srv') ? 'Atlas (cloud)' : 'local (127.0.0.1)';
console.log(`Connecting to ${host} …`);

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  const admin = mongoose.connection.db.admin();
  await admin.ping();
  const cols = await mongoose.connection.db.listCollections().toArray();
  console.log('✅ Connected & ping OK');
  console.log('   Database:', mongoose.connection.name);
  console.log('   Collections:', cols.length ? cols.map(c => c.name).join(', ') : '(none yet)');
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
}
