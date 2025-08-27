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
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Return paginated results
    const jobs = mockJobs.slice(offset, offset + limit);
    
    return NextResponse.json({
      jobs,
      total: mockJobs.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}