import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Coins } from 'lucide-react';
import { Community } from '@/types';

interface CommunityCardProps {
  community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const daysRemaining = Math.ceil((new Date(community.deadline).getTime() - Date.now()) / (1000 * 3600 * 24));

  return (
    <Card className="hover-scale">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium">{community.name}</CardTitle>
        {community.visibility === 'private' && (
          <Badge variant="secondary">Private</Badge>
        )}
        {community.visibility === 'public' && (
          <Badge variant="outline">Public</Badge>
        )}
      </CardHeader>
      
      <CardContent>
        <CardDescription>{community.description}</CardDescription>
        <div className="flex items-center space-x-2 mt-4">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{community.membersCount} Members</span>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Coins className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Stake: ${community.stakingAmount}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Deadline passed'}</span>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link to={`/communities/${community.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommunityCard;
