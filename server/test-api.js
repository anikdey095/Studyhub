import fetch from 'node-fetch';

const API_URL = 'http://localhost:5001';

async function testAPI() {
  console.log('🧪 Testing StudyHub API Endpoints...\n');

  try {
    // Test root route
    console.log('1. Testing root route...');
    const rootResponse = await fetch(`${API_URL}/`);
    const rootData = await rootResponse.json();
    console.log('✅ Root route:', rootData);

    // Test health route
    console.log('\n2. Testing health route...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health route:', healthData);

    // Test signup
    console.log('\n3. Testing signup...');
    const signupResponse = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@university.edu',
        name: 'Test Student',
        university: 'Test University',
        password: 'password123'
      })
    });
    const signupData = await signupResponse.json();
    console.log('✅ Signup response:', signupData);

    // Test login
    console.log('\n4. Testing login...');
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@university.edu',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('✅ Login response:', loginData);

    console.log('\n🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();