#!/usr/bin/env node

/**
 * Quick trust verification script.
 *
 * Usage:
 *   node src/verify.js 0xYourWalletAddress
 *   WALLET_ADDRESS=0x... node src/verify.js
 */

const { config } = require('./config');

async function verify(walletAddress) {
  const url = `${config.agentStampApi}/trust/check/${walletAddress}`;

  console.log(`\n🔍 Checking trust for: ${walletAddress}`);
  console.log(`   API: ${url}\n`);

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    if (response.status === 404) {
      console.log('❌ Agent not found in AgentStamp registry.');
      console.log('   Register at: https://agentstamp.org\n');
      process.exit(1);
    }
    throw new Error(`API returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  console.log('✅ Trust Check Result:');
  console.log(`   Trusted:     ${data.trusted}`);
  console.log(`   Score:       ${data.score}/100`);
  console.log(`   Tier:        ${data.tier}`);
  console.log(`   Agent:       ${data.agent?.name || 'Unknown'}`);
  console.log(`   Endorsements: ${data.agent?.endorsements || 0}`);
  console.log(`   Heartbeat:   ${data.agent?.heartbeat_active ? 'active' : 'inactive'}`);
  console.log();

  return data;
}

const wallet = process.argv[2] || config.walletAddress;

if (!wallet) {
  console.error('Usage: node src/verify.js <wallet-address>');
  console.error('   or: WALLET_ADDRESS=0x... node src/verify.js');
  process.exit(1);
}

verify(wallet).catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
