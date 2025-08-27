'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/header/Header';
import { 
  Search, 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  ExternalLink,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronRight,
  X,
  Heart,
  Share2,
  MessageCircle,
  MessageSquare,
  Send,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface JobListing {
  id: string;
  title: string;
  company: string;
  industry: string;
  industryZh: string;
  location: string;
  type: string;
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  postedDate: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  benefits?: string[];
  logo?: string;
  url?: string;
  isRemote?: boolean;
  experienceLevel?: string;
  educationLevel?: string;
}

export default function JobMarketPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]); // Array of job IDs
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]); // Array of job IDs
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [workType, setWorkType] = useState('all');
  const [remoteOption, setRemoteOption] = useState('all');
  const [salaryMin, setSalaryMin] = useState('0');
  const [salaryMax, setSalaryMax] = useState('120k+');
  const [datePosted, setDatePosted] = useState('any');
  const [isSearching, setIsSearching] = useState(false);
  
  const { language } = useLanguage();
  const { toast } = useToast();

  const workTypeOptions = [
    { value: 'all', label: 'All work types', labelZh: '所有工作類型' },
    { value: 'full-time', label: 'Full-time', labelZh: '全職' },
    { value: 'part-time', label: 'Part-time', labelZh: '兼職' },
    { value: 'contract', label: 'Contract', labelZh: '合約' },
    { value: 'temporary', label: 'Temporary', labelZh: '臨時' },
    { value: 'internship', label: 'Internship', labelZh: '實習' }
  ];

  const remoteOptions = [
    { value: 'all', label: 'All remote options', labelZh: '所有遙距選項' },
    { value: 'remote', label: 'Remote', labelZh: '遙距工作' },
    { value: 'hybrid', label: 'Hybrid', labelZh: '混合' },
    { value: 'onsite', label: 'On-site', labelZh: '辦公室' }
  ];

  const salaryOptions = [
    { value: '0', label: '$0', labelZh: '$0' },
    { value: '10k', label: '$10K', labelZh: '$1萬' },
    { value: '20k', label: '$20K', labelZh: '$2萬' },
    { value: '30k', label: '$30K', labelZh: '$3萬' },
    { value: '40k', label: '$40K', labelZh: '$4萬' },
    { value: '50k', label: '$50K', labelZh: '$5萬' },
    { value: '60k', label: '$60K', labelZh: '$6萬' },
    { value: '70k', label: '$70K', labelZh: '$7萬' },
    { value: '80k', label: '$80K', labelZh: '$8萬' },
    { value: '90k', label: '$90K', labelZh: '$9萬' },
    { value: '100k', label: '$100K', labelZh: '$10萬' },
    { value: '120k+', label: '$120K+', labelZh: '$12萬+' }
  ];

  const datePostedOptions = [
    { value: 'any', label: 'Listed any time', labelZh: '任何時間' },
    { value: 'today', label: 'Today', labelZh: '今天' },
    { value: '3days', label: 'Last 3 days', labelZh: '過去3天' },
    { value: 'week', label: 'Last week', labelZh: '過去一週' },
    { value: 'month', label: 'Last month', labelZh: '過去一個月' }
  ];

  const industryOptions = [
    { value: 'Accounting & Finance', label: 'Accounting & Finance', labelZh: '会计与金融', labelTw: '會計與金融' },
    { value: 'Administration & Office Support', label: 'Administration & Office Support', labelZh: '行政与文职', labelTw: '行政與文職' },
    { value: 'Advertising & Media', label: 'Advertising & Media', labelZh: '廣告与媒体', labelTw: '廣告與媒體' },
    { value: 'Banking & Financial Services', label: 'Banking & Financial Services', labelZh: '银行与金融服务', labelTw: '銀行與金融服務' },
    { value: 'Customer Service', label: 'Customer Service', labelZh: '客户服务', labelTw: '客戶服務' },
    { value: 'Executive Management', label: 'Executive Management', labelZh: '高管与综合管理', labelTw: '高管與綜合管理' },
    { value: 'Nonprofit & Social Services', label: 'Nonprofit & Social Services', labelZh: '非营利与社会服务', labelTw: '非營利與社會服務' },
    { value: 'Construction', label: 'Construction', labelZh: '建筑与工程', labelTw: '建築與工程' },
    { value: 'Business Consulting', label: 'Business Consulting', labelZh: '商业咨询与战略', labelTw: '商業諮詢與戰略' },
    { value: 'Design & Architecture', label: 'Design & Architecture', labelZh: '设计与建筑', labelTw: '設計與建築' },
    { value: 'Education & Training', label: 'Education & Training', labelZh: '教育与培训', labelTw: '教育與培訓' },
    { value: 'Engineering & Technical', label: 'Engineering & Technical', labelZh: '工程技术', labelTw: '工程技術' },
    { value: 'Agriculture & Environment', label: 'Agriculture & Environment', labelZh: '农业与环保', labelTw: '農業與環保' },
    { value: 'Government & Public Sector', label: 'Government & Public Sector', labelZh: '政府与公共部门', labelTw: '政府與公共部門' },
    { value: 'Healthcare & Medical', label: 'Healthcare & Medical', labelZh: '医疗与健康', labelTw: '醫療與健康' },
    { value: 'Hospitality & Travel', label: 'Hospitality & Travel', labelZh: '酒店与旅游', labelTw: '酒店與旅遊' },
    { value: 'HR & Staffing', label: 'HR & Staffing', labelZh: '人力资源与招聘', labelTw: '人力資源與招聘' },
    { value: 'Information & Technology', label: 'Information & Technology', labelZh: '資訊與技術', labelTw: '資訊與技術' },
    { value: 'Insurance', label: 'Insurance', labelZh: '保险业', labelTw: '保險業' },
    { value: 'Legal Services', label: 'Legal Services', labelZh: '法律服务', labelTw: '法律服務' },
    { value: 'Manufacturing & Production', label: 'Manufacturing & Production', labelZh: '制造业与生产', labelTw: '製造業與生產' },
    { value: 'Transport & Logistics', label: 'Transport & Logistics', labelZh: '运输与物流', labelTw: '運輸與物流' },
    { value: 'Marketing & PR', label: 'Marketing & PR', labelZh: '市场营销与公关', labelTw: '市場營銷與公關' },
    { value: 'Mining & Energy', label: 'Mining & Energy', labelZh: '矿业与能源', labelTw: '礦業與能源' },
    { value: 'Real Estate', label: 'Real Estate', labelZh: '房地产', labelTw: '房地產' },
    { value: 'Retail', label: 'Retail', labelZh: '零售与消费品', labelTw: '零售與消費品' },
    { value: 'Sales', label: 'Sales', labelZh: '销售', labelTw: '銷售' },
    { value: 'Science & Research', label: 'Science & Research', labelZh: '科学与研究', labelTw: '科學與研究' },
    { value: 'Freelance & Entrepreneurship', label: 'Freelance & Entrepreneurship', labelZh: '自由职业与创业', labelTw: '自由職業與創業' },
    { value: 'Sports & Fitness', label: 'Sports & Fitness', labelZh: '体育与休闲', labelTw: '體育與休閒' }
  ];

  useEffect(() => {
    checkAuth();
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user) {
      loadSavedJobs();
      loadApplications();
    }
  }, [user]);

  useEffect(() => {
    filterJobs();
    if (filteredJobs.length > 0 && !selectedJob) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [jobs, searchTerm, selectedIndustry, locationFilter, workType, remoteOption, salaryMin, salaryMax, datePosted]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      // User not authenticated
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const response = await fetch('/api/saved-jobs');
      if (response.ok) {
        const data = await response.json();
        setSavedJobs(data.map((job: any) => job.jobId));
      }
    } catch (error) {
      console.error('Failed to load saved jobs:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const data = await response.json();
        setAppliedJobs(data.map((app: any) => app.jobId));
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const fetchJobs = async () => {
    setIsSearching(true);
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      
      if (response.ok) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs(getMockJobs());
    } finally {
      setIsSearching(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter(job => 
        job.industry === selectedIndustry || job.industryZh === selectedIndustry
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (workType !== 'all') {
      filtered = filtered.filter(job => 
        job.type.toLowerCase().includes(workType.toLowerCase())
      );
    }

    if (remoteOption !== 'all') {
      if (remoteOption === 'remote') {
        filtered = filtered.filter(job => job.isRemote);
      } else if (remoteOption === 'onsite') {
        filtered = filtered.filter(job => !job.isRemote);
      }
      // For hybrid, you might need to add a hybrid field to the job interface
    }

    if (salaryMin !== '0' || salaryMax !== '120k+') {
      filtered = filtered.filter(job => {
        const jobSalaryMin = job.salaryMin || 0;
        const minFilter = salaryMin === '0' ? 0 : parseInt(salaryMin) * 1000;
        const maxFilter = salaryMax === '120k+' ? 999999 : parseInt(salaryMax) * 1000;
        
        return jobSalaryMin >= minFilter && jobSalaryMin <= maxFilter;
      });
    }

    if (datePosted !== 'any') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (datePosted) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case '3days':
          cutoffDate.setDate(now.getDate() - 3);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(job => 
        new Date(job.postedDate) >= cutoffDate
      );
    }

    setFilteredJobs(filtered);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        ...(searchTerm && { q: searchTerm }),
        ...(selectedIndustry && { industry: selectedIndustry }),
        ...(locationFilter && { location: locationFilter })
      });

      const response = await fetch(`/api/jobs/search?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setFilteredJobs(data.jobs);
      }
    } catch (error) {
      console.error('Failed to search jobs:', error);
      filterJobs();
    } finally {
      setIsSearching(false);
    }
  };

  const handleApplyJob = async (jobId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          status: 'applied',
          notes: `Applied for ${selectedJob?.title} at ${selectedJob?.company}`,
        }),
      });

      if (response.ok) {
        setAppliedJobs([...appliedJobs, jobId]);
        toast({
          title: "Application Submitted",
          description: "Your job application has been submitted successfully!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Application Failed",
          description: error.error || "Failed to submit application",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save jobs",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (savedJobs.includes(jobId)) {
        // Remove from saved jobs
        const response = await fetch(`/api/saved-jobs/${jobId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSavedJobs(savedJobs.filter(id => id !== jobId));
          toast({
            title: "Job Removed",
            description: "Job removed from your saved list",
          });
        }
      } else {
        // Add to saved jobs
        const response = await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId,
            notes: `Saved ${selectedJob?.title} at ${selectedJob?.company}`,
          }),
        });

        if (response.ok) {
          setSavedJobs([...savedJobs, jobId]);
          toast({
            title: "Job Saved",
            description: "Job added to your saved list",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Operation Failed",
        description: "Failed to save/remove job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareJob = async (job: JobListing, platform?: string) => {
    const shareText = `Check out this job opportunity: ${job.title} at ${job.company}\n\nLocation: ${job.location}\nSalary: ${job.salary}\n\n${job.description.substring(0, 200)}...\n\n${job.url || window.location.href}`;
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(job.url || window.location.href);

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        break;
      case 'wechat':
        // WeChat doesn't have a direct URL scheme, so we copy to clipboard
        copyToClipboard(job);
        toast({
          title: "WeChat Share",
          description: "Job details copied to clipboard. Paste in WeChat to share.",
        });
        break;
      case 'line':
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
        break;
      default:
        // Default share behavior
        if (navigator.share) {
          try {
            await navigator.share({
              title: job.title,
              text: `Check out this job opportunity: ${job.title} at ${job.company}`,
              url: job.url || window.location.href,
            });
          } catch (error) {
            // User cancelled share or share failed
            copyToClipboard(job);
          }
        } else {
          copyToClipboard(job);
        }
    }
  };

  const copyToClipboard = (job: JobListing) => {
    const text = `Check out this job opportunity: ${job.title} at ${job.company}\n\nLocation: ${job.location}\nSalary: ${job.salary}\nType: ${job.type}\n\nDescription:\n${job.description.substring(0, 300)}...\n\n${job.url || window.location.href}`;
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Link Copied",
        description: "Job details copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy job details",
        variant: "destructive",
      });
    });
  };

  const getMockJobs = (): JobListing[] => {
    return [
      {
        id: '1',
        title: 'Senior Financial Accountant',
        company: 'KPMG China',
        industry: 'Accounting & Finance',
        industryZh: '会计与金融',
        location: 'Hong Kong',
        type: 'Full-time',
        salary: '$35,000 - $45,000',
        salaryMin: 35000,
        salaryMax: 45000,
        postedDate: '2024-01-15',
        description: 'We are seeking a highly skilled Senior Financial Accountant to join our dynamic team. This role offers excellent career progression opportunities and the chance to work with prestigious clients.',
        requirements: ['ACCA/CPA qualification', '5+ years in accounting', 'Big 4 experience preferred', 'Strong technical knowledge'],
        responsibilities: ['Prepare financial statements', 'Manage audit engagements', 'Lead client meetings', 'Mentor junior staff'],
        benefits: ['Performance bonus', 'Medical insurance', 'Professional development', 'Flexible working arrangements'],
        isRemote: false,
        experienceLevel: 'Senior',
        educationLevel: 'Bachelor\'s degree'
      },
      {
        id: '2',
        title: 'Audit Assistant',
        company: 'Deloitte Touche Tohmatsu',
        industry: 'Accounting & Finance',
        industryZh: '会计与金融',
        location: 'Central, Hong Kong',
        type: 'Full-time',
        salary: '$18,000 - $25,000',
        salaryMin: 18000,
        salaryMax: 25000,
        postedDate: '2024-01-14',
        description: 'Join our audit team and gain valuable experience working with diverse clients across various industries.',
        requirements: ['Accounting degree', '1-2 years experience', 'Strong analytical skills', 'Team player'],
        responsibilities: ['Assist in audit fieldwork', 'Prepare working papers', 'Communicate with clients', 'Support senior auditors'],
        benefits: ['Study support', 'Career progression', 'Global opportunities', 'Competitive salary'],
        isRemote: false,
        experienceLevel: 'Entry',
        educationLevel: 'Bachelor\'s degree'
      },
      {
        id: '3',
        title: 'Financial Controller',
        company: 'HSBC',
        industry: 'Banking & Financial Services',
        industryZh: '银行与金融服务',
        location: 'Kowloon, Hong Kong',
        type: 'Full-time',
        salary: '$50,000 - $70,000',
        salaryMin: 50000,
        salaryMax: 70000,
        postedDate: '2024-01-13',
        description: 'Lead our financial control function and ensure compliance with regulatory requirements.',
        requirements: ['CPA/ACCA', '10+ years experience', 'Banking industry knowledge', 'Management experience'],
        responsibilities: ['Oversee financial reporting', 'Manage treasury operations', 'Lead risk management', 'Stakeholder reporting'],
        benefits: ['Executive bonus', 'Share options', 'Comprehensive benefits', 'Leadership development'],
        isRemote: false,
        experienceLevel: 'Management',
        educationLevel: 'Bachelor\'s degree'
      },
      {
        id: '4',
        title: 'Tax Consultant',
        company: 'PwC',
        industry: 'Accounting & Finance',
        industryZh: '会计与金融',
        location: 'Hong Kong',
        type: 'Full-time',
        salary: '$28,000 - $38,000',
        salaryMin: 28000,
        salaryMax: 38000,
        postedDate: '2024-01-12',
        description: 'Provide expert tax advice to multinational corporations and high-net-worth individuals.',
        requirements: ['Tax qualification', '3+ years tax experience', 'International tax knowledge', 'Client advisory skills'],
        responsibilities: ['Tax planning', 'Compliance management', 'Client advisory', 'Tax research'],
        benefits: ['Performance bonus', 'Professional development', 'Global mobility', 'Health insurance'],
        isRemote: true,
        experienceLevel: 'Mid',
        educationLevel: 'Bachelor\'s degree'
      },
      {
        id: '5',
        title: 'Management Accountant',
        company: 'Swire Properties',
        industry: 'Real Estate',
        industryZh: '房地产',
        location: 'Hong Kong Island',
        type: 'Full-time',
        salary: '$32,000 - $42,000',
        salaryMin: 32000,
        salaryMax: 42000,
        postedDate: '2024-01-11',
        description: 'Support strategic decision-making through comprehensive financial analysis and reporting.',
        requirements: ['Accounting qualification', '5+ years experience', 'Property industry knowledge', 'Advanced Excel skills'],
        responsibilities: ['Budget preparation', 'Financial analysis', 'Management reporting', 'Cost control'],
        benefits: ['Property discounts', 'Performance bonus', 'Health coverage', 'Retirement plan'],
        isRemote: false,
        experienceLevel: 'Mid',
        educationLevel: 'Bachelor\'s degree'
      }
    ];
  };

  const getLocalizedTexts = () => {
    const texts = {
      'zh-TW': {
        title: '就業市場',
        subtitle: '搜尋香港及全球的工作機會',
        searchPlaceholder: '輸入職位關鍵字、公司名稱...',
        industryPlaceholder: '選擇行業...',
        locationPlaceholder: '輸入地區...',
        searchButton: '搜尋工作',
        clearFilters: '清除篩選',
        results: '找到 {count} 個工作機會',
        jobType: '工作類型',
        salary: '薪資',
        location: '地點',
        posted: '發布日期',
        requirements: '職位要求',
        responsibilities: '工作職責',
        benefits: '福利待遇',
        apply: '申請職位',
        viewDetails: '查看詳情',
        noJobs: '沒有找到符合條件的工作',
        loading: '載入中...',
        industry: '行業',
        location: '地區',
        workType: '工作類型',
        remote: '遙距選項',
        salaryRange: '薪資範圍',
        datePosted: '發布時間',
        all: '全部',
        saveJob: '儲存職位',
        shareJob: '分享職位',
        shareVia: '分享到',
        whatsapp: 'WhatsApp',
        wechat: 'WeChat',
        line: 'LINE',
        telegram: 'Telegram',
        copyLink: '複製連結',
        companyOverview: '公司概覽',
        jobDescription: '職位描述',
        keyResponsibilities: '主要職責',
        requiredSkills: '所需技能',
        qualifications: '資格要求',
        experience: '工作經驗',
        education: '教育程度',
        jobHighlights: '職位亮點',
        relatedJobs: '相關職位'
      },
      'zh-CN': {
        title: '就业市场',
        subtitle: '搜索香港及全球的工作机会',
        searchPlaceholder: '输入职位关键字、公司名称...',
        industryPlaceholder: '选择行业...',
        locationPlaceholder: '输入地区...',
        searchButton: '搜索工作',
        clearFilters: '清除筛选',
        results: '找到 {count} 个工作机会',
        jobType: '工作类型',
        salary: '薪资',
        location: '地点',
        posted: '发布日期',
        requirements: '职位要求',
        responsibilities: '工作职责',
        benefits: '福利待遇',
        apply: '申请职位',
        viewDetails: '查看详情',
        noJobs: '没有找到符合条件的工作',
        loading: '加载中...',
        industry: '行业',
        location: '地区',
        workType: '工作类型',
        remote: '远程选项',
        salaryRange: '薪资范围',
        datePosted: '发布时间',
        all: '全部',
        saveJob: '保存职位',
        shareJob: '分享职位',
        shareVia: '分享到',
        whatsapp: 'WhatsApp',
        wechat: 'WeChat',
        line: 'LINE',
        telegram: 'Telegram',
        copyLink: '复制链接',
        companyOverview: '公司概览',
        jobDescription: '职位描述',
        keyResponsibilities: '主要职责',
        requiredSkills: '所需技能',
        qualifications: '资格要求',
        experience: '工作经验',
        education: '教育程度',
        jobHighlights: '职位亮点',
        relatedJobs: '相关职位'
      },
      'en': {
        title: 'Job Market',
        subtitle: 'Search job opportunities in Hong Kong and worldwide',
        searchPlaceholder: 'Enter job keywords, company name...',
        industryPlaceholder: 'Select industry...',
        locationPlaceholder: 'Enter location...',
        searchButton: 'Search Jobs',
        clearFilters: 'Clear Filters',
        results: 'Found {count} job opportunities',
        jobType: 'Job Type',
        salary: 'Salary',
        location: 'Location',
        posted: 'Posted',
        requirements: 'Requirements',
        responsibilities: 'Responsibilities',
        benefits: 'Benefits',
        apply: 'Apply Now',
        viewDetails: 'View Details',
        noJobs: 'No jobs found matching your criteria',
        loading: 'Loading...',
        industry: 'Industry',
        location: 'Location',
        workType: 'Work Type',
        remote: 'Remote Options',
        salaryRange: 'Salary Range',
        datePosted: 'Date Posted',
        all: 'All',
        saveJob: 'Save Job',
        shareJob: 'Share Job',
        shareVia: 'Share via',
        whatsapp: 'WhatsApp',
        wechat: 'WeChat',
        line: 'LINE',
        telegram: 'Telegram',
        copyLink: 'Copy Link',
        companyOverview: 'Company Overview',
        jobDescription: 'Job Description',
        keyResponsibilities: 'Key Responsibilities',
        requiredSkills: 'Required Skills',
        qualifications: 'Qualifications',
        experience: 'Experience',
        education: 'Education',
        jobHighlights: 'Job Highlights',
        relatedJobs: 'Related Jobs'
      }
    };

    return texts[language as keyof typeof texts] || texts['en'];
  };

  const texts = getLocalizedTexts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{texts.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      {/* Search and Filters Section */}
      <section className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* First Row: Keywords, Industries, Location */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={texts.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-48 h-12 justify-between">
                  {selectedIndustry 
                    ? (language === 'zh-TW' 
                        ? (industryOptions.find(i => i.value === selectedIndustry)?.labelTw || selectedIndustry)
                        : language === 'zh-CN'
                        ? (industryOptions.find(i => i.value === selectedIndustry)?.labelZh || selectedIndustry)
                        : (industryOptions.find(i => i.value === selectedIndustry)?.label || selectedIndustry))
                    : texts.industryPlaceholder
                  }
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 max-h-64">
                {industryOptions.map((industry) => (
                  <DropdownMenuItem 
                    key={industry.value}
                    onClick={() => setSelectedIndustry(industry.value)}
                  >
                    {language === 'zh-TW' 
                      ? industry.labelTw
                      : language === 'zh-CN'
                      ? industry.labelZh
                      : industry.label
                    }
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1">
              <Input
                placeholder={texts.locationPlaceholder}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full h-12"
              />
            </div>
          </div>

          {/* Second Row: Work Types, Remote Options, Salary Range, Date Posted */}
          <div className="flex flex-wrap gap-4">
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger className="w-48 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {language === 'zh-TW' || language === 'zh-CN' ? option.labelZh : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={remoteOption} onValueChange={setRemoteOption}>
              <SelectTrigger className="w-48 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {remoteOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {language === 'zh-TW' || language === 'zh-CN' ? option.labelZh : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Select value={salaryMin} onValueChange={setSalaryMin}>
                <SelectTrigger className="w-32 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {salaryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {language === 'zh-TW' || language === 'zh-CN' ? option.labelZh : option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-gray-500">to</span>
              <Select value={salaryMax} onValueChange={setSalaryMax}>
                <SelectTrigger className="w-32 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {salaryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {language === 'zh-TW' || language === 'zh-CN' ? option.labelZh : option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={datePosted} onValueChange={setDatePosted}>
              <SelectTrigger className="w-48 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {datePostedOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {language === 'zh-TW' || language === 'zh-CN' ? option.labelZh : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="h-10 px-6 bg-pink-600 hover:bg-pink-700"
            >
              {isSearching ? texts.loading : texts.searchButton}
            </Button>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedIndustry || locationFilter || workType !== 'all' || remoteOption !== 'all' || salaryMin !== '0' || salaryMax !== '120k+' || datePosted !== 'any') && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{searchTerm}</span>
                  <button onClick={() => setSearchTerm('')} className="ml-1 text-xs">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {selectedIndustry && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>
                    {language === 'zh-TW' 
                      ? (industryOptions.find(i => i.value === selectedIndustry)?.labelTw || selectedIndustry)
                      : language === 'zh-CN'
                      ? (industryOptions.find(i => i.value === selectedIndustry)?.labelZh || selectedIndustry)
                      : (industryOptions.find(i => i.value === selectedIndustry)?.label || selectedIndustry)}
                  </span>
                  <button onClick={() => setSelectedIndustry('')} className="ml-1 text-xs">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {locationFilter && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{locationFilter}</span>
                  <button onClick={() => setLocationFilter('')} className="ml-1 text-xs">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {workType !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{workTypeOptions.find(w => w.value === workType)?.labelZh || workType}</span>
                  <button onClick={() => setWorkType('all')} className="ml-1 text-xs">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {remoteOption !== 'all' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{remoteOptions.find(r => r.value === remoteOption)?.labelZh || remoteOption}</span>
                  <button onClick={() => setRemoteOption('all')} className="ml-1 text-xs">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {(salaryMin !== '0' || salaryMax !== '120k+') && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>
                    {salaryOptions.find(s => s.value === salaryMin)?.labelZh || salaryMin} - {salaryOptions.find(s => s.value === salaryMax)?.labelZh || salaryMax}
                  </span>
                  <button onClick={() => { setSalaryMin('0'); setSalaryMax('120k+'); }} className="ml-1 text-xs">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {datePosted !== 'any' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span>{datePostedOptions.find(d => d.value === datePosted)?.labelZh || datePosted}</span>
                  <button onClick={() => setDatePosted('any')} className="ml-1 text-xs">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustry('');
                  setLocationFilter('');
                  setWorkType('all');
                  setRemoteOption('all');
                  setSalaryMin('0');
                  setSalaryMax('120k+');
                  setDatePosted('any');
                }}
              >
                {texts.clearFilters}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {texts.results.replace('{count}', filteredJobs.length.toString())}
            </h2>
          </div>

          {isSearching ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="lg:col-span-2">
                <Card className="animate-pulse h-96">
                  <CardContent className="p-6">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job List (Left Panel) */}
              <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredJobs.map((job) => (
                  <Card 
                    key={job.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedJob?.id === job.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveJob(job.id);
                          }}
                          disabled={isSaving}
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              savedJobs.includes(job.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-400'
                            }`} 
                          />
                        </Button>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{job.type}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Badge variant="outline" className="text-xs">
                          {language === 'zh-TW' || language === 'zh-CN' ? job.industryZh : job.industry}
                        </Badge>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(job.postedDate).toLocaleDateString()}</span>
                        {job.isRemote && (
                          <Badge variant="secondary" className="text-xs">
                            Remote
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Job Details (Right Panel) */}
              <div className="lg:col-span-2">
                {selectedJob ? (
                  <Card className="h-fit">
                    <CardContent className="p-6">
                      {/* Job Header */}
                      <div className="mb-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                              {selectedJob.title}
                            </h1>
                            <p className="text-lg text-gray-600 mb-3">{selectedJob.company}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{selectedJob.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{selectedJob.salary}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{selectedJob.type}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(selectedJob.postedDate).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">
                                {language === 'zh-TW' || language === 'zh-CN' ? selectedJob.industryZh : selectedJob.industry}
                              </Badge>
                              {selectedJob.isRemote && (
                                <Badge variant="secondary">
                                  Remote
                                </Badge>
                              )}
                              {selectedJob.experienceLevel && (
                                <Badge variant="outline">
                                  {selectedJob.experienceLevel}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            <Button 
                              size="sm"
                              onClick={() => selectedJob && handleApplyJob(selectedJob.id)}
                              disabled={isApplying || appliedJobs.includes(selectedJob?.id || '')}
                            >
                              {appliedJobs.includes(selectedJob?.id || '') ? 'Applied' : texts.apply}
                            </Button>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => selectedJob && handleSaveJob(selectedJob.id)}
                                disabled={isSaving}
                              >
                                <Heart 
                                  className={`w-4 h-4 ${
                                    savedJobs.includes(selectedJob?.id || '') 
                                      ? 'fill-red-500 text-red-500' 
                                      : 'text-gray-400'
                                  }`} 
                                />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                  >
                                    <Share2 className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-700">
                                    {texts.shareVia}
                                  </div>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => selectedJob && handleShareJob(selectedJob, 'whatsapp')}>
                                    <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                                    {texts.whatsapp}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => selectedJob && handleShareJob(selectedJob, 'wechat')}>
                                    <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
                                    {texts.wechat}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => selectedJob && handleShareJob(selectedJob, 'line')}>
                                    <Send className="w-4 h-4 mr-2 text-green-400" />
                                    {texts.line}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => selectedJob && handleShareJob(selectedJob, 'telegram')}>
                                    <Send className="w-4 h-4 mr-2 text-blue-500" />
                                    {texts.telegram}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => selectedJob && handleShareJob(selectedJob)}>
                                    <Share2 className="w-4 h-4 mr-2 text-gray-600" />
                                    {texts.shareJob}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => selectedJob && copyToClipboard(selectedJob)}>
                                    <Share2 className="w-4 h-4 mr-2 text-gray-600" />
                                    {texts.copyLink}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Job Description */}
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 mb-3">
                            {texts.jobDescription}
                          </h2>
                          <p className="text-gray-700 leading-relaxed">
                            {selectedJob.description}
                          </p>
                        </div>

                        {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                              {texts.keyResponsibilities}
                            </h2>
                            <ul className="space-y-2">
                              {selectedJob.responsibilities.map((responsibility, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{responsibility}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 mb-3">
                            {texts.requirements}
                          </h2>
                          <div className="flex flex-wrap gap-2">
                            {selectedJob.requirements.map((requirement, index) => (
                              <Badge key={index} variant="secondary" className="text-sm">
                                {requirement}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                              {texts.benefits}
                            </h2>
                            <ul className="space-y-2">
                              {selectedJob.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedJob.experienceLevel && (
                            <div>
                              <h3 className="font-medium text-gray-900 mb-1">{texts.experience}</h3>
                              <p className="text-gray-600">{selectedJob.experienceLevel}</p>
                            </div>
                          )}
                          {selectedJob.educationLevel && (
                            <div>
                              <h3 className="font-medium text-gray-900 mb-1">{texts.education}</h3>
                              <p className="text-gray-600">{selectedJob.educationLevel}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-8 pt-6 border-t flex items-center justify-between">
                        <div className="flex space-x-3">
                          <Button 
                            size="lg"
                            onClick={() => selectedJob && handleApplyJob(selectedJob.id)}
                            disabled={isApplying || appliedJobs.includes(selectedJob?.id || '')}
                          >
                            {appliedJobs.includes(selectedJob?.id || '') ? 'Applied' : texts.apply}
                          </Button>
                          <Button 
                            size="lg" 
                            variant="outline"
                            onClick={() => selectedJob && handleSaveJob(selectedJob.id)}
                            disabled={isSaving}
                          >
                            {savedJobs.includes(selectedJob?.id || '') ? 'Saved' : texts.saveJob}
                          </Button>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              size="lg" 
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {texts.shareJob}
                              <Share2 className="w-4 h-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <div className="px-2 py-1.5 text-sm font-semibold text-gray-700">
                              {texts.shareVia}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => selectedJob && handleShareJob(selectedJob, 'whatsapp')}>
                              <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                              {texts.whatsapp}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => selectedJob && handleShareJob(selectedJob, 'wechat')}>
                              <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
                              {texts.wechat}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => selectedJob && handleShareJob(selectedJob, 'line')}>
                              <Send className="w-4 h-4 mr-2 text-green-400" />
                              {texts.line}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => selectedJob && handleShareJob(selectedJob, 'telegram')}>
                              <Send className="w-4 h-4 mr-2 text-blue-500" />
                              {texts.telegram}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => selectedJob && handleShareJob(selectedJob)}>
                              <Share2 className="w-4 h-4 mr-2 text-gray-600" />
                              {texts.shareJob}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => selectedJob && copyToClipboard(selectedJob)}>
                              <Share2 className="w-4 h-4 mr-2 text-gray-600" />
                              {texts.copyLink}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Select a job to view details
                      </h3>
                      <p className="text-gray-600">
                        Click on any job from the list to see full details and application options
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{texts.noJobs}</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or browse all available positions
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustry('');
                  setLocationFilter('');
                  setWorkType('all');
                  setRemoteOption('all');
                  setSalaryMin('0');
                  setSalaryMax('120k+');
                  setDatePosted('any');
                }}>
                  {texts.clearFilters}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}