document.addEventListener("DOMContentLoaded", function() {
const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".quiz-timer");
const resultContainer = document.querySelector(".result-container");

const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;

let quizCategory = null;
let numberOfQuestions = null;
let currentQuestion = null;
const questionsIndexHistory = [];
let correctAnswersCount = 0;

const showQuizResult = () => {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";
  const resultText = `You scored <b>${correctAnswersCount}</b> out of <b>${numberOfQuestions}</b>`;
  document.querySelector(".result-text").innerHTML = resultText;
};

const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;
};

const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;
    if (currentTime <= 0) {
      clearInterval(timer);
      highlightCorrectAnswer();
      nextQuestionBtn.style.visibility = "visible";
      timerDisplay.style.background = "red";
      answerOptions
        .querySelectorAll(".answer-option")
        .forEach((option) => (option.style.pointerEvents = "none"));
    }
  }, 1000);
};

const getRandomQuestion = () => {
  const categoryQuestions =
    questions.find(
      (cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()
    )?.questions || [];
  if (
    questionsIndexHistory.length >=
    Math.min(categoryQuestions.length, numberOfQuestions)
  ) {
    showQuizResult();
    return null;
  }
  const availableQuestion = categoryQuestions.filter(
    (_, index) => !questionsIndexHistory.includes(index)
  );
  const randomQuestion =
    availableQuestion[Math.floor(Math.random() * availableQuestion.length)];
  questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
  return randomQuestion;
};

const highlightCorrectAnswer = () => {
  const correctOption =
    answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
  if (correctOption) {
    correctOption.classList.add("correct");
    const iconHTML = '<span class="material-symbols-rounded">check-circle</span>';
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
  }
};

const handleAnswer = (option, answerIndex) => {
  clearInterval(timer);
  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");
  if (!isCorrect) {
    highlightCorrectAnswer();
  } else {
    correctAnswersCount++;
  }
  const iconHTML = 
    `<span class="material-symbols-rounded">${isCorrect ? "check-circle" : "cancel"}</span>`;
  option.insertAdjacentHTML("beforeend", iconHTML);
  answerOptions
    .querySelectorAll(".answer-option")
    .forEach((option) => (option.style.pointerEvents = "none"));
  nextQuestionBtn.style.visibility = "visible";
};

const renderQuestion = () => {
  currentQuestion = getRandomQuestion();
  if (!currentQuestion) return;
  resetTimer();
  startTimer();
  answerOptions.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  timerDisplay.style.background = "#32313C";
  document.querySelector(".question-text").textContent =
    currentQuestion.question;
  questionStatus.innerHTML = `<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;
  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.appendChild(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

const startQuiz = () => {
  if (!quizCategory || !numberOfQuestions) {
    alert("Please select a category and number of questions!");
    return;
  }
  configContainer.style.display = "none";
  quizContainer.style.display = "block";
  resultContainer.style.display = "none";
  correctAnswersCount = 0;
  questionsIndexHistory.length = 0;
  renderQuestion();
};

const resetQuiz = () => {
  resetTimer();
  correctAnswersCount = 0;
  questionsIndexHistory.length = 0;
  configContainer.style.display = "block";
  quizContainer.style.display = "none";
  resultContainer.style.display = "none";
};

document.querySelectorAll(".category-option").forEach(option => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".category-option").forEach(btn => btn.classList.remove("active"));
    option.classList.add("active");
    quizCategory = option.textContent;
  });
});
document.querySelectorAll(".question-option").forEach(option => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".question-option").forEach(btn => btn.classList.remove("active"));
    option.classList.add("active");
    numberOfQuestions = parseInt(option.textContent);
  });
});
nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);

const firstCategory = document.querySelector(".category-option");
const firstNum = document.querySelector(".question-option");
if (firstCategory) firstCategory.click();
if (firstNum) firstNum.click();
});
