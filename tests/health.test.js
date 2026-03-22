const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('Agent health check', () => {
  it('should return agent info', async () => {
    // Basic smoke test — replace with actual HTTP test when running
    const config = require('../src/config').config;
    assert.ok(config.agentName, 'Agent name should be set');
    assert.ok(config.port > 0, 'Port should be positive');
    assert.ok(
      config.agentStampApi.startsWith('https://'),
      'API URL should use HTTPS'
    );
  });
});
