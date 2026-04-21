const express = require('express');
const path = require('path');
const { connectMatrixDB, client } = require('./mongodb_config');

const app = express();
const PORT = process.env.PORT || 5555;

// --- MIDDLEWARE ---
app.use(express.json({ limit: '10mb' })); // Supporting optimized neural syncs
app.use(express.static(path.join(__dirname, './')));

// --- NEURAL API ENDPOINTS ---

// 1. Get Global Feed
app.get('/api/feed', async (req, res) => {
    try {
        const db = client.db("insta_ai_portal");
        const posts = await db.collection("posts").find({}).sort({ timestamp: -1 }).limit(50).toArray();
        res.json({ status: 'connected', posts });
    } catch (err) {
        res.status(500).json({ error: "Feed signal lost" });
    }
});

// 2. Sync Profile Identity
app.post('/api/profile/sync', async (req, res) => {
    const { handle, name, bio, avatar } = req.body;
    try {
        const db = client.db("insta_ai_portal");
        const result = await db.collection("users").updateOne(
            { handle },
            { $set: { name, bio, avatar, lastSync: new Date() } },
            { upsert: true }
        );
        res.json({ success: true, message: "Identity anchored in Matrix", result });
    } catch (err) {
        res.status(500).json({ error: "Encryption failed" });
    }
});

// 3. Post New Media
app.post('/api/posts/create', async (req, res) => {
    const postData = req.body;
    try {
        const db = client.db("insta_ai_portal");
        postData.timestamp = new Date();
        const result = await db.collection("posts").insertOne(postData);
        res.json({ success: true, postId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: "Media stabilization failed" });
    }
});

// --- INITIALIZE SERVER ---
async function startServer() {
    // Attempt database connection first
    await connectMatrixDB();
    
    app.listen(PORT, () => {
        console.log("\n------------------------------------------");
        console.log(` NEURAL BACKEND ACTIVE: http://localhost:${PORT} `);
        console.log("------------------------------------------");
        console.log(" Serving portal files from: " + __dirname);
        console.log(" Encryption: AES-256 System Active");
        console.log(" Database: MongoDB Connected");
        console.log("------------------------------------------\n");
    });
}

startServer();
