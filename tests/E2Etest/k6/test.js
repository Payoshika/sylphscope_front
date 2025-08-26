import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: '5s', target: 50},
    { duration: '10s', target: 1000},
    { duration: '5s', target: 0}
  ]
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:5173";
// Replace with the real backend login endpoint used by [`AuthService.login`](src/services/AuthService)
const LOGIN_URL = __ENV.LOGIN_URL || `${BASE_URL}/api/auth/login`;

// Use env vars for test credentials
const USERNAME = __ENV.TEST_STUDENT_USERNAME || "testuser";
const PASSWORD = __ENV.TEST_STUDENT_PASSWORD || "testpass";

function extractToken(loginRes) {
  try {
    const body = loginRes.json ? loginRes.json() : JSON.parse(loginRes.body || "{}");
    return body?.data?.token || body?.token || body?.access_token || null;
  } catch (e) {
    return null;
  }
}

export function setup() {
  const loginPayload = JSON.stringify({ username: USERNAME, password: PASSWORD });
  const loginRes = http.post(LOGIN_URL, loginPayload, { headers: { "Content-Type": "application/json" } });
  const token = extractToken(loginRes);
  return { token, cookie: loginRes.headers["Set-Cookie"] || null };
}

export default function (data) {
  const authHeaders = { Accept: "text/html,application/xhtml+xml,application/json" };
  if (data.token) authHeaders["Authorization"] = `Bearer ${data.token}`;
  else if (data.cookie) authHeaders["Cookie"] = data.cookie;

  // requests
  const resDashboard = http.get(`${BASE_URL}/student-dashboard/list`, { headers: authHeaders });
  check(resDashboard, { "dashboard status is 200": (r) => r.status === 200 });
  sleep(1);
}
