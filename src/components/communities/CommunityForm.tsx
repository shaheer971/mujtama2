
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CommunityVisibility } from '@/types';

interface CommunityFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CommunityForm = ({ onSubmit, onCancel }: CommunityFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: '',
    goalAmount: '',
    stakingAmount: '',
    visibility: 'public' as CommunityVisibility,
    startDate: undefined as Date | undefined,
    deadline: undefined as Date | undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisibilityChange = (value: CommunityVisibility) => {
    setFormData((prev) => ({ ...prev, visibility: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add validation here
    
    onSubmit(formData);
  };

  // Calculate minimum allowed start date (24 hours from now)
  const minStartDate = new Date();
  minStartDate.setHours(minStartDate.getHours() + 24);

  // Calculate minimum deadline (must be after start date)
  const minDeadline = formData.startDate || new Date();
  minDeadline.setDate(minDeadline.getDate() + 1);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="name">Community Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Daily Meditation Group"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your community and its goals..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="goal">Goal</Label>
          <Input
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            placeholder="Meditate for 10 minutes daily"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="goalAmount">Goal Amount (Optional)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4">
                    <Info className="h-3 w-3" />
                    <span className="sr-only">Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    For measurable goals like steps or pages, enter the target number
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="goalAmount"
            name="goalAmount"
            type="number"
            value={formData.goalAmount}
            onChange={handleChange}
            placeholder="e.g., 50000 steps"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Label htmlFor="stakingAmount">Staking Amount ($)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <Info className="h-3 w-3" />
                  <span className="sr-only">Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  The amount each member will contribute as a stake. This will be the default, but can be voted on by members.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="stakingAmount"
          name="stakingAmount"
          type="number"
          value={formData.stakingAmount}
          onChange={handleChange}
          placeholder="50"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Visibility</Label>
        <RadioGroup
          value={formData.visibility}
          onValueChange={handleVisibilityChange}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public" className="cursor-pointer">Public - Anyone can find and join</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private" className="cursor-pointer">Private - Only people with the link can join</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date (at least 24h from now)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span>Pick a start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => setFormData((prev) => ({ ...prev, startDate: date }))}
                disabled={(date) => date < minStartDate}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.deadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.deadline ? (
                  format(formData.deadline, "PPP")
                ) : (
                  <span>Pick a deadline</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={formData.deadline}
                onSelect={(date) => setFormData((prev) => ({ ...prev, deadline: date }))}
                disabled={(date) => date <= minDeadline}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Community</Button>
      </div>
    </form>
  );
};

export default CommunityForm;
