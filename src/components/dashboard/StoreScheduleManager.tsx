
import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type DaySchedule = {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

type WeekSchedule = {
  [key in Day]: DaySchedule;
};

const defaultSchedule: WeekSchedule = {
  monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  saturday: { isOpen: true, openTime: '10:00', closeTime: '15:00' },
  sunday: { isOpen: false, openTime: '10:00', closeTime: '15:00' },
};

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

interface StoreScheduleManagerProps {
  initialSchedule?: WeekSchedule;
  onSave?: (schedule: WeekSchedule) => Promise<void>;
}

const StoreScheduleManager = ({ 
  initialSchedule = defaultSchedule,
  onSave 
}: StoreScheduleManagerProps) => {
  const [schedule, setSchedule] = useState<WeekSchedule>(initialSchedule);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleToggleDay = (day: Day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen
      }
    }));
  };

  const handleTimeChange = (day: Day, field: 'openTime' | 'closeTime', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSaveSchedule = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(schedule);
      toast({
        title: "Schedule saved",
        description: "Your store schedule has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving schedule",
        description: "There was a problem saving your schedule. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Store Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {daysOfWeek.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-4">
                <Switch 
                  checked={schedule[key as Day].isOpen} 
                  onCheckedChange={() => handleToggleDay(key as Day)}
                  id={`${key}-toggle`}
                />
                <Label htmlFor={`${key}-toggle`} className="font-medium">
                  {label}
                </Label>
              </div>

              {schedule[key as Day].isOpen ? (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      value={schedule[key as Day].openTime}
                      onChange={(e) => handleTimeChange(key as Day, 'openTime', e.target.value)}
                      className="border rounded p-1 w-24"
                    />
                  </div>
                  <span>to</span>
                  <input
                    type="time"
                    value={schedule[key as Day].closeTime}
                    onChange={(e) => handleTimeChange(key as Day, 'closeTime', e.target.value)}
                    className="border rounded p-1 w-24"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-500">Closed</span>
              )}
            </div>
          ))}

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSaveSchedule}
              disabled={isSaving}
              className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center gap-2 ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Schedule'
              )}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreScheduleManager;
