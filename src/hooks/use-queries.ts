
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import {
  getCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  getCommunityMembers,
  joinCommunity,
  updateMemberProgress,
  getUserCommunityMemberships,
  getCommunityMessages,
  sendMessage,
  getUserNotifications,
  markNotificationAsRead,
  getProfileById,
  updateProfile,
} from '@/services/api';
import { useToast } from './use-toast';

// Communities
export const useCommunities = () => {
  return useQuery({
    queryKey: ['communities'],
    queryFn: getCommunities,
  });
};

export const useCommunity = (id: string) => {
  return useQuery({
    queryKey: ['community', id],
    queryFn: () => getCommunityById(id),
    enabled: !!id,
  });
};

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast({
        title: 'Success',
        description: 'Community created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create community: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCommunity = (id: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: Parameters<typeof updateCommunity>[1]) => 
      updateCommunity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', id] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast({
        title: 'Success',
        description: 'Community updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update community: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

// Community Members
export const useCommunityMembers = (communityId: string) => {
  return useQuery({
    queryKey: ['communityMembers', communityId],
    queryFn: () => getCommunityMembers(communityId),
    enabled: !!communityId,
  });
};

export const useJoinCommunity = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (communityId: string) => {
      if (!user) throw new Error('User not authenticated');
      return joinCommunity(communityId, user.id);
    },
    onSuccess: (_, communityId) => {
      queryClient.invalidateQueries({ queryKey: ['communityMembers', communityId] });
      queryClient.invalidateQueries({ queryKey: ['userMemberships'] });
      toast({
        title: 'Success',
        description: 'You have joined the community.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to join community: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateMemberProgress = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ memberId, progress }: { memberId: string; progress: number }) => 
      updateMemberProgress(memberId, progress),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['communityMembers', data.communityId] });
        queryClient.invalidateQueries({ queryKey: ['userMemberships'] });
        toast({
          title: 'Success',
          description: 'Progress updated successfully.',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update progress: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

export const useUserMemberships = (userId?: string) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.id;
  
  return useQuery({
    queryKey: ['userMemberships', effectiveUserId],
    queryFn: () => {
      if (!effectiveUserId) throw new Error('User ID is required');
      return getUserCommunityMemberships(effectiveUserId);
    },
    enabled: !!effectiveUserId,
  });
};

// Messages
export const useCommunityMessages = (communityId: string) => {
  return useQuery({
    queryKey: ['communityMessages', communityId],
    queryFn: () => getCommunityMessages(communityId),
    enabled: !!communityId,
  });
};

export const useSendMessage = (communityId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (content: string) => {
      if (!user) throw new Error('User not authenticated');
      return sendMessage(communityId, user.id, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityMessages', communityId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to send message: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};

// Notifications
export const useUserNotifications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userNotifications', user?.id],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getUserNotifications(user.id);
    },
    enabled: !!user,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['userNotifications', user.id] });
      }
    },
  });
};

// User Profile
export const useUserProfile = (userId?: string) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.id;
  
  return useQuery({
    queryKey: ['userProfile', effectiveUserId],
    queryFn: () => {
      if (!effectiveUserId) throw new Error('User ID is required');
      return getProfileById(effectiveUserId);
    },
    enabled: !!effectiveUserId,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (updates: Parameters<typeof updateProfile>[1]) => {
      if (!user) throw new Error('User not authenticated');
      return updateProfile(user.id, updates);
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] });
        toast({
          title: 'Success',
          description: 'Profile updated successfully.',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update profile: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};
