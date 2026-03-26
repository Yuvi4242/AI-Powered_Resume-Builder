const axios = require('axios');

async function testProfileAPI() {
    const baseURL = 'http://localhost:5000/api/profile';
    console.log(`Checking Profile API at: ${baseURL}\n`);

    try {
        // 1. Health check of base server
        const health = await axios.get('http://localhost:5000/api/health');
        console.log('✅ Server Health:', health.data.message);

        // 2. Check /api/profile routes
        console.log('\nTesting /api/profile/me (Expect 401 if not logged in, but not 404)');
        try {
            await axios.get(`${baseURL}/me`);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ /api/profile/me exists (Protected as expected)');
            } else if (error.response?.status === 404) {
                console.log('❌ /api/profile/me: NOT FOUND (404)');
            } else {
                console.log(`ℹ️ /api/profile/me returned status: ${error.response?.status}`);
            }
        }

        console.log('\nTesting /api/profile/update (Expect 401 if not logged in, but not 404)');
        try {
            await axios.put(`${baseURL}/update`, {});
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ /api/profile/update exists (Protected as expected)');
            } else if (error.response?.status === 404) {
                console.log('❌ /api/profile/update: NOT FOUND (404)');
            } else {
                console.log(`ℹ️ /api/profile/update returned status: ${error.response?.status}`);
            }
        }

    } catch (error) {
        console.error('❌ Could not connect to server. Is it running on port 5000?');
        console.error('Error:', error.message);
    }
}

testProfileAPI();
