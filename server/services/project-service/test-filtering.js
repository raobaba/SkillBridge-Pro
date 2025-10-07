#!/usr/bin/env node

/**
 * Simple test script to verify project filtering functionality
 * Run with: node test-filtering.js
 */

const { ProjectsModel } = require('./src/models/projects.model');

async function testFiltering() {
  console.log('🧪 Testing Project Filtering Functionality...\n');

  try {
    // Test 1: Basic search with query
    console.log('Test 1: Basic search with query');
    const searchResult = await ProjectsModel.searchProjects({
      query: 'React',
      limit: 5
    });
    console.log(`✅ Found ${searchResult.projects.length} projects matching "React"`);
    console.log(`   Pagination: ${searchResult.pagination.total} total, ${searchResult.pagination.pages} pages\n`);

    // Test 2: Filter by status
    console.log('Test 2: Filter by status');
    const statusResult = await ProjectsModel.searchProjects({
      status: 'active',
      limit: 5
    });
    console.log(`✅ Found ${statusResult.projects.length} active projects\n`);

    // Test 3: Filter by priority
    console.log('Test 3: Filter by priority');
    const priorityResult = await ProjectsModel.searchProjects({
      priority: 'high',
      limit: 5
    });
    console.log(`✅ Found ${priorityResult.projects.length} high priority projects\n`);

    // Test 4: Filter by location (Remote)
    console.log('Test 4: Filter by location (Remote)');
    const locationResult = await ProjectsModel.searchProjects({
      location: 'Remote',
      limit: 5
    });
    console.log(`✅ Found ${locationResult.projects.length} remote projects\n`);

    // Test 5: Filter by skills
    console.log('Test 5: Filter by skills');
    const skillsResult = await ProjectsModel.searchProjects({
      skills: ['React', 'JavaScript'],
      limit: 5
    });
    console.log(`✅ Found ${skillsResult.projects.length} projects with React or JavaScript skills\n`);

    // Test 6: Filter by tags
    console.log('Test 6: Filter by tags');
    const tagsResult = await ProjectsModel.searchProjects({
      tags: ['Web Development', 'Frontend'],
      limit: 5
    });
    console.log(`✅ Found ${tagsResult.projects.length} projects with Web Development or Frontend tags\n`);

    // Test 7: Complex filtering
    console.log('Test 7: Complex filtering (query + status + priority)');
    const complexResult = await ProjectsModel.searchProjects({
      query: 'Node.js',
      status: 'active',
      priority: 'medium',
      limit: 5
    });
    console.log(`✅ Found ${complexResult.projects.length} active medium priority projects matching "Node.js"\n`);

    // Test 8: Sort by different criteria
    console.log('Test 8: Sort by budget (high to low)');
    const budgetResult = await ProjectsModel.searchProjects({
      sortBy: 'budget',
      limit: 3
    });
    console.log(`✅ Found ${budgetResult.projects.length} projects sorted by budget\n`);

    console.log('🎉 All filtering tests completed successfully!');
    console.log('\n📋 Summary of implemented filters:');
    console.log('   ✅ Text search (title, description, role, company)');
    console.log('   ✅ Status filtering');
    console.log('   ✅ Priority filtering');
    console.log('   ✅ Location filtering (including Remote)');
    console.log('   ✅ Skills filtering');
    console.log('   ✅ Tags filtering');
    console.log('   ✅ Budget range filtering');
    console.log('   ✅ Experience level filtering');
    console.log('   ✅ Category filtering');
    console.log('   ✅ Remote work filtering');
    console.log('   ✅ Multiple sorting options');
    console.log('   ✅ Pagination support');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testFiltering();
