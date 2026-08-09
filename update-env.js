import fs from 'fs';
import path from 'path';

const jsonPath = path.resolve(process.cwd(), 'google-analytics-key.json');
const envPath = path.resolve(process.cwd(), '.env');

try {
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Append new env variables if not exists
  if (!envContent.includes('GA_CLIENT_EMAIL')) {
    envContent += `\nGA_CLIENT_EMAIL="${jsonContent.client_email}"`;
    // We want to escape the newlines in private key just like how they are in JSON
    const escapedPrivateKey = jsonContent.private_key.replace(/\n/g, '\\n');
    envContent += `\nGA_PRIVATE_KEY="${escapedPrivateKey}"\n`;

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('Successfully updated .env file with GA credentials!');
  } else {
    console.log('.env already contains GA credentials.');
  }
} catch (error) {
  console.error('Error updating .env:', error);
}
