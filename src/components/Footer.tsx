import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Sosa Cottages</h3>
            <p className="text-sm text-primary-foreground/80">
              A luxury getaway resort and adventure lodge in the heart of Butere, Kenya.
              Experience tranquility, fine dining, and thrilling adventures.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cottages" className="text-sm hover:text-accent transition-colors">
                  Our Cottages
                </Link>
              </li>
              <li>
                <Link to="/restaurant" className="text-sm hover:text-accent transition-colors">
                  Restaurant
                </Link>
              </li>
              <li>
                <Link to="/activities" className="text-sm hover:text-accent transition-colors">
                  Activities
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-sm hover:text-accent transition-colors">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm">
                <Phone size={16} />
                <span>+254 XXX XXXXXX</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail size={16} />
                <span>info@sosacottages.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <MapPin size={16} />
                <span>Butere, Kenya</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Sosa Cottages. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
