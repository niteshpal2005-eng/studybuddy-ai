// =========================================================
// StudyBuddy AI — script.js
// Day 4: Mock data flow (no real API yet — that's Day 5)
// =========================================================

// ---- DOM element references ----
const userInput = document.getElementById('userInput');
const charCount = document.getElementById('charCount');
const generateBtn = document.getElementById('generateBtn');

const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');

const summaryCard = document.getElementById('summaryCard');
const summaryText = document.getElementById('summaryText');

const keyPointsCard = document.getElementById('keyPointsCard');
const keyPointsList = document.getElementById('keyPointsList');

const quizCard = document.getElementById('quizCard');
const showAnswersBtn = document.getElementById('showAnswersBtn');

const MIN_CHARS = 50;
const MAX_CHARS = 6000;

// ---- Mock data (stands in for the real Claude API response until Day 5) ----
function getMockData() {
  return {
    summary:
      "This text explains the water cycle, covering evaporation, condensation, and precipitation as the three core stages that continuously move water through Earth's systems and drive the planet's climate.",
    keyPoints: [
      "Evaporation turns liquid water into vapor using solar energy",
      "Condensation forms clouds as vapor cools in the atmosphere",
      "Precipitation returns water to the earth's surface as rain or snow",
      "The cycle is continuous and drives Earth's climate system"
    ],
    quiz: [
      {
        question: "What process forms clouds?",
        options: ["Evaporation", "Condensation", "Precipitation", "Erosion"],
        correctIndex: 1
      },
      {
        question: "What provides the energy for evaporation?",
        options: ["Wind", "The moon", "Solar energy", "Ocean currents"],
        correctIndex: 2
      },
      {
        question: "What does precipitation do?",
        options: [
          "Turns water into vapor",
          "Forms clouds",
          "Returns water to Earth's surface",
          "Stops the water cycle"
        ],
        correctIndex: 2
      }
    ]
  };
}

// ---- Live character counter + button enable/disable ----
userInput.addEventListener('input', () => {
  const length = userInput.value.trim().length;
  charCount.textContent = `${userInput.value.length} / ${MAX_CHARS} characters`;

  if (length >= MIN_CHARS && userInput.value.length <= MAX_CHARS) {
    generateBtn.disabled = false;
  } else {
    generateBtn.disabled = true;
  }
});

// ---- Loading state helpers ----
function showLoading() {
  loadingState.hidden = false;
  emptyState.hidden = true;
  generateBtn.disabled = true;
}

function hideLoading() {
  loadingState.hidden = true;
}

// ---- Render functions: take data, build DOM safely (no innerHTML with raw text) ----
function renderSummary(summary) {
  summaryText.textContent = summary;
  summaryCard.hidden = false;
}

function renderKeyPoints(points) {
  keyPointsList.innerHTML = ''; // clear previous render
  points.forEach((point) => {
    const li = document.createElement('li');
    li.textContent = point;
    keyPointsList.appendChild(li);
  });
  keyPointsCard.hidden = false;
}

function renderQuiz(questions) {
  // Clear everything in the quiz card except the "Show Answers" button
  const existingQuestions = quizCard.querySelectorAll('.quiz-question');
  existingQuestions.forEach((el) => el.remove());

  questions.forEach((q, qIndex) => {
    const questionEl = document.createElement('div');
    questionEl.className = 'quiz-question';
    questionEl.dataset.correctIndex = q.correctIndex;

    const questionText = document.createElement('p');
    questionText.className = 'quiz-question-text';
    questionText.textContent = `Q${qIndex + 1}: ${q.question}`;
    questionEl.appendChild(questionText);

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'quiz-options';

    q.options.forEach((optionText, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.dataset.index = optIndex;
      btn.textContent = optionText;
      btn.addEventListener('click', () => selectAnswer(questionEl, btn));
      optionsWrap.appendChild(btn);
    });

    questionEl.appendChild(optionsWrap);
    quizCard.insertBefore(questionEl, showAnswersBtn);
  });

  quizCard.hidden = false;
}

// ---- Quiz interactivity ----
function selectAnswer(questionEl, selectedBtn) {
  // Clear previous selection in this question only
  questionEl.querySelectorAll('.quiz-option').forEach((btn) => {
    btn.classList.remove('selected');
  });
  selectedBtn.classList.add('selected');
}

function revealAnswers() {
  const allQuestions = quizCard.querySelectorAll('.quiz-question');

  allQuestions.forEach((questionEl) => {
    const correctIndex = Number(questionEl.dataset.correctIndex);
    const optionButtons = questionEl.querySelectorAll('.quiz-option');

    optionButtons.forEach((btn) => {
      const btnIndex = Number(btn.dataset.index);
      btn.disabled = true; // lock in answers once revealed

      if (btnIndex === correctIndex) {
        btn.classList.add('correct');
      } else if (btn.classList.contains('selected')) {
        btn.classList.add('incorrect');
      }
    });
  });
}

showAnswersBtn.addEventListener('click', revealAnswers);

// ---- Main Generate flow (mock version — real API call comes Day 5) ----
generateBtn.addEventListener('click', () => {
  showLoading();

  // Simulates network delay. Day 5 replaces this setTimeout
  // with a real fetch('/api/summarize') call.
  setTimeout(() => {
    const data = getMockData();

    renderSummary(data.summary);
    renderKeyPoints(data.keyPoints);
    renderQuiz(data.quiz);

    hideLoading();
    generateBtn.disabled = false;
  }, 1500);
});

console.log("StudyBuddy AI — Day 4 Milestone 2 loaded: mock generate flow active.");