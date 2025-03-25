
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useWallet } from './use-wallet';
import { createCommunity } from '@/services/api';
import { useToast } from './use-toast';
import { CommunityVisibility, DatabaseCommunity } from '@/types';

interface CommunityFormData {
  name: string;
  description: string;
  goal: string;
  goalRationale?: string;
  goalAmount?: number;
  category?: string;
  tags?: string[];
  stakingAmount: number;
  visibility: CommunityVisibility;
  startDate: Date;
  deadline: Date;
}

export const useCommunityCreation = () => {
  const { user } = useAuth();
  const { balance } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFormData = (formData: CommunityFormData): boolean => {
    if (!formData.name) {
      setError('Community name is required');
      return false;
    }
    
    if (!formData.goal) {
      setError('Goal is required');
      return false;
    }
    
    if (!formData.stakingAmount || formData.stakingAmount <= 0) {
      setError('Staking amount must be greater than 0');
      return false;
    }
    
    if (!formData.startDate) {
      setError('Start date is required');
      return false;
    }
    
    if (!formData.deadline) {
      setError('Deadline is required');
      return false;
    }
    
    const minStartDate = new Date();
    minStartDate.setHours(minStartDate.getHours() + 24);
    
    if (formData.startDate < minStartDate) {
      setError('Start date must be at least 24 hours from now');
      return false;
    }
    
    if (formData.deadline <= formData.startDate) {
      setError('Deadline must be after the start date');
      return false;
    }
    
    return true;
  };

  const createNewCommunity = async (formData: CommunityFormData) => {
    setIsCreating(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('You must be logged in to create a community');
      }
      
      if (!validateFormData(formData)) {
        setIsCreating(false);
        return;
      }
      
      // Prepare community data for API
      const communityData: Omit<DatabaseCommunity, "id" | "created_at" | "updated_at"> = {
        name: formData.name,
        description: formData.description,
        goal: formData.goal,
        goal_rationale: formData.goalRationale,
        goal_amount: formData.goalAmount,
        category: formData.category,
        tags: formData.tags,
        deadline: formData.deadline.toISOString(),
        start_date: formData.startDate.toISOString(),
        visibility: formData.visibility,
        status: 'pending',
        creator_id: user.id,
        staking_amount: formData.stakingAmount
      };
      
      // Create the community
      const newCommunity = await createCommunity(communityData);
      
      toast({
        title: 'Community Created',
        description: 'Your community has been created successfully!',
      });
      
      // Navigate to the new community page
      navigate(`/dashboard/communities/${newCommunity.id}`);
      
      return newCommunity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create community';
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createNewCommunity,
    isCreating,
    error,
    canCreateCommunity: !!user,
    insufficientFunds: false // In a real app, you might check if the user has enough funds
  };
};
