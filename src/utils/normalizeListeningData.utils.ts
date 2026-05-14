import type { SkillContentPreview } from '@/data/practices/skillContent.model';
import type { ListeningQuestionBlock, MatchingBlock } from '@/data/practices/listening.model';

export function normalizeListeningData(data: SkillContentPreview): SkillContentPreview {
  const content = data.content as { sections: any[] };
  return {
    ...data,
    content: {
      ...content,
      sections: content.sections.map((section) => ({
        ...section,
        question_blocks: section.question_blocks.map(normalizeBlock),
      })),
    },
  };
}

function normalizeBlock(block: any): ListeningQuestionBlock {
  if (block.question_type === 'matching') {
    const [start, end] = (block.questions_range as string).split('-').map(Number);
    const questions: MatchingBlock['questions'] = Array.from(
      { length: end - start + 1 },
      (_, i) => ({
        id: `L-match-${start + i}`,
        number: start + i,
        text: '', // matching questions have no stem text — label comes from options
      })
    );
    return { ...block, questions } as MatchingBlock;
  }

  if (block.questions) {
    return {
      ...block,
      questions: block.questions.map((q: any) => ({
        ...q,
        id: q.id ?? `L-${q.number}`,
      })),
    };
  }

  return block;
}