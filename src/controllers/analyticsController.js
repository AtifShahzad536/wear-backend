import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';
dotenv.config();

const propertyId = process.env.GA_PROPERTY_ID;

let configOptions = {};
if (process.env.GA_CLIENT_EMAIL && process.env.GA_PRIVATE_KEY) {
  let rawKey = process.env.GA_PRIVATE_KEY;
  let privateKey = rawKey.trim();
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
    privateKey = privateKey.slice(1, -1);
  }
  
  // Bulletproof replacement of literal backslash+n (handles both \n and \\n)
  privateKey = privateKey.split('\\n').join('\n');
  privateKey = privateKey.split('\\\\n').join('\n');
  // Remove Windows carriage returns
  privateKey = privateKey.split('\r').join('');

  // Single combined debug log
  console.log(JSON.stringify({
    rawLength: rawKey.length,
    rawStart: rawKey.slice(0, 50),
    rawEnd: rawKey.slice(-50),
    hasLiteralSlashN: rawKey.includes('\\\\n'),
    hasRealNewline: rawKey.includes('\n'),
    cleanedLength: privateKey.length,
    cleanedStart: privateKey.slice(0, 50),
    cleanedEnd: privateKey.slice(-50)
  }, null, 2));

  configOptions = {
    credentials: {
      client_email: process.env.GA_CLIENT_EMAIL.trim(),
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
