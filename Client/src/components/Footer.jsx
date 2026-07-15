import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">
              ShopEZ<span className="text-primary-500 text-sm font-semibold ml-2">EST. 2026</span>
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Experience the future of online shopping. Hand-curated premium products, lightning fast checkout, and 24/7 dedicated support.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-primary-500 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary-500 transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products?category=Electronics" className="hover:text-primary-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Clothing" className="hover:text-primary-400 transition-colors">Apparel & Clothing</Link></li>
              <li><Link to="/products?category=Sports" className="hover:text-primary-400 transition-colors">Fitness & Sports</Link></li>
              <li><Link to="/products?category=Home & Kitchen" className="hover:text-primary-400 transition-colors">Home & Living</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/profile" className="hover:text-primary-400 transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-primary-400 transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Shipping Rates</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">FAQs & Returns</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
                <span>123 Commerce St, Suite 400, New York</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-500 shrink-0" />
                <span>+1 (800) 555-0199</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-500 shrink-0" />
                <span>support@shopez.com</span>
              </li>
            </ul>
          </div>

        </div>

        <hr className="border-slate-800 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ShopEZ Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
