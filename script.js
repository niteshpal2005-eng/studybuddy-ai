// =========================================================
// StudyBuddy AI — script.js
// Day 6: History feature (localStorage) added on top of
// Day 5's real Gemini API integration.
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

const historyToggle = document.getElementById('historyToggle');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

const MIN_CHARS = 50;
const MAX_CHARS = 6000;
const HISTORY_KEY = 'studybuddy_history';
const MAX_HISTORY_ENTRIES = 20;

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

// =========================================================
// ---- HISTORY FEATURE (Day 6) ----
// Data shape per SCHEMA.md:
// { id, createdAt, inputPreview, inputText, summary, keyPoints, quiz }
// =========================================================

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read history from localStorage:', err);
    return [];
  }
}

function saveHistory(historyArray) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyArray));
  } catch (err) {
    console.error('Failed to write history to localStorage:', err);
  }
}

function addToHistory(entry) {
  const history = loadHistory();
  history.unshift(entry); // newest first

  // Cap at MAX_HISTORY_ENTRIES — drop oldest if exceeded
  const trimmed = history.slice(0, MAX_HISTORY_ENTRIES);

  saveHistory(trimmed);
  renderHistoryList();
}

function deleteHistoryEntry(id) {
  const history = loadHistory();
  const filtered = history.filter((entry) => entry.id !== id);
  saveHistory(filtered);
  renderHistoryList();
}

function clearAllHistory() {
  const confirmed = confirm('Clear all history? This cannot be undone.');
  if (!confirmed) return;

  localStorage.removeItem(HISTORY_KEY);
  renderHistoryList();
}

function formatHistoryDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderHistoryList() {
  const history = loadHistory();
  historyList.innerHTML = ''; // clear previous render

  if (history.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'history-empty';
    emptyLi.textContent = 'No history yet — generate your first summary!';
    historyList.appendChild(emptyLi);
    return;
  }

  history.forEach((entry) => {
    const li = document.createElement('li');
    li.className = 'history-item';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'history-item-info';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'history-item-title';
    titleSpan.textContent = entry.inputPreview;

    const dateSpan = document.createElement('span');
    dateSpan.className = 'history-item-date';
    dateSpan.textContent = formatHistoryDate(entry.createdAt);

    infoDiv.appendChild(titleSpan);
    infoDiv.appendChild(dateSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-icon';
    deleteBtn.setAttribute('aria-label', 'Delete this entry');
    deleteBtn.textContent = '🗑';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // don't trigger the li's click (reopen) when deleting
      deleteHistoryEntry(entry.id);
    });

    // Clicking anywhere on the item (except delete) reopens that session
    li.addEventListener('click', () => loadEntryIntoResults(entry));

    li.appendChild(infoDiv);
    li.appendChild(deleteBtn);
    historyList.appendChild(li);
  });
}

function loadEntryIntoResults(entry) {
  clearError();
  userInput.value = entry.inputText;
  charCount.textContent = `${entry.inputText.length} / ${MAX_CHARS} characters`;
  generateBtn.disabled = entry.inputText.trim().length < MIN_CHARS;

  renderSummary(entry.summary);
  renderKeyPoints(entry.keyPoints);
  renderQuiz(entry.quiz);

  emptyState.hidden = true;
}

clearHistoryBtn.addEventListener('click', clearAllHistory);

// ---- History panel toggle (☰ History button) ----
historyToggle.addEventListener('click', () => {
  historyPanel.hidden = !historyPanel.hidden;
});

// ---- Main Generate flow: REAL API call + save to history ----
generateBtn.addEventListener('click', async () => {
  clearError();
  showLoading();

  const inputText = userInput.value;

  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.error || 'Something went wrong. Please try again.');
      hideLoading();
      generateBtn.disabled = false;
      return;
    }

    renderSummary(data.summary);
    renderKeyPoints(data.keyPoints);
    renderQuiz(data.quiz);

    // Save this successful generation to history
    addToHistory({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      inputPreview: inputText.slice(0, 40) + (inputText.length > 40 ? '...' : ''),
      inputText: inputText,
      summary: data.summary,
      keyPoints: data.keyPoints,
      quiz: data.quiz,
    });

    hideLoading();
    generateBtn.disabled = false;
  } catch (err) {
    console.error('Network or unexpected error:', err);
    showError('Could not reach the server. Please check your connection and try again.');
    hideLoading();
    generateBtn.disabled = false;
  }
});

// ---- Initial page load: render any existing history ----
renderHistoryList();

console.log("StudyBuddy AI — Day 6 loaded: history feature active.");