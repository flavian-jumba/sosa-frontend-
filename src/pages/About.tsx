import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Award, Users, MapPin } from "lucide-react";
import aerialImage from "@/assets/cottages-aerial.jpg";
import groundsImage from "@/assets/grounds-view.jpg";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Hospitality",
      description: "We treat every guest like family, ensuring warm and personalized service throughout your stay.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in accommodations, dining, and activities to exceed expectations.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We're committed to supporting local communities and sustainable tourism practices.",
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Perfectly situated in Butere, we offer easy access to natural beauty and local attractions.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${aerialImage})` }}
          >
            <div className="absolute inset-0 bg-primary/70" />
          </div>
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4"
            >
              About Sosa Cottages
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/90"
            >
              Your home away from home in the heart of Kenya
            </motion.p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Sosa Cottages was born from a vision to create a sanctuary where visitors could
                    experience the natural beauty and warm hospitality that Kenya is famous for. Nestled
                    in the picturesque town of Butere, our resort combines traditional Kenyan charm with
                    modern luxury.
                  </p>
                  <p>
                    What started as a dream has blossomed into a premier destination for travelers
                    seeking both adventure and relaxation. Our unique circular cottages, inspired by
                    traditional African architecture, offer an authentic yet comfortable experience.
                  </p>
                  <p>
                    Every aspect of Sosa Cottages has been thoughtfully designed to provide our guests
                    with unforgettable memories, from our farm-to-table restaurant to our exciting range
                    of activities. We pride ourselves on being more than just a place to stay – we're a
                    gateway to experiencing the true spirit of Kenya.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <img
                  src={groundsImage}
                  alt="Our Resort"
                  className="rounded-lg shadow-xl w-full h-[400px] object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at Sosa Cottages
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg p-6 shadow-lg text-center"
                >
                  <div className="inline-flex p-4 bg-accent/10 rounded-full mb-4">
                    <value.icon className="text-accent" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl font-bold mb-6">Our Location</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Sosa Cottages is located in Butere, a charming town in Western Kenya known for its
                lush landscapes and rich cultural heritage. We're easily accessible from major cities
                and offer the perfect escape from urban life.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg p-6 shadow-lg">
                  <h3 className="font-bold mb-2">From Nairobi</h3>
                  <p className="text-muted-foreground text-sm">Approximately 5-6 hours by road</p>
                </div>
                <div className="bg-card rounded-lg p-6 shadow-lg">
                  <h3 className="font-bold mb-2">From Kisumu</h3>
                  <p className="text-muted-foreground text-sm">About 1 hour drive</p>
                </div>
                <div className="bg-card rounded-lg p-6 shadow-lg">
                  <h3 className="font-bold mb-2">From Kakamega</h3>
                  <p className="text-muted-foreground text-sm">Approximately 30 minutes</p>
                </div>
              </div>
            </motion.div>
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
              <h2 className="text-4xl font-bold mb-6">Experience Sosa Cottages</h2>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Come and discover why our guests keep coming back. Book your stay today and become
                part of the Sosa Cottages family.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
