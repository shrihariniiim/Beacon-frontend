import test from 'node:test';
import assert from 'node:assert/strict';
import { successStories, SUCCESS_STORY_CATEGORIES } from '../data/successStories.js';

test('Success Stories - Categories Definition', () => {
  const expectedCategories = [
    'All',
    'Technology',
    'Arts & Creativity',
    'Sports',
    'Science',
    'Entertainment',
    'Advocacy',
    'Leadership'
  ];

  assert.deepEqual(SUCCESS_STORY_CATEGORIES, expectedCategories);
});

test('Success Stories - Dataset Integrity & Sourcing', () => {
  assert.ok(successStories.length >= 8, 'Should have at least 8 curated stories');

  successStories.forEach((story) => {
    assert.ok(story.id, `Story missing id: ${story.name}`);
    assert.ok(story.name, 'Story missing name');
    assert.ok(story.field, `Story missing field: ${story.name}`);
    assert.ok(Array.isArray(story.categories) && story.categories.length > 0, `Missing categories: ${story.name}`);
    assert.ok(story.primaryCategory, `Missing primaryCategory: ${story.name}`);
    assert.ok(story.image, `Missing image URL: ${story.name}`);
    assert.ok(story.imageAlt, `Missing imageAlt: ${story.name}`);
    assert.ok(story.shortDescription, `Missing shortDescription: ${story.name}`);
    assert.ok(story.autismDisclosure, `Missing autismDisclosure: ${story.name}`);
    assert.ok(Array.isArray(story.achievements) && story.achievements.length > 0, `Missing achievements: ${story.name}`);
    assert.ok(story.journey, `Missing journey: ${story.name}`);
    assert.ok(Array.isArray(story.sources) && story.sources.length > 0, `Missing sources: ${story.name}`);

    // Verify each source has title, url, publisher
    story.sources.forEach((source, sIdx) => {
      assert.ok(source.title, `Source ${sIdx} in ${story.name} missing title`);
      assert.ok(source.url, `Source ${sIdx} in ${story.name} missing url`);
      assert.ok(source.publisher, `Source ${sIdx} in ${story.name} missing publisher`);
    });
  });
});

test('Success Stories - Respectful Framing (No prohibited terminology)', () => {
  const prohibitedWords = [
    'superpower',
    'despite autism',
    'overcame autism',
    'defeated autism',
    'cured of autism'
  ];

  successStories.forEach((story) => {
    const fullText = [
      story.shortDescription,
      story.autismDisclosure,
      story.journey,
      ...(story.achievements || [])
    ].join(' ').toLowerCase();

    prohibitedWords.forEach((word) => {
      assert.strictEqual(
        fullText.includes(word),
        false,
        `Story for ${story.name} contains prohibited sensationalized phrasing: "${word}"`
      );
    });
  });
});

test('Success Stories - Content Rules Compliance', () => {
  // Rule 1: Simone Biles must not be included as an autism story
  const bilesStory = successStories.find((s) => s.name.toLowerCase().includes('biles'));
  assert.strictEqual(bilesStory, undefined, 'Simone Biles must not be included (she has ADHD, not autism)');

  // Rule 2: Elon Musk inclusion requires accurate SNL monologue citation
  const muskStory = successStories.find((s) => s.id === 'elon-musk');
  assert.ok(muskStory, 'Elon Musk story should exist');
  assert.ok(
    muskStory.autismDisclosure.includes('Saturday Night Live') || muskStory.autismDisclosure.includes('SNL'),
    'Elon Musk disclosure must cite the verified May 8, 2021 SNL monologue'
  );

  // Rule 3: Key requested figures are present
  const requiredFigures = [
    'temple-grandin',
    'greta-thunberg',
    'dan-aykroyd',
    'anthony-hopkins',
    'susan-boyle',
    'daniel-tammet'
  ];

  requiredFigures.forEach((reqId) => {
    const found = successStories.some((s) => s.id === reqId);
    assert.ok(found, `Required figure ${reqId} must be present`);
  });
});

test('Success Stories - Deterministic Category Filtering Logic', () => {
  // Test filtering by Science
  const scienceStories = successStories.filter((s) => s.categories.includes('Science'));
  assert.ok(scienceStories.length >= 2, 'Should have at least 2 Science stories');
  scienceStories.forEach((s) => assert.ok(s.categories.includes('Science')));

  // Test filtering by Sports
  const sportsStories = successStories.filter((s) => s.categories.includes('Sports'));
  assert.ok(sportsStories.length >= 2, 'Should have at least 2 Sports stories');
  sportsStories.forEach((s) => assert.ok(s.categories.includes('Sports')));

  // Test filtering by Technology
  const techStories = successStories.filter((s) => s.categories.includes('Technology'));
  assert.ok(techStories.length >= 2, 'Should have at least 2 Technology stories');
  techStories.forEach((s) => assert.ok(s.categories.includes('Technology')));
});
