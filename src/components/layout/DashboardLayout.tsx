
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Target,
  BarChart2,
  Award,
  Settings,
  LogOut,
  User,
  Bell,
  Menu,
  Search,
  X,
  PlusCircle,
  ChevronDown,
  HelpCircle,
  CreditCard,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarInset,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import AuthGuard from '@/components/auth/AuthGuard';

const DashboardLayout = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, signOut } = useAuth();

  // Dashboard navigation items
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Communities', path: '/dashboard/communities' },
    { icon: Target, label: 'Goals', path: '/dashboard/goals' },
    { icon: BarChart2, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Award, label: 'Leaderboard', path: '/dashboard/leaderboard' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications', badge: 3 },
    { icon: CreditCard, label: 'Payment Methods', path: '/dashboard/payment-methods' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) {
      return user?.email?.substring(0, 2).toUpperCase() || 'U';
    }
    
    return user.user_metadata.full_name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          {/* Dashboard Sidebar */}
          <Sidebar>
            <SidebarHeader className="pb-0">
              <div className="flex items-center p-2">
                <Link to="/dashboard" className="flex items-center gap-2 px-2">
                  <div className="bg-blue-500/10 rounded-md p-1">
                    <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">م</span>
                  </div>
                  <span className="font-medium tracking-tight">Mujtama</span>
                </Link>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        isActive={isActive(item.path)}
                        tooltip={item.label}
                        asChild
                      >
                        <Link to={item.path} className="group">
                          <item.icon className="transition-transform duration-200 group-hover:scale-110" />
                          <span>{item.label}</span>
                          {item.badge && (
                            <Badge className="ml-auto" variant="secondary">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>My Communities</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/communities/1" className="group">
                        <div className="bg-blue-500/10 rounded-full w-4 h-4 flex items-center justify-center text-xs transition-transform duration-200 group-hover:scale-110"></div>
                        <span>Daily Meditation Group</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/communities/2" className="group">
                        <div className="bg-green-500/10 rounded-full w-4 h-4 flex items-center justify-center text-xs transition-transform duration-200 group-hover:scale-110"></div>
                        <span>50K Steps Challenge</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/dashboard/communities" className="group">
                        <PlusCircle className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        <span>Join New Community</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
              <div className="flex items-center p-4 border-t border-border">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 hover:bg-sidebar-accent rounded-md p-2 w-full cursor-pointer transition-colors">
                      <Avatar className="h-8 w-8 border border-blue-100 dark:border-blue-800">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user?.user_metadata?.full_name || user?.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/goals">
                        <Target className="mr-2 h-4 w-4" />
                        My Goals
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/payment-methods">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payment Methods
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleDarkMode}>
                      {isDarkMode ? (
                        <>
                          <Sun className="mr-2 h-4 w-4" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="mr-2 h-4 w-4" />
                          Dark Mode
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SidebarFooter>
          </Sidebar>
          
          {/* Mobile Header */}
          <div className="fixed top-0 left-0 right-0 h-14 border-b border-border bg-background z-30 md:hidden flex items-center px-4 shadow-sm">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="rounded-full">
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <Link to="/dashboard" className="ml-3 flex items-center gap-2">
                  <div className="bg-blue-500/10 rounded-md p-1">
                    <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">م</span>
                  </div>
                  <span className="font-semibold">Mujtama</span>
                </Link>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                  <Link to="/dashboard/notifications">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">3</span>
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8 border border-blue-100 dark:border-blue-800">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/payment-methods">Payment Methods</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleDarkMode}>
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleSignOut}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                className="fixed inset-0 bg-background z-20 pt-14 md:hidden shadow-xl"
              >
                <div className="p-4 space-y-6 overflow-y-auto h-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-10 border-0 shadow-sm" />
                  </div>
                  
                  <nav className="space-y-1.5">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                          isActive(item.path) 
                            ? 'bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-400' 
                            : 'text-muted-foreground hover:bg-muted'
                        } transition-colors`}
                        onClick={toggleMobileMenu}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge className="ml-auto" variant="secondary">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">My Communities</h3>
                    <div className="space-y-1.5">
                      <Link
                        to="/dashboard/communities/1"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                        onClick={toggleMobileMenu}
                      >
                        <div className="bg-blue-500/10 rounded-full w-4 h-4 flex items-center justify-center text-xs"></div>
                        <span>Daily Meditation Group</span>
                      </Link>
                      <Link
                        to="/dashboard/communities/2"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                        onClick={toggleMobileMenu}
                      >
                        <div className="bg-green-500/10 rounded-full w-4 h-4 flex items-center justify-center text-xs"></div>
                        <span>50K Steps Challenge</span>
                      </Link>
                      <Link
                        to="/dashboard/communities"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                        onClick={toggleMobileMenu}
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>Join New Community</span>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <Button variant="outline" className="w-full rounded-lg mb-3" onClick={toggleDarkMode}>
                      {isDarkMode ? (
                        <>
                          <Sun className="mr-2 h-4 w-4" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="mr-2 h-4 w-4" />
                          Dark Mode
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full rounded-lg" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main Content */}
          <SidebarInset>
            <div className="hidden md:flex items-center justify-between p-4 border-b border-border bg-white dark:bg-gray-900 shadow-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-10 border-0 bg-muted/50" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full">
                  <HelpCircle className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleDarkMode}>
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-full">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">3</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[300px]">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      Notifications
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-sm">Mark all as read</Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[300px] overflow-auto">
                      {[
                        {
                          title: "New petition",
                          description: "Mike created a petition to extend the deadline for 50K Steps Challenge",
                          time: "5 minutes ago",
                          unread: true
                        },
                        {
                          title: "Goal progress",
                          description: "You're 75% of the way to your meditation goal!",
                          time: "1 hour ago",
                          unread: true
                        },
                        {
                          title: "New community member",
                          description: "Sarah joined Daily Meditation Group",
                          time: "2 hours ago",
                          unread: true
                        },
                        {
                          title: "Payment confirmed",
                          description: "Your stake of $25 for Novel Writing Month has been confirmed",
                          time: "Yesterday",
                          unread: false
                        }
                      ].map((notification, i) => (
                        <div 
                          key={i} 
                          className={`p-3 hover:bg-muted transition-colors ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                            </div>
                            {notification.unread && (
                              <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button variant="ghost" size="sm" className="w-full text-center" asChild>
                        <Link to="/dashboard/notifications">View all notifications</Link>
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8 border border-blue-100 dark:border-blue-800">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/payment-methods">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payment Methods
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="pt-14 md:pt-0 w-full">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default DashboardLayout;
