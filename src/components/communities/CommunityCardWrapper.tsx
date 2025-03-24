
import React from 'react';
import CommunityCard from './CommunityCard';
import { Community } from '@/types';

interface CommunityCardWrapperProps {
  community: Community;
  hideVisibility?: boolean;
}

const CommunityCardWrapper: React.FC<CommunityCardWrapperProps> = ({ 
  community,
  hideVisibility = false 
}) => {
  // Create a modified community object for display
  const displayCommunity = hideVisibility 
    ? { ...community, visibility: undefined } 
    : community;
    
  return <CommunityCard community={displayCommunity} />;
};

export default CommunityCardWrapper;
