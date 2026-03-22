# 🔏 AgentStamp Agent Template

A starter template for building trust-verified AI agents with [AgentStamp](https://agentstamp.org).

**Click "Use this template" to create your own trust-verified agent.**

## What You Get

- Express server with trust-gated endpoints
- `requireStamp()` middleware — only verified agents can call your API
- Agent card at `/.well-known/agent-card.json`
- Trust verification CLI script
- GitHub Actions workflow for CI/CD trust gates
- Ready for x402 micropayments (add `@x402/express` when needed)

## Quick Start

```bash
# 1. Create your repo from this template (click "Use this template" above)

# 2. Install dependencies
npm install

# 3. Configure your agent
cp .env.example .env
# Edit .env with your wallet address

# 4. Run
npm start
```

## Register Your Agent

1. Go to [agentstamp.org](https://agentstamp.org)
2. Register with your wallet address
3. Add your wallet to `.env`
4. Verify it works:

```bash
npm run verify -- 0xYourWalletAddress
```

## Project Structure

```
├── src/
│   ├── index.js      # Express server with trust-gated routes
│   ├── config.js     # Environment-based configuration
│   └── verify.js     # CLI trust verification script
├── tests/
│   └── health.test.js
├── .github/workflows/
│   ├── test.yml           # Run tests on push/PR
│   └── verify-trust.yml   # AgentStamp trust check in CI
├── .env.example
└── package.json
```

## Trust-Gated Endpoints

Public (no verification):
- `GET /health` — Health check
- `GET /.well-known/agent-card.json` — Agent discovery card

Trust-gated (requires `X-Wallet-Address` header):
- `POST /api/v1/execute` — Execute a task (min score: 30)

## Adding More Endpoints

```javascript
const { requireStamp } = require('agentstamp-verify/express');

// Require gold-tier agents with score >= 80
app.post(
  '/api/v1/sensitive-task',
  requireStamp({ minTier: 'gold', minScore: 80 }),
  (req, res) => {
    const caller = req.verifiedAgent;
    // caller.name, caller.score, caller.tier available
    res.json({ result: 'done' });
  }
);
```

## CI/CD Trust Verification

The included GitHub Action (`verify-trust.yml`) checks your agent's trust score on every push. Add your wallet address as a repository secret:

1. Go to Settings → Secrets → Actions
2. Add `WALLET_ADDRESS` with your agent's wallet

## Learn More

- [AgentStamp](https://agentstamp.org) — Trust verification platform
- [AgentStamp SDK](https://www.npmjs.com/package/agentstamp-verify) — npm package
- [AgentStamp GitHub Action](https://github.com/vinaybhosle/agentstamp) — CI/CD trust gates
- [Documentation](https://agentstamp.org/docs)

## License

MIT
