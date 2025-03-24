
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProgressLog {
  id: string;
  user_id: string;
  community_id: string;
  member_id: string;
  progress_value: number;
  notes: string | null;
  created_at: string;
}

interface ProgressHistoryProps {
  memberId: string;
}

const ProgressHistory = ({ memberId }: ProgressHistoryProps) => {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['progressLogs', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ProgressLog[];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load progress history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress History</CardTitle>
      </CardHeader>
      <CardContent>
        {logs && logs.length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            {logs.map((log, index) => (
              <div key={log.id} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{format(new Date(log.created_at), 'PPP')}</span>
                    <Clock className="ml-4 mr-2 h-4 w-4" />
                    <span>{format(new Date(log.created_at), 'p')}</span>
                  </div>
                  <span className="text-sm font-medium">{log.progress_value}%</span>
                </div>
                
                <Progress value={log.progress_value} className="h-2 mb-2" />
                
                {log.notes && (
                  <div className="flex items-start mt-2 bg-muted p-3 rounded-md">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm">{log.notes}</p>
                  </div>
                )}
                
                {index < logs.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </ScrollArea>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No progress updates recorded yet
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressHistory;
