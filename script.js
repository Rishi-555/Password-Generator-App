// DOM elements
const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.getElementById("uppercaseCheck");
const lowercaseCheck = document.getElementById("lowercaseCheck");
const numbersCheck = document.getElementById("numbersCheck");
const symbolsCheck = document.getElementById("symbolsCheck");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.getElementById("generateBtn");

let password = "";
let passwordLength = 10; // default
let checkCount = 0;

// update slider UI
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}
handleSlider();

// random integer helper
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// generators
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91)); // A–Z
}
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123)); // a–z
}
function generateRandomNumber() {
  return String.fromCharCode(getRndInteger(48, 58)); // 0–9
}
function generateSymbol() {
  const symbols = "!@#$%^&*(){}[]=<>/,.";
  return symbols.charAt(getRndInteger(0, symbols.length));
}

// shuffle password
function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

// strength indicator
function calcStrength() {
  let hasUpper = uppercaseCheck.checked;
  let hasLower = lowercaseCheck.checked;
  let hasNum = numbersCheck.checked;
  let hasSym = symbolsCheck.checked;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0"); // strong
  } else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6) {
    setIndicator("#ff0"); // medium
  } else {
    setIndicator("#f00"); // weak
  }
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// checkbox change
function handleCheckBoxChange() {
  checkCount = 0;
  [uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  // adjust password length if needed
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

// slider input
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// generate password
generateBtn.addEventListener("click", () => {
  handleCheckBoxChange();
  if (checkCount === 0) return;

  password = "";
  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
  if (numbersCheck.checked) funcArr.push(generateRandomNumber);
  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  // compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  // shuffle
  password = shufflePassword(Array.from(password));

  // show in UI
  passwordDisplay.value = password;

  // strength
  calcStrength();
});

// copy password
copyBtn.addEventListener("click", async () => {
  if (passwordDisplay.value) {
    try {
      await navigator.clipboard.writeText(passwordDisplay.value);
      copyMsg.innerText = "Copied!";
    } catch (e) {
      copyMsg.innerText = "Failed!";
    }
    setTimeout(() => {
      copyMsg.innerText = "";
    }, 2000);
  }
});
