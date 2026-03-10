const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => res.send('Bridge is active.'));

//Webhook receiver
app.post('/webhook', async (req, res) => {
    try {
        const submission = req.body;

        // 'userId' comes from the URL parameter 
        // 'q3_answer' (example) is the Unique Name of the field in Jotform
        const userId = submission.userId || 'anonymous';
        const userContent = submission.q3_answer || ''; 

        // 2. Load environment variables
        const apiToken = process.env.SECURE_VISA_APIKEY;
        const endpointId = process.env.SOFITECH_ENDPOINT_ID;

        // 3. Construct the Sofitech API call
        const params = new URLSearchParams();
        params.append("value", userContent);
        params.append("user_id", userId);

        const response = await fetch(`https://app.sofitech.ai/api/accounts/bot_fields/${endpointId}`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'X-ACCESS-TOKEN': apiToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const status = response.ok ? 'Success' : 'Failed';
        console.log(`[${new Date().toISOString()}] User: ${userId} | Status: ${status}`);

        res.status(200).send('Processed');
    } catch (error) {
        console.error('Bridge Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
