export default function Footer() {
  return (
    <footer className="mt-20 bg-neutral-900 text-white border-t border-neutral-800">
      <div className="grid grid-cols-1 gap-12 px-6 py-16 mx-auto max-w-7xl md:grid-cols-3">
        
        {/* 🌿 About Section */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight">
            🌱 <span className="text-white">EcoSpark</span><span className="text-primary-500">Hub</span>
          </h2>
          <p className="max-w-xs text-sm font-medium leading-relaxed text-neutral-400">
            Empowering sustainable innovation through community-driven ideas. Join us in building a greener future for our planet.
          </p>
          <div className="flex gap-4 pt-2">
            {/* Social icons */}
            <a href="#" className="flex items-center justify-center w-8 h-8 transition-colors bg-neutral-800 rounded-2xl hover:bg-primary-600 hover:shadow-glow focus-ring" aria-label="Facebook">
              f
            </a>
            <a href="#" className="flex items-center justify-center w-8 h-8 transition-colors bg-neutral-800 rounded-2xl hover:bg-primary-600 hover:shadow-glow focus-ring" aria-label="Twitter">
              t
            </a>
            <a href="#" className="flex items-center justify-center w-8 h-8 transition-colors bg-neutral-800 rounded-2xl hover:bg-primary-600 hover:shadow-glow focus-ring" aria-label="Instagram">
              i
            </a>
            <a href="#" className="flex items-center justify-center w-8 h-8 transition-colors bg-neutral-800 rounded-2xl hover:bg-primary-600 hover:shadow-glow focus-ring" aria-label="LinkedIn">
              in
            </a>
          </div>
        </div>

        {/* 🔗 Quick Links */}
        <div>
          <h2 className="mb-6 text-lg font-black tracking-widest text-primary-500 uppercase">Quick Links</h2>
          <ul className="space-y-3 text-sm font-bold text-neutral-400">
            <li>
              <a href="/" className="inline-block transition-all hover:text-white hover:translate-x-1">Home</a>
            </li>
            <li>
              <a href="/ideas" className="inline-block transition-all hover:text-white hover:translate-x-1">Browse Ideas</a>
            </li>
            <li>
              <a href="/ideas/create" className="inline-block transition-all hover:text-white hover:translate-x-1">Create Idea</a>
            </li>
            <li>
              <a href="/auth/login" className="inline-block transition-all hover:text-white hover:translate-x-1">Login</a>
            </li>
            <li>
              <a href="/auth/signup" className="inline-block transition-all hover:text-white hover:translate-x-1">Join Community</a>
            </li>
          </ul>
        </div>

        {/* 📞 Contact Info */}
        <div>
          <h2 className="mb-6 text-lg font-black tracking-widest text-primary-500 uppercase">Contact</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-primary-500 mt-0.5">✉️</span>
              <div>
                <p className="text-sm font-medium text-neutral-400">support@ecospark.com</p>
                <p className="text-xs text-neutral-500">We respond within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-500 mt-0.5">📞</span>
              <div>
                <p className="text-sm font-medium text-neutral-400">+880 1234-567890</p>
                <p className="text-xs text-neutral-500">Mon-Fri 9AM-6PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-500 mt-0.5">📍</span>
              <div>
                <p className="text-sm font-medium text-neutral-400">Rangpur, Bangladesh</p>
                <p className="text-xs text-neutral-500">Serving globally</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📜 Bottom Copyright */}
      <div className="py-8 border-t border-neutral-800">
        <div className="flex flex-col items-center justify-between gap-4 px-6 mx-auto max-w-7xl md:flex-row">
          <p className="text-xs font-bold text-neutral-500">
            © 2026 EcoSpark Hub. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs font-bold text-neutral-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}