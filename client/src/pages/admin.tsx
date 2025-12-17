import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lock, LogOut } from "lucide-react";

// Mock Data Seeder
const SEED_ORDERS = [
  {
    id: "1702839201",
    name: "Michael Scott",
    email: "michael@dundermifflin.com",
    phone: "07700 900461",
    products: { cake: 2, sorrel: 1 },
    specialRequests: "Extra moist please!",
    date: "2024-12-15T10:30:00.000Z",
    status: "pending"
  },
  {
    id: "1702849102",
    name: "Pam Beesly",
    email: "pam@dundermifflin.com",
    phone: "07700 900321",
    products: { cake: 1, sorrel: 3 },
    specialRequests: "",
    date: "2024-12-16T14:15:00.000Z",
    status: "completed"
  }
];

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    // Check if already logged in (mock session)
    const isAuth = sessionStorage.getItem("isAdminAuth");
    if (isAuth === "true") {
      setIsAuthenticated(true);
      loadOrders();
    }
  }, []);

  const loadOrders = () => {
    const localOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    // Combine seed data with local data for the demo
    setOrders([...localOrders, ...SEED_ORDERS]);
  };

  function onLogin(values: z.infer<typeof loginSchema>) {
    // Mock Credentials
    if (values.username === "admin" && values.password === "password") {
      setIsAuthenticated(true);
      sessionStorage.setItem("isAdminAuth", "true");
      loadOrders();
      toast({
        title: "Welcome back",
        description: "You have successfully logged in.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid username or password.",
      });
    }
  }

  function onLogout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAdminAuth");
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-none shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif font-bold text-secondary">Admin Access</CardTitle>
            <p className="text-sm text-muted-foreground">Enter your credentials to view orders</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="admin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-secondary">Order Dashboard</h1>
            <p className="text-muted-foreground">Manage incoming requests from the website.</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Notes</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No orders found yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const total = (order.products.cake * 15) + (order.products.sorrel * 5);
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium text-xs text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-secondary">{order.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {order.products.cake > 0 && (
                              <Badge variant="outline" className="w-fit bg-primary/10 border-primary/20 text-secondary-foreground">
                                {order.products.cake}x Cake
                              </Badge>
                            )}
                            {order.products.sorrel > 0 && (
                              <Badge variant="outline" className="w-fit bg-accent/10 border-accent/20 text-accent">
                                {order.products.sorrel}x Sorrel
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">
                          <div>{order.email}</div>
                          <div className="text-muted-foreground">{order.phone}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-[200px] truncate text-sm text-muted-foreground" title={order.specialRequests}>
                          {order.specialRequests || "-"}
                        </TableCell>
                        <TableCell className="text-right font-bold text-secondary">
                          £{total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
