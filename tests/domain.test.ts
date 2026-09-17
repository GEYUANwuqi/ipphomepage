import test from 'node:test';
import assert from 'node:assert/strict';
import { drawQuestions, grade, questionSchema, validateAnswers } from '../server/domain.ts';
import { seedQuestions } from '../server/seed.ts';
import type { Answers, Question } from '../shared/types.ts';

test('random sampling is without replacement, scored, and varies across draws', () => {
  const sets = new Set<string>();
  for (let i = 0; i < 100; i++) {
    const qs = drawQuestions(seedQuestions, 8);
    assert.equal(qs.length, 8);
    assert.equal(new Set(qs.map(q => q.id)).size, 8);
    assert.ok(qs.some(q => q.points > 0));
    sets.add(qs.map(q => q.id).join(','));
  }
  assert.ok(sets.size > 1);
  assert.throws(() => drawQuestions(seedQuestions, 30));
  assert.throws(() =>
    drawQuestions(
      seedQuestions.filter(q => q.points === 0),
      1
    )
  );
});
test('all objective types score server answers; optional answers never affect score', () => {
  const a: Answers = Object.fromEntries(seedQuestions.filter(q => q.points).map(q => [q.id, q.correct]));
  const perfect = grade(seedQuestions, a);
  assert.equal(perfect.score, 100);
  a['reflection-1'] = '这是一份未评分的简答';
  a['reflection-2'] = 1;
  assert.deepEqual(grade(seedQuestions, a), perfect);
  const multiple = seedQuestions.find(q => q.type === 'multiple')!;
  a[multiple.id] = [multiple.correct[0]];
  assert.equal(grade(seedQuestions, a).earned, perfect.earned - multiple.points);
  a[multiple.id] = [...multiple.correct].reverse();
  assert.equal(grade(seedQuestions, a).score, 100);
});
test('invalid, foreign, duplicate, incomplete and out-of-range responses are rejected', () => {
  const q = seedQuestions[0];
  for (const a of [
    {},
    { [q.id]: [] },
    { [q.id]: [0, 0] },
    { [q.id]: [900] },
    { [q.id]: [0], foreign: [0] },
    { [q.id]: '0' }
  ]) {
    assert.throws(() => grade([q], a));
  }
  assert.doesNotThrow(() => validateAnswers([q], {}, false));
  const scale = seedQuestions.find(q => q.type === 'scale')!;
  assert.throws(() => validateAnswers([scale], { [scale.id]: 6 }));
});
test('schema rejects scored subjective questions and invalid objective keys', () => {
  seedQuestions.forEach(q => assert.ok(questionSchema.safeParse(q).success));
  const q = seedQuestions[0];
  for (const bad of [
    { ...q, correct: [7] },
    { ...q, correct: [0, 1] },
    { ...q, options: ['a', 'a'] },
    { ...q, points: 0 },
    { ...q, type: 'text', points: 10 }
  ])
    assert.equal(questionSchema.safeParse(bad).success, false);
});
test('weighted scores use original objective point denominator', () => {
  const questions: Question[] = [
    { ...seedQuestions[0], id: 'a', points: 1 },
    { ...seedQuestions[0], id: 'b', points: 2 }
  ];
  const r = grade(questions, { a: [1], b: [0] });
  assert.equal(r.score, 66.67);
  assert.equal(r.earned, 2);
  assert.equal(r.total, 3);
});
