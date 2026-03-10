const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/webhook', async (req, res) => {
    try {
        const payload = req.body;

        //  Extract the User ID
        const userId = payload.userId || "anonymous";

        // Filter Jotform data to get ONLY the answers
        // exclude Jotform's system keys to keep the JSON clean for the AI
        const systemKeys = ['slug', 'q6_input6', 'event_id', 'formID', 'ip']; 
        
        const cleanAnswers = {};
        Object.keys(payload).forEach(key => {
            // Usually, user fields start with 'q'
            // skip the known system keys
            if (!systemKeys.includes(key) && key !== 'userId') {
                cleanAnswers[key] = payload[key];
            }
        });

        // Convert all answers into one JSON string
        const jsonAnswers = JSON.stringify(cleanAnswers);

        // Send to the ONE specific Sofitech Bot Field
        const apiToken = process.env.SECURE_VISA_APIKEY;
        const botFieldId = process.env.SOFITECH_ENDPOINT_ID;

        const params = new URLSearchParams();
        params.append("value", jsonAnswers);
        params.append("user_id", userId);

        const response = await fetch(`https://app.sofitech.ai/api/accounts/bot_fields/${botFieldId}`, {
            method: 'POST',
            headers: {
                'X-ACCESS-TOKEN': apiToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        console.log(`Forwarded JSON for User ${userId}. Sofitech Status: ${response.status}`);
        res.status(200).send('OK');

    } catch (error) {
        console.error('Bridge Error:', error);
        res.status(500).send('Internal Error');
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`JSON Bridge active on port ${port}`));
