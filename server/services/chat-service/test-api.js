/**
 * Comprehensive API Testing Script for Chat Service
 * Tests all endpoints individually to ensure they work correctly
 */

const http = require('http');
const https = require('https');

// Test against API Gateway (which proxies to chat service) or directly
const BASE_URL = process.env.API_GATEWAY_URL || 'http://127.0.0.1:3000';
const CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL || 'http://127.0.0.1:3004';
// Use chat service directly for testing (API gateway may not be running)
const API_URL = `${CHAT_SERVICE_URL}/api/v1/chat`;

// Force IPv4 to avoid IPv6 connection issues
const normalizeUrl = (url) => {
  return url.replace(/localhost/g, '127.0.0.1').replace(/::1/g, '127.0.0.1');
};

// Test credentials (you'll need to update these with real user credentials)
const TEST_USERS = {
  developer: {
    email: 'raorajan9576@gmail.com',
    password: '123123',
    role: 'developer'
  },
  projectOwner: {
    email: 'shrikishunr7@gmail.com', // Update with real project-owner email
    password: '123123',
    role: 'project-owner'
  },
  admin: {
    email: 'nexthire6@gmail.com',
    password: '123123',
    role: 'admin'
  }
};

// Store tokens
let tokens = {};

/**
 * Make HTTP request
 */
function makeRequest(method, url, data = null, token = null) {
  return new Promise((resolve, reject) => {
    // Normalize URL to use IPv4
    const normalizedUrl = normalizeUrl(url);
    const urlObj = new URL(normalizedUrl);
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
    // Try direct user service first, then API gateway
    const userServiceUrl = normalizeUrl(process.env.USER_SERVICE_URL || 'http://127.0.0.1:3001');
    const loginUrl = normalizeUrl(process.env.API_GATEWAY_URL || 'http://127.0.0.1:3000');
    
    // Try user service directly first
    let response = await makeRequest('POST', `${userServiceUrl}/api/v1/user/login`, {
      email: user.email,
      password: user.password,
      role: user.role
    }).catch(() => ({ status: 0 }));
    
    // If that fails, try API gateway
    if (response.status !== 200) {
      response = await makeRequest('POST', `${loginUrl}/api/v1/user/login`, {
        email: user.email,
        password: user.password,
        role: user.role
      }).catch(() => ({ status: 0 }));
    }
    
    // If that fails, try the auth endpoint
    if (response.status !== 200) {
      response = await makeRequest('POST', `${loginUrl}/api/v1/auth/login`, {
        email: user.email,
        password: user.password,
        role: user.role
      }).catch(() => ({ status: 0 }));
    }

    if (response.status === 200 && response.data.token) {
      tokens[userType] = response.data.token;
      console.log(`✅ Login successful for ${userType}`);
      return response.data.token;
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
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`   ${method} ${path}`);
  
  const token = tokens[tokenType] || await login(tokenType);
  if (!token && tokenType !== 'none') {
    console.log(`   ⚠️  Skipping - No token available`);
    return { skipped: true };
  }

  try {
    const response = await makeRequest(method, `${API_URL}${path}`, data, token);
    const success = response.status === expectedStatus;
    
    if (success) {
      console.log(`   ✅ PASS (Status: ${response.status})`);
      if (response.data?.data?.id) {
        console.log(`   📝 Resource ID: ${response.data.data.id}`);
      }
    } else {
      console.log(`   ❌ FAIL (Expected: ${expectedStatus}, Got: ${response.status})`);
      if (response.data?.message) {
        console.log(`   💬 Error Message: ${response.data.message}`);
      }
      if (response.data?.error) {
        console.log(`   🔴 Error Details: ${response.data.error}`);
      }
      if (response.status === 500) {
        console.log(`   ⚠️  Server Error - Check server logs for details`);
      }
      // Only show full response for debugging if it's not too large
      const responseStr = JSON.stringify(response.data, null, 2);
      if (responseStr.length < 500) {
        console.log(`   Response:`, responseStr);
      }
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
 * Run all tests
 */
async function runAllTests() {
  console.log('='.repeat(60));
  console.log('CHAT SERVICE API TESTING');
  console.log('='.repeat(60));

  // Health check - try both API Gateway and direct service
  console.log('\n📍 Health Check');
  let serviceRunning = false;
  
  // Try direct chat service
  try {
    const healthResponse = await makeRequest('GET', `${CHAT_SERVICE_URL}/health`);
    if (healthResponse.status === 200) {
      console.log('✅ Chat service is running (direct)');
      serviceRunning = true;
    }
  } catch (error) {
    console.log('⚠️  Chat service not accessible directly, trying via API Gateway...');
  }
  
  // If direct failed, that's okay - we'll use API Gateway
  if (!serviceRunning) {
    console.log('ℹ️  Will test via API Gateway (http://localhost:3000)');
  }

  // Login for all user types
  await login('developer');
  await login('projectOwner');
  await login('admin');

  const results = [];

  // 1. Get all conversations
  results.push(await testEndpoint(
    'Get All Conversations',
    'GET',
    '/conversations',
    null,
    'developer'
  ));

  // 2. Get or create direct conversation
  results.push(await testEndpoint(
    'Get/Create Direct Conversation',
    'GET',
    '/conversations/direct/2', // Assuming user ID 2 exists
    null,
    'developer'
  ));

  // Get current developer user ID from token
  let developerUserId = null;
  if (tokens.developer) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.decode(tokens.developer);
      developerUserId = decoded?.userId || decoded?.id;
      console.log(`\n📝 Developer User ID: ${developerUserId}`);
    } catch (e) {
      console.log(`\n⚠️  Could not decode developer token`);
    }
  }

  // 3. Create group conversation (project-owner only) - Add developer as participant initially
  results.push(await testEndpoint(
    'Create Group Conversation',
    'POST',
    '/conversations/group',
    {
      name: 'Test Group Chat',
      participantIds: developerUserId ? [developerUserId] : [] // Add actual developer ID
    },
    'projectOwner',
    201
  ));

  let groupConversationId = null;
  if (results[results.length - 1].success && results[results.length - 1].response?.data?.id) {
    groupConversationId = results[results.length - 1].response.data.id;
    console.log(`\n📝 Created group conversation ID: ${groupConversationId}`);
    // Wait a moment for the group to be fully created and participant added
    console.log(`⏳ Waiting for database to sync...`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Increased delay
  } else {
    console.log(`\n⚠️  Group creation failed or no ID returned, some tests will be skipped`);
  }

  // 4. Add additional participants to group (must use projectOwner who created it)
  if (groupConversationId) {
    results.push(await testEndpoint(
      'Add Participants to Group',
      'POST',
      `/conversations/${groupConversationId}/participants`,
      {
        participantIds: [2] // Add another developer (if exists)
      },
      'projectOwner',
      200
    ));
  }

  // 5. Get messages for conversation (developer who was added should be able to access)
  if (groupConversationId) {
    results.push(await testEndpoint(
      'Get Messages',
      'GET',
      `/conversations/${groupConversationId}/messages?limit=50&offset=0`,
      null,
      'developer'
    ));
  }

  // 6. Send a message (from developer who is a participant)
  if (groupConversationId) {
    results.push(await testEndpoint(
      'Send Message',
      'POST',
      '/messages',
      {
        conversationId: groupConversationId,
        content: 'Test message from API test script',
        messageType: 'text'
      },
      'developer',
      201
    ));
  }

  // 6b. Send a message from project-owner (group creator/admin)
  if (groupConversationId) {
    results.push(await testEndpoint(
      'Send Message (Project Owner)',
      'POST',
      '/messages',
      {
        conversationId: groupConversationId,
        content: 'Message from project owner',
        messageType: 'text'
      },
      'projectOwner',
      201
    ));
  }

  // 7. Mark messages as read
  if (groupConversationId) {
    results.push(await testEndpoint(
      'Mark Messages as Read',
      'POST',
      `/conversations/${groupConversationId}/read`,
      {
        messageIds: []
      },
      'developer'
    ));
  }

  // 8. Update participant settings
  if (groupConversationId) {
    results.push(await testEndpoint(
      'Update Participant Settings',
      'PUT',
      `/conversations/${groupConversationId}/participant`,
      {
        isFavorite: true,
        isArchived: false,
        isMuted: false
      },
      'developer'
    ));
  }

  // 9. Edit message (need a message ID)
  // This would require creating a message first and getting its ID

  // 10. Delete message (need a message ID)
  // This would require creating a message first and getting its ID

  // 11. Remove participant from group (remove developer ID 2 if it was added)
  if (groupConversationId) {
    results.push(await testEndpoint(
      'Remove Participant from Group',
      'DELETE',
      `/conversations/${groupConversationId}/participants/2`,
      null,
      'projectOwner',
      200
    ));
  }
  
  // Note: Cannot remove developer ID 1 because they're needed for other tests

  // 12. Flag conversation (admin only)
  if (groupConversationId) {
    results.push(await testEndpoint(
      'Flag Conversation',
      'POST',
      `/conversations/${groupConversationId}/flag`,
      {
        reason: 'Test flagging for moderation'
      },
      'admin',
      200
    ));
  }

  // 13. Unflag conversation (admin only)
  if (groupConversationId) {
    results.push(await testEndpoint(
      'Unflag Conversation',
      'DELETE',
      `/conversations/${groupConversationId}/flag`,
      null,
      'admin'
    ));
  }

  // Test unauthorized access
  console.log('\n🔒 Testing Authorization...');
  
  // Try to create group as developer (should fail)
  results.push(await testEndpoint(
    'Create Group as Developer (Should Fail)',
    'POST',
    '/conversations/group',
    {
      name: 'Unauthorized Group',
      participantIds: []
    },
    'developer',
    403 // Expected to fail
  ));

  // Try to add participants as developer (should fail)
  if (groupConversationId) {
    results.push(await testEndpoint(
      'Add Participants as Developer (Should Fail)',
      'POST',
      `/conversations/${groupConversationId}/participants`,
      {
        participantIds: [1]
      },
      'developer',
      403 // Expected to fail
    ));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.success && !r.skipped).length;
  const failed = results.filter(r => !r.success && !r.skipped).length;
  const skipped = results.filter(r => r.skipped).length;
  
  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success && !r.skipped).forEach(r => {
      console.log(`   - ${r.name}`);
      if (r.error) console.log(`     Error: ${r.error}`);
      if (r.status !== r.expectedStatus) {
        console.log(`     Expected: ${r.expectedStatus}, Got: ${r.status}`);
      }
    });
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run tests
runAllTests().catch(console.error);

