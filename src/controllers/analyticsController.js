import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';
dotenv.config();

const propertyId = process.env.GA_PROPERTY_ID;

let configOptions = {};
if (process.env.GA_CLIENT_EMAIL && process.env.GA_PRIVATE_KEY) {
  let rawKey = process.env.GA_PRIVATE_KEY;
  let clientEmail = process.env.GA_CLIENT_EMAIL.trim();

  // Foolproof PEM key normalizer
  const header = "-----BEGIN PRIVATE KEY-----";
  const footer = "-----END PRIVATE KEY-----";
  
  let body = rawKey.trim();
  
  // Strip headers/footers if present
  if (body.includes(header)) {
    body = body.split(header)[1];
  }
  if (body.includes(footer)) {
    body = body.split(footer)[0];
  }
  
  // Remove all quotes, literal \n, \r, and any whitespace/newlines
  body = body.replace(/['"]/g, '');
  body = body.replace(/\\n/g, '');
  body = body.replace(/\\r/g, '');
  body = body.replace(/\s+/g, ''); // strips all spaces, tabs, and real newlines
  
  // Reconstruct standard PEM format (newlines every 64 characters)
  const lines = body.match(/.{1,64}/g);
  const privateKey = `${header}\n${lines.join('\n')}\n${footer}\n`;

  configOptions = {
    credentials: {
      client_email: clientEmail,
      private_key: privateKey
    }
  };
} else {
  console.log('DEBUG: Client email or private key is missing in Env.');
  configOptions = {
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'google-analytics-key.json'
  };
}

const analyticsDataClient = new BetaAnalyticsDataClient(configOptions);

export const getRealtimeAnalytics = async (req, res) => {
  try {
    if (!propertyId) {
      return res.status(400).json({ error: 'GA_PROPERTY_ID is not configured in .env' });
    }

    // Fetch active users (past 30 minutes) grouped by country
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions: [
        { name: 'country' }
      ],
      metrics: [
        { name: 'activeUsers' }
      ]
    });

    let totalActiveUsers = 0;
    const countries = [];

    if (response.rows && response.rows.length > 0) {
      response.rows.forEach(row => {
        const countryName = row.dimensionValues[0].value;
        const activeUsersCount = parseInt(row.metricValues[0].value, 10);
        totalActiveUsers += activeUsersCount;
        countries.push({ country: countryName, activeUsers: activeUsersCount });
      });
    }

    // Sort countries by active users descending
    countries.sort((a, b) => b.activeUsers - a.activeUsers);

    res.json({
      activeUsers: totalActiveUsers,
      countries: countries
    });
  } catch (error) {
    console.error('Error fetching GA4 realtime report:', error);
    res.status(500).json({ error: 'Failed to fetch realtime data from Google Analytics', details: error.message });
  }
};
