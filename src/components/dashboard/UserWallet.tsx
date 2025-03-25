
import React from 'react';
import { Link } from 'react-router-dom';
import WalletCard from './WalletCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ArrowRight, DollarSign, ClipboardList } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserWalletProps {
  showActions?: boolean;
}

const UserWallet = ({ showActions = true }: UserWalletProps) => {
  return (
    <div className="space-y-4">
      <WalletCard />
      
      {showActions && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Community Staking</CardTitle>
            <CardDescription>
              Use your wallet balance to participate in communities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg border border-dashed flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">How community staking works</p>
                <p className="text-sm text-muted-foreground">
                  When you join a community, you'll stake funds as a commitment. 
                  Complete your goals to get your stake back, plus potential rewards 
                  from those who didn't meet their goals.
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Find Communities
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-sm">
                          Browse communities that match your interests and goals
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  Browse communities that align with your goals and join using your wallet balance.
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/dashboard/communities">
                    Browse Communities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Create Community
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-sm">
                          Start your own community and set staking amounts
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create your own community, set goals, and establish staking requirements.
                </p>
                <Button className="w-full" size="sm" asChild>
                  <Link to="/dashboard/communities?create=true">
                    Create Community
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-0">
            Ensure you have sufficient funds in your wallet before joining or creating communities.
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default UserWallet;
