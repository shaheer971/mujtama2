
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import Container from '@/components/ui/Container';

// Mock payment methods data
const mockPaymentMethods = [
  {
    id: '1',
    type: 'card',
    cardType: 'visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2024',
    isDefault: true,
    name: 'John Doe',
  },
  {
    id: '2',
    type: 'card',
    cardType: 'mastercard',
    last4: '5555',
    expiryMonth: '08',
    expiryYear: '2025',
    isDefault: false,
    name: 'John Doe',
  },
];

const paymentMethodSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be 16 digits').max(19),
  expiryMonth: z.string().min(1, 'Please select expiry month'),
  expiryYear: z.string().min(1, 'Please select expiry year'),
  cvc: z.string().min(3, 'CVC must be at least 3 digits'),
  name: z.string().min(2, 'Please enter the cardholder name'),
  setAsDefault: z.boolean().optional(),
});

const PaymentMethods = () => {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvc: '',
      name: '',
      setAsDefault: false,
    },
  });

  const onSubmit = (values: z.infer<typeof paymentMethodSchema>) => {
    // Simulate API call
    console.log('Form submitted with values:', values);
    
    // Generate a random card type for demo purposes
    const cardTypes = ['visa', 'mastercard', 'amex'];
    const randomCardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    
    // Add new payment method
    const newPaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      cardType: randomCardType,
      last4: values.cardNumber.slice(-4),
      expiryMonth: values.expiryMonth,
      expiryYear: values.expiryYear,
      isDefault: values.setAsDefault || paymentMethods.length === 0,
      name: values.name,
    };
    
    // If setting as default, update other cards
    let updatedMethods = [...paymentMethods];
    if (values.setAsDefault) {
      updatedMethods = updatedMethods.map(method => ({
        ...method,
        isDefault: false,
      }));
    }
    
    setPaymentMethods([...updatedMethods, newPaymentMethod]);
    
    // Close dialog and show success toast
    setIsAddCardOpen(false);
    form.reset();
    
    toast({
      title: "Card added successfully",
      description: `Your card ending in ${newPaymentMethod.last4} has been added.`,
    });
  };

  const handleDeleteCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    setIsDeleting(null);
    
    toast({
      title: "Card removed",
      description: "Your payment method has been removed.",
    });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    })));
    
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    });
  };

  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case 'visa':
        return <div className="text-blue-600 font-bold">VISA</div>;
      case 'mastercard':
        return <div className="text-red-600 font-bold">MC</div>;
      case 'amex':
        return <div className="text-green-600 font-bold">AMEX</div>;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  // Generate expiry month and year options
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: month.toString().padStart(2, '0'), label: month.toString().padStart(2, '0') };
  });
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <div className="py-8">
      <Container maxWidth="4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
              <p className="text-muted-foreground">
                Manage your payment methods for community stakes
              </p>
            </div>
            <Button onClick={() => setIsAddCardOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={method.isDefault ? 'border-primary/30 shadow-sm' : ''}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      {getCardIcon(method.cardType)}
                      <CardTitle className="text-lg">
                        •••• {method.last4}
                      </CardTitle>
                    </div>
                    {method.isDefault && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>{method.name}</p>
                      <p>Expires {method.expiryMonth}/{method.expiryYear}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    {!method.isDefault && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set as default
                      </Button>
                    )}
                    {method.isDefault ? (
                      <div></div>
                    ) : (
                      <div></div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setIsDeleting(method.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No payment methods found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                You haven't added any payment methods yet. Add a payment method to join communities and stake on goals.
              </p>
              <Button onClick={() => setIsAddCardOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </div>
          )}
        </div>

        {/* Add Card Dialog */}
        <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new card to use for community stakes
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          {...field}
                          onChange={(e) => {
                            // Only allow numbers and spaces
                            const value = e.target.value.replace(/[^\d\s]/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="expiryMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Month</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month.value} value={month.value}>
                                  {month.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="expiryYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Year</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="YYYY" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year.value} value={year.value}>
                                  {year.label}
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cvc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123"
                            maxLength={4}
                            {...field}
                            onChange={(e) => {
                              // Only allow numbers
                              const value = e.target.value.replace(/[^\d]/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cardholder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="setAsDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Set as default payment method</FormLabel>
                        <FormDescription>
                          This will be used as your primary payment method
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddCardOpen(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Card</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remove Payment Method</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this payment method?
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center p-3 bg-destructive/10 rounded-md mb-4">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              <p className="text-sm">This action cannot be undone.</p>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleting(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => isDeleting && handleDeleteCard(isDeleting)}
              >
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
};

export default PaymentMethods;
