
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  Trophy, 
  DollarSign, 
  Calendar, 
  Clock, 
  Star,
  Target,
  CheckCircle2,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Container from '@/components/ui/Container';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CommunityCard from '@/components/communities/CommunityCard';
import { Community, User } from '@/types';
import { format } from 'date-fns';

// Mock current user data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
};

// Mock communities data
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

// Mock completed communities
const mockCompletedCommunities: Community[] = [
  {
    id: '3',
    name: 'Read 5 Books',
    description: 'Read 5 books in 3 months to improve knowledge',
    goal: 'Read 5 books',
    goalAmount: 5,
    deadline: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    visibility: 'public',
    status: 'completed',
    stakingAmount: 40,
    membersCount: 15,
    creator: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      joinedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
    }
  },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('communities');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: mockUser.name,
    email: mockUser.email,
  });

  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating profile:', editedProfile);
    setIsEditProfileOpen(false);
    // In a real app, this would make an API call to update the profile
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <Container maxWidth="2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="sticky top-24 space-y-6"
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarFallback className="text-xl">{mockUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-bold">{mockUser.name}</h2>
                      <p className="text-sm text-muted-foreground mb-4">{mockUser.email}</p>
                      
                      <div className="flex items-center gap-2 mb-6">
                        <Badge variant="outline" className="bg-primary/5">
                          <Trophy className="mr-1 h-3 w-3" />
                          3 Goals Completed
                        </Badge>
                      </div>
                      
                      <div className="w-full flex flex-col gap-4">
                        <Button variant="outline" className="w-full" onClick={() => setIsEditProfileOpen(true)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                        
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="text-sm">Goals Completed</span>
                      </div>
                      <span className="font-medium">3</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-sm">Active Goals</span>
                      </div>
                      <span className="font-medium">2</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="text-sm">Total Earned</span>
                      </div>
                      <span className="font-medium">$75</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm">Member Since</span>
                      </div>
                      <span className="font-medium">{format(new Date(mockUser.joinedAt), 'MMM yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="md:col-span-3">
              <Tabs defaultValue="communities" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="communities">My Communities</TabsTrigger>
                  <TabsTrigger value="completed">Completed Goals</TabsTrigger>
                  <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
                </TabsList>
                
                <TabsContent value="communities" className="animate-fade-in">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Active Communities ({mockCommunities.length})</h2>
                    <Button asChild>
                      <Link to="/communities/create">Create New</Link>
                    </Button>
                  </div>
                  
                  {mockCommunities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {mockCommunities.map((community) => (
                        <motion.div
                          key={community.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CommunityCard community={community} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Target className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Active Communities</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        You are not currently participating in any communities.
                      </p>
                      <Button asChild>
                        <Link to="/communities">Browse Communities</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="animate-fade-in">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Completed Goals ({mockCompletedCommunities.length})</h2>
                    <p className="text-muted-foreground">Goals you have successfully achieved</p>
                  </div>
                  
                  {mockCompletedCommunities.length > 0 ? (
                    <div className="space-y-6">
                      {mockCompletedCommunities.map((community) => (
                        <Card key={community.id}>
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row p-4 md:items-center gap-4">
                              <div className="md:w-16 md:h-16 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="md:h-8 md:w-8 h-6 w-6 text-primary" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                  <div>
                                    <h3 className="text-lg font-semibold">{community.name}</h3>
                                    <p className="text-sm text-muted-foreground">{community.goal}</p>
                                  </div>
                                  <Badge variant="outline" className="md:ml-auto w-fit">
                                    Completed on {format(new Date(community.deadline), 'MMM d, yyyy')}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Duration</p>
                                    <p className="font-medium">
                                      {Math.ceil((new Date(community.deadline).getTime() - new Date(community.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Staking Amount</p>
                                    <p className="font-medium">${community.stakingAmount}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Earnings</p>
                                    <p className="font-medium">$25</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Members</p>
                                    <p className="font-medium">{community.membersCount}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Trophy className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Completed Goals Yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        You haven't completed any goals yet. Join a community and complete your goals to see them here.
                      </p>
                      <Button asChild>
                        <Link to="/communities">Browse Communities</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="stats" className="animate-fade-in">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Detailed Statistics</h2>
                    <p className="text-muted-foreground">Your performance and achievements</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Goal Completion Rate</CardTitle>
                        <CardDescription>How often you complete your goals</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center py-8">
                          <div className="relative inline-flex items-center justify-center">
                            <svg className="w-32 h-32">
                              <circle
                                className="text-muted stroke-current"
                                strokeWidth="8"
                                stroke="currentColor"
                                fill="transparent"
                                r="56"
                                cx="64"
                                cy="64"
                              />
                              <circle
                                className="text-primary stroke-current"
                                strokeWidth="8"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="56"
                                cx="64"
                                cy="64"
                                strokeDasharray="352"
                                strokeDashoffset="88"
                              />
                            </svg>
                            <span className="absolute text-2xl font-bold">75%</span>
                          </div>
                        </div>
                        <div className="text-sm text-center text-muted-foreground">
                          You've completed 3 out of 4 goals
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Financial Summary</CardTitle>
                        <CardDescription>Your stakes and earnings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Staked</span>
                          <span className="font-medium">$170</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Earned</span>
                          <span className="font-medium">$75</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Current Active Stakes</span>
                          <span className="font-medium">$55</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Net Profit</span>
                          <span className="font-medium text-green-500">+$30</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Timeline</CardTitle>
                      <CardDescription>Your goal achievements over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-border">
                        <div className="relative">
                          <div className="absolute -left-8 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">Joined "Read 5 Books" Community</h4>
                              <Badge variant="outline" className="ml-auto">
                                {format(new Date(Date.now() - 125 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              You joined a community to read 5 books in 3 months
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute -left-8 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">Completed "Read 5 Books" Goal</h4>
                              <Badge variant="outline" className="ml-auto">
                                {format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              You successfully completed reading 5 books and earned a bonus
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute -left-8 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">Joined "Daily Meditation Group"</h4>
                              <Badge variant="outline" className="ml-auto">
                                {format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              You joined a community to meditate for 10 minutes daily for 30 days
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute -left-8 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">Joined "50K Steps Challenge"</h4>
                              <Badge variant="outline" className="ml-auto">
                                {format(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              You joined a community to walk 50,000 steps by the end of the week
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
      
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditProfile} className="space-y-4 py-4">
            <div className="flex flex-col items-center mb-4">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={editedProfile.name} 
                onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={editedProfile.email} 
                onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
