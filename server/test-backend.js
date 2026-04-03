import axios from 'axios';

const API_URL = 'http://localhost:5002';

async function testBackend() {
  try {
    console.log('🧪 Testing StudyHub Backend...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test signup
    console.log('\n2. Testing signup...');
    const signupData = {
      email: 'test@university.edu',
      name: 'Test Student',
      university: 'Test University',
      password: 'password123'
    };
    
    const signupResponse = await axios.post(`${API_URL}/api/auth/signup`, signupData);
    console.log('✅ Signup successful:', {
      user: signupResponse.data.user,
      token: signupResponse.data.token.substring(0, 20) + '...'
    });

    // Test login
    console.log('\n3. Testing login...');
    const loginData = {
      email: 'test@university.edu',
      password: 'password123'
    };
    
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, loginData);
    console.log('✅ Login successful:', {
      user: loginResponse.data.user,
      token: loginResponse.data.token.substring(0, 20) + '...'
    });

    console.log('\n🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testBackend();