import fetch from 'node-fetch';

async function testAuth() {
  const baseUrl = 'http://localhost:5000';
  const username = `testuser_${Date.now()}`;
  const password = 'password123';

  console.log(`Testing with user: ${username}`);

  try {
    // 1. Register
    console.log('--- Registering ---');
    const registerRes = await fetch(`${baseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        role: 'job_seeker',
        name: 'Test User'
      }),
    });

    console.log('Register Status:', registerRes.status);
    const registerData = await registerRes.json();
    console.log('Register Response:', registerData);

    if (registerRes.status !== 201) {
      console.error('Registration failed');
      return;
    }

    // 2. Login
    console.log('--- Logging In ---');
    const loginRes = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    console.log('Login Status:', loginRes.status);
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);

    if (loginRes.status === 200) {
      console.log('Auth test PASSED');
    } else {
      console.log('Auth test FAILED');
    }
  } catch (error) {
    console.error('Test Error:', error);
  }
}

testAuth();
