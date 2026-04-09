/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRICULUM, CATEGORIES, Subject } from './data/curriculum';
import { Info, BookOpen, CheckCircle2, ArrowRight, GraduationCap, Moon, Sun, Layers, Download, FileText } from 'lucide-react';

export default function App() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode by default
  const [activeTab, setActiveTab] = useState<'details' | 'legend'>('details');

  const activeId = hoveredId || selectedId;

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
    if (!activeId) return [];
    return getAllPrerequisites(activeId);
  }, [activeId]);

  const currentDirectPrereqs = useMemo(() => {
    if (!activeId) return [];
    return getDirectPrerequisites(activeId);
  }, [activeId]);

  const currentUnlockables = useMemo(() => {
    if (!activeId) return [];
    return getUnlockables(activeId);
  }, [activeId]);

  const displaySubject = useMemo(() => {
    return CURRICULUM.find(s => s.id === activeId);
  }, [activeId]);

  const downloadSubjectDetail = () => {
    if (!displaySubject) return;

    const prereqs = currentAllPrereqs.map(pid => {
      const s = CURRICULUM.find(x => x.id === pid);
      return `- [${pid}] ${s?.name || pid}${currentDirectPrereqs.includes(pid) ? ' (Directo)' : ''}`;
    }).join('\n');

    const unlockables = currentUnlockables.map(uid => {
      const s = CURRICULUM.find(x => x.id === uid);
      return `- [${uid}] ${s?.name || uid}`;
    }).join('\n');

    const content = `
FICHA TÉCNICA DE ASIGNATURA
---------------------------
CÓDIGO: ${displaySubject.id}
NOMBRE: ${displaySubject.name}
SEMESTRE: ${displaySubject.semester}
CATEGORÍA: ${CATEGORIES[displaySubject.category].label}

CADENA DE REQUISITOS:
${prereqs || 'Sin requisitos previos'}

HABILITA A:
${unlockables || 'No habilita asignaturas directas'}

REGLAS ESPECIALES:
${displaySubject.specialRules || 'Ninguna'}

---------------------------
Generado por: Sistema de Gestión Curricular Biología Marina 2024
Fecha: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Detalle_${displaySubject.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans p-2 md:p-4 transition-colors duration-500 selection:bg-blue-500/30 flex flex-col overflow-hidden`}>
      <div className="max-w-full mx-auto w-full flex flex-col h-full">
        <header className="mb-4 flex flex-col items-center relative shrink-0">
          <div className="absolute right-0 top-0 z-50">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95 flex items-center gap-2 group"
              aria-label="Toggle Dark Mode"
            >
              <div className="relative w-4 h-4">
                <Sun className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} size={16} />
                <Moon className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} size={16} />
              </div>
              <span className="text-[10px] font-black hidden sm:inline uppercase tracking-widest">{isDarkMode ? 'Claro' : 'Oscuro'}</span>
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-blue-500/20"
          >
            <GraduationCap size={14} />
            Plan de Estudios Biología Marina 2024
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-1 text-center">
            Malla <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Interactiva</span> Biología Marina
          </h1>
          <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Escuela de Ciencias del Mar PUCV</p>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex gap-1 h-full justify-between">
            {semesters.map(([semester, subjects]) => (
              <div key={semester} className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="text-center py-1.5 border-b-2 border-slate-200 dark:border-slate-800 shrink-0">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest">S{semester}</span>
                </div>
                <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar pb-2">
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
                        onClick={() => {
                          setSelectedId(selectedId === subject.id ? null : subject.id);
                          setActiveTab('details');
                        }}
                        layoutId={subject.id}
                        className={`
                          relative p-2.5 rounded-xl border transition-all duration-300 cursor-pointer min-h-[85px] flex flex-col justify-between
                          ${isHovered || selectedId === subject.id ? 'z-30 shadow-lg border-blue-500 bg-white dark:bg-slate-800 ring-2 ring-blue-500/20' : 'bg-white dark:bg-slate-900/40 dark:backdrop-blur-md shadow-sm border-slate-100 dark:border-slate-800/50'}
                          ${isPrereq ? 'border-amber-500/50 bg-amber-100 dark:bg-amber-950/90 z-10 ring-2 ring-amber-500/10' : ''}
                          ${isDirectPrereq ? 'border-amber-500 dark:border-amber-400 bg-amber-200 dark:bg-amber-900/80 shadow-md z-20 ring-4 ring-amber-500/20' : ''}
                          ${isUnlockable ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/90 z-10 ring-2 ring-emerald-500/10' : ''}
                          ${!isHovered && selectedId !== subject.id && !isPrereq && !isUnlockable && activeId ? 'opacity-20 grayscale' : 'opacity-100'}
                          ${selectedId === subject.id ? 'ring-2 ring-blue-500' : ''}
                        `}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                              {subject.id}
                            </span>
                            {isPrereq && (
                              <div className={`px-1.5 py-0.5 rounded-[3px] text-[7px] font-black uppercase tracking-tighter ${isDirectPrereq ? 'bg-amber-600 text-white' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'}`}>
                                {isDirectPrereq ? 'Requerida' : 'Previa'}
                              </div>
                            )}
                            {isUnlockable && (
                              <div className="px-1.5 py-0.5 rounded-[3px] text-[7px] font-black uppercase tracking-tighter bg-emerald-600 text-white">
                                Habilita
                              </div>
                            )}
                          </div>
                          <h3 className="text-[11px] font-bold leading-tight text-slate-800 dark:text-slate-100 line-clamp-2">
                            {subject.name}
                          </h3>
                        </div>
                        
                        <div className={`mt-1.5 px-1.5 py-0.5 rounded-[3px] text-[8px] font-black inline-block w-fit ${category.color}`}>
                          {category.label.split(' ')[0]}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Legend & Info Panel Tabs */}
        <div className="mt-2 shrink-0">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'details' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'}`}
            >
              <BookOpen size={16} />
              Detalles
            </button>
            <button
              onClick={() => setActiveTab('legend')}
              className={`px-6 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'legend' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'}`}
            >
              <Layers size={16} />
              Leyenda
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'details' ? (
              <motion.section
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 h-40 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-black flex items-center gap-2 dark:text-white uppercase tracking-widest">
                    <BookOpen className="text-blue-600 dark:text-blue-400" size={18} />
                    Análisis {selectedId && <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded ml-2">Seleccionado</span>}
                  </h2>
                  {displaySubject && (
                    <button
                      onClick={downloadSubjectDetail}
                      className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
                    >
                      <Download size={14} />
                      Descargar Ficha
                    </button>
                  )}
                </div>
                
                {displaySubject ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border-l-4 border-blue-600 dark:border-blue-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-black dark:text-slate-300">{displaySubject.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${CATEGORIES[displaySubject.category].color}`}>
                          {CATEGORIES[displaySubject.category].label}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{displaySubject.name}</h3>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-amber-500" />
                        Requisitos
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {currentAllPrereqs.length > 0 ? (
                          currentAllPrereqs.map(pid => {
                            const p = CURRICULUM.find(s => s.id === pid);
                            const isDirect = currentDirectPrereqs.includes(pid);
                            return (
                              <div key={pid} className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${isDirect ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50' : 'bg-slate-50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/30'}`}>
                                {p?.name || pid}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-slate-400 text-[11px] italic">Sin requisitos.</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <ArrowRight size={14} className="text-emerald-500" />
                        Habilita
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {currentUnlockables.length > 0 ? (
                          currentUnlockables.map(uid => {
                            const u = CURRICULUM.find(s => s.id === uid);
                            return (
                              <div key={uid} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-md text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/50">
                                {u?.name}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-slate-400 text-[11px] italic">No habilita directas.</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-700 border-2 border-dashed border-slate-50 dark:border-slate-900 rounded-2xl">
                    <p className="font-bold text-xs">Selecciona una asignatura para analizar</p>
                  </div>
                )}
              </motion.section>
            ) : (
              <motion.section
                key="legend"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-950 p-4 rounded-3xl shadow-xl text-white border border-slate-800 h-40 overflow-y-auto"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <div key={key} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                      <div className={`w-4 h-4 rounded shadow-lg ${cat.color.split(' ')[0]}`} />
                      <span className="text-[10px] font-bold text-slate-400">{cat.label}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-2 text-center text-slate-400 dark:text-slate-600 text-[8px] pb-2 shrink-0">
          <p>© 2026 Universidad de Biología Marina</p>
        </footer>
      </div>
    </div>
  );
}
