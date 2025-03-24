
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, SlidersHorizontal } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import Container from '@/components/ui/Container';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CommunityCard from '@/components/communities/CommunityCard';
import CommunityForm from '@/components/communities/CommunityForm';
import { Community } from '@/types';

// Mock data
const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Daily Meditation Group',
    description: 'Meditate for at least 10 minutes every day for 30 days. Join us to develop a consistent meditation practice and improve your mental well-being.',
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
    description: 'Walk at least 50,000 steps by the end of the week. Great way to get more active and enjoy the outdoors while meeting your fitness goals.',
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
  {
    id: '3',
    name: 'Novel Writing Month',
    description: 'Write 50,000 words in one month. Perfect for aspiring authors looking to jumpstart their writing and finally complete that novel.',
    goal: 'Write 50,000 words',
    goalAmount: 50000,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter communities based on search query and status filter
  const filteredCommunities = mockCommunities.filter((community) => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        community.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || community.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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

  const handleCreateCommunity = (data: any) => {
    console.log('Creating community with data:', data);
    setIsCreateModalOpen(false);
    // In a real app, this would make an API call to create the community
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <Container maxWidth="2xl">
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
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
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
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
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
              </div>
            </div>
          </motion.div>
          
          {sortedCommunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCommunities.map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CommunityCard community={community} />
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
        </Container>
      </main>
      
      <Footer />
      
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-xl">
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
