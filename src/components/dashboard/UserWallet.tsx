
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { getUserWallet, getUserTransactions } from '@/services/api';
import { CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, Clock, LockKeyhole, AlertTriangle, CircleDollarSign } from 'lucide-react';

const UserWallet = () => {
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['userWallet'],
    queryFn: getUserWallet,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['userTransactions'],
    queryFn: getUserTransactions,
  });

  const isLoading = walletLoading || transactionsLoading;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'stake':
        return <LockKeyhole className="h-4 w-4 text-blue-500" />;
      case 'refund':
        return <ArrowDownLeft className="h-4 w-4 text-purple-500" />;
      case 'reward':
        return <CircleDollarSign className="h-4 w-4 text-yellow-500" />;
      default:
        return <CircleDollarSign className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-500';
      case 'withdrawal':
        return 'text-red-500';
      case 'stake':
        return 'text-blue-500';
      case 'refund':
        return 'text-purple-500';
      case 'reward':
        return 'text-yellow-500';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
          <CardDescription>Loading your wallet details...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
          <CardDescription>Your wallet information</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Could not load wallet</AlertTitle>
            <AlertDescription>
              There was an error loading your wallet information. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription>Manage your funds and view transactions</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 px-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="p-6 pt-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Wallet className="h-4 w-4 mr-2" /> Available Balance
                      </span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(wallet.available_balance)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <LockKeyhole className="h-4 w-4 mr-2" /> Frozen Balance
                      </span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(wallet.frozen_balance)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <CircleDollarSign className="h-4 w-4 mr-2" /> Total Balance
                      </span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(wallet.balance)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto py-4 border-dashed">
                    <div className="flex flex-col items-center">
                      <ArrowDownLeft className="h-6 w-6 mb-2" />
                      <span>Deposit Funds</span>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-4 border-dashed">
                    <div className="flex flex-col items-center">
                      <ArrowUpRight className="h-6 w-6 mb-2" />
                      <span>Withdraw Funds</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <div className="p-6 pt-2">
              {transactions && transactions.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {transactions.map((transaction: any) => (
                      <div key={transaction.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted">
                        <div className="mt-0.5">
                          {getTransactionIcon(transaction.transaction_type)}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <p className="font-medium capitalize">{transaction.transaction_type}</p>
                            <p className={`font-medium ${getTransactionColor(transaction.transaction_type)}`}>
                              {transaction.transaction_type === 'withdrawal' ? '- ' : '+ '}
                              {formatCurrency(transaction.amount)}
                            </p>
                          </div>
                          
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(transaction.created_at), 'PPp')}
                            </div>
                            
                            <Badge variant="outline" className="capitalize">
                              {transaction.status}
                            </Badge>
                          </div>
                          
                          {transaction.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {transaction.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="py-12 text-center">
                  <div className="flex justify-center mb-4 text-muted-foreground">
                    <CreditCard className="h-12 w-12 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Your transaction history will appear here once you start using your wallet
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserWallet;
