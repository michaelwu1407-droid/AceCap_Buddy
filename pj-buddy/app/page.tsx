import Link from 'next/link';
import { Hammer, Building } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8 bg-[#020617] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Pj Buddy</h1>
        <p className="text-slate-400">Select your workspace mode</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link 
          href="/tradie"
          className="group relative flex flex-col items-center p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-800/80 transition-all duration-300"
        >
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Hammer size={32} className="text-blue-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">The Tradie</h2>
          <p className="text-sm text-slate-500 text-center">Invoicing, Jobs, Materials</p>
        </Link>

        <Link 
          href="/agent"
          className="group relative flex flex-col items-center p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500 hover:bg-slate-800/80 transition-all duration-300"
        >
           <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Building size={32} className="text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">The Agent</h2>
          <p className="text-sm text-slate-500 text-center">Open Houses, Leads, Matching</p>
        </Link>
      </div>
    </div>
  );
}
