
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useUserMemberships } from '@/hooks/use-queries';
import { Link } from 'react-router-dom';
import { ProgressLogCard } from '@/components/community/ProgressLogCard';
import { TrendingUp, Users, Calendar, Clock } from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const { data: memberships = [], isLoading } = useUserMemberships(user?.id);
  
  const activeMemberships = memberships.filter(m => m.status === 'active');
  const pendingMemberships = memberships.filter(m => m.status === 'pending');
  const totalStaked = memberships.reduce((sum, m) => 
    sum + (m.hasStaked ? (m.community?.stakingAmount || 0) : 0), 0);
  
  // Calculate average progress across all active communities
  const averageProgress = activeMemberships.length > 0
    ? activeMemberships.reduce((sum, m) => sum + m.progress, 0) / activeMemberships.length
    : 0;
  
  return (
    <div className="space-y-6">
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Welcome back, {user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{activeMemberships.length} Active Communities</Badge>
                    {totalStaked > 0 && (
                      <Badge variant="secondary">${totalStaked} Staked</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator className="md:hidden" />
              
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm">{Math.round(averageProgress * 100)}%</span>
                  </div>
                  <Progress value={Math.round(averageProgress * 100)} />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{memberships.length} Communities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>{pendingMemberships.length} Pending Goals</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6 h-40 flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : activeMemberships.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Your Active Goals</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/communities">View All Communities</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeMemberships.slice(0, 3).map((membership) => (
              <Link key={membership.id} to={`/dashboard/communities/${membership.communityId}`}>
                <ProgressLogCard 
                  member={membership} 
                  communityName={membership.community?.name || 'Community'} 
                  deadline={membership.community?.deadline} 
                />
              </Link>
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="p-6 text-center py-8">
            <h3 className="font-medium mb-2">You haven't joined any communities yet</h3>
            <p className="text-muted-foreground mb-4">
              Join a community to start tracking your progress towards shared goals.
            </p>
            <Button asChild>
              <Link to="/dashboard/communities">Browse Communities</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
