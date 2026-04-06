// The Form and Clear Button (using classes since there are no IDs)
const mortgageForm = document.querySelector(".form");
const clearBtn = document.querySelector(".clear-all");

// The Input Fields (using your specific IDs)
const amountInput = document.getElementById("amount");
const termInput = document.getElementById("term");
const rateInput = document.getElementById("interest");
const radioInputs = document.querySelectorAll('input[name="mortgage-type"]');
const currencySelect = document.getElementById("currency");

// Display Areas
const emptyResults = document.querySelector(".results-empty");
const completedResults = document.querySelector(".results-completed");

// Result Spans
const monthlyResultDisplay = document.querySelector(".main-result");
const totalResultDisplay = document.querySelector(".secondary-result");

/*
// Event Listener for Form Submission
mortgageForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form from submitting and refreshing the page

  // Get input values and trim whitespace
  const amountValue = parseFloat(amountInput.value.trim());
  const termValue = parseFloat(termInput.value.trim());
  const rateValue = parseFloat(rateInput.value.trim()) / 100; // Convert percentage to decimal

  // Validate inputs
  if (
    isNaN(amountValue) ||
    isNaN(termValue) ||
    isNaN(rateValue) ||
    amountValue <= 0 ||
    termValue <= 0 ||
    rateValue < 0
  ) {
    alert(
      "Please enter valid positive numbers for Amount, Term, and Interest Rate.",
    );
    return;
  }

  // Calculate monthly payment using the formula: M = P[r(1+r)^n]/[(1+r)^n-1]
  const monthlyRate = rateValue / 12;
  const numberOfPayments = termValue * 12;
  const monthlyPayment =
    (amountValue * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  // Calculate total payment
  const totalPayment = monthlyPayment * numberOfPayments;
  // Display results
  monthlyResultDisplay.textContent = `£${monthlyPayment.toFixed(2)}`;
  totalResultDisplay.textContent = `£${totalPayment.toFixed(2)}`;

  // Show completed results and hide empty results
  emptyResults.style.display = "none";
  completedResults.style.display = "block";
});

// Event Listener for Clear Button
clearBtn.addEventListener("click", function () {
  // Clear input fields
  amountInput.value = "";
  termInput.value = "";
  rateInput.value = "";
  radioInputs.forEach((radio) => (radio.checked = false)); // Uncheck all radio buttons
  emptyResults.style.display = "block";
  completedResults.style.display = "none";
});

*/
let currencySymbol = "£"; // Default to GBP

const currencySymbols = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

currencySelect.addEventListener("change", function () {
  const selectedCurrency = this.value;

  currencySymbol = currencySymbols[selectedCurrency] || "£"; // Fallback to GBP if something goes wrong

  if (completedResults.style.display === "block") {
    // results are visible, update the symbols
    monthlyResultDisplay.textContent = `${currencySymbol}${monthlyResultDisplay.textContent.slice(1)}`;
    totalResultDisplay.textContent = `${currencySymbol}${totalResultDisplay.textContent.slice(1)}`;
  }
});

mortgageForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form from submitting and refreshing the page

  const amount = parseFloat(amountInput.value);
  const term = parseFloat(termInput.value);
  const interest = parseFloat(rateInput.value);

  const mortgageType = document.querySelector(
    'input[name="mortgage-type"]:checked',
  );
  const mortgageTypeValue = mortgageType ? mortgageType.value : "N/A";

  // error handling for invalid inputs

  if (isNaN(amount) || amount <= 0) {
    amountInput.parentElement.classList.add("error");
    amountInput.parentElement.nextElementSibling.classList.add("visible");
  }

  if (isNaN(term) || term <= 0) {
    termInput.parentElement.classList.add("error");
    termInput.parentElement.nextElementSibling.classList.add("visible");
  }

  if (isNaN(interest) || interest <= 0) {
    rateInput.parentElement.classList.add("error");
    rateInput.parentElement.nextElementSibling.classList.add("visible");
  }

  if (mortgageTypeValue === "N/A") {
    document.querySelector(".radio-error").classList.add("visible");
  }

  // Stop execution if any field is invalid
  if (
    isNaN(amount) ||
    isNaN(term) ||
    isNaN(interest) ||
    mortgageTypeValue === "N/A" ||
    amount <= 0 ||
    term <= 0 ||
    interest <= 0
  ) {
    return;
  }

  // Calculations

  const monthlyRate = interest / 100 / 12;
  const numberOfPayments = term * 12;

  let monthlyPayment;
  let totalPayment;

  if (mortgageTypeValue === "repayment") {
    // your repayment formula goes here
    // Calculate monthly payment using the formula: M = P[r(1+r)^n]/[(1+r)^n-1]
    monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    totalPayment = monthlyPayment * numberOfPayments;
  } else {
    monthlyPayment = amount * monthlyRate;
    totalPayment = monthlyPayment * numberOfPayments;
  }

  // Display results
  monthlyResultDisplay.textContent = `${currencySymbol}${monthlyPayment.toFixed(2)}`;
  totalResultDisplay.textContent = `${currencySymbol}${totalPayment.toFixed(2)}`;

  // Show completed results and hide empty results
  emptyResults.style.display = "none";
  completedResults.style.display = "block";
});

// Event Listener for Clear Button
clearBtn.addEventListener("click", function () {
  // Clear input fields
  emptyResults.style.display = "block";
  completedResults.style.display = "none";

  // Remove all error states
  document.querySelectorAll(".input-wrapper").forEach((wrapper) => {
    wrapper.classList.remove("error");
  });

  // for loop version - same thing
  // const wrappers = document.querySelectorAll(".input-wrapper");
  // for (let i = 0; i < wrappers.length; i++) {
  //   wrappers[i].classList.remove("error");

  document.querySelectorAll(".error-message").forEach((msg) => {
    msg.classList.remove("visible");
  });
});

amountInput.addEventListener("input", function () {
  if (this.value.trim() !== "") {
    this.parentElement.classList.remove("error");
    this.parentElement.nextElementSibling.classList.remove("visible");
  }
});

termInput.addEventListener("input", function () {
  if (this.value.trim() !== "") {
    this.parentElement.classList.remove("error");
    this.parentElement.nextElementSibling.classList.remove("visible");
  }
});

rateInput.addEventListener("input", function () {
  if (this.value.trim() !== "") {
    this.parentElement.classList.remove("error");
    this.parentElement.nextElementSibling.classList.remove("visible");
  }
});
