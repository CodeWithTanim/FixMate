import { mongodbAdapter } from "@better-auth/mongo-adapter";
import type { DBAdapter, DBTransactionAdapter, Where } from "@better-auth/core/db/adapter";
import { getAccountRole } from "./account-role";
import { mongoClient, mongoDb } from "./db";

type Query = { model: string; where?: Where[] };
const queryMethods = new Set(["findOne", "findMany", "count", "update", "updateMany", "delete", "deleteMany", "consumeOne", "incrementOne"]);

function scopeAdapter<T extends DBTransactionAdapter>(adapter: T): T {
  return new Proxy(adapter, {
    get(target, property, receiver) {
      const method = Reflect.get(target, property, receiver);
      if (property === "transaction" && typeof method === "function") {
        return (callback: (transaction: DBTransactionAdapter) => unknown) => method.call(target, (transaction: DBTransactionAdapter) => callback(scopeAdapter(transaction)));
      }
      if (typeof property !== "string" || !queryMethods.has(property) || typeof method !== "function") return method;
      return async (query: Query) => {
        const where = query.where || [];
        const userEmail = query.model === "user" && where.some(field => field.field === "email") && !where.some(field => field.field === "id" || field.field === "role");
        const providerIdentity = query.model === "account" && where.some(field => field.field === "providerId") && where.some(field => field.field === "accountId") && !where.some(field => field.field === "userId" || field.field === "accountRole");
        if (!userEmail && !providerIdentity) return method.call(target, query);
        const role = await getAccountRole();
        const roleField = userEmail ? "role" : "accountRole";
        return method.call(target, { ...query, where: [...where, { field: roleField, value: role, connector: "AND" }] });
      };
    },
  });
}

export const roleAuthAdapter = () => {
  const factory = mongodbAdapter(mongoDb, { client: mongoClient });
  return (options: Parameters<typeof factory>[0]): DBAdapter => scopeAdapter(factory({
    ...options,
    // Override the database constraint only. Declaring core email as an input
    // plugin field would make signup require it twice in Better Auth's parser.
    plugins: [...(options.plugins || []), {
      id: "role-email-storage",
      schema: { user: { fields: { email: { type: "string", required: true, unique: false } } } },
    }],
  }));
};
