
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, SlidersHorizontal, CalendarDays, DollarSign, Users, Tag, BookmarkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Container from '@/components/ui/Container';
import EnhancedCommunityCard from '@/components/communities/EnhancedCommunityCard';
import CommunityForm from '@/components/communities/CommunityForm';
import { Community, CommunityCategory } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/use-wallet';

// Categories with icons
const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'education', name: 'Education' },
  { id: 'fitness', name: 'Fitness' },
  { id: 'career', name: 'Career' },
  { id: 'finance', name: 'Finance' },
  { id: 'personal', name: 'Personal Development' },
  { id: 'social', name: 'Social Impact' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'other', name: 'Other' },
];

// Mock data
const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Daily Meditation Group',
    description: 'Meditate for at least 10 minutes every day for 30 days. Join us to develop a consistent meditation practice and improve your mental well-being.',
    goal: 'Meditate 10 minutes daily',
    goalRationale: 'Meditation has been shown to reduce stress and improve focus. This community will help members build a consistent habit.',
    category: 'health',
    tags: ['meditation', 'mindfulness', 'stress-reduction'],
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
    description: 'Walk at least 50,000 steps by the end of the week. Great way to get more active and enjoy the outdoors while meeting your fitness goals.',
    goal: 'Walk 50,000 steps',
    goalAmount: 50000,
    goalRationale: 'Walking is a simple yet effective form of exercise that improves cardiovascular health and boosts mood.',
    category: 'fitness',
    tags: ['walking', 'cardio', 'steps', 'challenge'],
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
  {
    id: '3',
    name: 'Novel Writing Month',
    description: 'Write 50,000 words in one month. Perfect for aspiring authors looking to jumpstart their writing and finally complete that novel.',
    goal: 'Write 50,000 words',
    goalAmount: 50000,
    goalRationale: 'Writing regularly builds discipline and creativity. Having a community to hold you accountable increases your chances of success.',
    category: 'personal',
    tags: ['writing', 'creativity', 'novel', 'fiction'],
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    visibility: 'public',
    status: 'pending',
    stakingAmount: 50,
    membersCount: 5,
    creator: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    }
  },
  {
    id: '4',
    name: 'Learn Spanish Basics',
    description: 'Learn basic Spanish conversational skills in 60 days. Daily practice required, with weekly virtual meet-ups to practice together.',
    goal: 'Complete Spanish basics course',
    goalRationale: 'Learning a new language opens doors to new cultures and opportunities. Group practice helps with pronunciation and motivation.',
    category: 'education',
    tags: ['spanish', 'language', 'learning'],
    deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    visibility: 'public',
    status: 'pending',
    stakingAmount: 40,
    membersCount: 3,
    creator: {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      joinedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
    }
  },
  {
    id: '5',
    name: 'Early Morning Workout',
    description: 'Commit to 30 consecutive days of morning workouts before 7 AM. Let\'s build that healthy habit together!',
    goal: '30 days of morning workouts',
    goalRationale: 'Morning workouts boost energy levels and productivity throughout the day while establishing a consistent routine.',
    category: 'fitness',
    tags: ['fitness', 'morning', 'routine', 'habit'],
    deadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    visibility: 'private',
    status: 'pending',
    stakingAmount: 35,
    membersCount: 2,
    creator: {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      joinedAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
    }
  },
  {
    id: '6',
    name: 'Zero Social Media',
    description: 'Take a 14-day break from all social media. Improve your focus and mental health by disconnecting temporarily.',
    goal: 'No social media for 14 days',
    goalRationale: 'Taking breaks from social media can improve mental health, increase productivity, and help us connect more deeply with the world around us.',
    category: 'health',
    tags: ['digital-detox', 'focus', 'mental-health'],
    deadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    visibility: 'public',
    status: 'pending',
    stakingAmount: 25,
    membersCount: 7,
    creator: {
      id: '5',
      name: 'David Lee',
      email: 'david@example.com',
      joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    }
  },
];

const Communities = () => {
  const { toast } = useToast();
  const { balance } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [viewType, setViewType] = useState('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');

  // Filter communities based on search query, status filter, category, etc.
  const filteredCommunities = mockCommunities.filter((community) => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (community.tags && community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesStatus = statusFilter === 'all' || community.status === statusFilter;
    
    const matchesCategory = categoryFilter === 'all' || community.category === categoryFilter;
    
    const matchesPriceRange = community.stakingAmount >= priceRange[0] && community.stakingAmount <= priceRange[1];
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriceRange;
  });

  // Sort communities based on sort option
  const sortedCommunities = [...filteredCommunities].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.membersCount - a.membersCount;
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'stake':
        return b.stakingAmount - a.stakingAmount;
      default:
        return 0;
    }
  });

  // Get my communities (mock for now, in real app would use API)
  const myCommunities = mockCommunities.filter((community, index) => index % 2 === 0);

  const handleCreateCommunity = (data: any) => {
    console.log('Creating community with data:', data);
    toast({
      title: "Community created!",
      description: "Your community has been created successfully.",
    });
    setIsCreateModalOpen(false);
    // In a real app, this would make an API call to create the community
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-8">
        <Container maxWidth="7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Communities</h1>
              <p className="text-muted-foreground">
                Browse and join communities or create your own
              </p>
            </div>
            
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Community
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="my">My Communities</TabsTrigger>
              <TabsTrigger value="joined">Joined</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-col space-y-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search communities by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <BookMarkIcon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="deadline">Deadline (Soon)</SelectItem>
                    <SelectItem value="stake">Highest Stake</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-1">
                  <Button
                    variant={viewType === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewType('grid')}
                    className="flex-1"
                  >
                    <div className="grid grid-cols-2 gap-0.5 h-4 w-4">
                      <div className="bg-current rounded-sm" />
                      <div className="bg-current rounded-sm" />
                      <div className="bg-current rounded-sm" />
                      <div className="bg-current rounded-sm" />
                    </div>
                  </Button>
                  <Button
                    variant={viewType === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewType('list')}
                    className="flex-1"
                  >
                    <div className="flex flex-col gap-0.5 h-4 w-4">
                      <div className="h-1 bg-current rounded-sm" />
                      <div className="h-1 bg-current rounded-sm" />
                      <div className="h-1 bg-current rounded-sm" />
                    </div>
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="group">
                    Category: {CATEGORIES.find(c => c.id === categoryFilter)?.name}
                    <button 
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                      onClick={() => setCategoryFilter('all')}
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="capitalize">
                    Status: {statusFilter}
                    <button 
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                      onClick={() => setStatusFilter('all')}
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                
                {searchQuery && (
                  <Badge variant="secondary">
                    Search: {searchQuery}
                    <button 
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                      onClick={() => setSearchQuery('')}
                    >
                      ✕
                    </button>
                  </Badge>
                )}
                
                {(categoryFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
                  <Button variant="outline" size="sm" onClick={() => {
                    setCategoryFilter('all');
                    setStatusFilter('all');
                    setSearchQuery('');
                  }}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
          
          <TabsContent value="discover" className="mt-0">
            {sortedCommunities.length > 0 ? (
              <div className={viewType === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "flex flex-col space-y-4"
              }>
                {sortedCommunities.map((community, index) => (
                  <motion.div
                    key={community.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <EnhancedCommunityCard community={community} hideVisibility={viewType === 'list'} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No communities found</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  No communities match your current filters. Try adjusting your search or create a new community.
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Community
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my" className="mt-0">
            {myCommunities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCommunities.map((community, index) => (
                  <motion.div
                    key={community.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <EnhancedCommunityCard community={community} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No communities created yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  You haven't created any communities yet. Create your first community to get started.
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Community
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="joined" className="mt-0">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">You haven't joined any communities yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Explore communities and join ones that align with your goals, or create your own.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => setActiveTab('discover')}>
                  Discover Communities
                </Button>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Community
                </Button>
              </div>
            </div>
          </TabsContent>
        </Container>
      </main>
      
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Create a New Community</DialogTitle>
          </DialogHeader>
          <CommunityForm 
            onSubmit={handleCreateCommunity} 
            onCancel={() => setIsCreateModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Communities;
