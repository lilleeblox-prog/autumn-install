import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useJoinWaitlist } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmationMessage } from '@/components/confirmation-message';

const waitlistSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  season: 'winter' | 'summer';
  title?: string;
  description?: string;
}

export function WaitlistForm({ season, title = 'Receive notifications', description }: WaitlistFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const joinWaitlist = useJoinWaitlist();

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      zipCode: '',
      notes: '',
    },
  });

  const onSubmit = (data: WaitlistFormData) => {
    joinWaitlist.mutate(
      {
        data: {
          ...data,
          season,
        },
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      }
    );
  };

  if (submitted) {
    return (
      <ConfirmationMessage
        title="You're on the list"
        message={`You'll be among the first to know when ${season === 'winter' ? 'winter' : 'summer'} service opens in your area.`}
      />
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="space-y-2">
          <h3 className="text-2xl font-serif font-medium">{title}</h3>
          {description && <p className="text-muted-foreground leading-relaxed">{description}</p>}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid="form-waitlist">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jane" data-testid="input-firstName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Doe" data-testid="input-lastName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="jane@example.com" data-testid="input-email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" placeholder="(555) 123-4567" data-testid="input-phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code (optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="37027" data-testid="input-zipCode" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Any specific requests or questions?"
                    className="resize-none"
                    rows={3}
                    data-testid="input-notes"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={joinWaitlist.isPending}
            data-testid="button-submit-waitlist"
          >
            {joinWaitlist.isPending ? 'Submitting...' : 'Notify me'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
