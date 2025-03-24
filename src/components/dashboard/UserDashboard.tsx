
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
import { format, isFuture } from 'date-fns';

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
  
  // Sort active memberships by deadline - closest deadline first
  const sortedActiveMemberships = [...activeMemberships].sort((a, b) => {
    const aDeadline = new Date(a.community?.deadline || 0);
    const bDeadline = new Date(b.community?.deadline || 0);
    return aDeadline.getTime() - bDeadline.getTime();
  });
  
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
                    <span>Joined {user.joinedAt ? format(new Date(user.joinedAt), 'MMM d, yyyy') : 'Recently'}</span>
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
            <Card key={i} className="min-h-[200px]">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="animate-pulse space-y-4 w-full">
                  <div className="h-6 bg-muted rounded-md w-3/4 mx-auto"></div>
                  <div className="h-4 bg-muted rounded-md w-1/2 mx-auto"></div>
                  <div className="h-8 bg-muted rounded-md w-full"></div>
                </div>
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
            {sortedActiveMemberships.slice(0, 3).map((membership) => (
              <Link key={membership.id} to={`/dashboard/communities/${membership.communityId}`}>
                <ProgressLogCard 
                  member={membership} 
                  communityName={membership.community?.name || 'Community'} 
                  deadline={membership.community?.deadline} 
                />
              </Link>
            ))}
          </div>
          
          {activeMemberships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedActiveMemberships
                    .filter(m => m.community?.deadline && isFuture(new Date(m.community.deadline)))
                    .slice(0, 3)
                    .map(membership => (
                      <div key={membership.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{membership.community?.name}</div>
                            <div className="text-sm text-muted-foreground">{membership.community?.goal}</div>
                          </div>
                        </div>
                        <div className="text-sm">
                          {membership.community?.deadline ? 
                            format(new Date(membership.community.deadline), 'MMM d, yyyy') : 
                            'No deadline'
                          }
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          )}
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
