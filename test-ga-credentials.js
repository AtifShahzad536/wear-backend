import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';
dotenv.config();

const clientEmail = process.env.GA_CLIENT_EMAIL;
let privateKey = process.env.GA_PRIVATE_KEY;

if (!clientEmail || !privateKey) {
  console.error('Error: GA_CLIENT_EMAIL or GA_PRIVATE_KEY is not defined in .env');
  process.exit(1);
}

privateKey = privateKey.trim();
if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
  privateKey = privateKey.slice(1, -1);
}
if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
  privateKey = privateKey.slice(1, -1);
}
privateKey = privateKey.split('\\n').join('\n');
privateKey = privateKey.split('\\\\n').join('\n');
privateKey = privateKey.split('\r').join('');

console.log('Cleaned private key starts with:', privateKey.slice(0, 50));
console.log('Cleaned private key ends with:', privateKey.slice(-50));

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey
  }
});

async function runTest() {
  try {
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${process.env.GA_PROPERTY_ID}`,
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }]
    });

    console.log('Success! Connected with credentials object. Response count:', response.rowCount);
  } catch (error) {
    console.error('FAILED to connect with credentials object:', error);
  }
}

runTest();
