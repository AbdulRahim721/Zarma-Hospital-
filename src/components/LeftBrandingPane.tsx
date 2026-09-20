import React from 'react';
import { ClinicLogo } from './ClinicLogo';
import { ShieldCheck, Clock, Award, HeartPulse } from 'lucide-react';

export const LeftBrandingPane: React.FC = () => {
  return (
    <aside
      id="desktop-branding-pane"
      className="hidden lg:flex lg:w-5/12 xl:w-[45%] relative flex-col justify-between p-10 xl:p-14 bg-[#1a5f7a] text-white overflow-hidden select-none"
      style={{
        backgroundColor: '#1a5f7a',
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.12) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(139, 195, 74, 0.15) 0%, transparent 50%)',
      }}
    >
      {/* Decorative ambient medical/organic watermarks */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#8bc34a]/10 blur-3xl pointer-events-none" />
      
      {/* Subtle organic SVG accent line */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 800"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M-50,200 C150,150 250,350 550,250"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <path
          d="M-50,550 C200,450 300,700 550,600"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Top Header: Brand Name and Monogram */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
          <HeartPulse className="w-5 h-5 text-[#8bc34a]" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8bc34a]">
            Nowshera, KPK • Healthcare
          </span>
          <h2 className="text-lg font-bold tracking-tight text-white leading-tight">
            ZARMA HOSPITAL
          </h2>
        </div>
      </div>

      {/* Center Hero: Circular Logo, Welcoming Title & Tagline */}
      <div className="relative z-10 my-auto py-8 max-w-lg">
        {/* Circular Logo in a framed badge */}
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl shadow-black/10 mb-8 transition-transform hover:scale-105 duration-300">
          <ClinicLogo size={140} variant="colored" />
        </div>

        {/* Welcoming Title */}
        <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Your Health, <br />
          <span className="text-[#8bc34a]">Our Priority</span>
        </h1>

        {/* Brief Tagline about accessible healthcare */}
        <p className="text-slate-100/90 text-base xl:text-lg font-normal leading-relaxed mb-8 max-w-md">
          Providing compassionate, accessible, and high-quality family medical care.
          Manage appointments, access your medical records, and stay connected
          with your dedicated care team—all in one secure portal.
        </p>

        {/* Trust & Quality Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-xs font-medium text-slate-100">
            <ShieldCheck className="w-4 h-4 text-[#8bc34a] shrink-0" />
            <span>HIPAA-Compliant & Secure</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-xs font-medium text-slate-100">
            <Clock className="w-4 h-4 text-[#8bc34a] shrink-0" />
            <span>24/7 Digital Health Access</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-xs font-medium text-slate-100 sm:col-span-2">
            <Award className="w-4 h-4 text-[#8bc34a] shrink-0" />
            <span>Board-Certified Physicians & Family Practitioners</span>
          </div>
        </div>
      </div>

      {/* Footer / Emergency Assistance Notice */}
      <div className="relative z-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-white/70">
        <span>© {new Date().getFullYear()} ZARMA HOSPITAL • Nowshera, KPK</span>
        <span className="text-slate-200">
          Emergency / Inquiries: <a href="tel:03295992635" className="text-white font-bold hover:underline">03295992635</a>
        </span>
      </div>
    </aside>
  );
};
