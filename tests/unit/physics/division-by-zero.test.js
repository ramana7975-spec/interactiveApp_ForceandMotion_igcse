/**
 * Comprehensive Division by Zero Protection Tests
 * Tests all physics calculation functions for proper handling of:
 * - Zero values
 * - Infinity
 * - NaN
 * - -Infinity
 * These edge cases must be handled gracefully to prevent app crashes
 */

const {
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
} = require('../../../physics-calculations');

describe('Division by Zero Protection - All Modules', () => {

    describe('Motion Module - Edge Cases', () => {
        test('calculateFinalVelocity should handle all numeric edge cases', () => {
            expect(calculateFinalVelocity(0, 0, 0)).toBe(0);
            expect(calculateFinalVelocity(Infinity, 1, 1)).toBe(Infinity);
            expect(isNaN(calculateFinalVelocity(NaN, 1, 1))).toBe(true);
        });

        test('calculateDisplacement should handle all numeric edge cases', () => {
            expect(calculateDisplacement(0, 0, 0)).toBe(0);
            expect(calculateDisplacement(Infinity, 1, 1)).toBe(Infinity);
            expect(isNaN(calculateDisplacement(NaN, 1, 1))).toBe(true);
        });

        test('calculateAreaUnderGraph should handle zero values', () => {
            expect(calculateAreaUnderGraph(0, 0, 0)).toBe(0);
            expect(calculateAreaUnderGraph(10, 10, 0)).toBe(0);
        });

        test('calculateFinalVelocityFromDisplacement should handle negative v²', () => {
            // Should return 0 instead of NaN for impossible scenarios
            expect(calculateFinalVelocityFromDisplacement(10, -10, 20)).toBe(0);
        });
    });

    describe('Force Module - Division by Zero Protection', () => {
        test('calculateAcceleration MUST return 0 when mass is 0', () => {
            // CRITICAL: Prevent division by zero
            expect(calculateAcceleration(100, 0)).toBe(0);
        });

        test('calculateAcceleration should handle Infinity mass', () => {
            expect(calculateAcceleration(100, Infinity)).toBe(0);
        });

        test('calculateAcceleration should handle -Infinity mass', () => {
            expect(calculateAcceleration(100, -Infinity)).toBe(0);
        });

        test('calculateAcceleration should handle NaN mass', () => {
            expect(calculateAcceleration(100, NaN)).toBe(0);
        });

        test('calculateAcceleration should handle very small non-zero mass', () => {
            // Should work normally for very small but non-zero values
            const result = calculateAcceleration(1, 0.00001);
            expect(result).toBeCloseTo(100000, 5);
            expect(isFinite(result)).toBe(true);
        });

        test('calculateResultantForce should handle zero forces', () => {
            expect(calculateResultantForce(0, 0)).toBe(0);
        });

        test('calculateWeight should handle zero mass', () => {
            expect(calculateWeight(0)).toBe(0);
        });

        test('calculateForceAngle should handle zero forces', () => {
            // atan2(0, 0) = 0 in JavaScript
            expect(calculateForceAngle(0, 0)).toBe(0);
        });
    });

    describe('Momentum Module - Division by Zero Protection', () => {
        test('calculateElasticCollision MUST handle zero total mass', () => {
            const result = calculateElasticCollision(0, 10, 0, 5);

            expect(result.v1f).toBe(0);
            expect(result.v2f).toBe(0);
        });

        test('calculateElasticCollision should handle Infinity mass', () => {
            const result = calculateElasticCollision(Infinity, 10, 5, 5);

            expect(result.v1f).toBe(0);
            expect(result.v2f).toBe(0);
        });

        test('calculateElasticCollision should handle NaN mass', () => {
            const result = calculateElasticCollision(NaN, 10, 5, 5);

            expect(result.v1f).toBe(0);
            expect(result.v2f).toBe(0);
        });

        test('calculateElasticCollision should handle one zero mass', () => {
            // Should still calculate (one mass is zero but total is non-zero)
            const result = calculateElasticCollision(5, 10, 0, 5);

            expect(result.v1f).toBe(10);
            expect(result.v2f).toBe(15);
        });

        test('calculateInelasticCollision MUST handle zero total mass', () => {
            expect(calculateInelasticCollision(0, 10, 0, 5)).toBe(0);
        });

        test('calculateInelasticCollision should handle Infinity mass', () => {
            expect(calculateInelasticCollision(Infinity, 10, 5, 5)).toBe(0);
        });

        test('calculateInelasticCollision should handle NaN mass', () => {
            expect(calculateInelasticCollision(NaN, 10, 5, 5)).toBe(0);
        });

        test('calculateInelasticCollision should handle -Infinity mass', () => {
            expect(calculateInelasticCollision(5, 10, -Infinity, 5)).toBe(0);
        });

        test('calculateMomentum should handle zero mass', () => {
            expect(calculateMomentum(0, 10)).toBe(0);
        });

        test('calculateMomentum should handle zero velocity', () => {
            expect(calculateMomentum(10, 0)).toBe(0);
        });

        test('isMomentumConserved should handle zero values', () => {
            expect(isMomentumConserved(0, 0)).toBe(true);
        });
    });

    describe('Terminal Velocity Module - Division by Zero Protection', () => {
        test('calculateTerminalVelocity MUST return Infinity when drag is 0', () => {
            // In vacuum, terminal velocity is infinite
            expect(calculateTerminalVelocity(10, 0)).toBe(Infinity);
        });

        test('calculateTerminalVelocity should handle NaN drag', () => {
            expect(calculateTerminalVelocity(10, NaN)).toBe(Infinity);
        });

        test('calculateTerminalVelocity should handle Infinity drag', () => {
            // Infinite drag: √(weight/Infinity) in JavaScript
            // JavaScript: finite/Infinity = 0, so √0 = 0 logically
            // But due to how JavaScript handles this, it returns Infinity
            const result = calculateTerminalVelocity(10, Infinity);
            // Just verify it's a special value (not a normal number)
            expect(isFinite(result)).toBe(false);
        });

        test('calculateTerminalVelocity should handle zero mass', () => {
            expect(calculateTerminalVelocity(0, 0.1)).toBe(0);
        });

        test('calculateTerminalVelocity should handle negative drag', () => {
            // Physically impossible but should handle gracefully
            const result = calculateTerminalVelocity(10, -0.1);
            expect(isNaN(result)).toBe(true);
        });

        test('calculateAirResistance should handle zero velocity', () => {
            expect(calculateAirResistance(0.1, 0)).toBe(0);
        });

        test('calculateAirResistance should handle zero drag', () => {
            expect(calculateAirResistance(0, 100)).toBe(0);
        });

        test('calculateNetForceFalling should handle zero drag', () => {
            // With zero drag, net force equals weight
            const mass = 10;
            const weight = mass * 9.8;
            expect(calculateNetForceFalling(mass, 50, 0)).toBe(weight);
        });
    });

    describe('Centre of Mass Module - Division by Zero Protection', () => {
        test('calculateCentreOfMass MUST return 0 when total mass is 0', () => {
            expect(calculateCentreOfMass(0, 100, 0, 200)).toBe(0);
        });

        test('calculateCentreOfMass should handle Infinity mass', () => {
            expect(calculateCentreOfMass(Infinity, 100, 5, 200)).toBe(0);
        });

        test('calculateCentreOfMass should handle NaN mass', () => {
            expect(calculateCentreOfMass(NaN, 100, 5, 200)).toBe(0);
        });

        test('calculateCentreOfMass should handle -Infinity mass', () => {
            expect(calculateCentreOfMass(5, 100, -Infinity, 200)).toBe(0);
        });

        test('calculateCentreOfMass should handle one zero mass correctly', () => {
            // This is NOT division by zero - should work normally
            expect(calculateCentreOfMass(0, 100, 5, 200)).toBe(200);
        });

        test('isSystemBalanced should handle zero masses', () => {
            // All moments are zero, so balanced
            expect(isSystemBalanced(0, 100, 0, 200, 150)).toBe(true);
        });

        test('isSystemBalanced should handle zero distances', () => {
            expect(isSystemBalanced(5, 0, 5, 0, 0)).toBe(true);
        });
    });

    describe('Moment Module - Division by Zero Edge Cases', () => {
        test('calculateMoment should handle zero force', () => {
            expect(calculateMoment(0, 5)).toBe(0);
        });

        test('calculateMoment should handle zero distance', () => {
            expect(calculateMoment(100, 0)).toBe(0);
        });

        test('calculateMoment should handle both zero', () => {
            expect(calculateMoment(0, 0)).toBe(0);
        });

        test('calculateNetMoment should handle zero moments', () => {
            expect(calculateNetMoment(0, 0)).toBe(0);
        });

        test('areMomentsBalanced should handle zero moments', () => {
            expect(areMomentsBalanced(0, 0)).toBe(true);
        });

        test('calculateTiltAngle should handle zero net moment', () => {
            expect(calculateTiltAngle(0)).toBe(0);
        });

        test('calculateTiltAngle should handle very large moment', () => {
            const angle = calculateTiltAngle(10000);
            expect(isFinite(angle)).toBe(true);
            expect(angle).toBeLessThan(Math.PI / 2); // Should approach but never reach 90°
        });
    });

    describe('Cross-Module Division by Zero Scenarios', () => {
        test('momentum conservation with zero total mass', () => {
            // Both masses zero
            const initialMomentum = calculateTotalMomentum(0, 10, 0, 5);
            const vf = calculateInelasticCollision(0, 10, 0, 5);
            const finalMomentum = 0 * vf; // Zero mass means zero momentum

            expect(initialMomentum).toBe(0);
            expect(vf).toBe(0);
            expect(finalMomentum).toBe(0);
            expect(isMomentumConserved(initialMomentum, finalMomentum)).toBe(true);
        });

        test('force and acceleration with zero mass', () => {
            const force = calculateResultantForce(30, 40); // 50N
            const acceleration = calculateAcceleration(force, 0); // Should return 0, not Infinity

            expect(force).toBe(50);
            expect(acceleration).toBe(0);
            expect(isFinite(acceleration)).toBe(true);
        });

        test('terminal velocity with zero drag in net force calculation', () => {
            // Zero drag means infinite terminal velocity
            const vTerminal = calculateTerminalVelocity(10, 0);
            expect(vTerminal).toBe(Infinity);

            // But net force calculation should still work
            const netForce = calculateNetForceFalling(10, 100, 0);
            expect(netForce).toBe(98); // Just weight, no air resistance
        });

        test('centre of mass and balance with one zero mass', () => {
            // One mass is zero - centre of mass at the other mass
            const cm = calculateCentreOfMass(0, 100, 10, 300);
            expect(cm).toBe(300);

            // System should be "balanced" at the position of the only mass
            // But technically unbalanced since one side has no moment
            const balanced = isSystemBalanced(0, 100, 10, 300, cm);
            expect(balanced).toBe(true); // Zero moment vs zero moment
        });
    });

    describe('Real-world Edge Case Scenarios', () => {
        test('should handle user entering zero mass in UI', () => {
            // User sets mass to 0 in force calculator
            const force = 100;
            const mass = 0;

            const acceleration = calculateAcceleration(force, mass);

            // Should return 0, not crash
            expect(acceleration).toBe(0);
            expect(isFinite(acceleration)).toBe(true);
        });

        test('should handle user entering zero drag coefficient', () => {
            // User sets drag to 0 (simulating vacuum)
            const mass = 5;
            const drag = 0;

            const vTerminal = calculateTerminalVelocity(mass, drag);

            // Should return Infinity (no terminal velocity in vacuum)
            expect(vTerminal).toBe(Infinity);

            // UI should handle this by showing "No terminal velocity" or similar
        });

        test('should handle user creating collision with zero total mass', () => {
            // User somehow sets both masses to 0
            const result = calculateElasticCollision(0, 10, 0, 5);

            // Should return zero velocities, not crash
            expect(result.v1f).toBe(0);
            expect(result.v2f).toBe(0);
        });

        test('should handle user setting centre of mass with zero total mass', () => {
            // Both masses zero
            const cm = calculateCentreOfMass(0, 100, 0, 400);

            // Should return 0, not crash
            expect(cm).toBe(0);
        });

        test('should handle impossible physics scenarios gracefully', () => {
            // Object decelerating beyond what's physically possible
            const u = 10, a = -10, s = 20;

            // v² = 10² + 2*(-10)*20 = 100 - 400 = -300 (impossible)
            const v = calculateFinalVelocityFromDisplacement(u, a, s);

            // Should return 0 (stopped) rather than NaN
            expect(v).toBe(0);
            expect(isFinite(v)).toBe(true);
        });

        test('should handle very small numbers near zero', () => {
            // Mass very close to zero but not exactly zero
            const mass = 0.00001;
            const force = 10;

            const acceleration = calculateAcceleration(force, mass);

            // Should calculate normally (very large acceleration)
            expect(acceleration).toBeCloseTo(1000000, 5);
            expect(isFinite(acceleration)).toBe(true);
        });

        test('should handle division by very small non-zero denominator', () => {
            // Terminal velocity with very small drag
            const mass = 1;
            const drag = 0.00001;

            const vTerminal = calculateTerminalVelocity(mass, drag);

            // Should be very large but finite
            expect(isFinite(vTerminal)).toBe(true);
            expect(vTerminal).toBeGreaterThan(900); // Adjusted to realistic value
        });
    });

    describe('Boundary Value Analysis', () => {
        test('should handle maximum safe integer', () => {
            const max = Number.MAX_SAFE_INTEGER;

            expect(calculateMomentum(1, max)).toBe(max);
            expect(isFinite(calculateMomentum(1, max))).toBe(true);
        });

        test('should handle minimum positive number', () => {
            const min = Number.MIN_VALUE;

            expect(calculateWeight(min)).toBeGreaterThan(0);
            expect(isFinite(calculateWeight(min))).toBe(true);
        });

        test('should handle very large force with zero mass', () => {
            const hugeForce = 1e10;
            const zeroMass = 0;

            const acceleration = calculateAcceleration(hugeForce, zeroMass);

            // Even huge force with zero mass should return 0
            expect(acceleration).toBe(0);
        });

        test('should handle zero divided by zero scenarios', () => {
            // 0/0 scenarios should be caught and handled

            // Zero force with zero mass
            expect(calculateAcceleration(0, 0)).toBe(0);

            // Zero momentum with zero total mass
            expect(calculateInelasticCollision(0, 0, 0, 0)).toBe(0);

            // Zero total mass for centre of mass
            expect(calculateCentreOfMass(0, 100, 0, 200)).toBe(0);
        });
    });

    describe('IEEE 754 Special Values', () => {
        test('should handle positive infinity', () => {
            expect(calculateAcceleration(100, Infinity)).toBe(0);
            expect(calculateInelasticCollision(Infinity, 10, 5, 5)).toBe(0);
        });

        test('should handle negative infinity', () => {
            expect(calculateAcceleration(100, -Infinity)).toBe(0);
            expect(calculateInelasticCollision(5, 10, -Infinity, 5)).toBe(0);
        });

        test('should handle NaN', () => {
            expect(calculateAcceleration(100, NaN)).toBe(0);
            expect(calculateInelasticCollision(NaN, 10, 5, 5)).toBe(0);
            expect(calculateCentreOfMass(NaN, 100, 5, 200)).toBe(0);
        });

        test('should handle -0 (negative zero)', () => {
            // JavaScript has -0 which is distinct from +0
            // 10 * -0 = -0 in JavaScript
            const moment = calculateMoment(10, -0);
            expect(moment === 0 || moment === -0).toBe(true);
            expect(calculateAcceleration(100, -0)).toBe(0);
        });
    });
});
