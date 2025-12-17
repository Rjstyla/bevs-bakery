import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

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
  products: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one item.",
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
      products: [],
      specialRequests: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Request Sent!",
      description: "We've received your order request. We'll contact you shortly to confirm.",
      className: "bg-secondary text-secondary-foreground border-primary",
    });
    form.reset();
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-xl shadow-xl border border-border/40">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-serif font-bold text-secondary mb-2">Request an Order</h3>
        <p className="text-muted-foreground text-sm">Tell us what you'd like, and we'll get baking.</p>
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
                    <Input placeholder="(876) 555-0123" {...field} className="bg-background/50 border-input/60 focus:border-primary transition-colors" data-testid="input-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="products"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Select Items</FormLabel>
                  <FormDescription>
                    Choose the treats you're interested in.
                  </FormDescription>
                </div>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="products"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key="cake"
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/20 transition-colors"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("8-inch Christmas Fruit Cake")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, "8-inch Christmas Fruit Cake"])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "8-inch Christmas Fruit Cake"
                                      )
                                    )
                              }}
                              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary"
                              data-testid="checkbox-cake"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-serif text-secondary text-base">
                              8-inch Christmas Fruit Cake
                            </FormLabel>
                            <FormDescription>
                              Rich, boozy, and packed with fruits.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="products"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key="sorrel"
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/20 transition-colors"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("Bottle of Sorrel")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, "Bottle of Sorrel"])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "Bottle of Sorrel"
                                      )
                                    )
                              }}
                              className="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground border-accent"
                              data-testid="checkbox-sorrel"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-serif text-accent text-base">
                              Bottle of Sorrel
                            </FormLabel>
                            <FormDescription>
                              Spiced with ginger and pimento.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )
                    }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

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
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-12 shadow-md hover:shadow-lg transition-all" data-testid="button-submit">Submit Request</Button>
        </form>
      </Form>
    </div>
  );
}
