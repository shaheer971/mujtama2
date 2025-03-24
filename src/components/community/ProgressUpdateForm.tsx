
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMemberProgress } from '@/services/api';
import { toast } from 'sonner';
import { CommunityMember } from '@/types';
import { Loader2 } from 'lucide-react';

interface ProgressUpdateFormProps {
  member: CommunityMember;
  onSuccess?: () => void;
}

const formSchema = z.object({
  progress: z.number().min(0).max(100),
  notes: z.string().optional(),
});

export const ProgressUpdateForm = ({ member, onSuccess }: ProgressUpdateFormProps) => {
  const queryClient = useQueryClient();
  const [currentProgress, setCurrentProgress] = useState(Math.round(member.progress * 100));
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      progress: Math.round(member.progress * 100),
      notes: '',
    },
  });
  
  const updateProgressMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return updateMemberProgress(
        member.id, 
        values.progress / 100, 
        values.notes
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityMembers', member.communityId] });
      queryClient.invalidateQueries({ queryKey: ['userMemberships'] });
      toast.success('Progress updated successfully');
      if (onSuccess) onSuccess();
      form.reset({
        progress: currentProgress,
        notes: '',
      });
    },
    onError: (error) => {
      toast.error('Failed to update progress');
      console.error('Update progress error:', error);
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateProgressMutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Your Progress</CardTitle>
        <CardDescription>
          Track your progress towards completing your community goal
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="progress"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between mb-2">
                    <FormLabel>Progress</FormLabel>
                    <span className="text-sm font-medium">{field.value}%</span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(vals) => {
                        field.onChange(vals[0]);
                        setCurrentProgress(vals[0]);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Slide to update your progress percentage
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share details about your progress..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share what you've accomplished or challenges you've faced
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={updateProgressMutation.isPending || !form.formState.isDirty}
              className="w-full"
            >
              {updateProgressMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Progress'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
