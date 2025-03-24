
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  MedalIcon,
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Container from '@/components/ui/Container';

// Interface for user data
interface User {
  id: string;
  name: string;
  avatar: string | null;
  initials: string;
  rank: number;
  completedGoals: number;
  successRate: number;
  earnings: number;
  achievements: number;
  joinedCommunities: number;
  streak: number;
  level: number;
  points: number;
  change?: 'up' | 'down' | 'same';
  changeAmount?: number;
  achievements_list?: Array<{name: string; icon: React.ReactNode}>;
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: "1",
    name: "Jane Smith",
    avatar: null,
    initials: "JS",
    rank: 1,
    completedGoals: 32,
    successRate: 92,
    earnings: 480,
    achievements: 8,
    joinedCommunities: 5,
    streak: 45,
    level: 8,
    points: 7850,
    change: 'up',
    changeAmount: 2,
    achievements_list: [
      { name: "Goal Crusher", icon: <Trophy className="h-4 w-4" /> },
      { name: "Perfect Streak", icon: <MedalIcon className="h-4 w-4" /> },
      { name: "Community Leader", icon: <Users className="h-4 w-4" /> },
    ]
  },
  {
    id: "2",
    name: "Alex Johnson",
    avatar: null,
    initials: "AJ",
    rank: 2,
    completedGoals: 29,
    successRate: 85,
    earnings: 420,
    achievements: 6,
    joinedCommunities: 7,
    streak: 30,
    level: 7,
    points: 7200,
    change: 'up',
    changeAmount: 1,
    achievements_list: [
      { name: "Goal Crusher", icon: <Trophy className="h-4 w-4" /> },
      { name: "Early Bird", icon: <Calendar className="h-4 w-4" /> },
    ]
  },
  {
    id: "3",
    name: "Mike Thompson",
    avatar: null,
    initials: "MT",
    rank: 3,
    completedGoals: 26,
    successRate: 88,
    earnings: 380,
    achievements: 7,
    joinedCommunities: 4,
    streak: 60,
    level: 7,
    points: 6800,
    change: 'down',
    changeAmount: 1,
    achievements_list: [
      { name: "Streak Master", icon: <TrendingUp className="h-4 w-4" /> },
      { name: "Goal Crusher", icon: <Trophy className="h-4 w-4" /> },
    ]
  },
  {
    id: "4",
    name: "Sarah Williams",
    avatar: null,
    initials: "SW",
    rank: 4,
    completedGoals: 24,
    successRate: 90,
    earnings: 360,
    achievements: 5,
    joinedCommunities: 3,
    streak: 25,
    level: 6,
    points: 6500,
    change: 'same',
    achievements_list: [
      { name: "Community Leader", icon: <Users className="h-4 w-4" /> },
    ]
  },
  {
    id: "5",
    name: "John Doe",
    avatar: null,
    initials: "JD",
    rank: 5,
    completedGoals: 22,
    successRate: 80,
    earnings: 340,
    achievements: 4,
    joinedCommunities: 6,
    streak: 15,
    level: 6,
    points: 6200,
    change: 'up',
    changeAmount: 3,
    achievements_list: [
      { name: "Goal Crusher", icon: <Trophy className="h-4 w-4" /> },
    ]
  },
  {
    id: "6",
    name: "Emily Davis",
    avatar: null,
    initials: "ED",
    rank: 6,
    completedGoals: 20,
    successRate: 82,
    earnings: 320,
    achievements: 5,
    joinedCommunities: 4,
    streak: 20,
    level: 5,
    points: 5900,
    change: 'down',
    changeAmount: 2,
    achievements_list: [
      { name: "Early Bird", icon: <Calendar className="h-4 w-4" /> },
    ]
  },
  {
    id: "7",
    name: "David Lee",
    avatar: null,
    initials: "DL",
    rank: 7,
    completedGoals: 18,
    successRate: 75,
    earnings: 290,
    achievements: 3,
    joinedCommunities: 5,
    streak: 10,
    level: 5,
    points: 5600,
    change: 'same',
    achievements_list: [
      { name: "Community Leader", icon: <Users className="h-4 w-4" /> },
    ]
  },
  {
    id: "8",
    name: "Lisa Brown",
    avatar: null,
    initials: "LB",
    rank: 8,
    completedGoals: 16,
    successRate: 70,
    earnings: 260,
    achievements: 3,
    joinedCommunities: 3,
    streak: 5,
    level: 4,
    points: 5200,
    change: 'up',
    changeAmount: 1,
    achievements_list: [
      { name: "Perfect Streak", icon: <MedalIcon className="h-4 w-4" /> },
    ]
  },
  {
    id: "9",
    name: "Robert Wilson",
    avatar: null,
    initials: "RW",
    rank: 9,
    completedGoals: 14,
    successRate: 65,
    earnings: 230,
    achievements: 2,
    joinedCommunities: 2,
    streak: 3,
    level: 4,
    points: 4800,
    change: 'down',
    changeAmount: 2,
    achievements_list: [
      { name: "Goal Crusher", icon: <Trophy className="h-4 w-4" /> },
    ]
  },
  {
    id: "10",
    name: "Maria Garcia",
    avatar: null,
    initials: "MG",
    rank: 10,
    completedGoals: 12,
    successRate: 60,
    earnings: 210,
    achievements: 1,
    joinedCommunities: 1,
    streak: 1,
    level: 3,
    points: 4500,
    change: 'up',
    changeAmount: 5,
    achievements_list: [
      { name: "New Achiever", icon: <Star className="h-4 w-4" /> },
    ]
  },
];

// Community leaderboard data
interface Community {
  id: string;
  name: string;
  icon: React.ReactNode;
  rank: number;
  completionRate: number;
  members: number;
  goalType: string;
  avgStake: number;
  change?: 'up' | 'down' | 'same';
  changeAmount?: number;
}

// Mock data for communities
const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Morning Exercise Champions",
    icon: <Trophy className="h-5 w-5" />,
    rank: 1,
    completionRate: 95,
    members: 124,
    goalType: "Exercise",
    avgStake: 35,
    change: 'same'
  },
  {
    id: "2",
    name: "Meditation Masters",
    icon: <MedalIcon className="h-5 w-5" />,
    rank: 2,
    completionRate: 92,
    members: 87,
    goalType: "Meditation",
    avgStake: 25,
    change: 'up',
    changeAmount: 1
  },
  {
    id: "3",
    name: "Novel Writing Challenge",
    icon: <TrendingUp className="h-5 w-5" />,
    rank: 3,
    completionRate: 88,
    members: 56,
    goalType: "Writing",
    avgStake: 50,
    change: 'up',
    changeAmount: 2
  },
  {
    id: "4",
    name: "Language Learners",
    icon: <Calendar className="h-5 w-5" />,
    rank: 4,
    completionRate: 85,
    members: 102,
    goalType: "Learning",
    avgStake: 40,
    change: 'down',
    changeAmount: 2
  },
  {
    id: "5",
    name: "Habit Builders",
    icon: <Target className="h-5 w-5" />,
    rank: 5,
    completionRate: 82,
    members: 71,
    goalType: "Habits",
    avgStake: 30,
    change: 'up',
    changeAmount: 3
  }
];

// User card for top users
const TopUserCard = ({ user, position }: { user: User, position: number }) => {
  return (
    <Card className={`hover:shadow-md transition-shadow ${position === 1 ? 'border-yellow-400' : position === 2 ? 'border-gray-400' : 'border-amber-700'}`}>
      <CardContent className="pt-6 pb-4 text-center">
        <div className="relative mx-auto w-24 h-24 mb-4">
          <Avatar className="w-24 h-24 border-2 border-primary/10">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback className="text-2xl">{user.initials}</AvatarFallback>
            )}
          </Avatar>
          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white ${position === 1 ? 'bg-yellow-500' : position === 2 ? 'bg-gray-500' : 'bg-amber-700'}`}>
            {position}
          </div>
        </div>
        
        <h3 className="font-bold text-lg mb-1">{user.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">Level {user.level}</p>
        
        <div className="flex justify-center gap-3 mb-4">
          <div className="text-center">
            <p className="text-xl font-bold">{user.completedGoals}</p>
            <p className="text-xs text-muted-foreground">Goals</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">${user.earnings}</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{user.achievements}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to Level {user.level + 1}</span>
            <span>{user.points} pts</span>
          </div>
          <Progress value={70} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

// The main Leaderboard component
const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('month');
  const [sortBy, setSortBy] = useState('rank');
  
  // Get top 3 users for the podium
  const topUsers = mockUsers.slice(0, 3);
  
  // Filter and sort users
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter and sort communities
  const filteredCommunities = mockCommunities.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-6">
      <Container maxWidth="2xl">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Leaderboard</h1>
              <p className="text-muted-foreground mt-1">See who's leading the way in achievements</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>
        
        {/* Top Users Podium */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">Top Achievers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={index === 0 ? "md:order-2" : index === 1 ? "md:order-1" : "md:order-3"}
              >
                <TopUserCard user={user} position={index + 1} />
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Leaderboard Tabs */}
        <section>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="communities">Communities</TabsTrigger>
              </TabsList>
              
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab === 'users' ? 'users' : 'communities'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <TabsContent value="users" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>User Rankings</CardTitle>
                  <CardDescription>
                    Users ranked by their achievements and contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="text-right">Completed Goals</TableHead>
                        <TableHead className="text-right">Success Rate</TableHead>
                        <TableHead className="text-right">Total Earned</TableHead>
                        <TableHead className="text-right">Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1">
                              <span className="font-bold">#{user.rank}</span>
                              {user.change && (
                                <span>
                                  {user.change === 'up' ? (
                                    <ChevronUp className="h-4 w-4 text-green-500" />
                                  ) : user.change === 'down' ? (
                                    <ChevronDown className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <span className="h-4 w-4 text-muted-foreground">-</span>
                                  )}
                                </span>
                              )}
                              {user.changeAmount && user.change !== 'same' && (
                                <span className={`text-xs ${user.change === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                  {user.changeAmount}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                {user.avatar ? (
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                ) : (
                                  <AvatarFallback>{user.initials}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <div className="flex gap-1 mt-1">
                                  {user.achievements_list?.slice(0, 2).map((achievement, i) => (
                                    <div key={i} className="text-primary/80">
                                      {achievement.icon}
                                    </div>
                                  ))}
                                  {user.achievements_list && user.achievements_list.length > 2 && (
                                    <span className="text-xs text-muted-foreground">+{user.achievements_list.length - 2} more</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{user.completedGoals}</TableCell>
                          <TableCell className="text-right">{user.successRate}%</TableCell>
                          <TableCell className="text-right">${user.earnings}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="font-bold">
                              Lvl {user.level}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4">
                  <Button variant="outline" size="sm">
                    View More
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="communities" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Community Rankings</CardTitle>
                  <CardDescription>
                    Communities ranked by completion rates and member participation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Community</TableHead>
                        <TableHead className="text-right">Completion Rate</TableHead>
                        <TableHead className="text-right">Members</TableHead>
                        <TableHead className="text-right">Goal Type</TableHead>
                        <TableHead className="text-right">Avg. Stake</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCommunities.map((community) => (
                        <TableRow key={community.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1">
                              <span className="font-bold">#{community.rank}</span>
                              {community.change && (
                                <span>
                                  {community.change === 'up' ? (
                                    <ChevronUp className="h-4 w-4 text-green-500" />
                                  ) : community.change === 'down' ? (
                                    <ChevronDown className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <span className="h-4 w-4 text-muted-foreground">-</span>
                                  )}
                                </span>
                              )}
                              {community.changeAmount && community.change !== 'same' && (
                                <span className={`text-xs ${community.change === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                  {community.changeAmount}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                {community.icon}
                              </div>
                              <div>
                                <p className="font-medium">{community.name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <span className="mr-2">{community.completionRate}%</span>
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${community.completionRate}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{community.members}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">
                              {community.goalType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">${community.avgStake}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4">
                  <Button variant="outline" size="sm">
                    View More
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Achievements Section */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Achievement Badges</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-1">Goal Crusher</h3>
                <p className="text-sm text-muted-foreground">Awarded for completing 10+ goals with 100% success rate</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MedalIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-1">Perfect Streak</h3>
                <p className="text-sm text-muted-foreground">Maintained a 30+ day streak on any goal</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-1">Community Leader</h3>
                <p className="text-sm text-muted-foreground">Created a community with 25+ active members</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold mb-1">Top Earner</h3>
                <p className="text-sm text-muted-foreground">Earned $250+ from completed goals</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Leaderboard;
