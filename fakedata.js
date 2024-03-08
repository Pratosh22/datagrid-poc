import { faker } from "@faker-js/faker";

const randomArray = (i) =>{
  const arr = ['Mopping', 'Cleaning', 'Dusting','Laundry'];
  const arr2 = ['Brand Reputation', 'Cleaning Performance', 'Durability', 'Price', 'UserReviews'];
  const arr3 = ['Yes', 'No', 'Not Sure'];
  
  if(i === 46){
    return arr[Math.floor(Math.random() * arr.length)];
  } else if( i === 44){
    return arr2[Math.floor(Math.random() * arr2.length)];
  } else if( i === 48){
    return arr3[Math.floor(Math.random() * arr3.length)];
  }
}

function generateFakeData() {
  const submission = {
    tags: [],
    language: null,
    location: null,
  };

  for (let i = 41; i <= 50; i++) {
    const questionId = `question_1000000${i}`;
    if (i === 42 || i === 44 || i === 48) {
      submission[questionId] = {
        skipped: false,
        question_id: 100000000 + i,
        answer: randomArray(i),
        answer_choice_ids: [100000000 + i + 1],
      };
    } else if (i === 46 || i === 50) {
      submission[questionId] = {
        answer: faker.company.buzzPhrase(),
        skipped: false,
        question_id: 100000000 + i,
        multiLanguageProperties: {},
      };
    } else {
      submission[questionId] = {
        answer: faker.number.int({ min: 1, max: 5 }),
        skipped: false,
        question_id: 100000000 + i,
      };
    }
  }
  return submission;
}

const generateFakeDataColumns = () =>{
  const submission = {
    tags: [],
    language: null,
    location: null,
  };

  for(let i = 223; i <= 424; i++){
    const questionId = `question_100000${i}`;
    submission[questionId] = {
      answer: faker.lorem.sentence(),
      skipped: false,
      question_id: 100000 + i,
    }
  }
  return submission;
}

export { generateFakeData, generateFakeDataColumns };