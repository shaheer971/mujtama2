
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Sun, Globe, Lock, UserCog, CreditCard, Smartphone, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  emailNewCommunity: z.boolean().default(true),
  emailDeadlineReminder: z.boolean().default(true),
  emailProgressUpdates: z.boolean().default(true),
  emailGoalCompletion: z.boolean().default(true),
  emailMarketing: z.boolean().default(false),
});

const accountSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }).max(20, {
    message: "Username must not exceed 20 characters."
  }).regex(/^[a-zA-Z0-9_-]+$/, {
    message: "Username can only contain letters, numbers, underscores, and hyphens."
  }),
  language: z.string().min(1, {
    message: "Please select a language.",
  }),
  timezone: z.string().min(1, {
    message: "Please select a timezone.",
  }),
});

const securitySchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('notifications');

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      emailNewCommunity: true,
      emailDeadlineReminder: true,
      emailProgressUpdates: true,
      emailGoalCompletion: true,
      emailMarketing: false,
    },
  });

  const accountForm = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      username: "johndoe",
      language: "en",
      timezone: "America/New_York",
    },
  });

  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const appearanceForm = useForm<z.infer<typeof appearanceSchema>>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: "light",
    },
  });

  const onNotificationSubmit = (values: z.infer<typeof notificationSchema>) => {
    console.log(values);
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const onAccountSubmit = (values: z.infer<typeof accountSchema>) => {
    console.log(values);
    toast({
      title: "Account settings updated",
      description: "Your account information has been saved.",
    });
  };

  const onSecuritySubmit = (values: z.infer<typeof securitySchema>) => {
    console.log(values);
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    securityForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const onAppearanceSubmit = (values: z.infer<typeof appearanceSchema>) => {
    console.log(values);
    toast({
      title: "Appearance settings updated",
      description: `Theme set to ${values.theme}.`,
    });
  };

  // List of timezones (abbreviated for example)
  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];

  // List of languages
  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ar", label: "Arabic" },
  ];

  return (
    <div className="py-8">
      <Container maxWidth="6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <Card>
              <CardContent className="px-2 py-4">
                <nav className="space-y-1">
                  <Button
                    variant={activeTab === 'notifications' ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button
                    variant={activeTab === 'account' ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('account')}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Account
                  </Button>
                  <Button
                    variant={activeTab === 'security' ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('security')}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Security
                  </Button>
                  <Button
                    variant={activeTab === 'appearance' ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('appearance')}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Appearance
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-9">
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Manage how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...notificationForm}>
                      <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Notification Channels</h3>
                          <div className="grid gap-4">
                            <FormField
                              control={notificationForm.control}
                              name="emailNotifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Email Notifications</FormLabel>
                                    <FormDescription>
                                      Receive notifications via email
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={notificationForm.control}
                              name="pushNotifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Push Notifications</FormLabel>
                                    <FormDescription>
                                      Receive push notifications on your devices
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Email Notification Preferences</h3>
                          <div className="grid gap-4">
                            <FormField
                              control={notificationForm.control}
                              name="emailNewCommunity"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      New community invitations
                                    </FormLabel>
                                    <FormDescription>
                                      Get notified when you are invited to join a community
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={notificationForm.control}
                              name="emailDeadlineReminder"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      Deadline reminders
                                    </FormLabel>
                                    <FormDescription>
                                      Get notified when a goal deadline is approaching
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={notificationForm.control}
                              name="emailProgressUpdates"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      Progress updates
                                    </FormLabel>
                                    <FormDescription>
                                      Get weekly progress updates on your active goals
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={notificationForm.control}
                              name="emailGoalCompletion"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      Goal completions
                                    </FormLabel>
                                    <FormDescription>
                                      Get notified when you or community members complete a goal
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={notificationForm.control}
                              name="emailMarketing"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      Marketing emails
                                    </FormLabel>
                                    <FormDescription>
                                      Receive emails about new features and special offers
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Button type="submit" className="mt-4">
                          <Save className="mr-2 h-4 w-4" />
                          Save Notification Settings
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'account' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Update your account information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...accountForm}>
                      <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Profile Information</h3>
                          <div className="grid gap-4">
                            <FormField
                              control={accountForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={accountForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                  <FormDescription>
                                    We'll never share your email with anyone else.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={accountForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Preferences</h3>
                          <div className="grid gap-4">
                            <FormField
                              control={accountForm.control}
                              name="language"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Language</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a language" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {languages.map((language) => (
                                        <SelectItem key={language.value} value={language.value}>
                                          {language.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={accountForm.control}
                              name="timezone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Timezone</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a timezone" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {timezones.map((timezone) => (
                                        <SelectItem key={timezone} value={timezone}>
                                          {timezone}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Button type="submit" className="mt-4">
                          <Save className="mr-2 h-4 w-4" />
                          Save Account Settings
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...securityForm}>
                      <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Change Password</h3>
                          <div className="grid gap-4">
                            <FormField
                              control={securityForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={securityForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={securityForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Button type="submit" className="mt-4">
                          <Save className="mr-2 h-4 w-4" />
                          Update Password
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize the look and feel of the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...appearanceForm}>
                      <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Theme</h3>
                          <FormField
                            control={appearanceForm.control}
                            name="theme"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Tabs
                                    defaultValue={field.value}
                                    className="w-full"
                                    onValueChange={field.onChange}
                                  >
                                    <TabsList className="grid w-full grid-cols-3">
                                      <TabsTrigger value="light" className="flex items-center gap-2">
                                        <Sun className="h-4 w-4" />
                                        Light
                                      </TabsTrigger>
                                      <TabsTrigger value="dark" className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" />
                                        Dark
                                      </TabsTrigger>
                                      <TabsTrigger value="system" className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        System
                                      </TabsTrigger>
                                    </TabsList>
                                  </Tabs>
                                </FormControl>
                                <FormDescription>
                                  Select your preferred color theme.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button type="submit" className="mt-4">
                          <Save className="mr-2 h-4 w-4" />
                          Save Appearance Settings
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Settings;
