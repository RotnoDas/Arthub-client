import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db(process.env.DB_NAME);
export const auth = betterAuth({
    advanced: {
        cookiePrefix: "arthub",
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            role: {
                defaultValue: "user"
            },
            isBlocked: {
                defaultValue: false
            },
        }
    },
    database: mongodbAdapter(db, {
        client,
    }),
    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60
        }
    },
    plugins: [
        jwt(),
    ],
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // Only allow 'user' or 'artist' as roles — prevent admin escalation via direct API calls
                    const allowedRoles = ["user", "artist"];
                    const safeRole = allowedRoles.includes(user.role) ? user.role : "user";
                    return {
                        data: { ...user, role: safeRole, isBlocked: false }
                    };
                }
            }
        }
    }
});

