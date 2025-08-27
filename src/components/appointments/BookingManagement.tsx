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
import { Switch } from '@/components/ui/switch';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Monitor,
  DollarSign,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Coffee,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

interface TimeSlot {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxBookings?: number;
}

interface BookingSettings {
  id: string;
  userId: string;
  locationType: 'in-person' | 'online' | 'both';
  locationAddress?: string;
  onlineMeetingLink?: string;
  basePrice: number;
  currency: string;
  duration: number; // default duration in minutes
  maxAdvanceDays: number; // how many days in advance users can book
  minAdvanceHours: number; // minimum hours in advance for booking
  cancellationPolicy: string;
  timeSlots: TimeSlot[];
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
  // Working hours
  monEnabled: boolean;
  monStart: string;
  monEnd: string;
  tueEnabled: boolean;
  tueStart: string;
  tueEnd: string;
  wedEnabled: boolean;
  wedStart: string;
  wedEnd: string;
  thuEnabled: boolean;
  thuStart: string;
  thuEnd: string;
  friEnabled: boolean;
  friStart: string;
  friEnd: string;
  satEnabled: boolean;
  satStart: string;
  satEnd: string;
  sunEnabled: boolean;
  sunStart: string;
  sunEnd: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingManagementProps {
  userId: string;
}

const getDayKey = (dayValue: number) => {
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return dayKeys[dayValue];
};

const daysOfWeek = [
  { value: 0, labelKey: 'booking.sunday' },
  { value: 1, labelKey: 'booking.monday' },
  { value: 2, labelKey: 'booking.tuesday' },
  { value: 3, labelKey: 'booking.wednesday' },
  { value: 4, labelKey: 'booking.thursday' },
  { value: 5, labelKey: 'booking.friday' },
  { value: 6, labelKey: 'booking.saturday' }
];

const currencies = [
  { value: 'USD', labelKey: 'booking.currencyUSD' },
  { value: 'EUR', labelKey: 'booking.currencyEUR' },
  { value: 'JPY', labelKey: 'booking.currencyJPY' },
  { value: 'GBP', labelKey: 'booking.currencyGBP' },
  { value: 'AUD', labelKey: 'booking.currencyAUD' },
  { value: 'CNY', labelKey: 'booking.currencyCNY' },
  { value: 'HKD', labelKey: 'booking.currencyHKD' }
];

export default function BookingManagement({ userId }: BookingManagementProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isTimeSlotDialogOpen, setIsTimeSlotDialogOpen] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [settingsForm, setSettingsForm] = useState({
    locationType: 'both' as const,
    locationAddress: '',
    onlineMeetingLink: '',
    basePrice: 0,
    currency: 'USD',
    duration: 60,
    maxAdvanceDays: 30,
    minAdvanceHours: 2,
    cancellationPolicy: '',
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    // Working hours
    monEnabled: true,
    monStart: '09:00',
    monEnd: '17:00',
    tueEnabled: true,
    tueStart: '09:00',
    tueEnd: '17:00',
    wedEnabled: true,
    wedStart: '09:00',
    wedEnd: '17:00',
    thuEnabled: true,
    thuStart: '09:00',
    thuEnd: '17:00',
    friEnabled: true,
    friStart: '09:00',
    friEnd: '17:00',
    satEnabled: false,
    satStart: '09:00',
    satEnd: '17:00',
    sunEnabled: false,
    sunStart: '09:00',
    sunEnd: '17:00'
  });
  const [timeSlotForm, setTimeSlotForm] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '18:00',
    isAvailable: true,
    maxBookings: 1
  });

  useEffect(() => {
    setMounted(true);
    loadBookingSettings();
  }, [userId]);

  const loadBookingSettings = async () => {
    try {
      console.log('=== LOAD BOOKING SETTINGS DEBUG ===');
      console.log('Loading for userId:', userId);
      const response = await fetch(`/api/booking-settings?userId=${userId}`);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received data:', data);
        setSettings(data);
        if (data) {
          setSettingsForm({
            locationType: data.locationType,
            locationAddress: data.locationAddress || '',
            onlineMeetingLink: data.onlineMeetingLink || '',
            basePrice: data.basePrice,
            currency: data.currency,
            duration: data.duration,
            maxAdvanceDays: data.maxAdvanceDays,
            minAdvanceHours: data.minAdvanceHours,
            cancellationPolicy: data.cancellationPolicy || '',
            lunchBreakStart: data.lunchBreakStart || '12:00',
            lunchBreakEnd: data.lunchBreakEnd || '13:00',
            // Working hours
            monEnabled: data.monEnabled,
            monStart: data.monStart,
            monEnd: data.monEnd,
            tueEnabled: data.tueEnabled,
            tueStart: data.tueStart,
            tueEnd: data.tueEnd,
            wedEnabled: data.wedEnabled,
            wedStart: data.wedStart,
            wedEnd: data.wedEnd,
            thuEnabled: data.thuEnabled,
            thuStart: data.thuStart,
            thuEnd: data.thuEnd,
            friEnabled: data.friEnabled,
            friStart: data.friStart,
            friEnd: data.friEnd,
            satEnabled: data.satEnabled,
            satStart: data.satStart,
            satEnd: data.satEnd,
            sunEnabled: data.sunEnabled,
            sunStart: data.sunStart,
            sunEnd: data.sunEnd
          });
          console.log('Settings form updated successfully');
        } else {
          console.log('No data received, using defaults');
        }
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        setError(t('booking.loadError'));
      }
    } catch (error) {
      console.error('Failed to load booking settings:', error);
      setError(t('booking.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const saveBookingSettings = async () => {
    try {
      console.log('=== SAVE BOOKING SETTINGS DEBUG ===');
      console.log('Current settings:', settings);
      console.log('Settings form:', settingsForm);
      console.log('User ID:', userId);
      
      const method = settings ? 'PUT' : 'POST';
      const url = settings ? `/api/booking-settings/${settings.id}` : '/api/booking-settings';
      
      console.log('Method:', method);
      console.log('URL:', url);
      
      const requestBody = {
        ...settingsForm,
        userId,
        lunchBreakStart: settingsForm.lunchBreakStart || null,
        lunchBreakEnd: settingsForm.lunchBreakEnd || null
      };
      
      console.log('Request body:', requestBody);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        await loadBookingSettings();
        setIsSettingsDialogOpen(false);
        console.log('Save successful!');
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        setError(t('booking.saveError'));
      }
    } catch (error) {
      console.error('Failed to save booking settings:', error);
      setError(t('booking.saveError'));
    }
  };

  const saveTimeSlot = async () => {
    try {
      if (!settings) return;

      const method = editingTimeSlot ? 'PUT' : 'POST';
      const url = editingTimeSlot 
        ? `/api/booking-settings/${settings.id}/time-slots/${editingTimeSlot.id}`
        : `/api/booking-settings/${settings.id}/time-slots`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timeSlotForm),
      });

      if (response.ok) {
        await loadBookingSettings();
        setIsTimeSlotDialogOpen(false);
        setEditingTimeSlot(null);
        resetTimeSlotForm();
      } else {
        setError(t('booking.timeSlotSaveError'));
      }
    } catch (error) {
      console.error('Failed to save time slot:', error);
      setError(t('booking.timeSlotSaveError'));
    }
  };

  const deleteTimeSlot = async (timeSlotId: string) => {
    if (!settings || !confirm(t('booking.confirmDeleteTimeSlot'))) {
      return;
    }

    try {
      const response = await fetch(`/api/booking-settings/${settings.id}/time-slots/${timeSlotId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadBookingSettings();
      } else {
        setError(t('booking.timeSlotDeleteError'));
      }
    } catch (error) {
      console.error('Failed to delete time slot:', error);
      setError(t('booking.timeSlotDeleteError'));
    }
  };

  const openTimeSlotDialog = (timeSlot?: TimeSlot) => {
    if (timeSlot) {
      setEditingTimeSlot(timeSlot);
      setTimeSlotForm({
        dayOfWeek: timeSlot.dayOfWeek,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        isAvailable: timeSlot.isAvailable,
        maxBookings: timeSlot.maxBookings || 1
      });
    } else {
      setEditingTimeSlot(null);
      resetTimeSlotForm();
    }
    setIsTimeSlotDialogOpen(true);
  };

  const resetTimeSlotForm = () => {
    setTimeSlotForm({
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '18:00',
      isAvailable: true,
      maxBookings: 1
    });
  };

  const applyToAllDays = (dayPrefix: string) => {
    console.log('=== APPLY TO ALL DAYS DEBUG ===');
    console.log('Day prefix:', dayPrefix);
    
    // Always use settingsForm since that's what the user is currently editing
    const enabled = settingsForm[`${dayPrefix}Enabled` as keyof typeof settingsForm] as boolean;
    const startTime = settingsForm[`${dayPrefix}Start` as keyof typeof settingsForm] as string;
    const endTime = settingsForm[`${dayPrefix}End` as keyof typeof settingsForm] as string;
    
    console.log('Current day settings:', { enabled, startTime, endTime });

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const updates: any = {};

    days.forEach(day => {
      updates[`${day}Enabled`] = enabled;
      updates[`${day}Start`] = startTime;
      updates[`${day}End`] = endTime;
    });
    
    console.log('Updates to apply:', updates);

    setSettingsForm(prev => ({ ...prev, ...updates }));
    console.log('Settings form updated');
  };

  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'in-person': return t('booking.locationTypeInPerson');
      case 'online': return t('booking.locationTypeOnline');
      case 'both': return t('booking.locationTypeBoth');
      default: return type;
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return 'US$';
      case 'EUR': return '€';
      case 'JPY': return '¥';
      case 'GBP': return '£';
      case 'AUD': return 'A$';
      case 'CNY': return '¥';
      case 'HKD': return 'HK$';
      default: return currency;
    }
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // Remove seconds if present
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>{t('booking.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('booking.managementTitle')}</h1>
          <p className="text-gray-600">{t('booking.managementDesc')}</p>
        </div>
        <Button onClick={() => setIsSettingsDialogOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />
          {t('booking.settings')}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!settings ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('booking.notConfigured')}</h3>
            <p className="text-gray-600 mb-4">{t('booking.notConfiguredDesc')}</p>
            <Button onClick={() => setIsSettingsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('booking.createSettings')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t('booking.tabOverview')}</TabsTrigger>
            <TabsTrigger value="working-hours">{t('booking.tabWorkingHours')}</TabsTrigger>
            <TabsTrigger value="time-slots">{t('booking.tabTimeSlots')}</TabsTrigger>
            <TabsTrigger value="pricing">{t('booking.tabPricing')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('booking.bookingMethod')}</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getLocationTypeLabel(settings.locationType)}</div>
                  <p className="text-xs text-muted-foreground">
                    {settings.locationType === 'in-person' && t('booking.inPersonOnly')}
                    {settings.locationType === 'online' && t('booking.onlineOnly')}
                    {settings.locationType === 'both' && t('booking.bothBooking')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('booking.basePrice')}</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {getCurrencySymbol(settings.currency)}{settings.basePrice}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('booking.perMinutes', { minutes: settings.duration })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('booking.availableTimeSlots')}</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {settings.timeSlots?.filter(ts => ts.isAvailable).length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('booking.totalTimeSlots', { count: settings.timeSlots?.length || 0 })}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Location Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {t('booking.locationSettings')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">{t('booking.bookingMethod')}</Label>
                    <p className="text-sm text-gray-600">{getLocationTypeLabel(settings.locationType)}</p>
                  </div>
                  
                  {settings.locationAddress && (
                    <div>
                      <Label className="text-sm font-medium">{t('booking.locationAddress')}</Label>
                      <p className="text-sm text-gray-600">{settings.locationAddress}</p>
                    </div>
                  )}
                  
                  {settings.onlineMeetingLink && (
                    <div>
                      <Label className="text-sm font-medium">{t('booking.onlineMeetingLink')}</Label>
                      <p className="text-sm text-gray-600 break-all">{settings.onlineMeetingLink}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Time Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Time Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Duration</Label>
                    <p className="text-sm text-gray-600">{settings.duration} minutes</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Maximum Advance Days</Label>
                    <p className="text-sm text-gray-600">{t('booking.advanceDays', { days: settings.maxAdvanceDays })}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">{t('booking.minAdvanceHours')}</Label>
                    <p className="text-sm text-gray-600">{t('booking.advanceHours', { hours: settings.minAdvanceHours })}</p>
                  </div>
                  
                  {settings.lunchBreakStart && settings.lunchBreakEnd && (
                    <div>
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Coffee className="w-4 h-4" />
                        {t('booking.lunchBreak')}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {formatTime(settings.lunchBreakStart)} - {formatTime(settings.lunchBreakEnd)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Working Hours Tab */}
          <TabsContent value="working-hours" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('booking.workingHoursSettings')}</CardTitle>
                  <Button onClick={() => setIsSettingsDialogOpen(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    {t('booking.editWorkingHours')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {daysOfWeek.map((day) => {
                    const dayKey = getDayKey(day.value);
                    const enabled = settings ? settings[`${dayKey}Enabled` as keyof typeof settings] as boolean : settingsForm[`${dayKey}Enabled` as keyof typeof settingsForm] as boolean;
                    const startTime = settings ? settings[`${dayKey}Start` as keyof typeof settings] as string : settingsForm[`${dayKey}Start` as keyof typeof settingsForm] as string;
                    const endTime = settings ? settings[`${dayKey}End` as keyof typeof settings] as string : settingsForm[`${dayKey}End` as keyof typeof settingsForm] as string;
                    
                    return (
                      <Card key={day.value} className={`p-4 ${enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{t(day.labelKey)}</h3>
                            <Badge variant={enabled ? "default" : "secondary"}>
                              {enabled ? t('booking.open') : t('booking.closed')}
                            </Badge>
                          </div>
                          
                          {enabled && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => applyToAllDays(dayKey)}
                                className="w-full"
                              >
                                Apply to All Days
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Slots Tab */}
          <TabsContent value="time-slots" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('booking.timeSlotManagement')}</CardTitle>
                  <Button onClick={() => openTimeSlotDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('booking.addTimeSlot')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {settings.timeSlots && settings.timeSlots.length > 0 ? (
                  <div className="space-y-4">
                    {settings.timeSlots.map((timeSlot) => (
                      <div key={timeSlot.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <Badge variant={timeSlot.isAvailable ? "default" : "secondary"}>
                                {daysOfWeek.find(d => d.value === timeSlot.dayOfWeek)?.label}
                              </Badge>
                              <span className="text-lg font-semibold">
                                {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
                              </span>
                              {timeSlot.maxBookings && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {t('booking.maxBookings')}: {timeSlot.maxBookings}
                                </Badge>
                              )}
                            </div>
                            {!timeSlot.isAvailable && (
                              <p className="text-sm text-gray-500">{t('booking.timeSlotNotAvailable')}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openTimeSlotDialog(timeSlot)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteTimeSlot(timeSlot.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">{t('booking.noTimeSlots')}</p>
                    <Button onClick={() => openTimeSlotDialog()}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('booking.addFirstTimeSlot')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('booking.pricingSettings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium">{t('booking.basePrice')}</Label>
                    <div className="mt-1">
                      <span className="text-2xl font-bold">
                        {getCurrencySymbol(settings.currency)}{settings.basePrice}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        / {settings.duration} minutes
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Currency</Label>
                    <p className="text-lg font-semibold mt-1">
                      {currencies.find(c => c.value === settings.currency)?.label}
                    </p>
                  </div>
                </div>

                {settings.cancellationPolicy && (
                  <div>
                    <Label className="text-sm font-medium">{t('booking.cancellationPolicy')}</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {settings.cancellationPolicy}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button onClick={() => setIsSettingsDialogOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    {t('booking.editPricing')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('booking.settings')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
                {/* Location Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Settings
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="locationType">{t('booking.bookingMethod')}</Label>
                <Select 
                  value={settingsForm.locationType} 
                  onValueChange={(value: any) => setSettingsForm(prev => ({ ...prev, locationType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">{t('booking.locationTypeInPerson')}</SelectItem>
                    <SelectItem value="online">{t('booking.locationTypeOnline')}</SelectItem>
                    <SelectItem value="both">{t('booking.locationTypeBoth')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(settingsForm.locationType === 'in-person' || settingsForm.locationType === 'both') && (
                <div className="space-y-2">
                  <Label htmlFor="locationAddress">{t('booking.locationAddress')}</Label>
                  <Textarea
                    id="locationAddress"
                    placeholder={t('booking.locationAddressPlaceholder')}
                    value={settingsForm.locationAddress}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, locationAddress: e.target.value }))}
                    rows={3}
                  />
                </div>
              )}

              {(settingsForm.locationType === 'online' || settingsForm.locationType === 'both') && (
                <div className="space-y-2">
                  <Label htmlFor="onlineMeetingLink">{t('booking.onlineMeetingLink')}</Label>
                  <Input
                    id="onlineMeetingLink"
                    placeholder={t('booking.onlineMeetingLinkPlaceholder')}
                    value={settingsForm.onlineMeetingLink}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, onlineMeetingLink: e.target.value }))}
                  />
                </div>
              )}
            </div>

            {/* Pricing Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Price Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">{t('booking.basePrice')}</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={settingsForm.basePrice}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, basePrice: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={settingsForm.currency} 
                    onValueChange={(value) => setSettingsForm(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(currency => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {t(currency.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">{t('booking.cancellationPolicy')}</Label>
                <Textarea
                  id="cancellationPolicy"
                  placeholder={t('booking.cancellationPolicyPlaceholder')}
                  value={settingsForm.cancellationPolicy}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            {/* Time Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Time Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    placeholder="60"
                    value={settingsForm.duration}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAdvanceDays">Maximum Advance Days</Label>
                  <Input
                    id="maxAdvanceDays"
                    type="number"
                    min="1"
                    max="365"
                    placeholder="30"
                    value={settingsForm.maxAdvanceDays}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, maxAdvanceDays: parseInt(e.target.value) || 30 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minAdvanceHours">Minimum Advance Hours (hours)</Label>
                  <Input
                    id="minAdvanceHours"
                    type="number"
                    min="1"
                    max="168"
                    placeholder="2"
                    value={settingsForm.minAdvanceHours}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, minAdvanceHours: parseInt(e.target.value) || 2 }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  Lunch Break Settings
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lunchBreakStart">Lunch Break Start</Label>
                    <Input
                      id="lunchBreakStart"
                      type="time"
                      value={settingsForm.lunchBreakStart}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, lunchBreakStart: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lunchBreakEnd">Lunch Break End</Label>
                    <Input
                      id="lunchBreakEnd"
                      type="time"
                      value={settingsForm.lunchBreakEnd}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, lunchBreakEnd: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t('booking.workingHoursSettings')}
                </h4>
                
                <div className="space-y-4">
                  {daysOfWeek.map((day) => {
                    const dayKey = getDayKey(day.value);
                    const enabled = settingsForm[`${dayKey}Enabled` as keyof typeof settingsForm] as boolean;
                    const startTime = settingsForm[`${dayKey}Start` as keyof typeof settingsForm] as string;
                    const endTime = settingsForm[`${dayKey}End` as keyof typeof settingsForm] as string;
                    
                    return (
                      <div key={day.value} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Switch
                              id={`${dayKey}Enabled`}
                              checked={enabled}
                              onCheckedChange={(checked) => 
                                setSettingsForm(prev => ({ 
                                  ...prev, 
                                  [`${dayKey}Enabled`]: checked 
                                }))
                              }
                            />
                            <Label htmlFor={`${dayKey}Enabled`} className="font-medium">
                              {t(day.labelKey)}
                            </Label>
                          </div>
                          
                          {enabled && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => applyToAllDays(dayKey)}
                            >
                              Apply to All Days
                            </Button>
                          )}
                        </div>
                        
                        {enabled && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor={`${dayKey}Start`}>{t('booking.startTime')}</Label>
                              <Input
                                id={`${dayKey}Start`}
                                type="time"
                                value={startTime}
                                onChange={(e) => setSettingsForm(prev => ({ 
                                  ...prev, 
                                  [`${dayKey}Start`]: e.target.value 
                                }))}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`${dayKey}End`}>{t('booking.endTime')}</Label>
                              <Input
                                id={`${dayKey}End`}
                                type="time"
                                value={endTime}
                                onChange={(e) => setSettingsForm(prev => ({ 
                                  ...prev, 
                                  [`${dayKey}End`]: e.target.value 
                                }))}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsSettingsDialogOpen(false)}
                className="flex-1"
              >
                {t('booking.cancel')}
              </Button>
              <Button 
                onClick={saveBookingSettings}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {t('booking.saveSettings')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Time Slot Dialog */}
      <Dialog open={isTimeSlotDialogOpen} onOpenChange={setIsTimeSlotDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTimeSlot ? t('booking.editTimeSlot') : t('booking.addTimeSlotTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">{t('booking.dayOfWeek')}</Label>
              <Select 
                value={timeSlotForm.dayOfWeek.toString()} 
                onValueChange={(value) => setTimeSlotForm(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {t(day.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">{t('booking.startTime')}</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={timeSlotForm.startTime}
                  onChange={(e) => setTimeSlotForm(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">{t('booking.endTime')}</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={timeSlotForm.endTime}
                  onChange={(e) => setTimeSlotForm(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxBookings">{t('booking.maxBookings')}</Label>
              <Input
                id="maxBookings"
                type="number"
                min="1"
                max="50"
                placeholder="1"
                value={timeSlotForm.maxBookings}
                onChange={(e) => setTimeSlotForm(prev => ({ ...prev, maxBookings: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={timeSlotForm.isAvailable}
                onCheckedChange={(checked) => setTimeSlotForm(prev => ({ ...prev, isAvailable: checked }))}
              />
              <Label htmlFor="isAvailable">{t('booking.isAvailable')}</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsTimeSlotDialogOpen(false)}
                className="flex-1"
              >
                {t('booking.cancel')}
              </Button>
              <Button 
                onClick={saveTimeSlot}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {t('booking.saveTimeSlot')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}