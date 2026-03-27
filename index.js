// ── NDA modal ──────────────────────────────────────
  // Override the showNDAModal / closeNDAModal from index.js
  // to use class toggling instead of style.display = 'flex'
  window.showNDAModal = function() {
    const modal = document.getElementById('ndaModal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.pendingRegistrationData) {
      const d = window.pendingRegistrationData;
      const ln = modal.querySelector('[name="learnername"]');
      const gr = modal.querySelector('[name="ndaGrade"]');
      if (ln && (d.first_name || d.last_name))
        ln.value = (d.first_name + ' ' + d.last_name).trim();
      if (gr && d.grade) gr.value = d.grade;
    }
  };
  window.closeNDAModal = function() {
    const modal = document.getElementById('ndaModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  };
  window.addEventListener('click', e => {
    const modal = document.getElementById('ndaModal');
    if (e.target === modal) window.closeNDAModal();
  });
 
  // ── Nav ────────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const nav        = document.getElementById('mainNav');
 
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
 
  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
 
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });



// Store registration data temporarily for NDA flow
let pendingRegistrationData = null;

// API base
// - When hosting the site publicly, use Render
// - When running locally, allow localhost override
const API_BASE =
  window.API_BASE ||
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://young-seeds-academy.onrender.com');

async function handleSubmit(e, formType) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  let endpoint, successId;
  
  // Match formType to endpoint
  if (formType === 'registration' || formType === 'regSuccess') {
    endpoint = `${API_BASE}/api/registrations`;
    successId = 'regSuccess';
    pendingRegistrationData = data; // Save for NDA
  } else if (formType === 'contact' || formType === 'contactSuccess') {
    endpoint = `${API_BASE}/api/contacts`;
    successId = 'contactSuccess';
  } else {
    alert('Unknown form type. Please refresh and try again.');
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      // Show success message
      const successEl = document.getElementById(successId);
      if (successEl) {
        successEl.style.display = 'block';
        setTimeout(() => { successEl.style.display = 'none'; }, 5000);
      }
      
      form.reset();
      
      // After registration, show NDA modal
      if (formType === 'registration' || formType === 'regSuccess') {
        setTimeout(showNDAModal, 1500);
      }
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('Could not connect to server. Is it running?');
  }
}

// NDA Modal Functions
function showNDAModal() {
  const modal = document.getElementById('ndaModal');
  if (modal) {
    modal.style.display = 'flex';
    // Pre-fill if we have registration data
    if (pendingRegistrationData) {
      const fname = pendingRegistrationData.first_name || '';
      const lname = pendingRegistrationData.last_name || '';
      const grade = pendingRegistrationData.grade || '';
      
      const learnerInput = document.querySelector('[name="learnername"]');
      const gradeInput = document.querySelector('[name="ndaGrade"]');
      
      if (learnerInput && (fname || lname)) {
        learnerInput.value = `${fname} ${lname}`.trim();
      }
      // Registration uses values like "Grade 9" which match the NDA dropdown options.
      if (gradeInput && grade) {
        gradeInput.value = grade;
      }
    }
  }
}

function closeNDAModal() {
  const modal = document.getElementById('ndaModal');
  if (modal) modal.style.display = 'none';
}

async function handleNDASubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Attach registration data if available
  if (pendingRegistrationData) {
    data.registration_data = pendingRegistrationData;
  }
  data.signed_at = new Date().toISOString();
  
  try {
    const response = await fetch(`${API_BASE}/api/ndaAgreement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      alert('✅ Agreement signed! Welcome to Young Seeds Academy!');
      closeNDAModal();
      pendingRegistrationData = null;
      form.reset();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    console.error('NDA error:', err);
    alert('Could not save agreement. Please contact us directly.');
  }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('ndaModal');
  if (e.target === modal) closeNDAModal();
});
    const posts = {

        trig: `
    <div class="post-tag-hero">Trigonometry</div>
    <h1>How to Master Trigonometry Without the Confusion</h1>
    <div class="post-meta">By TK Maile ◾ 12 min read</div>

    <p>Trigonometry often feels intimidating at first — but once you understand what sine, cosine, and tangent actually <em>mean</em>, everything clicks into place. This guide walks you through every concept step by step, with real examples you can follow from start to finish.</p>

    <h2>What Is Trigonometry?</h2>
    <p>Trigonometry is the branch of mathematics that studies the relationships between the <strong>angles</strong> and <strong>sides</strong> of triangles. The word itself comes from the Greek words <em>trigonon</em> (triangle) and <em>metron</em> (measure) — so it literally means "measuring triangles."</p>
    <p>It is most commonly applied to <strong>right-angled triangles</strong> — triangles that contain one angle of exactly 90°. The 90° angle is usually marked with a small square in diagrams.</p>
    <p>Trigonometry is used everywhere in the real world — in architecture, engineering, navigation, physics, and even in how your phone screen detects touch. Understanding it opens the door to all of those fields.</p>

    <h2>Labelling the Sides of a Right Triangle</h2>
    <p>Before you can use any trigonometric ratio, you must correctly label the three sides of the triangle <strong>relative to the angle you are working with</strong>. The labels change depending on which angle you choose — so always start here.</p>
    <ul>
        <li><strong>Hypotenuse</strong> — the longest side, always opposite the 90° angle. It never changes regardless of which angle you pick.</li>
        <li><strong>Opposite</strong> — the side directly across from your chosen angle. It does not touch that angle.</li>
        <li><strong>Adjacent</strong> — the side next to your chosen angle (that is not the hypotenuse). It runs from the angle to the right angle.</li>
    </ul>
    <p>For example, if your triangle has angles of 90°, 40°, and 50°, and you choose to work with the 40° angle, then the side facing it is the Opposite, and the side running alongside it is the Adjacent.</p>

    <h2>The Three Core Ratios — SOH-CAH-TOA</h2>
    <p>Every trigonometry problem involving a right triangle uses one of three ratios. The acronym <strong>SOH-CAH-TOA</strong> is the most reliable way to remember them:</p>
    <ul>
        <li><strong>SOH</strong> — Sine = Opposite ÷ Hypotenuse</li>
        <li><strong>CAH</strong> — Cosine = Adjacent ÷ Hypotenuse</li>
        <li><strong>TOA</strong> — Tangent = Opposite ÷ Adjacent</li>
    </ul>
    <p>Written as a formula:</p>
    <pre>sin(θ) = Opposite / Hypotenuse
cos(θ) = Adjacent / Hypotenuse
tan(θ) = Opposite / Adjacent</pre>
    <p>The Greek letter <strong>θ</strong> (theta) is simply used as a placeholder for the angle. You will see it in almost every trig problem.</p>

    <h2>How to Choose the Right Ratio</h2>
    <p>This is where most students get stuck. The trick is simple — look at what you <strong>know</strong> and what you <strong>want to find</strong>, then pick the ratio that connects those two things.</p>
    <ul>
        <li>You know the angle and the <strong>Hypotenuse</strong>, and want the <strong>Opposite</strong> → use <strong>Sine</strong></li>
        <li>You know the angle and the <strong>Hypotenuse</strong>, and want the <strong>Adjacent</strong> → use <strong>Cosine</strong></li>
        <li>You know the angle and the <strong>Adjacent</strong>, and want the <strong>Opposite</strong> → use <strong>Tangent</strong></li>
        <li>You know two sides and want the <strong>angle</strong> → use the inverse (sin⁻¹, cos⁻¹, or tan⁻¹)</li>
    </ul>

    <h2>Example 1 — Finding a Missing Side Using Sine</h2>
    <p>A ladder leans against a wall at an angle of 60° from the ground. The ladder is 5 m long. How high up the wall does it reach?</p>
    <p><strong>Step 1 — Identify what you know and what you need.</strong><br>
    The angle is 60°. The ladder is the Hypotenuse (5 m). You want the height, which is the Opposite side.</p>
    <p><strong>Step 2 — Choose the correct ratio.</strong><br>
    You have the Hypotenuse and want the Opposite → use <strong>Sine</strong>.</p>
    <p><strong>Step 3 — Write the formula and solve.</strong></p>
    <pre>sin(θ) = Opposite ÷ Hypotenuse
sin(60°) = h ÷ 5
h = 5 × sin(60°)
h = 5 × 0.866
h ≈ 4.33 m</pre>
    <p>The ladder reaches approximately <strong>4.33 m</strong> up the wall.</p>

    <h2>Example 2 — Finding a Missing Side Using Cosine</h2>
    <p>A roof beam is 8 m long and is set at an angle of 35° to the horizontal ceiling. How far does the beam stretch horizontally?</p>
    <p><strong>Step 1</strong> — The angle is 35°. The beam is the Hypotenuse (8 m). The horizontal distance is the Adjacent side.</p>
    <p><strong>Step 2</strong> — You have the Hypotenuse and want the Adjacent → use <strong>Cosine</strong>.</p>
    <pre>cos(θ) = Adjacent ÷ Hypotenuse
cos(35°) = x ÷ 8
x = 8 × cos(35°)
x = 8 × 0.819
x ≈ 6.55 m</pre>
    <p>The beam stretches approximately <strong>6.55 m</strong> horizontally.</p>

    <h2>Example 3 — Finding a Missing Side Using Tangent</h2>
    <p>A surveyor stands 50 m away from the base of a building and measures the angle to the top as 42°. How tall is the building?</p>
    <p><strong>Step 1</strong> — The angle is 42°. The 50 m is the Adjacent side (horizontal ground). The height is the Opposite side.</p>
    <p><strong>Step 2</strong> — You have the Adjacent and want the Opposite → use <strong>Tangent</strong>.</p>
    <pre>tan(θ) = Opposite ÷ Adjacent
tan(42°) = h ÷ 50
h = 50 × tan(42°)
h = 50 × 0.9004
h ≈ 45.02 m</pre>
    <p>The building is approximately <strong>45 m</strong> tall.</p>

    <h2>Finding a Missing Angle — Using Inverse Trig</h2>
    <p>When you already know two sides and need to find an angle, you reverse the process using the <strong>inverse trigonometric functions</strong>:</p>
    <ul>
        <li>sin⁻¹ — pronounced "inverse sine" or "arc sine"</li>
        <li>cos⁻¹ — pronounced "inverse cosine" or "arc cosine"</li>
        <li>tan⁻¹ — pronounced "inverse tangent" or "arc tangent"</li>
    </ul>
    <p>On your calculator, these are usually labelled as <strong>2nd → sin</strong>, <strong>2nd → cos</strong>, and <strong>2nd → tan</strong>.</p>

    <h2>Example 4 — Finding an Angle Using Inverse Tangent</h2>
    <p>A ramp rises 3 m over a horizontal distance of 7 m. What angle does it make with the ground?</p>
    <p><strong>Step 1</strong> — The height (3 m) is the Opposite. The horizontal distance (7 m) is the Adjacent. You want the angle.</p>
    <p><strong>Step 2</strong> — Since you have Opposite and Adjacent, use <strong>Tangent</strong>, then invert it to find the angle.</p>
    <pre>tan(θ) = Opposite ÷ Adjacent
tan(θ) = 3 ÷ 7
tan(θ) = 0.4286
θ = tan⁻¹(0.4286)
θ ≈ 23.2°</pre>
    <p>The ramp makes an angle of approximately <strong>23.2°</strong> with the ground.</p>

    <h2>Example 5 — Finding an Angle Using Inverse Sine</h2>
    <p>A zip line cable is 20 m long and is anchored to the ground 12 m away from the base of the pole. What angle does the cable make with the ground?</p>
    <p><strong>Step 1</strong> — Wait — we need to think carefully here. The 20 m cable is the Hypotenuse. The 12 m ground distance is the Adjacent. So we use Cosine and invert it.</p>
    <pre>cos(θ) = Adjacent ÷ Hypotenuse
cos(θ) = 12 ÷ 20
cos(θ) = 0.6
θ = cos⁻¹(0.6)
θ ≈ 53.1°</pre>
    <p>The zip line makes an angle of approximately <strong>53.1°</strong> with the ground.</p>

    <h2>Example 6 — A Full Problem from Scratch</h2>
    <p>A kite is flying on a string 30 m long. The string makes an angle of 55° with the ground. How high is the kite, and how far along the ground is it from the person holding it?</p>
    <p><strong>Finding the height (Opposite):</strong></p>
    <pre>sin(55°) = Opposite ÷ Hypotenuse
sin(55°) = h ÷ 30
h = 30 × sin(55°)
h = 30 × 0.819
h ≈ 24.57 m</pre>
    <p><strong>Finding the ground distance (Adjacent):</strong></p>
    <pre>cos(55°) = Adjacent ÷ Hypotenuse
cos(55°) = d ÷ 30
d = 30 × cos(55°)
d = 30 × 0.574
d ≈ 17.21 m</pre>
    <p>The kite is approximately <strong>24.57 m high</strong> and <strong>17.21 m along the ground</strong> from the person.</p>

    <h2>Special Angles You Should Know by Heart</h2>
    <p>These three angles come up so often that memorising their exact values will save you a lot of time in tests:</p>
    <pre>Angle    sin       cos       tan
─────────────────────────────────────
  30°     0.5      0.866     0.577
  45°    0.707     0.707      1.0
  60°    0.866      0.5      1.732</pre>
    <p>Notice that sin 30° = cos 60°, and sin 60° = cos 30°. This is not a coincidence — they are complementary angles (they add up to 90°), and sine and cosine always swap values for complementary pairs.</p>

    <h2>Common Mistakes to Avoid</h2>
    <ul>
        <li><strong>Using the wrong side as Opposite or Adjacent.</strong> Always re-label the sides for the specific angle you are working with — the labels are not fixed to the triangle, they depend on your chosen angle.</li>
        <li><strong>Calculator in the wrong mode.</strong> If your answers look completely wrong, check that your calculator is set to <strong>Degrees</strong>, not Radians. Radians are used in higher-level maths but not at this stage.</li>
        <li><strong>Forgetting to invert when finding an angle.</strong> If you are solving for the angle itself, you must use sin⁻¹, cos⁻¹, or tan⁻¹ — not just sin, cos, or tan.</li>
        <li><strong>Rounding too early.</strong> Keep full decimal values in your working and only round your final answer. Rounding halfway through causes errors.</li>
        <li><strong>Mixing up the formula direction.</strong> sin(θ) = O/H means you divide. If you rearrange to find O, you multiply: O = H × sin(θ). Write this step out explicitly every time.</li>
    </ul>

    <h2>Key Tips — Quick Revision</h2>
    <ul>
        <li>Always start by labelling Hypotenuse, Opposite, and Adjacent relative to your chosen angle.</li>
        <li>Use <strong>SOH-CAH-TOA</strong> to choose the correct ratio.</li>
        <li>Use inverse functions (sin⁻¹, cos⁻¹, tan⁻¹) only when solving for an unknown <strong>angle</strong>.</li>
        <li>Memorise the special angles: 30°, 45°, and 60°.</li>
        <li>Always check your calculator is in <strong>degree mode</strong>.</li>
        <li>Round only at the very end of your working.</li>
    </ul>
`,

algebra: `
    <div class="post-tag-hero">Algebra</div>
    <h1>Understanding Quadratic Equations Made Easy</h1>
    <div class="post-meta">By TK Maile ◾ 14 min read</div>

    <p>Quadratic equations appear constantly in mathematics — in projectile motion, area problems, financial modelling, and engineering design. Once you have a reliable method for solving them, an enormous part of the maths curriculum becomes manageable. This guide covers every method in full detail with worked examples for each.</p>

    <h2>What Is a Quadratic Equation?</h2>
    <p>A quadratic equation is any equation that can be written in the form:</p>
    <pre>ax² + bx + c = 0</pre>
    <p>where <strong>a</strong>, <strong>b</strong>, and <strong>c</strong> are numbers, and <strong>a ≠ 0</strong> (if a were zero, the x² term would disappear and it would no longer be quadratic).</p>
    <p>The highest power of x is 2 — that is the defining feature. The word "quadratic" comes from the Latin <em>quadratus</em>, meaning square, referring to the x² term.</p>
    <p>Examples of quadratic equations:</p>
    <pre>x² + 5x + 6 = 0       (a=1, b=5, c=6)
2x² - 3x - 2 = 0      (a=2, b=-3, c=-2)
x² - 9 = 0            (a=1, b=0, c=-9)
3x² + 12x = 0         (a=3, b=12, c=0)</pre>

    <h2>Step Zero — Always Rearrange First</h2>
    <p>Before applying any method, make sure your equation equals <strong>zero</strong> on one side. This is the most commonly skipped step and causes avoidable errors.</p>
    <pre>x² + 3x = 10          ← not ready yet
x² + 3x - 10 = 0      ← now you can solve it

2x² = 5x - 3          ← not ready yet
2x² - 5x + 3 = 0      ← now you can solve it</pre>

    <h2>Method 1 — Factoring</h2>
    <p>Factoring is the fastest method when it works. The idea is to rewrite the quadratic as a product of two brackets, then use the <strong>zero product rule</strong>: if two things multiply to give zero, then at least one of them must be zero.</p>
    <p>For a quadratic in the form x² + bx + c = 0, you are looking for two numbers that:</p>
    <ul>
        <li><strong>Multiply</strong> to give c</li>
        <li><strong>Add</strong> to give b</li>
    </ul>

    <h3>Example 1 — Simple Factoring</h3>
    <pre>x² + 7x + 12 = 0

Find two numbers that multiply to 12 and add to 7:
→ 3 × 4 = 12  and  3 + 4 = 7  ✓

(x + 3)(x + 4) = 0
x + 3 = 0   →   x = -3
x + 4 = 0   →   x = -4</pre>

    <h3>Example 2 — Factoring With a Negative c</h3>
    <pre>x² + 2x - 15 = 0

Find two numbers that multiply to -15 and add to 2:
→ 5 × (-3) = -15  and  5 + (-3) = 2  ✓

(x + 5)(x - 3) = 0
x = -5   or   x = 3</pre>

    <h3>Example 3 — Factoring With a Negative b and Negative c</h3>
    <pre>x² - x - 6 = 0

Find two numbers that multiply to -6 and add to -1:
→ (-3) × 2 = -6  and  (-3) + 2 = -1  ✓

(x - 3)(x + 2) = 0
x = 3   or   x = -2</pre>

    <h3>Example 4 — Difference of Two Squares</h3>
    <p>When b = 0, you have a special pattern called the <strong>difference of two squares</strong>:</p>
    <pre>x² - 25 = 0
(x + 5)(x - 5) = 0
x = -5   or   x = 5</pre>
    <p>The pattern is always: a² - b² = (a + b)(a - b). Memorising this saves a lot of time.</p>

    <h3>Example 5 — Factoring Out a Common Factor First</h3>
    <pre>3x² + 12x = 0

Always check for a common factor first:
3x(x + 4) = 0
3x = 0   →   x = 0
x + 4 = 0  →   x = -4</pre>
    <p>Never divide both sides by x to eliminate it — you would lose the solution x = 0. Always factor it out instead.</p>

    <h2>Method 2 — The Quadratic Formula</h2>
    <p>The quadratic formula works for <strong>every</strong> quadratic equation, regardless of whether it factors neatly or not. It is your most reliable tool and worth memorising completely:</p>
    <pre>x = (-b ± √(b² - 4ac)) ÷ 2a</pre>
    <p>The ± symbol means you calculate two answers — one using addition and one using subtraction. This gives you both solutions in one formula.</p>

    <h3>Example 6 — Straightforward Application</h3>
    <pre>x² + 5x + 6 = 0
a = 1,  b = 5,  c = 6

x = (-5 ± √(25 - 24)) ÷ 2
x = (-5 ± √1) ÷ 2
x = (-5 ± 1) ÷ 2

x = (-5 + 1) ÷ 2 = -4 ÷ 2 = -2
x = (-5 - 1) ÷ 2 = -6 ÷ 2 = -3</pre>
    <p>Solutions: x = -2 or x = -3 (matches our factoring result — good check!)</p>

    <h3>Example 7 — When Factoring Is Not Obvious</h3>
    <pre>2x² + 3x - 2 = 0
a = 2,  b = 3,  c = -2

x = (-3 ± √(9 - 4(2)(-2))) ÷ 2(2)
x = (-3 ± √(9 + 16)) ÷ 4
x = (-3 ± √25) ÷ 4
x = (-3 ± 5) ÷ 4

x = (-3 + 5) ÷ 4 = 2 ÷ 4 = 0.5
x = (-3 - 5) ÷ 4 = -8 ÷ 4 = -2</pre>

    <h3>Example 8 — Decimal Solutions</h3>
    <pre>x² - 4x + 1 = 0
a = 1,  b = -4,  c = 1

x = (4 ± √(16 - 4)) ÷ 2
x = (4 ± √12) ÷ 2
x = (4 ± 3.464) ÷ 2

x = (4 + 3.464) ÷ 2 = 7.464 ÷ 2 ≈ 3.73
x = (4 - 3.464) ÷ 2 = 0.536 ÷ 2 ≈ 0.27</pre>
    <p>This equation does not factor neatly — the quadratic formula handles it perfectly.</p>

    <h2>Method 3 — Completing the Square</h2>
    <p>Completing the square is a technique that rewrites the quadratic in the form <strong>(x + p)² = q</strong>, which you can then solve by taking a square root. It is also how the quadratic formula is derived.</p>
    <p>The steps are:</p>
    <ul>
        <li>Move the constant (c) to the right-hand side</li>
        <li>Take half of b, square it, and add it to both sides</li>
        <li>Factor the left side as a perfect square</li>
        <li>Take the square root of both sides (remember ±)</li>
        <li>Solve for x</li>
    </ul>

    <h3>Example 9 — Completing the Square Step by Step</h3>
    <pre>x² + 8x + 7 = 0

Step 1 — Move the constant:
x² + 8x = -7

Step 2 — Half of 8 is 4. Square it: 4² = 16. Add to both sides:
x² + 8x + 16 = -7 + 16
x² + 8x + 16 = 9

Step 3 — Factor the left side:
(x + 4)² = 9

Step 4 — Square root both sides:
x + 4 = ±3

Step 5 — Solve:
x = -4 + 3 = -1
x = -4 - 3 = -7</pre>

    <h3>Example 10 — Completing the Square With a Leading Coefficient</h3>
    <pre>2x² + 12x + 10 = 0

Step 1 — Divide everything by 2 first:
x² + 6x + 5 = 0

Step 2 — Move the constant:
x² + 6x = -5

Step 3 — Half of 6 is 3. Square it: 9. Add to both sides:
x² + 6x + 9 = -5 + 9 = 4

Step 4 — Factor:
(x + 3)² = 4

Step 5 — Square root and solve:
x + 3 = ±2
x = -1   or   x = -5</pre>

    <h2>The Discriminant — Predicting Your Solutions</h2>
    <p>The expression <strong>b² - 4ac</strong> inside the square root of the quadratic formula is called the <strong>discriminant</strong>. It tells you what kind of solutions to expect before you even solve the equation.</p>
    <pre>Discriminant = b² - 4ac</pre>
    <ul>
        <li><strong>Positive (> 0)</strong> → two distinct real solutions. The parabola crosses the x-axis at two points.</li>
        <li><strong>Zero (= 0)</strong> → one repeated solution (called a double root). The parabola just touches the x-axis at one point.</li>
        <li><strong>Negative (< 0)</strong> → no real solutions. The parabola does not cross the x-axis at all.</li>
    </ul>

    <h3>Example 11 — Using the Discriminant</h3>
    <pre>Equation 1: x² - 6x + 9 = 0
b² - 4ac = 36 - 36 = 0  → one repeated root

Equation 2: x² - 5x + 4 = 0
b² - 4ac = 25 - 16 = 9  → two real solutions

Equation 3: x² + 2x + 5 = 0
b² - 4ac = 4 - 20 = -16 → no real solutions</pre>
    <p>For Equation 1: x = 6 ÷ 2 = 3, so x = 3 is the only solution (a double root).</p>
    <p>For Equation 3: there is no real answer — the parabola floats entirely above the x-axis and never intersects it.</p>

    <h2>Choosing the Right Method</h2>
    <ul>
        <li><strong>Try factoring first</strong> — if you can spot the two numbers quickly, it is by far the fastest method.</li>
        <li><strong>Use the quadratic formula</strong> when factoring is not obvious, when coefficients are large, or when you expect decimal answers.</li>
        <li><strong>Use completing the square</strong> when the question specifically asks for it, or when you need to find the vertex of a parabola.</li>
        <li><strong>Check the discriminant first</strong> when you want to know how many solutions exist before committing to a full calculation.</li>
    </ul>

    <h2>Common Mistakes to Avoid</h2>
    <ul>
        <li><strong>Not rearranging to zero first.</strong> Every method requires the equation to equal zero. Do this before anything else.</li>
        <li><strong>Losing a solution by dividing by x.</strong> If x appears as a factor, never divide it away — factor it out and set it equal to zero to keep x = 0 as a solution.</li>
        <li><strong>Sign errors in the quadratic formula.</strong> When b is negative (e.g. b = -4), remember that -b becomes +4. Write out a = ?, b = ?, c = ? before substituting to keep track.</li>
        <li><strong>Forgetting the ± in the formula.</strong> The ± is what gives you two solutions. If you only calculate one, you have an incomplete answer.</li>
        <li><strong>Rounding the square root too early.</strong> Keep √ values exact for as long as possible and only round in the final step.</li>
        <li><strong>Not checking your answers.</strong> Always substitute both solutions back into the original equation to verify they are correct.</li>
    </ul>

    <h2>Key Tips — Quick Revision</h2>
    <ul>
        <li>Always rearrange to <strong>ax² + bx + c = 0</strong> before solving.</li>
        <li>Try <strong>factoring first</strong> — it is fastest when it works.</li>
        <li>The <strong>quadratic formula</strong> works for every quadratic, always.</li>
        <li>The <strong>discriminant</strong> (b² - 4ac) tells you how many solutions to expect.</li>
        <li>Never divide both sides by x — <strong>factor it out</strong> instead.</li>
        <li>Always write out <strong>a, b, c</strong> separately before using the formula.</li>
        <li>Verify both answers by substituting back into the original equation.</li>
    </ul>
`,

        functions: `
    <div class="post-tag-hero">Functions</div>
    <h1>Functions in Real Life: Inputs, Outputs & More</h1>
    <div class="post-meta">By TK Maile ◾ 12 min read</div>

    <p>A function is one of the most important ideas in all of mathematics — and once you truly understand it, you will see it everywhere. From calculating a taxi fare to predicting the temperature tomorrow, functions are the language mathematics uses to describe how one thing depends on another.</p>

    <h2>What Is a Function?</h2>
    <p>A function is a rule that takes an <strong>input</strong> and produces exactly <strong>one output</strong>. The key word is <em>exactly one</em> — for every input you put in, there is one and only one result that comes out.</p>
    <p>Think of a vending machine. You press button B3 (input), and out comes a specific snack (output). You will never press B3 and get two different snacks at the same time. That reliability is what makes it a function.</p>
    <p>A relationship that gives <strong>two or more outputs for the same input</strong> is <strong>not</strong> a function. For example, if pressing B3 sometimes gave you chips and other times gave you juice, that machine would be broken — and in mathematics, that relationship would not qualify as a function.</p>

    <h2>Function Notation — What Does f(x) Mean?</h2>
    <p><strong>f(x)</strong> is read as "f of x." It is simply a way of saying: "apply the rule named <em>f</em> to the input value <em>x</em>."</p>
    <p>The letter <em>f</em> is the name of the function. You can name a function anything — f, g, h, or even something like C or A. The letter in brackets is always the input variable.</p>
    <pre>f(x) = 3x + 2</pre>
    <p>This means: take any value of x, multiply it by 3, then add 2. That is the rule. Whatever x you put in, that calculation produces the output.</p>
    <p>Important: <strong>f(x) does not mean f multiplied by x.</strong> It is a label for the output of the function when the input is x. This confuses many students at first — just remember it is notation, not multiplication.</p>

    <h2>Evaluating a Function — Substituting Values</h2>
    <p>To evaluate a function means to find the output for a specific input. You do this by replacing every x in the rule with the given value.</p>

    <h2>Example 1 — Basic Substitution</h2>
    <pre>f(x) = 3x + 2

f(5)  = 3(5)  + 2 = 15 + 2 = 17
f(0)  = 3(0)  + 2 =  0 + 2 =  2
f(-4) = 3(-4) + 2 = -12 + 2 = -10
f(½)  = 3(½)  + 2 = 1.5 + 2 = 3.5</pre>
    <p>Notice how every x in the formula is replaced — including in cases where x is negative or a fraction. Always substitute carefully and use brackets to avoid sign errors.</p>

    <h2>Example 2 — Evaluating a Quadratic Function</h2>
    <pre>g(x) = x² - 5x + 4

g(1)  = (1)²  - 5(1)  + 4 = 1  -  5 + 4 =  0
g(4)  = (4)²  - 5(4)  + 4 = 16 - 20 + 4 =  0
g(0)  = (0)²  - 5(0)  + 4 = 0  -  0 + 4 =  4
g(-2) = (-2)² - 5(-2) + 4 = 4  + 10 + 4 = 18
g(3)  = (3)²  - 5(3)  + 4 = 9  - 15 + 4 = -2</pre>
    <p>Notice that g(1) = 0 and g(4) = 0. These are called the <strong>roots</strong> or <strong>zeros</strong> of the function — the x values where the output is zero. On a graph, these are the points where the curve crosses the x-axis.</p>

    <h2>Example 3 — A Real-Life Linear Function: Taxi Fare</h2>
    <p>A taxi company charges a R20 booking fee plus R7 per kilometre travelled. We can write this as a function where k is the number of kilometres:</p>
    <pre>C(k) = 7k + 20

C(0)  = 7(0)  + 20 =   0 + 20 = R20   ← just the booking fee
C(5)  = 7(5)  + 20 =  35 + 20 = R55
C(10) = 7(10) + 20 =  70 + 20 = R90
C(15) = 7(15) + 20 = 105 + 20 = R125
C(25) = 7(25) + 20 = 175 + 20 = R195</pre>
    <p>This function tells us the cost of any trip instantly. If a friend says their Uber charged them R90, you can work backwards: 7k + 20 = 90, so k = 10 km.</p>

    <h2>Example 4 — A Real-Life Quadratic Function: Projectile Height</h2>
    <p>A ball is thrown upward. Its height in metres after t seconds is given by:</p>
    <pre>h(t) = -5t² + 20t

h(0) = -5(0)² + 20(0) = 0 m        ← ball at ground level
h(1) = -5(1)² + 20(1) = -5 + 20 = 15 m
h(2) = -5(2)² + 20(2) = -20 + 40 = 20 m   ← maximum height
h(3) = -5(3)² + 20(3) = -45 + 60 = 15 m
h(4) = -5(4)² + 20(4) = -80 + 80 = 0 m    ← ball lands</pre>
    <p>Notice the symmetry — h(1) = h(3) = 15 m. The ball reaches the same height on the way up and on the way down. The maximum height of <strong>20 m</strong> happens at t = 2 seconds, exactly halfway through the flight.</p>

    <h2>Domain and Range</h2>
    <p>Every function has two important sets associated with it:</p>
    <ul>
        <li><strong>Domain</strong> — the set of all valid <em>input</em> values (x values) that the function will accept. Think of it as the list of inputs the vending machine will respond to.</li>
        <li><strong>Range</strong> — the set of all possible <em>output</em> values (y values) the function can produce. Think of it as all the snacks the machine is capable of giving you.</li>
    </ul>

    <h2>Example 5 — Finding Domain and Range</h2>
    <p>For the taxi function C(k) = 7k + 20:</p>
    <ul>
        <li><strong>Domain:</strong> k ≥ 0 — you cannot travel a negative number of kilometres.</li>
        <li><strong>Range:</strong> C ≥ 20 — the minimum cost is R20 (the booking fee at k = 0).</li>
    </ul>
    <p>For the ball height function h(t) = -5t² + 20t:</p>
    <ul>
        <li><strong>Domain:</strong> 0 ≤ t ≤ 4 — the ball is in the air only between t = 0 and t = 4 seconds.</li>
        <li><strong>Range:</strong> 0 ≤ h ≤ 20 — the height varies from ground level (0 m) up to the maximum (20 m).</li>
    </ul>

    <h2>The Vertical Line Test</h2>
    <p>When a function is drawn on a graph, you can check whether it is truly a function using the <strong>vertical line test</strong>:</p>
    <p>Draw (or imagine) a vertical line anywhere on the graph. If that vertical line crosses the graph at <strong>more than one point</strong>, the graph does <strong>not</strong> represent a function — because one x value would be producing two different y values.</p>
    <ul>
        <li>A straight line → passes the test ✓ (it is a function)</li>
        <li>A parabola (U shape) → passes the test ✓ (it is a function)</li>
        <li>A full circle → fails the test ✗ (not a function — a vertical line through the middle hits two points)</li>
    </ul>

    <h2>Types of Functions You Will Meet</h2>

    <h3>Linear Functions — f(x) = mx + c</h3>
    <p>These produce a straight line on a graph. The value <strong>m</strong> is the gradient (how steep the line is), and <strong>c</strong> is the y-intercept (where the line crosses the y-axis).</p>
    <pre>f(x) = 2x + 1
f(0) = 1    ← y-intercept
f(3) = 7
f(-1) = -1</pre>

    <h3>Quadratic Functions — f(x) = ax² + bx + c</h3>
    <p>These produce a U-shaped curve called a <strong>parabola</strong>. If a is positive the parabola opens upward; if a is negative it opens downward.</p>
    <pre>f(x) = x² - 4
f(0)  = -4   ← minimum point on the curve
f(2)  =  0   ← crosses x-axis here
f(-2) =  0   ← crosses x-axis here too</pre>

    <h3>Constant Functions — f(x) = c</h3>
    <p>The output is always the same no matter what you input. For example f(x) = 7 means every input gives output 7. On a graph this is a flat horizontal line.</p>
    <pre>f(x) = 7
f(1) = 7,  f(100) = 7,  f(-50) = 7</pre>

    <h2>Example 6 — Working Backwards: Finding x from the Output</h2>
    <p>Sometimes you are given the output and need to find what input produced it. This is called solving for x.</p>
    <pre>f(x) = 4x - 3   and   f(x) = 13

4x - 3 = 13
4x = 16
x = 4</pre>
    <p>Check: f(4) = 4(4) - 3 = 16 - 3 = 13 ✓</p>
    <pre>g(x) = x² + 2   and   g(x) = 27

x² + 2 = 27
x² = 25
x = 5   or   x = -5</pre>
    <p>Both x = 5 and x = -5 are valid answers here — both inputs produce an output of 27. Check: g(5) = 25 + 2 = 27 ✓ and g(-5) = 25 + 2 = 27 ✓</p>

    <h2>Common Mistakes to Avoid</h2>
    <ul>
        <li><strong>Thinking f(x) means multiplication.</strong> f(x) is function notation — it means "the output of f when the input is x." It is never f times x.</li>
        <li><strong>Forgetting brackets when substituting negatives.</strong> If x = -3 and f(x) = x², write f(-3) = (-3)² = 9, not -3² = -9. The brackets make a critical difference.</li>
        <li><strong>Confusing domain and range.</strong> Domain is always about the <em>inputs</em> (x), range is always about the <em>outputs</em> (y). If you get them mixed up, remember: D comes before R in the alphabet, just as inputs come before outputs.</li>
        <li><strong>Assuming every graph is a function.</strong> Always apply the vertical line test before treating a graph as a function.</li>
        <li><strong>Only finding one answer when solving backwards.</strong> Quadratic functions can give two x values for the same output — always check for both positive and negative solutions.</li>
    </ul>

    <h2>Key Tips — Quick Revision</h2>
    <ul>
        <li>A function gives exactly <strong>one output</strong> for every input — no exceptions.</li>
        <li>f(x) is notation, not multiplication.</li>
        <li>When evaluating, replace <strong>every x</strong> with the given value and use brackets around negatives.</li>
        <li><strong>Domain</strong> = valid inputs. <strong>Range</strong> = possible outputs.</li>
        <li>Use the <strong>vertical line test</strong> to confirm a graph represents a function.</li>
        <li>When solving for x, remember quadratics can have <strong>two solutions</strong>.</li>
        <li>Always verify your answer by substituting it back into the original function.</li>
    </ul>
`,
    };

    function openPost(id) {
        document.getElementById('postBody').innerHTML = posts[id];
        document.getElementById('postOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
    }

    function closePost() {
        document.getElementById('postOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close with Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePost();
    });
