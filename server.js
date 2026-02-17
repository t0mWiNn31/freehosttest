const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// --- ကိုကို့ရဲ့ Coze Data များ ---
const COZE_ACCESS_TOKEN = "pat_xscdeApM6TBBKMeCu4mEvUNdaZKuAmNigxRxuHSbxfOfgj9MTQWuOtt4TrBDeJlD"; 
const BOT_ID = "7607801335647338501"; 

app.get('/test', (req, res) => res.send("Coze Backend is Live!"));

app.post('/ask', async (req, res) => {
    const userMsg = req.body.message;

    try {
        const response = await fetch("https://api.coze.com/open_api/v2/chat", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COZE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify({
                bot_id: BOT_ID,
                user: "Raptors_User",
                query: userMsg,
                stream: false
            })
        });

        const data = await response.json();

        // Coze API က ပြန်လာတဲ့ အဖြေကို စစ်ထုတ်မယ်
        if (data.messages && data.messages.length > 0) {
            const aiMessage = data.messages.find(m => m.type === 'answer');
            if (aiMessage) {
                res.json({ reply: aiMessage.content });
            } else {
                res.json({ reply: "အဖြေရှာမတွေ့သေးဘူး ကိုကို။" });
            }
        } else {
            res.status(500).json({ error: "Coze Bot ဆီက အကြောင်းပြန်ချက်မရပါဘူး။" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
