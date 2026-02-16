const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// CORS Setting - အခြား Link (raptors.onrender.com) ကနေ ခေါ်တာကို ခွင့်ပြုဖို့
app.use(cors());
app.use(express.json());

// လက်ရှိ Folder ထဲက HTML ဖိုင်တွေကို ပွင့်အောင်လုပ်တာ
app.use(express.static(path.join(__dirname, '.')));

// ကိုကို့ရဲ့ Gemini API Key
const GEMINI_API_KEY = "AIzaSyB63jrk5SPwZyULGyi6lJIp2q0oIDFT9lQ"; 

// Backend အလုပ်လုပ်လား စစ်ဖို့ Link (https://raptorss.onrender.com/test)
app.get('/test', (req, res) => {
    res.send("Backend is running smoothly, Ko Ko!");
});

app.post('/ask', async (req, res) => {
    const userMsg = req.body.message;
    // URL ကို v1 လို့ ပြောင်းထားပါတယ်
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Always reply in Rakhine language: " + userMsg }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const aiText = data.candidates[0].content.parts[0].text;
            res.json({ reply: aiText });
        } else {
            res.status(500).json({ error: "AI ဆီက အဖြေ မထွက်လာပါဘူး ကိုကို။" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Error: " + error.message });
    }
});
// Render ရဲ့ Port သို့မဟုတ် Port 3000 မှာ Run မယ်
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
