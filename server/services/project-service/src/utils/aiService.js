const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI (guard for missing API key)
const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = GOOGLE_API_KEY ? new GoogleGenerativeAI(GOOGLE_API_KEY) : null;

class AIService {
  constructor() {
    this.modelName = process.env.GOOGLE_GENERATIVE_AI_MODEL || "gemini-1.5-flash-latest"; // compatible model for generateContent
    this.model = genAI ? genAI.getGenerativeModel({ model: this.modelName }) : null;
  }

  /**
   * Generate AI-enhanced project description
   */
  async generateProjectDescription(projectData) {
    try {
      const prompt = this.buildDescriptionPrompt(projectData);
      if (!this.model) {
        return this.generateDescriptionFallback(projectData);
      }
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating project description:', error);
      // Return fallback instead of failing the request
      return this.generateDescriptionFallback(projectData);
    }
  }

  /**
   * Generate project title suggestions
   */
  async generateProjectTitles(projectData) {
    try {
      const prompt = this.buildTitlePrompt(projectData);
      if (!this.model) {
        return this.generateTitlesFallback(projectData);
      }
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const titles = response.text().split('\n').filter(title => title.trim());
      return titles.slice(0, 5); // Return top 5 suggestions
    } catch (error) {
      console.error('Error generating project titles:', error);
      throw new Error('Failed to generate AI titles');
    }
  }

  /**
   * Generate skill suggestions based on project details
   */
  async generateSkillSuggestions(projectData) {
    try {
      const prompt = this.buildSkillPrompt(projectData);
      if (!this.model) {
        return this.generateSkillsFallback(projectData);
      }
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const skills = response.text().split('\n').filter(skill => skill.trim());
      return skills.slice(0, 10); // Return top 10 suggestions
    } catch (error) {
      console.error('Error generating skill suggestions:', error);
      throw new Error('Failed to generate AI skills');
    }
  }

  /**
   * Generate project requirements suggestions
   */
  async generateRequirements(projectData) {
    try {
      const prompt = this.buildRequirementsPrompt(projectData);
      if (!this.model) {
        return this.generateRequirementsFallback(projectData);
      }
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating requirements:', error);
      // Return fallback instead of failing the request
      return this.generateRequirementsFallback(projectData);
    }
  }

  /**
   * Generate project benefits suggestions
   */
  async generateBenefits(projectData) {
    try {
      const prompt = this.buildBenefitsPrompt(projectData);
      if (!this.model) {
        return this.generateBenefitsFallback(projectData);
      }
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating benefits:', error);
      // Return fallback instead of failing the request
      return this.generateBenefitsFallback(projectData);
    }
  }

  /**
   * Generate budget range suggestions
   */
  async generateBudgetSuggestions(projectData) {
    try {
      const prompt = this.buildBudgetPrompt(projectData);
      if (!this.model) {
        return this.generateBudgetFallback(projectData);
      }
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const budget = response.text().trim();
      return this.parseBudgetSuggestion(budget);
    } catch (error) {
      console.error('Error generating budget suggestions:', error);
      throw new Error('Failed to generate AI budget');
    }
  }

  /**
   * Generate comprehensive project suggestions
   */
  async generateComprehensiveSuggestions(projectData) {
    try {
      const [description, titles, skills, requirements, benefits, budget] = await Promise.all([
        this.generateProjectDescription(projectData),
        this.generateProjectTitles(projectData),
        this.generateSkillSuggestions(projectData),
        this.generateRequirements(projectData),
        this.generateBenefits(projectData),
        this.generateBudgetSuggestions(projectData)
      ]);

      return {
        description,
        titles,
        skills,
        requirements,
        benefits,
        budget
      };
    } catch (error) {
      console.error('Error generating comprehensive suggestions:', error);
      // Fallback to local generation for comprehensive if AI fails
      return {
        description: this.generateDescriptionFallback(projectData),
        titles: this.generateTitlesFallback(projectData),
        skills: this.generateSkillsFallback(projectData),
        requirements: this.generateRequirementsFallback(projectData),
        benefits: this.generateBenefitsFallback(projectData),
        budget: this.generateBudgetFallback(projectData)
      };
    }
  }

  // Private helper methods for building prompts
  buildDescriptionPrompt(projectData) {
    const { title, category, experience, location, company, budget } = projectData;
    
    return `You are an expert project manager and technical writer. Generate a compelling, professional project description for a ${category} project.

Project Details:
- Title: ${title || 'Not specified'}
- Category: ${category || 'Not specified'}
- Experience Level: ${experience || 'Not specified'}
- Location: ${location || 'Not specified'}
- Company: ${company || 'Not specified'}
- Budget: ${budget || 'Not specified'}

Requirements:
1. Write a professional, engaging project description (200-300 words)
2. Include clear project objectives and deliverables
3. Mention key technologies and skills needed
4. Highlight what makes this project exciting and valuable
5. Use industry-standard terminology
6. Make it attractive to skilled developers
7. Include project scope and timeline expectations
8. End with a call to action for potential applicants

Format the response as a single, well-structured paragraph without any markdown formatting.`;
  }

  buildTitlePrompt(projectData) {
    const { category, experience, company } = projectData;
    
    return `Generate 5 creative, professional project titles for a ${category} project.

Requirements:
- Each title should be 3-8 words
- Make them specific and descriptive
- Include relevant technology or domain keywords
- Make them appealing to ${experience} developers
- Vary the style (some technical, some business-focused)
- Avoid generic terms like "Project" or "Development"

Format as a simple list, one title per line.`;
  }

  buildSkillPrompt(projectData) {
    const { category, experience, title } = projectData;
    
    return `Suggest 10 essential technical skills and technologies needed for a ${category} project titled "${title}".

Requirements:
- Include both hard skills (programming languages, frameworks, tools) and soft skills
- Prioritize skills based on ${experience} level
- Include modern, in-demand technologies
- Mix of frontend, backend, and general skills
- Include specific versions or variants when relevant

Format as a simple list, one skill per line.`;
  }

  buildRequirementsPrompt(projectData) {
    const { category, experience, title } = projectData;
    
    return `Generate detailed project requirements for a ${category} project titled "${title}" targeting ${experience} developers.

Include:
1. Technical requirements (technologies, frameworks, tools)
2. Experience requirements (years, specific expertise)
3. Project-specific requirements (deliverables, features)
4. Communication and collaboration requirements
5. Timeline and availability requirements
6. Quality standards and testing requirements

Format as a professional requirements document with clear sections.`;
  }

  buildBenefitsPrompt(projectData) {
    const { category, company, budget } = projectData;
    
    return `Suggest attractive benefits and perks for a ${category} project at ${company}.

Include:
1. Financial benefits (competitive pay, bonuses, equity)
2. Professional development opportunities
3. Work-life balance benefits
4. Technology and learning opportunities
5. Career advancement prospects
6. Team and company culture benefits
7. Project-specific benefits

Make it appealing to skilled developers and highlight unique value propositions.`;
  }

  buildBudgetPrompt(projectData) {
    const { category, experience, duration, location } = projectData;
    
    return `Suggest an appropriate budget range for a ${category} project.

Consider:
- Experience level: ${experience}
- Project duration: ${duration || 'Not specified'}
- Location: ${location || 'Not specified'}
- Project complexity and scope
- Market rates for similar projects
- Remote vs on-site work

Provide a realistic budget range in USD format (e.g., "$5,000 - $8,000" or "$50 - $80 per hour").
Only return the budget range, no additional text.`;
  }

  parseBudgetSuggestion(budgetText) {
    // Extract budget range from AI response
    const budgetMatch = budgetText.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?/g);
    if (budgetMatch && budgetMatch.length > 0) {
      return budgetMatch[0];
    }
    return "Budget TBD";
  }

  // ===== Local fallback generators (no external API) =====
  generateDescriptionFallback(details) {
    const { title = '', category = '', skills = [], budget = '', duration = '', experience = '', location = '', company = '', requirements = '', benefits = '' } = details || {};
    let description = `We're seeking a ${experience || 'skilled'} ${category || 'software'} professional to join an exciting project${title ? `: ${title}` : ''}. `;
    if (skills && skills.length) {
      description += `Ideal experience with ${skills.slice(0, 3).join(', ')}${skills.length > 3 ? ' and more' : ''}. `;
    }
    if (requirements) description += `${requirements} `;
    if (budget) description += `Budget: ${budget}. `;
    if (duration) description += `Duration: ${duration}. `;
    if (location) description += `Location: ${location}. `;
    if (benefits) description += `Benefits include ${benefits}. `;
    description += `Join ${company || 'our team'} to build impactful solutions with modern best practices.`;
    return description;
  }

  generateTitlesFallback(details) {
    const { category = 'Project', title = '' } = details || {};
    const base = title || category;
    return [
      `${base} Initiative Lead`,
      `${base} Implementation`,
      `Senior ${base} Specialist`,
      `${base} Engineer (Contract)`,
      `${base} Developer`
    ];
  }

  generateSkillsFallback(details) {
    const { category = '' } = details || {};
    const common = ['JavaScript', 'TypeScript', 'Node.js', 'REST API', 'Git', 'Testing'];
    if (/mobile/i.test(category)) return ['React Native', 'Flutter', 'Kotlin', 'Swift', ...common];
    if (/web/i.test(category)) return ['React', 'Next.js', 'Node.js', 'PostgreSQL', ...common];
    return ['Problem Solving', 'Communication', ...common];
  }

  generateRequirementsFallback(details) {
    const { category = 'project', title = '', experience = 'Mid Level' } = details || {};
    return [
      `Technical Requirements`,
      `- Proficiency with technologies commonly used in ${category} projects`,
      `- Strong understanding of system design, testing, and CI/CD`,
      `- Ability to write clean, maintainable, well-documented code`,
      '',
      `Experience Requirements`,
      `- ${experience} experience delivering production-grade solutions`,
      `- Prior work on similar ${title || category} initiatives is a plus`,
      '',
      `Project Responsibilities`,
      `- Implement core features from spec, write unit/integration tests`,
      `- Participate in code reviews and follow agreed coding standards`,
      `- Contribute to technical documentation and release notes`,
      '',
      `Collaboration & Communication`,
      `- Communicate progress and risks proactively in stand‑ups`,
      `- Work closely with stakeholders to refine requirements`,
      '',
      `Timeline & Quality`,
      `- Meet sprint milestones and definition of done`,
      `- Ensure performance, security, and accessibility best practices`,
    ].join('\n');
  }

  generateBenefitsFallback(details) {
    return `Competitive compensation, flexible schedule, remote-friendly, learning budget, modern tooling.`;
  }

  generateBudgetFallback(details) {
    return '$5,000 - $10,000';
  }
}

module.exports = new AIService();
