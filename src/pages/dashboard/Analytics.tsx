
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  Target,
  DollarSign,
  Download,
  Filter
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import Container from '@/components/ui/Container';

// Mock data for charts
const monthlyProgressData = [
  { name: 'Jan', progress: 30 },
  { name: 'Feb', progress: 45 },
  { name: 'Mar', progress: 65 },
  { name: 'Apr', progress: 40 },
  { name: 'May', progress: 55 },
  { name: 'Jun', progress: 75 },
  { name: 'Jul', progress: 85 },
  { name: 'Aug', progress: 70 },
  { name: 'Sep', progress: 90 },
  { name: 'Oct', progress: 80 },
  { name: 'Nov', progress: 95 },
  { name: 'Dec', progress: 60 },
];

const goalCompletionData = [
  { name: 'Completed', value: 8 },
  { name: 'In Progress', value: 3 },
  { name: 'Failed', value: 2 },
];

const COLORS = ['#10B981', '#3B82F6', '#EF4444'];

const communityActivityData = [
  { name: 'Daily Meditation', joined: 10, completed: 8, active: 8 },
  { name: '50K Steps', joined: 15, completed: 7, active: 12 },
  { name: 'Novel Writing', joined: 8, completed: 3, active: 5 },
  { name: 'Learn Spanish', joined: 6, completed: 2, active: 3 },
];

const weeklyEarningsData = [
  { name: 'Week 1', earnings: 25 },
  { name: 'Week 2', earnings: 40 },
  { name: 'Week 3', earnings: 20 },
  { name: 'Week 4', earnings: 35 },
  { name: 'Week 5', earnings: 55 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [goalFilter, setGoalFilter] = useState('all');
  
  // Calculate some summary metrics
  const totalGoals = goalCompletionData.reduce((acc, curr) => acc + curr.value, 0);
  const completedGoals = goalCompletionData[0].value;
  const completionRate = Math.round((completedGoals / totalGoals) * 100);
  
  const totalEarnings = weeklyEarningsData.reduce((acc, curr) => acc + curr.earnings, 0);
  const averageEarnings = totalEarnings / weeklyEarningsData.length;
  
  return (
    <div className="p-6">
      <Container maxWidth="2xl">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground mt-1">Track your progress and achievements</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
        </header>
        
        {/* Summary Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <div className="text-2xl font-bold">{completionRate}%</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  <Progress className="h-2 mt-3" value={completionRate} />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Goals</p>
                      <div className="text-2xl font-bold">{goalCompletionData[1].value}</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Target className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex items-center mt-3 text-xs">
                    <div className="flex items-center gap-1 text-green-500">
                      <TrendingUp className="h-3 w-3" />
                      <span>+15%</span>
                    </div>
                    <span className="ml-1.5 text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <div className="text-2xl font-bold">${totalEarnings}</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center mt-3 text-xs">
                    <div className="flex items-center gap-1 text-green-500">
                      <TrendingUp className="h-3 w-3" />
                      <span>+35%</span>
                    </div>
                    <span className="ml-1.5 text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Goal Duration</p>
                      <div className="text-2xl font-bold">18.3 days</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-500" />
                    </div>
                  </div>
                  <div className="flex items-center mt-3 text-xs">
                    <div className="flex items-center gap-1 text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-down"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
                      <span>-8%</span>
                    </div>
                    <span className="ml-1.5 text-muted-foreground">faster than last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
        
        {/* Main Charts */}
        <section className="mb-8">
          <Tabs defaultValue="progress">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="communities">Communities</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
            
            <TabsContent value="progress" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Progress</CardTitle>
                  <CardDescription>
                    Your goal progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyProgressData}>
                        <defs>
                          <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="progress" 
                          stroke="#3B82F6" 
                          fillOpacity={1} 
                          fill="url(#progressGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="goals" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Goal Status Distribution</CardTitle>
                      <CardDescription>
                        Breakdown of your goals by status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={goalCompletionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#3B82F6">
                              {goalCompletionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle>Goal Completion</CardTitle>
                      <CardDescription>
                        Percentage of completed vs. ongoing goals
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-center">
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={goalCompletionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {goalCompletionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {goalCompletionData.map((entry, index) => (
                          <div key={index} className="text-center">
                            <div className="text-xl font-bold">{entry.value}</div>
                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                              {entry.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="communities" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Community Activity</CardTitle>
                  <CardDescription>
                    Member activity across your communities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={communityActivityData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="joined" stackId="a" fill="#3B82F6" />
                        <Bar dataKey="active" stackId="a" fill="#10B981" />
                        <Bar dataKey="completed" stackId="a" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="earnings" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Over Time</CardTitle>
                  <CardDescription>
                    Money earned from completing goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyEarningsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, 'Earnings']}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="earnings" 
                          stroke="#10B981"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="border-t flex justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Earnings</div>
                    <div className="text-xl font-bold">${totalEarnings}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Average Weekly</div>
                    <div className="text-xl font-bold">${averageEarnings.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Best Week</div>
                    <div className="text-xl font-bold">$55</div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Goal Insights */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Goal Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Goals</CardTitle>
                <CardDescription>
                  Goals with the highest completion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Daily Meditation", progress: 95, community: "Meditation Group" },
                    { name: "Read 20 Pages", progress: 90, community: "Book Readers" },
                    { name: "10K Steps", progress: 85, community: "Fitness Challenge" }
                  ].map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{goal.name}</p>
                        <span className="text-sm font-bold">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">{goal.community}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Active Times</CardTitle>
                <CardDescription>
                  When you're most productive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { day: "Monday", percentage: 80 },
                    { day: "Tuesday", percentage: 65 },
                    { day: "Wednesday", percentage: 90 },
                    { day: "Thursday", percentage: 75 },
                    { day: "Friday", percentage: 45 },
                    { day: "Saturday", percentage: 30 },
                    { day: "Sunday", percentage: 20 },
                  ].map((day, index) => (
                    <div key={index} className="grid grid-cols-6 items-center gap-2">
                      <div className="col-span-1 text-sm">{day.day.slice(0, 3)}</div>
                      <div className="col-span-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${day.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="col-span-1 text-xs text-right">{day.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Room for Improvement</CardTitle>
                <CardDescription>
                  Goals that need more attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Early Morning Workout", progress: 35, timeLeft: "5 days" },
                    { name: "Learn Spanish", progress: 42, timeLeft: "12 days" },
                    { name: "Zero Social Media", progress: 50, timeLeft: "3 days" }
                  ].map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{goal.name}</p>
                        <div className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded">
                          At Risk
                        </div>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{goal.progress}% complete</span>
                        <span>{goal.timeLeft} remaining</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View All At-Risk Goals
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        
        {/* Community Stats */}
        <section>
          <h2 className="text-xl font-bold mb-4">Community Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Community Engagement</CardTitle>
                <CardDescription>
                  How active you are in different communities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { name: "Daily Meditation Group", messages: 34, interactions: 42, rank: 3 },
                    { name: "50K Steps Challenge", messages: 27, interactions: 31, rank: 5 },
                    { name: "Novel Writing Month", messages: 12, interactions: 18, rank: 8 },
                  ].map((community, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{community.name}</p>
                            <div className="flex text-xs text-muted-foreground">
                              <span>{community.messages} messages</span>
                              <span className="mx-1">•</span>
                              <span>{community.interactions} interactions</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-secondary text-sm px-2 py-1 rounded">
                          Rank #{community.rank}
                        </div>
                      </div>
                      <Progress value={75 - (community.rank * 8)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Peer Benchmarking</CardTitle>
                <CardDescription>
                  How you compare to others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="pt-6 pb-2">
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary">
                          Goal Completion Rate
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary">
                          75%
                        </span>
                      </div>
                    </div>
                    <div className="flex h-2 mb-6 overflow-hidden text-xs bg-muted rounded">
                      <div className="flex flex-col justify-center text-center text-white bg-primary h-2 w-3/4 rounded relative">
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
                          You
                        </div>
                      </div>
                    </div>
                    <div className="absolute h-4 flex items-center justify-center w-4 rounded-full bg-primary text-xs text-white -right-2 top-7 shadow">
                      <span className="text-[10px]">Avg</span>
                    </div>
                  </div>
                  
                  <div className="relative pt-1 mt-12">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary">
                          Community Participation
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary">
                          60%
                        </span>
                      </div>
                    </div>
                    <div className="flex h-2 mb-6 overflow-hidden text-xs bg-muted rounded">
                      <div className="flex flex-col justify-center text-center text-white bg-primary h-2 w-3/5 rounded relative">
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
                          You
                        </div>
                      </div>
                    </div>
                    <div className="absolute h-4 flex items-center justify-center w-4 rounded-full bg-primary text-xs text-white -right-5 top-7 shadow">
                      <span className="text-[10px]">Avg</span>
                    </div>
                  </div>
                  
                  <div className="relative pt-1 mt-12">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary">
                          Goal Setting Frequency
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold inline-block text-primary">
                          85%
                        </span>
                      </div>
                    </div>
                    <div className="flex h-2 mb-6 overflow-hidden text-xs bg-muted rounded">
                      <div className="flex flex-col justify-center text-center text-white bg-primary h-2 w-4/5 rounded relative">
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
                          You
                        </div>
                      </div>
                    </div>
                    <div className="absolute h-4 flex items-center justify-center w-4 rounded-full bg-primary text-xs text-white -right-8 top-7 shadow">
                      <span className="text-[10px]">Avg</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="link" size="sm" className="w-full">
                  View Detailed Comparison
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Analytics;
