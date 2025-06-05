import fetch, { Headers, Request as CFRequest, Response as CFResponse } from 'cross-fetch';

class PolyfillResponse extends CFResponse {
  static json(data: any, init: any = {}) {
    const headers = new Headers(init.headers || {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return new PolyfillResponse(JSON.stringify(data), { ...init, headers });
  }
}

let POST: (req: any) => Promise<Response>;

beforeAll(() => {
  // Polyfill fetch APIs for the route handler
  (global as any).fetch ??= fetch;
  (global as any).Headers ??= Headers;
  (global as any).Request ??= CFRequest;
  (global as any).Response ??= PolyfillResponse;
  POST = require('../route').POST;
});

function mockRequest(body: any, ip: string) {
  return {
    json: async () => body,
    headers: {
      get: (name: string) => (name.toLowerCase() === 'x-forwarded-for' ? ip : null),
    },
  } as any;
}

describe('POST /api/submit', () => {
  it('returns success with valid payload', async () => {
    const req = mockRequest({ title: 'Test' }, '1.1.1.1');
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ success: true });
  });

  it('detects spam via honeypot field', async () => {
    const req = mockRequest({ website: 'spam' }, '2.2.2.2');
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Spam detected');
  });

  it('rate limits repeated requests from the same IP', async () => {
    const ip = '3.3.3.3';
    for (let i = 0; i < 5; i++) {
      const res = await POST(mockRequest({ title: 'e' + i }, ip));
      expect(res.status).toBe(200);
    }
    const res = await POST(mockRequest({ title: 'Too many' }, ip));
    expect(res.status).toBe(429);
  });
});
