'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format, addDays, isWeekend, setHours, setMinutes, isAfter, isBefore } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface AppointmentFormProps {
  cardId: string;
  cardName: string;
  cardCompany?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxAppointments: number;
  bufferTime: number;
}

export default function AppointmentForm({ 
  cardId, 
  cardName, 
  cardCompany, 
  onSuccess, 
  onCancel 
}: AppointmentFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    description: '',
    duration: '30'
  });
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  // Load availability settings
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const response = await fetch(`/api/appointments/availability/${cardId}`);
        if (response.ok) {
          const data = await response.json();
          setAvailableSlots(data);
        }
      } catch (error) {
        console.error('Failed to load availability:', error);
      }
    };

    loadAvailability();
  }, [cardId]);

  // Generate time slots when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    const dayOfWeek = selectedDate.getDay();
    const daySlots = availableSlots.filter(slot => slot.dayOfWeek === dayOfWeek);

    if (daySlots.length === 0) {
      setTimeSlots([]);
      return;
    }

    const slots: TimeSlot[] = [];
    daySlots.forEach(slot => {
      const [startHour, startMinute] = slot.startTime.split(':').map(Number);
      const [endHour, endMinute] = slot.endTime.split(':').map(Number);
      
      let currentTime = setMinutes(setHours(selectedDate, startHour), startMinute);
      const endTime = setMinutes(setHours(selectedDate, endHour), endMinute);

      while (isBefore(currentTime, endTime)) {
        const timeString = format(currentTime, 'HH:mm');
        slots.push({
          time: timeString,
          available: true
        });
        
        // Add buffer time and move to next slot
        currentTime = addDays(currentTime, 0);
        currentTime = setMinutes(currentTime, currentTime.getMinutes() + parseInt(formData.duration) + slot.bufferTime);
      }
    });

    setTimeSlots(slots);
  }, [selectedDate, availableSlots, formData.duration]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      setError('請選擇預約日期和時間');
      return;
    }

    if (!formData.name.trim()) {
      setError('請輸入您的姓名');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId,
          title: formData.title || `與${cardName}的預約`,
          description: formData.description,
          appointmentDate: appointmentDateTime.toISOString(),
          duration: parseInt(formData.duration),
          contactName: formData.name,
          contactEmail: formData.email,
          contactPhone: formData.phone,
          notes: formData.description
        }),
      });

      if (response.ok) {
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.message || '預約失敗，請稍後再試');
      }
    } catch (error) {
      console.error('Appointment submission error:', error);
      setError('預約失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(date, new Date().setHours(0, 0, 0, 0))) {
      return true;
    }

    // Check if date has availability
    const dayOfWeek = date.getDay();
    const hasAvailability = availableSlots.some(slot => slot.dayOfWeek === dayOfWeek);
    
    return !hasAvailability;
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">預約成功！</h3>
          <p className="text-gray-600 mb-4">
            您的預約已成功提交，我們會盡快與您聯繫確認。
          </p>
          <Button onClick={onCancel}>
            關閉
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          預約 {cardName}
          {cardCompany && (
            <Badge variant="secondary" className="text-xs">
              {cardCompany}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">選擇日期</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, 'yyyy年MM月dd日', { locale: zhTW })
                  ) : (
                    <span>選擇預約日期</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  locale={zhTW}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          {selectedDate && timeSlots.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="time">選擇時間</Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className="text-sm"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label htmlFor="duration">預約時長</Label>
            <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
              <SelectTrigger>
                <SelectValue placeholder="選擇時長" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15分鐘</SelectItem>
                <SelectItem value="30">30分鐘</SelectItem>
                <SelectItem value="45">45分鐘</SelectItem>
                <SelectItem value="60">1小時</SelectItem>
                <SelectItem value="90">1.5小時</SelectItem>
                <SelectItem value="120">2小時</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="name">姓名 *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="請輸入您的姓名"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">電子郵件</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">電話號碼</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="請輸入您的電話號碼"
            />
          </div>

          {/* Appointment Title */}
          <div className="space-y-2">
            <Label htmlFor="title">預約主題</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="例如：房產諮詢、投資建議等"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">備註說明</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="請描述您的需求或任何特殊說明..."
              rows={3}
            />
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              取消
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || !selectedDate || !selectedTime || !formData.name.trim()}
              className="flex-1"
            >
              {submitting ? '提交中...' : '確認預約'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}