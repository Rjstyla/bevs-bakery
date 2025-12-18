import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  tags?: string[];
  onOrder: () => void;
  testId?: string;
}

export function ProductCard({ title, description, price, image, tags = [], onOrder, testId }: ProductCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group bg-card" data-testid={testId}>
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-white font-serif italic text-sm">Taste the tradition</p>
        </div>
      </div>
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-serif text-secondary">{title}</CardTitle>
          <Badge variant="secondary" className="bg-primary text-primary-foreground font-bold font-sans">
            {price}
          </Badge>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs border-primary/40 text-secondary/80">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onOrder} 
          className="w-full bg-secondary hover:bg-secondary/90 text-white font-sans font-medium tracking-wide shadow-md hover:shadow-lg transition-all"
          data-testid={`${testId}-button`}
        >
          Add to Order Request
        </Button>
      </CardFooter>
    </Card>
  );
}
