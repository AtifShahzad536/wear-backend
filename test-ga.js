import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';
dotenv.config();

const propertyId = process.env.GA_PROPERTY_ID;
console.log('Testing GA4 with Property ID:', propertyId);
console.log('Credentials Key File:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'google-analytics-key.json'
});

async function runTest() {
  try {
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }]
    });

    console.log('Success! GA4 response:');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error running report:', error);
  }
}

runTest();
