
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Calendar, ArrowUpRight, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Container from '@/components/ui/Container';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CommunityCard from '@/components/communities/CommunityCard';
import ProgressTracker from '@/components/communities/ProgressTracker';
import { Community, CommunityMember } from '@/types';

// Mock data
const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Daily Meditation Group',
    description: 'Meditate for at least 10 minutes every day for 30 days',
    goal: 'Meditate 10 minutes daily',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    visibility: 'public',
    status: 'active',
    stakingAmount: 25,
    membersCount: 8,
    creator: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      joinedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    }
  },
  {
    id: '2',
    name: '50K Steps Challenge',
    description: 'Walk at least 50,000 steps by the end of the week',
    goal: 'Walk 50,000 steps',
    goalAmount: 50000,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    visibility: 'public',
    status: 'active',
    stakingAmount: 30,
    membersCount: 12,
    creator: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      joinedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    }
  },
];

const mockMembers: CommunityMember[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      joinedAt: new Date(),
    },
    communityId: '1',
    joinedAt: new Date(),
    hasStaked: true,
    progress: 65,
    status: 'active',
    hasAcceptedTerms: true,
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      joinedAt: new Date(),
    },
    communityId: '1',
    joinedAt: new Date(),
    hasStaked: true,
    progress: 80,
    status: 'active',
    hasAcceptedTerms: true,
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      joinedAt: new Date(),
    },
    communityId: '1',
    joinedAt: new Date(),
    hasStaked: true,
    progress: 50,
    status: 'active',
    hasAcceptedTerms: true,
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [progress, setProgress] = useState(32500);

  const handleUpdateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <Container maxWidth="2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress and manage your communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center"
              >
                <h2 className="text-xl font-semibold">My Communities</h2>
                <Button asChild>
                  <Link to="/communities/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                  </Link>
                </Button>
              </motion.div>
              
              <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 w-full sm:w-auto">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mockCommunities.map((community) => (
                      <motion.div
                        key={community.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CommunityCard community={community} />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="pending" className="animate-fade-in">
                  <div className="h-32 flex items-center justify-center border rounded-lg border-dashed">
                    <p className="text-muted-foreground">No pending communities</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="animate-fade-in">
                  <div className="h-32 flex items-center justify-center border rounded-lg border-dashed">
                    <p className="text-muted-foreground">No completed communities</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {mockCommunities.map((community) => (
                        <div key={community.id} className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{community.name}</h3>
                              <p className="text-sm text-muted-foreground">{community.goal}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(community.deadline).toLocaleDateString()}
                            </span>
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/communities/${community.id}`}>
                                <ArrowUpRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <ProgressTracker
                  goalName="50K Steps Challenge"
                  goalTarget={50000}
                  currentProgress={progress}
                  deadline={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)}
                  members={mockMembers}
                  onUpdateProgress={handleUpdateProgress}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Community Activity</CardTitle>
                    <CardDescription>Recent updates</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="divide-y">
                      <div className="p-4 flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm"><span className="font-medium">Jane Smith</span> joined <span className="font-medium">Daily Meditation Group</span></p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="p-4 flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm"><span className="font-medium">Mike Johnson</span> updated progress to 80% in <span className="font-medium">50K Steps Challenge</span></p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="p-4 flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm"><span className="font-medium">Daily Meditation Group</span> deadline is approaching</p>
                          <p className="text-xs text-muted-foreground">14 days remaining</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2">
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/notifications">View All Activity</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
