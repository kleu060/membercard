'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface Appointment {
  id: string;
  title: string;
  description?: string;
  appointmentDate: string;
  duration: number;
  status: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  businessCard: {
    id: string;
    name: string;
    company?: string;
    template?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AppointmentManagementProps {
  userId: string;
}

export default function AppointmentManagement({ userId }: AppointmentManagementProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    notes: ''
  });

  useEffect(() => {
    loadAppointments();
  }, [userId]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, statusFilter, searchTerm]);

  const loadAppointments = async () => {
    try {
      const response = await fetch(`/api/appointments?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        setError('載入預約資料失敗');
      }
    } catch (error) {
      console.error('Failed to load appointments:', error);
      setError('載入預約資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.businessCard.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by appointment date
    filtered.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          notes: notes
        }),
      });

      if (response.ok) {
        await loadAppointments();
        setIsEditDialogOpen(false);
        setSelectedAppointment(null);
      } else {
        setError('更新預約狀態失敗');
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
      setError('更新預約狀態失敗');
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm('確定要刪除這個預約嗎？')) {
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadAppointments();
      } else {
        setError('刪除預約失敗');
      }
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      setError('刪除預約失敗');
    }
  };

  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditForm({
      status: appointment.status,
      notes: appointment.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '待確認', variant: 'secondary' as const, icon: Clock },
      confirmed: { label: '已確認', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: '已取消', variant: 'destructive' as const, icon: XCircle },
      completed: { label: '已完成', variant: 'outline' as const, icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getTemplateBadge = (template?: string) => {
    const templateConfig = {
      'real-estate': { label: '房地產', color: 'bg-green-100 text-green-800' },
      'wealth-management': { label: '財富管理', color: 'bg-blue-100 text-blue-800' },
      'modern-blue': { label: '現代藍', color: 'bg-purple-100 text-purple-800' }
    };

    const config = templateConfig[template as keyof typeof templateConfig] || 
                   { label: '一般', color: 'bg-gray-100 text-gray-800' };

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">預約管理</h1>
          <p className="text-gray-600">管理您的所有預約記錄</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜尋預約..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="狀態篩選" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部狀態</SelectItem>
                  <SelectItem value="pending">待確認</SelectItem>
                  <SelectItem value="confirmed">已確認</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">總預約數</p>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">待確認</p>
                <p className="text-2xl font-bold">
                  {appointments.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已確認</p>
                <p className="text-2xl font-bold">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已完成</p>
                <p className="text-2xl font-bold">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>預約列表</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">沒有找到預約記錄</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{appointment.title}</h3>
                        {getStatusBadge(appointment.status)}
                        {getTemplateBadge(appointment.businessCard.template)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {format(new Date(appointment.appointmentDate), 'yyyy年MM月dd日 HH:mm', { locale: zhTW })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.duration} 分鐘</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{appointment.contactName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">名片:</span>
                          <span className="font-medium">{appointment.businessCard.name}</span>
                          {appointment.businessCard.company && (
                            <span className="text-gray-500">- {appointment.businessCard.company}</span>
                          )}
                        </div>
                      </div>

                      {appointment.contactEmail && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{appointment.contactEmail}</span>
                        </div>
                      )}

                      {appointment.contactPhone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{appointment.contactPhone}</span>
                        </div>
                      )}

                      {appointment.description && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>預約說明:</strong> {appointment.description}
                        </div>
                      )}

                      {appointment.notes && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          <strong>備註:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(appointment)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>編輯預約</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">預約狀態</Label>
                <Select 
                  value={editForm.status} 
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">待確認</SelectItem>
                    <SelectItem value="confirmed">已確認</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">備註</Label>
                <Textarea
                  id="notes"
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="添加備註..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate(selectedAppointment.id, editForm.status, editForm.notes)}
                  className="flex-1"
                >
                  儲存變更
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}