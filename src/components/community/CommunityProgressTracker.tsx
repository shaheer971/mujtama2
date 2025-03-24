
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { getCommunityMembers } from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, formatDistanceToNow } from 'date-fns';
import { CommunityMember } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface CommunityProgressTrackerProps {
  communityId: string;
}

export const CommunityProgressTracker = ({ communityId }: CommunityProgressTrackerProps) => {
  const { data: members = [], isLoading } = useQuery({
    queryKey: ['communityMembers', communityId],
    queryFn: () => getCommunityMembers(communityId),
  });

  const averageProgress = members.length > 0 
    ? Math.round(members.reduce((sum, member) => sum + member.progress * 100, 0) / members.length)
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-6 w-full" />
            <div className="mt-6 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Community Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Progress</span>
                <span className="font-medium">{averageProgress}%</span>
              </div>
              <Progress value={averageProgress} />
            </div>
            
            <div className="pt-4 space-y-4">
              <h3 className="font-medium">Member Progress</h3>
              {members.length > 0 ? (
                <div className="space-y-6">
                  {members.map((member) => (
                    <MemberProgressItem key={member.id} member={member} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No members in this community yet.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MemberProgressItemProps {
  member: CommunityMember;
}

const MemberProgressItem = ({ member }: MemberProgressItemProps) => {
  const progressPercentage = Math.round(member.progress * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={member.user.avatar} />
          <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between">
            <span className="font-medium">{member.user.name}</span>
            <span className="text-sm text-muted-foreground">
              Joined {formatDistanceToNow(member.joinedAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} />
      </div>
    </div>
  );
};
