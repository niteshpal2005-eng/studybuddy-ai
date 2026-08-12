// =========================================================
// StudyBuddy AI — script.js
// Day 7: UI/UX polish — dedicated error state, toast
// notifications, near-limit character warning, keyboard
// accessibility for history items. Core logic (API calls,
// history, quiz) unchanged from Day 6.
// =========================================================

// ---- DOM element references ----
const userInput = document.getElementById('userInput');
const charCount = document.getElementById('charCount');
const generateBtn = document.getElementById('generateBtn');

const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const errorState = document.getElementById('errorState');
const errorText = document.getElementById('errorText');

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

const toastContainer = document.getElementById('toastContainer');

const MIN_CHARS = 50;
const MAX_CHARS = 6000;
const NEAR_LIMIT_THRESHOLD = 5800; // Day 7: warn user before hitting the hard cap
const HISTORY_KEY = 'studybuddy_history';
const MAX_HISTORY_ENTRIES = 20;

// ---- Live character counter + button enable/disable ----
userInput.addEventListener('input', () => {
  const length = userInput.value.trim().length;
  const rawLength = userInput.value.length;
  charCount.textContent = `${rawLength} / ${MAX_CHARS} characters`;
  charCount.classList.toggle('near-limit', rawLength >= NEAR_LIMIT_THRESHOLD);

  if (length >= MIN_CHARS && rawLength <= MAX_CHARS) {
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

// ---- Error display (Day 7: dedicated element, visually + semantically distinct) ----
function showError(message) {
  errorText.textContent = message;
  errorState.hidden = false;
  emptyState.hidden = true;
}

function clearError() {
  errorState.hidden = true;
  errorText.textContent = '';
}

// ---- Toast notifications (Day 7) ----
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Remove from DOM after the CSS animation finishes (2s total: fade in + hold + fade out)
  setTimeout(() => {
    toast.remove();
  }, 2000);
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
// ---- HISTORY FEATURE ----
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
  history.unshift(entry);

  const trimmed = history.slice(0, MAX_HISTORY_ENTRIES);

  saveHistory(trimmed);
  renderHistoryList();
}

function deleteHistoryEntry(id) {
  const history = loadHistory();
  const filtered = history.filter((entry) => entry.id !== id);
  saveHistory(filtered);
  renderHistoryList();
  showToast('Deleted from history');
}

function clearAllHistory() {
  const confirmed = confirm('Clear all history? This cannot be undone.');
  if (!confirmed) return;

  localStorage.removeItem(HISTORY_KEY);
  renderHistoryList();
  showToast('History cleared');
}

function formatHistoryDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderHistoryList() {
  const history = loadHistory();
  historyList.innerHTML = '';

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
    li.tabIndex = 0; // Day 7: keyboard-focusable
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', `Reopen session: ${entry.inputPreview}`);

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
    deleteBtn.setAttribute('aria-label', `Delete session: ${entry.inputPreview}`);
    deleteBtn.textContent = '🗑';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteHistoryEntry(entry.id);
    });

    li.addEventListener('click', () => loadEntryIntoResults(entry));
    // Day 7: keyboard accessibility — Enter/Space also reopens the entry
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadEntryIntoResults(entry);
      }
    });

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

  // Day 7: scroll results into view for a smoother reopen experience
  summaryCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    addToHistory({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      inputPreview: inputText.slice(0, 40) + (inputText.length > 40 ? '...' : ''),
      inputText: inputText,
      summary: data.summary,
      keyPoints: data.keyPoints,
      quiz: data.quiz,
    });

    showToast('Saved to history');

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

console.log("StudyBuddy AI — Day 7 loaded: UI/UX polish active (toasts, error states, accessibility).");