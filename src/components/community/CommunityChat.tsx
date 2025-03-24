
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { Message } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommunityMessages, sendMessage } from '@/services/api';

interface CommunityMessageProps {
  message: Message;
}

const MessageItem = ({ message }: CommunityMessageProps) => {
  return (
    <div className="flex gap-4 items-start py-4">
      <Avatar>
        <AvatarImage src={message.user.avatar} alt={message.user.name} />
        <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <div className="font-medium">{message.user.name}</div>
          <div className="text-sm text-muted-foreground">
            {format(message.createdAt, 'MMM d, h:mm a')}
          </div>
        </div>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
};

interface CommunityProps {
  communityId: string;
}

export const CommunityChat = ({ communityId }: CommunityProps) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const queryClient = useQueryClient();
  
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['communityMessages', communityId],
    queryFn: () => getCommunityMessages(communityId),
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!user) throw new Error('User not authenticated');
      return sendMessage(communityId, user.id, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityMessages', communityId] });
      setNewMessage('');
    },
  });
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Community Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-start">
            <Avatar>
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Write a message to the community..."
                className="mb-3"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center py-4 text-muted-foreground">Loading messages...</p>
          ) : messages.length > 0 ? (
            <div className="divide-y">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No messages yet. Start a conversation!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
