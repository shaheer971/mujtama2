
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { CommunityMember } from '@/types';
import { TrendingUp, Clock } from 'lucide-react';

interface ProgressLogCardProps {
  member: CommunityMember;
  communityName: string;
  deadline?: Date;
}

export const ProgressLogCard = ({ member, communityName, deadline }: ProgressLogCardProps) => {
  const progressPercentage = Math.round(member.progress * 100);
  
  // Calculate days left if deadline is provided
  const daysLeft = deadline 
    ? Math.max(0, Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{communityName}</CardTitle>
            <CardDescription>
              Joined {formatDistanceToNow(member.joinedAt, { addSuffix: true })}
            </CardDescription>
          </div>
          {daysLeft !== null && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {daysLeft} days left
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Progress</span>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="font-medium">{progressPercentage}%</span>
            </div>
          </div>
          <Progress value={progressPercentage} />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Status</span>
            <span className="font-medium capitalize">{member.status}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Staking</span>
            <span className="font-medium">{member.hasStaked ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
