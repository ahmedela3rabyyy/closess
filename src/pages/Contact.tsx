import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter } from 'lucide-react';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="text-center px-4 py-12">
          <h1 className="text-white text-4xl md:text-5xl font-bold uppercase tracking-wider mb-4">
            Contact Us
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </section>

        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-[#00bfff] text-sm uppercase tracking-wider mb-6">
                  Get in Touch
                </h2>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Have questions about our products, shipping, or returns? 
                  Our customer service team is here to help you with anything you need.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#00bfff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-[#00bfff]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <p className="text-gray-400">support@cove.com</p>
                    <p className="text-gray-500 text-sm">We reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#00bfff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-[#00bfff]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Phone</h3>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                    <p className="text-gray-500 text-sm">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#00bfff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-[#00bfff]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Address</h3>
                    <p className="text-gray-400">
                      123 Fashion Avenue<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-white font-medium mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#00bfff] hover:text-black transition-all"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#00bfff] hover:text-black transition-all"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#00bfff] hover:text-black transition-all"
                  >
                    <Twitter size={24} />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8">
              {showSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <Send className="text-green-500" size={32} />
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-400">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-white text-sm uppercase font-medium mb-2 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm uppercase font-medium mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm uppercase font-medium mb-2 block">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="shipping">Shipping Question</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="product">Product Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white text-sm uppercase font-medium mb-2 block">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#00bfff] text-black py-4 font-bold uppercase tracking-wider hover:bg-[#00a0e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
