
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWallet, WalletTransaction } from '@/hooks/use-wallet';
import { format } from 'date-fns';
import { ArrowDownUp, ArrowDownCircle, ArrowUpCircle, RefreshCw, Clock, DollarSign } from 'lucide-react';

const depositSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  description: z.string().optional(),
});

const withdrawSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  description: z.string().optional(),
});

type DepositFormValues = z.infer<typeof depositSchema>;
type WithdrawFormValues = z.infer<typeof withdrawSchema>;

const WalletCard = () => {
  const { balance, transactions, deposit, withdraw, isPending, isWalletLoading, isTransactionsLoading } = useWallet();
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  const depositForm = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 0,
      description: '',
    },
  });

  const withdrawForm = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 0,
      description: '',
    },
  });

  const handleDeposit = (values: DepositFormValues) => {
    deposit(values.amount, values.description);
    setDepositDialogOpen(false);
    depositForm.reset();
  };

  const handleWithdraw = (values: WithdrawFormValues) => {
    withdraw(values.amount, values.description);
    setWithdrawDialogOpen(false);
    withdrawForm.reset();
  };

  const getTransactionIcon = (type: WalletTransaction['transaction_type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpCircle className="h-4 w-4 text-red-500" />;
      case 'stake':
        return <ArrowUpCircle className="h-4 w-4 text-amber-500" />;
      case 'refund':
        return <ArrowDownCircle className="h-4 w-4 text-blue-500" />;
      case 'reward':
        return <ArrowDownCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <ArrowDownUp className="h-4 w-4" />;
    }
  };

  const getTransactionText = (type: WalletTransaction['transaction_type']) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'stake':
        return 'Stake';
      case 'refund':
        return 'Refund';
      case 'reward':
        return 'Reward';
      default:
        return type;
    }
  };

  if (isWalletLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
          <CardDescription>Loading wallet data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
        <CardDescription>Manage your funds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <h3 className="text-2xl font-bold">${balance.toFixed(2)}</h3>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>

          <div className="flex space-x-2">
            <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1">Deposit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deposit Funds</DialogTitle>
                  <DialogDescription>
                    Add funds to your wallet.
                  </DialogDescription>
                </DialogHeader>
                <Form {...depositForm}>
                  <form onSubmit={depositForm.handleSubmit(handleDeposit)} className="space-y-4">
                    <FormField
                      control={depositForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the amount you want to deposit
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={depositForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Deposit description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isPending}>
                        {isPending ? 'Processing...' : 'Deposit'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Withdraw funds from your wallet.
                  </DialogDescription>
                </DialogHeader>
                <Form {...withdrawForm}>
                  <form onSubmit={withdrawForm.handleSubmit(handleWithdraw)} className="space-y-4">
                    <FormField
                      control={withdrawForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the amount you want to withdraw (max: ${balance.toFixed(2)})
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={withdrawForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Withdrawal description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" variant="outline" disabled={isPending}>
                        {isPending ? 'Processing...' : 'Withdraw'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="transactions">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions" className="py-4">
              {isTransactionsLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : transactions && transactions.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {transactions.map((transaction: WalletTransaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            {getTransactionIcon(transaction.transaction_type)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {getTransactionText(transaction.transaction_type)}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {format(new Date(transaction.created_at), 'PPP p')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund' || transaction.transaction_type === 'reward' ? 'text-green-500' : 'text-red-500'}`}>
                            {transaction.transaction_type === 'deposit' || transaction.transaction_type === 'refund' || transaction.transaction_type === 'reward'
                              ? `+$${transaction.amount}`
                              : `-$${transaction.amount}`}
                          </p>
                          {transaction.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {transaction.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No transactions yet</p>
                  <p className="text-sm mt-1">Deposit funds to get started</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
