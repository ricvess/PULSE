const SUPABASE_URL = "https://uwmvhxehkldwhyyvpgay.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_yYHePs6qlIpcqS-LUiedFQ_SNWj2Ok1";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  const sounds = {
    correct: {
      frequency: 620,
      duration: 0.08
    },

    wrong: {
      frequency: 150,
      duration: 0.12
    },

    combo: {
      frequency: 820,
      duration: 0.09
    },

    countdown: {
      frequency: 520,
      duration: 0.07
    },

    result: {
      frequency: 740,
      duration: 0.18
    }
  };

  const sound = sounds[type];

  if (!sound) return;

  oscillator.frequency.value = sound.frequency;
  oscillator.type = "sine";

  gain.gain.setValueAtTime(
    0.0001,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.08,
    audioContext.currentTime + 0.01
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + sound.duration
  );

  oscillator.start();
  oscillator.stop(
    audioContext.currentTime + sound.duration
  );
}

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

/* =====================================================
   PULSE V3A
   Game + Theme + Leaderboard Prototype
===================================================== */


/* ================= USER ================= */

const authScreen = document.getElementById("authScreen");
const homeScreen = document.getElementById("homeScreen");
const leaderboardScreen = document.getElementById("leaderboardScreen");
const profileScreen = document.getElementById("profileScreen");
const onboardingScreen = document.getElementById("onboardingScreen");
const onboardingContent = document.getElementById("onboardingContent");
const onboardingProgress = document.getElementById("onboardingProgress");
const onboardingNext = document.getElementById("onboardingNext");

const onboardingSteps = [
  {
    number: "01",
    title: "TYPE",
    description: "Type the displayed word as fast as you can."
  },
  {
    number: "02",
    title: "REACT",
    description: "Click the circle as quickly as possible."
  },
  {
    number: "03",
    title: "MEMORY",
    description: "Remember the sequence, then type it correctly."
  },
  {
    number: "04",
    title: "DON'T CLICK",
    description: "Click the white circle. Avoid the dark one."
  },
  {
    number: "05",
    title: "CHAOS",
    description: "Follow the instruction. Don't trust your reflexes."
  }
];

let onboardingIndex = 0;

function renderOnboarding() {
  const step = onboardingSteps[onboardingIndex];

  onboardingContent.innerHTML = `
    <div class="onboarding-step">
      <span class="onboarding-number">${step.number}</span>

      <div class="onboarding-visual">
        ${
          onboardingIndex === 0
            ? `<div class="preview-type">
                <span>pulse</span>
                <div class="preview-input">type here...</div>
              </div>`
            : onboardingIndex === 1
            ? `<div class="preview-react">
                <div class="preview-circle"></div>
              </div>`
            : onboardingIndex === 2
            ? `<div class="preview-memory">
                <span>7</span>
                <span>2</span>
                <span>9</span>
                <span>4</span>
              </div>`
            : onboardingIndex === 3
            ? `<div class="preview-dont-click">
                <div class="preview-good"></div>
                <div class="preview-bad"></div>
              </div>`
            : `<div class="preview-chaos">
                <span>GO</span>
              </div>`
        }
      </div>

      <h2>${step.title}</h2>

      <p>${step.description}</p>
    </div>
  `;

  onboardingProgress.textContent =
    `${step.number} / 05`;

  onboardingNext.textContent =
    onboardingIndex === onboardingSteps.length - 1
      ? "I'M READY →"
      : "NEXT →";
}


renderOnboarding();

const profileButton = document.getElementById("profileButton");
const backFromProfile = document.getElementById("backFromProfile");
const profileUsername = document.getElementById("profileUsername");
const countdownScreen = document.getElementById("countdownScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");
const shareResultButton = document.getElementById("shareResultButton");
const saveResultButton = document.getElementById("saveResultButton");
const whatsappResultButton = document.getElementById("whatsappResultButton");

const resultShareCard = document.getElementById("resultShareCard");

const shareCardScore = document.getElementById("shareCardScore");
const shareCardAccuracy = document.getElementById("shareCardAccuracy");
const shareCardReaction = document.getElementById("shareCardReaction");
const shareCardBestRound = document.getElementById("shareCardBestRound");
const shareCardUsername = document.getElementById("shareCardUsername");
const shareCardDate = document.getElementById("shareCardDate");

/* ================= SCREEN SYSTEM ================= */

function showScreen(screen) {

  [
  authScreen,
  onboardingScreen,
  homeScreen,
  profileScreen,
  leaderboardScreen,
  countdownScreen,
  gameScreen,
  resultScreen
].forEach(item => {
    item.classList.add("hidden");
    item.classList.remove("active");
  });

  screen.classList.remove("hidden");
  screen.classList.add("active");
}


/* ================= LOGIN ================= */

/* ================= AUTH ================= */

const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

const navUsername = document.getElementById("navUsername");
const logoutButton = document.getElementById("logoutButton");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const usernameField = document.getElementById("usernameField");
const authButtonText = document.getElementById("authButtonText");

let authMode = "login";


/* ================= AUTH MODE ================= */

loginTab.addEventListener("click", () => {
  authMode = "login";

  document.querySelector(".auth-tabs").classList.remove("register-active");

  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  usernameField.classList.add("hidden");
  usernameInput.required = false;
  authButtonText.textContent = "Login";
  passwordInput.autocomplete = "current-password";
});


registerTab.addEventListener("click", () => {
  authMode = "register";

  document.querySelector(".auth-tabs").classList.add("register-active");

  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  usernameField.classList.remove("hidden");
  usernameInput.required = true;
  authButtonText.textContent = "Create account";
  passwordInput.autocomplete = "new-password";
});


/* ================= SUBMIT AUTH ================= */

loginForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    return;
  }


  /* ================= REGISTER ================= */

  if (authMode === "register") {

    const username = usernameInput.value.trim();

    if (!username) {
      alert("Please choose a username.");
      return;
    }


    if (username.length < 3) {
      alert("Username must be at least 3 characters.");
      return;
    }


    const { data, error } =
      await supabaseClient.auth.signUp({

        email: email,
        password: password,

        options: {
          data: {
            username: username
          }
        }

      });


    if (error) {

      alert(error.message);
      return;

    }


    const user = data.user;


    if (!user) {

      alert("Account could not be created.");
      return;

    }


    /* ================= CREATE PROFILE ================= */

    const { error: profileError } =
      await supabaseClient
        .from("profiles")
        .insert({

          id: user.id,
          username: username,
          onboarding_completed: false

});


    if (profileError) {

      alert(profileError.message);
      return;

    }


    navUsername.textContent = username;

showScreen(onboardingScreen);

return;

  }


  /* ================= LOGIN ================= */

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({

      email: email,
      password: password

    });


  if (error) {

    alert("Invalid email or password.");
    return;

  }


  const user = data.user;


  /* ================= GET PROFILE ================= */

  const { data: profile, error: profileError } =
    await supabaseClient
      .from("profiles")
      .select("username, onboarding_completed")
      .eq("id", user.id)
      .single();


  if (profileError) {

    alert(profileError.message);
    return;

  }


  navUsername.textContent = profile.username;

if (!profile.onboarding_completed) {
  showScreen(onboardingScreen);
  return;
}

showScreen(homeScreen);

setupDailyPulse();

});


/* ================= RESTORE SESSION ================= */

async function restoreSession() {

  const {
    data: {
      session
    }
  } = await supabaseClient.auth.getSession();


  if (!session) {

    showScreen(authScreen);
    return;

  }


  const user = session.user;


  const { data: profile } =
    await supabaseClient
      .from("profiles")
      .select("username, onboarding_completed")
      .eq("id", user.id)
      .single();


  if (!profile) {

    await supabaseClient.auth.signOut();

    showScreen(authScreen);
    return;

  }


  navUsername.textContent = profile.username;

if (!profile.onboarding_completed) {
  showScreen(onboardingScreen);
  return;
}

showScreen(homeScreen);

setupDailyPulse();
}


restoreSession();

logoutButton.addEventListener("click", async () => {

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert(error.message);
    return;
  }

  loginForm.reset();

  authMode = "login";

  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  document.querySelector(".auth-tabs").classList.remove("register-active");

  usernameField.classList.add("hidden");
  usernameInput.required = false;

  authButtonText.textContent = "Login";

  navUsername.textContent = "guest";

  showScreen(authScreen);

});


/* ================= THEME ================= */

const themeButton = document.getElementById("themeButton");
const themePanel = document.getElementById("themePanel");
const closeTheme = document.getElementById("closeTheme");

const savedTheme = localStorage.getItem("pulseTheme");

if (savedTheme) {
  document.body.dataset.theme = savedTheme;
}

themeButton.addEventListener("click", () => {
  themePanel.classList.toggle("open");
});

closeTheme.addEventListener("click", () => {
  themePanel.classList.remove("open");
});


document.querySelectorAll(".theme-option").forEach(button => {

  button.addEventListener("click", () => {

    const theme = button.dataset.themeChoice;

    document.body.dataset.theme = theme;

    localStorage.setItem("pulseTheme", theme);

    themePanel.classList.remove("open");

  });

});


/* ================= GAME DATA ================= */

const words = [
  "pulse","signal","motion","rapid","focus","pixel","react","orbit","shift","speed",
  "moment","static","energy","future","vision","impact","system","digital","creative","design",
  "random","memory","control","target","response","instant","active","smooth","simple","dynamic",
  "visual","coding","future","tech","logic","brain","power","quick","smart","challenge",
  "pattern","screen","button","action","timing","accuracy","combo","score","level","player",
  "game","play","round","result","signal","input","output","network","data","cloud",
  "device","mobile","laptop","keyboard","mouse","website","online","global","local","world",
  "idea","concept","project","studio","creator","content","media","camera","video","photo",
  "music","sound","light","color","shape","space","motion","energy","speed","focus",
  "attention","reaction","decision","choice","instinct","reflex","skill","practice","progress","master",
  "learn","build","create","explore","discover","develop","improve","adapt","change","connect",
  "signal","vision","future","digital","modern","technology","innovation","creative","design","experience"
];

const typeDifficulty = {
  easy: words.filter(word => word.length >= 4 && word.length <= 6),
  normal: words.filter(word => word.length >= 7 && word.length <= 8),
  hard: words.filter(word => word.length >= 9 && word.length <= 12)
};


let score = 0;
let combo = 0;
let maxCombo = 0;

let totalAttempts = 0;
let successfulAttempts = 0;

let reactionTimes = [];
let bestRoundScore = 0;
let bestRoundName = "—";

let currentRound = 0;

let roundTimer = null;
let roundStartTime = 0;

const roundDurations = {
  type: 10,
  react: 8,
  memory: 7,
  dontClick: 7,
  chaos: 6
};


/* ================= GAME ELEMENTS ================= */

const scoreElement = document.getElementById("score");
const comboElement = document.getElementById("combo");
const timerElement = document.getElementById("timer");

const gameRound = document.getElementById("gameRound");
const gameTitle = document.getElementById("gameTitle");


function updateStats() {

  scoreElement.textContent = score;
  comboElement.textContent = `x${combo}`;

  if (combo > 0) {
  comboElement.classList.remove("combo-pop");
  void comboElement.offsetWidth;
  comboElement.classList.add("combo-pop");
}

  comboElement.classList.toggle(
  "combo-hot",
  combo >= 3
);

comboElement.classList.toggle(
  "combo-max",
  combo >= 6
);
}


/* ================= PLAY ================= */

document.getElementById("playButton").addEventListener("click", startGame);

document
  .getElementById("playAgainButton")
  .addEventListener("click", startGame);


function startGame() {

  isDailyChallenge = false;

  resetGame();

  showCountdown();

}


function resetGame() {

  score = 0;
  combo = 0;
  maxCombo = 0;

  totalAttempts = 0;
  successfulAttempts = 0;

  reactionTimes = [];

  bestRoundScore = 0;
  bestRoundName = "—";

  currentRound = 0;

  updateStats();

}


/* ================= COUNTDOWN ================= */

function showCountdown() {

  showScreen(countdownScreen);

  let number = 3;

  const countdownNumber =
    document.getElementById("countdownNumber");

  countdownNumber.textContent = number;

  const interval = setInterval(() => {

    number--;

    if (number <= 0) {

      clearInterval(interval);

      startRound();

      return;

    }

    countdownNumber.textContent = number;

    countdownNumber.style.animation = "none";

    void countdownNumber.offsetWidth;

    countdownNumber.style.animation =
      "countdownPop .8s var(--ease)";

  }, 800);

}


/* ================= ROUND ENGINE ================= */

const rounds = [
  "type",
  "react",
  "memory",
  "dontClick",
  "chaos"
];


function startRound() {

  roundEnding = false;
  
  if (isDailyChallenge) {
    if (currentRound >= 1) {
      endGame();
      return;
    }

    const round = dailyChallenge.challenge_type;
    setupRound(round);
    return;
  }

  if (currentRound >= rounds.length) {
    endGame();
    return;
  }

  const round = rounds[currentRound];
  setupRound(round);
}

/* ================= DAILY CHALLENGE ================= */

let dailyChallenge = null;
let isDailyChallenge = false;

async function loadDailyChallenge() {

  const today = getTodayDate();

  const { data, error } = await supabaseClient
    .from("daily_challenges")
    .select("*")
    .eq("challenge_date", today)
    .maybeSingle();

  if (error) {
    console.error("Daily Challenge error:", error);
    return null;
  }

  if (data) {
    dailyChallenge = data;
    return data;
  }

  const seed = createDailySeed(today);
  const challengeType = rounds[seed % rounds.length];

  const { data: newChallenge, error: insertError } =
    await supabaseClient
      .from("daily_challenges")
      .insert({
        challenge_date: today,
        challenge_type: challengeType,
        seed: seed
      })
      .select()
      .single();

  if (insertError) {
    console.error(
      "Failed to create Daily Challenge:",
      insertError
    );

    return null;
  }

  dailyChallenge = newChallenge;

  return newChallenge;
}


/* ================= DAILY DATE ================= */

function getTodayDate() {

  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/* ================= DAILY SEED ================= */

function createDailySeed(dateString) {

  let hash = 0;

  for (let i = 0; i < dateString.length; i++) {

    hash =
      ((hash << 5) - hash) +
      dateString.charCodeAt(i);

    hash |= 0;
  }

  return Math.abs(hash);
}


/* ================= DAILY PULSE UI ================= */

const dailyPlayButton =
  document.getElementById("dailyPlayButton");

const dailyButtonText =
  document.getElementById("dailyButtonText");

const dailyStatus =
  document.getElementById("dailyStatus");

const dailyTitle =
  document.getElementById("dailyTitle");


async function setupDailyPulse() {

  const challenge = await loadDailyChallenge();

  if (!challenge) {

    dailyTitle.textContent =
      "Daily Challenge.";

    dailyStatus.textContent =
      "Unable to load today's challenge.";

    dailyPlayButton.disabled = true;

    return;
  }


  dailyTitle.textContent =
    "Today's Challenge.";


  const {
    data: { user }
  } = await supabaseClient.auth.getUser();


  if (!user) return;


  const {
    data: existingScore,
    error
  } = await supabaseClient
    .from("daily_scores")
    .select("id")
    .eq("user_id", user.id)
    .eq("challenge_id", challenge.id)
    .maybeSingle();


  if (error) {

    console.error(
      "Failed to check daily score:",
      error
    );

    return;
  }


  if (existingScore) {

    dailyStatus.textContent =
      "You already completed today's challenge.";

    dailyButtonText.textContent =
      "Completed";

    dailyPlayButton.classList.add("completed");

    dailyPlayButton.disabled = true;

  } else {

    dailyStatus.textContent =
      "Today's challenge is waiting.";

    dailyButtonText.textContent =
      "Play Daily";

    dailyPlayButton.classList.remove("completed");

    dailyPlayButton.disabled = false;
  }
}


/* ================= START DAILY CHALLENGE ================= */

dailyPlayButton.addEventListener("click", async () => {

  if (!dailyChallenge) return;


  const {
    data: { user }
  } = await supabaseClient.auth.getUser();


  if (!user) {

    showScreen(authScreen);

    return;
  }


  startDailyChallenge();

});


function startDailyChallenge() {

  isDailyChallenge = true;

  resetGame();

  currentRound = 0;

  showCountdown();

  console.log(
    "Daily Challenge:",
    dailyChallenge.challenge_type
  );
}

/* ================= SETUP ROUND ================= */

function setupRound(round) {

  showScreen(gameScreen);

  document.querySelectorAll(".round-content").forEach(el => {
    el.classList.add("hidden-round");
  });


  const titles = {
    type: "TYPE",
    react: "REACT",
    memory: "MEMORY",
    dontClick: "DON'T CLICK",
    chaos: "CHAOS"
  };


  gameRound.textContent = isDailyChallenge
  ? "DAILY"
  : `ROUND ${String(currentRound + 1).padStart(2, "0")}`;

  gameTitle.textContent = titles[round];


  if (round === "type") {

    document
      .getElementById("typeRound")
      .classList.remove("hidden-round");

    startTypeRound();

  }


  if (round === "react") {

    document
      .getElementById("reactRound")
      .classList.remove("hidden-round");

    startReactRound();

  }


  if (round === "memory") {

    document
      .getElementById("memoryRound")
      .classList.remove("hidden-round");

    startMemoryRound();

  }


  if (round === "dontClick") {

    document
      .getElementById("dontClickRound")
      .classList.remove("hidden-round");

    startDontClickRound();

  }


  if (round === "chaos") {

    document
      .getElementById("chaosRound")
      .classList.remove("hidden-round");

    startChaosRound();

  }

}


/* ================= TIMER ================= */

function startTimer(callback) {

  clearInterval(roundTimer);

  const currentRoundType = rounds[currentRound];
  let time = roundDurations[currentRoundType] || 6;

  timerElement.textContent = time.toFixed(1);

  roundStartTime = performance.now();

  roundTimer = setInterval(() => {

    time -= .1;

    timerElement.textContent =
      Math.max(0, time).toFixed(1);


    if (time <= 0) {

      clearInterval(roundTimer);

      callback();

    }

  }, 100);

}


/* ================= NEXT ROUND ================= */

let roundEnding = false;

function nextRound(roundScore, roundName) {

  if (roundEnding) return;

  roundEnding = true;

  clearInterval(roundTimer);

  // Remove focus from any active input
  if (document.activeElement) {
    document.activeElement.blur();
  }

  if (roundScore > bestRoundScore) {

    bestRoundScore = roundScore;
    bestRoundName = roundName;

  }

  currentRound++;

  gameScreen.classList.add("round-transition");

  setTimeout(() => {

    gameScreen.classList.remove("round-transition");

    startRound();

  }, 900);

}


/* ================= TYPE ================= */

let currentWord = "";
let typeWordStartTime = 0;
let typeRoundActive = false;

const typeWord = document.getElementById("typeWord");
const typeInput = document.getElementById("typeInput");


function randomWord() {

  const typeWords =
    combo < 3
      ? typeDifficulty.easy
      : combo < 6
        ? typeDifficulty.normal
        : typeDifficulty.hard;

  return typeWords[
    Math.floor(Math.random() * typeWords.length)
  ];

}


function startTypeRound() {

  let roundScore = 0;

  typeRoundActive = true;

  typeInput.oninput = null;
  typeInput.disabled = false;
  typeInput.value = "";


  function showNextWord() {

    currentWord = randomWord();

    typeWord.textContent = currentWord;

    typeInput.value = "";

    // Reaction timer dimulai setiap word baru
    typeWordStartTime = performance.now();

    typeInput.focus();

  }


  showNextWord();

  startTimer(() => {

    typeRoundActive = false;

    typeInput.oninput = null;
    typeInput.disabled = true;

    nextRound(
      roundScore,
      "TYPE"
    );

  });


  typeInput.oninput = function() {

    if (!typeRoundActive) return;

    const answer =
      typeInput.value.trim().toLowerCase();

    /*
      Count every completed attempt.

      This means:
      wrong = attempt
      correct = successful attempt
    */

    if (answer !== currentWord) {

      /*
        Only count as an attempt when
        the player has entered the same
        number of characters as the target.
      */

      if (answer.length >= currentWord.length) {

        totalAttempts++;

        combo = 0;
        playSound("wrong");

        updateStats();

        typeInput.value = "";

      }

      return;

    }


    /* ================= CORRECT ================= */

    totalAttempts++;
    successfulAttempts++;
    playSound("correct");

    combo++;
    playSound("combo");

    maxCombo =
      Math.max(
        maxCombo,
        combo
      );


    const reaction =
      performance.now() - typeWordStartTime;


    reactionTimes.push(
      reaction
    );


    const speedBonus =
      Math.max(
        0,
        Math.round(
          30 - reaction / 100
        )
      );


    const points =
      25 +
      combo * 3 +
      speedBonus;


    score += points;
    roundScore += points;


    updateStats();


    /*
      Small visual feedback.
      The CSS animation can use this class later.
    */

    typeWord.classList.remove("type-success");

    void typeWord.offsetWidth;

    typeWord.classList.add("type-success");


    showNextWord();

  };

}


/* ================= REACT ================= */

const reactionTarget =
  document.getElementById("reactionTarget");


function startReactRound() {

  let roundScore = 0;

  moveReactionTarget();

  startTimer(() => {
  reactionTarget.onclick = null;
  nextRound(roundScore, "REACT");
});


  reactionTarget.onclick = function() {

    const reaction =
      performance.now() - roundStartTime;

    reactionTimes.push(reaction);

    totalAttempts++;
    successfulAttempts++;
    playSound("correct");

    combo++;
    playSound("combo");
    maxCombo = Math.max(maxCombo, combo);

    const points =
    Math.max(
    10,
    Math.round(80 - reaction / 10) + combo * 2
  );

    score += points;
    roundScore += points;

    updateStats();

    moveReactionTarget();

    roundStartTime = performance.now();

  };

}


function moveReactionTarget() {
  const size = combo < 3 ? 90 : combo < 6 ? 65 : 45;

  reactionTarget.style.width = `${size}px`;
  reactionTarget.style.height = `${size}px`;

  const range = combo < 3 ? 55 : combo < 6 ? 70 : 80;

  const x = Math.random() * range + (100 - range) / 2;
  const y = Math.random() * range + (100 - range) / 2;

  reactionTarget.style.transform =
    `translate(${x - 50}%, ${y - 50}%)`;
}


/* ================= MEMORY ================= */

const memorySequence =
  document.getElementById("memorySequence");

const memoryInput =
  document.getElementById("memoryInput");

const memorySubmit =
  document.getElementById("memorySubmit");


function startMemoryRound() {
  let roundScore = 0;
  let memoryChecked = false;

  const symbols =
  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const sequence = [];

const sequenceLength =
  combo < 3 ? 4 :
  combo < 6 ? 5 :
  6;

for (let i = 0; i < sequenceLength; i++) {

  sequence.push(
    symbols[Math.floor(Math.random() * symbols.length)]
  );

}


  memorySequence.innerHTML = "";

  sequence.forEach(symbol => {

    const element =
      document.createElement("div");

    element.className = "memory-symbol";
    element.textContent = symbol;

    memorySequence.appendChild(element);

  });


  memoryInput.value = "";

  const memoryTime =
  combo < 3 ? 1800 :
  combo < 6 ? 1400 :
  1000;

memorySequence.style.opacity = "1";

setTimeout(() => {
  memorySequence.style.opacity = "0";
}, memoryTime);


  startTimer(() => {

    checkMemory(sequence);

  });


  memoryInput.focus();
  memorySubmit.onclick = () => {
  checkMemory(sequence);
};

  memoryInput.onkeydown = (event) => {

  if (event.key === "Enter") {
    event.preventDefault();
    checkMemory(sequence);
  }

};

  function checkMemory(sequence) {
    if (memoryChecked) return;
    memoryChecked = true;

    const answer =
      memoryInput.value.trim().replaceAll(" ", "");

    const correct =
      sequence.join("");

    totalAttempts++;


    if (answer === correct) {

      successfulAttempts++;
      playSound("correct");

      combo++;
      playSound("combo");
      maxCombo = Math.max(maxCombo, combo);

      roundScore =
      combo < 3 ? 100 :
      combo < 6 ? 130 :
      160;

     score += roundScore;

    } else {

      combo = 0;
      playSound("wrong");

    }

    updateStats();

    memorySubmit.onclick = null;
    memoryInput.onkeydown = null;

    nextRound(
      roundScore,
      "MEMORY"
    );

  }

}


/* ================= DON'T CLICK ================= */

const dontClickArea =
  document.getElementById("dontClickArea");


function startDontClickRound() {

  let roundScore = 0;

  createTargets();

  startTimer(() => {

    nextRound(
      roundScore,
      "DON'T CLICK"
    );

  });


  function createTargets() {

    dontClickArea.innerHTML = "";

    const targetCount =
  combo < 3 ? 5 :
  combo < 6 ? 7 :
  9;

    for (let i = 0; i < targetCount; i++) {

      const target =
        document.createElement("div");

      target.className =
        "dont-target dont-good";

      target.style.left =
        Math.random() * 85 + "%";

      target.style.top =
        Math.random() * 75 + "%";


      target.onclick = () => {

        totalAttempts++;
        successfulAttempts++;
        playSound("correct");

        combo++;
        playSound("combo");
        maxCombo = Math.max(maxCombo, combo);

        const points =
        combo < 3 ? 20 :
        combo < 6 ? 25 :
          30;

        score += points;
        roundScore += points;

        updateStats();

        target.remove();

        createOneGoodTarget();

      };

      dontClickArea.appendChild(target);

    }


    const badCount =
  combo < 3 ? 1 :
  combo < 6 ? 2 :
  3;

for (let i = 0; i < badCount; i++) {

  const bad =
    document.createElement("div");

  bad.className =
    "dont-target dont-bad";

  bad.style.left =
    Math.random() * 85 + "%";

  bad.style.top =
    Math.random() * 75 + "%";

  bad.onclick = () => {

  totalAttempts++;

  const penalty =
    combo >= 6 ? 40 : 30;

  combo = 0;
  playSound("wrong");

  score = Math.max(
    0,
    score - penalty
  );

  updateStats();

};

  dontClickArea.appendChild(bad);

  }

  }


  function createOneGoodTarget() {

    const target =
      document.createElement("div");

    target.className =
      "dont-target dont-good";

    target.style.left =
      Math.random() * 85 + "%";

    target.style.top =
      Math.random() * 75 + "%";


    target.onclick = () => {

      totalAttempts++;
      successfulAttempts++;
      playSound("correct");

      combo++;
      playSound("combo");

      score += 20;
      roundScore += 20;

      maxCombo =
        Math.max(maxCombo, combo);

      updateStats();

      target.remove();

      createOneGoodTarget();

    };


    dontClickArea.appendChild(target);

  }

}


/* ================= CHAOS ================= */

const chaosTarget =
  document.getElementById("chaosTarget");

const chaosInstruction =
  document.getElementById("chaosInstruction");


function startChaosRound() {

  let roundScore = 0;
  let mode = "CLICK";
  let chaosNextTimer = null;


  function newChallenge() {

    chaosTarget.style.opacity = "0";
    chaosTarget.style.transform = "scale(.92)";

    const challenges =
      ["CLICK", "CLICK", "WAIT", "CLICK", "WAIT", "CLICK"];

    mode =
      challenges[
        Math.floor(Math.random() * challenges.length)
      ];


    setTimeout(() => {

      if (mode === "CLICK") {

        chaosInstruction.textContent = "CLICK";
        chaosTarget.textContent = "GO";
        chaosTarget.style.opacity = "1";
        chaosTarget.style.transform = "scale(1.04)";

      } else {

        chaosInstruction.textContent = "WAIT";
        chaosTarget.textContent = "WAIT";
        chaosTarget.style.opacity = ".45";
        chaosTarget.style.transform = "scale(1.04)";

      }

    }, 100);


    chaosNextTimer = setTimeout(() => {

      if (mode === "CLICK") {

        totalAttempts++;

        combo = 0;
        playSound("wrong");

        score = Math.max(
          0,
          score - 25
        );

        updateStats();

      }

      newChallenge();

    }, 600);

  }


  newChallenge();


  chaosTarget.onclick = () => {

    clearTimeout(chaosNextTimer);

    totalAttempts++;


    if (mode === "CLICK") {

      successfulAttempts++;
      playSound("correct");

      combo++;
      playSound("combo");

      maxCombo =
        Math.max(
          maxCombo,
          combo
        );


      const points =
        combo < 3 ? 40 :
        combo < 6 ? 50 :
        60;


      score += points;
      roundScore += points;


      reactionTimes.push(
        performance.now() - roundStartTime
      );


      updateStats();


      roundStartTime =
        performance.now();


      newChallenge();


    } else {

      combo = 0;
      playSound("wrong");

      score =
        Math.max(
          0,
          score - 50
        );


      updateStats();


      newChallenge();

    }

  };


  startTimer(() => {

    clearTimeout(chaosNextTimer);

    nextRound(
      roundScore,
      "CHAOS"
    );

  });

}

/* ================= RESULT ================= */

async function endGame() {

  clearInterval(roundTimer);

  showScreen(resultScreen);
  playSound("result");


  const accuracy =
    totalAttempts === 0
      ? 0
      : Math.round(
          (successfulAttempts / totalAttempts) * 100
        );


  const averageReaction =
    reactionTimes.length === 0
      ? 0
      : Math.round(
          reactionTimes.reduce(
            (a, b) => a + b,
            0
          ) / reactionTimes.length
        );


  /* ================= RESULT SCREEN ================= */

  document.getElementById("finalScore")
    .textContent = score;

  document.getElementById("finalAccuracy")
    .textContent = `${accuracy}%`;

  document.getElementById("finalReaction")
    .textContent =
      averageReaction
        ? `${averageReaction}ms`
        : "—";

  document.getElementById("finalCombo")
    .textContent = `x${maxCombo}`;

  const bestRoundElement =
  document.getElementById("bestRound");

bestRoundElement.textContent =
  bestRoundName;

bestRoundElement.classList.add("best-round-highlight");


  /* ================= PERSONAL BEST ================= */

  const personalBest =
    document.getElementById("personalBest");

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();


  let previousScores = [];
  let bestError = null;


  if (user) {

    const result =
      await supabaseClient
        .from("scores")
        .select("score")
        .eq("user_id", user.id)
        .order("score", { ascending: false })
        .limit(1);

    previousScores = result.data || [];
    bestError = result.error;

  }


  if (
    !bestError &&
    previousScores.length > 0 &&
    score > previousScores[0].score
  ) {

    personalBest.classList.remove("hidden");

  } else {

    personalBest.classList.add("hidden");

  }


  /* ================= UPDATE SHARE CARD ================= */

  updateShareCard(
    accuracy,
    averageReaction
  );


  /* ================= SAVE SCORE ================= */

  if (isDailyChallenge) {

    await saveDailyScore();

  } else {

    await saveLocalScore();

  }

}


/* ================= SAVE SCORES ================= */

async function saveDailyScore() {

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user || !dailyChallenge) {
    return;
  }

  const accuracy =
    totalAttempts > 0
      ? Math.round(
          (successfulAttempts / totalAttempts) * 100
        )
      : 0;

  const averageReaction =
    reactionTimes.length > 0
      ? Math.round(
          reactionTimes.reduce(
            (sum, time) => sum + time,
            0
          ) / reactionTimes.length
        )
      : null;

  const { error } =
    await supabaseClient
      .from("daily_scores")
      .insert({

        user_id: user.id,

        challenge_id: dailyChallenge.id,

        score: score,

        accuracy: accuracy,

        reaction: averageReaction

      });

  if (error) {

    console.error(
      "Daily score error:",
      error
    );

    return;
  }

  console.log("Daily score saved.");

}


async function saveLocalScore() {

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) {

    console.error("No logged-in user.");

    return;
  }

  const accuracy =
    totalAttempts === 0
      ? 0
      : Math.round(
          successfulAttempts /
          totalAttempts *
          100
        );

  const averageReaction =
    reactionTimes.length === 0
      ? null
      : Math.round(
          reactionTimes.reduce(
            (sum, time) => sum + time,
            0
          ) / reactionTimes.length
        );

  const { error } =
    await supabaseClient
      .from("scores")
      .insert({

        user_id: user.id,

        score: score,

        accuracy: accuracy,

        reaction: averageReaction,

        best_round: bestRoundName

      });

  if (error) {

    console.error(
      "Failed to save score:",
      error
    );

    return;
  }

  console.log("Score saved to Supabase.");

}


/* ================= LEADERBOARD ================= */

document
  .getElementById("leaderboardButton")
  .addEventListener("click", showLeaderboard);

document
  .getElementById("resultLeaderboardButton")
  .addEventListener("click", showLeaderboard);

document
  .getElementById("backFromLeaderboard")
  .addEventListener("click", () => {
    showScreen(homeScreen);
});


/* ================= PLAYER STATS ================= */

async function loadPlayerStats() {

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) return;

  const { data: scores, error } = await supabaseClient
    .from("scores")
    .select("score, accuracy, reaction")
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to load player stats:", error);
    return;
  }

  if (!scores || scores.length === 0) {
    document.getElementById("gamesPlayed").textContent = "0";
    document.getElementById("bestScore").textContent = "0";
    document.getElementById("bestAccuracy").textContent = "0%";
    document.getElementById("fastestReaction").textContent = "—";
    document.getElementById("averageScore").textContent = "0";
    return;
  }

  const gamesPlayed = scores.length;

  const bestScore = Math.max(
    ...scores.map(item => item.score)
  );

  const bestAccuracy = Math.max(
    ...scores.map(item => item.accuracy)
  );

  const reactionTimes = scores
    .map(item => item.reaction)
    .filter(value => value !== null);

  const fastestReaction = reactionTimes.length
    ? Math.min(...reactionTimes)
    : null;

  const averageScore = Math.round(
    scores.reduce((sum, item) => sum + item.score, 0) / scores.length
  );

  document.getElementById("gamesPlayed").textContent = gamesPlayed;
  document.getElementById("bestScore").textContent = bestScore;
  document.getElementById("bestAccuracy").textContent = `${bestAccuracy}%`;

  document.getElementById("fastestReaction").textContent =
    fastestReaction !== null
      ? `${fastestReaction}ms`
      : "—";

  document.getElementById("averageScore").textContent = averageScore;
}

/* ================= PROFILE ================= */

profileButton.addEventListener("click", () => {
  profileUsername.textContent = navUsername.textContent;
  loadPlayerStats();
  showScreen(profileScreen);
});

backFromProfile.addEventListener("click", () => {
  showScreen(homeScreen);
});

/* ================= SHOW LEADERBOARD ================= */

async function showLeaderboard() {

  showScreen(leaderboardScreen);

  const list =
    document.getElementById("leaderboardList");

  const { data: scores, error } =
    await supabaseClient
      .from("scores")
      .select(`
        score,
        accuracy,
        reaction,
        best_round,
        created_at,
        profiles (
          username
        )
      `)
      .order("score", { ascending: false });

  if (error) {

    console.error(
      "Failed to load leaderboard:",
      error
    );

    list.innerHTML = `
      <div style="
        padding:30px 0;
        color:var(--muted);
        font-size:13px;
      ">
        Failed to load leaderboard.
      </div>
    `;

    return;
  }


  /*
    Keep only the highest score
    from each username.
  */

  const bestPlayers = new Map();


  scores.forEach(player => {

    const username =
      player.profiles?.username || "Unknown";

    const existing =
      bestPlayers.get(username);

    if (
      !existing ||
      player.score > existing.score
    ) {

      bestPlayers.set(
        username,
        player
      );

    }

  });


  const leaderboard =
    Array.from(bestPlayers.values())
      .sort((a, b) => {

        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return (
          (a.reaction ?? Infinity) -
          (b.reaction ?? Infinity)
        );

      })
      .slice(0, 50);


  list.innerHTML = "";


  if (leaderboard.length === 0) {

    list.innerHTML = `
      <div style="
        padding:30px 0;
        color:var(--muted);
        font-size:13px;
      ">
        No scores yet. Be the first.
      </div>
    `;

    return;
  }


  leaderboard.forEach((player, index) => {

    const row =
      document.createElement("div");

    row.className =
      `leader-row rank-${index + 1}`;


    row.innerHTML = `
      <span class="leader-rank">
        ${String(index + 1).padStart(2, "0")}
      </span>

      <span class="leader-name">
        ${escapeHTML(
          player.profiles?.username || "Unknown"
        )}
      </span>

      <span class="leader-score">
        ${player.score}
      </span>

      <span class="leader-accuracy">
        ${player.accuracy}%
      </span>

      <span class="leader-reaction">
        ${
          player.reaction
            ? `${player.reaction}ms`
            : "—"
        }
      </span>
    `;


    list.appendChild(row);

  });

}


/* ================= SECURITY HELPER ================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

/* ================= SHARE RESULT ================= */

function updateShareCard(
  accuracy,
  averageReaction
) {

  shareCardScore.textContent = score;

  shareCardAccuracy.textContent =
    `${accuracy}%`;

  shareCardReaction.textContent =
    averageReaction
      ? `${averageReaction}ms`
      : "—";

  shareCardBestRound.textContent =
    bestRoundName;

  shareCardUsername.textContent =
    navUsername.textContent || "player";

  const now = new Date();

  shareCardDate.textContent =
    now.toLocaleDateString("en-US", {
     month: "short",
     day: "2-digit",
     year: "numeric"
  }).toUpperCase();

}


/* ================= GENERATE RESULT IMAGE ================= */

async function generateResultImage() {

  if (
    typeof html2canvas === "undefined"
  ) {

    throw new Error(
      "Result image library is not loaded."
    );

  }


  const canvas =
    await html2canvas(
      resultShareCard,
      {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false
      }
    );


  return canvas;

}


/* ================= SAVE RESULT ================= */

async function saveResultImage() {

  try {

    const canvas =
      await generateResultImage();


    canvas.toBlob(
      blob => {

        if (!blob) {
          alert("Could not create result image.");
          return;
        }


        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");


        link.href = url;

        link.download =
          `pulse-${score}-result.png`;


        document.body.appendChild(link);

        link.click();

        link.remove();


        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);

      },
      "image/png"
    );

  } catch (error) {

    console.error(
      "Failed to save result:",
      error
    );

    alert(
      "Could not create the result image."
    );

  }

}


/* ================= SHARE RESULT ================= */

async function shareResult() {

  try {

    const canvas =
      await generateResultImage();


    const blob =
      await new Promise(resolve =>
        canvas.toBlob(
          resolve,
          "image/png"
        )
      );


    if (!blob) {
      throw new Error(
        "Could not create image."
      );
    }


    const file =
      new File(
        [blob],
        `pulse-${score}-result.png`,
        {
          type: "image/png"
        }
      );


    const shareText =
      `I just scored ${score} on PULSE.\n\nCan you beat me?`;


    /* MOBILE FILE SHARE */

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [file]
      })
    ) {

      await navigator.share({

        title: "My PULSE Result",

        text: shareText,

        files: [file]

      });

      return;

    }


    /* NORMAL SHARE */

    if (navigator.share) {

      await navigator.share({

        title: "My PULSE Result",

        text: shareText,

        url: window.location.href

      });

      return;

    }


    /* DESKTOP FALLBACK */

    await saveResultImage();

  } catch (error) {

    if (error.name === "AbortError") {
      return;
    }

    console.error(
      "Share failed:",
      error
    );

    await saveResultImage();

  }

}


/* ================= WHATSAPP ================= */

function shareToWhatsApp() {

  const shareText =
    `I just scored ${score} on PULSE.\n\n` +
    `Can you beat my score?\n\n` +
    `${window.location.origin}${window.location.pathname}`;


  const whatsappURL =
    `https://wa.me/?text=${encodeURIComponent(
      shareText
    )}`;


  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );

}


/* ================= RESULT BUTTONS ================= */

shareResultButton.addEventListener(
  "click",
  shareResult
);


saveResultButton.addEventListener(
  "click",
  saveResultImage
);


whatsappResultButton.addEventListener(
  "click",
  shareToWhatsApp
);

onboardingNext.addEventListener("click", async () => {
  if (onboardingIndex < onboardingSteps.length - 1) {
    onboardingIndex++;
    renderOnboarding();
  } else {
    const {
      data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {
      showScreen(authScreen);
      return;
    }

    const { error } = await supabaseClient
      .from("profiles")
      .update({
        onboarding_completed: true
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    showScreen(homeScreen);
    setupDailyPulse();
  }
});



/* =========================
   PULSE MUSIC SEARCH
========================= */

const musicSearchInput = document.getElementById("musicSearchInput");
const musicSearchButton = document.getElementById("musicSearchButton");
const musicSearchResults = document.getElementById("musicSearchResults");
const musicPlay = document.getElementById("musicPlay");
const musicTitle = document.getElementById("musicTitle");
const musicArtist = document.getElementById("musicArtist");
const musicCover = document.querySelector(".music-cover");

let musicAudio = new Audio();
let currentTrack = null;
let searchRequestId = 0;


/* =========================
   HELPERS
========================= */

function escapeMusicHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function setMusicStatus(message, loading = false) {
  musicSearchResults.innerHTML = `
    <div class="music-search-status ${loading ? "is-loading" : ""}">
      ${escapeMusicHTML(message)}
    </div>
  `;
}


/* =========================
   PLAY TRACK
========================= */

async function playMusicTrack(track, card = null) {
  if (!track) return;

  const streamUrl = track.streamUrl;

  if (!streamUrl) {
    setMusicStatus("This song can't be played right now.");
    return;
  }

  // Same track → pause / resume
  if (currentTrack?.id === track.id) {
    if (musicAudio.paused) {
      await musicAudio.play();
    } else {
      musicAudio.pause();
    }

    updateMusicCards();
    updateMusicPlayer();
    return;
  }

  // New track
  musicAudio.pause();

  currentTrack = track;
  musicAudio.src = streamUrl;

  musicTitle.textContent = track.title;
  musicArtist.textContent = track.artist;

  if (musicCover) {
    musicCover.innerHTML = track.cover
      ? `<img src="${escapeMusicHTML(track.cover)}" alt="">`
      : "♪";
  }

  try {
    await musicAudio.play();
  } catch (error) {
    console.error("Music playback error:", error);
  }

  updateMusicCards();
  updateMusicPlayer();
}


function updateMusicPlayer() {
  if (!musicPlay) return;

  musicPlay.textContent = musicAudio.paused ? "▶" : "Ⅱ";
}


function updateMusicCards() {
  document.querySelectorAll(".music-result").forEach(card => {
    const id = card.dataset.trackId;

    const isCurrent = currentTrack && id === String(currentTrack.id);
    const isPlaying = isCurrent && !musicAudio.paused;

    card.classList.toggle("is-active", isCurrent);
    card.classList.toggle("is-playing", isPlaying);

    const button = card.querySelector(".music-result-play");

    if (button) {
      button.textContent = isPlaying ? "Ⅱ" : "▶";
    }
  });
}


musicAudio.addEventListener("play", () => {
  updateMusicCards();
  updateMusicPlayer();
});


musicAudio.addEventListener("pause", () => {
  updateMusicCards();
  updateMusicPlayer();
});


musicAudio.addEventListener("ended", () => {
  updateMusicCards();
  updateMusicPlayer();
});


/* =========================
   SEARCH
========================= */

async function searchMusic() {
  const query = musicSearchInput.value.trim();

  if (!query) {
    setMusicStatus("Search for a song or artist.");
    return;
  }

  const requestId = ++searchRequestId;

  musicSearchButton.disabled = true;

  setMusicStatus("Searching...", true);

  try {
    const response = await fetch(
      `https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(query)}&limit=20`
    );

    if (!response.ok) {
      throw new Error("Search request failed");
    }

    const data = await response.json();

    // Ignore old requests
    if (requestId !== searchRequestId) return;

    const tracks = (data.data || [])
      .filter(track => track?.id)
      .map(track => ({
        id: track.id,
        title: track.title || "Untitled",
        artist: track.user?.name || "Unknown artist",
        cover:
          track.artwork?.["480x480"] ||
          track.artwork?.["150x150"] ||
          track.artwork?.["1000x1000"] ||
          "",
        streamUrl:
          track.streamUrl ||
          `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream`
      }));

    if (!tracks.length) {
      setMusicStatus("No songs found.");
      return;
    }

    renderMusicResults(tracks);

/* expand after successful search */
requestAnimationFrame(() => {
  musicPanel?.classList.add("music-expanded");
});

    expandMusicPanel();

  } catch (error) {
    console.error("Music search error:", error);

    if (requestId === searchRequestId) {
      setMusicStatus("Something went wrong. Try again.");
    }
  } finally {
    if (requestId === searchRequestId) {
      musicSearchButton.disabled = false;
    }
  }
}


/* =========================
   RENDER HORIZONTAL RESULTS
========================= */

function renderMusicResults(tracks) {
  musicSearchResults.innerHTML = `
    <div class="music-results-heading">
      <span>SEARCH RESULTS</span>
      <span>${tracks.length} songs</span>
    </div>

    <div class="music-results-carousel">
      ${tracks.map(track => `
        <button
          class="music-result"
          type="button"
          data-track-id="${escapeMusicHTML(track.id)}"
        >
          <div class="music-result-cover">
            ${
              track.cover
                ? `<img
                    src="${escapeMusicHTML(track.cover)}"
                    alt=""
                    loading="lazy"
                  >`
                : "♪"
            }
          </div>

          <div class="music-result-info">
            <div class="music-result-title">
              ${escapeMusicHTML(track.title)}
            </div>

            <div class="music-result-artist">
              ${escapeMusicHTML(track.artist)}
            </div>
          </div>

          <span class="music-result-play">▶</span>
        </button>
      `).join("")}
    </div>
  `;

  musicSearchResults
    .querySelectorAll(".music-result")
    .forEach(card => {
      const track = tracks.find(
        item => String(item.id) === String(card.dataset.trackId)
      );

      card.addEventListener("click", () => {
        playMusicTrack(track, card);
      });
    });

  updateMusicCards();
}


/* =========================
   SEARCH EVENTS
========================= */

musicSearchButton?.addEventListener("click", searchMusic);

musicSearchInput?.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchMusic();
  }
});


/* =========================
   MAIN PLAYER BUTTON
========================= */

musicPlay?.addEventListener("click", async () => {
  if (!currentTrack) return;

  if (musicAudio.paused) {
    try {
      await musicAudio.play();
    } catch (error) {
      console.error(error);
    }
  } else {
    musicAudio.pause();
  }

  updateMusicCards();
  updateMusicPlayer();
});

/* =========================
   MUSIC PANEL
========================= */

const musicButton = document.getElementById("musicButton");
const musicPanel = document.getElementById("musicPanel");
const closeMusic = document.getElementById("closeMusic");


musicButton?.addEventListener("click", () => {

  musicPanel?.classList.add("open");

});


closeMusic?.addEventListener("click", () => {

  musicPanel?.classList.remove("open");
  musicPanel?.classList.remove("music-expanded");

});


document.addEventListener("keydown", event => {

  if (event.key === "Escape") {

    musicPanel?.classList.remove("open");
    musicPanel?.classList.remove("music-expanded");

  }

});