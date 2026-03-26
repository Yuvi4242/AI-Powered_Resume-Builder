import { FiBook, FiBriefcase, FiUser } from 'react-icons/fi';

export const resourceData = [
  {
    id: 1,
    title: "How to Write a Strong Resume",
    category: "Resume",
    description: "Learn the fundamentals of building a high-impact, professional resume from scratch.",
    icon: FiBook,
    readTime: "5 min read",
    content: `
      Writing a strong resume is about more than just listing your jobs; it's about showcasing your impact.
      
      ### 1. Use Action Verbs
      Instead of "Responsible for," use words like "Developed," "Managed," or "Optimized." This makes your contributions sound more proactive.
      
      ### 2. Quantify Your Achievements
      Numbers speak louder than words. Instead of saying "Improved sales," say "Increased sales by 25% over 6 months."
      
      ### 3. Keep it Concise
      A recruiter spends about 6-10 seconds on a resume. Keep it to 1-2 pages and use clear headings and bullet points.
      
      ### 4. Tailor for the Job
      Match your skills and experience to the specific job description. Use the same keywords the employer uses.
    `
  },
  {
    id: 2,
    title: "Top 10 Resume Mistakes to Avoid",
    category: "Resume",
    description: "Stop making these common errors that cost candidates their dream job interviews.",
    icon: FiBook,
    readTime: "4 min read",
    content: `
      Even the best candidates can get rejected due to simple resume mistakes. Here are the top 10 to watch out for:
      
      1. **Spelling and Grammar Errors**: Always proofread multiple times.
      2. **Irrelevant Personal Info**: Don't include age, marital status, or profile pictures (unless required in your region).
      3. **Long Paragraphs**: Use bullet points for readability.
      4. **Generic Objectives**: Replace "Seeking a challenging role" with a specific professional summary.
      5. **Empty Buzzwords**: Avoid "Team player" or "Hard worker" without proof.
      6. **Old/Incorrect Contact Info**: Ensure your phone and email are current.
      7. **Too Much Text**: Use white space effectively.
      8. **Unprofessional Email**: Use a standard name-based email address.
      9. **Lying or Exaggerating**: Honesty is always the best policy.
      10. **Poor Formatting**: Stick to a clean, ATS-friendly layout.
    `
  },
  {
    id: 3,
    title: "How to Pass ATS Systems",
    category: "Resume",
    description: "Understanding how Applicant Tracking Systems work and how to optimize for them.",
    icon: FiBook,
    readTime: "6 min read",
    content: `
      Most Fortune 500 companies use an Applicant Tracking System (ATS) to filter resumes before a human ever sees them.
      
      ### Optimization Tips:
      - **Use Standard Headings**: Stick to "Experience," "Education," and "Skills."
      - **Simple Formatting**: Avoid tables, columns, or complex graphics inside the main body.
      - **Keywords are Key**: Scan the job description for skills and tools, and include them in your resume.
      - **File Formats**: While PDF is generally best, some older systems prefer .docx.
      - **No Headers/Footers**: Don't put crucial info in the header or footer, as some systems skip them.
    `
  },
  {
    id: 4,
    title: "Common HR Interview Questions",
    category: "Interview",
    description: "Master the most frequently asked HR questions with our guided response bank.",
    icon: FiBriefcase,
    readTime: "8 min read",
    content: `
      HR interviews are designed to assess your cultural fit and general professional background.
      
      ### "Tell me about yourself"
      Focus on your past (experience), present (current role), and future (why this job).
      
      ### "What is your greatest weakness?"
      Mention a real weakness, but immediately follow up with what you are doing to improve it.
      
      ### "Why should we hire you?"
      Connect your unique skills directly to the problems the company is trying to solve.
    `
  },
  {
    id: 5,
    title: "Technical Interview Success Tips",
    category: "Interview",
    description: "Strategies for whiteboard coding, system design, and technical problem solving.",
    icon: FiBriefcase,
    readTime: "10 min read",
    content: `
      Technical interviews are about more than just getting the right answer; they are about your thought process.
      
      - **Think Out Loud**: Explain your logic as you code. This helps the interviewer follow your reasoning.
      - **Clarify the Problem**: Ask questions before jumping into the solution.
      - **Consider Edge Cases**: What happens if the input is empty? Or extremely large?
      - **Optimize**: Start with a brute force solution, then explain how to improve it (Time/Space complexity).
    `
  },
  {
    id: 6,
    title: "Mastering Behavioral Questions",
    category: "Interview",
    description: "Use the STAR method to ace behavioral interviews and showcase your soft skills.",
    icon: FiBriefcase,
    readTime: "7 min read",
    content: `
      Behavioral questions ("Tell me about a time when...") are best answered using the **STAR Method**:
      
      - **S (Situation)**: Set the scene and provide necessary context.
      - **T (Task)**: Describe what your responsibility was in that situation.
      - **A (Action)**: Explain exactly what steps you took to address the situation.
      - **R (Result)**: Share what the outcome was and what you learned.
    `
  },
  {
    id: 7,
    title: "Software Engineer Career Guide",
    category: "Career",
    description: "A complete roadmap from learning to code to landing a senior engineering role.",
    icon: FiUser,
    readTime: "12 min read",
    content: `
      Becoming a software engineer is a journey of continuous learning.
      
      ### Step 1: Foundations
      Master data structures, algorithms, and at least one high-level language (JavaScript, Python, Java).
      
      ### Step 2: Build Projects
      Don't just watch tutorials. Build real applications that solve problems. Hosting on GitHub is essential.
      
      ### Step 3: Networking
      Attend meetups, contribute to open source, and connect with engineers in the industry.
    `
  },
  {
    id: 8,
    title: "Data Analyst Career Path",
    category: "Career",
    description: "Essential skills, tools, and projects needed to start a career in data analytics.",
    icon: FiUser,
    readTime: "11 min read",
    content: `
      Data analysis is about turning raw data into meaningful insights.
      
      - **Core Tools**: Excel (Advanced), SQL, and a visualization tool (Tableau, PowerBI).
      - **Programming**: Python or R for more advanced statistical analysis.
      - **Statistics**: Understanding probability, distribution, and hypothesis testing.
      - **Portfolio**: Create case studies showing how you analyzed a dataset to solve a business problem.
    `
  },
  {
    id: 9,
    title: "Resume Tips for Freshers",
    category: "Career",
    description: "How to showcase projects and internships when you don't have full-time experience.",
    icon: FiUser,
    readTime: "5 min read",
    content: `
      If you're a recent graduate, your resume should focus on potential and academic achievements.
      
      - **Education First**: Place your education section at the top.
      - **Showcase Projects**: Highlighting your GitHub or academic projects is crucial.
      - **Include Internships**: Even unpaid or short-term internships provide valuable experience.
      - **Highlight Skills**: Focus on technical skills and soft skills learned through coursework or clubs.
    `
  }
];
