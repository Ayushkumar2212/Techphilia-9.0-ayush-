const { MongoClient } = require('mongodb');

// --- NEURAL MATRIX DATABASE CONFIGURATION ---
// Replace the URI with your MongoDB Atlas connection string or local instance
const uri = "mongodb://localhost:27017/insta_ai_portal";
const client = new MongoClient(uri);

async function connectMatrixDB() {
    try {
        await client.connect();
        console.log("------------------------------------------");
        console.log(" SYNC SUCCESS: Connected to Matrix MongoDB ");
        console.log("------------------------------------------");
        
        const db = client.db("insta_ai_portal");
        const users = db.collection("users");
        const posts = db.collection("posts");
        const messages = db.collection("messages");

        // Example: Initializing a user node
        const result = await users.updateOne(
            { handle: "ayush_ai" },
            { 
                $set: { 
                    name: "Ayush", 
                    bio: "Neural Architect",
                    lastSync: new Date()
                } 
            },
            { upsert: true }
        );

        console.log(`Node Status: ${result.upsertedCount > 0 ? 'Initialized' : 'Synchronized'}`);
        return db;

    } catch (err) {
        console.error("------------------------------------------");
        console.error(" SYNC FAILED: Neural Database Unreachable ");
        console.error(err);
        console.error("------------------------------------------");
    }
}

// Export for use in Node.js backend
module.exports = { connectMatrixDB, client };
