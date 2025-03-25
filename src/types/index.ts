export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: Date;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
};

export type CommunityVisibility = 'public' | 'private';

export type CommunityStatus = 'pending' | 'active' | 'completed' | 'failed';

export type CommunityCategory = 
  | 'education'
  | 'fitness'
  | 'career'
  | 'finance'
  | 'personal'
  | 'social'
  | 'health'
  | 'other';

export type Community = {
  id: string;
  name: string;
  description: string;
  goal: string;
  goalAmount?: number;
  goalRationale?: string;
  category?: CommunityCategory;
  tags?: string[];
  deadline: Date;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
  visibility: CommunityVisibility;
  status: CommunityStatus;
  creator: User;
  stakingAmount: number;
  membersCount: number;
  members?: CommunityMember[];
};

export type CommunityMember = {
  id: string;
  user: User;
  communityId: string;
  joinedAt: Date;
  hasStaked: boolean;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'failed';
  proposedStakingAmount?: number;
  hasAcceptedTerms: boolean;
};

export type Petition = {
  id: string;
  communityId: string;
  createdBy: User;
  createdAt: Date;
  type: 'deadline' | 'stakingAmount' | 'goal';
  currentValue: string | number | Date;
  proposedValue: string | number | Date;
  votes: PetitionVote[];
  status: 'active' | 'approved' | 'rejected';
};

export type PetitionVote = {
  id: string;
  petitionId: string;
  userId: string;
  vote: 'approve' | 'reject';
  votedAt: Date;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'communityInvite' | 'goalReminder' | 'petitionVote' | 'communityStart' | 'communityComplete' | string;
  isRead: boolean;
  createdAt: Date;
  data?: any;
};

export type Message = {
  id: string;
  communityId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: Date;
};

export type PaymentMethod = {
  id: string;
  userId: string;
  paymentType: 'credit_card' | 'bank_account' | 'paypal';
  details: any;
  isDefault: boolean;
  createdAt: Date;
};

export type WalletTransaction = {
  id: string;
  userId: string;
  amount: number;
  transactionType: 'deposit' | 'withdrawal' | 'stake' | 'refund' | 'reward';
  status: 'pending' | 'completed' | 'failed';
  communityId?: string;
  createdAt: Date;
  processedAt?: Date;
  description?: string;
};

// Utility types for data transformation
export type DatabaseCommunity = {
  id: string;
  name: string;
  description: string;
  goal: string;
  goal_amount?: number;
  goal_rationale?: string;
  category?: string;
  tags?: string[];
  deadline: string;
  start_date: string;
  visibility: CommunityVisibility;
  status: CommunityStatus;
  creator_id: string;
  staking_amount: number;
  created_at: string;
  updated_at: string;
  creator?: DatabaseProfile;
};

export type DatabaseProfile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
};

export type DatabaseCommunityMember = {
  id: string;
  community_id: string;
  user_id: string;
  joined_at: string;
  has_staked: boolean;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'failed';
  proposed_staking_amount?: number;
  has_accepted_terms: boolean;
  user?: DatabaseProfile;
};

// Add mapping functions to convert between database and app types
export const mapDatabaseProfileToUser = (profile: DatabaseProfile): User => ({
  id: profile.id,
  name: profile.full_name,
  email: profile.email,
  avatar: profile.avatar_url,
  joinedAt: new Date(profile.created_at),
});

export const mapDatabaseCommunityToCommunity = (
  dbCommunity: DatabaseCommunity,
  membersCount = 0
): Community => ({
  id: dbCommunity.id,
  name: dbCommunity.name,
  description: dbCommunity.description,
  goal: dbCommunity.goal,
  goalAmount: dbCommunity.goal_amount,
  goalRationale: dbCommunity.goal_rationale,
  category: dbCommunity.category as CommunityCategory | undefined,
  tags: dbCommunity.tags,
  deadline: new Date(dbCommunity.deadline),
  startDate: new Date(dbCommunity.start_date),
  createdAt: new Date(dbCommunity.created_at),
  updatedAt: new Date(dbCommunity.updated_at),
  visibility: dbCommunity.visibility,
  status: dbCommunity.status,
  creator: dbCommunity.creator 
    ? mapDatabaseProfileToUser(dbCommunity.creator)
    : { id: dbCommunity.creator_id, name: '', email: '', joinedAt: new Date() },
  stakingAmount: dbCommunity.staking_amount,
  membersCount,
});

export const mapDatabaseCommunityMemberToCommunityMember = (
  dbMember: DatabaseCommunityMember
): CommunityMember => ({
  id: dbMember.id,
  communityId: dbMember.community_id,
  joinedAt: new Date(dbMember.joined_at),
  hasStaked: dbMember.has_staked,
  progress: dbMember.progress,
  status: dbMember.status,
  proposedStakingAmount: dbMember.proposed_staking_amount,
  hasAcceptedTerms: dbMember.has_accepted_terms,
  user: dbMember.user 
    ? mapDatabaseProfileToUser(dbMember.user)
    : { id: dbMember.user_id, name: '', email: '', joinedAt: new Date() },
});
