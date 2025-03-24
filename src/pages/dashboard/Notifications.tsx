
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { getUserNotifications, markNotificationAsRead } from '@/services/api';
import { Notification } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Bell, BellOff, Eye, Mail, Target, Trophy, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const NotificationItem = ({ notification, onRead }: { notification: Notification; onRead: (id: string) => void }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'communityInvite':
        return <Mail className="h-5 w-5 text-blue-500" />;
      case 'goalReminder':
        return <Target className="h-5 w-5 text-yellow-500" />;
      case 'petitionVote':
        return <Users className="h-5 w-5 text-purple-500" />;
      case 'communityStart':
        return <Bell className="h-5 w-5 text-green-500" />;
      case 'communityComplete':
        return <Trophy className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className={`mb-3 ${!notification.isRead ? 'border-l-4 border-l-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium flex items-center gap-2">
                  {notification.title}
                  {!notification.isRead && (
                    <Badge variant="default" className="text-xs">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.content}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
              </span>
            </div>
            
            <div className="flex justify-end mt-2">
              {notification.data?.link && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={notification.data.link}>View</Link>
                </Button>
              )}
              
              {!notification.isRead && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2"
                  onClick={() => onRead(notification.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userNotifications = await getUserNotifications(user.id);
        setNotifications(userNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      if (unreadNotifications.length === 0) {
        toast.info("No unread notifications");
        return;
      }
      
      await Promise.all(unreadNotifications.map(n => markNotificationAsRead(n.id)));
      
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to update notifications");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto mt-8 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Notifications</h1>
        </div>
        
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-3">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto mt-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        
        {notifications.some(n => !n.isRead) && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMarkAllAsRead}
          >
            <BellOff className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>
      
      {notifications.length > 0 ? (
        <div>
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              onRead={handleMarkAsRead}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No notifications</h3>
            <p className="text-muted-foreground">
              You don't have any notifications at the moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notifications;
