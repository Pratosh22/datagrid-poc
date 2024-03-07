import { faker } from "@faker-js/faker";

const submission = {
  tags: [],
  language: null,
  location: null,
};

function generateFakeData() {
  for (let i = 41; i <= 50; i++) {
    const questionId = `question_1000000${i}`;
    if (i === 42 || i === 44 || i === 48) {
      submission[questionId] = {
        skipped: false,
        question_id: 100000000 + i,
        answer_choice_id: 100000000 + i + 1,
        answer_choice_ids: [100000000 + i + 1],
      };
    } else if (i === 46 || i === 50) {
      submission[questionId] = {
        answer: faker.lorem.sentence(),
        skipped: false,
        question_id: 100000000 + i,
        multiLanguageProperties: {},
      };
    } else {
      submission[questionId] = {
        answer: faker.number.int({ min: 1, max: 10 }),
        skipped: false,
        question_id: 100000000 + i,
      };
    }
  }
  return submission;
}
export { submission, generateFakeData };
