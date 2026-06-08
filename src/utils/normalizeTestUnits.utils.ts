import type { SkillContentPreview } from '@/data/practices/skillContent.model';
import type { ListeningQuestionBlock } from '@/data/practices/listening.model';
import type { ReadingQuestionBlock } from '@/data/practices/reading.model';
import type { PracticeTestDTO } from '@/data/practices/practice.types';

export interface TestUnit {
  id: number;
  title: string;
  description: string;
  questionBlocks: ReadingQuestionBlock[] | ListeningQuestionBlock[];
  type: 'reading' | 'listening' | 'writing' | 'speaking';
  audioUrl?: string;
  imgUrl?: string;
  timeSuggestedMinutes?: number;
}

export function normalizeTestUnits(test: SkillContentPreview | PracticeTestDTO): TestUnit[] {
  const content = test.content as any;

  // Reading
  if (content?.passages) {
    return content.passages.map((p: any): TestUnit => ({
      ...p,
      id: p.passage_number,
      title: `${p.title || 'Reading'} — Passage ${p.passage_number}`,
      description: p.topic,                    // topic is more meaningful than repeating title
      questionBlocks: p.question_blocks,
      type: 'reading',
      timeSuggestedMinutes: p.time_suggested_minutes,
    }));
  }

  // Listening
  if (content?.sections) {
    return content.sections.map((s: any): TestUnit => ({
      ...s,
      id: s.section,
      title: `${formatContext(s.context || 'Listening')} — Section ${s.section}`,
      description: s.description,
      questionBlocks: s.question_blocks,
      type: 'listening',
      audioUrl: s.audioUrl,
      imgUrl: s.imgUrl,
    }));
  }

  // Writing
  if (content?.task) {
    return [{
      ...content,
      id: content.task,
      title: `Writing Task ${content.task}`,
      description: content.prompt || '',
      questionBlocks: [],
      type: 'writing',
      timeSuggestedMinutes: content.time_minutes,
    }];
  }

  // Speaking (Array of parts)
  if (content?.parts && Array.isArray(content.parts)) {
     const units: TestUnit[] = [];

     content.parts.forEach((p: any) => {
       // Part 1: Topics array
       if (p.topics && Array.isArray(p.topics)) {
         const allQuestions = p.topics.flatMap((t: any) => t.questions || []);
         const topicsList = p.topics.map((t: any) => t.topic).join(' / ');
         units.push({
           ...p,
           id: p.part,
           title: `Speaking Part ${p.part}: ${topicsList}`,
           description: `Part ${p.part} — ${topicsList}`,
           questionBlocks: [],
           type: 'speaking',
           timeSuggestedMinutes: p.time_minutes || 5,
           topic: topicsList,
           candidate_prompts: allQuestions.map((q: any) => q.question) || [],
           questions: allQuestions,
           questionId: allQuestions[0]?.id || `p${p.part}_topic`,
         } as any);
       }
       // Part 2: Cue Card object
       else if (p.cue_card) {
         units.push({
           ...p,
           id: p.part,
           title: `Speaking Part ${p.part}: Long Turn`,
           description: `Part ${p.part} — Cue Card`,
           questionBlocks: [],
           type: 'speaking',
           timeSuggestedMinutes: p.time_minutes || 4,
           topic: p.label || "Long Turn",
           scenario: p.cue_card.instruction,
           candidate_prompts: p.cue_card.bullet_points || [],
           cue_card: p.cue_card,
           questions: p.followup_questions || [],
           questionId: p.cue_card.id || `p${p.part}_cuecard`,
         } as any);
       }
       // Part 3: Questions array directly
       else if (p.questions && Array.isArray(p.questions)) {
         units.push({
           ...p,
           id: p.part,
           title: `Speaking Part ${p.part}: ${p.topic || "Discussion"}`,
           description: `Part ${p.part} — Two-Way Discussion`,
           questionBlocks: [],
           type: 'speaking',
           timeSuggestedMinutes: p.time_minutes || 5,
           topic: p.topic || "Discussion",
           candidate_prompts: p.questions.map((q: any) => q.question) || [],
           questions: p.questions,
           questionId: p.questions?.[0]?.id || `p${p.part}_discussion`,
         } as any);
       }
     });

     return units;
   }

  // Speaking (Single fallback)
  if (content?.part) {
    return [{
      ...content,
      id: content.part,
      title: `Speaking Part ${content.part}`,
      description: content.topic || content.scenario || '',
      questionBlocks: [],
      type: 'speaking',
      timeSuggestedMinutes: content.time_minutes,
    }];
  }

  return [];
}

function formatContext(str: string): string {
  return str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}