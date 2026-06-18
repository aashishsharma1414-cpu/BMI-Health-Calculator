/* ============================================================
   script.js — JavaScript (Interactivity)
   Project  : BMI Health Calculator
   Course   : CET138 Full Stack Development
   Covers   : DOM manipulation, event listeners, validation,
              arithmetic, conditional logic, animation
   ============================================================ */

/* ────────────────────────────────────────
   1. UNIT TOGGLE
   Listens for changes on the <select> and
   shows/hides the correct input fields.
   ──────────────────────────────────────── */
document.getElementById('unit-select').addEventListener('change', function () {
  const isMetric = this.value === 'metric';

  // Show metric fields, hide imperial (or vice versa)
  document.getElementById('height-metric').classList.toggle('d-none', !isMetric);
  document.getElementById('weight-metric').classList.toggle('d-none', !isMetric);
  document.getElementById('height-imperial').classList.toggle('d-none', isMetric);
  document.getElementById('weight-imperial').classList.toggle('d-none', isMetric);

  // Clear the result when switching units
  resetForm(false);
});

/* ────────────────────────────────────────
   2. MAIN CALCULATION FUNCTION
   Called by the "Calculate BMI" button.
   ──────────────────────────────────────── */
function calculateBMI() {
  const unit = document.getElementById('unit-select').value;

  // Hide any previous error
  document.getElementById('error-msg').style.display = 'none';

  let heightM, weightKg;

  // ── Read and convert inputs ──
  if (unit === 'metric') {
    const cm = parseFloat(document.getElementById('height-cm').value);
    const kg = parseFloat(document.getElementById('weight-kg').value);

    // Validate inputs
    if (!cm || !kg || cm <= 0 || kg <= 0) {
      return showError('Please enter valid height and weight.');
    }

    heightM  = cm / 100;       // centimetres → metres
    weightKg = kg;

  } else {
    // Imperial: feet + inches → metres, pounds → kg
    const ft  = parseFloat(document.getElementById('height-ft').value) || 0;
    const ins = parseFloat(document.getElementById('height-in').value) || 0;
    const lbs = parseFloat(document.getElementById('weight-lbs').value);

    if ((!ft && !ins) || !lbs) {
      return showError('Please enter valid height and weight.');
    }

    heightM  = ((ft * 12) + ins) * 0.0254;   // total inches → metres
    weightKg = lbs * 0.453592;                // pounds → kg
  }

  // ── Range sanity checks ──
  if (heightM < 0.5 || heightM > 3.0) return showError('Height seems out of range.');
  if (weightKg < 1  || weightKg > 500) return showError('Weight seems out of range.');

  // ── BMI formula: weight(kg) / height(m)² ──
  const bmi = weightKg / (heightM * heightM);

  // Pass result to display function
  showResult(bmi);
}

/* ────────────────────────────────────────
   3. DISPLAY RESULT
   Updates the DOM with the BMI value,
   category, colour class, marker position,
   and personalised advice text.
   ──────────────────────────────────────── */
function showResult(bmi) {
  const box         = document.getElementById('result-box');
  const placeholder = document.getElementById('result-placeholder');
  const valueEl     = document.getElementById('bmi-value');
  const labelEl     = document.getElementById('bmi-label');
  const adviceEl    = document.getElementById('advice-text');
  const marker      = document.getElementById('scale-marker');

  // ── Conditional logic: determine category ──
  let category, cssClass, advice;

  if (bmi < 18.5) {
    category = 'Underweight';
    cssClass = 'cat-underweight';
    advice   = 'You may be underweight. Consider consulting a nutritionist to reach a healthy weight.';

  } else if (bmi < 25) {
    category = 'Normal weight';
    cssClass = 'cat-normal';
    advice   = 'Great job! Your BMI is in the healthy range. Keep up your balanced diet and active lifestyle.';

  } else if (bmi < 30) {
    category = 'Overweight';
    cssClass = 'cat-overweight';
    advice   = 'You are slightly above the healthy range. Small lifestyle adjustments can make a big difference.';

  } else {
    category = 'Obese';
    cssClass = 'cat-obese';
    advice   = 'Your BMI falls in the obese range. Speaking with a healthcare professional is recommended.';
  }

  // ── Update text content ──
  valueEl.textContent  = bmi.toFixed(1);  // round to 1 decimal place
  labelEl.textContent  = category;
  adviceEl.textContent = advice;

  // ── Apply colour class to result box ──
  box.className = '';                       // clear previous classes
  box.classList.add('show', cssClass);      // 'show' triggers CSS animation

  // ── Animate the marker on the scale bar ──
  // Map BMI range 10–40 onto 0–100% of the bar width
  const pct = Math.min(Math.max(((bmi - 10) / 30) * 100, 2), 98);
  marker.style.left = pct + '%';           // CSS transition handles animation

  // ── Swap placeholder for result ──
  placeholder.style.display = 'none';
}

/* ────────────────────────────────────────
   4. ERROR DISPLAY
   Shows an inline error message.
   ──────────────────────────────────────── */
function showError(message) {
  const el = document.getElementById('error-msg');
  el.textContent     = message;
  el.style.display   = 'block';
}

/* ────────────────────────────────────────
   5. RESET FUNCTION
   Clears all inputs and hides the result.
   ──────────────────────────────────────── */
function resetForm(clearUnit = true) {
  // Clear all number inputs
  const inputIds = ['height-cm', 'height-ft', 'height-in', 'weight-kg', 'weight-lbs', 'age'];
  inputIds.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Hide error
  document.getElementById('error-msg').style.display = 'none';

  // Hide result, show placeholder
  const resultBox = document.getElementById('result-box');
  resultBox.className    = '';
  resultBox.style.display = 'none';
  document.getElementById('result-placeholder').style.display = '';
}

/* ────────────────────────────────────────
   6. KEYBOARD SHORTCUT
   Press Enter anywhere to calculate.
   ──────────────────────────────────────── */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    calculateBMI();
  }
});
