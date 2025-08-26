import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  scenarios: {
    constant_load: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '1m',
    },
  },
  thresholds: { 'http_req_duration': ['p(95)<2000'] }, 
};

const BASE_URL = "http://localhost:8080/api";
const LOGIN_URL = `http://localhost:8080/api/public/login`;

// Student creds
const STUDENT_USERNAME = __ENV.TEST_STUDENT_USERNAME || "testuser";
const STUDENT_PASSWORD = __ENV.TEST_STUDENT_PASSWORD || "testpass";

// Provider creds
const PROVIDER_USERNAME = __ENV.TEST_PROVIDER_USERNAME || "testProvider";
const PROVIDER_PASSWORD = __ENV.TEST_PROVIDER_PASSWORD || "kohei0099";

function extractToken(loginRes) {
  try {
    const body = loginRes.json ? loginRes.json() : JSON.parse(loginRes.body || "{}");
    return body?.data?.token || body?.token || body?.access_token || null;
  } catch (e) {
    return null;
  }
}

function doLogin(username, password) {
  const payload = JSON.stringify({ username, password });
  const res = http.post(LOGIN_URL, payload, { headers: { "Content-Type": "application/json" } });
  const token = extractToken(res);
  const cookie = res.headers && (res.headers["Set-Cookie"] || res.headers["set-cookie"]) ? (res.headers["Set-Cookie"] || res.headers["set-cookie"]) : null;
  return { res, token, cookie };
}

export function setup() {
  // Login student
  const studentLogin = doLogin(STUDENT_USERNAME, STUDENT_PASSWORD);

  // Login provider
  const providerLogin = doLogin(PROVIDER_USERNAME, PROVIDER_PASSWORD);

  return {
    student: { token: studentLogin.token, cookie: studentLogin.cookie },
    provider: { token: providerLogin.token, cookie: providerLogin.cookie },
  };
}

export default function (data) {
  // Test as student
  const studentHeaders = { Accept: "text/html,application/xhtml+xml,application/json" };
  if (data.student.token) studentHeaders["Authorization"] = `Bearer ${data.student.token}`;
  else if (data.student.cookie) studentHeaders["Cookie"] = data.student.cookie;

  // Test as student
  const studentId = "687b962d61ab6353b233ba7a"; // Replace with actual studentId if available
  const page = 0;
  const size = 10;
  const resStudentList = http.get(`${BASE_URL}/grant-programs/student/${studentId}?page=${page}&size=${size}`, { headers: studentHeaders });
  check(resStudentList, { "grant-programs/student status 200": (r) => r.status === 200 });
  sleep(1);

  // Test as provider
  const providerHeaders = { Accept: "text/html,application/xhtml+xml,application/json" };
  if (data.provider.token) providerHeaders["Authorization"] = `Bearer ${data.provider.token}`;
  else if (data.provider.cookie) providerHeaders["Cookie"] = data.provider.cookie;

  // Example provider sub-route
  const resGrantList = http.get(`${BASE_URL}/grant-programs/provider/687a5bc3f7cf4d29b47e4e75`, { headers: providerHeaders });
  check(resGrantList, { "grant-programs/provider/687a5bc3f7cf4d29b47e4e75 status 200": (r) => r.status === 200 });
  sleep(1);
}
