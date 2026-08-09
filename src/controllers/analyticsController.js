import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';
dotenv.config();

const propertyId = process.env.GA_PROPERTY_ID;

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'google-analytics-key.json'
});

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
