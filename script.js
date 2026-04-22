// ============================================================
// DOM REFERENCES
// Grabbing elements from the HTML so we can read/update them
// ============================================================

const mortgageForm = document.querySelector(".form");
const clearBtn = document.querySelector(".clear-all");

const amountInput = document.getElementById("amount");
const termInput = document.getElementById("term");
const rateInput = document.getElementById("interest");
const radioInputs = document.querySelectorAll('input[name="mortgage-type"]');
const currencySelect = document.getElementById("currency");

const emptyResults = document.querySelector(".results-empty");
const completedResults = document.querySelector(".results-completed");

const monthlyResultDisplay = document.querySelector(".main-result");
const totalResultDisplay = document.querySelector(".secondary-result");

// ============================================================
// SHARED STATE
// These are defined outside all event listeners so every
// listener can read and update them (this is called "scope")
// ============================================================

// Intl.NumberFormat formats numbers as currency automatically
// e.g. 1797.74 becomes £1,797.74 or $1,797.74
// We use "let" so we can reassign it when the currency changes
let currencyFormatter = new Intl.NumberFormat(navigator.language, {
  style: "currency",
  currency: "GBP", // default matches the dropdown's default option
});

// Store the last calculated values outside so the currency
// change listener can reformat them without recalculating
let monthlyPayment = 0;
let totalPayment = 0;

// ============================================================
// CURRENCY DROPDOWN
// When the user changes currency, we:
// 1. Rebuild the formatter with the new currency code
// 2. If results are already showing, reformat them instantly
// ============================================================

currencySelect.addEventListener("change", function () {
  // this.value is "GBP", "USD", or "EUR" from the dropdown
  currencyFormatter = new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: this.value,
  });

  // Only update the display if results are currently visible
  if (completedResults.style.display === "block") {
    monthlyResultDisplay.textContent = currencyFormatter.format(monthlyPayment);
    totalResultDisplay.textContent = currencyFormatter.format(totalPayment);
  }
});

// ============================================================
// FORM SUBMISSION
// Runs when the user clicks "Calculate Repayments"
// ============================================================

mortgageForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop the page from refreshing on submit

  // Read and convert input values to numbers
  const amount = parseFloat(amountInput.value);
  const term = parseFloat(termInput.value);
  const interest = parseFloat(rateInput.value);

  // Check which radio button is selected (repayment or interest-only)
  const mortgageType = document.querySelector(
    'input[name="mortgage-type"]:checked',
  );
  const mortgageTypeValue = mortgageType ? mortgageType.value : "N/A";

  // ---- Validation ----
  // Add error styles if any field is empty or invalid

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

  // Stop here if anything is invalid — don't calculate
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

  // ---- Calculations ----

  const monthlyRate = interest / 100 / 12; // Convert annual % to monthly decimal
  const numberOfPayments = term * 12; // Convert years to months

  if (mortgageTypeValue === "repayment") {
    // Formula: M = P[r(1+r)^n] / [(1+r)^n - 1]
    // P = principal, r = monthly rate, n = number of payments
    monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    totalPayment = monthlyPayment * numberOfPayments;
  } else {
    // Interest only: you only pay interest each month, not the principal
    monthlyPayment = amount * monthlyRate;
    totalPayment = monthlyPayment * numberOfPayments;
  }

  // ---- Display Results ----
  // currencyFormatter.format() handles the symbol, commas, and decimals
  monthlyResultDisplay.textContent = currencyFormatter.format(monthlyPayment);
  totalResultDisplay.textContent = currencyFormatter.format(totalPayment);

  // Swap which panel is visible
  emptyResults.style.display = "none";
  completedResults.style.display = "block";
});

// ============================================================
// CLEAR BUTTON
// Resets the results panel and removes all error states
// ============================================================

clearBtn.addEventListener("click", function () {
  emptyResults.style.display = "block";
  completedResults.style.display = "none";

  // Remove error highlight from all input wrappers
  document.querySelectorAll(".input-wrapper").forEach((wrapper) => {
    wrapper.classList.remove("error");
  });

  // Hide all error messages
  document.querySelectorAll(".error-message").forEach((msg) => {
    msg.classList.remove("visible");
  });
});

// ============================================================
// INLINE VALIDATION
// Remove error state as soon as the user starts typing.
// clearError is defined once and reused across all inputs
// (DRY principle - Don't Repeat Yourself)
// "this" refers to whichever input triggered the event
// ============================================================

function clearError() {
  if (this.value.trim() !== "") {
    this.parentElement.classList.remove("error");
    this.parentElement.nextElementSibling.classList.remove("visible");
  }
}

// Attach the same function to all three inputs in one go
[amountInput, termInput, rateInput].forEach((input) => {
  input.addEventListener("input", clearError);
});

// Clear the radio error as soon as any option is selected
radioInputs.forEach((radio) => {
  radio.addEventListener("change", function () {
    document.querySelector(".radio-error").classList.remove("visible");
  });
});
