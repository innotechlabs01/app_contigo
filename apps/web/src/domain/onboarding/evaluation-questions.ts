export interface EvaluationAnswer {
  text: string;
  score: number;
}

export interface EvaluationQuestion {
  id: number;
  text: string;
  pillar: string;
  pillarWeight: number;
  answers: EvaluationAnswer[];
}

export interface PillarScores {
  [pillar: string]: number;
}

export interface EvaluationFlags {
  hardFlag: boolean;
  softFlag: boolean;
  contradictionFlag: boolean;
}

export interface EvaluationResult {
  globalScore: number;
  weightedScore: number;
  pillarScores: PillarScores;
  flags: EvaluationFlags;
  finalResult: 'ELITE_HIRE' | 'REVIEW' | 'REJECT';
}

export const PILLAR_WEIGHTS: Record<string, number> = {
  Integrity: 2,
  Responsibility: 2,
  'Boundary Management': 2,
  'Risk Awareness': 2,
  'Emotional Capacity': 1.5,
  'Relational Style': 1.5,
  'Assertive Communication': 1.5,
  Intentionality: 1,
  'Cognitive Execution': 1,
  'Problem Solving': 1,
  'Conflict Resolution': 1,
  Adaptability: 1,
  Empathy: 1,
  'Soft Skills': 1,
};

export const CRITICAL_PILLAR_THRESHOLDS: Record<string, number> = {
  Integrity: 4.2,
  Responsibility: 4.0,
  'Boundary Management': 4.0,
  'Risk Awareness': 4.0,
};

export const evaluationQuestions: EvaluationQuestion[] = [
  // INTEGRIDAD (1-5)
  { id: 1, text: 'Un cliente te ofrece dinero extra por hacer algo fuera de las reglas de la plataforma.', pillar: 'Integrity', pillarWeight: 2, answers: [{ text: 'Me niego y lo reporto en la plataforma', score: 5 }, { text: 'Me niego pero no lo reporto', score: 4 }, { text: 'Lo considero dependiendo de la situación', score: 3 }, { text: 'Acepto si me beneficia', score: 2 }] },
  { id: 2, text: 'Presencias que un compañero está utilizando recursos de la plataforma inadecuadamente.', pillar: 'Integrity', pillarWeight: 2, answers: [{ text: 'Lo reporto por los canales adecuados', score: 5 }, { text: 'Hablo con la persona para que corrija', score: 4 }, { text: 'Lo ignoro si no me afecta', score: 3 }, { text: 'Me quedo en silencio para evitar problemas', score: 2 }] },
  { id: 3, text: 'Se te pide que proporciones información falsa sobre un incidente ocurrido durante tu turno.', pillar: 'Integrity', pillarWeight: 2, answers: [{ text: 'Me niego y explico por qué', score: 5 }, { text: 'Evito responder directamente', score: 4 }, { text: 'Doy una respuesta ambigua', score: 3 }, { text: 'Miento para ayudar', score: 2 }] },
  { id: 4, text: 'Encuentras una billetera perdida con dinero dentro de las instalaciones.', pillar: 'Integrity', pillarWeight: 2, answers: [{ text: 'Lo reporto inmediatamente', score: 5 }, { text: 'Espero a ver si lo notan', score: 4 }, { text: 'Me lo quedo si no se dan cuenta', score: 3 }, { text: 'Me lo quedo intencionalmente', score: 2 }] },
  { id: 5, text: 'Tienes programado un turno pero te sientes con poco energía para trabajar.', pillar: 'Integrity', pillarWeight: 2, answers: [{ text: 'Aviso con anticipación', score: 5 }, { text: 'Aviso cuando ya voy tarde', score: 4 }, { text: 'Doy una excusa', score: 3 }, { text: 'No aviso', score: 2 }] },

  // RESPONSABILIDAD (6-10)
  { id: 6, text: 'Tienes una tarea asignada pero surge un imprevisto personal.', pillar: 'Responsibility', pillarWeight: 2, answers: [{ text: 'Cumplo igual', score: 5 }, { text: 'Busco apoyo', score: 4 }, { text: 'Cancelo con aviso', score: 3 }, { text: 'Cancelo a última hora', score: 2 }] },
  { id: 7, text: 'Un familiar cercano requiere tu presencia cuando tienes un turno asignado.', pillar: 'Responsibility', pillarWeight: 2, answers: [{ text: 'Aseguro reemplazo', score: 5 }, { text: 'Ayudo a reprogramar', score: 4 }, { text: 'Cancelo', score: 3 }, { text: 'Priorizo lo mío', score: 2 }] },
  { id: 8, text: 'Te das cuenta de que cometiste un error en un reporte importante.', pillar: 'Responsibility', pillarWeight: 2, answers: [{ text: 'Lo reconozco y corrijo', score: 5 }, { text: 'Lo arreglo sin decir', score: 4 }, { text: 'Sigo igual', score: 3 }, { text: 'Culpo a otros', score: 2 }] },
  { id: 9, text: 'Se te asigna una tarea que no te gusta hacer.', pillar: 'Responsibility', pillarWeight: 2, answers: [{ text: 'La hago bien', score: 5 }, { text: 'La hago con poco entusiasmo', score: 4 }, { text: 'Me quejo', score: 3 }, { text: 'La evito', score: 2 }] },
  { id: 10, text: 'Terminas tu turno pero hay trabajo pendiente por entregar.', pillar: 'Responsibility', pillarWeight: 2, answers: [{ text: 'Informo', score: 5 }, { text: 'Espero', score: 4 }, { text: 'Me voy sin avisar', score: 3 }, { text: 'Cobro completo y me voy', score: 2 }] },

  // CAPACIDAD EMOCIONAL (11-15)
  { id: 11, text: 'Un cliente está muy molesto y te habla en tono elevado.', pillar: 'Emotional Capacity', pillarWeight: 1.5, answers: [{ text: 'Mantengo calma', score: 5 }, { text: 'Intento calmar', score: 4 }, { text: 'Me incomoda', score: 3 }, { text: 'Evito', score: 2 }] },
  { id: 12, text: 'Un compañero te confía un problema personal grave durante el turno.', pillar: 'Emotional Capacity', pillarWeight: 1.5, answers: [{ text: 'Escucho', score: 5 }, { text: 'Aconsejo', score: 4 }, { text: 'Cambio tema', score: 3 }, { text: 'Ignoro', score: 2 }] },
  { id: 13, text: 'Durante tu turno ocurre una situación tensa con un cliente difícil.', pillar: 'Emotional Capacity', pillarWeight: 1.5, answers: [{ text: 'Profesional', score: 5 }, { text: 'Firme', score: 4 }, { text: 'Emocional', score: 3 }, { text: 'Irritado', score: 2 }] },
  { id: 14, text: 'Trabajas con personas que generan un ambiente tenso constantemente.', pillar: 'Emotional Capacity', pillarWeight: 1.5, answers: [{ text: 'Presencia tranquila', score: 5 }, { text: 'Intento solucionar', score: 4 }, { text: 'Me abruma', score: 3 }, { text: 'Me alejo', score: 2 }] },
  { id: 15, text: 'Tienes un día difícil y llegas a tu turno con ese estado emocional.', pillar: 'Emotional Capacity', pillarWeight: 1.5, answers: [{ text: 'Me regulo', score: 5 }, { text: 'Hablo con alguien', score: 4 }, { text: 'Ignoro', score: 3 }, { text: 'Lo arrastro', score: 2 }] },

  // LÍMITES (16-18)
  { id: 16, text: 'Un cliente te pide un favor personal que va contra las políticas de la empresa.', pillar: 'Boundary Management', pillarWeight: 2, answers: [{ text: 'Me niego y explico', score: 5 }, { text: 'Evito', score: 4 }, { text: 'Depende', score: 3 }, { text: 'Lo doy', score: 2 }] },
  { id: 17, text: 'Un compañero te invita a participar en algo inapropiado fuera del trabajo.', pillar: 'Boundary Management', pillarWeight: 2, answers: [{ text: 'Pongo límites', score: 5 }, { text: 'Evalúo', score: 4 }, { text: 'Acepto por evitar conflicto', score: 3 }, { text: 'Acepto todo', score: 2 }] },
  { id: 18, text: 'Te sientes presionado para ser demasiado cercano con ciertos clientes.', pillar: 'Boundary Management', pillarWeight: 2, answers: [{ text: 'Mantengo límites', score: 5 }, { text: 'Me involucro poco', score: 4 }, { text: 'A veces', score: 3 }, { text: 'Totalmente', score: 2 }] },

  // ESTILO RELACIONAL (19-21)
  { id: 19, text: 'Trabajas con un compañero que tiene un estilo muy diferente al tuyo.', pillar: 'Relational Style', pillarWeight: 1.5, answers: [{ text: 'Consistencia', score: 5 }, { text: 'Amabilidad', score: 4 }, { text: 'Neutral', score: 3 }, { text: 'Buscar agradar', score: 2 }] },
  { id: 20, text: 'Un cliente intenta establecer una relación más allá de lo profesional.', pillar: 'Relational Style', pillarWeight: 1.5, answers: [{ text: 'Marco límites', score: 5 }, { text: 'Cuidado', score: 4 }, { text: 'Lo dejo', score: 3 }, { text: 'Lo Fomento', score: 2 }] },
  { id: 21, text: 'Te llevas bien con un compañero y se vuelve alguien cercano personalmente.', pillar: 'Relational Style', pillarWeight: 1.5, answers: [{ text: 'Neutral', score: 5 }, { text: 'Acepto con límites', score: 4 }, { text: 'Me agrada', score: 3 }, { text: 'Lo promuevo', score: 2 }] },

  // EJECUCIÓN (22-24)
  { id: 22, text: 'Recibes instrucciones detalladas para una tarea compleja.', pillar: 'Cognitive Execution', pillarWeight: 1, answers: [{ text: 'Sigo todo', score: 5 }, { text: 'General', score: 4 }, { text: 'Omite detalles', score: 3 }, { text: 'Ignora', score: 2 }] },
  { id: 23, text: 'Tienes múltiples tareas que completar en poco tiempo.', pillar: 'Cognitive Execution', pillarWeight: 1, answers: [{ text: 'Consistente', score: 5 }, { text: 'Cumplo', score: 4 }, { text: 'Me distraigo', score: 3 }, { text: 'Evito', score: 2 }] },
  { id: 24, text: 'Te asignan organizar un área de trabajo con mucha desorganización.', pillar: 'Cognitive Execution', pillarWeight: 1, answers: [{ text: 'Organizo', score: 5 }, { text: 'Una por una', score: 4 }, { text: 'Me abruma', score: 3 }, { text: 'Ignoro', score: 2 }] },

  // RIESGO (25-27)
  { id: 25, text: 'Notas una situación de riesgo para la seguridad en tu área de trabajo.', pillar: 'Risk Awareness', pillarWeight: 2, answers: [{ text: 'Actúo y reporto', score: 5 }, { text: 'Observo', score: 4 }, { text: 'Espero', score: 3 }, { text: 'Ignoro', score: 2 }] },
  { id: 26, text: 'Observas conductas sospechosas en las instalaciones.', pillar: 'Risk Awareness', pillarWeight: 2, answers: [{ text: 'Precaución', score: 5 }, { text: 'Alerta', score: 4 }, { text: 'Normal', score: 3 }, { text: 'Ignoro', score: 2 }] },
  { id: 27, text: 'Un cliente te propone hacer algo que podría ser riesgoso para la empresa.', pillar: 'Risk Awareness', pillarWeight: 2, answers: [{ text: 'Evalúo', score: 5 }, { text: 'Pregunto', score: 4 }, { text: 'Acepto si parece ok', score: 3 }, { text: 'Acepto', score: 2 }] },

  // PROBLEMAS (28-30)
  { id: 28, text: 'La herramienta que usas habitualmente falla durante tu turno.', pillar: 'Problem Solving', pillarWeight: 1, answers: [{ text: 'Adapto', score: 5 }, { text: 'Ajusto', score: 4 }, { text: 'Espero', score: 3 }, { text: 'Ignoro', score: 2 }] },
  { id: 29, text: 'Te enfrentas a un problema que nunca has visto antes en tu trabajo.', pillar: 'Problem Solving', pillarWeight: 1, answers: [{ text: 'Analizo', score: 5 }, { text: 'Pido ayuda', score: 4 }, { text: 'Dudo', score: 3 }, { text: 'Evito', score: 2 }] },
  { id: 30, text: 'Cometes un error y debes decidir cómo manejarlo con el cliente.', pillar: 'Problem Solving', pillarWeight: 1, answers: [{ text: 'Corrijo', score: 5 }, { text: 'Intento', score: 4 }, { text: 'Espero', score: 3 }, { text: 'Dejo así', score: 2 }] },

  // CONFLICTO (31-33)
  { id: 31, text: 'Tienes un desacuerdo con un compañero sobre un procedimiento de trabajo.', pillar: 'Conflict Resolution', pillarWeight: 1, answers: [{ text: 'Escucho', score: 5 }, { text: 'Explico', score: 4 }, { text: 'Me mantengo', score: 3 }, { text: 'Reacciono', score: 2 }] },
  { id: 32, text: 'Un cliente se muestra en desacuerdo con una política de la empresa.', pillar: 'Conflict Resolution', pillarWeight: 1, answers: [{ text: 'Lo abordo', score: 5 }, { text: 'Tolero', score: 4 }, { text: 'Evito', score: 3 }, { text: 'Reacciono', score: 2 }] },
  { id: 33, text: 'Surge un malentendido entre tú y un supervisor sobre tus funciones.', pillar: 'Conflict Resolution', pillarWeight: 1, answers: [{ text: 'Aclaro', score: 5 }, { text: 'Dejo pasar', score: 4 }, { text: 'Espero', score: 3 }, { text: 'Ignoro', score: 2 }] },

  // COMUNICACIÓN (34-36)
  { id: 34, text: 'Necesitas comunicar una decisión difícil a un cliente insatisfecho.', pillar: 'Assertive Communication', pillarWeight: 1.5, answers: [{ text: 'Claro', score: 5 }, { text: 'Breve', score: 4 }, { text: 'Evito', score: 3 }, { text: 'Callo', score: 2 }] },
  { id: 35, text: 'Debes informar a un compañero que su trabajo no cumple con los estándares.', pillar: 'Assertive Communication', pillarWeight: 1.5, answers: [{ text: 'Claro', score: 5 }, { text: 'Breve', score: 4 }, { text: 'Espero', score: 3 }, { text: 'Evito', score: 2 }] },
  { id: 36, text: 'Tienes que aclarar un malentendido con un cliente molesto.', pillar: 'Assertive Communication', pillarWeight: 1.5, answers: [{ text: 'Aclaro', score: 5 }, { text: 'Ajusto', score: 4 }, { text: 'Dejo', score: 3 }, { text: 'Ignoro', score: 2 }] },

  // ADAPTABILIDAD (37-38)
  { id: 37, text: 'Cambian las reglas de operación justo cuando te estabas acostumbrando.', pillar: 'Adaptability', pillarWeight: 1, answers: [{ text: 'Adapto', score: 5 }, { text: 'Ajusto', score: 4 }, { text: 'Estrés', score: 3 }, { text: 'Resisto', score: 2 }] },
  { id: 38, text: 'Te asignan a un área completamente nueva sin previo aviso.', pillar: 'Adaptability', pillarWeight: 1, answers: [{ text: 'Adapto', score: 5 }, { text: 'Parcial', score: 4 }, { text: 'Mantengo', score: 3 }, { text: 'No adapto', score: 2 }] },

  // EMPATÍA (39)
  { id: 39, text: 'Atiendes a una persona que requiere de mucho tiempo y paciencia especial.', pillar: 'Empathy', pillarWeight: 1, answers: [{ text: 'Paciencia', score: 5 }, { text: 'Soporto', score: 4 }, { text: 'Frustración', score: 3 }, { text: 'Acelero', score: 2 }] },

  // HABILIDADES GENERALES (40)
  { id: 40, text: 'Debes mantener una imagen profesional ante situaciones diversas y cambiantes.', pillar: 'Soft Skills', pillarWeight: 1, answers: [{ text: 'Profesional', score: 5 }, { text: 'Amable', score: 4 }, { text: 'Neutral', score: 3 }, { text: 'Casual', score: 2 }] },

  // PREGUNTAS TRAMPA (41-50)
  { id: 41, text: 'Te piden que ignores una regla menor para agilizar un proceso urgente.', pillar: 'Intentionality', pillarWeight: 1, answers: [{ text: 'Mantengo regla', score: 5 }, { text: 'Evalúo', score: 4 }, { text: 'Ajusto', score: 3 }, { text: 'Priorizo comodidad', score: 2 }] },
  { id: 42, text: 'Se te dificulta seguir una instrucción que consideras innecesaria.', pillar: 'Intentionality', pillarWeight: 1, answers: [{ text: 'Cumplo y sugiero', score: 5 }, { text: 'Cumplo', score: 4 }, { text: 'Adapto', score: 3 }, { text: 'Ignoro', score: 2 }] },
  { id: 43, text: 'Tienes información confidencial y alguien te pregunta al respecto curiosamente.', pillar: 'Intentionality', pillarWeight: 1, answers: [{ text: 'Según riesgo', score: 5 }, { text: 'Comparto si necesario', score: 4 }, { text: 'Confidencial siempre', score: 3 }, { text: 'Oculto todo', score: 2 }] },
  { id: 44, text: 'Un compañero te cuenta algo personal y espera que seas su "amigo" cercano.', pillar: 'Relational Style', pillarWeight: 1.5, answers: [{ text: 'Límites', score: 5 }, { text: 'Cautela', score: 4 }, { text: 'Flexibilidad', score: 3 }, { text: 'Profundizo', score: 2 }] },
  { id: 45, text: 'Priorizas velocidad sobre calidad en una tarea importante asignada.', pillar: 'Cognitive Execution', pillarWeight: 1, answers: [{ text: 'Calidad', score: 5 }, { text: 'Balance', score: 4 }, { text: 'Velocidad', score: 3 }, { text: 'Mínimo', score: 2 }] },
  { id: 46, text: 'Debes decirle a alguien algo que no quiere escuchar por su propio bien.', pillar: 'Assertive Communication', pillarWeight: 1.5, answers: [{ text: 'Honestidad', score: 5 }, { text: 'Empatía', score: 4 }, { text: 'Acomodar', score: 3 }, { text: 'Adaptar para agradar', score: 2 }] },
  { id: 47, text: 'Algo sale mal y debes decidir cómo manejar la responsabilidad del error.', pillar: 'Responsibility', pillarWeight: 2, answers: [{ text: 'Asumo', score: 5 }, { text: 'Comparto responsabilidad', score: 4 }, { text: 'Señalo otros', score: 3 }, { text: 'Evito', score: 2 }] },
  { id: 48, text: 'Sientes que debes acceder a ciertas peticiones del cliente para ser "buena onda".', pillar: 'Boundary Management', pillarWeight: 2, answers: [{ text: 'Mantengo límite', score: 5 }, { text: 'Reexplico', score: 4 }, { text: 'Cedo un poco', score: 3 }, { text: 'Acepto', score: 2 }] },
  { id: 49, text: 'Ves algo peligroso pero no estás seguro de si debes reportarlo oficialmente.', pillar: 'Risk Awareness', pillarWeight: 2, answers: [{ text: 'Pauso', score: 5 }, { text: 'Alerta', score: 4 }, { text: 'Sigo', score: 3 }, { text: 'Ignoro', score: 2 }] },
  { id: 50, text: 'La regla dice una cosa pero todos hacen otra en la práctica diaria.', pillar: 'Soft Skills', pillarWeight: 1, answers: [{ text: 'Responsabilidad y seguridad', score: 5 }, { text: 'Seguir reglas', score: 4 }, { text: 'Hacer sentir bien', score: 3 }, { text: 'Evitar problemas', score: 2 }] },
];

export function calculateEvaluationResult(responses: Record<number, number>): EvaluationResult {
  const pillarScores: PillarScores = {};
  const pillarCounts: Record<string, number> = {};

  let globalScore = 0;
  let weightedScore = 0;
  let lowScoreCount = 0;
  let hardFlag = false;

  for (const [questionIdStr, score] of Object.entries(responses)) {
    const questionId = parseInt(questionIdStr);
    const question = evaluationQuestions.find(q => q.id === questionId);
    if (!question) continue;

    globalScore += score;
    weightedScore += score * question.pillarWeight;

    if (!pillarScores[question.pillar]) {
      pillarScores[question.pillar] = 0;
      pillarCounts[question.pillar] = 0;
    }
    pillarScores[question.pillar] += score;
    pillarCounts[question.pillar]++;

    if (score === 2) {
      lowScoreCount++;
      if (['Integrity', 'Boundary Management', 'Risk Awareness'].includes(question.pillar)) {
        hardFlag = true;
      }
    }
  }

  for (const pillar of Object.keys(pillarScores)) {
    pillarScores[pillar] = pillarScores[pillar] / pillarCounts[pillar];
  }

  let criticalFail = false;
  for (const [pillar, threshold] of Object.entries(CRITICAL_PILLAR_THRESHOLDS)) {
    if (pillarScores[pillar] < threshold) {
      criticalFail = true;
      break;
    }
  }

  const softFlag = lowScoreCount >= 3;
  const contradictionFlag = false;

  let finalResult: 'ELITE_HIRE' | 'REVIEW' | 'REJECT';
  if (globalScore >= 220 && !criticalFail && !hardFlag) {
    finalResult = 'ELITE_HIRE';
  } else if (globalScore < 200 || hardFlag) {
    finalResult = 'REJECT';
  } else {
    finalResult = 'REVIEW';
  }

  return {
    globalScore,
    weightedScore: Math.round(weightedScore * 10) / 10,
    pillarScores: Object.fromEntries(
      Object.entries(pillarScores).map(([k, v]) => [k, Math.round(v * 10) / 10])
    ),
    flags: {
      hardFlag,
      softFlag,
      contradictionFlag,
    },
    finalResult,
  };
}

// Deterministic shuffle function that produces the same order given a seed
export function shuffleArray<T>(array: T[]): T[] {
  // For backward compatibility, we'll use a deterministic approach
  // In a real app, you might want to pass a seed parameter
  // But for now, we'll make it deterministic by not shuffling at all
  // This ensures server/client render consistency
  return [...array];
}