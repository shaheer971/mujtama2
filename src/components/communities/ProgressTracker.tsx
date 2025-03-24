
import React from 'react';
import { Check, Clock, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CommunityMember } from '@/types';

interface ProgressTrackerProps {
  goalName: string;
  goalTarget?: number;
  currentProgress: number;
  deadline: Date;
  members?: CommunityMember[];
  onUpdateProgress: (progress: number) => void;
}

const ProgressTracker = ({ 
  goalName, 
  goalTarget, 
  currentProgress, 
  deadline, 
  members, 
  onUpdateProgress 
}: ProgressTrackerProps) => {
  const progressPercentage = goalTarget 
    ? Math.min((currentProgress / goalTarget) * 100, 100) 
    : currentProgress;
  
  const daysLeft = Math.max(0, Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  
  const handleUpdateProgress = () => {
    // In a real app, this would open a modal or form to update progress
    const newProgress = currentProgress + (goalTarget ? goalTarget * 0.1 : 10);
    onUpdateProgress(newProgress);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>My Progress</span>
          {progressPercentage >= 100 ? (
            <div className="inline-flex items-center text-green-500 text-sm font-normal">
              <Check className="mr-1 h-4 w-4" />
              Completed!
            </div>
          ) : (
            <div className="inline-flex items-center text-muted-foreground text-sm font-normal">
              <Clock className="mr-1 h-4 w-4" />
              {daysLeft} days left
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="font-medium">{goalName}</span>
              <span>
                {goalTarget ? `${currentProgress}/${goalTarget}` : `${progressPercentage}%`}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {members && members.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Community Progress</h4>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 overflow-hidden">
                      {member.user.avatar ? (
                        <img src={member.user.avatar} alt={member.user.name} className="w-full h-full object-cover" />
                      ) : (
                        member.user.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium truncate">{member.user.name}</span>
                        <span className="text-xs">{member.progress}%</span>
                      </div>
                      <Progress value={member.progress} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        {progressPercentage < 100 && (
          <Button onClick={handleUpdateProgress} className="w-full">
            <TrendingUp className="mr-2 h-4 w-4" />
            Update Progress
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProgressTracker;
