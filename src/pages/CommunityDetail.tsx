
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Users,
  Calendar,
  Target,
  Award,
  Clock,
  ChevronRight,
  ArrowRight,
  Edit,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  Ban,
  Check,
  Share2,
  Flag,
  UserPlus,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Container from '@/components/ui/Container';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Community, CommunityMember, Message, Petition, PetitionVote } from '@/types';

// Mock data - In a real app, this would come from an API
const MOCK_COMMUNITY: Community = {
  id: '1',
  name: 'Fitness Challenge 2024',
  description: 'A 90-day challenge to improve fitness and wellness habits.',
  goal: 'Exercise at least 4 times per week for 90 days',
  goalAmount: 90,
  deadline: new Date('2024-12-31'),
  startDate: new Date('2024-10-01'),
  createdAt: new Date('2024-09-15'),
  updatedAt: new Date('2024-09-15'),
  visibility: 'public',
  status: 'active',
  stakingAmount: 50,
  membersCount: 28,
  creator: {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    joinedAt: new Date('2023-01-15'),
  },
  members: [
    {
      id: '1',
      user: {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        joinedAt: new Date('2023-01-15'),
      },
      communityId: '1',
      joinedAt: new Date('2024-09-15'),
      hasStaked: true,
      progress: 0.8,
      status: 'active',
      hasAcceptedTerms: true,
    },
    // Additional members data
  ],
};

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    communityId: '1',
    userId: '1',
    user: {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      joinedAt: new Date('2023-01-15'),
    },
    content: 'Excited to start this challenge with everyone! Let\'s support each other.',
    createdAt: new Date('2024-09-16T10:23:00'),
  },
  // Additional messages data
];

const MOCK_PETITIONS: Petition[] = [
  {
    id: '1',
    communityId: '1',
    createdBy: {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      joinedAt: new Date('2023-02-20'),
    },
    createdAt: new Date('2024-09-20'),
    type: 'stakingAmount',
    currentValue: 50,
    proposedValue: 30,
    status: 'active',
    votes: [
      {
        id: '1',
        petitionId: '1',
        userId: '1',
        vote: 'approve',
        votedAt: new Date('2024-09-20'),
      },
      // Additional votes data
    ],
  },
  // Additional petitions data
];

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const community = MOCK_COMMUNITY; // In a real app, fetch based on id
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [petitions, setPetitions] = useState<Petition[]>(MOCK_PETITIONS);
  
  const daysRemaining = Math.ceil(
    (community.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      communityId: community.id,
      userId: '3', // Current user ID would come from auth context
      user: {
        id: '3',
        name: 'Current User',
        email: 'user@example.com',
        avatar: '',
        joinedAt: new Date('2023-05-10'),
      },
      content: newMessage,
      createdAt: new Date(),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    // In a real app, this would make an API call to save the message
  };
  
  const handleVotePetition = (petitionId: string, vote: 'approve' | 'reject') => {
    // In a real app, this would make an API call to record the vote
    setPetitions(
      petitions.map((petition) => {
        if (petition.id === petitionId) {
          const newVote: PetitionVote = {
            id: `vote-${Date.now()}`,
            petitionId,
            userId: '3', // Current user ID would come from auth context
            vote,
            votedAt: new Date(),
          };
          return {
            ...petition,
            votes: [...petition.votes, newVote],
          };
        }
        return petition;
      })
    );
  };
  
  const handleJoinCommunity = () => {
    // In a real app, this would make an API call to join the community
  };

  const formatPetitionValue = (type: string, value: any): string => {
    if (type === 'deadline' || type === 'startDate') {
      return format(new Date(value as Date), 'MMM d, yyyy');
    } else if (type === 'stakingAmount') {
      return `$${value}`;
    } else {
      return value.toString();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Container maxWidth="2xl">
          <div className="py-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Link to="/communities" className="hover:text-primary">Communities</Link>
                  <ChevronRight className="h-4 w-4" />
                  <span>{community.name}</span>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <h1 className="text-3xl font-bold">{community.name}</h1>
                  <Badge variant={community.status === 'active' ? 'default' : 'secondary'} className="md:ml-auto">
                    {community.status === 'active' ? 'Active' : community.status}
                  </Badge>
                </div>
                
                <p className="text-lg text-muted-foreground mb-6">{community.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Start Date</p>
                          <p className="text-lg">{format(community.startDate, 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Deadline</p>
                          <p className="text-lg">{format(community.deadline, 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Staking Amount</p>
                          <p className="text-lg">${community.stakingAmount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Members</p>
                          <p className="text-lg">{community.membersCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Button className="flex-1 gap-2" size="lg">
                    <UserPlus className="h-5 w-5" />
                    <span>Join Community</span>
                  </Button>
                  
                  <Button variant="outline" className="flex-1 gap-2" size="lg">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>
              
              <div className="w-full md:w-80 shrink-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Tracker</CardTitle>
                    <CardDescription>
                      {daysRemaining} days remaining
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current Progress</span>
                          <span className="font-medium">80%</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      
                      <div className="rounded-lg bg-muted p-3">
                        <h4 className="font-medium mb-1">Goal</h4>
                        <p className="text-sm text-muted-foreground">{community.goal}</p>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        Log Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Tabs defaultValue="discussion">
              <TabsList className="w-full border-b rounded-none justify-start h-auto p-0">
                <TabsTrigger 
                  value="discussion" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-base py-3"
                >
                  Discussion
                </TabsTrigger>
                <TabsTrigger 
                  value="members" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-base py-3"
                >
                  Members
                </TabsTrigger>
                <TabsTrigger 
                  value="petitions" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-base py-3"
                >
                  Petitions
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="discussion" className="m-0">
                  <div className="flex flex-col gap-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex gap-4 items-start">
                          <Avatar>
                            <AvatarFallback>CU</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              placeholder="Write a message to the community..."
                              className="mb-3"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <div className="flex justify-end">
                              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                <Send className="h-4 w-4 mr-2" />
                                Send
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {messages.map((message) => (
                      <Card key={message.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4 items-start">
                            <Avatar>
                              <AvatarImage src={message.user.avatar} alt={message.user.name} />
                              <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <div className="font-medium">{message.user.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {format(message.createdAt, 'MMM d, h:mm a')}
                                </div>
                              </div>
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="members" className="m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {community.members?.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={member.user.avatar} alt={member.user.name} />
                              <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-medium">{member.user.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Joined {format(member.joinedAt, 'MMM d, yyyy')}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">Progress:</span>
                                <Progress value={member.progress * 100} className="h-1.5 flex-1" />
                                <span className="text-xs">{Math.round(member.progress * 100)}%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="petitions" className="m-0">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create a Petition</CardTitle>
                        <CardDescription>
                          Suggest changes to the community rules or goals
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="gap-2">
                          <Edit className="h-4 w-4" />
                          Create New Petition
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <div className="space-y-4">
                      {petitions.map((petition) => (
                        <Card key={petition.id}>
                          <CardHeader>
                            <div className="flex justify-between">
                              <div>
                                <CardTitle className="text-lg">
                                  Petition to change {petition.type}
                                </CardTitle>
                                <CardDescription>
                                  Created by {petition.createdBy.name} on {format(petition.createdAt, 'MMM d, yyyy')}
                                </CardDescription>
                              </div>
                              <Badge variant="outline" className="ml-auto">
                                {petition.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex gap-6">
                                <div className="space-y-1">
                                  <h3 className="text-sm font-medium">Current Value</h3>
                                  <p>
                                    {formatPetitionValue(petition.type, petition.currentValue)}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <h3 className="text-sm font-medium">Proposed Value</h3>
                                  <p>
                                    {formatPetitionValue(petition.type, petition.proposedValue)}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-medium mb-2">Votes</h3>
                                <div className="flex gap-4">
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">
                                      {petition.votes.filter((v) => v.vote === 'approve').length}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <ThumbsDown className="h-4 w-4 text-red-500" />
                                    <span className="text-sm">
                                      {petition.votes.filter((v) => v.vote === 'reject').length}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="flex justify-end gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Vote Against
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Vote Against This Petition?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to vote against changing the {petition.type} from {formatPetitionValue(petition.type, petition.currentValue)} to {formatPetitionValue(petition.type, petition.proposedValue)}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleVotePetition(petition.id, 'reject')}>
                                    Vote Against
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm">
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Vote For
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Vote For This Petition?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to vote for changing the {petition.type} from {formatPetitionValue(petition.type, petition.currentValue)} to {formatPetitionValue(petition.type, petition.proposedValue)}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleVotePetition(petition.id, 'approve')}>
                                    Vote For
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default CommunityDetail;
