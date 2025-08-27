'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Target, 
  BarChart3, 
  Funnel,
  Phone,
  Mail,
  Building,
  Calendar,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Activity,
  TrendingUp,
  DollarSign,
  Clock,
  FileText,
  Settings,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  PhoneCall,
  Video,
  Coffee,
  Mail as MailIcon,
  CalendarCheck,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Link as LinkIcon,
  User,
  Code,
  Send,
  Users2,
  Bell,
  Smartphone,
  Zap,
  MessageSquare,
  AtSign,
  Notification
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

// Extended interfaces for Phase 2 features
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    campaigns: number;
    automations: number;
  };
}

interface EmailCampaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  scheduleType: string;
  scheduledAt?: string;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  createdAt: string;
  template: {
    id: string;
    name: string;
    subject: string;
  };
}

interface LeadSegment {
  id: string;
  name: string;
  description?: string;
  criteria: string;
  isActive: boolean;
  isDynamic: boolean;
  leadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  leader: {
    id: string;
    name: string;
    email: string;
  };
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  _count: {
    assignments: number;
    collaborations: number;
  };
}

interface MobileDevice {
  id: string;
  deviceType: string;
  deviceToken?: string;
  isActive: boolean;
  lastSeenAt?: string;
  createdAt: string;
}

interface PushNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  status: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

interface LeadManagementPhase2Props {
  userId: string;
}

export default function LeadManagementPhase2({ userId }: LeadManagementPhase2Props) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('leads');

  // Email Automation State
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);

  // Advanced Segmentation State
  const [leadSegments, setLeadSegments] = useState<LeadSegment[]>([]);
  const [isSegmentDialogOpen, setIsSegmentDialogOpen] = useState(false);

  // Team Collaboration State
  const [teams, setTeams] = useState<Team[]>([]);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isCollaborationDialogOpen, setIsCollaborationDialogOpen] = useState(false);

  // Mobile Optimization State
  const [mobileDevices, setMobileDevices] = useState<MobileDevice[]>([]);
  const [pushNotifications, setPushNotifications] = useState<PushNotification[]>([]);

  // Form states
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'campaign',
    category: ''
  });

  const [campaignForm, setCampaignForm] = useState({
    templateId: '',
    name: '',
    description: '',
    scheduleType: 'immediate',
    scheduledAt: '',
    targetSegment: ''
  });

  const [segmentForm, setSegmentForm] = useState({
    name: '',
    description: '',
    criteria: {
      status: [],
      priority: [],
      scoreRange: { min: 0, max: 100 },
      tags: [],
      createdAt: { after: '', before: '' }
    },
    isDynamic: true
  });

  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    leaderId: ''
  });

  const [collaborationForm, setCollaborationForm] = useState({
    type: 'comment',
    content: '',
    mentionedUsers: [] as string[]
  });

  useEffect(() => {
    fetchEmailTemplates();
    fetchEmailCampaigns();
    fetchLeadSegments();
    fetchTeams();
    fetchMobileDevices();
    fetchPushNotifications();
  }, []);

  // Email Automation Functions
  const fetchEmailTemplates = async () => {
    try {
      const response = await fetch('/api/email-templates');
      const data = await response.json();
      if (response.ok) {
        setEmailTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch email templates:', error);
    }
  };

  const fetchEmailCampaigns = async () => {
    try {
      const response = await fetch('/api/email-campaigns');
      const data = await response.json();
      if (response.ok) {
        setEmailCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Failed to fetch email campaigns:', error);
    }
  };

  const handleCreateEmailTemplate = async () => {
    try {
      const response = await fetch('/api/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateForm)
      });

      if (response.ok) {
        await fetchEmailTemplates();
        setIsTemplateDialogOpen(false);
        resetTemplateForm();
        toast({
          title: 'Template Created',
          description: 'Email template created successfully'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create email template',
        variant: 'destructive'
      });
    }
  };

  const handleCreateEmailCampaign = async () => {
    try {
      const response = await fetch('/api/email-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignForm)
      });

      if (response.ok) {
        await fetchEmailCampaigns();
        setIsCampaignDialogOpen(false);
        resetCampaignForm();
        toast({
          title: 'Campaign Created',
          description: 'Email campaign created successfully'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create email campaign',
        variant: 'destructive'
      });
    }
  };

  // Advanced Segmentation Functions
  const fetchLeadSegments = async () => {
    try {
      const response = await fetch('/api/lead-segments');
      const data = await response.json();
      if (response.ok) {
        setLeadSegments(data.segments);
      }
    } catch (error) {
      console.error('Failed to fetch lead segments:', error);
    }
  };

  const handleCreateLeadSegment = async () => {
    try {
      const response = await fetch('/api/lead-segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segmentForm)
      });

      if (response.ok) {
        await fetchLeadSegments();
        setIsSegmentDialogOpen(false);
        resetSegmentForm();
        toast({
          title: 'Segment Created',
          description: 'Lead segment created successfully'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create lead segment',
        variant: 'destructive'
      });
    }
  };

  // Team Collaboration Functions
  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      if (response.ok) {
        setTeams(data.teams);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamForm)
      });

      if (response.ok) {
        await fetchTeams();
        setIsTeamDialogOpen(false);
        resetTeamForm();
        toast({
          title: 'Team Created',
          description: 'Team created successfully'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create team',
        variant: 'destructive'
      });
    }
  };

  // Mobile Optimization Functions
  const fetchMobileDevices = async () => {
    try {
      const response = await fetch(`/api/mobile-devices?userId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setMobileDevices(data.devices);
      }
    } catch (error) {
      console.error('Failed to fetch mobile devices:', error);
    }
  };

  const fetchPushNotifications = async () => {
    try {
      const response = await fetch(`/api/push-notifications?userId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setPushNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch push notifications:', error);
    }
  };

  const handleRegisterDevice = async () => {
    try {
      const response = await fetch('/api/mobile-devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          deviceType: 'web',
          deviceToken: 'web-token'
        })
      });

      if (response.ok) {
        await fetchMobileDevices();
        toast({
          title: 'Device Registered',
          description: 'Mobile device registered successfully'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to register device',
        variant: 'destructive'
      });
    }
  };

  // Reset form functions
  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      subject: '',
      content: '',
      type: 'campaign',
      category: ''
    });
  };

  const resetCampaignForm = () => {
    setCampaignForm({
      templateId: '',
      name: '',
      description: '',
      scheduleType: 'immediate',
      scheduledAt: '',
      targetSegment: ''
    });
  };

  const resetSegmentForm = () => {
    setSegmentForm({
      name: '',
      description: '',
      criteria: {
        status: [],
        priority: [],
        scoreRange: { min: 0, max: 100 },
        tags: [],
        createdAt: { after: '', before: '' }
      },
      isDynamic: true
    });
  };

  const resetTeamForm = () => {
    setTeamForm({
      name: '',
      description: '',
      leaderId: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management Phase 2</h1>
          <p className="text-muted-foreground">Advanced features for enterprise lead management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRegisterDevice}>
            <Smartphone className="mr-2 h-4 w-4" />
            Register Device
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="email-automation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email-automation" className="text-xs md:text-sm">
            <MailIcon className="mr-2 h-4 w-4" />
            Email Automation
          </TabsTrigger>
          <TabsTrigger value="segmentation" className="text-xs md:text-sm">
            <Users className="mr-2 h-4 w-4" />
            Segmentation
          </TabsTrigger>
          <TabsTrigger value="team-collaboration" className="text-xs md:text-sm">
            <Users2 className="mr-2 h-4 w-4" />
            Team Collaboration
          </TabsTrigger>
          <TabsTrigger value="mobile-optimization" className="text-xs md:text-sm">
            <Smartphone className="mr-2 h-4 w-4" />
            Mobile Optimization
          </TabsTrigger>
        </TabsList>

        {/* Email Automation Tab */}
        <TabsContent value="email-automation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Email Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Email Templates
                  </div>
                  <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Email Template</DialogTitle>
                        <DialogDescription>
                          Create a new email template for campaigns and automation
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="templateName">Template Name</Label>
                          <Input
                            id="templateName"
                            value={templateForm.name}
                            onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="templateSubject">Subject</Label>
                          <Input
                            id="templateSubject"
                            value={templateForm.subject}
                            onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="templateContent">Content (HTML)</Label>
                          <Textarea
                            id="templateContent"
                            value={templateForm.content}
                            onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                            rows={8}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="templateType">Type</Label>
                            <Select value={templateForm.type} onValueChange={(value) => setTemplateForm({ ...templateForm, type: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="campaign">Campaign</SelectItem>
                                <SelectItem value="automated">Automated</SelectItem>
                                <SelectItem value="followup">Follow-up</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="templateCategory">Category</Label>
                            <Input
                              id="templateCategory"
                              value={templateForm.category}
                              onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateEmailTemplate}>
                          Create Template
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {emailTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{template.type}</Badge>
                          {template.category && (
                            <Badge variant="secondary">{template.category}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Email Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Email Campaigns
                  </div>
                  <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Campaign
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Email Campaign</DialogTitle>
                        <DialogDescription>
                          Create a new email campaign using existing templates
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="campaignTemplate">Template</Label>
                          <Select value={campaignForm.templateId} onValueChange={(value) => setCampaignForm({ ...campaignForm, templateId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                              {emailTemplates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="campaignName">Campaign Name</Label>
                          <Input
                            id="campaignName"
                            value={campaignForm.name}
                            onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="campaignDescription">Description</Label>
                          <Textarea
                            id="campaignDescription"
                            value={campaignForm.description}
                            onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="scheduleType">Schedule Type</Label>
                            <Select value={campaignForm.scheduleType} onValueChange={(value) => setCampaignForm({ ...campaignForm, scheduleType: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="immediate">Immediate</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="recurring">Recurring</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="targetSegment">Target Segment</Label>
                            <Select value={campaignForm.targetSegment} onValueChange={(value) => setCampaignForm({ ...campaignForm, targetSegment: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="All leads" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All leads</SelectItem>
                                {leadSegments.map((segment) => (
                                  <SelectItem key={segment.id} value={segment.id}>
                                    {segment.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateEmailCampaign}>
                          Create Campaign
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {emailCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-muted-foreground">{campaign.template.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline">{campaign.scheduleType}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {campaign.sentCount} sent • {campaign.openedCount} opened • {campaign.clickedCount} clicked
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Segmentation Tab */}
        <TabsContent value="segmentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Lead Segments
                </div>
                <Dialog open={isSegmentDialogOpen} onOpenChange={setIsSegmentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Segment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Lead Segment</DialogTitle>
                      <DialogDescription>
                        Create a new segment based on specific criteria
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="segmentName">Segment Name</Label>
                        <Input
                          id="segmentName"
                          value={segmentForm.name}
                          onChange={(e) => setSegmentForm({ ...segmentForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="segmentDescription">Description</Label>
                        <Textarea
                          id="segmentDescription"
                          value={segmentForm.description}
                          onChange={(e) => setSegmentForm({ ...segmentForm, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isDynamic"
                          checked={segmentForm.isDynamic}
                          onCheckedChange={(checked) => setSegmentForm({ ...segmentForm, isDynamic: checked })}
                        />
                        <Label htmlFor="isDynamic">Dynamic Segment</Label>
                      </div>
                      <div className="space-y-2">
                        <Label>Segment Criteria</Label>
                        <div className="text-sm text-muted-foreground">
                          Configure the criteria for this segment (simplified for demo)
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsSegmentDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateLeadSegment}>
                        Create Segment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {leadSegments.map((segment) => (
                  <Card key={segment.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        {segment.name}
                        <div className="flex items-center gap-1">
                          <Badge variant={segment.isActive ? 'default' : 'secondary'} className="text-xs">
                            {segment.isDynamic ? 'Dynamic' : 'Static'}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {segment.description && (
                          <p className="text-sm text-muted-foreground">{segment.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{segment.leadCount} leads</span>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Users className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Collaboration Tab */}
        <TabsContent value="team-collaboration" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Teams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users2 className="h-5 w-5" />
                    Teams
                  </div>
                  <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Team
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Create Team</DialogTitle>
                        <DialogDescription>
                          Create a new team for lead management collaboration
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="teamName">Team Name</Label>
                          <Input
                            id="teamName"
                            value={teamForm.name}
                            onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="teamDescription">Description</Label>
                          <Textarea
                            id="teamDescription"
                            value={teamForm.description}
                            onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="teamLeader">Team Leader</Label>
                          <Select value={teamForm.leaderId} onValueChange={(value) => setTeamForm({ ...teamForm, leaderId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team leader" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user1">Current User</SelectItem>
                              {/* In a real app, this would list all available users */}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTeamDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateTeam}>
                          Create Team
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{team.name}</h4>
                        <p className="text-sm text-muted-foreground">Leader: {team.leader.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{team.members.length} members</Badge>
                          <Badge variant="outline">{team._count.assignments} assignments</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Collaboration Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent collaboration activity</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setIsCollaborationDialogOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Start Collaboration
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mobile Optimization Tab */}
        <TabsContent value="mobile-optimization" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Registered Devices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Registered Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mobileDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium capitalize">{device.deviceType}</h4>
                        <p className="text-sm text-muted-foreground">
                          {device.lastSeenAt ? `Last seen: ${new Date(device.lastSeenAt).toLocaleDateString()}` : 'Never seen'}
                        </p>
                        <Badge variant={device.isActive ? 'default' : 'secondary'} className="mt-1">
                          {device.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {mobileDevices.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No devices registered</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={handleRegisterDevice}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Register Device
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Push Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pushNotifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{notification.type}</Badge>
                          <Badge variant={notification.status === 'read' ? 'default' : 'secondary'}>
                            {notification.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {pushNotifications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}