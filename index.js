const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Send Notification API
app.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token, // FCM token for the target device
  };

  try {
    const response = await admin.messaging().send(message);
    return res.status(200).send({ message: 'Notification sent successfully', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).send({ error: 'Failed to send notification', details: error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
