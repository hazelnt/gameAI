const output = document.getElementById("output");
const input = document.getElementById("userInput");

let level = 0;
let part = 0;
let knowledgePoints = 0;
let gameStarted = false;
let awaitingAnswer = false;
let typing = false;

// type one line into its own div, char by char
function printLine(text = "", delay = 25) {
  return new Promise((resolve) => {
    const lineDiv = document.createElement("div");
    const span = document.createElement("span");
    lineDiv.appendChild(span);
    output.appendChild(lineDiv);
    output.scrollTop = output.scrollHeight;

    typing = true;
    let i = 0;
    const interval = setInterval(() => {
      // add next character
      span.textContent = text.slice(0, i);
      i++;
      // keep scrolled to bottom
      output.scrollTop = output.scrollHeight;

      if (i > text.length) {
        clearInterval(interval);
        typing = false;
        resolve();
      }
    }, delay);
  });
}

function clearScreen() {
  output.innerHTML = "";
}

async function introScene() {
  await printLine("> Initializing AI System...");
  await printLine("> Loading neural network modules...");
  await printLine("> Access Granted.");
  await printLine(""); // blank line
  await printLine('Type "start" to begin.');
}

async function startGame() {
  gameStarted = true;
  level = 1;
  part = 1;
  knowledgePoints = 0;
  clearScreen();

  await printLine("> AI Awakening: Discover How AI Works");
  await printLine("> Embark on a 15-level journey. Enter answers in the box below when prompted.");
  await printLine(""); // blank line
  await showStatus();  // showStatus now returns a Promise when needed
  await askQuestion();
}

async function showStatus() {
  await printLine(`Part: ${part}`);
  await printLine(`Level: ${level}`);
  await printLine(`Knowledge Points: ${knowledgePoints}`);
  await printLine(""); // blank line
}

async function askQuestion() {
  awaitingAnswer = true;
  await printLine(`> Question for Level ${level}:`);
  // Define questions based on level
  const questions = {
    1: "What is AI short for?",
    2: "What does ML stand for?",
    3: "What is a neural network?",
    4: "What is supervised learning?",
    5: "What is unsupervised learning?",
    6: "What is reinforcement learning?",
    7: "What is deep learning?",
    8: "What is a chatbot?",
    9: "What is natural language processing?",
    10: "What is computer vision?",
    11: "What is a dataset?",
    12: "What is overfitting?",
    13: "What is bias in AI?",
    14: "What is ethics in AI?",
    15: "What is the future of AI?"
  };
  await printLine(questions[level] || "No question available.");
}

async function handleAnswer(answer) {
  if (!awaitingAnswer) return;

  // Define correct answers based on level
  const answers = {
    1: "artificial intelligence",
    2: "machine learning",
    3: "a network of algorithms modeled after the human brain",
    4: "learning from labeled data",
    5: "learning from unlabeled data",
    6: "learning through trial and error",
    7: "a subset of machine learning using deep neural networks",
    8: "a program that simulates conversation",
    9: "the ability of computers to understand human language",
    10: "the field of AI that trains computers to interpret visual information",
    11: "a collection of data used for training models",
    12: "when a model performs well on training data but poorly on new data",
    13: "prejudice in data or algorithms",
    14: "the study of moral issues in AI development",
    15: "integration with everyday life and advanced capabilities"
  };

  const correctAnswer = answers[level];
  if (answer.toLowerCase().includes(correctAnswer.toLowerCase())) {
    await printLine("> Correct! Type 'next' to continue or 'exit' to quit.");
    awaitingAnswer = false;
  } else {
    await printLine("> Incorrect. Type 'retry' to try again or 'exit' to quit.");
    awaitingAnswer = false;
  }
}

async function nextLevel() {
  level++;
  knowledgePoints += 10;

  if (level > 15) {
    await endGame();
    return;
  }

  if ((level - 1) % 5 === 0 && level !== 1) {
    // level 6 -> new part, etc. but keep logic clear
    part = Math.floor((level - 1) / 5) + 1;
  }

  clearScreen(); // Clear screen before showing new level
  await printLine(""); 
  await printLine("> Loading next challenge...");
  await printLine("");
  await showStatus();
  await askQuestion();
}

async function retryLevel() {
  clearScreen(); // Clear screen before retrying level
  await printLine("");
  await printLine("> Retrying current level...");
  await printLine("");
  await showStatus();
  await askQuestion();
}

async function endGame() {
  clearScreen();
  await printLine("> Exiting AI System...");
  await printLine(""); // blank

  // determine final rank based on last achieved level
  let message = "";
  if (level <= 5) {
    message = "> Good job, little soldier.";
  } else if (level <= 10) {
    message = "> Now you are a master in the AI system.";
  } else {
    message = "> Are you a hacker?";
  }

  await printLine(message);
  await printLine(""); 
  await printLine("> Simulation complete.");
  gameStarted = false; // Reset game state to allow restarting
}

// Input handling
input.addEventListener("keydown", async function (e) {
  if (e.key === "Enter" && !typing) {
    const raw = input.value.trim();
    if (!raw) return;
    const command = raw.toLowerCase();
    // echo the command as a printed line
    await printLine("> " + raw);
    input.value = "";

    if (!gameStarted) {
      if (command === "start") {
        await startGame();
      } else {
        await printLine('> Invalid command. Type "start" to begin.');
      }
      return;
    }

    if (awaitingAnswer) {
      await handleAnswer(command);
    } else {
      if (command === "next") {
        await nextLevel();
      } else if (command === "retry") {
        await retryLevel();
      } else if (command === "exit") {
        await endGame();
      } else {
        await printLine("> Unknown command.");
      }
    }
  }
});
const popup = document.getElementById("popupContainer");
const openBtn = document.getElementById("openGame");

openBtn.addEventListener("click", () => {
  popup.classList.add("show");
  introScene(); // mulai game
});

// biar bisa close dengan tombol ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    popup.classList.remove("show");
  }
});

// begin
introScene();