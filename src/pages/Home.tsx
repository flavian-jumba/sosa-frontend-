import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CottageCard from "@/components/CottageCard";
import ActivityCard from "@/components/ActivityCard";
import { CottageCardSkeleton, ActivityCardSkeleton, TestimonialSkeleton } from "@/components/skeletons/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, UtensilsCrossed } from "lucide-react";
import { useFeaturedCottages } from "@/hooks/useCottages";
import { useActivities } from "@/hooks/useActivities";
import { useTestimonials } from "@/hooks/useTestimonials";
import groundsImage from "@/assets/grounds-view.jpg";

const Home = () => {
  // Fetch featured cottages
  const { cottages: featuredCottages, loading: cottagesLoading } = useFeaturedCottages();
  
  // Fetch activities (limit to 6)
  const { activities, loading: activitiesLoading } = useActivities({ per_page: 6 });
  
  // Fetch all testimonials and filter for featured ones
  const { testimonials: allTestimonials, loading: testimonialsLoading } = useTestimonials({});
  
  // Filter for featured testimonials only
  const testimonials = allTestimonials?.filter(t => t.is_featured && t.is_approved).slice(0, 3) || [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Hero />

        {/* Cottages Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Explore Our Cottages</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our selection of beautifully designed cottages, each offering comfort and
              tranquility in a stunning natural setting.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {cottagesLoading ? (
              <>
                <CottageCardSkeleton />
                <CottageCardSkeleton />
                <CottageCardSkeleton />
              </>
            ) : featuredCottages && featuredCottages.length > 0 ? (
              featuredCottages.map((cottage) => (
                <CottageCard key={cottage.id} cottage={cottage} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No featured cottages available at the moment.</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to="/cottages">
              <Button size="lg" variant="outline">
                View All Cottages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Restaurant Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src={groundsImage}
                alt="Restaurant"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <UtensilsCrossed className="text-accent" size={32} />
                <h2 className="text-4xl font-bold text-foreground">Restaurant & Dining</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Indulge in exquisite cuisine at our on-site restaurant. Our talented chefs prepare
                authentic Kenyan dishes alongside international favorites, all made with fresh,
                locally-sourced ingredients.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Star className="text-accent mt-1" size={20} />
                  <span>Award-winning chefs with international experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="text-accent mt-1" size={20} />
                  <span>Farm-to-table fresh ingredients</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="text-accent mt-1" size={20} />
                  <span>Indoor and outdoor dining options</span>
                </li>
              </ul>
              <Link to="/restaurant">
                <Button size="lg" className="bg-primary hover:bg-secondary">
                  Explore Restaurant
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Adventure & Fun Activities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From thrilling adventures to peaceful nature walks, there's something for everyone at
              Sosa Cottages.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {activitiesLoading ? (
              <>
                <ActivityCardSkeleton />
                <ActivityCardSkeleton />
                <ActivityCardSkeleton />
              </>
            ) : activities && activities.length > 0 ? (
              activities.slice(0, 3).map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No activities available at the moment.</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to="/activities">
              <Button size="lg" variant="outline">
                View All Activities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Guests Say</h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Read what our happy guests have to say about their experience at Sosa Cottages.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsLoading ? (
              <>
                <TestimonialSkeleton />
                <TestimonialSkeleton />
                <TestimonialSkeleton />
              </>
            ) : testimonials && testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={20} fill="currentColor" className="text-accent" />
                    ))}
                  </div>
                  <p className="text-primary-foreground/90 mb-4 italic">"{testimonial.content}"</p>
                  <p className="font-semibold text-accent">- {testimonial.guest_name}</p>
                  {testimonial.guest_title && (
                    <p className="text-sm text-primary-foreground/70">{testimonial.guest_title}</p>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-primary-foreground/70">No testimonials available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">Ready for Your Escape?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Book your stay at Sosa Cottages today and experience the perfect blend of relaxation,
              adventure, and luxury in the heart of Kenya.
            </p>
            <Link to="/booking">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Book Your Stay Now
              </Button>
            </Link>
          </motion.div>
        </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
