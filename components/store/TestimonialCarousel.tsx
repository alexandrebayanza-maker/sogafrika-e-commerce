'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Josue Akili',
    role: 'CEO',
    location: 'Goma, DRC',
    content: 'SogAfrika provided us with a complete CCTV system for our warehouse. The quality is exceptional and their technical support is outstanding.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Josue Ngolo',
    role: 'Software Developer',
    location: 'Kigali, Rwanda',
    content: 'We equipped our entire hotel with their fire safety systems. Professional installation and the equipment works flawlessly.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Elie Eben',
    role: 'IT Director',
    location: 'Goma, DRC',
    content: 'Their networking equipment is top-tier. We deployed enterprise solutions across our offices with zero downtime. Highly recommended!',
    rating: 5,
  },
  {
    id: 4,
    name: 'Alex Bayanza',
    role: 'Maintainer',
    location: 'Kigali, Rwanda',
    content: 'The biometric access system from SogAfrika has transformed our office security. Easy to manage and very reliable.',
    rating: 4,
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(c => (c + 1) % testimonials.length);

  return (
    <section className="page-section bg-white dark:bg-dark-900950/50">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Trusted by businesses and homeowners across East-Africa for premium security solutions
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8 md:p-10"
            >
              <Quote className="w-10 h-10 text-primary-500/30 mb-4" />
              <p className="text-lg text-dark-200 leading-relaxed mb-6">
                &ldquo;{testimonials[current].content}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-white font-semibold">{testimonials[current].name}</p>
                  <p className="text-dark-400 text-sm">{testimonials[current].role} &bull; {testimonials[current].location}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonials[current].rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-dark-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="p-2 rounded-full bg-white dark:bg-dark-900800 text-dark-400 hover:text-primary-400 hover:bg-white dark:bg-dark-900700 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === current ? 'w-6 bg-primary-500' : 'bg-white dark:bg-dark-900600'
                  }`}
                />
              ))}
            </div>
            <button onClick={next} className="p-2 rounded-full bg-white dark:bg-dark-900800 text-dark-400 hover:text-primary-400 hover:bg-white dark:bg-dark-900700 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
