import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitFallOrder } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmationMessage } from '@/components/confirmation-message';

const fallOrderSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  notes: z.string().optional(),
});

type FallOrderFormData = z.infer<typeof fallOrderSchema>;

interface FallOrderFormProps {
  serviceType: 'waitlist' | 'order';
  title?: string;
  description?: string;
}

export function FallOrderForm({ serviceType, title, description }: FallOrderFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const submitOrder = useSubmitFallOrder();

  const form = useForm<FallOrderFormData>({
    resolver: zodResolver(fallOrderSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      zipCode: '',
      notes: '',
    },
  });

  const onSubmit = (data: FallOrderFormData) => {
    submitOrder.mutate(
      {
        data: {
          ...data,
          serviceType,
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
        title={serviceType === 'waitlist' ? "You're on the list" : 'Thank you for your order'}
        message={
          serviceType === 'waitlist'
            ? "We'll reach out as soon as fall orders open in mid-August. Thank you for your interest."
            : "Your fall installation inquiry has been received. We'll be in touch within 24 hours to confirm details."
        }
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid={`form-fall-${serviceType}`}>
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
                <FormLabel>Zip Code</FormLabel>
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
            disabled={submitOrder.isPending}
            data-testid={`button-submit-${serviceType}`}
          >
            {submitOrder.isPending ? 'Submitting...' : serviceType === 'waitlist' ? 'Join Waitlist' : 'Submit Inquiry'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
