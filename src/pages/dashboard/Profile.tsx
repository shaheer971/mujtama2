
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Container from '@/components/ui/Container';
import { AlertCircle, Award, Bell, Calendar, Check, Edit2, Github, Instagram, Mail, MapPin, Phone, Twitter, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { toast } = useToast();
  
  // Mock user data
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Product designer and developer focused on creating meaningful experiences through thoughtful interfaces.',
    avatarUrl: '',
    socialLinks: {
      twitter: 'johndoe',
      instagram: 'johndoe.design',
      github: 'johndoe'
    },
    joinedDate: 'January 2023',
    communitiesCount: 4,
    goalsCompleted: 12,
    totalEarned: 250,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  
  // Mock achievements data
  const achievements = [
    { 
      id: 1, 
      name: 'Early Adopter', 
      description: 'Joined during the beta period', 
      date: 'Jan 2023', 
      icon: <Award className="h-8 w-8 text-primary" /> 
    },
    { 
      id: 2, 
      name: 'Goal Setter', 
      description: 'Completed 10+ goals', 
      date: 'Mar 2023', 
      icon: <Check className="h-8 w-8 text-green-500" /> 
    },
    { 
      id: 3, 
      name: 'Community Builder', 
      description: 'Created 3+ communities', 
      date: 'Apr 2023', 
      icon: <Users className="h-8 w-8 text-blue-500" /> 
    },
  ];
  
  // Mock activity data
  const activities = [
    { 
      id: 1, 
      type: 'goal_completed', 
      description: 'Completed "Daily Meditation" goal', 
      date: '2 days ago' 
    },
    { 
      id: 2, 
      type: 'joined_community', 
      description: 'Joined "Novel Writing Month" community', 
      date: '1 week ago' 
    },
    { 
      id: 3, 
      type: 'staked_amount', 
      description: 'Staked $35 on "10K Training Program"', 
      date: '2 weeks ago' 
    },
    { 
      id: 4, 
      type: 'earned_reward', 
      description: 'Earned $75 from "Morning Routine Challenge"', 
      date: '1 month ago' 
    },
  ];
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setUser({ ...editedUser });
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    }
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedUser({
        ...editedUser,
        [parent]: {
          ...editedUser[parent as keyof typeof editedUser] as any,
          [child]: value
        }
      });
    } else {
      setEditedUser({
        ...editedUser,
        [name]: value
      });
    }
  };
  
  return (
    <Container maxWidth="2xl">
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Profile</h1>
              <p className="text-muted-foreground">
                Manage your account settings and view your achievements
              </p>
            </div>
            <Button 
              onClick={handleEditToggle} 
              className="mt-4 md:mt-0"
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="text-3xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                {isEditing ? (
                  <Input 
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    className="text-center text-xl font-semibold mb-1"
                  />
                ) : (
                  <CardTitle className="text-xl font-semibold">{user.name}</CardTitle>
                )}
                {!isEditing && (
                  <CardDescription>Member since {user.joinedDate}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-semibold">{user.communitiesCount}</p>
                    <p className="text-xs text-muted-foreground">Communities</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{user.goalsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Goals</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">${user.totalEarned}</p>
                    <p className="text-xs text-muted-foreground">Earned</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    {isEditing ? (
                      <Input 
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                        className="text-sm"
                      />
                    ) : (
                      <span className="text-sm">{user.email}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    {isEditing ? (
                      <Input 
                        name="phone"
                        value={editedUser.phone}
                        onChange={handleInputChange}
                        className="text-sm"
                      />
                    ) : (
                      <span className="text-sm">{user.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    {isEditing ? (
                      <Input 
                        name="location"
                        value={editedUser.location}
                        onChange={handleInputChange}
                        className="text-sm"
                      />
                    ) : (
                      <span className="text-sm">{user.location}</span>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Social Profiles</h3>
                  <div className="flex items-center">
                    <Twitter className="h-4 w-4 text-muted-foreground mr-2" />
                    {isEditing ? (
                      <Input 
                        name="socialLinks.twitter"
                        value={editedUser.socialLinks.twitter}
                        onChange={handleInputChange}
                        className="text-sm"
                        placeholder="Twitter username"
                      />
                    ) : (
                      <span className="text-sm">@{user.socialLinks.twitter}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Instagram className="h-4 w-4 text-muted-foreground mr-2" />
                    {isEditing ? (
                      <Input 
                        name="socialLinks.instagram"
                        value={editedUser.socialLinks.instagram}
                        onChange={handleInputChange}
                        className="text-sm"
                        placeholder="Instagram username"
                      />
                    ) : (
                      <span className="text-sm">@{user.socialLinks.instagram}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Github className="h-4 w-4 text-muted-foreground mr-2" />
                    {isEditing ? (
                      <Input 
                        name="socialLinks.github"
                        value={editedUser.socialLinks.github}
                        onChange={handleInputChange}
                        className="text-sm"
                        placeholder="GitHub username"
                      />
                    ) : (
                      <span className="text-sm">@{user.socialLinks.github}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Right Column - Tabs Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                      <CardDescription>Share a bit about yourself</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Input
                              id="bio"
                              name="bio"
                              value={editedUser.bio}
                              onChange={handleInputChange}
                              className="h-24"
                            />
                          </div>
                        </div>
                      ) : (
                        <p>{user.bio}</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">Receive email updates about your activity</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Password</h4>
                          <p className="text-sm text-muted-foreground">Change your password</p>
                        </div>
                        <Button variant="outline">Update</Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-destructive">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive">Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="achievements" className="animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>Achievements</CardTitle>
                      <CardDescription>Badges and milestones you've earned</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {achievements.map(achievement => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-4"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">{achievement.name}</h3>
                                <Badge variant="outline">{achievement.date}</Badge>
                              </div>
                              <p className="text-muted-foreground">{achievement.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View All Achievements</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activity" className="animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your recent actions and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {activities.map(activity => (
                          <div key={activity.id} className="flex gap-4 relative">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center z-10">
                              {activity.type === 'goal_completed' && <Check className="h-5 w-5 text-green-500" />}
                              {activity.type === 'joined_community' && <Users className="h-5 w-5 text-blue-500" />}
                              {activity.type === 'staked_amount' && <AlertCircle className="h-5 w-5 text-amber-500" />}
                              {activity.type === 'earned_reward' && <Award className="h-5 w-5 text-purple-500" />}
                            </div>
                            <div className="absolute top-0 left-5 bottom-0 w-[1px] bg-border -z-0" />
                            <div className="flex-1 pb-8">
                              <p>{activity.description}</p>
                              <p className="text-sm text-muted-foreground mt-1">{activity.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View Complete History</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
};

export default Profile;
