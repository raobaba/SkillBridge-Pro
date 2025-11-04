/**
 * Simple Test: Check if developer can see shortlisted status
 * This directly queries the API to see what status is returned
 */

const http = require('http');

const API_GATEWAY_URL = 'http://127.0.0.1:3000';

// Test credentials
const DEVELOPER_EMAIL = 'raorajan9576@gmail.com';
const DEVELOPER_PASSWORD = '123123';

function makeRequest(method, url, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function test() {
  console.log('='.repeat(70));
  console.log('SIMPLE TEST: Developer Application Status Check');
  console.log('='.repeat(70));

  // Step 1: Login
  console.log('\n📝 Step 1: Login as Developer');
  const loginResponse = await makeRequest('POST', `${API_GATEWAY_URL}/api/v1/user/login`, {
    email: DEVELOPER_EMAIL,
    password: DEVELOPER_PASSWORD,
    role: 'developer'
  });

  if (loginResponse.status !== 200 || !loginResponse.data.token) {
    console.error('❌ Login failed:', loginResponse.data);
    return;
  }

  const token = loginResponse.data.token;
  console.log('✅ Login successful');

  // Step 2: Get applications
  console.log('\n📝 Step 2: Get Developer Applications');
  const appsResponse = await makeRequest(
    'GET',
    `${API_GATEWAY_URL}/api/v1/projects/applications/my`,
    null,
    token
  );

  console.log(`\n📊 API Response Status: ${appsResponse.status}`);
  
  if (appsResponse.status === 200 && appsResponse.data.applications) {
    console.log(`\n✅ API returned ${appsResponse.data.applications.length} applications\n`);
    
    if (appsResponse.data.applications.length === 0) {
      console.log('⚠️  No applications found. This could mean:');
      console.log('   1. Developer hasn\'t applied to any projects');
      console.log('   2. All projects were deleted (applications to deleted projects are filtered)');
      console.log('   3. Database query issue');
    } else {
      appsResponse.data.applications.forEach((app, index) => {
        console.log(`\n📋 Application ${index + 1}:`);
        console.log(`   Project ID: ${app.projectId}`);
        console.log(`   Project Title: ${app.projectTitle || '(null - project might be deleted)'}`);
        console.log(`   Status: ${app.status || 'N/A'} ⭐`);
        console.log(`   Applied At: ${app.appliedAt || 'N/A'}`);
        console.log(`   Updated At: ${app.updatedAt || 'N/A'}`);
        
        // Show all fields
        console.log(`   Full Data:`);
        Object.keys(app).forEach(key => {
          if (!['projectTitle', 'projectId', 'status', 'appliedAt', 'updatedAt'].includes(key)) {
            console.log(`     ${key}: ${JSON.stringify(app[key])}`);
          }
        });
      });
      
      // Check for shortlisted status
      const shortlistedApps = appsResponse.data.applications.filter(app => app.status === 'shortlisted');
      if (shortlistedApps.length > 0) {
        console.log(`\n🎉 SUCCESS! Found ${shortlistedApps.length} shortlisted application(s):`);
        shortlistedApps.forEach(app => {
          console.log(`   - Project ${app.projectId}: ${app.projectTitle || 'N/A'} - Status: ${app.status}`);
        });
      } else {
        console.log(`\n⚠️  No applications with "shortlisted" status found.`);
        console.log(`   Available statuses: ${[...new Set(appsResponse.data.applications.map(a => a.status))].join(', ')}`);
      }
    }
  } else {
    console.error('❌ API Error:', appsResponse.data);
  }

  console.log('\n' + '='.repeat(70));
}

test().catch(console.error);

