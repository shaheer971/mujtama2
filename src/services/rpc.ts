
import { supabase } from "@/integrations/supabase/client";

// Create a properly typed wrapper for RPC calls
// We need to define a more permissive type for the RPC function
type RPCFunction = (name: string, params?: Record<string, any>) => Promise<{ data: any; error: any }>;

// Create a properly typed RPC function
const rpc: RPCFunction = async (name, params) => {
  // Cast the supabase.rpc function to any to bypass TypeScript's type checking
  const response = await (supabase.rpc as any)(name, params);
  return response;
};

// Progress logs RPC functions
export const getProgressLogs = async (memberId: string): Promise<any[]> => {
  try {
    const { data, error } = await rpc('get_progress_logs', { member_id: memberId });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching progress logs:', error);
    throw error;
  }
};

export const createProgressLog = async (params: {
  memberId: string;
  progressValue: number;
  notes?: string | null;
}): Promise<any> => {
  try {
    const { data, error } = await rpc('create_progress_log', {
      p_member_id: params.memberId,
      p_progress_value: params.progressValue,
      p_notes: params.notes || null
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating progress log:', error);
    throw error;
  }
};

// Milestone RPC functions
export const getCommunityMilestones = async (communityId: string): Promise<any[]> => {
  try {
    const { data, error } = await rpc('get_community_milestones', { community_id: communityId });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching community milestones:', error);
    throw error;
  }
};

export const createMilestone = async (params: {
  community_id: string;
  title: string;
  description?: string | null;
  target_date?: Date | null;
  weight?: number;
}): Promise<any> => {
  try {
    const { data, error } = await rpc('create_milestone', {
      p_community_id: params.community_id,
      p_title: params.title,
      p_description: params.description || null,
      p_target_date: params.target_date ? params.target_date.toISOString() : null,
      p_weight: params.weight || 1,
      p_created_by: (await supabase.auth.getUser()).data.user?.id
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
};

export const completeMilestone = async (milestoneId: string, notes?: string): Promise<any> => {
  try {
    const { data, error } = await rpc('complete_milestone', {
      p_milestone_id: milestoneId,
      p_notes: notes || null
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error completing milestone:', error);
    throw error;
  }
};

// Invitation RPC functions
export const createInvitation = async (communityId: string, email: string): Promise<any> => {
  try {
    const { data, error } = await rpc('create_invitation', {
      p_community_id: communityId,
      p_invitee_email: email
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
};

export const getInvitationByToken = async (token: string): Promise<any> => {
  try {
    const { data, error } = await rpc('get_invitation_by_token', {
      p_token: token
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching invitation:', error);
    throw error;
  }
};

export const acceptInvitation = async (token: string): Promise<any> => {
  try {
    const { data, error } = await rpc('accept_invitation', {
      p_token: token
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};

export const declineInvitation = async (token: string): Promise<any> => {
  try {
    const { data, error } = await rpc('decline_invitation', {
      p_token: token
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error declining invitation:', error);
    throw error;
  }
};

// Wallet RPC functions
export const getUserWallet = async (): Promise<any> => {
  try {
    const { data, error } = await rpc('get_user_wallet');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user wallet:', error);
    throw error;
  }
};

export const createWalletTransaction = async (params: {
  amount: number;
  transactionType: 'deposit' | 'withdrawal' | 'stake' | 'refund' | 'reward';
  description?: string;
  communityId?: string;
}): Promise<any> => {
  try {
    // Ensure amount is positive for deposits and negative for withdrawals and stakes
    let amount = params.amount;
    if (params.transactionType === 'withdrawal' || params.transactionType === 'stake') {
      amount = -Math.abs(amount); // Ensure negative
    } else if (params.transactionType === 'deposit' || params.transactionType === 'refund' || params.transactionType === 'reward') {
      amount = Math.abs(amount); // Ensure positive
    }

    const { data, error } = await rpc('create_wallet_transaction', {
      p_amount: amount,
      p_transaction_type: params.transactionType,
      p_description: params.description || null,
      p_community_id: params.communityId || null
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating wallet transaction:', error);
    throw error;
  }
};

export const getUserTransactions = async (): Promise<any[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', session.session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
};
