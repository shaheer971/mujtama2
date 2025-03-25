import { supabase } from "@/integrations/supabase/client";
import {
  Community,
  CommunityMember,
  DatabaseCommunity,
  DatabaseCommunityMember,
  DatabaseProfile,
  mapDatabaseCommunityMemberToCommunityMember,
  mapDatabaseCommunityToCommunity,
  mapDatabaseProfileToUser,
  User,
  Notification
} from "@/types";
import {
  getProgressLogs,
  createProgressLog,
  getCommunityMilestones,
  createMilestone,
  completeMilestone,
  createInvitation,
  getInvitationByToken,
  acceptInvitation,
  declineInvitation,
  getUserWallet,
  getUserTransactions
} from "./rpc";

// Re-export RPC functions
export {
  getProgressLogs,
  createProgressLog,
  getCommunityMilestones,
  createMilestone,
  completeMilestone,
  createInvitation,
  getInvitationByToken,
  acceptInvitation,
  declineInvitation,
  getUserWallet,
  getUserTransactions
};

// Authentication and User Functions
export const getCurrentUser = async (): Promise<User | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (!profile) {
    return null;
  }

  // Add user_metadata from the session to the returned User object
  return {
    ...mapDatabaseProfileToUser(profile as DatabaseProfile),
    user_metadata: session.user.user_metadata
  };
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  if (!profile) {
    return null;
  }

  return mapDatabaseProfileToUser(profile as DatabaseProfile);
};

export const updateUserProfile = async (
  userId: string,
  updates: { full_name?: string; avatar_url?: string; bio?: string }
): Promise<User | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return mapDatabaseProfileToUser(data as DatabaseProfile);
};

// Community Functions
export const getCommunity = async (id: string): Promise<Community> => {
  try {
    const { data, error } = await supabase
      .from("communities")
      .select(
        `
        *,
        creator:creator_id (
          id, 
          full_name, 
          email, 
          avatar_url, 
          created_at
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching community:", error);
      throw error;
    }

    return mapDatabaseCommunityToCommunity(data as DatabaseCommunity);
  } catch (error) {
    console.error("Error in getCommunity:", error);
    throw error;
  }
};

export const getCommunities = async (): Promise<Community[]> => {
  try {
    const { data, error } = await supabase
      .from("communities")
      .select(
        `
        *,
        creator:creator_id (
          id, 
          full_name, 
          email, 
          avatar_url, 
          created_at
        )
      `
      );

    if (error) {
      console.error("Error fetching communities:", error);
      throw error;
    }

    return data.map((dbCommunity) =>
      mapDatabaseCommunityToCommunity(dbCommunity as DatabaseCommunity)
    );
  } catch (error) {
    console.error("Error in getCommunities:", error);
    throw error;
  }
};

export const createCommunity = async (
  community: Omit<DatabaseCommunity, "id" | "created_at" | "updated_at">
): Promise<Community> => {
  try {
    // Transform data to match database schema
    const dbCommunity = {
      name: community.name,
      description: community.description,
      goal: community.goal,
      goal_amount: community.goal_amount,
      goal_rationale: community.goal_rationale,
      category: community.category,
      tags: community.tags,
      deadline: community.deadline,
      start_date: community.start_date,
      visibility: community.visibility,
      status: community.status || 'pending',
      creator_id: community.creator_id,
      staking_amount: community.staking_amount
    };

    const { data, error } = await supabase
      .from("communities")
      .insert(dbCommunity)
      .select("*")
      .single();

    if (error) {
      console.error("Error creating community:", error);
      throw error;
    }

    return mapDatabaseCommunityToCommunity(data as DatabaseCommunity);
  } catch (error) {
    console.error("Error in createCommunity:", error);
    throw error;
  }
};

export const updateCommunity = async (
  id: string,
  updates: Partial<DatabaseCommunity>
): Promise<Community | null> => {
  try {
    const { data, error } = await supabase
      .from("communities")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating community:", error);
      return null;
    }

    return mapDatabaseCommunityToCommunity(data as DatabaseCommunity);
  } catch (error) {
    console.error("Error in updateCommunity:", error);
    return null;
  }
};

export const deleteCommunity = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("communities").delete().eq("id", id);

    if (error) {
      console.error("Error deleting community:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteCommunity:", error);
    return false;
  }
};

export const getCommunityMember = async (
  communityId: string
): Promise<CommunityMember> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("community_members")
      .select(`*, user:user_id(*)`)
      .eq("community_id", communityId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching community member:", error);
      throw error;
    }

    return mapDatabaseCommunityMemberToCommunityMember(
      data as DatabaseCommunityMember
    );
  } catch (error) {
    console.error("Error in getCommunityMember:", error);
    throw error;
  }
};

export const getCommunityMembers = async (
  communityId: string
): Promise<CommunityMember[]> => {
  try {
    const { data, error } = await supabase
      .from("community_members")
      .select(`*, user:user_id(*)`)
      .eq("community_id", communityId);

    if (error) {
      console.error("Error fetching community members:", error);
      throw error;
    }

    return data.map((dbMember) =>
      mapDatabaseCommunityMemberToCommunityMember(dbMember as DatabaseCommunityMember)
    );
  } catch (error) {
    console.error("Error in getCommunityMembers:", error);
    throw error;
  }
};

export const addCommunityMember = async (
  communityId: string,
  userId: string
): Promise<CommunityMember | null> => {
  try {
    const { data, error } = await supabase
      .from("community_members")
      .insert({
        community_id: communityId,
        user_id: userId,
        joined_at: new Date().toISOString(),
        status: 'pending',
        has_accepted_terms: false,
        has_staked: false,
        progress: 0
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error adding community member:", error);
      return null;
    }

    return mapDatabaseCommunityMemberToCommunityMember(
      data as DatabaseCommunityMember
    );
  } catch (error) {
    console.error("Error in addCommunityMember:", error);
    return null;
  }
};

export const removeCommunityMember = async (
  communityId: string,
  userId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error removing community member:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in removeCommunityMember:", error);
    return false;
  }
};

// Progress tracking functions
export const updateMemberProgress = async (
  memberId: string,
  progress: number,
  notes?: string
): Promise<CommunityMember> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Update member progress in the database
    const { data, error } = await supabase
      .from('community_members')
      .update({
        progress: progress,
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId)
      .eq('user_id', user.id) // Ensure user can only update their own progress
      .select('*');

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to update progress');

    // Get the updated member data including user data
    const { data: fullMemberData, error: memberError } = await supabase
      .from('community_members')
      .select('*, user:user_id(*)')
      .eq('id', memberId)
      .single();

    if (memberError) throw memberError;
    
    return mapDatabaseCommunityMemberToCommunityMember(fullMemberData as DatabaseCommunityMember);
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

// Added functions to match use-queries.ts references
export const getCommunityById = getCommunity;

export const joinCommunity = async (communityId: string, userId: string) => {
  return addCommunityMember(communityId, userId);
};

export const getUserCommunityMemberships = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("community_members")
      .select(`*, community:community_id(*)`)
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user memberships:", error);
      throw error;
    }

    return data.map((membership) => ({
      ...mapDatabaseCommunityMemberToCommunityMember(membership as unknown as DatabaseCommunityMember),
      community: mapDatabaseCommunityToCommunity(membership.community as DatabaseCommunity)
    }));
  } catch (error) {
    console.error("Error in getUserCommunityMemberships:", error);
    throw error;
  }
};

export const getCommunityMessages = async (communityId: string) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(`*, user:user_id(*)`)
      .eq("community_id", communityId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching community messages:", error);
      throw error;
    }

    return data.map((message) => ({
      id: message.id,
      communityId: message.community_id,
      content: message.content,
      createdAt: new Date(message.created_at),
      user: mapDatabaseProfileToUser(message.user as DatabaseProfile),
      userId: message.user_id
    }));
  } catch (error) {
    console.error("Error in getCommunityMessages:", error);
    return [];
  }
};

export const sendMessage = async (communityId: string, userId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        community_id: communityId,
        user_id: userId,
        content,
        created_at: new Date().toISOString()
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
};

export const getUserNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }

    return data.map((notification) => ({
      id: notification.id,
      userId: notification.user_id,
      title: notification.title,
      content: notification.content,
      type: notification.type,
      isRead: notification.is_read,
      createdAt: new Date(notification.created_at),
      data: notification.data
    })) as Notification[];
  } catch (error) {
    console.error("Error in getUserNotifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    return false;
  }
};

export const getProfileById = async (userId: string) => {
  return getUserProfile(userId);
};

export const updateProfile = async (userId: string, updates: any) => {
  return updateUserProfile(userId, updates);
};
