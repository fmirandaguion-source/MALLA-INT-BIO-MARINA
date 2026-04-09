/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRICULUM, CATEGORIES, Subject } from './data/curriculum';
import { Info, BookOpen, CheckCircle2, ArrowRight, GraduationCap, Moon, Sun, Layers } from 'lucide-react';

export default function App() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode by default

  useEffect(() => {
    // Apply to both html and body for maximum compatibility
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Group subjects by semester
  const semesters = useMemo(() => {
    const groups: { [key: number]: Subject[] } = {};
    CURRICULUM.forEach((s) => {
      if (!groups[s.semester]) groups[s.semester] = [];
      groups[s.semester].push(s);
    });
    return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));
  }, []);

  // Find direct prerequisites
  const getDirectPrerequisites = (subjectId: string): string[] => {
    const subject = CURRICULUM.find(s => s.id === subjectId);
    if (!subject) return [];
    
    let prereqs = [...subject.prerequisites];
    
    // Expand special rules if they are considered "direct" requirements
    if (prereqs.includes('SEM6_ALL')) {
      const sem6Subjects = CURRICULUM.filter(s => s.semester <= 6).map(s => s.id);
      prereqs = [...prereqs.filter(p => p !== 'SEM6_ALL'), ...sem6Subjects];
    }
    if (prereqs.includes('SEM8_ALL')) {
      const sem8Subjects = CURRICULUM.filter(s => s.semester <= 8).map(s => s.id);
      prereqs = [...prereqs.filter(p => p !== 'SEM8_ALL'), ...sem8Subjects];
    }
    
    return prereqs;
  };

  // Find all prerequisites recursively
  const getAllPrerequisites = (subjectId: string, visited = new Set<string>()): string[] => {
    if (visited.has(subjectId)) return [];
    visited.add(subjectId);

    const direct = getDirectPrerequisites(subjectId);
    let all = [...direct];

    direct.forEach(pid => {
      const inherited = getAllPrerequisites(pid, visited);
      all = [...all, ...inherited];
    });

    return Array.from(new Set(all));
  };

  // Find subjects that are unlocked by this subject
  const getUnlockables = (subjectId: string): string[] => {
    return CURRICULUM.filter(s => {
      const direct = getDirectPrerequisites(s.id);
      return direct.includes(subjectId);
    }).map(s => s.id);
  };

  const currentAllPrereqs = useMemo(() => {
    if (!hoveredId) return [];
    return getAllPrerequisites(hoveredId);
  }, [hoveredId]);

  const currentDirectPrereqs = useMemo(() => {
    if (!hoveredId) return [];
    return getDirectPrerequisites(hoveredId);
  }, [hoveredId]);

  const currentUnlockables = useMemo(() => {
    if (!hoveredId) return [];
    return getUnlockables(hoveredId);
  }, [hoveredId]);

  const hoveredSubject = useMemo(() => {
    return CURRICULUM.find(s => s.id === hoveredId);
  }, [hoveredId]);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans p-4 md:p-8 transition-colors duration-500 selection:bg-blue-500/30`}>
      <div className="max-w-[1700px] mx-auto">
        <header className="mb-16 flex flex-col items-center relative">
          <div className="absolute right-0 top-0 z-50">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95 flex items-center gap-2 group"
              aria-label="Toggle Dark Mode"
            >
              <div className="relative w-5 h-5">
                <Sun className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} size={20} />
                <Moon className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} size={20} />
              </div>
              <span className="text-xs font-black hidden sm:inline uppercase tracking-widest">{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-500/20"
          >
            <GraduationCap size={14} />
            Plan de Estudios Biología Marina 2024
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 text-center">
            Malla <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Interactiva</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg text-center font-medium leading-relaxed">
            Visualiza la cadena completa de requisitos y proyecta tu avance académico con precisión.
          </p>
        </header>

        <main className="overflow-x-auto pb-12 scrollbar-thin">
          <div className="flex gap-6 min-w-max px-4">
            {semesters.map(([semester, subjects]) => (
              <div key={semester} className="flex flex-col gap-6 w-60">
                <div className="text-center py-3 border-b-4 border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-black text-slate-400 dark:text-slate-700 uppercase tracking-[0.3em]">Semestre {semester}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {subjects.map((subject) => {
                    const isHovered = hoveredId === subject.id;
                    const isPrereq = currentAllPrereqs.includes(subject.id);
                    const isDirectPrereq = currentDirectPrereqs.includes(subject.id);
                    const isUnlockable = currentUnlockables.includes(subject.id);
                    const category = CATEGORIES[subject.category];

                    return (
                      <motion.div
                        key={subject.id}
                        onMouseEnter={() => setHoveredId(subject.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        layoutId={subject.id}
                        className={`
                          relative p-5 rounded-2xl border-2 transition-all duration-500 cursor-help h-40 flex flex-col justify-between
                          ${isHovered ? 'scale-110 z-30 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.4)] border-blue-500 bg-white dark:bg-slate-800 ring-8 ring-blue-500/10' : 'bg-white dark:bg-slate-900/40 dark:backdrop-blur-md shadow-sm border-slate-100 dark:border-slate-800/50'}
                          ${isPrereq ? 'border-amber-500/50 bg-amber-100 dark:bg-amber-950/90 ring-8 ring-amber-500/5 z-10' : ''}
                          ${isDirectPrereq ? 'border-amber-500 dark:border-amber-400 bg-amber-200 dark:bg-amber-900/80 shadow-[0_0_25px_rgba(245,158,11,0.3)] z-20' : ''}
                          ${isUnlockable ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/90 ring-8 ring-emerald-500/5 z-10' : ''}
                          ${!isHovered && !isPrereq && !isUnlockable && hoveredId ? 'opacity-10 grayscale blur-[2px]' : 'opacity-100'}
                        `}
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                              {subject.id}
                            </span>
                            {isPrereq && (
                              <motion.span 
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm uppercase tracking-tighter whitespace-nowrap ${isDirectPrereq ? 'bg-amber-600 text-white' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'}`}
                              >
                                {isDirectPrereq ? 'Debe estar cursada' : 'Requisito previo'}
                              </motion.span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold leading-tight text-slate-800 dark:text-slate-100 line-clamp-3">
                            {subject.name}
                          </h3>
                        </div>
                        
                        <div className={`mt-2 px-2 py-0.5 rounded text-[11px] font-bold inline-block w-fit ${category.color}`}>
                          {category.label}
                        </div>

                        {isHovered && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute -top-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg"
                          >
                            <Info size={14} />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Legend & Info Panel */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 dark:text-white">
              <BookOpen className="text-blue-600 dark:text-blue-400" />
              Detalles de la Asignatura
            </h2>
            
            <AnimatePresence mode="wait">
              {hoveredSubject ? (
                <motion.div
                  key={hoveredSubject.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono font-bold dark:text-slate-300">{hoveredSubject.id}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${CATEGORIES[hoveredSubject.category].color}`}>
                        {CATEGORIES[hoveredSubject.category].label}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">{hoveredSubject.name}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-amber-500" />
                        Cadena de Requisitos
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentAllPrereqs.length > 0 ? (
                          currentAllPrereqs.map(pid => {
                            const p = CURRICULUM.find(s => s.id === pid);
                            const isDirect = currentDirectPrereqs.includes(pid);
                            return (
                              <span key={pid} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isDirect ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                {p?.name || pid}
                                {isDirect && <span className="ml-1.5 text-[10px] opacity-60">(Directo)</span>}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 text-sm italic">Sin requisitos previos</span>
                        )}
                      </div>
                      {hoveredSubject.specialRules && (
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-300 text-xs font-medium">
                          <strong>Regla Especial:</strong> {hoveredSubject.specialRules}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <ArrowRight size={16} className="text-emerald-500" />
                        Habilita a
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentUnlockables.length > 0 ? (
                          currentUnlockables.map(uid => {
                            const u = CURRICULUM.find(s => s.id === uid);
                            return (
                              <span key={uid} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                                {u?.name}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 text-sm italic">No habilita asignaturas directas</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                  <Info size={32} className="mb-2 opacity-20" />
                  <p>Pasa el cursor sobre una asignatura para ver sus detalles</p>
                </div>
              )}
            </AnimatePresence>
          </section>

          <section className="bg-slate-900 dark:bg-slate-950 p-8 rounded-3xl shadow-xl text-white border border-slate-800">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <Layers size={20} className="text-blue-400" />
              Leyenda
            </h2>
            <div className="space-y-4">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded shadow-inner ${cat.color.split(' ')[0]}`} />
                  <span className="text-sm font-medium text-slate-300 dark:text-slate-400">{cat.label}</span>
                </div>
              ))}
              <hr className="border-slate-800 my-4" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20" />
                  <span className="text-sm font-medium text-slate-300 dark:text-slate-400">Prerrequisito Directo</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" />
                  <span className="text-sm font-medium text-slate-300 dark:text-slate-400">Habilita Asignaturas</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 dark:text-slate-600 text-sm pb-12">
          <p>© 2026 Universidad de Biología Marina - Sistema de Gestión Curricular</p>
        </footer>
      </div>
    </div>
  );
}
