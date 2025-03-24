
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getInvitationByToken, acceptInvitation, declineInvitation } from '@/services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Clock, Check, X, AlertTriangle } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';

// Define the invitation type to fix TypeScript errors
interface Invitation {
  id: string;
  community_id: string;
  inviter_id: string;
  invitee_email: string;
  status: string;
  token: string;
  created_at: string;
  expires_at: string;
  updated_at: string;
  community: {
    id: string;
    name: string;
    description: string;
    goal: string;
    staking_amount: number;
    deadline: string;
    creator_id: string;
    status: string;
  };
  inviter: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
  };
}

const InvitationHandler = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const { data: invitation, isLoading, isError } = useQuery({
    queryKey: ['invitation', token],
    queryFn: () => token ? getInvitationByToken(token) : Promise.reject('No token provided'),
    enabled: !!token,
  });
  
  const acceptMutation = useMutation({
    mutationFn: () => token ? acceptInvitation(token) : Promise.reject('No token provided'),
    onSuccess: (data) => {
      toast({
        title: 'Invitation accepted',
        description: 'You have successfully joined the community',
      });
      
      // Navigate to the community page
      if (data?.member && data?.member.communityId) {
        navigate(`/dashboard/communities/${data.member.communityId}`);
      } else {
        navigate('/dashboard/communities');
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: 'Failed to accept invitation',
        variant: 'destructive',
      });
      setError(error.message || 'Failed to accept invitation');
    }
  });
  
  const declineMutation = useMutation({
    mutationFn: () => token ? declineInvitation(token) : Promise.reject('No token provided'),
    onSuccess: () => {
      toast({
        title: 'Invitation declined',
        description: 'You have declined the invitation',
      });
      navigate('/dashboard/communities');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: 'Failed to decline invitation',
        variant: 'destructive',
      });
      setError(error.message || 'Failed to decline invitation');
    }
  });
  
  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isError || !invitation) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card className="border-2 border-dashed border-destructive/50">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-center">Invalid Invitation</CardTitle>
            <CardDescription className="text-center">
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-6">
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const invitationData = invitation as unknown as Invitation;
  
  // Check if invitation is expired
  const isExpired = isAfter(new Date(), new Date(invitationData.expires_at));
  
  // Check if invitation status is not pending
  const isNotPending = invitationData.status !== 'pending';
  
  // Check if the email matches the current user
  const isWrongUser = user && user.email !== invitationData.invitee_email;
  
  return (
    <div className="container max-w-lg mx-auto py-12">
      <Card className={isExpired || isNotPending ? "border-2 border-dashed border-destructive/50" : "border-2 border-dashed"}>
        <CardHeader>
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center">Community Invitation</CardTitle>
          <CardDescription className="text-center">
            You've been invited to join a community
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isExpired && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Invitation Expired</AlertTitle>
              <AlertDescription>This invitation has expired and is no longer valid.</AlertDescription>
            </Alert>
          )}
          
          {isNotPending && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Invitation Already Processed</AlertTitle>
              <AlertDescription>
                This invitation has already been {invitationData.status === 'accepted' ? 'accepted' : 'declined'}.
              </AlertDescription>
            </Alert>
          )}
          
          {isWrongUser && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Wrong Account</AlertTitle>
              <AlertDescription>
                This invitation was sent to {invitationData.invitee_email}, but you're signed in with a different account.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-muted p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{invitationData.community.name}</h3>
            <p className="text-muted-foreground mb-4">{invitationData.community.description}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Goal:</span>
                <span>{invitationData.community.goal}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Staking Amount:</span>
                <span>${invitationData.community.staking_amount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deadline:</span>
                <span>{format(new Date(invitationData.community.deadline), 'PP')}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Invited By:</span>
                <span>{invitationData.inviter.full_name}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expires:</span>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  {format(new Date(invitationData.expires_at), 'PP')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <Separator />
        
        <CardFooter className="flex justify-between py-4">
          <Button
            variant="outline"
            onClick={() => declineMutation.mutate()}
            disabled={isExpired || isNotPending || isWrongUser || declineMutation.isPending || acceptMutation.isPending}
          >
            <X className="mr-2 h-4 w-4" />
            Decline
          </Button>
          
          <Button
            onClick={() => acceptMutation.mutate()}
            disabled={isExpired || isNotPending || isWrongUser || acceptMutation.isPending || declineMutation.isPending}
          >
            <Check className="mr-2 h-4 w-4" />
            Accept Invitation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvitationHandler;
