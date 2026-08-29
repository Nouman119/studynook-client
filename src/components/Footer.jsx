'use client';

import Link from 'next/link';
import { BookOpen, Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white pt-20 pb-12 border-t border-zinc-800 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#6366F1] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                StudyNook
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed mb-6">
              We connect students and professionals with quiet, productive study spaces across the city. Book instantly and focus on what matters.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link href="/" className="hover:text-[#6366F1] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-[#6366F1] transition-colors">
                  All Rooms
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#6366F1] transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-zinc-400 mb-6">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#6366F1]" />
                <span>support@studynook.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#6366F1]" />
                <span>+1 234 567 890</span>
              </li>
            </ul>

            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#6366F1] hover:border-[#6366F1] transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#6366F1] hover:border-[#6366F1] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#6366F1] hover:border-[#6366F1] transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#6366F1] hover:border-[#6366F1] transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Legal */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} StudyNook. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}