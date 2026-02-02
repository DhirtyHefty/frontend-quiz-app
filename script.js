/* GLOBAL STATE*/

let quizzes = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

/*ELEMENTS*/

/* Screens */
const welcomeScreen = document.getElementById("welcomeScreen");
const quizScreen = document.getElementById("quizScreen");
const resultsScreen = document.getElementById("resultsScreen");

/* Header */
const currentSubjectIcon = document.getElementById("currentSubjectIcon");
const currentSubjectName = document.getElementById("currentSubjectName");
const themeToggle = document.getElementById("themeToggle");

/* Welcome */
const subjectGrid = document.getElementById("subjectGrid");

/* Quiz */
const questionText = document.getElementById("questionText");
const answersGrid = document.getElementById("answersGrid");
const submitButton = document.getElementById("submitButton");
const errorMessage = document.getElementById("errorMessage");
const currentQuestionEl = document.getElementById("currentQuestion");
const totalQuestionsEl = document.getElementById("totalQuestions");
const progressFill = document.getElementById("progressFill");

/* Results */
const finalScoreEl = document.getElementById("finalScore");
const resultsTotalQuestions = document.getElementById("resultsTotalQuestions");
const resultsSubjectIcon = document.getElementById("resultsSubjectIcon");
const resultsSubjectName = document.getElementById("resultsSubjectName");
const playAgainButton = document.getElementById("playAgainButton");

/*FETCH DATA*/

fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    quizzes = data.quizzes;
    renderSubjects();
  })
  .catch((err) => console.error("Failed to load data.json", err));

/*SCREEN MANAGEMENT*/

function showScreen(screen) {
  [welcomeScreen, quizScreen, resultsScreen].forEach((s) =>
    s.classList.remove("active")
  );
  screen.classList.add("active");
}

/* WELCOME SCREEN*/

function renderSubjects() {
  subjectGrid.innerHTML = "";

  quizzes.forEach((quiz) => {
    const btn = document.createElement("button");
    btn.type = "button";

    btn.innerHTML = `
      <span class=""subject-icon">
        <img src="${quiz.icon}" alt="${quiz.title}icon" />
      </span>
      <span>${quiz.title}</span>
    `;

    btn.addEventListener("click", () => startQuiz(quiz));
    subjectGrid.appendChild(btn);
  });
}

/*START QUIZ*/

function startQuiz(quiz) {
  currentQuiz = quiz;
  currentQuestionIndex = 0;
  score = 0;

  updateHeader();
  showScreen(quizScreen);
  loadQuestion();
}

/*HEADER UPDATE*/

function updateHeader() {
  currentSubjectIcon.innerHTML = `<img src="${currentQuiz.icon}" alt="${currentQuiz.title} icon" />`;
  currentSubjectName.textContent = currentQuiz.title;
}

/* LOAD QUESTION*/

function loadQuestion() {
  selectedAnswer = null;
  errorMessage.classList.remove("active");

  const question = currentQuiz.questions[currentQuestionIndex];

  questionText.textContent = question.question;
  currentQuestionEl.textContent = currentQuestionIndex + 1;
  totalQuestionsEl.textContent = currentQuiz.questions.length;

  updateProgressBar();

  answersGrid.innerHTML = "";

  question.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.setAttribute("tabindex", "0");

    label.innerHTML = `
      <input type="radio" name="answer" value="${option}" />
      <span>${option}</span>
    `;

    label.addEventListener("click", () => {
      selectAnswer(option);
    });

    label.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectAnswer(option);
      }
    });

    answersGrid.appendChild(label);
  });
}

/* SELECT ANSWER*/

function selectAnswer(answer) {
  selectedAnswer = answer;

  const inputs = document.querySelectorAll(
    "input[name='answer']"
  );

  inputs.forEach((input) => {
    input.checked = input.value === answer;
  });
}

/* SUBMIT ANSWER */

submitButton.addEventListener("click", () => {
  if (!selectedAnswer) {
    errorMessage.classList.add("active");
    return;
  }

  checkAnswer();
});

/* CHECK ANSWER*/

function checkAnswer() {
  const correctAnswer =
    currentQuiz.questions[currentQuestionIndex].answer;

  if (selectedAnswer === correctAnswer) {
    score++;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < currentQuiz.questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

/*PROGRESS BAR */

function updateProgressBar() {
  const percent =
    ((currentQuestionIndex) / currentQuiz.questions.length) * 100;

  progressFill.style.setProperty(
    "--progress",
    `${percent}%`
  );

  progressFill.style.background = `
    linear-gradient(
      to right,
      var(--accent) ${percent}%,
      var(--bg-card) ${percent}%
    )
  `;
}

/* RESULTS SCREEN*/

function showResults() {
  showScreen(resultsScreen);

  finalScoreEl.textContent = score;
  resultsTotalQuestions.textContent =
    currentQuiz.questions.length;

  resultsSubjectIcon.innerHTML = `<img src="${currentQuiz.icon}" alt="${currentQuiz.title} icon" />`;
  resultsSubjectName.textContent = currentQuiz.title;
}

/* PLAY AGAIN*/

playAgainButton.addEventListener("click", () => {
  currentSubjectIcon.innerHTML = "";
  currentSubjectName.textContent = "";
  showScreen(welcomeScreen);
});

/* THEME TOGGLE*/

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

/* KEYBOARD SAFETY*/

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && quizScreen.classList.contains("active")) {
    submitButton.click();
  }
});