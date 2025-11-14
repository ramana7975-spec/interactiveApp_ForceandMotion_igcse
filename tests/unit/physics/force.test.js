const {
    calculateResultantForce,
    calculateForceAngle,
    calculateAcceleration,
    calculateWeight
} = require('../../../physics-calculations');

describe('Force Physics Calculations', () => {

    describe('calculateResultantForce (Pythagorean theorem)', () => {
        test('should calculate resultant of two perpendicular forces', () => {
            // Given: F1=3N, F2=4N (3-4-5 triangle)
            // Expected: R = √(3² + 4²) = 5N
            expect(calculateResultantForce(3, 4)).toBe(5);
        });

        test('should calculate resultant with equal forces', () => {
            // Given: F1=50N, F2=50N
            // Expected: R = √(50² + 50²) = 50√2 ≈ 70.71N
            expect(calculateResultantForce(50, 50)).toBeCloseTo(70.71, 2);
        });

        test('should handle zero force in one direction', () => {
            // Given: F1=100N, F2=0N
            // Expected: R = √(100² + 0²) = 100N
            expect(calculateResultantForce(100, 0)).toBe(100);
        });

        test('should handle both forces being zero', () => {
            // Given: F1=0N, F2=0N
            // Expected: R = 0N
            expect(calculateResultantForce(0, 0)).toBe(0);
        });

        test('should handle negative forces', () => {
            // Given: F1=-3N, F2=-4N
            // Expected: R = √(9 + 16) = 5N (magnitude is always positive)
            expect(calculateResultantForce(-3, -4)).toBe(5);
        });

        test('should handle large forces', () => {
            // Given: F1=300N, F2=400N
            // Expected: R = √(300² + 400²) = 500N
            expect(calculateResultantForce(300, 400)).toBe(500);
        });

        test('should handle decimal values', () => {
            // Given: F1=5.5N, F2=7.2N
            // Expected: R = √(5.5² + 7.2²) ≈ 9.06N
            expect(calculateResultantForce(5.5, 7.2)).toBeCloseTo(9.06, 2);
        });

        test('IGCSE example: forces on a box', () => {
            // A box experiences 60N horizontally and 80N vertically
            // Expected: R = √(60² + 80²) = 100N
            expect(calculateResultantForce(60, 80)).toBe(100);
        });

        test('should handle very small forces', () => {
            // Given: F1=0.003N, F2=0.004N
            // Expected: R = 0.005N
            expect(calculateResultantForce(0.003, 0.004)).toBeCloseTo(0.005, 5);
        });
    });

    describe('calculateForceAngle', () => {
        test('should calculate angle for force pointing right and up (45°)', () => {
            // Given: F1=10N (right), F2=10N (up)
            // Expected: θ = 45°
            expect(calculateForceAngle(10, 10)).toBeCloseTo(45, 2);
        });

        test('should calculate angle for purely horizontal force', () => {
            // Given: F1=50N (right), F2=0N
            // Expected: θ = 0°
            expect(calculateForceAngle(50, 0)).toBe(0);
        });

        test('should calculate angle for purely vertical force', () => {
            // Given: F1=0N, F2=50N (up)
            // Expected: θ = 90°
            expect(calculateForceAngle(0, 50)).toBe(90);
        });

        test('should calculate angle for downward force (negative vertical)', () => {
            // Given: F1=10N (right), F2=-10N (down)
            // Expected: θ = -45°
            expect(calculateForceAngle(10, -10)).toBeCloseTo(-45, 2);
        });

        test('should calculate angle for leftward force (negative horizontal)', () => {
            // Given: F1=-10N (left), F2=10N (up)
            // Expected: θ = 135°
            expect(calculateForceAngle(-10, 10)).toBeCloseTo(135, 2);
        });

        test('should handle 3-4-5 triangle angle', () => {
            // Given: F1=3N, F2=4N
            // Expected: θ = arctan(4/3) ≈ 53.13°
            expect(calculateForceAngle(3, 4)).toBeCloseTo(53.13, 2);
        });

        test('should handle angle at 30 degrees', () => {
            // Given: F1=√3, F2=1 (30° angle)
            // Expected: θ ≈ 30°
            expect(calculateForceAngle(Math.sqrt(3), 1)).toBeCloseTo(30, 1);
        });

        test('should handle angle at 60 degrees', () => {
            // Given: F1=1, F2=√3 (60° angle)
            // Expected: θ ≈ 60°
            expect(calculateForceAngle(1, Math.sqrt(3))).toBeCloseTo(60, 1);
        });
    });

    describe('calculateAcceleration (F = ma)', () => {
        test('should calculate acceleration correctly', () => {
            // Given: F=100N, m=10kg
            // Expected: a = 100/10 = 10 m/s²
            expect(calculateAcceleration(100, 10)).toBe(10);
        });

        test('should calculate acceleration with decimal values', () => {
            // Given: F=15.5N, m=3.1kg
            // Expected: a = 15.5/3.1 = 5 m/s²
            expect(calculateAcceleration(15.5, 3.1)).toBe(5);
        });

        test('should handle zero force', () => {
            // Given: F=0N, m=10kg
            // Expected: a = 0 m/s²
            expect(calculateAcceleration(0, 10)).toBe(0);
        });

        test('should handle large force on small mass', () => {
            // Given: F=1000N, m=2kg
            // Expected: a = 500 m/s²
            expect(calculateAcceleration(1000, 2)).toBe(500);
        });

        test('should handle small force on large mass', () => {
            // Given: F=10N, m=1000kg
            // Expected: a = 0.01 m/s²
            expect(calculateAcceleration(10, 1000)).toBe(0.01);
        });

        test('should handle negative force (deceleration)', () => {
            // Given: F=-50N, m=10kg
            // Expected: a = -5 m/s² (deceleration)
            expect(calculateAcceleration(-50, 10)).toBe(-5);
        });

        test('IGCSE example: car acceleration', () => {
            // A car engine produces 3000N force on a 1500kg car
            // Expected: a = 3000/1500 = 2 m/s²
            expect(calculateAcceleration(3000, 1500)).toBe(2);
        });

        test('IGCSE example: rocket acceleration', () => {
            // A rocket with 10000N thrust and mass 500kg
            // Expected: a = 10000/500 = 20 m/s²
            expect(calculateAcceleration(10000, 500)).toBe(20);
        });
    });

    describe('calculateAcceleration - Division by Zero Protection', () => {
        test('should return 0 when mass is zero (prevent division by zero)', () => {
            // Given: F=100N, m=0kg
            // Expected: Return 0 instead of Infinity
            expect(calculateAcceleration(100, 0)).toBe(0);
        });

        test('should return 0 when mass is Infinity', () => {
            // Given: F=100N, m=Infinity
            // Expected: Return 0 (no acceleration for infinite mass)
            expect(calculateAcceleration(100, Infinity)).toBe(0);
        });

        test('should return 0 when mass is NaN', () => {
            // Given: F=100N, m=NaN
            // Expected: Return 0
            expect(calculateAcceleration(100, NaN)).toBe(0);
        });

        test('should return 0 when mass is -Infinity', () => {
            // Given: F=100N, m=-Infinity
            // Expected: Return 0
            expect(calculateAcceleration(100, -Infinity)).toBe(0);
        });

        test('should handle very small mass (not zero)', () => {
            // Given: F=1N, m=0.001kg
            // Expected: a = 1000 m/s²
            expect(calculateAcceleration(1, 0.001)).toBe(1000);
        });

        test('should handle negative mass (physically impossible but mathematically valid)', () => {
            // Given: F=100N, m=-10kg
            // Expected: a = -10 m/s² (returns mathematical result)
            expect(calculateAcceleration(100, -10)).toBe(-10);
        });
    });

    describe('calculateWeight', () => {
        test('should calculate weight with default gravity (9.8 m/s²)', () => {
            // Given: m=10kg, g=9.8m/s²
            // Expected: W = 10 * 9.8 = 98N
            expect(calculateWeight(10)).toBe(98);
        });

        test('should calculate weight with custom gravity', () => {
            // Given: m=10kg, g=10m/s²
            // Expected: W = 10 * 10 = 100N
            expect(calculateWeight(10, 10)).toBe(100);
        });

        test('should calculate weight on the Moon (g=1.6 m/s²)', () => {
            // Given: m=60kg, g=1.6m/s²
            // Expected: W = 60 * 1.6 = 96N
            expect(calculateWeight(60, 1.6)).toBe(96);
        });

        test('should calculate weight on Mars (g=3.7 m/s²)', () => {
            // Given: m=70kg, g=3.7m/s²
            // Expected: W = 70 * 3.7 = 259N
            expect(calculateWeight(70, 3.7)).toBe(259);
        });

        test('should handle zero mass', () => {
            // Given: m=0kg
            // Expected: W = 0N
            expect(calculateWeight(0)).toBe(0);
        });

        test('should handle decimal mass', () => {
            // Given: m=2.5kg, g=9.8m/s²
            // Expected: W = 2.5 * 9.8 = 24.5N
            expect(calculateWeight(2.5)).toBe(24.5);
        });

        test('IGCSE example: person weight on Earth', () => {
            // A 50kg person on Earth
            // Expected: W = 50 * 9.8 = 490N
            expect(calculateWeight(50)).toBeCloseTo(490, 10);
        });

        test('IGCSE example: comparing weight on Earth vs Moon', () => {
            const mass = 80; // kg
            const weightEarth = calculateWeight(mass, 9.8);
            const weightMoon = calculateWeight(mass, 1.6);

            expect(weightEarth).toBe(784);
            expect(weightMoon).toBe(128);
            expect(weightEarth / weightMoon).toBeCloseTo(6.125, 2);
        });

        test('should handle very large mass', () => {
            // Given: m=1000kg
            // Expected: W = 1000 * 9.8 = 9800N
            expect(calculateWeight(1000)).toBe(9800);
        });

        test('should handle very small mass', () => {
            // Given: m=0.001kg
            // Expected: W = 0.001 * 9.8 = 0.0098N
            expect(calculateWeight(0.001)).toBeCloseTo(0.0098, 6);
        });
    });

    describe('Newton\'s Second Law Integration', () => {
        test('should verify F = ma relationship', () => {
            const mass = 15; // kg
            const acceleration = 4; // m/s²
            const force = mass * acceleration; // 60N

            const calculatedAcceleration = calculateAcceleration(force, mass);
            expect(calculatedAcceleration).toBe(acceleration);
        });

        test('should handle weight force causing free fall acceleration', () => {
            const mass = 10; // kg
            const weight = calculateWeight(mass, 9.8);
            const acceleration = calculateAcceleration(weight, mass);

            // When only weight acts, acceleration should equal g
            expect(acceleration).toBeCloseTo(9.8, 10);
        });

        test('IGCSE problem: net force and acceleration', () => {
            // A 20kg box pushed with 100N force, friction is 40N
            const mass = 20;
            const pushForce = 100;
            const friction = 40;
            const netForce = pushForce - friction; // 60N

            const acceleration = calculateAcceleration(netForce, mass);
            expect(acceleration).toBe(3); // 3 m/s²
        });
    });
});
