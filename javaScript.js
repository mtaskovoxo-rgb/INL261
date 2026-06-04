    const WORDS = [
    { word: "JAVASCRIPT", hint: "The main scripting language used in web browsers", category: "Programming Language" },
    { word: "DATABASE", hint: "Stores, organizes, and retrieves structured information", category: "Data Management" },
    { word: "ALGORITHM", hint: "A logical set of steps to solve a problem", category: "Computer Science Concepts" },
    { word: "DEBUGGING", hint: "The process of finding and fixing code issues", category: "Software Development" },
    { word: "FUNCTION", hint: "A reusable block of code designed for a task", category: "Programming Concepts" },
    { word: "REPOSITORY", hint: "A storage location for code projects, often on GitHub", category: "Development Tools" },
    { word: "COMPILER", hint: "Converts source code into executable machine code", category: "Programming Tools" },
    { word: "RECURSION", hint: "When a function solves a problem by calling itself", category: "Programming Concepts" },
    { word: "PORTFOLIO", hint: "A collection showcasing your skills and projects", category: "Career Development" },
    { word: "INHERITANCE", hint: "An OOP feature where one class gains traits from another", category: "Object-Oriented Programming" },
    { word: "VARIABLE", hint: "A named storage location for data values", category: "Programming Basics" },
    { word: "INTERFACE", hint: "Defines methods or rules a class must follow", category: "Programming Concepts" },
    { word: "FRAMEWORK", hint: "A structured platform used to build applications faster", category: "Development Tools" },
    { word: "DEPLOYMENT", hint: "The process of launching software for users", category: "DevOps" },
    { word: "EXCEPTION", hint: "An error event that interrupts normal program flow", category: "Programming Concepts" },
    { word: "LECTURE", hint: "An educational session led by an instructor", category: "Education" },
    { word: "NETWORK", hint: "Connected systems that share information and resources", category: "Computer Science Concepts" },
    { word: "SYNTAX", hint: "The formal grammar rules of a programming language", category: "Programming Basics" },
    { word: "TESTING", hint: "Checking software for bugs, quality, and reliability", category: "Software Quality Assurance" },
    { word: "ITERATION", hint: "Repeating steps to refine or complete a process", category: "Computer Science Concepts" }
];

let selectedWord = "";
let guessedLetters = [];
let wrongGuesses = 0;
const maxWrong = 6;
let selectedHint = "";
let selectedCategory = "";


function loadStats() {
    return JSON.parse(localStorage.getItem('hangmanStats') || '{"played":0,"wins":0,"losses":0}');
}

function saveStats(stats) {
    localStorage.setItem('hangmanStats', JSON.stringify(stats));
}

function updateStatsDisplay() {
    const stats = loadStats();
    document.getElementById('stat-played').textContent = stats.played;
    document.getElementById('stat-wins').textContent = stats.wins;
    document.getElementById('stat-losses').textContent = stats.losses;
    const rate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
    document.getElementById('stat-rate').textContent = rate + '%';
}

function recordWin() {
    const stats = loadStats();
    stats.played++;
    stats.wins++;
    saveStats(stats);
    updateStatsDisplay();
}

function recordLoss() {
    const stats = loadStats();
    stats.played++;
    stats.losses++;
    saveStats(stats);
    updateStatsDisplay();
}


let hangmanStages = [];
const allStages = [
    [ // Style 1
        ` +---+
 |   |
     |
     |
     |
     |
=========`,
        ` +---+
 |   |
 O   |
     |
     |
     |
=========`,
        ` +---+
 |   |
 O   |
 |   |
     |
     |
=========`,
        ` +---+
 |   |
 O   |
/|   |
     |
     |
=========`,
        ` +---+
 |   |
 O   |
/|\\  |
     |
     |
=========`,
        ` +---+
 |   |
 O   |
/|\\  |
/    |
     |
=========`,
        ` +---+
 |   |
 O   |
/|\\  |
/ \\  |
     |
=========`
    ],

    [ // Style 2 (example variation)
        ` +---+
 |   |
     |
     |
     |
     |
=========`,
        ` +---+
 |   |
 😐  |
     |
     |
     |
=========`,
        ` +---+
 |   |
 😐  |
 |   |
     |
     |
=========`,
        ` +---+
 |   |
 😐  |
/|   |
     |
     |
=========`,
        ` +---+
 |   |
 😐  |
/|\\  |
     |
     |
=========`,
        ` +---+
 |   |
 😐  |
/|\\  |
/    |
     |
=========`,
        ` +---+
 |   |
 😐  |
/|\\  |
/ \\  |
     |
=========`
    ]

];

const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const hangman = document.getElementById("hangman");
const restartBtn = document.getElementById("restart");

function startGame() {
    const randomItem = WORDS[Math.floor(Math.random() * WORDS.length)];

    selectedWord = randomItem.word;
    selectedHint = randomItem.hint;
    selectedCategory = randomItem.category;

    hangmanStages = allStages[Math.floor(Math.random() * allStages.length)];

    guessedLetters = [];
    wrongGuesses = 0;
    message.textContent = "";
  

    document.getElementById("hint").disabled = false;

    createKeyboard();
    updateDisplay();
    updateStatsDisplay();
}

function updateDisplay() {
    const displayWord = selectedWord
        .split("")
        .map(letter => guessedLetters.includes(letter) ? letter : "_")
        .join(" ");

    wordDisplay.textContent = displayWord;
    hangman.textContent = hangmanStages[wrongGuesses] || hangmanStages[0];

    if (!displayWord.includes("_")) {
        message.textContent = "🎉 You Win!";
        disableKeyboard();
        if (!gameOver) { gameOver = true; recordWin(); }
    }

    if (wrongGuesses >= maxWrong) {
        message.textContent = `💀 You Lost! The word was: ${selectedWord}`;
        disableKeyboard();
        if (!gameOver) { gameOver = true; recordWin(); }
    }
}

function createKeyboard() {
    keyboard.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const btn = document.createElement("button");
        btn.textContent = letter;

        btn.addEventListener("click", () => handleGuess(letter, btn));

        keyboard.appendChild(btn);
    }
}

function handleGuess(letter, button) {
    button.disabled = true;

    if (selectedWord.includes(letter)) {
        guessedLetters.push(letter);
    } else {
        wrongGuesses++;
    }

    updateDisplay();
}

function disableKeyboard() {
    document.querySelectorAll(".keyboard button").forEach(btn => {
        btn.disabled = true;
    });
}

document.addEventListener("keydown", (e) => {
    const letter = e.key.toUpperCase();
    if (letter >= "A" && letter <= "Z") {
        const buttons = document.querySelectorAll(".keyboard button");
        buttons.forEach(btn => {
            if (btn.textContent === letter && !btn.disabled) {
                btn.click();
            }
        });
    }
});

restartBtn.addEventListener("click", startGame);

document.getElementById("resetStats").addEventListener("click", () => {
    if (confirm("Reset all stats? This cannot be undone.")) {
        localStorage.removeItem('hangmanStats');
        updateStatsDisplay();
    }
});
const hintBtn = document.getElementById("hint");

hintBtn.addEventListener("click", () => {
    alert(
        "Category: " + selectedCategory + "\n" +
        "Hint: " + selectedHint
    );
    hintBtn.disabled = true;
});

(() => {
    const backdrop = document.getElementById('htpBackdrop');
    const openBtn = document.getElementById('howToPlayBtn');
    const closeBtn = document.getElementById('htpClose');
    const gotItBtn = document.getElementById('htpGotIt');

    function openModal() {
        backdrop.classList.add('open');
        backdrop.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
    }
    function closeModal() {
        backdrop.classList.remove('open');
        backdrop.setAttribute('aria-hidden', 'true');
        openBtn.focus();
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    gotItBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Auto-open for first-time visitors this session
    if (!sessionStorage.getItem('htp-seen')) {
        setTimeout(() => {
            openModal();
            sessionStorage.setItem('htp-seen', '1');
        }, 500);
    }
})();

startGame();
(function () {
    const backdrop = document.getElementById('htpBackdrop');
    const openBtn  = document.getElementById('howToPlayBtn');
    const closeBtn = document.getElementById('htpClose');
    const gotItBtn = document.getElementById('htpGotIt');
 
    function openModal() {
        backdrop.classList.add('open');
        backdrop.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
    }
    function closeModal() {
        backdrop.classList.remove('open');
        backdrop.setAttribute('aria-hidden', 'true');
        openBtn.focus();
    }
 
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    gotItBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
 
    // Auto-open for first-time visitors this session
    if (!sessionStorage.getItem('htp-seen')) {
        setTimeout(() => {
            openModal();
            sessionStorage.setItem('htp-seen', '1');
        }, 500);
    }
})();
window.addEventListener('touchstart', () => {
    cursor.style.display = 'none';
    cursorRing.style.display = 'none';
    document.body.style.cursor = 'auto';
  }, { once: true });
  
