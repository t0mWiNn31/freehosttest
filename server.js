const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// HTML, CSS, JS ဖိုင်တွေကို အလုပ်လုပ်အောင် လုပ်ပေးတာ
app.use(express.static(path.join(__dirname, '.')));

// ကိုကို့ Key
const GEMINI_API_KEY = "AIzaSyB63jrk5SPwZyULGyi6lJIp2q0oIDFT9lQ"; 

app.post('/ask', async (req, res) => {
    const userMsg = req.body.message;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // ရက္ခိုင်လို ဖြေခိုင်းဖို့ ညွှန်ကြားချက်
    const promptInstructions = "You are a helpful assistant for ARAKHA_FORUM. Always reply in Rakhine language (Rakhine dialect) using Myanmar Unicode script. Use friendly terms like 'ကိုကို', 'အချေ'. User message: ";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptInstructions + userMsg }] }]
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Backend Error" });
    }
});

// Port သတ်မှတ်တာ
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
