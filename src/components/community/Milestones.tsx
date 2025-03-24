
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Plus, CalendarClock, Users, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getCommunityMilestones, createMilestone, completeMilestone } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';

interface MilestonesProps {
  communityId: string;
  isCreator: boolean;
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  target_date: z.date().optional(),
  weight: z.number().int().min(1).default(1),
});

const Milestones = ({ communityId, isCreator }: MilestonesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [completionNote, setCompletionNote] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      weight: 1,
    },
  });

  const { data: milestones, isLoading } = useQuery({
    queryKey: ['milestones', communityId],
    queryFn: () => getCommunityMilestones(communityId),
  });

  const createMutation = useMutation({
    mutationFn: createMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', communityId] });
      setOpenAddDialog(false);
      form.reset();
      toast({
        title: 'Milestone created',
        description: 'The milestone has been added to the community',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create milestone',
        variant: 'destructive',
      });
      console.error('Error creating milestone:', error);
    }
  });

  const completeMutation = useMutation({
    mutationFn: (milestoneId: string) => completeMilestone(milestoneId, completionNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', communityId] });
      setNoteDialogOpen(false);
      setCompletionNote('');
      setSelectedMilestone(null);
      toast({
        title: 'Milestone completed',
        description: 'You have successfully completed this milestone',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to complete milestone',
        variant: 'destructive',
      });
      console.error('Error completing milestone:', error);
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMutation.mutate({
      community_id: communityId,
      title: values.title,
      description: values.description,
      target_date: values.target_date,
      weight: values.weight
    });
  };

  const handleCompleteMilestone = (milestone: any) => {
    setSelectedMilestone(milestone);
    setNoteDialogOpen(true);
  };

  const confirmCompleteMilestone = () => {
    if (selectedMilestone) {
      completeMutation.mutate(selectedMilestone.id);
    }
  };

  const isMilestoneCompleted = (milestone: any) => {
    if (!user) return false;
    return milestone.completions?.some((completion: any) => completion.user_id === user.id);
  };

  const getCompletionCount = (milestone: any) => {
    return milestone.completions?.length || 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
          <CardDescription>Loading milestones...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Milestones</CardTitle>
          <CardDescription>
            Track progress towards your community goal
          </CardDescription>
        </div>
        {isCreator && (
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" /> Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Milestone</DialogTitle>
                <DialogDescription>
                  Add a milestone to help track progress towards the community goal
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Milestone title" {...field} />
                        </FormControl>
                        <FormDescription>
                          A short title for the milestone
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what needs to be accomplished" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="target_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Target Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When this milestone should be completed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          The relative importance of this milestone (default: 1)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? 'Creating...' : 'Create Milestone'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      
      <CardContent>
        {milestones && milestones.length > 0 ? (
          <ScrollArea className="h-[380px] pr-4">
            <div className="space-y-4">
              {milestones.map((milestone: any, index: number) => {
                const isCompleted = isMilestoneCompleted(milestone);
                const completionCount = getCompletionCount(milestone);
                
                return (
                  <div 
                    key={milestone.id} 
                    className={cn(
                      "p-4 rounded-lg border",
                      isCompleted ? "bg-primary/5 border-primary/20" : "bg-card"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-medium">{milestone.title}</h3>
                          <div className="flex items-center gap-2">
                            {milestone.target_date && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <CalendarClock className="mr-1 h-3.5 w-3.5" />
                                    {format(new Date(milestone.target_date), 'MMM d')}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Target date: {format(new Date(milestone.target_date), 'PPP')}
                                </TooltipContent>
                              </Tooltip>
                            )}
                            
                            <Badge variant="outline" className="text-xs">
                              <Users className="mr-1 h-3 w-3" />
                              {completionCount}
                            </Badge>
                            
                            {milestone.weight > 1 && (
                              <Badge variant="secondary" className="text-xs">
                                Weight: {milestone.weight}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {milestone.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {milestone.description}
                          </p>
                        )}
                        
                        {!isCompleted && user && (
                          <div className="mt-3">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleCompleteMilestone(milestone)}
                            >
                              <CheckCircle2 className="mr-1 h-4 w-4" />
                              Mark as Completed
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index < milestones.length - 1 && <Separator className="mt-4" />}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center">
            <div className="flex justify-center mb-4 text-muted-foreground">
              <Info className="h-12 w-12 opacity-50" />
            </div>
            <h3 className="text-lg font-medium mb-2">No milestones yet</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {isCreator 
                ? "Create milestones to help track progress towards your community goal" 
                : "The community creator has not added any milestones yet"}
            </p>
            {isCreator && (
              <Button 
                className="mt-4"
                onClick={() => setOpenAddDialog(true)}
              >
                <Plus className="mr-1 h-4 w-4" /> Add First Milestone
              </Button>
            )}
          </div>
        )}
      </CardContent>
      
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Milestone</DialogTitle>
            <DialogDescription>
              Add an optional note about completing this milestone
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                placeholder="Share details about how you completed this milestone..."
                value={completionNote}
                onChange={(e) => setCompletionNote(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNoteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmCompleteMilestone}
              disabled={completeMutation.isPending}
            >
              {completeMutation.isPending ? 'Updating...' : 'Complete Milestone'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Milestones;
