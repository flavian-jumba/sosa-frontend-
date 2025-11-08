import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MenuItemSkeleton } from "@/components/skeletons/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { UtensilsCrossed, ChefHat, Leaf, Clock } from "lucide-react";
import { restaurantService } from "@/services/restaurantService";
import { getImageUrl } from "@/lib/api";
import type { RestaurantMenuItem, ApiError } from "@/types/api.types";
import { useToast } from "@/hooks/use-toast";
import pathwayImage from "@/assets/pathway-view.jpg";

const Restaurant = () => {
  const [menuItems, setMenuItems] = useState<RestaurantMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await restaurantService.getMenu({
          category: category !== "all" ? category : undefined,
          is_available: true,
        });
        console.log('Restaurant menu response:', response);
        console.log('Menu data:', response.data);
        console.log('Is array?', Array.isArray(response.data));
        setMenuItems(response.data || []);
      } catch (err) {
        const error = err as ApiError;
        console.error('Error fetching menu:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load menu",
          variant: "destructive",
        });
        setMenuItems([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [category, toast]);

  // Get unique categories - safely handle non-array menuItems
  const categories = Array.isArray(menuItems) 
    ? Array.from(new Set(menuItems.map((item) => item.category)))
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${pathwayImage})` }}
          >
            <div className="absolute inset-0 bg-primary/70" />
          </div>
          <div className="relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <UtensilsCrossed className="text-accent" size={48} />
              <h1 className="text-5xl md:text-6xl font-bold text-white">Our Restaurant</h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/90"
            >
              A culinary journey through authentic Kenyan flavors
            </motion.p>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg p-6 shadow-lg text-center"
              >
                <ChefHat className="text-accent mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold mb-2">Expert Chefs</h3>
                <p className="text-muted-foreground">
                  Our talented chefs bring years of culinary expertise and passion to every dish.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-lg p-6 shadow-lg text-center"
              >
                <Leaf className="text-accent mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold mb-2">Fresh Ingredients</h3>
                <p className="text-muted-foreground">
                  We source the finest local ingredients for authentic, farm-to-table dining.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-lg p-6 shadow-lg text-center"
              >
                <Clock className="text-accent mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold mb-2">Open Daily</h3>
                <p className="text-muted-foreground">
                  Breakfast: 7-10 AM | Lunch: 12-3 PM | Dinner: 6-10 PM
                </p>
              </motion.div>
            </div>

            {/* Category Filter */}
            {categories && categories.length > 0 && (
              <div className="mb-8 flex justify-center">
                <div className="w-full md:w-64">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">Our Cuisine</h2>
              <p className="text-lg text-muted-foreground">
                Experience the rich flavors of Kenya with our carefully curated menu. From traditional
                nyama choma to fresh tilapia from local lakes, every dish tells a story of our land and
                culture. Our chefs combine authentic recipes with modern culinary techniques to create
                unforgettable dining experiences.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Menu Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Our Menu</h2>
              <p className="text-lg text-muted-foreground">
                {loading ? "Loading menu..." : `${menuItems?.length || 0} dishes available`}
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {[...Array(6)].map((_, i) => (
                  <MenuItemSkeleton key={i} />
                ))}
              </div>
            ) : menuItems && menuItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="flex gap-4 p-4 hover:shadow-lg transition-shadow h-full">
                      {item.image_path && (
                        <img
                          src={getImageUrl(item.image_path)}
                          alt={item.name}
                          className="w-24 h-24 rounded-md object-cover flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            {item.is_featured && (
                              <Badge variant="secondary" className="text-xs mt-1">Featured</Badge>
                            )}
                          </div>
                          <span className="font-bold text-primary whitespace-nowrap">
                            KSh {item.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        {item.allergens && item.allergens.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Allergens: {item.allergens.join(", ")}
                          </p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No menu items available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Make a Reservation</h2>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Book your cottage stay to enjoy our exceptional dining experience.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/booking">
                  <Button size="lg" variant="secondary">
                    Book a Cottage
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Restaurant;
