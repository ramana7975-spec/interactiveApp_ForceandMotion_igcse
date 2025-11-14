// Navigation between topics
function showTopic(topicId) {
    // Hide all sections
    const sections = document.querySelectorAll('.topic-section');
    sections.forEach(section => section.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected section
    document.getElementById(topicId).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
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
    document.getElementById('force1')?.addEventListener('input', updateForces);
    document.getElementById('force2')?.addEventListener('input', updateForces);
    document.getElementById('mass')?.addEventListener('input', updateForces);

    updateForces();
}

function updateForces() {
    const f1 = parseFloat(document.getElementById('force1')?.value || 0);
    const f2 = parseFloat(document.getElementById('force2')?.value || 0);
    const mass = parseFloat(document.getElementById('mass')?.value || 1);

    document.getElementById('f1-value').textContent = f1;
    document.getElementById('f2-value').textContent = f2;
    document.getElementById('mass-value').textContent = mass;

    // Calculate resultant force
    const resultant = Math.sqrt(f1 * f1 + f2 * f2);
    const angle = Math.atan2(f2, f1) * 180 / Math.PI;
    const acceleration = resultant / mass;

    document.getElementById('resultant-force').textContent = resultant.toFixed(2);
    document.getElementById('force-angle').textContent = angle.toFixed(2);
    document.getElementById('force-acceleration').textContent = acceleration.toFixed(2);

    drawForceVectors();
}

function drawForceVectors() {
    const canvas = document.getElementById('force-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const f1 = parseFloat(document.getElementById('force1')?.value || 0);
    const f2 = parseFloat(document.getElementById('force2')?.value || 0);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 2;

    // Draw object (box)
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(centerX - 30, centerY - 30, 60, 60);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - 30, centerY - 30, 60, 60);

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

    // Draw Force 1 (horizontal)
    drawArrow(ctx, centerX, centerY, centerX + f1 * scale, centerY, '#e74c3c', 'F₁');

    // Draw Force 2 (vertical)
    drawArrow(ctx, centerX, centerY, centerX, centerY - f2 * scale, '#27ae60', 'F₂');

    // Draw Resultant Force
    const resultantX = centerX + f1 * scale;
    const resultantY = centerY - f2 * scale;
    drawArrow(ctx, centerX, centerY, resultantX, resultantY, '#3498db', 'Resultant');

    // Draw parallelogram
    ctx.strokeStyle = '#95a5a6';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX + f1 * scale, centerY);
    ctx.lineTo(resultantX, resultantY);
    ctx.moveTo(centerX, centerY - f2 * scale);
    ctx.lineTo(resultantX, resultantY);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawArrow(ctx, fromX, fromY, toX, toY, color, label) {
    const headLength = 15;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
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
    ctx.font = 'bold 14px Arial';
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    ctx.fillText(label, midX + 10, midY - 10);
}

function resetForces() {
    document.getElementById('force1').value = 50;
    document.getElementById('force2').value = 30;
    document.getElementById('mass').value = 10;
    updateForces();
}

// =====================================================
// MOMENTUM SIMULATION
// =====================================================
let collisionAnimating = false;
let collisionProgress = 0;
let obj1Pos = 50;
let obj2Pos = 450;

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
        drawMomentum();
    }
}

function drawMomentum() {
    const canvas = document.getElementById('momentum-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const m1 = parseFloat(document.getElementById('mass1')?.value || 0);
    const m2 = parseFloat(document.getElementById('mass2')?.value || 0);

    // Draw ground
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2 + 50);
    ctx.lineTo(width, height / 2 + 50);
    ctx.stroke();

    // Draw object 1
    const size1 = 20 + m1 * 3;
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(obj1Pos - size1/2, height/2 + 50 - size1, size1, size1);
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.strokeRect(obj1Pos - size1/2, height/2 + 50 - size1, size1, size1);

    // Draw object 2
    const size2 = 20 + m2 * 3;
    ctx.fillStyle = '#3498db';
    ctx.fillRect(obj2Pos - size2/2, height/2 + 50 - size2, size2, size2);
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    ctx.strokeRect(obj2Pos - size2/2, height/2 + 50 - size2, size2, size2);

    // Draw labels
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`m₁=${m1}kg`, obj1Pos - 20, height/2 - 10);
    ctx.fillText(`m₂=${m2}kg`, obj2Pos - 20, height/2 - 10);
}

function startCollision() {
    if (collisionAnimating) return;

    collisionAnimating = true;
    collisionProgress = 0;
    obj1Pos = 50;
    obj2Pos = 450;

    animateCollision();
}

function animateCollision() {
    if (!collisionAnimating) return;

    const canvas = document.getElementById('momentum-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const m1 = parseFloat(document.getElementById('mass1')?.value || 0);
    const v1 = parseFloat(document.getElementById('velocity1')?.value || 0);
    const m2 = parseFloat(document.getElementById('mass2')?.value || 0);
    const v2 = parseFloat(document.getElementById('velocity2')?.value || 0);
    const isElastic = document.getElementById('elastic-collision')?.checked;

    ctx.clearRect(0, 0, width, height);

    // Draw ground
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2 + 50);
    ctx.lineTo(width, height / 2 + 50);
    ctx.stroke();

    const collisionPoint = width / 2;
    const speed = 2;

    // Before collision
    if (collisionProgress < 100) {
        obj1Pos += v1 * speed;
        obj2Pos += v2 * speed;
        collisionProgress++;

        // Check for collision
        if (Math.abs(obj1Pos - obj2Pos) < 30) {
            collisionProgress = 100;
        }
    } else {
        // After collision - calculate final velocities
        let v1f, v2f;

        if (isElastic) {
            // Elastic collision formulas
            v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
            v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
        } else {
            // Inelastic collision (objects stick together)
            v1f = v2f = (m1 * v1 + m2 * v2) / (m1 + m2);
        }

        obj1Pos += v1f * speed;
        obj2Pos += v2f * speed;

        // Calculate final momentum
        const finalMomentum = m1 * v1f + m2 * v2f;
        document.getElementById('final-momentum').textContent = finalMomentum.toFixed(2);

        const initialMomentum = m1 * v1 + m2 * v2;
        const conserved = Math.abs(finalMomentum - initialMomentum) < 0.1;
        document.getElementById('momentum-conserved').textContent = conserved ? 'Yes' : 'No';

        // Stop if objects leave screen
        if (obj1Pos < -50 || obj1Pos > width + 50 || obj2Pos < -50 || obj2Pos > width + 50) {
            collisionAnimating = false;
            return;
        }
    }

    // Draw objects
    const size1 = 20 + m1 * 3;
    const size2 = 20 + m2 * 3;

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(obj1Pos - size1/2, height/2 + 50 - size1, size1, size1);
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.strokeRect(obj1Pos - size1/2, height/2 + 50 - size1, size1, size1);

    ctx.fillStyle = '#3498db';
    ctx.fillRect(obj2Pos - size2/2, height/2 + 50 - size2, size2, size2);
    ctx.strokeStyle = '#2980b9';
    ctx.strokeRect(obj2Pos - size2/2, height/2 + 50 - size2, size2, size2);

    requestAnimationFrame(animateCollision);
}

function resetCollision() {
    collisionAnimating = false;
    obj1Pos = 50;
    obj2Pos = 450;
    document.getElementById('mass1').value = 5;
    document.getElementById('velocity1').value = 8;
    document.getElementById('mass2').value = 3;
    document.getElementById('velocity2').value = -4;
    document.getElementById('final-momentum').textContent = '0';
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
// INITIALIZATION
// =====================================================
window.addEventListener('load', () => {
    initMotion();
    initForce();
    initMomentum();
    initTerminalVelocity();
    initCentreOfMass();
    initMoment();
});
