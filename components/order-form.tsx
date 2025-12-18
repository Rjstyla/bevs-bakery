import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";
import { Minus, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  products: z.object({
    cake: z.number().min(0),
    sorrel: z.number().min(0),
  }).refine((data) => data.cake > 0 || data.sorrel > 0, {
    message: "You must order at least one item.",
    path: ["root"],
  }),
  specialRequests: z.string().optional(),
});

export function OrderForm() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      products: {
        cake: 0,
        sorrel: 0,
      },
      specialRequests: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          cakeQuantity: values.products.cake,
          sorrelQuantity: values.products.sorrel,
          specialRequests: values.specialRequests || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Request Sent!",
        description: `We've received your order for ${data.cakeQuantity > 0 ? `${data.cakeQuantity} Cake(s)` : ""} ${data.cakeQuantity > 0 && data.sorrelQuantity > 0 ? "and" : ""} ${data.sorrelQuantity > 0 ? `${data.sorrelQuantity} Sorrel` : ""}. We'll contact you shortly.`,
        className: "bg-secondary text-secondary-foreground border-primary",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your order. Please try again.",
      });
      console.error("Order submission error:", error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createOrderMutation.mutate(values);
  }

  const updateQuantity = (product: "cake" | "sorrel", change: number) => {
    const current = form.getValues(`products.${product}`);
    const newValue = Math.max(0, current + change);
    form.setValue(`products.${product}`, newValue);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-xl shadow-xl border border-border/40">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-serif font-bold text-secondary mb-2">Request an Order</h3>
        <p className="text-muted-foreground text-sm">Tell us what you&apos;d like, and we&apos;ll get baking.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} className="bg-background/50 border-input/60 focus:border-primary transition-colors" data-testid="input-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="hello@example.com" {...field} className="bg-background/50 border-input/60 focus:border-primary transition-colors" data-testid="input-email" />
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
                    <Input placeholder="07123 456789" {...field} className="bg-background/50 border-input/60 focus:border-primary transition-colors" data-testid="input-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="mb-2">
              <label className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Select Items</label>
              <p className="text-[0.8rem] text-muted-foreground">
                Choose quantity for each item.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="products.cake"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-md border p-4 hover:bg-muted/20 transition-colors">
                  <div className="space-y-0.5">
                    <FormLabel className="font-serif text-secondary text-base block">
                      Christmas Fruit Cake
                    </FormLabel>
                    <FormDescription>
                      8-inch, Rum Soaked
                    </FormDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full border-primary/50 text-secondary hover:bg-primary/10"
                      onClick={() => updateQuantity("cake", -1)}
                      data-testid="btn-cake-minus"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-mono text-lg font-bold min-w-[1.5rem] text-center" data-testid="count-cake">{field.value}</span>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full border-primary/50 text-secondary hover:bg-primary/10"
                      onClick={() => updateQuantity("cake", 1)}
                      data-testid="btn-cake-plus"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="products.sorrel"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-md border p-4 hover:bg-muted/20 transition-colors">
                  <div className="space-y-0.5">
                    <FormLabel className="font-serif text-accent text-base block">
                      Bottle of Sorrel
                    </FormLabel>
                    <FormDescription>
                      750ml, Spiced
                    </FormDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full border-accent/50 text-accent hover:bg-accent/10"
                      onClick={() => updateQuantity("sorrel", -1)}
                      data-testid="btn-sorrel-minus"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-mono text-lg font-bold min-w-[1.5rem] text-center" data-testid="count-sorrel">{field.value}</span>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full border-accent/50 text-accent hover:bg-accent/10"
                      onClick={() => updateQuantity("sorrel", 1)}
                      data-testid="btn-sorrel-plus"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            {form.formState.errors.products && (
               <p className="text-sm font-medium text-destructive mt-2">You must select at least one item.</p>
            )}
          </div>

          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any allergies or specific delivery instructions?"
                    className="resize-none bg-background/50 border-input/60 focus:border-primary transition-colors min-h-[100px]"
                    {...field}
                    data-testid="textarea-requests"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-12 shadow-md hover:shadow-lg transition-all" 
            data-testid="button-submit"
            disabled={createOrderMutation.isPending}
          >
            {createOrderMutation.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
