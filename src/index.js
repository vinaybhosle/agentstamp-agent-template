/**
 * Trust-verified AI agent server.
 *
 * This agent uses AgentStamp for identity verification and trust scoring.
 * Incoming requests are gated by the requireStamp() middleware — only
 * agents with a valid trust score can interact with your endpoints.
 */

const express = require('express');
const { requireStamp } = require('agentstamp-verify/express');
const { config } = require('./config');

const app = express();
app.use(express.json());

// ── Public endpoints (no trust check) ──────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', agent: config.agentName, version: '0.1.0' });
});

app.get('/.well-known/agent-card.json', (_req, res) => {
  res.json({
    name: config.agentName,
    description: 'A trust-verified AI agent built with AgentStamp',
    url: config.baseUrl,
    capabilities: ['task-execution', 'trust-verification'],
    trust: {
      provider: 'agentstamp',
      registry: 'https://agentstamp.org/api/v1/registry',
    },
  });
});

// ── Trust-gated endpoints ──────────────────────────────────────
// Only agents with a valid AgentStamp trust score can access these.
// The caller must include an X-Wallet-Address header.

app.post(
  '/api/v1/execute',
  requireStamp({ minTier: 'free', minScore: 30 }),
  (req, res) => {
    const { task } = req.body;
    const caller = req.verifiedAgent;

    console.log(
      `Task from ${caller.name} (score: ${caller.score}): ${task}`
    );

    res.json({
      success: true,
      result: `Task "${task}" accepted from verified agent ${caller.name}`,
      trust: {
        callerScore: caller.score,
        callerTier: caller.tier,
      },
    });
  }
);

// ── Start server ───────────────────────────────────────────────

const port = config.port;
app.listen(port, () => {
  console.log(`🔏 ${config.agentName} running on port ${port}`);
  console.log(`   Trust verification: enabled (min score: 30)`);
  console.log(`   Health: http://localhost:${port}/health`);
});
