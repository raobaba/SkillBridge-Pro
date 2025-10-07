const { db } = require("../config/database");
const { sql, eq, desc, asc } = require("drizzle-orm");
const {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  pgEnum,
} = require("drizzle-orm/pg-core");

// Enum for filter option types
const filterTypeEnum = pgEnum("filter_type", [
  "status",
  "priority", 
  "experience_level",
  "work_arrangement",
  "payment_term",
  "currency",
  "sort_option",
  "skill",
  "location",
  "category",
  "tag"
]);

// Single table for all filter options
const filterOptionsTable = pgTable("filter_options", {
  id: serial("id").primaryKey(),
  type: filterTypeEnum("type").notNull(),
  value: text("value").notNull(),
  label: text("label").notNull(),
  category: text("category"), // For skills, tags, etc.
  country: text("country"), // For locations
  region: text("region"), // For locations
  description: text("description"), // For categories
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Filter Options Model Class
class FilterOptionsModel {
  // Get all filter options from database with fallback to static data
  static async getAllFilterOptions() {
    try {
      // Try to get all filter options from single table
      const allOptions = await db
        .select()
        .from(filterOptionsTable)
        .where(eq(filterOptionsTable.isActive, true))
        .orderBy(asc(filterOptionsTable.type), asc(filterOptionsTable.sortOrder), asc(filterOptionsTable.label));

      // Group by type
      const groupedOptions = allOptions.reduce((acc, option) => {
        const { type, value, label, category, country, region, description } = option;
        
        if (!acc[type]) {
          acc[type] = [];
        }

        // Format based on type
        if (type === 'skill' || type === 'tag') {
          acc[type].push(value); // Just the name for skills and tags
        } else if (type === 'category') {
          acc[type].push(value); // Just the name for categories
        } else if (type === 'location') {
          acc[type].push({ value, label, country, region });
        } else {
          acc[type].push({ value, label });
        }

        return acc;
      }, {});

      // Ensure all expected types exist
      const filterOptions = {
        statuses: groupedOptions.status || [],
        priorities: groupedOptions.priority || [],
        experienceLevels: groupedOptions.experience_level || [],
        workArrangements: groupedOptions.work_arrangement || [],
        paymentTerms: groupedOptions.payment_term || [],
        currencies: groupedOptions.currency || [],
        sortOptions: groupedOptions.sort_option || [],
        skills: groupedOptions.skill || [],
        locations: groupedOptions.location || [],
        categories: groupedOptions.category || [],
        tags: groupedOptions.tag || []
      };

      return filterOptions;
    } catch (error) {
      console.error('Error getting filter options from database, falling back to static data:', error.message);
      
      // Fallback to static data when database table doesn't exist
      return {
        statuses: this.getStaticStatuses(),
        priorities: this.getStaticPriorities(),
        experienceLevels: this.getStaticExperienceLevels(),
        workArrangements: this.getStaticWorkArrangements(),
        paymentTerms: this.getStaticPaymentTerms(),
        currencies: this.getStaticCurrencies(),
        sortOptions: this.getStaticSortOptions(),
        skills: this.getStaticSkills(),
        locations: this.getStaticLocations(),
        categories: this.getStaticCategories(),
        tags: this.getStaticTags()
      };
    }
  }

  // Seed filter options data
  static async seedFilterOptions() {
    try {
      const seedData = this.getSeedData();
      
      // Clear existing data
      await db.delete(filterOptionsTable);
      
      // Insert seed data
      await db.insert(filterOptionsTable).values(seedData);
      
      console.log('Filter options seeded successfully');
      return true;
    } catch (error) {
      console.error('Error seeding filter options:', error);
      throw error;
    }
  }

  // Get seed data for all filter options
  static getSeedData() {
    const seedData = [];

    // Status options
    const statuses = [
      { value: 'draft', label: 'Draft', sortOrder: 1 },
      { value: 'upcoming', label: 'Upcoming', sortOrder: 2 },
      { value: 'active', label: 'Active', sortOrder: 3 },
      { value: 'paused', label: 'Paused', sortOrder: 4 },
      { value: 'completed', label: 'Completed', sortOrder: 5 },
      { value: 'cancelled', label: 'Cancelled', sortOrder: 6 }
    ];
    statuses.forEach(item => {
      seedData.push({ type: 'status', ...item });
    });

    // Priority options
    const priorities = [
      { value: 'low', label: 'Low Priority', sortOrder: 1 },
      { value: 'medium', label: 'Medium Priority', sortOrder: 2 },
      { value: 'high', label: 'High Priority', sortOrder: 3 }
    ];
    priorities.forEach(item => {
      seedData.push({ type: 'priority', ...item });
    });

    // Experience levels
    const experienceLevels = [
      { value: 'entry', label: 'Entry Level', sortOrder: 1 },
      { value: 'mid', label: 'Mid Level', sortOrder: 2 },
      { value: 'senior', label: 'Senior Level', sortOrder: 3 },
      { value: 'lead', label: 'Lead/Principal', sortOrder: 4 }
    ];
    experienceLevels.forEach(item => {
      seedData.push({ type: 'experience_level', ...item });
    });

    // Work arrangements
    const workArrangements = [
      { value: 'remote', label: 'Remote', sortOrder: 1 },
      { value: 'onsite', label: 'On-site', sortOrder: 2 },
      { value: 'hybrid', label: 'Hybrid', sortOrder: 3 }
    ];
    workArrangements.forEach(item => {
      seedData.push({ type: 'work_arrangement', ...item });
    });

    // Payment terms
    const paymentTerms = [
      { value: 'fixed', label: 'Fixed Price', sortOrder: 1 },
      { value: 'hourly', label: 'Hourly Rate', sortOrder: 2 },
      { value: 'milestone', label: 'Milestone-based', sortOrder: 3 },
      { value: 'retainer', label: 'Retainer', sortOrder: 4 }
    ];
    paymentTerms.forEach(item => {
      seedData.push({ type: 'payment_term', ...item });
    });

    // Currencies
    const currencies = [
      { value: 'USD', label: 'US Dollar ($)', sortOrder: 1 },
      { value: 'EUR', label: 'Euro (€)', sortOrder: 2 },
      { value: 'GBP', label: 'British Pound (£)', sortOrder: 3 },
      { value: 'CAD', label: 'Canadian Dollar (C$)', sortOrder: 4 },
      { value: 'AUD', label: 'Australian Dollar (A$)', sortOrder: 5 },
      { value: 'INR', label: 'Indian Rupee (₹)', sortOrder: 6 }
    ];
    currencies.forEach(item => {
      seedData.push({ type: 'currency', ...item });
    });

    // Sort options
    const sortOptions = [
      { value: 'relevance', label: 'Most Relevant', sortOrder: 1 },
      { value: 'newest', label: 'Newest First', sortOrder: 2 },
      { value: 'deadline', label: 'Deadline', sortOrder: 3 },
      { value: 'budget', label: 'Budget (High to Low)', sortOrder: 4 },
      { value: 'rating', label: 'Rating', sortOrder: 5 },
      { value: 'applicants', label: 'Fewest Applicants', sortOrder: 6 }
    ];
    sortOptions.forEach(item => {
      seedData.push({ type: 'sort_option', ...item });
    });

    // Skills
    const skills = [
      'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Vue.js', 'Angular',
      'Express', 'Django', 'Flask', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Jenkins', 'Git',
      'GraphQL', 'REST API', 'Microservices', 'Blockchain', 'Solidity',
      'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Science', 'AI', 'NLP',
      'Java', 'C#', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
      'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'Material-UI',
      'Next.js', 'Nuxt.js', 'Svelte', 'Ember.js', 'Backbone.js', 'jQuery',
      'Laravel', 'Symfony', 'CodeIgniter', 'Spring Boot', 'Hibernate', 'JPA',
      'Elasticsearch', 'Apache Kafka', 'RabbitMQ', 'Apache Spark', 'Hadoop',
      'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Zeplin', 'Principle',
      'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Final Cut Pro',
      'WordPress', 'Drupal', 'Joomla', 'Magento', 'Shopify', 'WooCommerce',
      'Firebase', 'Supabase', 'Appwrite', 'Hasura', 'Prisma', 'Sequelize',
      'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Playwright', 'Puppeteer',
      'Webpack', 'Vite', 'Parcel', 'Rollup', 'Babel', 'ESLint', 'Prettier',
      'Linux', 'Windows', 'macOS', 'Ubuntu', 'CentOS', 'Debian', 'Red Hat',
      'Nginx', 'Apache', 'IIS', 'CloudFlare', 'CDN', 'Load Balancing',
      'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD', 'DDD'
    ];
    skills.forEach((skill, index) => {
      seedData.push({ 
        type: 'skill', 
        value: skill, 
        label: skill, 
        sortOrder: index + 1 
      });
    });

    // Locations
    const locations = [
      { value: 'Remote', label: 'Remote', country: 'Global', region: 'Global', sortOrder: 1 },
      { value: 'San Francisco, CA', label: 'San Francisco, CA', country: 'USA', region: 'North America', sortOrder: 2 },
      { value: 'New York, NY', label: 'New York, NY', country: 'USA', region: 'North America', sortOrder: 3 },
      { value: 'Austin, TX', label: 'Austin, TX', country: 'USA', region: 'North America', sortOrder: 4 },
      { value: 'Seattle, WA', label: 'Seattle, WA', country: 'USA', region: 'North America', sortOrder: 5 },
      { value: 'Los Angeles, CA', label: 'Los Angeles, CA', country: 'USA', region: 'North America', sortOrder: 6 },
      { value: 'Chicago, IL', label: 'Chicago, IL', country: 'USA', region: 'North America', sortOrder: 7 },
      { value: 'Boston, MA', label: 'Boston, MA', country: 'USA', region: 'North America', sortOrder: 8 },
      { value: 'Denver, CO', label: 'Denver, CO', country: 'USA', region: 'North America', sortOrder: 9 },
      { value: 'Miami, FL', label: 'Miami, FL', country: 'USA', region: 'North America', sortOrder: 10 },
      { value: 'London, UK', label: 'London, UK', country: 'UK', region: 'Europe', sortOrder: 11 },
      { value: 'Berlin, Germany', label: 'Berlin, Germany', country: 'Germany', region: 'Europe', sortOrder: 12 },
      { value: 'Amsterdam, Netherlands', label: 'Amsterdam, Netherlands', country: 'Netherlands', region: 'Europe', sortOrder: 13 },
      { value: 'Toronto, Canada', label: 'Toronto, Canada', country: 'Canada', region: 'North America', sortOrder: 14 },
      { value: 'Sydney, Australia', label: 'Sydney, Australia', country: 'Australia', region: 'Oceania', sortOrder: 15 },
      { value: 'Singapore', label: 'Singapore', country: 'Singapore', region: 'Asia', sortOrder: 16 },
      { value: 'Tokyo, Japan', label: 'Tokyo, Japan', country: 'Japan', region: 'Asia', sortOrder: 17 },
      { value: 'Bangalore, India', label: 'Bangalore, India', country: 'India', region: 'Asia', sortOrder: 18 },
      { value: 'Other', label: 'Other', country: 'Global', region: 'Global', sortOrder: 19 }
    ];
    locations.forEach(item => {
      seedData.push({ type: 'location', ...item });
    });

    // Categories
    const categories = [
      'Web Development', 'Mobile Development', 'Desktop Application',
      'Backend Development', 'Frontend Development', 'Full Stack Development',
      'DevOps', 'Data Science', 'Machine Learning', 'AI Development',
      'Blockchain', 'Game Development', 'UI/UX Design', 'Graphic Design',
      'Content Writing', 'Digital Marketing', 'SEO', 'Video Editing',
      'Audio Production', 'Translation', 'Research', 'Consulting', 'Other'
    ];
    categories.forEach((category, index) => {
      seedData.push({ 
        type: 'category', 
        value: category, 
        label: category, 
        sortOrder: index + 1 
      });
    });

    // Tags
    const tags = [
      'Frontend', 'Backend', 'Full Stack', 'Mobile', 'Web', 'API', 'Database', 
      'Cloud', 'DevOps', 'UI/UX', 'Design', 'Testing', 'Security', 'Performance',
      'Scalability', 'Architecture', 'Integration', 'Automation', 'Analytics',
      'E-commerce', 'SaaS', 'Startup', 'Enterprise', 'Open Source', 'Freelance'
    ];
    tags.forEach((tag, index) => {
      seedData.push({ 
        type: 'tag', 
        value: tag, 
        label: tag, 
        sortOrder: index + 1 
      });
    });

    return seedData;
  }

  // Static fallback data
  static getStaticStatuses() {
    return [
      { value: 'draft', label: 'Draft' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'active', label: 'Active' },
      { value: 'paused', label: 'Paused' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ];
  }

  static getStaticPriorities() {
    return [
      { value: 'low', label: 'Low Priority' },
      { value: 'medium', label: 'Medium Priority' },
      { value: 'high', label: 'High Priority' }
    ];
  }

  static getStaticExperienceLevels() {
    return [
      { value: 'entry', label: 'Entry Level' },
      { value: 'mid', label: 'Mid Level' },
      { value: 'senior', label: 'Senior Level' },
      { value: 'lead', label: 'Lead/Principal' }
    ];
  }

  static getStaticWorkArrangements() {
    return [
      { value: 'remote', label: 'Remote' },
      { value: 'onsite', label: 'On-site' },
      { value: 'hybrid', label: 'Hybrid' }
    ];
  }

  static getStaticPaymentTerms() {
    return [
      { value: 'fixed', label: 'Fixed Price' },
      { value: 'hourly', label: 'Hourly Rate' },
      { value: 'milestone', label: 'Milestone-based' },
      { value: 'retainer', label: 'Retainer' }
    ];
  }

  static getStaticCurrencies() {
    return [
      { value: 'USD', label: 'US Dollar ($)' },
      { value: 'EUR', label: 'Euro (€)' },
      { value: 'GBP', label: 'British Pound (£)' },
      { value: 'CAD', label: 'Canadian Dollar (C$)' },
      { value: 'AUD', label: 'Australian Dollar (A$)' },
      { value: 'INR', label: 'Indian Rupee (₹)' }
    ];
  }

  static getStaticSortOptions() {
    return [
      { value: 'relevance', label: 'Most Relevant' },
      { value: 'newest', label: 'Newest First' },
      { value: 'deadline', label: 'Deadline' },
      { value: 'budget', label: 'Budget (High to Low)' },
      { value: 'rating', label: 'Rating' },
      { value: 'applicants', label: 'Fewest Applicants' }
    ];
  }

  static getStaticSkills() {
    return [
      'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Vue.js', 'Angular',
      'Express', 'Django', 'Flask', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Jenkins', 'Git',
      'GraphQL', 'REST API', 'Microservices', 'Blockchain', 'Solidity',
      'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Science', 'AI', 'NLP',
      'Java', 'C#', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
      'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'Material-UI',
      'Next.js', 'Nuxt.js', 'Svelte', 'Ember.js', 'Backbone.js', 'jQuery',
      'Laravel', 'Symfony', 'CodeIgniter', 'Spring Boot', 'Hibernate', 'JPA',
      'Elasticsearch', 'Apache Kafka', 'RabbitMQ', 'Apache Spark', 'Hadoop',
      'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Zeplin', 'Principle',
      'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Final Cut Pro',
      'WordPress', 'Drupal', 'Joomla', 'Magento', 'Shopify', 'WooCommerce',
      'Firebase', 'Supabase', 'Appwrite', 'Hasura', 'Prisma', 'Sequelize',
      'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Playwright', 'Puppeteer',
      'Webpack', 'Vite', 'Parcel', 'Rollup', 'Babel', 'ESLint', 'Prettier',
      'Linux', 'Windows', 'macOS', 'Ubuntu', 'CentOS', 'Debian', 'Red Hat',
      'Nginx', 'Apache', 'IIS', 'CloudFlare', 'CDN', 'Load Balancing',
      'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD', 'DDD'
    ];
  }

  static getStaticLocations() {
    return [
      { value: 'Remote', label: 'Remote' },
      { value: 'San Francisco, CA', label: 'San Francisco, CA' },
      { value: 'New York, NY', label: 'New York, NY' },
      { value: 'Austin, TX', label: 'Austin, TX' },
      { value: 'Seattle, WA', label: 'Seattle, WA' },
      { value: 'Los Angeles, CA', label: 'Los Angeles, CA' },
      { value: 'Chicago, IL', label: 'Chicago, IL' },
      { value: 'Boston, MA', label: 'Boston, MA' },
      { value: 'Denver, CO', label: 'Denver, CO' },
      { value: 'Miami, FL', label: 'Miami, FL' },
      { value: 'London, UK', label: 'London, UK' },
      { value: 'Berlin, Germany', label: 'Berlin, Germany' },
      { value: 'Amsterdam, Netherlands', label: 'Amsterdam, Netherlands' },
      { value: 'Toronto, Canada', label: 'Toronto, Canada' },
      { value: 'Sydney, Australia', label: 'Sydney, Australia' },
      { value: 'Singapore', label: 'Singapore' },
      { value: 'Tokyo, Japan', label: 'Tokyo, Japan' },
      { value: 'Bangalore, India', label: 'Bangalore, India' },
      { value: 'Other', label: 'Other' }
    ];
  }

  static getStaticCategories() {
    return [
      'Web Development',
      'Mobile Development', 
      'Desktop Application',
      'Backend Development',
      'Frontend Development',
      'Full Stack Development',
      'DevOps',
      'Data Science',
      'Machine Learning',
      'AI Development',
      'Blockchain',
      'Game Development',
      'UI/UX Design',
      'Graphic Design',
      'Content Writing',
      'Digital Marketing',
      'SEO',
      'Video Editing',
      'Audio Production',
      'Translation',
      'Research',
      'Consulting',
      'Other'
    ];
  }

  static getStaticTags() {
    return [
      'Frontend', 'Backend', 'Full Stack', 'Mobile', 'Web', 'API', 'Database', 
      'Cloud', 'DevOps', 'UI/UX', 'Design', 'Testing', 'Security', 'Performance',
      'Scalability', 'Architecture', 'Integration', 'Automation', 'Analytics',
      'E-commerce', 'SaaS', 'Startup', 'Enterprise', 'Open Source', 'Freelance'
    ];
  }
}

module.exports = {
  // Enum
  filterTypeEnum,
  
  // Table
  filterOptionsTable,
  
  // Model
  FilterOptionsModel,
};
