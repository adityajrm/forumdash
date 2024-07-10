import express from 'express';
import bodyParser from 'body-parser';
import openai from './config/open-ai.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const chatHistory = [];

// Your existing chat history initialization
chatHistory.push(['user', "You are a helpful medical assistant, that gives short and concise medical feedback to questions"]);

// Endpoint to handle user chat
app.post('/chat', async (req, res) => {
    const userInput = req.body.message;

    try {
        const messages = chatHistory.map(([role, content]) => ({ role, content }));
        messages.push({ role: 'user', content: userInput });

        // Request completion from OpenAI
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages,
        });

        const completionText = completion.data.choices[0].message.content;


        res.json({ botResponse: completionText});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
