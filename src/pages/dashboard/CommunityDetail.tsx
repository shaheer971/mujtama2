import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCommunity, useCommunityMembers, useJoinCommunity } from '@/hooks/use-queries';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { CommunityChat } from '@/components/community/CommunityChat';
import { CommunityProgressTracker } from '@/components/community/CommunityProgressTracker';
import { CommunityMembersList } from '@/components/community/CommunityMembersList';
import { CommunitySettings } from '@/components/community/CommunitySettings';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: community, isLoading, error } = useCommunity(id || '');
  const { data: members = [], isLoading: membersLoading } = useCommunityMembers(id || '');
  const joinCommunityMutation = useJoinCommunity();
  const [activeTab, setActiveTab] = useState('overview');

  const handleJoinCommunity = () => {
    if (id) {
      joinCommunityMutation.mutate(id);
    }
  };

  const isUserMember = members.some(member => member.user.id === user?.id);
  const isCreator = community?.creator.id === user?.id;

  if (isLoading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 md:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load community details. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{community.name}</h1>
          <p className="text-muted-foreground">
            Created by {community.creator.name} • {formatDistanceToNow(community.createdAt, { addSuffix: true })}
          </p>
        </div>
        
        {!isUserMember && !isCreator && (
          <Button onClick={handleJoinCommunity} disabled={joinCommunityMutation.isPending}>
            {joinCommunityMutation.isPending ? 'Joining...' : 'Join Community'}
          </Button>
        )}
        
        {isCreator && (
          <Button variant="secondary" onClick={() => setActiveTab('settings')}>
            Manage Community
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="chat">Discussion</TabsTrigger>
          {isCreator && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={community.visibility === 'public' ? 'secondary' : 'outline'}>
                    {community.visibility === 'public' ? 'Public' : 'Private'}
                  </Badge>
                  <Badge variant={
                    community.status === 'active' ? 'default' :
                    community.status === 'completed' ? 'secondary' :
                    community.status === 'failed' ? 'destructive' : 'outline'
                  }>
                    {community.status.charAt(0).toUpperCase() + community.status.slice(1)}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p className="text-sm text-muted-foreground">{community.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Goal</h3>
                  <p className="text-sm text-muted-foreground">{community.goal}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{members.length} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${community.stakingAmount} stake</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Started {formatDistanceToNow(community.startDate, { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Ends {formatDistanceToNow(community.deadline, { addSuffix: true })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Community Progress</CardTitle>
                <CardDescription>Overall progress toward the community goal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {membersLoading ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Average Progress</span>
                      <span className="font-medium">
                        {members.length > 0 
                          ? Math.round(members.reduce((sum, member) => sum + member.progress, 0) / members.length) 
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={members.length > 0 
                        ? Math.round(members.reduce((sum, member) => sum + member.progress, 0) / members.length) 
                        : 0} 
                    />
                    
                    <div className="pt-4">
                      <h3 className="font-medium mb-2">Recent Activity</h3>
                      {members.length > 0 ? (
                        <div className="space-y-2">
                          {members.slice(0, 3).map(member => (
                            <div key={member.id} className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.user.avatar} />
                                <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium">{member.user.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(member.joinedAt, { addSuffix: true })}
                                  </span>
                                </div>
                                <Progress value={member.progress} className="h-2 mt-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No members have joined yet.</p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/dashboard/communities/${id}/progress`}>View Detailed Progress</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="progress">
          <CommunityProgressTracker communityId={id || ''} />
        </TabsContent>
        
        <TabsContent value="members">
          <CommunityMembersList communityId={id || ''} />
        </TabsContent>
        
        <TabsContent value="chat">
          <CommunityChat communityId={id || ''} />
        </TabsContent>
        
        {isCreator && (
          <TabsContent value="settings">
            <CommunitySettings community={community} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CommunityDetail;
