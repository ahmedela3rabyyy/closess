import Header from '../sections/Header';
import Footer from '../sections/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00bfff]/20 to-black" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-white text-4xl md:text-6xl font-bold uppercase tracking-wider mb-4">
              About COVE
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Redefining modern fashion with comfort, style, and sustainability
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[#00bfff] text-sm uppercase tracking-wider mb-4">
                Our Story
              </h2>
              <h3 className="text-white text-3xl font-bold mb-6">
                Born from a Passion for Quality
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                COVE was founded in 2020 with a simple mission: to create clothing 
                that feels as good as it looks. We believe that true style comes 
                from confidence, and confidence comes from comfort.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Every piece in our collection is thoughtfully designed and crafted 
                with premium materials, ensuring that you not only look your best 
                but feel your best too.
              </p>
            </div>
            <div className="aspect-square bg-gradient-to-br from-[#00bfff]/30 to-purple-500/30 rounded-lg flex items-center justify-center">
              <span className="text-6xl font-bold text-white/20">COVE</span>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-gray-900/30 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-white text-3xl font-bold text-center mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Quality First',
                  description:
                    'We use only the finest materials and work with skilled artisans to create pieces that last.',
                },
                {
                  title: 'Sustainable Fashion',
                  description:
                    'Our commitment to the environment drives us to use eco-friendly materials and ethical production methods.',
                },
                {
                  title: 'Inclusive Design',
                  description:
                    'Fashion for everyone. Our designs are created to flatter all body types and celebrate individuality.',
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="bg-black border border-gray-800 p-8 rounded-lg hover:border-[#00bfff]/50 transition-colors"
                >
                  <h3 className="text-[#00bfff] text-xl font-bold mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '50K+', label: 'Happy Customers' },
                { number: '100+', label: 'Products' },
                { number: '30+', label: 'Countries' },
                { number: '4.8', label: 'Average Rating' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-[#00bfff] text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 uppercase tracking-wider text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-gray-900/30 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-white text-3xl font-bold text-center mb-12">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Alex Chen', role: 'Founder & CEO' },
                { name: 'Sarah Miller', role: 'Creative Director' },
                { name: 'James Wilson', role: 'Head of Design' },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-[#00bfff] to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-white text-xl font-bold">{member.name}</h3>
                  <p className="text-gray-400">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
