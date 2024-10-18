/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.sendNotification = functions.firestore
    .document('messages/{messageId}')
    .onCreate(async (snap, context) => {
        const message = snap.data();

        // Get the user's FCM token
        const senderSnapshot = await admin.firestore().collection('fcmTokens').doc(message.uid).get();
        const senderToken = senderSnapshot.data().token;

        // Get all other users' FCM tokens
        const tokensSnapshot = await admin.firestore().collection('fcmTokens').get();
        const tokens = [];
        tokensSnapshot.forEach(doc => {
            if (doc.id !== message.uid) {
                tokens.push(doc.data().token);
            }
        });

        // Notification payload
        const payload = {
            notification: {
                title: 'New Message',
                body: `${message.text}`,
                clickAction: 'FLUTTER_NOTIFICATION_CLICK'
            }
        };

        // Send notifications to all tokens
        const response = await admin.messaging().sendToDevice(tokens, payload);
        console.log('Notifications sent successfully:', response);
    });
