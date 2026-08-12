// =========================================================
// StudyBuddy AI — script.js
// Day 8: Production hardening — race condition fix (stale
// response guard), history panel locked during generation,
// offline detection. Core features unchanged from Day 7.
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
const NEAR_LIMIT_THRESHOLD = 5800;
const HISTORY_KEY = 'studybuddy_history';
const MAX_HISTORY_ENTRIES = 20;

// ---- Day 8: request tracking to prevent stale-response race conditions ----
// If a user reopens a history item (or starts a new generate) while a
// previous request is still in flight, we must ignore the old response
// when it eventually resolves — otherwise it can silently overwrite
// whatever the user is now looking at.
let currentRequestId = 0;
let isGenerating = false;

// ---- Live character counter + button enable/disable ----
userInput.addEventListener('input', () => {
  const length = userInput.value.trim().length;
  const rawLength = userInput.value.length;
  charCount.textContent = `${rawLength} / ${MAX_CHARS} characters`;
  charCount.classList.toggle('near-limit', rawLength >= NEAR_LIMIT_THRESHOLD);

  if (length >= MIN_CHARS && rawLength <= MAX_CHARS && !isGenerating) {
    generateBtn.disabled = false;
  } else {
    generateBtn.disabled = true;
  }
});

// ---- Day 8: lock/unlock interactions that could race with an in-flight request ----
function setBusy(busy) {
  isGenerating = busy;
  generateBtn.disabled = busy || userInput.value.trim().length < MIN_CHARS;

  // Prevent reopening/deleting history while a generation is in progress —
  // this is what actually closes the Day 8 race-condition finding.
  historyList.setAttribute('aria-disabled', busy ? 'true' : 'false');
  historyList.classList.toggle('history-locked', busy);
}

// ---- Loading state helpers ----
function showLoading() {
  loadingState.hidden = false;
  emptyState.hidden = true;
  setBusy(true);
}

function hideLoading() {
  loadingState.hidden = true;
  setBusy(false);
}

// ---- Error display ----
function showError(message) {
  errorText.textContent = message;
  errorState.hidden = false;
  emptyState.hidden = true;
}

function clearError() {
  errorState.hidden = true;
  errorText.textContent = '';
}

// ---- Toast notifications ----
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// ---- Day 8: offline/online detection ----
window.addEventListener('offline', () => {
  showToast('You are offline — check your connection');
});

window.addEventListener('online', () => {
  showToast('Back online');
});

// ---- Render functions: take data, build DOM safely (no innerHTML with raw text) ----
function renderSummary(summary) {
  summaryText.textContent = summary;
  summaryCard.hidden = false;
}

function renderKeyPoints(points) {
  keyPointsList.innerHTML = '';
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
    showToast('Could not save — storage may be full');
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
  if (isGenerating) return; // Day 8: guard against races during generation
  const history = loadHistory();
  const filtered = history.filter((entry) => entry.id !== id);
  saveHistory(filtered);
  renderHistoryList();
  showToast('Deleted from history');
}

function clearAllHistory() {
  if (isGenerating) return; // Day 8: guard against races during generation
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
    li.tabIndex = 0;
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
  if (isGenerating) {
    // Day 8: this is the actual fix for the race condition — reopening
    // history is blocked while a generation is in flight, so there's
    // no way for a stale response to land on top of a reopened entry.
    showToast('Please wait for the current generation to finish');
    return;
  }

  // Invalidate any previous in-flight request's ability to apply its result
  currentRequestId++;

  clearError();
  userInput.value = entry.inputText;
  charCount.textContent = `${entry.inputText.length} / ${MAX_CHARS} characters`;
  generateBtn.disabled = entry.inputText.trim().length < MIN_CHARS;

  renderSummary(entry.summary);
  renderKeyPoints(entry.keyPoints);
  renderQuiz(entry.quiz);

  emptyState.hidden = true;

  summaryCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

clearHistoryBtn.addEventListener('click', clearAllHistory);

historyToggle.addEventListener('click', () => {
  historyPanel.hidden = !historyPanel.hidden;
});

// ---- Main Generate flow: REAL API call + save to history ----
generateBtn.addEventListener('click', async () => {
  if (isGenerating) return; // Day 8: extra defensive guard, belt-and-suspenders

  const requestId = ++currentRequestId;

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

    // Day 8: if the user navigated away from this request (e.g. reopened
    // a history item) while we were waiting, discard this response —
    // it's stale and must not overwrite what's currently on screen.
    if (requestId !== currentRequestId) {
      return;
    }

    if (!response.ok) {
      showError(data.error || 'Something went wrong. Please try again.');
      hideLoading();
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
  } catch (err) {
    if (requestId !== currentRequestId) {
      return; // Day 8: stale request, ignore even the error
    }
    console.error('Network or unexpected error:', err);
    showError('Could not reach the server. Please check your connection and try again.');
    hideLoading();
  }
});

// ---- Initial page load: render any existing history ----
renderHistoryList();

console.log("StudyBuddy AI — Day 8 loaded: production hardening active (race condition fix, offline detection).");