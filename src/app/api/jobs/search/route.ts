import { NextRequest, NextResponse } from 'next/server';

interface JobListing {
  id: string;
  title: string;
  company: string;
  industry: string;
  industryZh: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  description: string;
  requirements: string[];
  logo?: string;
  url?: string;
}

const mockJobs: JobListing[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Solutions Ltd',
    industry: 'Information & Technology',
    industryZh: '資訊與技術',
    location: 'Hong Kong',
    type: 'Full-time',
    salary: '$35,000 - $45,000',
    postedDate: '2024-01-15',
    description: 'We are looking for an experienced software engineer to join our dynamic team. The ideal candidate will have strong experience in modern web technologies and a passion for creating innovative solutions.',
    requirements: ['5+ years experience', 'React/Node.js', 'Bachelor\'s degree', 'Team leadership'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '2',
    title: 'Marketing Manager',
    company: 'Global Marketing Group',
    industry: 'Marketing & PR',
    industryZh: '市场营销与公关',
    location: 'Kowloon, Hong Kong',
    type: 'Full-time',
    salary: '$28,000 - $35,000',
    postedDate: '2024-01-14',
    description: 'Lead our marketing team and drive brand growth strategies. This role requires a strategic thinker with experience in digital marketing and team management.',
    requirements: ['8+ years experience', 'Digital marketing', 'Team leadership', 'MBA preferred'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '3',
    title: 'Financial Analyst',
    company: 'Investment Bank Asia',
    industry: 'Banking & Financial Services',
    industryZh: '银行与金融服务',
    location: 'Central, Hong Kong',
    type: 'Full-time',
    salary: '$30,000 - $40,000',
    postedDate: '2024-01-13',
    description: 'Analyze financial data and provide investment recommendations. Join our prestigious investment bank and work with top-tier financial professionals.',
    requirements: ['CFA preferred', '3+ years experience', 'Excel expert', 'Financial modeling'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '4',
    title: 'UX Designer',
    company: 'Creative Digital Agency',
    industry: 'Design & Architecture',
    industryZh: '设计与建筑',
    location: 'Hong Kong',
    type: 'Full-time',
    salary: '$25,000 - $32,000',
    postedDate: '2024-01-12',
    description: 'Create amazing user experiences for web and mobile applications. We are looking for a creative designer who can translate user needs into engaging interfaces.',
    requirements: ['Figma proficiency', '3+ years experience', 'Portfolio required', 'User research'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '5',
    title: 'Sales Executive',
    company: 'Sales Pro Limited',
    industry: 'Sales',
    industryZh: '销售',
    location: 'Tsim Sha Tsui, Hong Kong',
    type: 'Full-time',
    salary: '$20,000 - $25,000 + Commission',
    postedDate: '2024-01-11',
    description: 'Drive sales growth and build client relationships. This is an excellent opportunity for a motivated sales professional to grow their career.',
    requirements: ['Sales experience', 'Communication skills', 'Target-driven', 'B2B sales'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'AI Tech Solutions',
    industry: 'Information & Technology',
    industryZh: '資訊與技術',
    location: 'Hong Kong Science Park',
    type: 'Full-time',
    salary: '$40,000 - $55,000',
    postedDate: '2024-01-10',
    description: 'Join our AI team and work on cutting-edge machine learning projects. We are looking for someone passionate about data and innovation.',
    requirements: ['Python/R expertise', 'Machine learning', 'Statistics', 'PhD preferred'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '7',
    title: 'Human Resources Manager',
    company: 'Talent First Consulting',
    industry: 'HR & Staffing',
    industryZh: '人力资源与招聘',
    location: 'Wan Chai, Hong Kong',
    type: 'Full-time',
    salary: '$32,000 - $42,000',
    postedDate: '2024-01-09',
    description: 'Lead HR operations and talent acquisition strategies. We need an experienced HR professional to manage our growing team.',
    requirements: ['HR certification', '8+ years experience', 'Labor law knowledge', 'Strategic planning'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '8',
    title: 'Accountant',
    company: 'Financial Services Ltd',
    industry: 'Accounting & Finance',
    industryZh: '会计与金融',
    location: 'Central, Hong Kong',
    type: 'Full-time',
    salary: '$22,000 - $28,000',
    postedDate: '2024-01-08',
    description: 'Manage financial records and ensure compliance with accounting standards. Join our reputable accounting firm.',
    requirements: ['CPA/ACCA', '3+ years experience', 'Hong Kong tax law', 'Financial reporting'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '9',
    title: 'Project Manager',
    company: 'Construction Plus',
    industry: 'Construction',
    industryZh: '建筑与工程',
    location: 'Kowloon, Hong Kong',
    type: 'Full-time',
    salary: '$35,000 - $45,000',
    postedDate: '2024-01-07',
    description: 'Oversee construction projects and ensure timely delivery. We need an experienced project manager for our expanding portfolio.',
    requirements: ['PMP certification', '5+ years experience', 'Construction background', 'Budget management'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '10',
    title: 'Customer Service Representative',
    company: 'Service Excellence Ltd',
    industry: 'Customer Service',
    industryZh: '客户服务',
    location: 'Tsuen Wan, Hong Kong',
    type: 'Full-time',
    salary: '$15,000 - $18,000',
    postedDate: '2024-01-06',
    description: 'Provide exceptional customer service and support. We are looking for friendly and professional individuals to join our customer service team.',
    requirements: ['Customer service experience', 'Communication skills', 'Problem-solving', 'Patience'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '11',
    title: 'Business Analyst',
    company: 'Strategy Consulting Group',
    industry: 'Business Consulting',
    industryZh: '商业咨询与战略',
    location: 'Central, Hong Kong',
    type: 'Full-time',
    salary: '$28,000 - $38,000',
    postedDate: '2024-01-05',
    description: 'Analyze business processes and recommend improvements. Work with top-tier clients to drive business transformation.',
    requirements: ['Analytical skills', 'Consulting experience', 'Stakeholder management', 'Power BI'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '12',
    title: 'Graphic Designer',
    company: 'Creative Studio Hong Kong',
    industry: 'Design & Architecture',
    industryZh: '设计与建筑',
    location: 'Sheung Wan, Hong Kong',
    type: 'Full-time',
    salary: '$18,000 - $25,000',
    postedDate: '2024-01-04',
    description: 'Create visually stunning designs for various media. We are looking for a creative designer with a strong portfolio.',
    requirements: ['Adobe Creative Suite', '2+ years experience', 'Typography skills', 'Brand identity'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '13',
    title: 'Registered Nurse',
    company: 'Hong Kong Medical Center',
    industry: 'Healthcare & Medical',
    industryZh: '医疗与健康',
    location: 'Hong Kong Island',
    type: 'Full-time',
    salary: '$25,000 - $35,000',
    postedDate: '2024-01-03',
    description: 'Provide quality patient care in our modern medical facility. Join our team of healthcare professionals.',
    requirements: ['Nursing license', '2+ years experience', 'Patient care', 'Medical knowledge'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '14',
    title: 'Hotel Manager',
    company: 'Luxury Hotels Group',
    industry: 'Hospitality & Travel',
    industryZh: '酒店与旅游',
    location: 'Tsim Sha Tsui, Hong Kong',
    type: 'Full-time',
    salary: '$32,000 - $45,000',
    postedDate: '2024-01-02',
    description: 'Manage luxury hotel operations and ensure exceptional guest experiences. Lead our hospitality team to excellence.',
    requirements: ['Hotel management degree', '5+ years experience', 'Leadership skills', 'Customer service'],
    logo: '/api/placeholder/40/40'
  },
  {
    id: '15',
    title: 'Logistics Coordinator',
    company: 'Global Transport Solutions',
    industry: 'Transport & Logistics',
    industryZh: '运输与物流',
    location: 'Kwai Chung, Hong Kong',
    type: 'Full-time',
    salary: '$20,000 - $28,000',
    postedDate: '2024-01-01',
    description: 'Coordinate logistics operations and supply chain management. Ensure efficient transportation of goods.',
    requirements: ['Logistics experience', 'Supply chain knowledge', 'Communication skills', 'Problem-solving'],
    logo: '/api/placeholder/40/40'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const industry = searchParams.get('industry') || '';
    const location = searchParams.get('location') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredJobs = mockJobs;

    // Filter by search query (title, company, description)
    if (query) {
      const searchQuery = query.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery) ||
        job.company.toLowerCase().includes(searchQuery) ||
        job.description.toLowerCase().includes(searchQuery)
      );
    }

    // Filter by industry
    if (industry) {
      filteredJobs = filteredJobs.filter(job => 
        job.industry === industry || job.industryZh === industry
      );
    }

    // Filter by location
    if (location) {
      const locationQuery = location.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.location.toLowerCase().includes(locationQuery)
      );
    }

    // Apply pagination
    const jobs = filteredJobs.slice(offset, offset + limit);

    return NextResponse.json({
      jobs,
      total: filteredJobs.length,
      limit,
      offset,
      query,
      industry,
      location
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}