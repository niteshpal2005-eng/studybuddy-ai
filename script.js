// =========================================================
// StudyBuddy AI — script.js
// Day 5: Real API integration (Google Gemini via serverless function)
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

// ---- Error display ----
function showError(message) {
  // Reuse the empty state area to show errors, keeps things simple
  emptyState.hidden = false;
  emptyState.textContent = `⚠ ${message}`;
}

function clearError() {
  emptyState.textContent = 'Your summary, key points, and quiz will appear here.';
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
      btn.disabled = true;

      if (btnIndex === correctIndex) {
        btn.classList.add('correct');
      } else if (btn.classList.contains('selected')) {
        btn.classList.add('incorrect');
      }
    });
  });
}

showAnswersBtn.addEventListener('click', revealAnswers);

// ---- Main Generate flow: REAL API call ----
generateBtn.addEventListener('click', async () => {
  clearError();
  showLoading();

  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: userInput.value }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Server returned a structured error (400/500/502/504)
      showError(data.error || 'Something went wrong. Please try again.');
      hideLoading();
      generateBtn.disabled = false;
      return;
    }

    renderSummary(data.summary);
    renderKeyPoints(data.keyPoints);
    renderQuiz(data.quiz);

    hideLoading();
    generateBtn.disabled = false;
  } catch (err) {
    console.error('Network or unexpected error:', err);
    showError('Could not reach the server. Please check your connection and try again.');
    hideLoading();
    generateBtn.disabled = false;
  }
});

console.log("StudyBuddy AI — Day 5 loaded: real Gemini API integration active.");