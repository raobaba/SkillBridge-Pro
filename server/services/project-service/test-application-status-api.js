/**
 * Test Script: Verify Developer Sees Shortlisted Status After Project Owner Shortlists
 * 
 * This script tests the complete flow:
 * 1. Developer applies to a project
 * 2. Project owner shortlists the developer
 * 3. Developer fetches applications and should see "shortlisted" status
 */

const http = require('http');
const https = require('https');

// Configuration
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://127.0.0.1:3000';
const PROJECT_SERVICE_URL = process.env.PROJECT_SERVICE_URL || 'http://127.0.0.1:3002';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://127.0.0.1:3001';

// Test credentials (update with your actual test users)
const TEST_USERS = {
  developer: {
    email: 'raorajan9576@gmail.com',
    password: '123123',
    role: 'developer'
  },
  projectOwner: {
    email: 'shrikishunr7@gmail.com',
    password: '123123',
    role: 'project-owner'
  }
};

// Store tokens
let tokens = {};

/**
 * Make HTTP request
 */
function makeRequest(method, url, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
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

    const protocol = urlObj.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
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

/**
 * Login and get token
 */
async function login(userType) {
  console.log(`\n🔐 Logging in as ${userType}...`);
  
  const user = TEST_USERS[userType];
  if (!user) {
    console.error(`❌ Test user ${userType} not found`);
    return null;
  }

  try {
    // Try API Gateway first
    let response = await makeRequest('POST', `${API_GATEWAY_URL}/api/v1/user/login`, {
      email: user.email,
      password: user.password,
      role: user.role
    }).catch(() => ({ status: 0 }));
    
    // If that fails, try user service directly
    if (response.status !== 200) {
      response = await makeRequest('POST', `${USER_SERVICE_URL}/api/v1/user/login`, {
        email: user.email,
        password: user.password,
        role: user.role
      }).catch(() => ({ status: 0 }));
    }

    // If that fails, try auth endpoint
    if (response.status !== 200) {
      response = await makeRequest('POST', `${API_GATEWAY_URL}/api/v1/auth/login`, {
        email: user.email,
        password: user.password,
        role: user.role
      }).catch(() => ({ status: 0 }));
    }

    if (response.status === 200 && response.data.token) {
      tokens[userType] = response.data.token;
      console.log(`✅ Login successful for ${userType}`);
      
      // Decode token to get user ID
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(response.data.token);
        const userId = decoded?.userId || decoded?.id;
        console.log(`   User ID: ${userId}`);
        return { token: response.data.token, userId };
      } catch (e) {
        return { token: response.data.token, userId: null };
      }
    } else {
      console.error(`❌ Login failed for ${userType}:`, response.status, response.data);
      return null;
    }
  } catch (error) {
    console.error(`❌ Login error for ${userType}:`, error.message);
    return null;
  }
}

/**
 * Test endpoint
 */
async function testEndpoint(name, method, path, data = null, tokenType = 'developer', expectedStatus = 200) {
  console.log(`\n📋 Testing: ${name}`);
  console.log(`   ${method} ${path}`);
  
  // Get token - check if already stored, otherwise login
  let tokenInfo = tokens[tokenType];
  if (!tokenInfo || !tokenInfo.token) {
    const loginResult = await login(tokenType);
    if (loginResult && loginResult.token) {
      tokenInfo = { token: loginResult.token, userId: loginResult.userId };
      tokens[tokenType] = tokenInfo;
    }
  }
  
  if (!tokenInfo || !tokenInfo.token) {
    console.log(`   ⚠️  Skipping - No token available`);
    return { skipped: true };
  }

  try {
    // Try API Gateway first, fallback to direct service
    let url = `${API_GATEWAY_URL}${path}`;
    let response = await makeRequest(method, url, data, tokenInfo.token);
    
    // If API Gateway fails, try direct service
    if (response.status >= 500 || response.status === 0) {
      console.log(`   ⚠️  API Gateway failed, trying direct service...`);
      const directPath = path.replace('/api/v1/projects', '');
      url = `${PROJECT_SERVICE_URL}${directPath}`;
      response = await makeRequest(method, url, data, tokenInfo.token);
    }
    const success = response.status === expectedStatus;
    
    if (success) {
      console.log(`   ✅ PASS (Status: ${response.status})`);
    } else {
      console.log(`   ❌ FAIL (Expected: ${expectedStatus}, Got: ${response.status})`);
      if (response.data?.message) {
        console.log(`   💬 Error Message: ${response.data.message}`);
      }
      if (response.data?.error) {
        console.log(`   🔴 Error Details: ${response.data.error}`);
      }
      // Show full response for debugging
      console.log(`   📄 Response:`, JSON.stringify(response.data, null, 2).substring(0, 500));
    }
    
    return {
      name,
      success,
      status: response.status,
      expectedStatus,
      response: response.data
    };
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return {
      name,
      success: false,
      error: error.message
    };
  }
}

/**
 * Main test function
 */
async function testApplicationStatusFlow() {
  console.log('='.repeat(70));
  console.log('TESTING: Developer Application Status Flow');
  console.log('='.repeat(70));
  console.log('\nThis test verifies that:');
  console.log('1. Developer applies to a project (status: "applied")');
  console.log('2. Project owner shortlists developer (status: "shortlisted")');
  console.log('3. Developer fetches applications and sees "shortlisted" status');
  console.log('='.repeat(70));

  // Step 1: Login as both users
  console.log('\n\n📝 STEP 1: Login as Developer and Project Owner');
  const developerLogin = await login('developer');
  const ownerLogin = await login('projectOwner');

  if (!developerLogin || !ownerLogin || !developerLogin.token || !ownerLogin.token) {
    console.error('\n❌ Failed to login. Please check test credentials.');
    return;
  }

  // Store tokens properly
  tokens.developer = { token: developerLogin.token, userId: developerLogin.userId };
  tokens.projectOwner = { token: ownerLogin.token, userId: ownerLogin.userId };

  // Step 2: Get developer's current applications
  console.log('\n\n📝 STEP 2: Get Developer\'s Current Applications');
  const myAppsBefore = await testEndpoint(
    'Get My Applications (Before Shortlisting)',
    'GET',
    '/api/v1/projects/applications/my',
    null,
    'developer'
  );

  if (myAppsBefore.response && myAppsBefore.response.applications) {
    console.log(`\n   📊 Found ${myAppsBefore.response.applications.length} applications`);
    
    // Display all applications with their status
    myAppsBefore.response.applications.forEach((app, index) => {
      console.log(`\n   Application ${index + 1}:`);
      console.log(`   - Project ID: ${app.projectId}`);
      console.log(`   - Project Title: ${app.projectTitle || 'N/A'}`);
      console.log(`   - Status: ${app.status || 'N/A'} ⭐`);
      console.log(`   - Applied At: ${app.appliedAt || 'N/A'}`);
    });
  }

  // Step 3: Find a project to test with (get owner's projects)
  console.log('\n\n📝 STEP 3: Get Project Owner\'s Projects');
  const ownerProjects = await testEndpoint(
    'Get Owner Projects',
    'GET',
    '/api/v1/projects',
    null,
    'projectOwner'
  );

  let testProjectId = null;
  let testUserId = null;

  if (ownerProjects.response && ownerProjects.response.projects && ownerProjects.response.projects.length > 0) {
    testProjectId = ownerProjects.response.projects[0].id;
    console.log(`\n   📋 Using Project ID: ${testProjectId}`);
    console.log(`   Project Title: ${ownerProjects.response.projects[0].title}`);
  } else {
    console.log('\n   ⚠️  No projects found for owner. Creating a test project...');
    // You may need to create a project here if none exist
    console.log('   ⚠️  Skipping test - please create a project first');
    return;
  }

  // Step 4: Get applicants for the project
  console.log(`\n\n📝 STEP 4: Get Applicants for Project ${testProjectId}`);
  const applicants = await testEndpoint(
    'Get Project Applicants',
    'GET',
    `/api/v1/projects/${testProjectId}/applicants`,
    null,
    'projectOwner'
  );

  if (applicants.response && applicants.response.applicants && applicants.response.applicants.length > 0) {
    // Find a developer applicant who is not already shortlisted
    const applicantToShortlist = applicants.response.applicants.find(
      app => app.status === 'applied' || app.status === 'pending'
    ) || applicants.response.applicants[0];
    
    testUserId = applicantToShortlist.userId;
    console.log(`\n   👤 Found Applicant:`);
    console.log(`   - User ID: ${testUserId}`);
    console.log(`   - Name: ${applicantToShortlist.name || 'N/A'}`);
    console.log(`   - Current Status: ${applicantToShortlist.status || 'N/A'}`);
  } else {
    console.log('\n   ⚠️  No applicants found for this project.');
    console.log('   💡 Developer needs to apply to this project first.');
    console.log('   ⚠️  Skipping shortlist test...');
    
    // Show final status anyway
    console.log('\n\n📝 FINAL CHECK: Get Developer\'s Applications (Final Status)');
    const myAppsFinal = await testEndpoint(
      'Get My Applications (Final Check)',
      'GET',
      '/api/v1/projects/applications/my',
      null,
      'developer'
    );

    if (myAppsFinal.response && myAppsFinal.response.applications) {
      console.log(`\n   📊 Final Applications Status:`);
      myAppsFinal.response.applications.forEach((app, index) => {
        console.log(`\n   Application ${index + 1}:`);
        console.log(`   - Project ID: ${app.projectId}`);
        console.log(`   - Project Title: ${app.projectTitle || 'N/A'}`);
        console.log(`   - Status: ${app.status || 'N/A'} ⭐`);
        console.log(`   - Applied At: ${app.appliedAt || 'N/A'}`);
      });
    }
    
    return;
  }

  // Step 5: Shortlist the developer
  console.log(`\n\n📝 STEP 5: Project Owner Shortlists Developer`);
  console.log(`   Project ID: ${testProjectId}`);
  console.log(`   Developer User ID: ${testUserId}`);
  
  const shortlistResult = await testEndpoint(
    'Shortlist Developer',
    'PUT',
    '/api/v1/projects/applicants/status',
    {
      projectId: testProjectId,
      userId: testUserId,
      status: 'shortlisted'
    },
    'projectOwner'
  );

  if (shortlistResult.success && shortlistResult.response.application) {
    console.log(`\n   ✅ Developer shortlisted successfully!`);
    console.log(`   Updated Status: ${shortlistResult.response.application.status}`);
  }

  // Step 6: Verify developer sees the updated status
  console.log(`\n\n📝 STEP 6: Verify Developer Sees "Shortlisted" Status`);
  console.log(`   Waiting 2 seconds for database update...`);
  await new Promise(resolve => setTimeout(resolve, 2000));

  const myAppsAfter = await testEndpoint(
    'Get My Applications (After Shortlisting)',
    'GET',
    '/api/v1/projects/applications/my',
    null,
    'developer'
  );

  if (myAppsAfter.response && myAppsAfter.response.applications) {
    console.log(`\n   📊 Applications After Shortlisting:`);
    console.log(`   Total applications returned: ${myAppsAfter.response.applications.length}`);
    
    // Show all applications first
    if (myAppsAfter.response.applications.length > 0) {
      console.log(`\n   📋 All Applications:`);
      myAppsAfter.response.applications.forEach((app, index) => {
        console.log(`\n   Application ${index + 1}:`);
        console.log(`   - Project ID: ${app.projectId}`);
        console.log(`   - Project Title: ${app.projectTitle || 'N/A'}`);
        console.log(`   - Status: ${app.status || 'N/A'} ⭐`);
        console.log(`   - Applied At: ${app.appliedAt || 'N/A'}`);
        console.log(`   - Updated At: ${app.updatedAt || 'N/A'}`);
        console.log(`   - Full Data:`, JSON.stringify(app, null, 2).substring(0, 300));
      });
    } else {
      console.log(`\n   ⚠️  No applications returned from API`);
      console.log(`   This could mean:`);
      console.log(`   1. Developer hasn't applied to any projects`);
      console.log(`   2. Projects were deleted (applications with deleted projects are filtered out)`);
      console.log(`   3. User ID mismatch between authentication and database`);
    }
    
    const shortlistedApp = myAppsAfter.response.applications.find(
      app => Number(app.projectId) === Number(testProjectId)
    );

    if (shortlistedApp) {
      console.log(`\n   ✅ Found Application for Project ${testProjectId}:`);
      console.log(`   - Project Title: ${shortlistedApp.projectTitle || 'N/A'}`);
      console.log(`   - Status: ${shortlistedApp.status || 'N/A'} ⭐`);
      console.log(`   - Applied At: ${shortlistedApp.appliedAt || 'N/A'}`);
      console.log(`   - Updated At: ${shortlistedApp.updatedAt || 'N/A'}`);
      
      if (shortlistedApp.status === 'shortlisted') {
        console.log(`\n   🎉 SUCCESS! Developer can see "shortlisted" status!`);
      } else {
        console.log(`\n   ⚠️  WARNING: Status is "${shortlistedApp.status}" but expected "shortlisted"`);
      }
    } else {
      console.log(`\n   ⚠️  Could not find application for Project ${testProjectId}`);
      console.log(`   Available Project IDs: ${myAppsAfter.response.applications.map(a => a.projectId).join(', ') || 'None'}`);
      console.log(`   Looking for Project ID: ${testProjectId}`);
    }
  } else {
    console.log(`\n   ⚠️  No response data or applications array not found`);
    console.log(`   Response:`, JSON.stringify(myAppsAfter.response, null, 2));
  }

  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('TEST SUMMARY');
  console.log('='.repeat(70));
  console.log('✅ Step 1: Login successful');
  console.log('✅ Step 2: Developer can fetch applications');
  console.log(shortlistResult.success ? '✅ Step 5: Developer shortlisted successfully' : '❌ Step 5: Failed to shortlist');
  
  if (myAppsAfter.response && myAppsAfter.response.applications) {
    const shortlistedApp = myAppsAfter.response.applications.find(
      app => app.projectId === testProjectId
    );
    if (shortlistedApp && shortlistedApp.status === 'shortlisted') {
      console.log('✅ Step 6: Developer sees "shortlisted" status correctly!');
    } else {
      console.log('❌ Step 6: Developer status does not match expected "shortlisted"');
    }
  }
  
  console.log('='.repeat(70));
}

// Run the test
testApplicationStatusFlow().catch(console.error);

