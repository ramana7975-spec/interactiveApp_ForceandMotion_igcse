// =====================================================
// PHYSICS CALCULATION FUNCTIONS
// Pure functions for testing - no DOM manipulation
// =====================================================

// =====================================================
// MOTION CALCULATIONS
// =====================================================

/**
 * Calculate final velocity using v = u + at
 * @param {number} u - Initial velocity (m/s)
 * @param {number} a - Acceleration (m/s²)
 * @param {number} t - Time (s)
 * @returns {number} Final velocity (m/s)
 */
function calculateFinalVelocity(u, a, t) {
    return u + a * t;
}

/**
 * Calculate displacement using s = ut + ½at²
 * @param {number} u - Initial velocity (m/s)
 * @param {number} a - Acceleration (m/s²)
 * @param {number} t - Time (s)
 * @returns {number} Displacement (m)
 */
function calculateDisplacement(u, a, t) {
    return u * t + 0.5 * a * t * t;
}

/**
 * Calculate area under velocity-time graph (trapezoid method)
 * @param {number} u - Initial velocity (m/s)
 * @param {number} v - Final velocity (m/s)
 * @param {number} t - Time (s)
 * @returns {number} Distance traveled (m)
 */
function calculateAreaUnderGraph(u, v, t) {
    return 0.5 * (u + v) * t;
}

/**
 * Calculate final velocity squared using v² = u² + 2as
 * @param {number} u - Initial velocity (m/s)
 * @param {number} a - Acceleration (m/s²)
 * @param {number} s - Displacement (m)
 * @returns {number} Final velocity (m/s)
 */
function calculateFinalVelocityFromDisplacement(u, a, s) {
    const vSquared = u * u + 2 * a * s;
    return vSquared >= 0 ? Math.sqrt(vSquared) : 0;
}

// =====================================================
// FORCE CALCULATIONS
// =====================================================

/**
 * Calculate resultant force magnitude from two perpendicular forces
 * @param {number} f1 - First force component (N)
 * @param {number} f2 - Second force component (N)
 * @returns {number} Resultant force magnitude (N)
 */
function calculateResultantForce(f1, f2) {
    return Math.sqrt(f1 * f1 + f2 * f2);
}

/**
 * Calculate angle of resultant force
 * @param {number} f1 - Horizontal force component (N)
 * @param {number} f2 - Vertical force component (N)
 * @returns {number} Angle in degrees
 */
function calculateForceAngle(f1, f2) {
    return Math.atan2(f2, f1) * 180 / Math.PI;
}

/**
 * Calculate acceleration using F = ma
 * @param {number} force - Resultant force (N)
 * @param {number} mass - Mass (kg)
 * @returns {number} Acceleration (m/s²), or 0 if mass is 0
 */
function calculateAcceleration(force, mass) {
    if (mass === 0 || !isFinite(mass)) {
        return 0;
    }
    return force / mass;
}

/**
 * Calculate weight
 * @param {number} mass - Mass (kg)
 * @param {number} g - Gravitational acceleration (m/s², default 9.8)
 * @returns {number} Weight (N)
 */
function calculateWeight(mass, g = 9.8) {
    return mass * g;
}

/**
 * Calculate force components from magnitude and angle
 * @param {number} magnitude - Force magnitude (N)
 * @param {number} angleDegrees - Angle in degrees
 * @returns {Object} {x, y} - Force components
 */
function calculateForceComponents(magnitude, angleDegrees) {
    const angleRad = angleDegrees * Math.PI / 180;
    return {
        x: magnitude * Math.cos(angleRad),
        y: magnitude * Math.sin(angleRad)
    };
}

/**
 * Calculate resultant force from two forces with magnitudes and angles
 * @param {number} f1Mag - Magnitude of force 1 (N)
 * @param {number} f1Angle - Angle of force 1 (degrees)
 * @param {number} f2Mag - Magnitude of force 2 (N)
 * @param {number} f2Angle - Angle of force 2 (degrees)
 * @returns {Object} {magnitude, angle, components} - Resultant force
 */
function calculateResultantForceWithAngles(f1Mag, f1Angle, f2Mag, f2Angle) {
    const f1 = calculateForceComponents(f1Mag, f1Angle);
    const f2 = calculateForceComponents(f2Mag, f2Angle);

    const rx = f1.x + f2.x;
    const ry = f1.y + f2.y;

    const magnitude = Math.sqrt(rx * rx + ry * ry);
    const angle = Math.atan2(ry, rx) * 180 / Math.PI;

    return {
        magnitude,
        angle,
        components: { x: rx, y: ry }
    };
}

/**
 * Calculate resultant of forces in same direction
 * @param {number} f1 - First force (N)
 * @param {number} f2 - Second force (N)
 * @returns {number} Resultant force (N)
 */
function calculateResultantSameDirection(f1, f2) {
    return f1 + f2;
}

/**
 * Calculate resultant of forces in opposite directions
 * @param {number} f1 - First force (N)
 * @param {number} f2 - Second force (N)
 * @returns {number} Resultant force (N)
 */
function calculateResultantOppositeDirection(f1, f2) {
    return Math.abs(f1 - f2);
}

// =====================================================
// MOMENTUM CALCULATIONS
// =====================================================

/**
 * Calculate momentum
 * @param {number} mass - Mass (kg)
 * @param {number} velocity - Velocity (m/s)
 * @returns {number} Momentum (kg·m/s)
 */
function calculateMomentum(mass, velocity) {
    return mass * velocity;
}

/**
 * Calculate total momentum of system
 * @param {number} m1 - Mass of object 1 (kg)
 * @param {number} v1 - Velocity of object 1 (m/s)
 * @param {number} m2 - Mass of object 2 (kg)
 * @param {number} v2 - Velocity of object 2 (m/s)
 * @returns {number} Total momentum (kg·m/s)
 */
function calculateTotalMomentum(m1, v1, m2, v2) {
    return m1 * v1 + m2 * v2;
}

/**
 * Calculate final velocities after elastic collision
 * @param {number} m1 - Mass of object 1 (kg)
 * @param {number} v1 - Initial velocity of object 1 (m/s)
 * @param {number} m2 - Mass of object 2 (kg)
 * @param {number} v2 - Initial velocity of object 2 (m/s)
 * @returns {Object} {v1f, v2f} - Final velocities
 */
function calculateElasticCollision(m1, v1, m2, v2) {
    const totalMass = m1 + m2;

    if (totalMass === 0 || !isFinite(totalMass)) {
        return { v1f: 0, v2f: 0 };
    }

    const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / totalMass;
    const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / totalMass;

    return { v1f, v2f };
}

/**
 * Calculate final velocity after inelastic collision (objects stick together)
 * @param {number} m1 - Mass of object 1 (kg)
 * @param {number} v1 - Initial velocity of object 1 (m/s)
 * @param {number} m2 - Mass of object 2 (kg)
 * @param {number} v2 - Initial velocity of object 2 (m/s)
 * @returns {number} Final velocity (m/s)
 */
function calculateInelasticCollision(m1, v1, m2, v2) {
    const totalMass = m1 + m2;

    if (totalMass === 0 || !isFinite(totalMass)) {
        return 0;
    }

    return (m1 * v1 + m2 * v2) / totalMass;
}

/**
 * Check if momentum is conserved (within tolerance)
 * @param {number} initialMomentum - Initial total momentum
 * @param {number} finalMomentum - Final total momentum
 * @param {number} tolerance - Acceptable difference (default 0.1)
 * @returns {boolean} True if momentum is conserved
 */
function isMomentumConserved(initialMomentum, finalMomentum, tolerance = 0.1) {
    return Math.abs(finalMomentum - initialMomentum) < tolerance;
}

// =====================================================
// TERMINAL VELOCITY CALCULATIONS
// =====================================================

/**
 * Calculate air resistance force
 * @param {number} drag - Drag coefficient
 * @param {number} velocity - Current velocity (m/s)
 * @returns {number} Air resistance force (N)
 */
function calculateAirResistance(drag, velocity) {
    return drag * velocity * velocity;
}

/**
 * Calculate terminal velocity
 * @param {number} mass - Mass (kg)
 * @param {number} drag - Drag coefficient
 * @param {number} g - Gravitational acceleration (m/s², default 9.8)
 * @returns {number} Terminal velocity (m/s)
 */
function calculateTerminalVelocity(mass, drag, g = 9.8) {
    if (drag === 0 || !isFinite(drag)) {
        return Infinity;
    }

    const weight = mass * g;
    return Math.sqrt(weight / drag);
}

/**
 * Calculate net force on falling object
 * @param {number} mass - Mass (kg)
 * @param {number} velocity - Current velocity (m/s)
 * @param {number} drag - Drag coefficient
 * @param {number} g - Gravitational acceleration (m/s², default 9.8)
 * @returns {number} Net force (N)
 */
function calculateNetForceFalling(mass, velocity, drag, g = 9.8) {
    const weight = mass * g;
    const airResistance = calculateAirResistance(drag, velocity);
    return weight - airResistance;
}

// =====================================================
// CENTRE OF MASS CALCULATIONS
// =====================================================

/**
 * Calculate centre of mass position for two objects
 * @param {number} m1 - Mass of object 1 (kg)
 * @param {number} x1 - Position of object 1
 * @param {number} m2 - Mass of object 2 (kg)
 * @param {number} x2 - Position of object 2
 * @returns {number} Centre of mass position
 */
function calculateCentreOfMass(m1, x1, m2, x2) {
    const totalMass = m1 + m2;

    if (totalMass === 0 || !isFinite(totalMass)) {
        return 0;
    }

    return (m1 * x1 + m2 * x2) / totalMass;
}

/**
 * Check if system is balanced around a pivot point
 * @param {number} m1 - Mass of object 1 (kg)
 * @param {number} x1 - Position of object 1
 * @param {number} m2 - Mass of object 2 (kg)
 * @param {number} x2 - Position of object 2
 * @param {number} pivot - Pivot point position
 * @param {number} tolerance - Balance tolerance (default 1)
 * @returns {boolean} True if balanced
 */
function isSystemBalanced(m1, x1, m2, x2, pivot, tolerance = 1) {
    const moment1 = m1 * Math.abs(x1 - pivot);
    const moment2 = m2 * Math.abs(x2 - pivot);
    return Math.abs(moment1 - moment2) < tolerance;
}

// =====================================================
// MOMENT (TORQUE) CALCULATIONS
// =====================================================

/**
 * Calculate moment (torque)
 * @param {number} force - Force (N)
 * @param {number} distance - Perpendicular distance from pivot (m)
 * @returns {number} Moment (N·m)
 */
function calculateMoment(force, distance) {
    return force * distance;
}

/**
 * Calculate net moment
 * @param {number} anticlockwiseMoment - Anticlockwise moment (N·m)
 * @param {number} clockwiseMoment - Clockwise moment (N·m)
 * @returns {number} Net moment (N·m)
 */
function calculateNetMoment(anticlockwiseMoment, clockwiseMoment) {
    return anticlockwiseMoment - clockwiseMoment;
}

/**
 * Check if moments are balanced (equilibrium)
 * @param {number} anticlockwiseMoment - Anticlockwise moment (N·m)
 * @param {number} clockwiseMoment - Clockwise moment (N·m)
 * @param {number} tolerance - Balance tolerance (default 0.5)
 * @returns {boolean} True if balanced
 */
function areMomentsBalanced(anticlockwiseMoment, clockwiseMoment, tolerance = 0.5) {
    return Math.abs(anticlockwiseMoment - clockwiseMoment) < tolerance;
}

/**
 * Calculate tilt angle based on net moment
 * @param {number} netMoment - Net moment (N·m)
 * @param {number} scaleFactor - Scale factor for visual representation (default 100)
 * @returns {number} Tilt angle in radians
 */
function calculateTiltAngle(netMoment, scaleFactor = 100) {
    return Math.atan(netMoment / scaleFactor);
}

// =====================================================
// EXPORT FOR TESTING
// =====================================================

// For Node.js/Jest testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Motion
        calculateFinalVelocity,
        calculateDisplacement,
        calculateAreaUnderGraph,
        calculateFinalVelocityFromDisplacement,
        // Force
        calculateResultantForce,
        calculateForceAngle,
        calculateAcceleration,
        calculateWeight,
        calculateForceComponents,
        calculateResultantForceWithAngles,
        calculateResultantSameDirection,
        calculateResultantOppositeDirection,
        // Momentum
        calculateMomentum,
        calculateTotalMomentum,
        calculateElasticCollision,
        calculateInelasticCollision,
        isMomentumConserved,
        // Terminal Velocity
        calculateAirResistance,
        calculateTerminalVelocity,
        calculateNetForceFalling,
        // Centre of Mass
        calculateCentreOfMass,
        isSystemBalanced,
        // Moment
        calculateMoment,
        calculateNetMoment,
        areMomentsBalanced,
        calculateTiltAngle
    };
}
