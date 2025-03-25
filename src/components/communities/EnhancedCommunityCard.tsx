
import React from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { CalendarClock, Clock, DollarSign, Users, Tag, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Community } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define a mapping from categories to colors/classes
const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  education: { bg: 'bg-blue-100', text: 'text-blue-800' },
  fitness: { bg: 'bg-green-100', text: 'text-green-800' },
  career: { bg: 'bg-purple-100', text: 'text-purple-800' },
  finance: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  personal: { bg: 'bg-amber-100', text: 'text-amber-800' },
  social: { bg: 'bg-pink-100', text: 'text-pink-800' },
  health: { bg: 'bg-teal-100', text: 'text-teal-800' },
  other: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

// Helper to get category display name
const getCategoryName = (category?: string): string => {
  const categoryMap: Record<string, string> = {
    education: 'Education',
    fitness: 'Fitness',
    career: 'Career',
    finance: 'Finance',
    personal: 'Personal Development',
    social: 'Social Impact',
    health: 'Health & Wellness',
    other: 'Other',
  };
  
  return category ? categoryMap[category] || 'Other' : 'Other';
};

interface EnhancedCommunityCardProps {
  community: Community;
  hideVisibility?: boolean;
}

const EnhancedCommunityCard = ({ community, hideVisibility = false }: EnhancedCommunityCardProps) => {
  const isActive = community.status === 'active';
  const isPending = community.status === 'pending';
  const isCompleted = community.status === 'completed';
  const now = new Date();
  const hasStarted = community.startDate <= now;
  const hasEnded = community.deadline <= now;
  
  // Calculate time remaining or time past
  const timeText = !hasStarted
    ? `Starts ${formatDistanceToNow(community.startDate, { addSuffix: true })}`
    : !hasEnded
    ? `${formatDistanceToNow(community.deadline, { addSuffix: false })} left`
    : `Ended ${formatDistanceToNow(community.deadline, { addSuffix: true })}`;
  
  // Get category style
  const categoryStyle = community.category 
    ? CATEGORY_STYLES[community.category] 
    : CATEGORY_STYLES.other;
  
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            {community.category && (
              <Badge 
                variant="outline" 
                className={`mb-2 ${categoryStyle.bg} ${categoryStyle.text} border-0`}
              >
                {getCategoryName(community.category)}
              </Badge>
            )}
            <CardTitle className="text-xl line-clamp-1">{community.name}</CardTitle>
          </div>
          {!hideVisibility && (
            <Badge variant={community.visibility === 'public' ? 'secondary' : 'outline'}>
              {community.visibility === 'public' ? 'Public' : 'Private'}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {community.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Goal</h4>
          <p className="text-sm line-clamp-2">{community.goal}</p>
          {community.goalAmount && (
            <div className="text-sm text-muted-foreground mt-1">
              Target: {community.goalAmount.toLocaleString()}
            </div>
          )}
        </div>
        
        {community.tags && community.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {community.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {community.tags.length > 3 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs cursor-help">
                      +{community.tags.length - 3} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      {community.tags.slice(3).join(', ')}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{community.membersCount} members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>${community.stakingAmount} stake</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">
              {hasStarted
                ? `Deadline: ${format(community.deadline, 'PP')}`
                : `Starts: ${format(community.startDate, 'PP')}`}
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>{timeText}</span>
            </div>
            <span className="font-medium">
              {isPending ? 'Pending' : isCompleted ? 'Completed' : 'Active'}
            </span>
          </div>
          <Progress 
            value={hasEnded ? 100 : hasStarted ? 50 : 0}
            className={`h-1.5 ${
              isCompleted ? 'bg-green-100' : 
              isPending ? 'bg-amber-100' : 
              'bg-blue-100'
            }`}
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-6 w-6">
              <AvatarImage src={community.creator.avatar} alt={community.creator.name} />
              <AvatarFallback>{community.creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground ml-2 truncate max-w-[100px]">
              {community.creator.name}
            </span>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link to={`/dashboard/communities/${community.id}`}>
              View <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedCommunityCard;
