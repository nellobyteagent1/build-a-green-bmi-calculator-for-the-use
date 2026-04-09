let unit = 'metric';

function setUnit(u) {
  unit = u;
  document.getElementById('fields-metric').style.display = u === 'metric' ? 'block' : 'none';
  document.getElementById('fields-imperial').style.display = u === 'imperial' ? 'block' : 'none';
  document.querySelectorAll('.unit-toggle button').forEach(b => b.classList.remove('active'));
  document.querySelector(`.unit-toggle button:${u === 'metric' ? 'first' : 'last'}-child`).classList.add('active');
  clearErrors();
  document.getElementById('result').classList.remove('show');
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(e => e.textContent = '');
  document.querySelectorAll('input').forEach(e => e.classList.remove('invalid'));
}

function setError(id, inputId, msg) {
  document.getElementById(id).textContent = msg;
  if (inputId) document.getElementById(inputId).classList.add('invalid');
}

function calculate() {
  clearErrors();
  let weightKg, heightM, valid = true;

  if (unit === 'metric') {
    const w = parseFloat(document.getElementById('weight-kg').value);
    const h = parseFloat(document.getElementById('height-cm').value);
    if (!w || w <= 0 || w > 500) { setError('err-wkg', 'weight-kg', 'Enter a valid weight (1-500 kg)'); valid = false; }
    if (!h || h <= 0 || h > 300) { setError('err-hcm', 'height-cm', 'Enter a valid height (30-300 cm)'); valid = false; }
    weightKg = w;
    heightM = h / 100;
  } else {
    const w = parseFloat(document.getElementById('weight-lb').value);
    const ft = parseFloat(document.getElementById('height-ft').value) || 0;
    const inch = parseFloat(document.getElementById('height-in').value) || 0;
    if (!w || w <= 0 || w > 1100) { setError('err-wlb', 'weight-lb', 'Enter a valid weight (1-1100 lb)'); valid = false; }
    const totalIn = ft * 12 + inch;
    if (totalIn <= 0 || totalIn > 108) { setError('err-himp', null, 'Enter a valid height'); valid = false; }
    weightKg = w * 0.453592;
    heightM = totalIn * 0.0254;
  }

  if (!valid) return;

  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  let category, catClass, range;
  if (bmi < 18.5) { category = 'Underweight'; catClass = 'cat-underweight'; range = 'BMI < 18.5'; }
  else if (bmi < 25) { category = 'Normal weight'; catClass = 'cat-normal'; range = '18.5 - 24.9'; }
  else if (bmi < 30) { category = 'Overweight'; catClass = 'cat-overweight'; range = '25.0 - 29.9'; }
  else if (bmi < 35) { category = 'Obese (Class I)'; catClass = 'cat-obese1'; range = '30.0 - 34.9'; }
  else if (bmi < 40) { category = 'Obese (Class II)'; catClass = 'cat-obese2'; range = '35.0 - 39.9'; }
  else { category = 'Obese (Class III)'; catClass = 'cat-obese3'; range = 'BMI >= 40'; }

  const valEl = document.getElementById('bmi-value');
  valEl.textContent = rounded;
  valEl.className = 'bmi-value ' + catClass;

  const catEl = document.getElementById('bmi-category');
  catEl.textContent = category;
  catEl.className = 'bmi-category ' + catClass;

  document.getElementById('bmi-range').textContent = range;

  // Position indicator: map BMI 10-50 to 0%-100%
  const pct = Math.min(100, Math.max(0, ((bmi - 10) / 40) * 100));
  document.getElementById('bar-indicator').style.left = pct + '%';

  document.getElementById('result').classList.add('show');
}

// Allow Enter key to trigger calculation
document.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
