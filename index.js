const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/webhook', async (req, res) => {
    try {
        const payload = req.body;

        const contactId = payload.userId; 
        
        const customFieldId = process.env.SOFITECH_ENDPOINT_ID;

        if (!contactId) {
            console.error("Missing User ID (contact_id) from Jotform payload");
            return res.status(400).send('Missing User ID');
        }

        const systemKeys = ['slug', 'event_id', 'formID', 'ip']; 
        const cleanAnswers = {};
        Object.keys(payload).forEach(key => {
            if (!systemKeys.includes(key) && key !== 'userId') {
                cleanAnswers[key] = payload[key];
            }
        });

        const jsonString = JSON.stringify(cleanAnswers);

        const apiUrl = `https://app.sofitech.ai/api/contacts/${contactId}/custom_fields/${customFieldId}`;

        const params = new URLSearchParams();
        params.append("value", jsonString);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'X-ACCESS-TOKEN': process.env.SECURE_VISA_APIKEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const result = await response.json();
        console.log(`[Success] User ${contactId} updated. API Response:`, result);
        
        res.status(200).send('Processed');

    } catch (error) {
        console.error('Bridge Error:', error);
        res.status(500).send('Internal Error');
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`New Dynamic Bridge active on port ${port}`));