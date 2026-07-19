import { HelpCircle, MessageSquare, MapPin, ShieldCheck, Heart } from "lucide-react";
import OzDealLogo from "./OzDealLogo";

export default function Footer() {
  return (
    <footer className="bg-[#003b73] text-white/90 pt-16 pb-12 mt-auto border-t border-blue-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pb-12 border-b border-white/10">
           
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <OzDealLogo size="sm" className="bg-white/10 p-1 rounded-xl shadow-inner border border-white/10" />
              <span className="font-display text-lg font-bold tracking-tight">OzDeal Australia</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Solusi terpercaya jastip dan cargo udara premium dari Australia ke Indonesia. Beli barang favorit Anda langsung dari toko resmi Australia, kami urus pengirimannya sampai ke depan pintu rumah Anda.
            </p>
          </div>

          {/* Column 2: Keunggulan Jasa */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white tracking-wide">Keamanan & Layanan</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Asuransi pengiriman penuh (opsional)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-300 shrink-0" />
                <span>Gudang fisik representatif di Sydney</span>
              </li>
              <li className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-blue-300 shrink-0" />
                <span>Layanan bantuan personal 7 hari seminggu</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Hubungi Kami */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white tracking-wide">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-red-400 shrink-0" />
                <span>Suite 97 / 11 Bringelly Rd, Kingswood NSW 2747</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 fill-current" />
                <a 
                  href="https://wa.me/61478527270?text=Halo%20OzDeal%2C%20saya%20ingin%20bertanya%20mengenai%20layanan%20jasa%20titip%2Fkirim%20barang."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors font-medium"
                >
                  WhatsApp: +61 478 527 270
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} OzDeal Indonesia. Semua Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1.5 text-slate-400/85">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>untuk Jastipers Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
