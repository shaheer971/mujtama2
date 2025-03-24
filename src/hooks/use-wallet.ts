
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserWallet, createWalletTransaction, getUserTransactions } from '@/services/rpc';
import { useToast } from './use-toast';

export type WalletTransaction = {
  id: string;
  amount: number;
  transaction_type: 'deposit' | 'withdrawal' | 'stake' | 'refund' | 'reward';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description?: string;
  community_id?: string;
};

export const useWallet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { 
    data: wallet,
    isLoading: isWalletLoading,
    error: walletError,
    refetch: refetchWallet
  } = useQuery({
    queryKey: ['userWallet'],
    queryFn: getUserWallet
  });

  const { 
    data: transactions = [],
    isLoading: isTransactionsLoading,
    error: transactionsError
  } = useQuery({
    queryKey: ['userTransactions'],
    queryFn: getUserTransactions
  });

  const transactionMutation = useMutation({
    mutationFn: createWalletTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userWallet'] });
      queryClient.invalidateQueries({ queryKey: ['userTransactions'] });
      toast({
        title: 'Success',
        description: 'Transaction completed successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Transaction failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const deposit = (amount: number, description?: string) => {
    return transactionMutation.mutate({
      amount,
      transactionType: 'deposit',
      description: description || 'Wallet deposit'
    });
  };

  const withdraw = (amount: number, description?: string) => {
    return transactionMutation.mutate({
      amount: -Math.abs(amount), // Ensure negative
      transactionType: 'withdrawal',
      description: description || 'Wallet withdrawal'
    });
  };

  const stakeAmount = (amount: number, communityId: string, description?: string) => {
    return transactionMutation.mutate({
      amount: -Math.abs(amount), // Ensure negative
      transactionType: 'stake',
      communityId,
      description: description || 'Community stake'
    });
  };

  const refundAmount = (amount: number, communityId: string, description?: string) => {
    return transactionMutation.mutate({
      amount,
      transactionType: 'refund',
      communityId,
      description: description || 'Stake refund'
    });
  };

  const addReward = (amount: number, communityId: string, description?: string) => {
    return transactionMutation.mutate({
      amount,
      transactionType: 'reward',
      communityId,
      description: description || 'Goal achievement reward'
    });
  };

  return {
    wallet,
    balance: wallet?.balance || 0,
    transactions,
    isWalletLoading,
    isTransactionsLoading,
    walletError,
    transactionsError,
    refetchWallet,
    deposit,
    withdraw,
    stakeAmount,
    refundAmount,
    addReward,
    isPending: transactionMutation.isPending
  };
};
