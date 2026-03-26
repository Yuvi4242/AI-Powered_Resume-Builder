export const templatesData = [
  {
    id: 'template1',
    title: 'Software Engineer Resume',
    name: 'Minimal SWE',
    category: 'Engineering',
    experienceLevel: 'Fresher',
    type: 'Modern',
    layoutType: 'software',
    tags: ['ATS', 'Clean'],
    preview: 'https://placehold.co/300x400/e2e8f0/64748b?text=SWE+Preview',
    sections: ['profile', 'summary', 'skills', 'projects', 'experience', 'education'],
    sampleData: {
      name: 'Alex Rivera',
      email: 'alex.rivera@tech.io',
      phone: '+1 415 555 0123',
      location: 'San Francisco, CA',
      github: 'github.com/arivera',
      linkedin: 'linkedin.com/in/alexrivera',
      summary: 'Passionate Full Stack Developer with experience in building scalable web applications using the MERN stack. Strong focus on UI/UX and performance optimization.',
      skills: 'JavaScript, React, Node.js, Express, MongoDB, Tailwind CSS, Docker',
      projects: [
        { title: 'E-commerce MERN App', tech: 'React, Node.js, Stripe', description: 'Built a full-featured online store with Stripe integration and JWT auth.' },
        { title: 'AI Resume Builder', tech: 'React, Gemini API, Tailwind', description: 'Developed an agentic AI tool for automated resume generation.' }
      ],
      experience: [
        { role: 'Frontend Intern', company: 'CloudScale', duration: '2023 - Present', description: 'Developed responsive dashboard components using React and Tailwind.\nOptimized data fetching logic reducing initial load time by 20%.' }
      ],
      education: [
        { degree: 'B.S. Computer Science', school: 'University of California, Berkeley', year: '2024' }
      ],
    }
  },
  {
    id: 'template2',
    title: 'Data Analyst Resume',
    name: 'Data Visualization',
    category: 'Engineering',
    experienceLevel: 'Mid-Level',
    type: 'Professional',
    layoutType: 'data',
    tags: ['ATS'],
    preview: 'https://placehold.co/300x400/dbeafe/3b82f6?text=Data+Preview',
    sections: ['profile', 'summary', 'skills', 'projects', 'certifications', 'experience', 'education'],
    sampleData: {
      name: 'Sarah Chen',
      email: 'sarah.chen@data.com',
      phone: '+1 202 555 0198',
      summary: 'Detail-oriented Data Analyst with 3+ years of experience in data cleaning, visualization, and statistical modeling. Proven track record of delivering actionable insights to stakeholders.',
      skills: 'Python, SQL, Tableau, Power BI, Excel, R, Scikit-learn',
      projects: [
        { title: 'Sales Forecasting Model', tech: 'Python, Time-Series', description: 'Developed a time-series model increasing inventory accuracy by 15%.' },
        { title: 'Customer Segmentation', tech: 'SQL, K-means', description: 'Performed K-means clustering on 1M+ records for targeted marketing.' }
      ],
      experience: [
        { role: 'Junior Data Analyst', company: 'RetailMetrics', duration: '2021 - 2023', description: 'Automated weekly reporting using SQL and Python, saving 10 hours per week.\nBuilt interactive Tableau dashboards for executive teams.' }
      ],
      education: [
        { degree: 'B.A. Statistics', school: 'Rice University', year: '2021' }
      ],
    }
  },
  {
    id: 'template3',
    title: 'Marketing Lead Resume',
    name: 'Creative Marketing',
    category: 'Marketing',
    experienceLevel: 'Senior',
    type: 'Creative',
    layoutType: 'marketing',
    tags: [],
    preview: 'https://placehold.co/300x400/f3e8ff/a855f7?text=Marketing+Preview',
    sections: ['profile', 'summary', 'skills', 'campaigns', 'achievements', 'education'],
    sampleData: {
      name: 'Marcus Thorne',
      email: 'm.thorne@marketing.co',
      phone: '+1 646 555 0147',
      summary: 'Dynamic Marketing Strategist with 8+ years of experience driving brand growth through data-driven campaigns. Expert in SEO/SEM, content strategy, and multi-channel performance marketing.',
      skills: 'Digital Strategy, SEO/SEM, Google Ads, Meta Ads, HubSpot, Content Marketing, Brand Positioning',
      campaigns: 'Instagram Growth Campaign: Achieved +200% organic reach in 6 months for a luxury retail brand.\nProduct Launch: Spearheaded the digital rollout of "Apparel-X" resulting in $2M sales in Q1.',
      achievements: 'Marketer of the Year 2022 - Global Ad Council\nIncreased conversion rate by 35% through A/B testing landing pages.',
      education: 'M.B.A. Marketing, NYU Stern School of Business',
    }
  },
  {
    id: 'template4',
    title: 'Business Manager Resume',
    name: 'Senior Professional',
    category: 'Business',
    experienceLevel: 'Senior',
    type: 'Professional',
    layoutType: 'business',
    tags: ['ATS'],
    preview: 'https://placehold.co/300x400/fce7f3/ec4899?text=Senior+Preview',
    sections: ['profile', 'summary', 'experience', 'skills', 'education'],
    sampleData: {
      name: 'Robert Sterling',
      email: 'sterling.r@exec.net',
      phone: '+44 20 7946 0123',
      location: 'London, UK',
      summary: 'Visionary Executive with 15+ years of leadership in global operations and strategic business development. Expert in P&L management, organizational restructuring, and scaling high-growth startups.',
      experience: [
        { role: 'Director of Operations', company: 'Global Logistics', duration: '2018 - Present', description: 'Managed annual budget of $50M while reducing overhead costs by 18%.\nLed a team of 150+ across 5 international offices.' }
      ],
      skills: 'Strategic Planning, Change Management, P&L Accountability, Cross-functional Leadership',
      education: [
        { degree: 'B.S. Economics', school: 'London School of Economics', year: '2008' }
      ],
    }
  },
  {
    id: 'template5',
    title: 'UI/UX Designer Resume',
    name: 'Modern Designer',
    category: 'Design',
    experienceLevel: 'Mid-Level',
    type: 'Modern',
    layoutType: 'designer',
    tags: ['ATS'],
    preview: 'https://placehold.co/300x400/e0e7ff/6366f1?text=Designer+Preview',
    sections: ['profile', 'portfolio', 'skills', 'projects', 'experience', 'education'],
    sampleData: {
      name: 'Elena Vance',
      email: 'elena.design@portfolio.io',
      phone: '+1 503 555 0101',
      portfolio: 'https://behance.net/elenavance',
      skills: 'Figma, Adobe XD, Photoshop, Illustrator, Prototyping, Wireframing, User Research, Design Systems',
      projects: 'Mobile Banking App: Designed end-to-end interface for a neobank with focus on accessibility.\nE-learning Platform: Conducted user testing and redesigned navigation increasing NPS by 25.',
      experience: 'UI Designer at WebGenix (2022 - Present)\n- Created a comprehensive design system adopted by 4 product teams.\n- Collaborated with developers to ensure pixel-perfect implementation.',
      education: 'B.F.A. Graphic Design, Rhode Island School of Design',
    }
  },
  {
    id: 'template6',
    title: 'Fresher Resume',
    name: 'Academic Star',
    category: 'Business',
    experienceLevel: 'Fresher',
    type: 'Simple',
    layoutType: 'fresher',
    tags: ['ATS', 'Overleaf', 'LaTeX-Style'],
    preview: 'https://placehold.co/300x400/d1fae5/10b981?text=Academic+Style',
    sections: ['profile', 'education', 'skills', 'projects', 'internships', 'technical_skills', 'achievements', 'certifications'],
    sampleData: {
      name: 'Aryan Sharma',
      email: 'aryan.sharma@example.com',
      phone: '+91 98765 43210',
      city: 'Mumbai',
      state: 'Maharashtra',
      linkedin: 'linkedin.com/in/aryansharma',
      github: 'github.com/aryansharma',
      education: 'Indian Institute of Technology, Bombay\nBachelor of Technology in Computer Science & Engineering; CGPA: 9.3/10\nJuly 2020 -- June 2024',
      skills: 'Data Structures & Algorithms, Operating Systems, Database Management Systems, Object Oriented Programming, Computer Networks, Web Development',
      projects: 'Smart Traffic Management System | Python, IoT, OpenCV\n- Developed an automated traffic control system using real-time video processing.\n- Reduced average wait time at intersections by 25% in simulation tests.\n- [GitHub Link](github.com/aryansharma/traffic-system)\n\nPersonal Portfolio Website | React, Tailwind CSS, Framer Motion\n- Built a high-performance personal brand site with smooth animations.\n- Achievement: Optimized for 100/100 Lighthouse performance score.\n- [Live Demo](aryansharma.dev)',
      internships: 'Software Engineering Intern at TechSolutions\nMay 2023 -- July 2023\n- Developed and integrated 5+ RESTful APIs using Node.js and Express.\n- Collaborated with the QA team to resolve 20+ critical bugs before product launch.',
      technical_skills: 'Languages: C++, Python, JavaScript, SQL, HTML/CSS\nFrameworks: React.js, Node.js, Express.js, Bootstrap\nTools: Git, VS Code, Postman, Docker, AWS',
      achievements: 'Winner of Hack-IITB 2023 out of 200+ teams\nGlobal Rank 412 in Google Kickstart Round F\nActive member of Coding Club IITB',
      certifications: 'AWS Certified Cloud Practitioner\nNPTEL Course on Data Structures & Algorithms (Elite+Gold)',
    }
  }
,
  {
    id: 'sidebar-template',
    title: 'Professional Sidebar Resume',
    name: 'Executive Sidebar',
    category: 'Professional',
    experienceLevel: 'Senior',
    type: 'Modern',
    layoutType: 'sidebar',
    tags: ['Sidebar', 'Two-Column', 'Professional'],
    preview: 'https://placehold.co/300x400/1e293b/ffffff?text=Sidebar+Template',
    sections: ['profile', 'skills', 'experience', 'research', 'publications', 'education'],
    sampleData: {
      name: 'Dr. Julian Thorne',
      title: 'Senior Data Engineer',
      email: 'j.thorne@research.lab',
      phone: '+44 20 7946 0958',
      location: 'London, UK',
      linkedin: 'linkedin.com/in/jthorne',
      github: 'github.com/jthorne',
      website: 'jthorne.ai',
      summary: 'Senior Data Engineer with a PhD in Distributed Systems. Specialized in building high-throughput data pipelines and performing advanced statistical research for autonomous systems.',
      skills: 'Apache Spark, Kubernetes, Distributed Systems, Cloud Architecture, TensorFlow, Neural Networks',
      programmingSkills: 'Python:95, Scala:85, Go:80, SQL:90, Rust:70',
      experience: 'Lead Data Engineer at DeepScale AI (2019 - Present)\n- Architected a real-time ingestion layer handling 50TB/day.\n- Improved model training efficiency by 40% through GPU-optimized scheduling.\n\nSenior Systems Engineer at TechCore Systems (2015 - 2018)\n- Designed fault-tolerant message brokers using Kafka.\n- Led a team of 12 engineers in migrating legacy infrastructure to GCP.',
      research: 'PhD Thesis: "Optimizing Consensus Algorithms in Low-Latency Mesh Networks"\nPublished at USENIX 2014.\nTools: C++, NS-3 Simulator, MPI.',
      publications: 'Thorne, J., et al. "Scalable Data Mesh Architectures," Journal of Cloud Computing, 2021.\n"The Future of Federated Learning in Finance," IEEE Tech Review, 2022.',
      education: 'Ph.D. in Computer Science, Imperial College London\nB.Sc. in Mathematics, University of Oxford'
    }
  }
];
