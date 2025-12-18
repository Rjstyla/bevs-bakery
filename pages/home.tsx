import { useRef } from "react";
import { Hero } from "../components/hero";
import { ProductCard } from "../components/product-card";
import { OrderForm } from "../components/order-form";
import { motion } from "framer-motion";

// Import generated assets
import heroImage from "../../attached_assets/generated_images/elegant_dark_mood_jamaican_spices_and_ingredients.png";
import cakeImage from "../../attached_assets/generated_images/rich_jamaican_christmas_fruit_cake.png";
import sorrelImage from "../../attached_assets/generated_images/refreshing_jamaican_sorrel_drink.png";

export default function Home() {
  const formSectionRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Hero 
        backgroundImage={heroImage} 
        onCtaClick={scrollToForm} 
      />

      <main className="container mx-auto px-4 py-24 space-y-32">
        {/* Story Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-serif font-bold text-secondary mb-6">A Taste of Home</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Bev's Bakery, we believe in the power of tradition. Our recipes have been passed down through generations, capturing the authentic warmth and spice of Jamaica. From the rich, rum-soaked fruits in our Christmas cakes to the vibrant, gingery kick of our Sorrel, every item is crafted with love and patience.
            </p>
          </motion.div>
        </section>

        {/* Products Section */}
        <section className="space-y-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">Our Specialties</h2>
            <p className="text-muted-foreground">Handcrafted for the holiday season and beyond.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ProductCard
                title="Christmas Fruit Cake"
                description="Our signature 8-inch cake. Fruits soaked in Red Label Wine and White Overproof Rum for months, baked slow and low for that perfect moist, dark texture."
                price="£15.00"
                image={cakeImage}
                tags={["8-inch", "Rum Soaked", "Traditional"]}
                onOrder={scrollToForm}
                testId="card-cake"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ProductCard
                title="Jamaican Sorrel"
                description="Fresh sorrel petals brewed with ginger, pimento, and a hint of lime. A deep red, refreshing holiday classic served in a premium glass bottle."
                price="£5.00"
                image={sorrelImage}
                tags={["750ml", "Fresh Brewed", "Spiced"]}
                onOrder={scrollToForm}
                testId="card-sorrel"
              />
            </motion.div>
          </div>
        </section>

        {/* Order Form Section */}
        <section ref={formSectionRef} className="bg-secondary/5 -mx-4 px-4 py-24 rounded-3xl">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-bold text-secondary">Place Your Order</h2>
              <p className="text-lg text-muted-foreground">
                Ready to bring a taste of Jamaica to your table? Fill out the form to request your order. 
                <br/><br/>
                <span className="font-semibold text-secondary">Note:</span> Since everything is made fresh to order, please allow 48 hours for confirmation.
              </p>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-border/50">
                <h4 className="font-serif font-bold text-secondary mb-2">Contact Us Directly</h4>
                <p className="text-muted-foreground">rls_johnson@hotmail.com</p>
                <p className="text-muted-foreground">07852220010</p>
              </div>
            </div>
            
            <OrderForm />
          </div>
        </section>
      </main>

      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h3 className="text-2xl font-serif font-bold text-primary">Bev's Bakery</h3>
          <p className="text-white/60 text-sm">© 2024 Bev's Bakery. Authentic Jamaican Traditions.</p>
        </div>
      </footer>
    </div>
  );
}
