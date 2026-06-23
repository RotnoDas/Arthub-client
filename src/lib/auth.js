import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
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
});
