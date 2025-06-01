import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5000 }, // raise 150 VU in 10 seconds
    { duration: '1m', target: 5000 }, // keep 150 users 30 seconds
    { duration: '10s', target: 0 }, // lower pressure to 0 in 10 seconds
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests must be faster than 500ms
  },
};

const users = [
  { email: 'john1.official@mail.ru', password: '123456' },
  { email: 'ronaldo.official@mail.ru', password: '123456' },
  { email: 'ronaldo2.official@mail.ru', password: '123456' },
];

export function setup() {
  const tokens = users.map((user) => {
    const loginRes = http.post(
      'http://localhost:9000/auth/login',
      JSON.stringify({
        email: user.email,
        password: user.password,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    console.log(`Cookies for ${user.email}:`, JSON.stringify(loginRes.cookies));

    const cookieArray = loginRes.cookies['access_token'];
    if (!cookieArray || cookieArray.length === 0) {
      throw new Error('Access token cookie not found');
    }
    const token = cookieArray[0].value;

    return token;
  });

  return { tokens };
}

export default function (data) {
  const token = data.tokens[(__VU - 1) % data.tokens.length];

  // GET finance_categories
  const res = http.get('http://localhost:9000/finance_categories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const bodyStr = typeof res.body === 'string' ? res.body : '';

  check(res, {
    'status 200': (r) => r.status === 200,
    'response is not empty': () => bodyStr.length > 0,
  });

  // POST finance_notes
  // const notePayload = {
  //   comment: `TEST VU${__VU}`,
  //   amount: 300,
  //   type: 'EXPENSE',
  //   categoryId: 5,
  //   noteDate: new Date().toISOString(),
  // };

  // const postRes = http.post('http://localhost:9000/finance_notes', JSON.stringify(notePayload), {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   },
  // });

  // check(postRes, {
  //   'finance_notes создан': (r) => r.status === 201 || r.status === 200,
  // });

  sleep(0.1);
}
