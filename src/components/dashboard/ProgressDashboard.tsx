
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCommunityMember, getCommunity } from '@/services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Target, TrendingUp, Trophy, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import ProgressLogForm from './ProgressLogForm';
import { CommunityMember } from '@/types';

const ProgressDashboard = () => {
  const { id: communityId } = useParams<{ id: string }>();
  const [showProgressForm, setShowProgressForm] = useState(false);
  
  const { data: community, isLoading: communityLoading } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityId ? getCommunity(communityId) : Promise.reject('No community ID'),
    enabled: !!communityId,
  });
  
  const { data: membership, isLoading: membershipLoading } = useQuery({
    queryKey: ['communityMember', communityId],
    queryFn: () => communityId ? getCommunityMember(communityId) : Promise.reject('No community ID'),
    enabled: !!communityId,
  });
  
  const isLoading = communityLoading || membershipLoading;
  
  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }
  
  if (!community || !membership) {
    return (
      <div className="w-full p-8">
        <Card>
          <CardHeader>
            <CardTitle>Progress Dashboard</CardTitle>
            <CardDescription>
              Unable to load progress data. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const daysUntilDeadline = differenceInDays(new Date(community.deadline), new Date());
  const daysElapsed = differenceInDays(new Date(), new Date(community.startDate));
  const totalDuration = differenceInDays(new Date(community.deadline), new Date(community.startDate));
  const timeProgress = Math.min(100, Math.max(0, (daysElapsed / totalDuration) * 100));
  
  const getStatusColor = (status: CommunityMember['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-amber-500';
      case 'completed': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };
  
  return (
    <div className="w-full p-4 space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="update">Update Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{community.name}</CardTitle>
                  <CardDescription className="mt-1">Goal: {community.goal}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(membership.status)} text-white`}>
                  {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>Your Progress</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">{membership.progress}%</span>
                      <span className="text-sm text-muted-foreground">Goal: 100%</span>
                    </div>
                    <Progress value={membership.progress} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Time Progress</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">{Math.round(timeProgress)}%</span>
                      <span className="text-sm text-muted-foreground">
                        {daysUntilDeadline > 0 
                          ? `${daysUntilDeadline} days left` 
                          : "Deadline passed"}
                      </span>
                    </div>
                    <Progress value={timeProgress} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" /> Start Date
                      </span>
                      <span className="text-sm font-medium">
                        {format(new Date(community.startDate), 'PPP')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" /> Deadline
                      </span>
                      <span className="text-sm font-medium">
                        {format(new Date(community.deadline), 'PPP')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> Staked Amount
                      </span>
                      <span className="text-sm font-medium">
                        ${community.stakingAmount.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> Completion Status
                      </span>
                      <span className="text-sm font-medium">
                        {membership.progress === 100 ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => setShowProgressForm(true)}
              >
                Update Your Progress
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="update">
          {membership && (
            <ProgressLogForm 
              currentProgress={membership.progress} 
              memberId={membership.id}
              onSuccessfulUpdate={() => setShowProgressForm(false)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressDashboard;
