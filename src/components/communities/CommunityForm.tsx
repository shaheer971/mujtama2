
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Info, Tag, Bookmark, Coins, UsersRound, Globe, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Define categories for communities
const CATEGORIES = [
  { id: 'education', name: 'Education' },
  { id: 'fitness', name: 'Fitness' },
  { id: 'career', name: 'Career' },
  { id: 'finance', name: 'Finance' },
  { id: 'personal', name: 'Personal Development' },
  { id: 'social', name: 'Social Impact' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'other', name: 'Other' },
];

interface CommunityFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CommunityForm = ({ onSubmit, onCancel }: CommunityFormProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: '',
    goalRationale: '',
    goalAmount: '',
    category: 'other',
    tags: '',
    stakingAmount: '',
    visibility: 'public' as CommunityVisibility,
    startDate: undefined as Date | undefined,
    deadline: undefined as Date | undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisibilityChange = (value: CommunityVisibility) => {
    setFormData((prev) => ({ ...prev, visibility: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.goal || !formData.stakingAmount || !formData.startDate || !formData.deadline) {
      // You could add better validation/error messaging here
      return;
    }
    
    // Process tags into an array
    const tagsArray = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];
    
    // Submit with processed data
    onSubmit({
      ...formData,
      tags: tagsArray,
      stakingAmount: parseFloat(formData.stakingAmount),
      goalAmount: formData.goalAmount ? parseFloat(formData.goalAmount) : undefined,
    });
  };

  // Calculate minimum allowed start date (24 hours from now)
  const minStartDate = new Date();
  minStartDate.setHours(minStartDate.getHours() + 24);

  // Calculate minimum deadline (must be after start date)
  const minDeadline = formData.startDate ? new Date(formData.startDate) : new Date();
  minDeadline.setDate(minDeadline.getDate() + 1);
  
  // Preview component for the multi-step form
  const CommunityPreview = () => (
    <Card className="border border-dashed">
      <CardHeader className="pb-2">
        <CardTitle>{formData.name || 'Community Name'}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-1">
          {formData.category && (
            <Badge variant="secondary">
              {CATEGORIES.find(c => c.id === formData.category)?.name || formData.category}
            </Badge>
          )}
          {formData.visibility === 'public' ? (
            <Badge variant="outline" className="flex gap-1 items-center">
              <Globe className="h-3 w-3" />
              Public
            </Badge>
          ) : (
            <Badge variant="outline" className="flex gap-1 items-center">
              <Lock className="h-3 w-3" />
              Private
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{formData.description || 'Community description will appear here'}</p>
        
        <div>
          <h4 className="text-sm font-medium mb-1">Goal</h4>
          <p className="text-sm">{formData.goal || 'Your goal will appear here'}</p>
          {formData.goalRationale && (
            <p className="text-xs text-muted-foreground mt-1">{formData.goalRationale}</p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {formData.tags && formData.tags.split(',').map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tag.trim()}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <h4 className="text-xs text-muted-foreground">Staking Amount</h4>
            <p>${formData.stakingAmount || '0'}</p>
          </div>
          <div>
            <h4 className="text-xs text-muted-foreground">Start Date</h4>
            <p>{formData.startDate ? format(formData.startDate, 'PPP') : 'Not set'}</p>
          </div>
          <div>
            <h4 className="text-xs text-muted-foreground">Deadline</h4>
            <p>{formData.deadline ? format(formData.deadline, 'PPP') : 'Not set'}</p>
          </div>
          {formData.goalAmount && (
            <div>
              <h4 className="text-xs text-muted-foreground">Goal Target</h4>
              <p>{formData.goalAmount}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="goal">Goal</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
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
              placeholder="Describe your community and its purpose..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="tags">Tags</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4">
                      <Info className="h-3 w-3" />
                      <span className="sr-only">Tag Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      Separate tags with commas. Tags help others discover your community.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="meditation, mindfulness, wellness"
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
                <Label htmlFor="public" className="cursor-pointer flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Public - Anyone can find and join</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="cursor-pointer flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Private - Only people with the link can join</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={() => setActiveTab('goal')}>
              Next: Goal Details
            </Button>
          </div>
        </TabsContent>
        
        {/* Goal Tab */}
        <TabsContent value="goal" className="space-y-4">
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
            <Label htmlFor="goalRationale">Rationale & Context (Optional)</Label>
            <Textarea
              id="goalRationale"
              name="goalRationale"
              value={formData.goalRationale}
              onChange={handleChange}
              placeholder="Explain why this goal is important and how it benefits members..."
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

          <div className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={() => setActiveTab('details')}>
              Back
            </Button>
            <Button type="button" onClick={() => setActiveTab('settings')}>
              Next: Settings
            </Button>
          </div>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
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
            <p className="text-xs text-muted-foreground mt-1">
              Members will get this amount back if they complete the goal. Otherwise, it gets redistributed among successful members.
            </p>
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
              <p className="text-xs text-muted-foreground mt-1">
                This provides time for member enrollment before the community starts.
              </p>
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

          <div className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={() => setActiveTab('goal')}>
              Back
            </Button>
            <Button type="button" onClick={() => setActiveTab('preview')}>
              Preview
            </Button>
          </div>
        </TabsContent>
        
        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Community Preview</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                This is how your community will appear to others.
              </p>
              <CommunityPreview />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Confirmation</CardTitle>
                <CardDescription>
                  Review your community details before creating
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <strong>Important:</strong> Once created, your community will be visible to others based on your visibility settings. Members will need to stake the amount you've specified to join.
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">What happens next?</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Community opens for joining until the start date</li>
                    <li>All members must confirm within 24 hours of the start date</li>
                    <li>Progress tracking begins after confirmation</li>
                    <li>Deposits are returned to members who meet the goal</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" className="w-full">Create Community</Button>
                <Button type="button" variant="outline" onClick={() => setActiveTab('settings')} className="w-full">
                  Go Back to Edit
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default CommunityForm;
