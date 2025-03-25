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

const mockCommunities: Community[] = [
  // Mock data remains unchanged
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

  const filteredCommunities = mockCommunities.filter((community) => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (community.tags && community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesStatus = statusFilter === 'all' || community.status === statusFilter;
    
    const matchesCategory = categoryFilter === 'all' || community.category === categoryFilter;
    
    const matchesPriceRange = community.stakingAmount >= priceRange[0] && community.stakingAmount <= priceRange[1];
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriceRange;
  });

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

  const myCommunities = mockCommunities.filter((community, index) => index % 2 === 0);

  const handleCreateCommunity = (data: any) => {
    console.log('Creating community with data:', data);
    toast({
      title: "Community created!",
      description: "Your community has been created successfully.",
    });
    setIsCreateModalOpen(false);
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
                    <BookmarkIcon className="mr-2 h-4 w-4" />
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
