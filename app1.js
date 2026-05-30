// Hangman
const WORDS = [
    { word: "JAVASCRIPT", hint: "The language of the web browser", category: "Programming" },
    { word: "DATABASE",   hint: "Where data lives and is queried", category: "CS Concepts" },
    { word: "ALGORITHM",  hint: "Step-by-step problem-solving procedure", category: "CS Concepts" },
    { word: "DEBUGGING",  hint: "Finding and fixing code errors", category: "Programming" },
    { word: "FUNCTION",   hint: "A reusable block of code", category: "Programming" },
    { word: "REPOSITORY", hint: "Where GitHub stores your project", category: "Tools" },
    { word: "COMPILER",   hint: "Translates code into machine language", category: "CS Concepts" },
    { word: "RECURSION",  hint: "A function that calls itself", category: "CS Concepts" },
    { word: "PORTFOLIO",  hint: "Showcase of your projects", category: "Career" },
    { word: "INHERITANCE",hint: "OOP concept: child gets parent's traits", category: "Programming" },
    { word: "VARIABLE",   hint: "A named container for a value", category: "Programming" },
    { word: "INTERFACE",  hint: "A contract in Java / TypeScript", category: "Programming" },
    { word: "FRAMEWORK",  hint: "Pre-built structure for your app", category: "Tools" },
    { word: "DEPLOYMENT", hint: "Making your app live on the internet", category: "DevOps" },
    { word: "EXCEPTION",  hint: "Runtime error that can be caught", category: "Programming" },
    { word: "LECTURE",    hint: "Ikraam's classroom session", category: "Education" },
    { word: "NETWORK",    hint: "Computers connected and communicating", category: "CS Concepts" },
    { word: "SYNTAX",     hint: "Grammar rules of a programming language", category: "Programming" },
    { word: "TESTING",    hint: "SWT261 is all about this", category: "Programming" },
    { word: "ITERATION",  hint: "Repeating a process to improve it", category: "CS Concepts" },
  ];
   
  const BODY_PARTS = ['h-head','h-body','h-larm','h-rarm','h-lleg','h-rleg'];
  const MAX_WRONG = 6;
   
  let currentWord = '';
  let currentHint = '';
  let guessedLetters = new Set();
  let wrongGuesses = 0;
  let gameOver = false;
  let hintUsed = false;
  let wins = 0, losses = 0, streak = 0;
   
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
   
  function startNewGame() {
    closeOverlay();
    const entry = pick(WORDS);
    currentWord = entry.word;
    currentHint = entry.hint;
    guessedLetters = new Set();
    wrongGuesses = 0;
    gameOver = false;
    hintUsed = false;
   
    document.getElementById('categoryBadge').textContent = entry.category;
    document.getElementById('hintBox').textContent = 'Click "Show Hint" for a clue…';
    document.getElementById('hintBox').style.color = '';
    document.getElementById('statusMsg').textContent = '';
    document.getElementById('statusMsg').className = 'status-msg';
   
    renderWord();
    renderGallows();
    renderLives();
    renderKeyboard();
    renderGuessed();
  }
   
  function renderWord() {
    const display = document.getElementById('wordDisplay');
    display.innerHTML = currentWord.split('').map(ch => {
      const revealed = guessedLetters.has(ch);
      return `<div class="letter-slot">
        <div class="letter-char ${revealed ? 'revealed' : ''}">${revealed ? ch : ''}</div>
        <div class="letter-line"></div>
      </div>`;
    }).join('');
  }
   
  function renderGallows() {
    BODY_PARTS.forEach((id, i) => {
      const el = document.getElementById(id);
      el.style.opacity = i < wrongGuesses ? '1' : '0';
      el.style.transition = 'opacity 0.4s ease';
      // Turn red when game lost
      el.style.stroke = gameOver && !isWon() ? 'var(--danger)' : 'var(--neon-purple)';
    });
  }
   
  function renderLives() {
    const container = document.getElementById('livesDisplay');
    container.innerHTML = Array.from({length: MAX_WRONG}, (_, i) =>
      `<div class="life-dot ${i < wrongGuesses ? 'lost' : ''}"></div>`
    ).join('');
  }
   
  function renderKeyboard() {
    const kb = document.getElementById('keyboard');
    kb.innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => {
      const guessed = guessedLetters.has(l);
      const correct = guessed && currentWord.includes(l);
      const wrong   = guessed && !currentWord.includes(l);
      return `<button class="key ${correct?'correct-key':''} ${wrong?'wrong-key':''}"
        ${guessed||gameOver?'disabled':''}
        onclick="guess('${l}')">${l}</button>`;
    }).join('');
  }
   
  function renderGuessed() {
    const wrap = document.getElementById('guessedLetters');
    if (guessedLetters.size === 0) { wrap.innerHTML = ''; return; }
    wrap.innerHTML = [...guessedLetters].sort().map(l => {
      const correct = currentWord.includes(l);
      return `<span class="g-letter ${correct?'correct':'wrong'}">${l}</span>`;
    }).join('');
  }
   
  function isWon()  { return currentWord.split('').every(ch => guessedLetters.has(ch)); }
   
  function guess(letter) {
    if (gameOver || guessedLetters.has(letter)) return;
    guessedLetters.add(letter);
    if (!currentWord.includes(letter)) wrongGuesses++;
   
    renderWord();
    renderGallows();
    renderLives();
    renderKeyboard();
    renderGuessed();
   
    if (isWon()) {
      gameOver = true;
      wins++; streak++;
      updateScore();
      setTimeout(() => showOverlay(true), 600);
    } else if (wrongGuesses >= MAX_WRONG) {
      gameOver = true;
      losses++; streak = 0;
      // Reveal word
      currentWord.split('').forEach(ch => guessedLetters.add(ch));
      renderWord();
      renderGallows();
      updateScore();
      setTimeout(() => showOverlay(false), 700);
    }
  }
   
  function updateScore() {
    document.getElementById('scoreWins').textContent    = wins;
    document.getElementById('scoreLosses').textContent  = losses;
    document.getElementById('scoreStreak').textContent  = streak;
  }
   
  function showOverlay(won) {
    document.getElementById('overlayIcon').textContent  = won ? '🎉' : '💀';
    const title = document.getElementById('overlayTitle');
    title.textContent = won ? 'You Won!' : 'Game Over';
    title.className   = `overlay-title ${won ? 'win' : 'lose'}`;
    document.getElementById('overlayMsg').textContent   = won
      ? 'Nice work — you guessed the word!'
      : `The word was:`;
    document.getElementById('overlayWord').textContent  = currentWord;
    document.getElementById('overlay').classList.add('show');
  }
   
  function closeOverlay() {
    document.getElementById('overlay').classList.remove('show');
  }
   
  // Hint
  document.getElementById('hintBtn').addEventListener('click', () => {
    if (hintUsed || gameOver) return;
    hintUsed = true;
    const hintBox = document.getElementById('hintBox');
    hintBox.textContent = '💡 ' + currentHint;
    hintBox.style.color = 'var(--neon-blue)';
  });
   
  // New game button
  document.getElementById('newGameBtn').addEventListener('click', startNewGame);
   
  // Keyboard input
  document.addEventListener('keydown', e => {
    const l = e.key.toUpperCase();
    if (/^[A-Z]$/.test(l) && !gameOver) guess(l);
  });
   
  // Close overlay on background click
  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('overlay')) closeOverlay();
  });
   
  startNewGame();