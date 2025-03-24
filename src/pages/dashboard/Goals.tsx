
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle, AlertTriangle, X, ArrowUpRight, Calendar, Target, TrendingUp, Filter, ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Container from '@/components/ui/Container';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define goal types
type GoalStatus = 'in-progress' | 'completed' | 'failed' | 'upcoming';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number | null;
  targetUnit: string | null;
  deadline: Date;
  status: GoalStatus;
  category: string;
  createdAt: Date;
  communityId?: string;
  communityName?: string;
  stakingAmount?: number;
}

const Goals = () => {
  // Mock data
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Meditate Daily',
      description: 'Meditate for at least 10 minutes every day',
      progress: 80,
      target: 30,
      targetUnit: 'days',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'in-progress',
      category: 'Wellness',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      communityId: '1',
      communityName: 'Daily Meditation Group',
      stakingAmount: 25
    },
    {
      id: '2',
      title: '50K Steps Challenge',
      description: 'Walk at least 50,000 steps by the end of the week',
      progress: 65,
      target: 50000,
      targetUnit: 'steps',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'in-progress',
      category: 'Fitness',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      communityId: '2',
      communityName: '50K Steps Challenge',
      stakingAmount: 35
    },
    {
      id: '3',
      title: 'Learn React Fundamentals',
      description: 'Complete React fundamentals course',
      progress: 100,
      target: 12,
      targetUnit: 'lessons',
      deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'completed',
      category: 'Education',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      stakingAmount: 50
    },
    {
      id: '4',
      title: 'Complete Novel Draft',
      description: 'Write 50,000 words for my novel draft',
      progress: 32,
      target: 50000,
      targetUnit: 'words',
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'failed',
      category: 'Creativity',
      createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
      communityId: '3',
      communityName: 'Novel Writing Month',
      stakingAmount: 40
    },
    {
      id: '5',
      title: 'Read 5 Books',
      description: 'Read 5 books from my reading list',
      progress: 0,
      target: 5,
      targetUnit: 'books',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      category: 'Education',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      stakingAmount: 20
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('deadline');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter goals based on active tab and search term
  const filteredGoals = goals.filter(goal => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'in-progress' && goal.status === 'in-progress') ||
      (activeTab === 'completed' && goal.status === 'completed') ||
      (activeTab === 'failed' && goal.status === 'failed') ||
      (activeTab === 'upcoming' && goal.status === 'upcoming');
      
    const matchesSearch = 
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (goal.communityName && goal.communityName.toLowerCase().includes(searchTerm.toLowerCase()));
      
    return matchesTab && matchesSearch;
  });
  
  // Sort goals based on sort selection
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (sortBy === 'progress') {
      return b.progress - a.progress;
    } else if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'staking') {
      return (b.stakingAmount || 0) - (a.stakingAmount || 0);
    }
    return 0;
  });
  
  // Helper function to determine status badge color
  const getStatusBadgeVariant = (status: GoalStatus) => {
    switch (status) {
      case 'in-progress':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'failed':
        return 'destructive';
      case 'upcoming':
        return 'outline';
      default:
        return 'outline';
    }
  };
  
  // Mock function to handle updating a goal
  const handleUpdateGoal = (goalId: string, progress: number) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              progress,
              status: progress >= 100 ? 'completed' : goal.status 
            } 
          : goal
      )
    );
  };
  
  // Mock function to handle creating a new goal
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create a new goal
    setIsDialogOpen(false);
  };
  
  return (
    <Container maxWidth="2xl">
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Goals</h1>
              <p className="text-muted-foreground">
                Set, track, and achieve your personal and community goals
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 sm:mt-0">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>
                    Define a new goal for yourself or join a community challenge.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateGoal}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">Goal Title</label>
                      <Input id="title" placeholder="e.g., Read 10 books this year" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <Input id="description" placeholder="Brief description of your goal" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="target" className="text-sm font-medium">Target Value</label>
                        <Input id="target" type="number" placeholder="e.g., 10" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="unit" className="text-sm font-medium">Unit</label>
                        <Input id="unit" placeholder="e.g., books, miles, etc." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="deadline" className="text-sm font-medium">Deadline</label>
                      <Input id="deadline" type="date" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium">Category</label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="fitness">Fitness</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="wellness">Wellness</SelectItem>
                            <SelectItem value="creativity">Creativity</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Accountability</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="How do you want to be accountable?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="personal">Personal Goal (No Stake)</SelectItem>
                            <SelectItem value="staking">Financial Stake</SelectItem>
                            <SelectItem value="community">Join Community Challenge</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Goal</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Input 
                  placeholder="Search goals..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sort by</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
                  <SelectItem value="progress">Progress (Highest)</SelectItem>
                  <SelectItem value="recent">Recently Created</SelectItem>
                  <SelectItem value="staking">Stake Amount (Highest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {sortedGoals.length === 0 ? (
            <Card className="text-center p-12">
              <CardContent className="pt-12 pb-12">
                <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Goals Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? 
                    "No goals match your search criteria. Try a different search term." :
                    "You don't have any goals in this category yet."}
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="mb-2" variant={getStatusBadgeVariant(goal.status)}>
                            {goal.status === 'in-progress' && 'In Progress'}
                            {goal.status === 'completed' && 'Completed'}
                            {goal.status === 'failed' && 'Failed'}
                            {goal.status === 'upcoming' && 'Upcoming'}
                          </Badge>
                          <CardTitle className="text-xl">{goal.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {goal.description}
                          </CardDescription>
                        </div>
                        {goal.communityId && (
                          <Badge variant="outline" className="ml-2 whitespace-nowrap">
                            {goal.communityName}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>
                              {goal.status === 'failed' ? 'Expired on ' : ''}
                              {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {goal.target && goal.targetUnit && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Target</p>
                            <div className="flex items-center text-sm">
                              <Target className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{goal.target} {goal.targetUnit}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {goal.stakingAmount && (
                        <div className="border rounded-md p-3 text-center bg-primary/5">
                          {goal.status === 'completed' ? (
                            <div className="flex items-center justify-center">
                              <Trophy className="h-4 w-4 mr-1 text-primary" />
                              <span className="text-sm font-medium">
                                You earned back ${goal.stakingAmount} + reward!
                              </span>
                            </div>
                          ) : goal.status === 'failed' ? (
                            <div className="flex items-center justify-center">
                              <AlertTriangle className="h-4 w-4 mr-1 text-destructive" />
                              <span className="text-sm font-medium">
                                Lost stake: ${goal.stakingAmount}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                              <span className="text-sm font-medium">
                                ${goal.stakingAmount} staked on success
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between">
                      {goal.status === 'in-progress' ? (
                        <Button variant="outline" className="w-full">
                          Update Progress
                        </Button>
                      ) : goal.status === 'upcoming' ? (
                        <Button className="w-full">
                          Start Goal
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" asChild>
                          <Link to={`/dashboard/goals/${goal.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Goal Insights</CardTitle>
                <CardDescription>
                  Track your progress and achievements over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-card rounded-lg shadow-sm">
                    <h3 className="text-3xl font-bold text-primary mb-1">
                      {goals.filter(g => g.status === 'completed').length}
                    </h3>
                    <p className="text-sm text-muted-foreground">Goals Completed</p>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg shadow-sm">
                    <h3 className="text-3xl font-bold text-primary mb-1">
                      {goals.filter(g => g.status === 'in-progress').length}
                    </h3>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg shadow-sm">
                    <h3 className="text-3xl font-bold text-primary mb-1">
                      ${goals.filter(g => g.status === 'completed').reduce((sum, g) => sum + (g.stakingAmount || 0), 0)}
                    </h3>
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg shadow-sm">
                    <h3 className="text-3xl font-bold text-primary mb-1">
                      {Math.round(goals.filter(g => g.status === 'completed').length / goals.length * 100)}%
                    </h3>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dashboard/analytics">
                    View Detailed Analytics
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </div>
    </Container>
  );
};

export default Goals;
