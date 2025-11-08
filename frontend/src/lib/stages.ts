export type StageKey = 'entry' | 'relief' | 'reflection' | 'teaser' | 'conversion';

export const stageOrder: StageKey[] = ['entry', 'relief', 'reflection', 'teaser', 'conversion'];

export const stageLabels: Record<StageKey, string> = {
  entry: 'Entry',
  relief: 'Relief',
  reflection: 'Reflection',
  teaser: 'Teaser',
  conversion: 'Conversion'
};

export function getNextStage(current: StageKey): StageKey | null {
  const index = stageOrder.indexOf(current);
  if (index === -1 || index + 1 >= stageOrder.length) {
    return null;
  }
  return stageOrder[index + 1];
}
