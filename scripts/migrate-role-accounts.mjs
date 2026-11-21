import fs from 'node:fs';
import { MongoClient } from 'mongodb';

if (fs.existsSync('.env')) process.loadEnvFile('.env');
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required.');
const apply = process.argv.includes('--apply');
const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
try {
  const db = client.db(process.env.MONGODB_DBNAME || 'fixmate-db');
  const users = db.collection('user');
  const duplicates = await users.aggregate([
    { $group: { _id: { email: '$email', role: '$role' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }, { $count: 'count' },
  ]).toArray();
  const invalidRoles = await users.countDocuments({ role: { $nin: ['customer', 'technician', 'admin'] } });
  if (duplicates.length || invalidRoles) throw new Error('Resolve duplicate email/role pairs or invalid roles before migration. No uniqueness constraints were removed.');
  const indexes = await users.indexes();
  const oldIndexes = indexes.filter(index => index.unique && Object.keys(index.key).length === 1 && index.key.email === 1);
  console.log(JSON.stringify({ apply, globalEmailIndexesToReplace: oldIndexes.map(index => index.name) }));
  if (!apply) {
    console.log('Dry run only. Deploy both role-aware applications before running with --apply.');
  } else {
    // Establish the replacement constraint BEFORE removing global uniqueness.
    await users.createIndex({ email: 1, role: 1 }, { unique: true, name: 'user_email_role_uidx' });
    const accounts = db.collection('account');
    const cursor = users.find({}, { projection: { role: 1, id: 1 } });
    for await (const user of cursor) {
      const ids = [user._id, String(user._id), ...(user.id ? [user.id] : [])];
      await accounts.updateMany({ userId: { $in: ids } }, { $set: { accountRole: user.role } });
    }
    await accounts.createIndex({ providerId: 1, accountId: 1, accountRole: 1 }, { unique: true, name: 'account_provider_role_uidx' });
    for (const index of oldIndexes) await users.dropIndex(index.name);
    console.log('Role-scoped account indexes are active. Existing users, credentials, sessions, and roles were preserved.');
  }
} finally {
  await client.close();
}
