
import React from 'react';
import {
  Bell,
  Check,
  Trash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { useNotifications } from '@/contexts/NotificationsContext';
import { ScrollArea } from '@/components/ui/scroll-area';

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-domicile-orange text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-7 px-2"
            >
              Tout marquer comme lu
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div>
              {notifications.map(notification => (
                <div key={notification.id} className="px-2">
                  <div 
                    className={`relative p-3 mb-1 rounded-md ${notification.read ? 'bg-transparent' : 'bg-muted'}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Pas de notifications
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
