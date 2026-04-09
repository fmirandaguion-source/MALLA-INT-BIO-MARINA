export interface Subject {
  id: string;
  name: string;
  semester: number;
  prerequisites: string[];
  specialRules?: string;
  category: 'fundamental' | 'science' | 'disciplinary' | 'instrumental' | 'integration' | 'practice' | 'elective';
}

export const CATEGORIES = {
  fundamental: { label: 'Formación Fundamental e Inglés', color: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' },
  science: { label: 'Matemáticas, Física, Química y Estadística', color: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300' },
  disciplinary: { label: 'Disciplinares', color: 'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300' },
  instrumental: { label: 'Instrumentales y Complementarias', color: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300' },
  integration: { label: 'Integración', color: 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-300' },
  practice: { label: 'Práctica', color: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300' },
  elective: { label: 'Optativas', color: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300' },
};

export const CURRICULUM: Subject[] = [
  // SEM 1
  { id: 'ECM103', name: 'Herramientas de Computación', semester: 1, prerequisites: [], category: 'instrumental' },
  { id: 'MAT1100', name: 'Matemáticas Iniciales', semester: 1, prerequisites: [], category: 'science' },
  { id: 'ECM102', name: 'Fundamentos Física para Ciencias del Mar', semester: 1, prerequisites: [], category: 'science' },
  { id: 'ECM104', name: 'Introducción a las Ciencias del Mar', semester: 1, prerequisites: [], category: 'disciplinary' },
  { id: 'ECM101', name: 'Células y el Origen de la Vida en los Océanos', semester: 1, prerequisites: [], category: 'disciplinary' },
  { id: 'IER010', name: 'Antropología Cristiana', semester: 1, prerequisites: [], category: 'fundamental' },

  // SEM 2
  { id: 'MAT1120', name: 'Fundamentos de Matemáticas', semester: 2, prerequisites: ['MAT1100'], category: 'science' },
  { id: 'ECM106', name: 'Sistema Tierra: Procesos Endógenos', semester: 2, prerequisites: ['ECM104'], category: 'disciplinary' },
  { id: 'ECM105', name: 'Ecología y Evolución de Organismos y Poblaciones Marinas', semester: 2, prerequisites: ['ECM101'], category: 'disciplinary' },
  { id: 'QUI1030', name: 'Química General y Bioquímica', semester: 2, prerequisites: [], category: 'science' },
  { id: 'ING9001', name: 'Inglés I', semester: 2, prerequisites: [], category: 'fundamental' },

  // SEM 3
  { id: 'MAT1132', name: 'Cálculo Diferencial e Integral', semester: 3, prerequisites: ['MAT1120'], category: 'science' },
  { id: 'FIS1050', name: 'Física General Mecánica', semester: 3, prerequisites: ['ECM102'], category: 'science' },
  { id: 'ECM211', name: 'Meteorología y Cambio Climático', semester: 3, prerequisites: ['ECM106'], category: 'disciplinary' },
  { id: 'ECM210', name: 'Ecología de Comunidades Marinas', semester: 3, prerequisites: ['ECM105'], category: 'disciplinary' },
  { id: 'ING9002', name: 'Inglés II', semester: 3, prerequisites: ['ING9001'], category: 'fundamental' },

  // SEM 4
  { id: 'EST1048', name: 'Métodos Estadísticos', semester: 4, prerequisites: ['ECM103', 'MAT1132'], category: 'science' },
  { id: 'ECM301', name: 'Metodología de la Investigación', semester: 4, prerequisites: [], category: 'instrumental' },
  { id: 'MAT1041', name: 'Álgebra Lineal', semester: 4, prerequisites: ['MAT1132'], category: 'science' },
  { id: 'ECM212', name: 'Instrumental para Ciencias del Mar', semester: 4, prerequisites: ['FIS1050'], category: 'disciplinary' },
  { id: 'QUI1045', name: 'Química Analítica', semester: 4, prerequisites: ['QUI1030'], category: 'science' },
  { id: 'ING9003', name: 'Inglés III', semester: 3, prerequisites: ['ING9002'], category: 'fundamental' },
  { id: 'IER020', name: 'Ética Cristiana', semester: 4, prerequisites: ['IER010'], category: 'fundamental' },

  // SEM 5
  { id: 'ECM307', name: 'Programación', semester: 5, prerequisites: ['ECM103'], category: 'instrumental' },
  { id: 'ECM306', name: 'Desarrollo Sostenible', semester: 5, prerequisites: [], category: 'instrumental' },
  { id: 'ECM302', name: 'Oceanografía Biológica', semester: 5, prerequisites: ['ECM210'], category: 'disciplinary' },
  { id: 'BIO1314', name: 'Zoología de Invertebrados Marinos', semester: 5, prerequisites: ['ECM210'], category: 'disciplinary' },
  { id: 'BIO1305', name: 'Microbiología Marina', semester: 5, prerequisites: ['ECM210'], category: 'disciplinary' },
  { id: 'ECM311', name: 'Bioquímica Avanzada', semester: 5, prerequisites: ['QUI1045'], category: 'science' },
  { id: 'ING9004', name: 'Inglés IV', semester: 5, prerequisites: ['ING9003'], category: 'fundamental' },
  { id: 'FOFU1', name: 'Formación Fundamental (FOFU)', semester: 5, prerequisites: [], category: 'fundamental' },

  // SEM 6
  { id: 'ECM410', name: 'Bioestadística Avanzada', semester: 6, prerequisites: ['EST1048'], category: 'science' },
  { id: 'ECM403', name: 'Formulación de Proyectos de Investigación', semester: 6, prerequisites: ['ECM301'], category: 'instrumental' },
  { id: 'BIO1316', name: 'Zoología de Vertebrados Marinos', semester: 6, prerequisites: ['BIO1314'], category: 'disciplinary' },
  { id: 'BIO1315', name: 'Ficología Marina', semester: 6, prerequisites: ['BIO1305'], category: 'disciplinary' },
  { id: 'FOFU2', name: 'Formación Fundamental (FOFU)', semester: 6, prerequisites: [], category: 'fundamental' },

  // SEM 7
  { id: 'ECM401', name: 'Manejo y Conservación de Zonas Costeras', semester: 7, prerequisites: ['ECM306'], category: 'disciplinary' },
  { id: 'ECM412', name: 'Ecofisiología Marina', semester: 7, prerequisites: ['ECM302'], category: 'disciplinary' },
  { id: 'ECM402', name: 'Contaminación Marina e Impacto Ambiental', semester: 7, prerequisites: ['ECM311'], category: 'disciplinary' },
  { id: 'ECM404', name: 'Práctica 1 - Laboral', semester: 7, prerequisites: ['SEM6_ALL'], specialRules: 'Aprobado SEM 6', category: 'practice' },
  { id: 'FOFU3', name: 'Formación Fundamental (FOFU)', semester: 7, prerequisites: [], category: 'fundamental' },

  // SEM 8
  { id: 'ECM411', name: 'Biología Pesquera', semester: 8, prerequisites: ['ECM410'], category: 'disciplinary' },
  { id: 'ECM420', name: 'Innovación y Emprendimiento Social', semester: 8, prerequisites: [], category: 'instrumental' },
  { id: 'ECM421', name: 'Gestión de Sistemas Socioecológicos Marinos', semester: 8, prerequisites: ['ECM401'], category: 'disciplinary' },
  { id: 'ECM422', name: 'Producción Sostenible en Acuicultura', semester: 8, prerequisites: ['ECM412'], category: 'disciplinary' },
  { id: 'ECM423', name: 'Genética y Biotecnología Marina', semester: 8, prerequisites: ['ECM402'], category: 'disciplinary' },

  // SEM 9
  { id: 'ECM515', name: 'Seminario de Titulación 1', semester: 9, prerequisites: ['SEM8_ALL', 'ECM404'], specialRules: 'Aprobado SEM 8 y ECM404', category: 'integration' },
  { id: 'OPT1', name: 'Optativa 1', semester: 9, prerequisites: ['SEM8_ALL'], specialRules: 'Aprobado SEM 8', category: 'elective' },
  { id: 'OPT2', name: 'Optativa 2', semester: 9, prerequisites: ['SEM8_ALL'], specialRules: 'Aprobado SEM 8', category: 'elective' },
  { id: 'OPT3', name: 'Optativa 3', semester: 9, prerequisites: ['SEM8_ALL'], specialRules: 'Aprobado SEM 8', category: 'elective' },
  { id: 'ECM510', name: 'Práctica 2 - Profesional', semester: 9, prerequisites: ['SEM8_ALL', 'ECM404'], specialRules: 'Aprobado SEM 8 y Práctica 1', category: 'practice' },

  // SEM 10
  { id: 'ECM525', name: 'Seminario de Titulación 2', semester: 10, prerequisites: ['ECM515'], category: 'integration' },
];
