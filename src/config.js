/**
 * Agent configuration.
 *
 * Override defaults with environment variables.
 */

const config = Object.freeze({
  agentName: process.env.AGENT_NAME || 'my-trusted-agent',
  port: parseInt(process.env.PORT || '3000', 10),
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  walletAddress: process.env.WALLET_ADDRESS || '',
  agentStampApi: process.env.AGENTSTAMP_API_URL || 'https://agentstamp.org/api/v1',
});

module.exports = { config };
