
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUserWallet, createWalletTransaction, getUserTransactions } from '@/services/rpc';
import { format } from 'date-fns';
import { AlertCircle, ArrowDown, ArrowUp, ChevronDown, ChevronUp, Clock, CreditCard, DollarSign, PlusCircle, RefreshCw, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Transaction = {
  id: string;
  amount: number;
  transaction_type: 'deposit' | 'withdrawal' | 'stake' | 'refund' | 'reward';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description?: string;
  community_id?: string;
};

const UserWallet = () => {
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [transactionsExpanded, setTransactionsExpanded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch wallet data
  const { 
    data: wallet,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet
  } = useQuery({
    queryKey: ['userWallet'],
    queryFn: getUserWallet
  });

  // Fetch transactions
  const { 
    data: transactions = [],
    isLoading: transactionsLoading
  } = useQuery({
    queryKey: ['userTransactions'],
    queryFn: getUserTransactions
  });

  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: createWalletTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userWallet'] });
      queryClient.invalidateQueries({ queryKey: ['userTransactions'] });
      setShowDepositDialog(false);
      setDepositAmount('');
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

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount greater than 0',
        variant: 'destructive'
      });
      return;
    }

    createTransaction.mutate({
      amount: parseFloat(depositAmount),
      transactionType: 'deposit',
      description: 'Wallet deposit'
    });
  };

  const getTransactionIcon = (type: Transaction['transaction_type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'stake':
        return <CreditCard className="h-4 w-4 text-amber-500" />;
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'reward':
        return <DollarSign className="h-4 w-4 text-purple-500" />;
    }
  };

  const formatTransactionType = (type: Transaction['transaction_type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="mr-2 h-5 w-5" />
          Your Wallet
        </CardTitle>
        <CardDescription>Manage your balance and transactions</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {walletError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load wallet data. Please try again.
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetchWallet()} 
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : walletLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center p-4 bg-background border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
              <div className="text-3xl font-bold mb-1">
                ${wallet?.balance.toFixed(2) || '0.00'}
              </div>
              <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Funds
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Funds to Your Wallet</DialogTitle>
                    <DialogDescription>
                      Enter the amount you want to deposit to your wallet.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        step="any"
                        placeholder="Enter amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowDepositDialog(false);
                        setDepositAmount('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleDeposit}
                      disabled={!depositAmount || createTransaction.isPending}
                    >
                      {createTransaction.isPending ? 'Processing...' : 'Deposit'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Recent Transactions</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={() => setTransactionsExpanded(!transactionsExpanded)}
                >
                  {transactionsExpanded ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
              </div>
              
              {transactionsLoading ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-muted rounded"></div>
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center p-4 text-sm text-muted-foreground">
                  No transactions yet
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions
                    .slice(0, transactionsExpanded ? undefined : 3)
                    .map((transaction: Transaction) => (
                      <div 
                        key={transaction.id} 
                        className="flex justify-between items-center p-2 rounded border bg-background"
                      >
                        <div className="flex items-center">
                          <div className="mr-3 p-2 bg-muted rounded-full">
                            {getTransactionIcon(transaction.transaction_type)}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {formatTransactionType(transaction.transaction_type)}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {format(new Date(transaction.created_at), 'PPp')}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={
                            transaction.transaction_type === 'deposit' || 
                            transaction.transaction_type === 'refund' || 
                            transaction.transaction_type === 'reward'
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }>
                            {transaction.transaction_type === 'deposit' || 
                             transaction.transaction_type === 'refund' || 
                             transaction.transaction_type === 'reward'
                              ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </span>
                          <Badge 
                            variant={
                              transaction.status === 'completed' ? 'outline' : 
                              transaction.status === 'pending' ? 'secondary' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              
              {transactions.length > 3 && !transactionsExpanded && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setTransactionsExpanded(true)}
                >
                  View all transactions
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => {
          refetchWallet();
          queryClient.invalidateQueries({ queryKey: ['userTransactions'] });
          toast({
            title: 'Refreshed',
            description: 'Wallet data has been refreshed',
          });
        }}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserWallet;
