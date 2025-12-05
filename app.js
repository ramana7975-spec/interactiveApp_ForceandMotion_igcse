// Navigation between topics
function showTopic(topicId, evt) {
    // Hide all sections
    const sections = document.querySelectorAll('.topic-section');
    sections.forEach(section => section.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected section
    const targetSection = document.getElementById(topicId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Add active class to clicked button
    // Use evt if passed, otherwise try to get the button by checking which one matches the topicId
    if (evt && evt.target) {
        evt.target.classList.add('active');
    } else {
        // Fallback: find and activate the correct button
        buttons.forEach(btn => {
            if (btn.textContent.toLowerCase().includes(topicId.replace('-', ' ').split(' ')[0])) {
                btn.classList.add('active');
            }
        });
    }
}

// =====================================================
// MOTION SIMULATION
// =====================================================
let motionAnimationId = null;
let motionTime = 0;
let isMotionAnimating = false;

function initMotion() {
    const canvas = document.getElementById('motion-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Event listeners
    document.getElementById('initial-velocity')?.addEventListener('input', updateMotionValues);
    document.getElementById('acceleration')?.addEventListener('input', updateMotionValues);
    document.getElementById('time-range')?.addEventListener('input', updateMotionValues);

    updateMotionValues();
    drawMotionGraph();
}

function updateMotionValues() {
    const u = parseFloat(document.getElementById('initial-velocity')?.value || 0);
    const a = parseFloat(document.getElementById('acceleration')?.value || 0);
    const t = parseFloat(document.getElementById('time-range')?.value || 10);

    document.getElementById('u-value').textContent = u;
    document.getElementById('a-value').textContent = a;
    document.getElementById('time-value').textContent = t;

    // Calculate values using equations of motion
    const v = u + a * t; // v = u + at
    const s = u * t + 0.5 * a * t * t; // s = ut + ½at²

    document.getElementById('final-velocity').textContent = v.toFixed(2);
    document.getElementById('displacement').textContent = s.toFixed(2);
    document.getElementById('distance-traveled').textContent = Math.abs(s).toFixed(2);

    drawMotionGraph();
    showAreaCalculation(u, v, t, s);
}

function showAreaCalculation(u, v, t, s) {
    const calculationDiv = document.getElementById('area-calculation');
    const stepsDiv = document.getElementById('calculation-steps');

    if (!calculationDiv || !stepsDiv) return;

    // Show the calculation box
    calculationDiv.style.display = 'block';

    // Build the explanation
    let html = '<div style="line-height: 1.8;">';

    html += '<p style="margin: 5px 0;"><strong>Key Principle:</strong> The area under a velocity-time graph represents the distance traveled.</p>';

    // Determine the shape
    if (u === 0) {
        // Triangle shape
        html += '<p style="margin: 10px 0;"><strong>Shape:</strong> Triangle (starting from rest)</p>';
        html += '<div style="background: white; padding: 12px; border-radius: 5px; margin: 10px 0;">';
        html += '<p style="margin: 5px 0;"><strong>Formula for Triangle:</strong></p>';
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 16px;">Area = ½ × base × height</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 16px;">Area = ½ × ${t} s × ${v.toFixed(2)} m/s</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 16px;">Area = ${(0.5 * t * v).toFixed(2)} m</p>`;
        html += '</div>';
    } else if (Math.abs(v - u) < 0.01) {
        // Rectangle shape (constant velocity)
        html += '<p style="margin: 10px 0;"><strong>Shape:</strong> Rectangle (constant velocity)</p>';
        html += '<div style="background: white; padding: 12px; border-radius: 5px; margin: 10px 0;">';
        html += '<p style="margin: 5px 0;"><strong>Formula for Rectangle:</strong></p>';
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 16px;">Area = length × width</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 16px;">Area = ${t} s × ${u.toFixed(2)} m/s</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 16px;">Area = ${(t * u).toFixed(2)} m</p>`;
        html += '</div>';
    } else {
        // Trapezoid shape
        html += '<p style="margin: 10px 0;"><strong>Shape:</strong> Trapezoid (changing velocity)</p>';
        html += '<div style="background: white; padding: 12px; border-radius: 5px; margin: 10px 0;">';
        html += '<p style="margin: 5px 0;"><strong>Method 1 - Trapezoid Formula:</strong></p>';
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 16px;">Area = ½ × (u + v) × t</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 16px;">Area = ½ × (${u.toFixed(2)} + ${v.toFixed(2)}) × ${t}</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 16px;">Area = ½ × ${(u + v).toFixed(2)} × ${t}</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 16px;">Area = ${(0.5 * (u + v) * t).toFixed(2)} m</p>`;
        html += '</div>';

        html += '<div style="background: white; padding: 12px; border-radius: 5px; margin: 10px 0;">';
        html += '<p style="margin: 5px 0;"><strong>Method 2 - Rectangle + Triangle:</strong></p>';
        html += `<p style="margin: 5px 0;">Rectangle area = ${u.toFixed(2)} × ${t} = ${(u * t).toFixed(2)} m</p>`;
        html += `<p style="margin: 5px 0;">Triangle area = ½ × ${t} × ${(v - u).toFixed(2)} = ${(0.5 * t * (v - u)).toFixed(2)} m</p>`;
        html += `<p style="margin: 5px 0; font-weight: bold;">Total area = ${(u * t).toFixed(2)} + ${(0.5 * t * (v - u)).toFixed(2)} = ${s.toFixed(2)} m</p>`;
        html += '</div>';
    }

    html += '<div style="background: #d4edda; padding: 10px; border-radius: 5px; margin-top: 10px; border: 2px solid #28a745;">';
    html += `<p style="margin: 5px 0; font-weight: bold; color: #155724;">✓ Distance Traveled = ${Math.abs(s).toFixed(2)} m</p>`;
    html += '</div>';

    html += '</div>';

    stepsDiv.innerHTML = html;
}

function drawMotionGraph() {
    const canvas = document.getElementById('motion-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const u = parseFloat(document.getElementById('initial-velocity')?.value || 0);
    const a = parseFloat(document.getElementById('acceleration')?.value || 0);
    const maxTime = parseFloat(document.getElementById('time-range')?.value || 10);

    // Calculate display parameters
    const maxV = Math.max(Math.abs(u), Math.abs(u + a * maxTime), 20);
    const scale = (height - 100) / (2 * maxV);
    const timeScale = (width - 80) / maxTime;

    // Draw shaded area under graph (if animation completed or not animating)
    if (!isMotionAnimating || motionTime >= maxTime) {
        ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        ctx.beginPath();
        ctx.moveTo(50, height - 50); // Start at origin

        for (let t = 0; t <= maxTime; t += 0.1) {
            const v = u + a * t;
            const x = 50 + t * timeScale;
            const y = height - 50 - v * scale;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(50 + maxTime * timeScale, height - 50); // Close to x-axis
        ctx.closePath();
        ctx.fill();

        // Add text on shaded area
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Area = Distance', width / 2 - 50, height / 2);
    }

    // Draw axes
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    ctx.lineTo(width - 30, height - 50); // x-axis
    ctx.moveTo(50, height - 50);
    ctx.lineTo(50, 30); // y-axis
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Time (s)', width - 100, height - 20);
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Velocity (m/s)', 0, 0);
    ctx.restore();

    // Draw grid
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const x = 50 + (width - 80) * i / 10;
        ctx.beginPath();
        ctx.moveTo(x, 30);
        ctx.lineTo(x, height - 50);
        ctx.stroke();

        const y = 30 + (height - 80) * i / 10;
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(width - 30, y);
        ctx.stroke();
    }

    // Draw velocity-time graph
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let t = 0; t <= maxTime; t += 0.1) {
        const v = u + a * t;
        const x = 50 + t * timeScale;
        const y = height - 50 - v * scale;

        if (t === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    // Draw current time indicator if animating
    if (isMotionAnimating && motionTime <= maxTime) {
        const currentV = u + a * motionTime;
        const x = 50 + motionTime * timeScale;
        const y = height - 50 - currentV * scale;

        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw vertical line
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, height - 50);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Mark time intervals
    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px Arial';
    for (let i = 0; i <= maxTime; i += maxTime / 5) {
        const x = 50 + i * timeScale;
        ctx.fillText(i.toFixed(1), x - 10, height - 30);
    }

    // Mark velocity intervals
    for (let i = -maxV; i <= maxV; i += maxV / 2) {
        const y = height - 50 - i * scale;
        ctx.fillText(i.toFixed(1), 10, y + 5);
    }
}

function toggleAnimation() {
    isMotionAnimating = !isMotionAnimating;
    if (isMotionAnimating) {
        motionTime = 0;
        // Hide calculation during animation
        const calculationDiv = document.getElementById('area-calculation');
        if (calculationDiv) calculationDiv.style.display = 'none';
        animateMotion();
    }
}

function animateMotion() {
    if (!isMotionAnimating) return;

    const maxTime = parseFloat(document.getElementById('time-range')?.value || 10);

    drawMotionGraph();

    motionTime += 0.1;

    if (motionTime <= maxTime) {
        motionAnimationId = requestAnimationFrame(animateMotion);
    } else {
        isMotionAnimating = false;
        motionTime = 0;

        // Show area calculation when animation completes
        const u = parseFloat(document.getElementById('initial-velocity')?.value || 0);
        const a = parseFloat(document.getElementById('acceleration')?.value || 0);
        const t = maxTime;
        const v = u + a * t;
        const s = u * t + 0.5 * a * t * t;

        drawMotionGraph(); // Redraw to show shaded area
        showAreaCalculation(u, v, t, s);
    }
}

function resetMotion() {
    isMotionAnimating = false;
    motionTime = 0;
    document.getElementById('initial-velocity').value = 0;
    document.getElementById('acceleration').value = 2;
    document.getElementById('time-range').value = 10;

    // Hide calculation on reset
    const calculationDiv = document.getElementById('area-calculation');
    if (calculationDiv) calculationDiv.style.display = 'none';

    updateMotionValues();
}

// =====================================================
// RESULTANT FORCE SIMULATION
// =====================================================
function initForce() {
    document.getElementById('force1-mag')?.addEventListener('input', updateForces);
    document.getElementById('force1-angle')?.addEventListener('input', updateForces);
    document.getElementById('force2-mag')?.addEventListener('input', updateForces);
    document.getElementById('force2-angle')?.addEventListener('input', updateForces);
    document.getElementById('mass')?.addEventListener('input', updateForces);

    updateForces();
}

function loadScenario(type) {
    const f1MagInput = document.getElementById('force1-mag');
    const f1AngleInput = document.getElementById('force1-angle');
    const f2MagInput = document.getElementById('force2-mag');
    const f2AngleInput = document.getElementById('force2-angle');
    const massInput = document.getElementById('mass');

    switch(type) {
        case 'same':
            // Same direction - both forces pointing right (0°)
            f1MagInput.value = 60;
            f1AngleInput.value = 0;
            f2MagInput.value = 40;
            f2AngleInput.value = 0;
            massInput.value = 10;
            break;
        case 'opposite':
            // Opposite direction - one left (180°), one right (0°)
            f1MagInput.value = 80;
            f1AngleInput.value = 0;
            f2MagInput.value = 50;
            f2AngleInput.value = 180;
            massInput.value = 10;
            break;
        case 'perpendicular':
            // 90 degrees - one right (0°), one up (90°)
            f1MagInput.value = 40;
            f1AngleInput.value = 0;
            f2MagInput.value = 30;
            f2AngleInput.value = 90;
            massInput.value = 10;
            break;
        case 'custom':
            // Custom scenario
            f1MagInput.value = 50;
            f1AngleInput.value = 45;
            f2MagInput.value = 35;
            f2AngleInput.value = 135;
            massInput.value = 10;
            break;
    }

    updateForces();
}

function updateForces() {
    const f1Mag = parseFloat(document.getElementById('force1-mag')?.value || 0);
    const f1Angle = parseFloat(document.getElementById('force1-angle')?.value || 0);
    const f2Mag = parseFloat(document.getElementById('force2-mag')?.value || 0);
    const f2Angle = parseFloat(document.getElementById('force2-angle')?.value || 0);
    const mass = parseFloat(document.getElementById('mass')?.value || 1);

    // Update display values
    document.getElementById('f1-mag-value').textContent = f1Mag;
    document.getElementById('f1-angle-value').textContent = f1Angle;
    document.getElementById('f2-mag-value').textContent = f2Mag;
    document.getElementById('f2-angle-value').textContent = f2Angle;
    document.getElementById('mass-value').textContent = mass;

    // Convert angles to radians
    const f1AngleRad = f1Angle * Math.PI / 180;
    const f2AngleRad = f2Angle * Math.PI / 180;

    // Calculate components
    const f1x = f1Mag * Math.cos(f1AngleRad);
    const f1y = f1Mag * Math.sin(f1AngleRad);
    const f2x = f2Mag * Math.cos(f2AngleRad);
    const f2y = f2Mag * Math.sin(f2AngleRad);

    // Calculate resultant components
    const rx = f1x + f2x;
    const ry = f1y + f2y;

    // Calculate resultant magnitude and angle
    const resultant = Math.sqrt(rx * rx + ry * ry);
    const angle = Math.atan2(ry, rx) * 180 / Math.PI;
    const acceleration = resultant / mass;

    // Update displays
    document.getElementById('f1-display').textContent = f1Mag.toFixed(2);
    document.getElementById('f1x-display').textContent = f1x.toFixed(2);
    document.getElementById('f1y-display').textContent = f1y.toFixed(2);

    document.getElementById('f2-display').textContent = f2Mag.toFixed(2);
    document.getElementById('f2x-display').textContent = f2x.toFixed(2);
    document.getElementById('f2y-display').textContent = f2y.toFixed(2);

    document.getElementById('resultant-force').textContent = resultant.toFixed(2);
    document.getElementById('force-angle').textContent = angle.toFixed(2);
    document.getElementById('rx-display').textContent = rx.toFixed(2);
    document.getElementById('ry-display').textContent = ry.toFixed(2);
    document.getElementById('force-acceleration').textContent = acceleration.toFixed(2);

    drawForceVectors();
    showForceCalculation(f1Mag, f1Angle, f2Mag, f2Angle, f1x, f1y, f2x, f2y, rx, ry, resultant, angle, mass, acceleration);
}

function showForceCalculation(f1Mag, f1Angle, f2Mag, f2Angle, f1x, f1y, f2x, f2y, rx, ry, resultant, angle, mass, accel) {
    const stepsDiv = document.getElementById('force-calc-steps');
    if (!stepsDiv) return;

    let html = '<div style="line-height: 1.8;">';

    // Determine scenario type
    const angleDiff = Math.abs(f1Angle - f2Angle);
    const isSameDirection = (angleDiff < 5 || angleDiff > 355);
    const isOppositeDirection = (Math.abs(angleDiff - 180) < 5);
    const isPerpendicular = (Math.abs(angleDiff - 90) < 5 || Math.abs(angleDiff - 270) < 5);

    if (isSameDirection) {
        html += '<div style="background: #d5f4e6; padding: 12px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #27ae60;">';
        html += '<p style="margin: 5px 0; font-weight: bold; color: #27ae60;">Scenario: Forces in SAME DIRECTION</p>';
        html += '<p style="margin: 10px 0;"><strong>Method:</strong> Simply add the forces</p>';
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">F₁ = ${f1Mag.toFixed(2)} N at ${f1Angle}°</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">F₂ = ${f2Mag.toFixed(2)} N at ${f2Angle}°</p>`;
        html += `<p style="margin: 10px 0; font-family: monospace; font-size: 16px; font-weight: bold;">Resultant = F₁ + F₂ = ${f1Mag.toFixed(2)} + ${f2Mag.toFixed(2)} = ${resultant.toFixed(2)} N</p>`;
        html += '</div>';
    } else if (isOppositeDirection) {
        html += '<div style="background: #fadbd8; padding: 12px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #e74c3c;">';
        html += '<p style="margin: 5px 0; font-weight: bold; color: #e74c3c;">Scenario: Forces in OPPOSITE DIRECTIONS</p>';
        html += '<p style="margin: 10px 0;"><strong>Method:</strong> Subtract smaller from larger</p>';
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">F₁ = ${f1Mag.toFixed(2)} N at ${f1Angle}°</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">F₂ = ${f2Mag.toFixed(2)} N at ${f2Angle}°</p>`;
        const larger = Math.max(f1Mag, f2Mag);
        const smaller = Math.min(f1Mag, f2Mag);
        html += `<p style="margin: 10px 0; font-family: monospace; font-size: 16px; font-weight: bold;">Resultant = ${larger.toFixed(2)} - ${smaller.toFixed(2)} = ${resultant.toFixed(2)} N</p>`;
        html += `<p style="margin: 5px 0;">Direction: ${angle.toFixed(2)}° (towards the larger force)</p>`;
        html += '</div>';
    } else if (isPerpendicular) {
        html += '<div style="background: #d6eaf8; padding: 12px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #3498db;">';
        html += '<p style="margin: 5px 0; font-weight: bold; color: #3498db;">Scenario: Forces at 90° (PERPENDICULAR)</p>';
        html += '<p style="margin: 10px 0;"><strong>Method:</strong> Use Pythagoras theorem</p>';
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">F₁ = ${f1Mag.toFixed(2)} N at ${f1Angle}°</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">F₂ = ${f2Mag.toFixed(2)} N at ${f2Angle}°</p>`;
        html += '<p style="margin: 10px 0;"><strong>Step 1:</strong> Calculate magnitude</p>';
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">Resultant² = F₁² + F₂²</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">Resultant² = ${f1Mag.toFixed(2)}² + ${f2Mag.toFixed(2)}² = ${(f1Mag*f1Mag).toFixed(2)} + ${(f2Mag*f2Mag).toFixed(2)} = ${(f1Mag*f1Mag + f2Mag*f2Mag).toFixed(2)}</p>`;
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 16px; font-weight: bold;">Resultant = √${(f1Mag*f1Mag + f2Mag*f2Mag).toFixed(2)} = ${resultant.toFixed(2)} N</p>`;
        html += '<p style="margin: 10px 0;"><strong>Step 2:</strong> Calculate direction</p>';
        html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">θ = ${angle.toFixed(2)}° from horizontal</p>`;
        html += '</div>';
    } else {
        // General case - use component method
        html += '<div style="background: #fff3cd; padding: 12px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #ffc107;">';
        html += '<p style="margin: 5px 0; font-weight: bold; color: #856404;">Scenario: General Case (Arbitrary Angles)</p>';
        html += '<p style="margin: 10px 0;"><strong>Method:</strong> Resolve into components and add</p>';
        html += '</div>';
    }

    // Always show component method
    html += '<div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">';
    html += '<h5 style="margin-top: 0;">Component Method (Works for all angles):</h5>';

    html += '<p style="margin: 10px 0;"><strong>Step 1:</strong> Resolve each force into x and y components</p>';
    html += '<div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">';
    html += `<p style="margin: 5px 0; font-family: monospace;">F₁ₓ = ${f1Mag.toFixed(2)} × cos(${f1Angle}°) = ${f1x.toFixed(2)} N</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace;">F₁ᵧ = ${f1Mag.toFixed(2)} × sin(${f1Angle}°) = ${f1y.toFixed(2)} N</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace;">F₂ₓ = ${f2Mag.toFixed(2)} × cos(${f2Angle}°) = ${f2x.toFixed(2)} N</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace;">F₂ᵧ = ${f2Mag.toFixed(2)} × sin(${f2Angle}°) = ${f2y.toFixed(2)} N</p>`;
    html += '</div>';

    html += '<p style="margin: 10px 0;"><strong>Step 2:</strong> Add components</p>';
    html += '<div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">';
    html += `<p style="margin: 5px 0; font-family: monospace;">Rₓ = F₁ₓ + F₂ₓ = ${f1x.toFixed(2)} + ${f2x.toFixed(2)} = ${rx.toFixed(2)} N</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace;">Rᵧ = F₁ᵧ + F₂ᵧ = ${f1y.toFixed(2)} + ${f2y.toFixed(2)} = ${ry.toFixed(2)} N</p>`;
    html += '</div>';

    html += '<p style="margin: 10px 0;"><strong>Step 3:</strong> Calculate magnitude using Pythagoras</p>';
    html += '<div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">';
    html += `<p style="margin: 5px 0; font-family: monospace;">R = √(Rₓ² + Rᵧ²)</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace;">R = √(${rx.toFixed(2)}² + ${ry.toFixed(2)}²)</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace;">R = √(${(rx*rx).toFixed(2)} + ${(ry*ry).toFixed(2)})</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace; font-weight: bold; font-size: 16px;">R = ${resultant.toFixed(2)} N</p>`;
    html += '</div>';

    html += '<p style="margin: 10px 0;"><strong>Step 4:</strong> Calculate direction</p>';
    html += '<div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">';
    html += `<p style="margin: 5px 0; font-family: monospace;">θ = tan⁻¹(Rᵧ / Rₓ)</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace;">θ = tan⁻¹(${ry.toFixed(2)} / ${rx.toFixed(2)})</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace; font-weight: bold; font-size: 16px;">θ = ${angle.toFixed(2)}°</p>`;
    html += '</div>';

    html += '</div>';

    // Newton's Second Law
    html += '<div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">';
    html += '<h5 style="margin-top: 0; color: #155724;">Apply Newton\'s Second Law (F = ma):</h5>';
    html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">F = ma</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">a = F / m</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace; font-size: 15px;">a = ${resultant.toFixed(2)} / ${mass}</p>`;
    html += `<p style="margin: 5px 0; font-family: monospace; font-size: 17px; font-weight: bold; color: #155724;">a = ${accel.toFixed(2)} m/s²</p>`;
    html += '</div>';

    html += '</div>';

    stepsDiv.innerHTML = html;
}

function drawForceVectors() {
    const canvas = document.getElementById('force-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const f1Mag = parseFloat(document.getElementById('force1-mag')?.value || 0);
    const f1Angle = parseFloat(document.getElementById('force1-angle')?.value || 0);
    const f2Mag = parseFloat(document.getElementById('force2-mag')?.value || 0);
    const f2Angle = parseFloat(document.getElementById('force2-angle')?.value || 0);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 2;

    // Draw axes
    ctx.strokeStyle = '#bdc3c7';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Add axis labels
    ctx.fillStyle = '#7f8c8d';
    ctx.font = '12px Arial';
    ctx.fillText('x', width - 20, centerY - 10);
    ctx.fillText('y', centerX + 10, 20);

    // Draw object (circle)
    ctx.fillStyle = '#95a5a6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Calculate force endpoints
    const f1AngleRad = f1Angle * Math.PI / 180;
    const f2AngleRad = f2Angle * Math.PI / 180;

    const f1EndX = centerX + f1Mag * scale * Math.cos(f1AngleRad);
    const f1EndY = centerY - f1Mag * scale * Math.sin(f1AngleRad); // Negative because canvas y increases downward

    const f2EndX = centerX + f2Mag * scale * Math.cos(f2AngleRad);
    const f2EndY = centerY - f2Mag * scale * Math.sin(f2AngleRad);

    // Calculate resultant components
    const f1x = f1Mag * Math.cos(f1AngleRad);
    const f1y = f1Mag * Math.sin(f1AngleRad);
    const f2x = f2Mag * Math.cos(f2AngleRad);
    const f2y = f2Mag * Math.sin(f2AngleRad);
    const rx = f1x + f2x;
    const ry = f1y + f2y;

    const resultantEndX = centerX + rx * scale;
    const resultantEndY = centerY - ry * scale;

    // Draw parallelogram (for visualization)
    if (f1Mag > 0 && f2Mag > 0) {
        ctx.strokeStyle = '#95a5a6';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(f1EndX, f1EndY);
        ctx.lineTo(resultantEndX, resultantEndY);
        ctx.moveTo(f2EndX, f2EndY);
        ctx.lineTo(resultantEndX, resultantEndY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Draw Force 1
    if (f1Mag > 0) {
        drawArrow(ctx, centerX, centerY, f1EndX, f1EndY, '#e74c3c', `F₁ (${f1Mag.toFixed(0)}N)`);
    }

    // Draw Force 2
    if (f2Mag > 0) {
        drawArrow(ctx, centerX, centerY, f2EndX, f2EndY, '#27ae60', `F₂ (${f2Mag.toFixed(0)}N)`);
    }

    // Draw Resultant Force
    if (rx !== 0 || ry !== 0) {
        drawArrow(ctx, centerX, centerY, resultantEndX, resultantEndY, '#3498db', 'Resultant', true);
    }
}

function drawArrow(ctx, fromX, fromY, toX, toY, color, label, isThick = false) {
    const headLength = 15;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length < 1) return; // Don't draw very small arrows

    const angle = Math.atan2(dy, dx);

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = isThick ? 4 : 3;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Draw arrowhead
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Draw label
    ctx.fillStyle = color;
    ctx.font = isThick ? 'bold 16px Arial' : 'bold 14px Arial';
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;

    // Position label perpendicular to the arrow
    const offsetX = -20 * Math.sin(angle);
    const offsetY = 20 * Math.cos(angle);

    ctx.fillText(label, midX + offsetX, midY + offsetY);
}

function resetForces() {
    document.getElementById('force1-mag').value = 50;
    document.getElementById('force1-angle').value = 0;
    document.getElementById('force2-mag').value = 30;
    document.getElementById('force2-angle').value = 90;
    document.getElementById('mass').value = 10;
    updateForces();
}

// =====================================================
// MOMENTUM SIMULATION - Enhanced with Cars & Slow Motion
// =====================================================
let collisionAnimating = false;
let collisionPhase = 'before'; // 'before', 'collision', 'after'
let obj1Pos = 80;
let obj2Pos = 520;
let obj1Vel = 0;
let obj2Vel = 0;
let collisionTime = 0;
let animationSpeed = 0.3; // Much slower for visibility
let showVelocityVectors = true;
let showMomentumBars = true;
let collisionFlashAlpha = 0;

function initMomentum() {
    document.getElementById('mass1')?.addEventListener('input', updateMomentumValues);
    document.getElementById('velocity1')?.addEventListener('input', updateMomentumValues);
    document.getElementById('mass2')?.addEventListener('input', updateMomentumValues);
    document.getElementById('velocity2')?.addEventListener('input', updateMomentumValues);

    updateMomentumValues();
    drawMomentum();
}

function updateMomentumValues() {
    const m1 = parseFloat(document.getElementById('mass1')?.value || 0);
    const v1 = parseFloat(document.getElementById('velocity1')?.value || 0);
    const m2 = parseFloat(document.getElementById('mass2')?.value || 0);
    const v2 = parseFloat(document.getElementById('velocity2')?.value || 0);

    document.getElementById('m1-value').textContent = m1;
    document.getElementById('v1-value').textContent = v1;
    document.getElementById('m2-value').textContent = m2;
    document.getElementById('v2-value').textContent = v2;

    const initialMomentum = m1 * v1 + m2 * v2;
    document.getElementById('initial-momentum').textContent = initialMomentum.toFixed(2);

    if (!collisionAnimating) {
        obj1Vel = v1;
        obj2Vel = v2;
        drawMomentum();
    }
}

function drawCar(ctx, x, y, width, height, color, facingRight, mass) {
    const carHeight = height * 0.6;
    const wheelRadius = height * 0.2;
    const bodyY = y - carHeight - wheelRadius;

    // Car shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y + 5, width * 0.45, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Car body (main rectangle)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x - width/2, bodyY, width, carHeight, 5);
    ctx.fill();

    // Car roof/cabin
    const cabinWidth = width * 0.5;
    const cabinHeight = carHeight * 0.6;
    const cabinX = facingRight ? x - width/4 : x - width/4;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(cabinX, bodyY - cabinHeight + 5, cabinWidth, cabinHeight, [8, 8, 0, 0]);
    ctx.fill();

    // Windows
    ctx.fillStyle = '#85c1e9';
    const windowWidth = cabinWidth * 0.4;
    const windowHeight = cabinHeight * 0.5;
    ctx.beginPath();
    ctx.roundRect(cabinX + 5, bodyY - cabinHeight + 10, windowWidth, windowHeight, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cabinX + cabinWidth - windowWidth - 5, bodyY - cabinHeight + 10, windowWidth, windowHeight, 3);
    ctx.fill();

    // Headlights
    ctx.fillStyle = '#f1c40f';
    const headlightX = facingRight ? x + width/2 - 8 : x - width/2 + 3;
    ctx.beginPath();
    ctx.roundRect(headlightX, bodyY + carHeight * 0.2, 5, 10, 2);
    ctx.fill();

    // Taillights
    ctx.fillStyle = '#e74c3c';
    const taillightX = facingRight ? x - width/2 + 3 : x + width/2 - 8;
    ctx.beginPath();
    ctx.roundRect(taillightX, bodyY + carHeight * 0.2, 5, 10, 2);
    ctx.fill();

    // Wheels
    ctx.fillStyle = '#2c3e50';
    const wheel1X = x - width * 0.3;
    const wheel2X = x + width * 0.3;

    // Wheel 1
    ctx.beginPath();
    ctx.arc(wheel1X, y - wheelRadius, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    // Hubcap
    ctx.fillStyle = '#95a5a6';
    ctx.beginPath();
    ctx.arc(wheel1X, y - wheelRadius, wheelRadius * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Wheel 2
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(wheel2X, y - wheelRadius, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    // Hubcap
    ctx.fillStyle = '#95a5a6';
    ctx.beginPath();
    ctx.arc(wheel2X, y - wheelRadius, wheelRadius * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Mass label on car
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass} kg`, x, bodyY + carHeight/2 + 5);
    ctx.textAlign = 'left';
}

function drawVelocityArrow(ctx, x, y, velocity, color) {
    if (Math.abs(velocity) < 0.1) return;

    const arrowLength = Math.abs(velocity) * 8;
    const arrowHeight = 20;
    const direction = velocity > 0 ? 1 : -1;

    const startX = x;
    const endX = x + arrowLength * direction;

    // Arrow shaft
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX - 15 * direction, y);
    ctx.stroke();

    // Arrow head
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(endX, y);
    ctx.lineTo(endX - 15 * direction, y - 8);
    ctx.lineTo(endX - 15 * direction, y + 8);
    ctx.closePath();
    ctx.fill();

    // Velocity label
    ctx.fillStyle = color;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`v = ${velocity.toFixed(1)} m/s`, x + (arrowLength/2) * direction, y - 15);
    ctx.textAlign = 'left';
}

function drawMomentumBars(ctx, x, y, width, m1, v1, m2, v2) {
    const barHeight = 20;
    const maxMomentum = 100;
    const p1 = m1 * v1;
    const p2 = m2 * v2;
    const totalP = p1 + p2;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(x, y, width, barHeight * 3 + 30);

    // Title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Momentum (kg·m/s)', x + 5, y + 15);

    // Car 1 momentum bar
    const bar1Width = Math.min(Math.abs(p1) / maxMomentum * (width - 80), width - 80);
    ctx.fillStyle = p1 >= 0 ? '#e74c3c' : '#c0392b';
    ctx.fillRect(x + 70, y + 25, bar1Width * (p1 >= 0 ? 1 : -1), barHeight);
    ctx.fillStyle = '#2c3e50';
    ctx.font = '11px Arial';
    ctx.fillText(`Car 1: ${p1.toFixed(1)}`, x + 5, y + 40);

    // Car 2 momentum bar
    const bar2Width = Math.min(Math.abs(p2) / maxMomentum * (width - 80), width - 80);
    ctx.fillStyle = p2 >= 0 ? '#3498db' : '#2980b9';
    ctx.fillRect(x + 70, y + 50, bar2Width * (p2 >= 0 ? 1 : -1), barHeight);
    ctx.fillText(`Car 2: ${p2.toFixed(1)}`, x + 5, y + 65);

    // Total momentum bar
    const totalBarWidth = Math.min(Math.abs(totalP) / maxMomentum * (width - 80), width - 80);
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(x + 70, y + 75, totalBarWidth * (totalP >= 0 ? 1 : -1), barHeight);
    ctx.font = 'bold 11px Arial';
    ctx.fillText(`Total: ${totalP.toFixed(1)}`, x + 5, y + 90);
}

function drawMomentum() {
    const canvas = document.getElementById('momentum-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const m1 = parseFloat(document.getElementById('mass1')?.value || 5);
    const m2 = parseFloat(document.getElementById('mass2')?.value || 3);
    const v1Input = parseFloat(document.getElementById('velocity1')?.value || 8);
    const v2Input = parseFloat(document.getElementById('velocity2')?.value || -4);

    // Use current velocities during animation, input values otherwise
    const v1 = collisionAnimating ? obj1Vel : v1Input;
    const v2 = collisionAnimating ? obj2Vel : v2Input;

    const groundY = height - 60;

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, groundY);

    // Draw road
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, groundY, width, 60);

    // Road markings
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 3;
    ctx.setLineDash([30, 20]);
    ctx.beginPath();
    ctx.moveTo(0, groundY + 30);
    ctx.lineTo(width, groundY + 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Road edges
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, groundY + 2);
    ctx.lineTo(width, groundY + 2);
    ctx.moveTo(0, groundY + 58);
    ctx.lineTo(width, groundY + 58);
    ctx.stroke();

    // Calculate car sizes based on mass
    const car1Width = 60 + m1 * 4;
    const car1Height = 40 + m1 * 2;
    const car2Width = 60 + m2 * 4;
    const car2Height = 40 + m2 * 2;

    // Collision flash effect
    if (collisionFlashAlpha > 0) {
        ctx.fillStyle = `rgba(255, 255, 0, ${collisionFlashAlpha})`;
        ctx.beginPath();
        ctx.arc((obj1Pos + obj2Pos) / 2, groundY - 30, 50, 0, Math.PI * 2);
        ctx.fill();

        // Impact lines
        ctx.strokeStyle = `rgba(255, 100, 0, ${collisionFlashAlpha})`;
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const innerR = 30;
            const outerR = 60;
            ctx.beginPath();
            ctx.moveTo((obj1Pos + obj2Pos) / 2 + Math.cos(angle) * innerR,
                       groundY - 30 + Math.sin(angle) * innerR);
            ctx.lineTo((obj1Pos + obj2Pos) / 2 + Math.cos(angle) * outerR,
                       groundY - 30 + Math.sin(angle) * outerR);
            ctx.stroke();
        }
    }

    // Draw cars
    drawCar(ctx, obj1Pos, groundY, car1Width, car1Height, '#c0392b', true, m1);
    drawCar(ctx, obj2Pos, groundY, car2Width, car2Height, '#2980b9', false, m2);

    // Draw velocity vectors above cars
    if (showVelocityVectors) {
        drawVelocityArrow(ctx, obj1Pos, groundY - car1Height - 50, v1, '#c0392b');
        drawVelocityArrow(ctx, obj2Pos, groundY - car2Height - 50, v2, '#2980b9');
    }

    // Draw momentum bars
    if (showMomentumBars) {
        drawMomentumBars(ctx, 10, 10, 200, m1, v1, m2, v2);
    }

    // Phase indicator
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 14px Arial';
    let phaseText = '';
    switch(collisionPhase) {
        case 'before':
            phaseText = collisionAnimating ? '⏩ Approaching...' : '⏸️ Ready - Click Start';
            break;
        case 'collision':
            phaseText = '💥 COLLISION!';
            break;
        case 'after':
            phaseText = '⏩ After Collision';
            break;
    }
    ctx.fillText(phaseText, width - 180, 25);

    // Draw direction indicators on road
    if (!collisionAnimating || collisionPhase === 'before') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '20px Arial';
        if (v1Input > 0) ctx.fillText('→', obj1Pos + 50, groundY + 35);
        if (v1Input < 0) ctx.fillText('←', obj1Pos - 60, groundY + 35);
        if (v2Input > 0) ctx.fillText('→', obj2Pos + 50, groundY + 35);
        if (v2Input < 0) ctx.fillText('←', obj2Pos - 60, groundY + 35);
    }
}

function startCollision() {
    if (collisionAnimating) return;

    const v1 = parseFloat(document.getElementById('velocity1')?.value || 8);
    const v2 = parseFloat(document.getElementById('velocity2')?.value || -4);

    collisionAnimating = true;
    collisionPhase = 'before';
    collisionTime = 0;
    obj1Pos = 80;
    obj2Pos = 520;
    obj1Vel = v1;
    obj2Vel = v2;
    collisionFlashAlpha = 0;

    // Reset results display
    document.getElementById('final-momentum').textContent = '—';
    document.getElementById('momentum-conserved').textContent = '—';

    animateCollision();
}

function animateCollision() {
    if (!collisionAnimating) return;

    const canvas = document.getElementById('momentum-canvas');
    const m1 = parseFloat(document.getElementById('mass1')?.value || 5);
    const m2 = parseFloat(document.getElementById('mass2')?.value || 3);
    const isElastic = document.getElementById('elastic-collision')?.checked;

    const car1Width = 60 + m1 * 4;
    const car2Width = 60 + m2 * 4;
    const collisionDistance = (car1Width + car2Width) / 2;

    collisionTime++;

    if (collisionPhase === 'before') {
        // Move cars towards each other (slower speed for visibility)
        obj1Pos += obj1Vel * animationSpeed;
        obj2Pos += obj2Vel * animationSpeed;

        // Check for collision
        if (Math.abs(obj1Pos - obj2Pos) <= collisionDistance) {
            collisionPhase = 'collision';
            collisionFlashAlpha = 1.0;

            // Calculate final velocities
            if (isElastic) {
                const v1f = ((m1 - m2) * obj1Vel + 2 * m2 * obj2Vel) / (m1 + m2);
                const v2f = ((m2 - m1) * obj2Vel + 2 * m1 * obj1Vel) / (m1 + m2);
                obj1Vel = v1f;
                obj2Vel = v2f;
            } else {
                const vf = (m1 * obj1Vel + m2 * obj2Vel) / (m1 + m2);
                obj1Vel = vf;
                obj2Vel = vf;
            }

            // Update final momentum display
            const finalMomentum = m1 * obj1Vel + m2 * obj2Vel;
            document.getElementById('final-momentum').textContent = finalMomentum.toFixed(2);

            const v1 = parseFloat(document.getElementById('velocity1')?.value || 8);
            const v2 = parseFloat(document.getElementById('velocity2')?.value || -4);
            const initialMomentum = m1 * v1 + m2 * v2;
            const conserved = Math.abs(finalMomentum - initialMomentum) < 0.1;
            document.getElementById('momentum-conserved').textContent = conserved ? '✓ Yes' : '✗ No';
            document.getElementById('momentum-conserved').style.color = conserved ? '#27ae60' : '#e74c3c';
        }
    } else if (collisionPhase === 'collision') {
        // Brief pause at collision with flash effect
        collisionFlashAlpha -= 0.05;
        if (collisionFlashAlpha <= 0) {
            collisionFlashAlpha = 0;
            collisionPhase = 'after';
        }
    } else if (collisionPhase === 'after') {
        // Move cars after collision
        obj1Pos += obj1Vel * animationSpeed;
        obj2Pos += obj2Vel * animationSpeed;

        // Stop when cars leave screen or after some time
        if (obj1Pos < -100 || obj1Pos > canvas.width + 100 ||
            obj2Pos < -100 || obj2Pos > canvas.width + 100 ||
            collisionTime > 500) {
            collisionAnimating = false;
            return;
        }
    }

    drawMomentum();
    requestAnimationFrame(animateCollision);
}

function resetCollision() {
    collisionAnimating = false;
    collisionPhase = 'before';
    obj1Pos = 80;
    obj2Pos = 520;
    collisionFlashAlpha = 0;

    document.getElementById('mass1').value = 5;
    document.getElementById('velocity1').value = 8;
    document.getElementById('mass2').value = 3;
    document.getElementById('velocity2').value = -4;
    document.getElementById('final-momentum').textContent = '0';
    document.getElementById('momentum-conserved').textContent = '—';
    document.getElementById('momentum-conserved').style.color = '';

    updateMomentumValues();
}

// =====================================================
// TERMINAL VELOCITY SIMULATION
// =====================================================
let fallAnimating = false;
let fallTime = 0;
let fallVelocity = 0;
let fallPosition = 50;

function initTerminalVelocity() {
    document.getElementById('fall-mass')?.addEventListener('input', updateFallValues);
    document.getElementById('drag-coefficient')?.addEventListener('input', updateFallValues);

    updateFallValues();
    drawFall();
}

function updateFallValues() {
    const mass = parseFloat(document.getElementById('fall-mass')?.value || 0);
    const drag = parseFloat(document.getElementById('drag-coefficient')?.value || 0);

    document.getElementById('fall-mass-value').textContent = mass;
    document.getElementById('drag-value').textContent = drag;

    const weight = mass * 9.8;
    document.getElementById('weight-force').textContent = weight.toFixed(2);

    // Calculate terminal velocity (simplified model)
    const terminalV = drag > 0 ? Math.sqrt(weight / drag) : 1000;
    document.getElementById('terminal-velocity').textContent = terminalV.toFixed(2);

    if (!fallAnimating) {
        drawFall();
    }
}

function drawFall() {
    const canvas = document.getElementById('terminal-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const mass = parseFloat(document.getElementById('fall-mass')?.value || 0);

    // Draw reference lines
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 1;
    for (let i = 0; i < height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }

    // Draw falling object
    const size = 20 + mass * 5;
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(width / 2, fallPosition, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw forces
    const weight = mass * 9.8;
    const airResistance = fallVelocity * fallVelocity * parseFloat(document.getElementById('drag-coefficient')?.value || 0);

    // Weight arrow (down)
    const weightScale = 2;
    drawArrow(ctx, width/2, fallPosition, width/2, fallPosition + weight * weightScale, '#e74c3c', 'W');

    // Air resistance arrow (up)
    if (airResistance > 0) {
        drawArrow(ctx, width/2 + 40, fallPosition, width/2 + 40, fallPosition - airResistance * weightScale, '#27ae60', 'R');
    }

    // Velocity indicator
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`v = ${fallVelocity.toFixed(2)} m/s`, 20, 30);
}

function startFall() {
    if (fallAnimating) return;

    fallAnimating = true;
    fallTime = 0;
    fallVelocity = 0;
    fallPosition = 50;

    animateFall();
}

function animateFall() {
    if (!fallAnimating) return;

    const canvas = document.getElementById('terminal-canvas');
    const mass = parseFloat(document.getElementById('fall-mass')?.value || 0);
    const drag = parseFloat(document.getElementById('drag-coefficient')?.value || 0);
    const g = 9.8;

    const dt = 0.1;

    // Calculate forces
    const weight = mass * g;
    const airResistance = drag * fallVelocity * fallVelocity;
    const netForce = weight - airResistance;
    const acceleration = netForce / mass;

    // Update velocity and position
    fallVelocity += acceleration * dt;
    fallPosition += fallVelocity * dt;

    // Update display
    document.getElementById('current-velocity').textContent = fallVelocity.toFixed(2);
    document.getElementById('air-resistance').textContent = airResistance.toFixed(2);

    drawFall();

    // Stop if object reaches bottom
    if (fallPosition > canvas.height - 50) {
        fallAnimating = false;
        return;
    }

    fallTime += dt;
    requestAnimationFrame(animateFall);
}

function resetFall() {
    fallAnimating = false;
    fallTime = 0;
    fallVelocity = 0;
    fallPosition = 50;
    document.getElementById('fall-mass').value = 2;
    document.getElementById('drag-coefficient').value = 0.1;
    document.getElementById('current-velocity').textContent = '0';
    document.getElementById('air-resistance').textContent = '0';
    updateFallValues();
}

// =====================================================
// CENTRE OF MASS SIMULATION
// =====================================================
function initCentreOfMass() {
    document.getElementById('cm-mass1')?.addEventListener('input', updateCentreOfMass);
    document.getElementById('cm-pos1')?.addEventListener('input', updateCentreOfMass);
    document.getElementById('cm-mass2')?.addEventListener('input', updateCentreOfMass);
    document.getElementById('cm-pos2')?.addEventListener('input', updateCentreOfMass);

    updateCentreOfMass();
}

function updateCentreOfMass() {
    const m1 = parseFloat(document.getElementById('cm-mass1')?.value || 0);
    const x1 = parseFloat(document.getElementById('cm-pos1')?.value || 0);
    const m2 = parseFloat(document.getElementById('cm-mass2')?.value || 0);
    const x2 = parseFloat(document.getElementById('cm-pos2')?.value || 0);

    document.getElementById('cm-m1-value').textContent = m1;
    document.getElementById('cm-x1-value').textContent = x1;
    document.getElementById('cm-m2-value').textContent = m2;
    document.getElementById('cm-x2-value').textContent = x2;

    // Calculate centre of mass
    const totalMass = m1 + m2;
    const cmPosition = (m1 * x1 + m2 * x2) / totalMass;

    document.getElementById('cm-position').textContent = cmPosition.toFixed(2);
    document.getElementById('total-mass').textContent = totalMass.toFixed(2);

    drawCentreOfMass();
}

function drawCentreOfMass() {
    const canvas = document.getElementById('centre-mass-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const m1 = parseFloat(document.getElementById('cm-mass1')?.value || 0);
    const x1 = parseFloat(document.getElementById('cm-pos1')?.value || 0);
    const m2 = parseFloat(document.getElementById('cm-mass2')?.value || 0);
    const x2 = parseFloat(document.getElementById('cm-pos2')?.value || 0);

    const totalMass = m1 + m2;
    const cmPosition = (m1 * x1 + m2 * x2) / totalMass;

    const barY = height / 2;

    // Draw bar/rod
    ctx.strokeStyle = '#95a5a6';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(50, barY);
    ctx.lineTo(width - 50, barY);
    ctx.stroke();

    // Draw pivot at centre of mass
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.moveTo(cmPosition - 15, barY + 30);
    ctx.lineTo(cmPosition, barY);
    ctx.lineTo(cmPosition + 15, barY + 30);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d68910';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw mass 1
    const size1 = 15 + m1 * 3;
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x1 - size1/2, barY - size1 - 10, size1, size1);
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x1 - size1/2, barY - size1 - 10, size1, size1);

    // Draw mass 2
    const size2 = 15 + m2 * 3;
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x2 - size2/2, barY - size2 - 10, size2, size2);
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    ctx.strokeRect(x2 - size2/2, barY - size2 - 10, size2, size2);

    // Labels
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`${m1}kg`, x1 - 15, barY - size1 - 15);
    ctx.fillText(`${m2}kg`, x2 - 15, barY - size2 - 15);
    ctx.fillText('Centre of Mass', cmPosition - 40, barY + 60);

    // Check balance
    const balanced = Math.abs((m1 * (x1 - cmPosition)) - (m2 * (cmPosition - x2))) < 1;
    ctx.fillStyle = balanced ? '#27ae60' : '#e74c3c';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(balanced ? 'BALANCED' : 'CALCULATING...', width/2 - 50, 30);
}

function resetCentreOfMass() {
    document.getElementById('cm-mass1').value = 5;
    document.getElementById('cm-pos1').value = 100;
    document.getElementById('cm-mass2').value = 3;
    document.getElementById('cm-pos2').value = 400;
    updateCentreOfMass();
}

// =====================================================
// MOMENT (TORQUE) SIMULATION
// =====================================================
function initMoment() {
    document.getElementById('left-force')?.addEventListener('input', updateMoment);
    document.getElementById('left-distance')?.addEventListener('input', updateMoment);
    document.getElementById('right-force')?.addEventListener('input', updateMoment);
    document.getElementById('right-distance')?.addEventListener('input', updateMoment);

    updateMoment();
}

function updateMoment() {
    const leftF = parseFloat(document.getElementById('left-force')?.value || 0);
    const leftD = parseFloat(document.getElementById('left-distance')?.value || 0);
    const rightF = parseFloat(document.getElementById('right-force')?.value || 0);
    const rightD = parseFloat(document.getElementById('right-distance')?.value || 0);

    document.getElementById('left-force-value').textContent = leftF;
    document.getElementById('left-dist-value').textContent = leftD;
    document.getElementById('right-force-value').textContent = rightF;
    document.getElementById('right-dist-value').textContent = rightD;

    // Calculate moments
    const anticlockwise = leftF * leftD;
    const clockwise = rightF * rightD;
    const netMoment = anticlockwise - clockwise;

    document.getElementById('anticlockwise-moment').textContent = anticlockwise.toFixed(2);
    document.getElementById('clockwise-moment').textContent = clockwise.toFixed(2);
    document.getElementById('net-moment').textContent = netMoment.toFixed(2);

    const balanced = Math.abs(netMoment) < 0.5;
    const statusElement = document.getElementById('balance-status');
    statusElement.textContent = balanced ? 'BALANCED ✓' : 'UNBALANCED ✗';
    statusElement.className = balanced ? 'balanced' : 'unbalanced';

    drawMoment();
}

function drawMoment() {
    const canvas = document.getElementById('moment-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const leftF = parseFloat(document.getElementById('left-force')?.value || 0);
    const leftD = parseFloat(document.getElementById('left-distance')?.value || 0);
    const rightF = parseFloat(document.getElementById('right-force')?.value || 0);
    const rightD = parseFloat(document.getElementById('right-distance')?.value || 0);

    const pivotX = width / 2;
    const leverY = height / 2;
    const distanceScale = 40;

    // Calculate tilt angle based on moments
    const anticlockwise = leftF * leftD;
    const clockwise = rightF * rightD;
    const netMoment = anticlockwise - clockwise;
    const tiltAngle = Math.atan(netMoment / 100);

    ctx.save();
    ctx.translate(pivotX, leverY);
    ctx.rotate(tiltAngle);

    // Draw lever
    const leverLength = 250;
    ctx.strokeStyle = '#95a5a6';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-leverLength, 0);
    ctx.lineTo(leverLength, 0);
    ctx.stroke();

    ctx.restore();

    // Draw pivot
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.moveTo(pivotX - 20, leverY + 25);
    ctx.lineTo(pivotX, leverY);
    ctx.lineTo(pivotX + 20, leverY + 25);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d68910';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw left force
    const leftX = pivotX - leftD * distanceScale;
    const leftYStart = leverY + Math.tan(tiltAngle) * (-leftD * distanceScale);
    drawArrow(ctx, leftX, leftYStart - 100, leftX, leftYStart, '#e74c3c', `${leftF}N`);

    // Draw left distance marker
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pivotX, leverY + 40);
    ctx.lineTo(leftX, leverY + 40);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`${leftD}m`, (pivotX + leftX) / 2 - 15, leverY + 60);

    // Draw right force
    const rightX = pivotX + rightD * distanceScale;
    const rightYStart = leverY + Math.tan(tiltAngle) * (rightD * distanceScale);
    drawArrow(ctx, rightX, rightYStart - 100, rightX, rightYStart, '#3498db', `${rightF}N`);

    // Draw right distance marker
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pivotX, leverY + 40);
    ctx.lineTo(rightX, leverY + 40);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillText(`${rightD}m`, (pivotX + rightX) / 2 - 15, leverY + 60);

    // Draw rotation indicators
    if (Math.abs(netMoment) > 0.5) {
        ctx.strokeStyle = netMoment > 0 ? '#e74c3c' : '#3498db';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (netMoment > 0) {
            ctx.arc(pivotX, leverY, 50, Math.PI, 0, true); // Anticlockwise
        } else {
            ctx.arc(pivotX, leverY, 50, 0, Math.PI, true); // Clockwise
        }
        ctx.stroke();

        // Arrow
        const arrowAngle = netMoment > 0 ? Math.PI : 0;
        const arrowX = pivotX + 50 * Math.cos(arrowAngle);
        const arrowY = leverY + 50 * Math.sin(arrowAngle);
        drawArrow(ctx, arrowX - 10, arrowY, arrowX, arrowY, ctx.strokeStyle, '');
    }
}

function resetMoment() {
    document.getElementById('left-force').value = 30;
    document.getElementById('left-distance').value = 2;
    document.getElementById('right-force').value = 20;
    document.getElementById('right-distance').value = 3;
    updateMoment();
}

// =====================================================
// GAMIFICATION SYSTEM
// =====================================================
let userXP = 0;
let userLevel = 1;
let xpNeeded = 100;
let soundEnabled = true;
let achievements = [];

function initGamification() {
    // Load saved progress from localStorage
    const savedXP = localStorage.getItem('physics-xp');
    const savedLevel = localStorage.getItem('physics-level');

    if (savedXP) userXP = parseInt(savedXP);
    if (savedLevel) userLevel = parseInt(savedLevel);

    xpNeeded = userLevel * 100;
    updateXPDisplay();

    // Set up theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Set up achievements button
    const achievementsBtn = document.getElementById('achievements-btn');
    if (achievementsBtn) {
        achievementsBtn.addEventListener('click', showAchievements);
    }

    // Set up sound toggle
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', toggleSound);
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('physics-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    }
}

function updateXPDisplay() {
    const xpElement = document.getElementById('user-xp');
    const levelElement = document.getElementById('user-level');
    const xpNeededElement = document.getElementById('xp-needed');
    const xpBar = document.getElementById('xp-bar');

    if (xpElement) xpElement.textContent = userXP;
    if (levelElement) levelElement.textContent = userLevel;
    if (xpNeededElement) xpNeededElement.textContent = xpNeeded;
    if (xpBar) xpBar.style.width = `${(userXP / xpNeeded) * 100}%`;
}

function addXP(amount) {
    userXP += amount;

    // Level up check
    while (userXP >= xpNeeded) {
        userXP -= xpNeeded;
        userLevel++;
        xpNeeded = userLevel * 100;
        showNotification(`Level Up! You're now Level ${userLevel}!`);
    }

    // Save progress
    localStorage.setItem('physics-xp', userXP.toString());
    localStorage.setItem('physics-level', userLevel.toString());

    updateXPDisplay();
}

function showNotification(message) {
    const notification = document.getElementById('achievement-notification');
    if (notification) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeToggle = document.getElementById('theme-toggle');

    if (document.body.classList.contains('dark-mode')) {
        if (themeToggle) themeToggle.textContent = '☀️';
        localStorage.setItem('physics-theme', 'dark');
    } else {
        if (themeToggle) themeToggle.textContent = '🌙';
        localStorage.setItem('physics-theme', 'light');
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    }
}

function showAchievements() {
    const modal = document.getElementById('achievements-modal');
    if (modal) {
        modal.style.display = 'block';
        populateAchievements();
    }
}

function closeAchievements() {
    const modal = document.getElementById('achievements-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function populateAchievements() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;

    const allAchievements = [
        { id: 'first-sim', icon: '🚀', title: 'First Steps', description: 'Run your first simulation', unlocked: true },
        { id: 'motion-master', icon: '📈', title: 'Motion Master', description: 'Complete all motion exercises', unlocked: false },
        { id: 'force-expert', icon: '💪', title: 'Force Expert', description: 'Master resultant forces', unlocked: false },
        { id: 'momentum-guru', icon: '🎱', title: 'Momentum Guru', description: 'Understand collisions', unlocked: false },
        { id: 'level-5', icon: '⭐', title: 'Rising Star', description: 'Reach Level 5', unlocked: userLevel >= 5 },
        { id: 'level-10', icon: '🌟', title: 'Physics Pro', description: 'Reach Level 10', unlocked: userLevel >= 10 }
    ];

    grid.innerHTML = allAchievements.map(a => `
        <div class="achievement-card ${a.unlocked ? '' : 'locked'}">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-title">${a.title}</div>
            <div class="achievement-description">${a.description}</div>
        </div>
    `).join('');
}

// =====================================================
// PROJECTILE MOTION (NEW TOPIC)
// =====================================================
let projectileAnimating = false;
let projectileTime = 0;
let projectileX = 0;
let projectileY = 0;

function initProjectile() {
    const canvas = document.getElementById('projectile-canvas');
    if (!canvas) return;

    document.getElementById('proj-velocity')?.addEventListener('input', updateProjectileValues);
    document.getElementById('proj-angle')?.addEventListener('input', updateProjectileValues);
    document.getElementById('proj-height')?.addEventListener('input', updateProjectileValues);

    updateProjectileValues();
    drawProjectile();
}

function updateProjectileValues() {
    const v0 = parseFloat(document.getElementById('proj-velocity')?.value || 20);
    const angle = parseFloat(document.getElementById('proj-angle')?.value || 45);
    const h0 = parseFloat(document.getElementById('proj-height')?.value || 0);

    document.getElementById('proj-velocity-value').textContent = v0;
    document.getElementById('proj-angle-value').textContent = angle;
    document.getElementById('proj-height-value').textContent = h0;

    const angleRad = angle * Math.PI / 180;
    const vx = v0 * Math.cos(angleRad);
    const vy = v0 * Math.sin(angleRad);
    const g = 9.8;

    // Calculate flight time (when y = 0)
    const a = -0.5 * g;
    const b = vy;
    const c = h0;
    const discriminant = b * b - 4 * a * c;
    const flightTime = discriminant >= 0 ? (-b - Math.sqrt(discriminant)) / (2 * a) : 0;

    const range = vx * flightTime;
    const maxHeight = h0 + (vy * vy) / (2 * g);

    document.getElementById('proj-range').textContent = range.toFixed(2);
    document.getElementById('proj-max-height').textContent = maxHeight.toFixed(2);
    document.getElementById('proj-time').textContent = flightTime.toFixed(2);
    document.getElementById('proj-vx').textContent = vx.toFixed(2);
    document.getElementById('proj-vy').textContent = vy.toFixed(2);

    if (!projectileAnimating) {
        drawProjectile();
    }
}

function drawProjectile() {
    const canvas = document.getElementById('projectile-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const v0 = parseFloat(document.getElementById('proj-velocity')?.value || 20);
    const angle = parseFloat(document.getElementById('proj-angle')?.value || 45);
    const h0 = parseFloat(document.getElementById('proj-height')?.value || 0);

    const angleRad = angle * Math.PI / 180;
    const vx = v0 * Math.cos(angleRad);
    const vy = v0 * Math.sin(angleRad);
    const g = 9.8;

    // Draw ground
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, height - 30);
    ctx.lineTo(width, height - 30);
    ctx.stroke();

    // Draw trajectory
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();

    const scale = 5;
    const startY = height - 30 - h0 * scale;

    for (let t = 0; t <= 10; t += 0.1) {
        const x = 50 + vx * t * scale;
        const y = startY - (vy * t - 0.5 * g * t * t) * scale;

        if (y > height - 30) break;

        if (t === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw launcher
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(30, startY - 10, 40, 20);

    // Draw current projectile position
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(50 + projectileX * scale, startY - projectileY * scale, 8, 0, 2 * Math.PI);
    ctx.fill();
}

function launchProjectile() {
    if (projectileAnimating) return;

    projectileAnimating = true;
    projectileTime = 0;
    projectileX = 0;
    projectileY = 0;

    addXP(5);
    animateProjectile();
}

function animateProjectile() {
    if (!projectileAnimating) return;

    const v0 = parseFloat(document.getElementById('proj-velocity')?.value || 20);
    const angle = parseFloat(document.getElementById('proj-angle')?.value || 45);
    const h0 = parseFloat(document.getElementById('proj-height')?.value || 0);

    const angleRad = angle * Math.PI / 180;
    const vx = v0 * Math.cos(angleRad);
    const vy = v0 * Math.sin(angleRad);
    const g = 9.8;

    const dt = 0.05;
    projectileTime += dt;

    projectileX = vx * projectileTime;
    projectileY = h0 + vy * projectileTime - 0.5 * g * projectileTime * projectileTime;

    drawProjectile();

    if (projectileY < 0) {
        projectileAnimating = false;
        projectileY = 0;
        drawProjectile();
        return;
    }

    requestAnimationFrame(animateProjectile);
}

function loadProjectileScenario(scenario) {
    const velInput = document.getElementById('proj-velocity');
    const angleInput = document.getElementById('proj-angle');
    const heightInput = document.getElementById('proj-height');

    switch(scenario) {
        case 'basketball':
            velInput.value = 8;
            angleInput.value = 50;
            heightInput.value = 2;
            break;
        case 'cannon':
            velInput.value = 40;
            angleInput.value = 45;
            heightInput.value = 1;
            break;
        case 'rocket':
            velInput.value = 50;
            angleInput.value = 75;
            heightInput.value = 0;
            break;
    }

    updateProjectileValues();
}

function resetProjectile() {
    projectileAnimating = false;
    projectileTime = 0;
    projectileX = 0;
    projectileY = 0;

    document.getElementById('proj-velocity').value = 20;
    document.getElementById('proj-angle').value = 45;
    document.getElementById('proj-height').value = 0;

    updateProjectileValues();
}

// =====================================================
// ENERGY & POWER (NEW TOPIC)
// =====================================================
let rollerCoasterAnimating = false;
let rollerCoasterPosition = 0;
let rollerCoasterVelocity = 0;

function initEnergy() {
    const canvas = document.getElementById('energy-canvas');
    if (!canvas) return;

    document.getElementById('cart-mass')?.addEventListener('input', updateEnergyValues);
    document.getElementById('start-height')?.addEventListener('input', updateEnergyValues);
    document.getElementById('friction')?.addEventListener('input', updateEnergyValues);

    updateEnergyValues();
    drawEnergy();
}

function updateEnergyValues() {
    const mass = parseFloat(document.getElementById('cart-mass')?.value || 500);
    const height = parseFloat(document.getElementById('start-height')?.value || 30);
    const friction = parseFloat(document.getElementById('friction')?.value || 0.05);

    document.getElementById('cart-mass-value').textContent = mass;
    document.getElementById('start-height-value').textContent = height;
    document.getElementById('friction-value').textContent = friction;

    const g = 9.8;
    const pe = mass * g * height;
    const ke = 0;
    const total = pe + ke;

    document.getElementById('pe-value').textContent = pe.toFixed(0);
    document.getElementById('ke-value').textContent = ke.toFixed(0);
    document.getElementById('total-energy').textContent = total.toFixed(0);
    document.getElementById('energy-velocity').textContent = '0';
    document.getElementById('energy-height').textContent = height.toFixed(1);

    if (!rollerCoasterAnimating) {
        drawEnergy();
    }
}

function drawEnergy() {
    const canvas = document.getElementById('energy-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw track (simplified roller coaster track)
    ctx.strokeStyle = '#95a5a6';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(150, 350);
    ctx.lineTo(300, 200);
    ctx.lineTo(450, 350);
    ctx.lineTo(600, 250);
    ctx.lineTo(680, 350);
    ctx.stroke();

    // Draw cart
    const cartX = 50 + rollerCoasterPosition * 6;
    const cartY = getTrackHeight(rollerCoasterPosition);

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(cartX - 15, cartY - 20, 30, 20);
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.strokeRect(cartX - 15, cartY - 20, 30, 20);

    // Draw energy bars
    const mass = parseFloat(document.getElementById('cart-mass')?.value || 500);
    const startHeight = parseFloat(document.getElementById('start-height')?.value || 30);
    const g = 9.8;
    const totalEnergy = mass * g * startHeight;

    const currentHeight = (350 - cartY) / 8;
    const pe = mass * g * Math.max(0, currentHeight);
    const ke = totalEnergy - pe;

    // PE bar
    ctx.fillStyle = '#3498db';
    ctx.fillRect(width - 80, 50, 25, Math.max(0, (pe / totalEnergy) * 200));

    // KE bar
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(width - 45, 50, 25, Math.max(0, (ke / totalEnergy) * 200));

    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px Arial';
    ctx.fillText('PE', width - 75, 270);
    ctx.fillText('KE', width - 40, 270);
}

function getTrackHeight(position) {
    // Simplified track height function
    const trackPoints = [
        { x: 0, y: 100 },
        { x: 17, y: 350 },
        { x: 42, y: 200 },
        { x: 67, y: 350 },
        { x: 92, y: 250 },
        { x: 105, y: 350 }
    ];

    for (let i = 0; i < trackPoints.length - 1; i++) {
        if (position >= trackPoints[i].x && position < trackPoints[i + 1].x) {
            const t = (position - trackPoints[i].x) / (trackPoints[i + 1].x - trackPoints[i].x);
            return trackPoints[i].y + t * (trackPoints[i + 1].y - trackPoints[i].y);
        }
    }
    return 350;
}

function startRollerCoaster() {
    if (rollerCoasterAnimating) return;

    rollerCoasterAnimating = true;
    rollerCoasterPosition = 0;
    rollerCoasterVelocity = 0;

    addXP(5);
    animateRollerCoaster();
}

function animateRollerCoaster() {
    if (!rollerCoasterAnimating) return;

    rollerCoasterPosition += 0.5;

    const mass = parseFloat(document.getElementById('cart-mass')?.value || 500);
    const startHeight = parseFloat(document.getElementById('start-height')?.value || 30);
    const friction = parseFloat(document.getElementById('friction')?.value || 0.05);
    const g = 9.8;

    const currentHeight = Math.max(0, (350 - getTrackHeight(rollerCoasterPosition)) / 8);
    const totalEnergy = mass * g * startHeight * (1 - friction * rollerCoasterPosition / 100);
    const pe = mass * g * currentHeight;
    const ke = Math.max(0, totalEnergy - pe);
    const velocity = Math.sqrt(2 * ke / mass);

    document.getElementById('pe-value').textContent = pe.toFixed(0);
    document.getElementById('ke-value').textContent = ke.toFixed(0);
    document.getElementById('total-energy').textContent = (pe + ke).toFixed(0);
    document.getElementById('energy-velocity').textContent = velocity.toFixed(1);
    document.getElementById('energy-height').textContent = currentHeight.toFixed(1);

    drawEnergy();

    if (rollerCoasterPosition > 105) {
        rollerCoasterAnimating = false;
        return;
    }

    requestAnimationFrame(animateRollerCoaster);
}

function resetRollerCoaster() {
    rollerCoasterAnimating = false;
    rollerCoasterPosition = 0;
    rollerCoasterVelocity = 0;

    document.getElementById('cart-mass').value = 500;
    document.getElementById('start-height').value = 30;
    document.getElementById('friction').value = 0.05;

    updateEnergyValues();
}

// =====================================================
// CIRCULAR MOTION (NEW TOPIC)
// =====================================================
let orbitAnimating = false;
let orbitAngle = 0;

function initCircular() {
    const canvas = document.getElementById('circular-canvas');
    if (!canvas) return;

    document.getElementById('orbit-radius')?.addEventListener('input', updateOrbitValues);
    document.getElementById('sat-mass')?.addEventListener('input', updateOrbitValues);
    document.getElementById('central-mass')?.addEventListener('input', updateOrbitValues);

    updateOrbitValues();
    drawOrbit();
}

function updateOrbitValues() {
    const radius = parseFloat(document.getElementById('orbit-radius')?.value || 400) * 1000; // km to m
    const satMass = parseFloat(document.getElementById('sat-mass')?.value || 1000);
    const centralMass = parseFloat(document.getElementById('central-mass')?.value || 5.97) * 1e24;

    document.getElementById('orbit-radius-value').textContent = document.getElementById('orbit-radius')?.value || 400;
    document.getElementById('sat-mass-value').textContent = document.getElementById('sat-mass')?.value || 1000;
    document.getElementById('central-mass-value').textContent = document.getElementById('central-mass')?.value || 5.97;

    const G = 6.674e-11;
    const orbitalRadius = 6.371e6 + radius; // Earth radius + altitude

    const orbitalVelocity = Math.sqrt(G * centralMass / orbitalRadius);
    const centripetalForce = satMass * orbitalVelocity * orbitalVelocity / orbitalRadius;
    const period = 2 * Math.PI * orbitalRadius / orbitalVelocity / 60; // minutes
    const angularVelocity = orbitalVelocity / orbitalRadius;

    document.getElementById('orbital-velocity').textContent = orbitalVelocity.toFixed(0);
    document.getElementById('centripetal-force').textContent = centripetalForce.toFixed(2);
    document.getElementById('orbit-period').textContent = period.toFixed(1);
    document.getElementById('angular-velocity').textContent = angularVelocity.toExponential(3);

    if (!orbitAnimating) {
        drawOrbit();
    }
}

function drawOrbit() {
    const canvas = document.getElementById('circular-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const orbitRadius = 150;

    // Draw Earth
    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    ctx.fill();

    // Draw continents (simplified)
    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    ctx.arc(centerX - 10, centerY - 10, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 15, centerY + 5, 12, 0, 2 * Math.PI);
    ctx.fill();

    // Draw orbit path
    ctx.strokeStyle = '#95a5a6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, orbitRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw satellite
    const satX = centerX + orbitRadius * Math.cos(orbitAngle);
    const satY = centerY + orbitRadius * Math.sin(orbitAngle);

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(satX - 10, satY - 5, 20, 10);

    // Solar panels
    ctx.fillStyle = '#3498db';
    ctx.fillRect(satX - 20, satY - 3, 8, 6);
    ctx.fillRect(satX + 12, satY - 3, 8, 6);

    // Draw velocity vector
    const vAngle = orbitAngle + Math.PI / 2;
    drawArrow(ctx, satX, satY, satX + 40 * Math.cos(vAngle), satY + 40 * Math.sin(vAngle), '#27ae60', 'v');

    // Draw centripetal force
    drawArrow(ctx, satX, satY, satX - 30 * Math.cos(orbitAngle), satY - 30 * Math.sin(orbitAngle), '#e74c3c', 'F');
}

function startOrbit() {
    if (orbitAnimating) return;

    orbitAnimating = true;
    orbitAngle = 0;

    addXP(5);
    animateOrbit();
}

function animateOrbit() {
    if (!orbitAnimating) return;

    orbitAngle += 0.02;

    drawOrbit();

    if (orbitAngle > 2 * Math.PI) {
        orbitAngle = 0;
    }

    requestAnimationFrame(animateOrbit);
}

function loadOrbitScenario(scenario) {
    const radiusInput = document.getElementById('orbit-radius');
    const massInput = document.getElementById('sat-mass');

    switch(scenario) {
        case 'iss':
            radiusInput.value = 400;
            massInput.value = 420000;
            break;
        case 'moon':
            radiusInput.value = 384400;
            massInput.value = 7.35e22;
            break;
        case 'gps':
            radiusInput.value = 20200;
            massInput.value = 2000;
            break;
    }

    updateOrbitValues();
}

function resetOrbit() {
    orbitAnimating = false;
    orbitAngle = 0;

    document.getElementById('orbit-radius').value = 400;
    document.getElementById('sat-mass').value = 1000;
    document.getElementById('central-mass').value = 5.97;

    updateOrbitValues();
}

// =====================================================
// FRICTION (NEW TOPIC)
// =====================================================
let frictionAnimating = false;
let frictionPosition = 50;
let frictionVelocity = 0;

function initFriction() {
    const canvas = document.getElementById('friction-canvas');
    if (!canvas) return;

    document.getElementById('friction-mass')?.addEventListener('input', updateFrictionValues);
    document.getElementById('applied-force')?.addEventListener('input', updateFrictionValues);
    document.getElementById('mu')?.addEventListener('input', updateFrictionValues);

    updateFrictionValues();
    drawFriction();
}

function updateFrictionValues() {
    const mass = parseFloat(document.getElementById('friction-mass')?.value || 10);
    const appliedForce = parseFloat(document.getElementById('applied-force')?.value || 0);
    const mu = parseFloat(document.getElementById('mu')?.value || 0.4);

    document.getElementById('friction-mass-value').textContent = mass;
    document.getElementById('applied-force-value').textContent = appliedForce;
    document.getElementById('mu-value').textContent = mu;

    const g = 9.8;
    const normalForce = mass * g;
    const maxStaticFriction = mu * normalForce;
    const kineticFriction = 0.8 * mu * normalForce; // kinetic is typically less

    document.getElementById('normal-force').textContent = normalForce.toFixed(2);
    document.getElementById('static-friction').textContent = maxStaticFriction.toFixed(2);
    document.getElementById('kinetic-friction').textContent = kineticFriction.toFixed(2);

    const isMoving = appliedForce > maxStaticFriction;
    const netForce = isMoving ? appliedForce - kineticFriction : 0;

    document.getElementById('net-force-friction').textContent = netForce.toFixed(2);
    document.getElementById('friction-status').textContent = isMoving ? 'Moving' : 'At Rest';
    document.getElementById('friction-status').className = isMoving ? 'unbalanced' : 'balanced';

    if (!frictionAnimating) {
        drawFriction();
    }
}

function drawFriction() {
    const canvas = document.getElementById('friction-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw ground/surface
    ctx.fillStyle = '#d35400';
    ctx.fillRect(0, height - 50, width, 50);

    // Draw surface texture
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, height - 50);
        ctx.lineTo(x + 10, height);
        ctx.stroke();
    }

    // Draw object
    const mass = parseFloat(document.getElementById('friction-mass')?.value || 10);
    const objSize = 40 + mass;

    ctx.fillStyle = '#3498db';
    ctx.fillRect(frictionPosition, height - 50 - objSize, objSize, objSize);
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    ctx.strokeRect(frictionPosition, height - 50 - objSize, objSize, objSize);

    // Draw applied force arrow
    const appliedForce = parseFloat(document.getElementById('applied-force')?.value || 0);
    if (appliedForce > 0) {
        const forceScale = 0.5;
        drawArrow(ctx, frictionPosition, height - 50 - objSize / 2,
                  frictionPosition + appliedForce * forceScale, height - 50 - objSize / 2,
                  '#27ae60', `F=${appliedForce}N`);
    }

    // Draw friction arrow
    const mu = parseFloat(document.getElementById('mu')?.value || 0.4);
    const normalForce = mass * 9.8;
    const frictionForce = Math.min(appliedForce, mu * normalForce);
    if (frictionForce > 0) {
        const forceScale = 0.5;
        drawArrow(ctx, frictionPosition + objSize, height - 50 - objSize / 2,
                  frictionPosition + objSize - frictionForce * forceScale, height - 50 - objSize / 2,
                  '#e74c3c', `f=${frictionForce.toFixed(1)}N`);
    }
}

function applyFrictionForce() {
    if (frictionAnimating) return;

    const mass = parseFloat(document.getElementById('friction-mass')?.value || 10);
    const appliedForce = parseFloat(document.getElementById('applied-force')?.value || 0);
    const mu = parseFloat(document.getElementById('mu')?.value || 0.4);

    const normalForce = mass * 9.8;
    const maxStaticFriction = mu * normalForce;

    if (appliedForce > maxStaticFriction) {
        frictionAnimating = true;
        addXP(5);
        animateFriction();
    }
}

function animateFriction() {
    if (!frictionAnimating) return;

    const canvas = document.getElementById('friction-canvas');
    const mass = parseFloat(document.getElementById('friction-mass')?.value || 10);
    const appliedForce = parseFloat(document.getElementById('applied-force')?.value || 0);
    const mu = parseFloat(document.getElementById('mu')?.value || 0.4);

    const normalForce = mass * 9.8;
    const kineticFriction = 0.8 * mu * normalForce;
    const netForce = appliedForce - kineticFriction;
    const acceleration = netForce / mass;

    frictionVelocity += acceleration * 0.05;
    frictionPosition += frictionVelocity;

    drawFriction();

    if (frictionPosition > canvas.width - 100) {
        frictionAnimating = false;
        return;
    }

    requestAnimationFrame(animateFriction);
}

function loadSurface(surface) {
    const muInput = document.getElementById('mu');

    switch(surface) {
        case 'ice':
            muInput.value = 0.1;
            break;
        case 'wood':
            muInput.value = 0.4;
            break;
        case 'rubber':
            muInput.value = 0.8;
            break;
    }

    updateFrictionValues();
}

function resetFriction() {
    frictionAnimating = false;
    frictionPosition = 50;
    frictionVelocity = 0;

    document.getElementById('friction-mass').value = 10;
    document.getElementById('applied-force').value = 0;
    document.getElementById('mu').value = 0.4;

    updateFrictionValues();
}

// =====================================================
// CHALLENGE MODE (NEW TOPIC)
// =====================================================
let challengeScore = 0;
let challengeStreak = 0;
let currentChallenge = null;
let challengeTimer = null;
let challengeSeconds = 0;

function initChallenge() {
    updateChallengeDisplay();
}

function updateChallengeDisplay() {
    document.getElementById('challenge-score').textContent = challengeScore;
    document.getElementById('challenge-streak').textContent = challengeStreak;
}

function newChallenge() {
    // Stop previous timer
    if (challengeTimer) {
        clearInterval(challengeTimer);
    }

    const challenges = [
        {
            text: 'A car accelerates from 10 m/s to 30 m/s in 5 seconds. What is its acceleration?',
            answer: 4,
            unit: 'm/s²',
            tolerance: 0.1
        },
        {
            text: 'A 5 kg object experiences a 20 N force. What is the acceleration?',
            answer: 4,
            unit: 'm/s²',
            tolerance: 0.1
        },
        {
            text: 'Calculate the momentum of a 2 kg ball moving at 8 m/s.',
            answer: 16,
            unit: 'kg·m/s',
            tolerance: 0.1
        },
        {
            text: 'A 10 N force acts 2 m from a pivot. What is the moment?',
            answer: 20,
            unit: 'N·m',
            tolerance: 0.1
        },
        {
            text: 'What is the weight of a 50 kg person? (g = 9.8 m/s²)',
            answer: 490,
            unit: 'N',
            tolerance: 1
        }
    ];

    currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];

    document.getElementById('problem-text').textContent = currentChallenge.text;
    document.getElementById('answer-unit').textContent = currentChallenge.unit;
    document.getElementById('answer-input').value = '';
    document.getElementById('challenge-feedback').textContent = '';
    document.getElementById('challenge-feedback').className = 'challenge-feedback';

    // Start timer
    challengeSeconds = 0;
    challengeTimer = setInterval(() => {
        challengeSeconds++;
        const mins = Math.floor(challengeSeconds / 60);
        const secs = challengeSeconds % 60;
        document.getElementById('challenge-timer').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function checkAnswer() {
    if (!currentChallenge) {
        document.getElementById('challenge-feedback').textContent = 'Click "New Challenge" first!';
        return;
    }

    const userAnswer = parseFloat(document.getElementById('answer-input').value);
    const feedback = document.getElementById('challenge-feedback');

    if (isNaN(userAnswer)) {
        feedback.textContent = 'Please enter a valid number!';
        feedback.style.background = '#f39c12';
        feedback.style.color = 'white';
        return;
    }

    if (Math.abs(userAnswer - currentChallenge.answer) <= currentChallenge.tolerance) {
        // Correct!
        const timeBonus = Math.max(0, 30 - challengeSeconds);
        const points = 10 + timeBonus + (challengeStreak * 2);
        challengeScore += points;
        challengeStreak++;

        feedback.textContent = `Correct! +${points} points (Time bonus: ${timeBonus})`;
        feedback.style.background = '#27ae60';
        feedback.style.color = 'white';

        addXP(points);
    } else {
        // Wrong
        challengeStreak = 0;
        feedback.textContent = `Incorrect. The answer was ${currentChallenge.answer} ${currentChallenge.unit}`;
        feedback.style.background = '#e74c3c';
        feedback.style.color = 'white';
    }

    clearInterval(challengeTimer);
    updateChallengeDisplay();
    currentChallenge = null;
}

function skipChallenge() {
    if (!currentChallenge) return;

    challengeScore = Math.max(0, challengeScore - 10);
    challengeStreak = 0;

    document.getElementById('challenge-feedback').textContent = 'Skipped! -10 points';
    document.getElementById('challenge-feedback').style.background = '#f39c12';
    document.getElementById('challenge-feedback').style.color = 'white';

    clearInterval(challengeTimer);
    updateChallengeDisplay();
    currentChallenge = null;
}

// =====================================================
// PHYSICS SANDBOX (NEW TOPIC)
// =====================================================
let sandboxObjects = [];
let sandboxRunning = false;
let sandboxAnimationId = null;

function initSandbox() {
    const canvas = document.getElementById('sandbox-canvas');
    if (!canvas) return;

    document.getElementById('sandbox-gravity')?.addEventListener('input', updateSandboxSettings);
    document.getElementById('sandbox-air')?.addEventListener('input', updateSandboxSettings);
    document.getElementById('sandbox-elasticity')?.addEventListener('input', updateSandboxSettings);

    updateSandboxSettings();
    drawSandbox();
}

function updateSandboxSettings() {
    const gravity = document.getElementById('sandbox-gravity')?.value || 9.8;
    const air = document.getElementById('sandbox-air')?.value || 0;
    const elasticity = document.getElementById('sandbox-elasticity')?.value || 0.8;

    document.getElementById('sandbox-gravity-value').textContent = gravity;
    document.getElementById('sandbox-air-value').textContent = air;
    document.getElementById('sandbox-elasticity-value').textContent = elasticity;
}

function drawSandbox() {
    const canvas = document.getElementById('sandbox-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw ground
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(0, height - 20, width, 20);

    // Draw objects
    sandboxObjects.forEach(obj => {
        ctx.fillStyle = obj.color;

        if (obj.type === 'circle') {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.size, 0, 2 * Math.PI);
            ctx.fill();
        } else if (obj.type === 'square') {
            ctx.fillRect(obj.x - obj.size / 2, obj.y - obj.size / 2, obj.size, obj.size);
        } else if (obj.type === 'ramp') {
            ctx.beginPath();
            ctx.moveTo(obj.x, obj.y);
            ctx.lineTo(obj.x + 100, obj.y);
            ctx.lineTo(obj.x + 100, obj.y - 50);
            ctx.closePath();
            ctx.fill();
        }
    });

    // Update display
    document.getElementById('sandbox-objects').textContent = sandboxObjects.length;
}

function addSandboxObject(type) {
    const canvas = document.getElementById('sandbox-canvas');
    const colors = ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6'];

    const obj = {
        type: type,
        x: 100 + Math.random() * 300,
        y: 100,
        vx: 0,
        vy: 0,
        size: type === 'ramp' ? 0 : 20 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        mass: 1
    };

    sandboxObjects.push(obj);
    drawSandbox();
}

function startSandbox() {
    if (sandboxRunning) return;

    sandboxRunning = true;
    addXP(5);
    animateSandbox();
}

function animateSandbox() {
    if (!sandboxRunning) return;

    const canvas = document.getElementById('sandbox-canvas');
    const gravity = parseFloat(document.getElementById('sandbox-gravity')?.value || 9.8);
    const air = parseFloat(document.getElementById('sandbox-air')?.value || 0);
    const elasticity = parseFloat(document.getElementById('sandbox-elasticity')?.value || 0.8);

    const dt = 0.1;

    sandboxObjects.forEach(obj => {
        if (obj.type === 'ramp') return; // Ramps don't move

        // Apply gravity
        obj.vy += gravity * dt;

        // Apply air resistance
        obj.vx *= (1 - air);
        obj.vy *= (1 - air);

        // Update position
        obj.x += obj.vx;
        obj.y += obj.vy;

        // Bounce off floor
        if (obj.y + obj.size > canvas.height - 20) {
            obj.y = canvas.height - 20 - obj.size;
            obj.vy = -obj.vy * elasticity;
        }

        // Bounce off walls
        if (obj.x - obj.size < 0 || obj.x + obj.size > canvas.width) {
            obj.vx = -obj.vx * elasticity;
            obj.x = Math.max(obj.size, Math.min(canvas.width - obj.size, obj.x));
        }
    });

    drawSandbox();

    sandboxAnimationId = requestAnimationFrame(animateSandbox);
}

function pauseSandbox() {
    sandboxRunning = false;
    if (sandboxAnimationId) {
        cancelAnimationFrame(sandboxAnimationId);
    }
}

function resetSandbox() {
    pauseSandbox();
    sandboxObjects.forEach(obj => {
        if (obj.type !== 'ramp') {
            obj.y = 100;
            obj.vx = 0;
            obj.vy = 0;
        }
    });
    drawSandbox();
}

function clearSandbox() {
    pauseSandbox();
    sandboxObjects = [];
    drawSandbox();
}

function exportSandbox() {
    const data = JSON.stringify({
        objects: sandboxObjects,
        settings: {
            gravity: document.getElementById('sandbox-gravity')?.value,
            air: document.getElementById('sandbox-air')?.value,
            elasticity: document.getElementById('sandbox-elasticity')?.value
        }
    });

    // Create download
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'physics-sandbox.json';
    a.click();
    URL.revokeObjectURL(url);
}

// =====================================================
// INITIALIZATION
// =====================================================
window.addEventListener('load', () => {
    // Hide the particle canvas if it exists (it's not being used and may cause issues)
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) {
        particleCanvas.style.display = 'none';
    }

    // Initialize gamification
    initGamification();

    // Initialize original topics
    initMotion();
    initForce();
    initMomentum();
    initTerminalVelocity();
    initCentreOfMass();
    initMoment();

    // Initialize new topics
    initProjectile();
    initEnergy();
    initCircular();
    initFriction();
    initChallenge();
    initSandbox();

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('achievements-modal');
        if (event.target === modal) {
            closeAchievements();
        }
    });
});
