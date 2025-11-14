const {
    calculateMomentum,
    calculateTotalMomentum,
    calculateElasticCollision,
    calculateInelasticCollision,
    isMomentumConserved
} = require('../../../physics-calculations');

describe('Momentum Physics Calculations', () => {

    describe('calculateMomentum (p = mv)', () => {
        test('should calculate momentum correctly', () => {
            // Given: m=5kg, v=10m/s
            // Expected: p = 5 * 10 = 50 kg·m/s
            expect(calculateMomentum(5, 10)).toBe(50);
        });

        test('should handle zero velocity', () => {
            // Given: m=10kg, v=0m/s
            // Expected: p = 0 kg·m/s
            expect(calculateMomentum(10, 0)).toBe(0);
        });

        test('should handle zero mass', () => {
            // Given: m=0kg, v=10m/s
            // Expected: p = 0 kg·m/s
            expect(calculateMomentum(0, 10)).toBe(0);
        });

        test('should handle negative velocity (opposite direction)', () => {
            // Given: m=8kg, v=-5m/s
            // Expected: p = -40 kg·m/s
            expect(calculateMomentum(8, -5)).toBe(-40);
        });

        test('should handle decimal values', () => {
            // Given: m=2.5kg, v=4.2m/s
            // Expected: p = 10.5 kg·m/s
            expect(calculateMomentum(2.5, 4.2)).toBeCloseTo(10.5, 10);
        });

        test('should handle large values', () => {
            // Given: m=1000kg, v=50m/s
            // Expected: p = 50000 kg·m/s
            expect(calculateMomentum(1000, 50)).toBe(50000);
        });

        test('IGCSE example: moving car', () => {
            // A 1200kg car moving at 25m/s
            // Expected: p = 30000 kg·m/s
            expect(calculateMomentum(1200, 25)).toBe(30000);
        });

        test('IGCSE example: bullet', () => {
            // A 0.01kg bullet moving at 300m/s
            // Expected: p = 3 kg·m/s
            expect(calculateMomentum(0.01, 300)).toBe(3);
        });
    });

    describe('calculateTotalMomentum', () => {
        test('should calculate total momentum of two objects moving in same direction', () => {
            // Given: m1=5kg at 8m/s, m2=3kg at 4m/s
            // Expected: p_total = 5*8 + 3*4 = 40 + 12 = 52 kg·m/s
            expect(calculateTotalMomentum(5, 8, 3, 4)).toBe(52);
        });

        test('should calculate total momentum of objects moving in opposite directions', () => {
            // Given: m1=5kg at 8m/s, m2=3kg at -4m/s
            // Expected: p_total = 5*8 + 3*(-4) = 40 - 12 = 28 kg·m/s
            expect(calculateTotalMomentum(5, 8, 3, -4)).toBe(28);
        });

        test('should handle head-on collision with equal opposite momenta', () => {
            // Given: m1=10kg at 5m/s, m2=10kg at -5m/s
            // Expected: p_total = 10*5 + 10*(-5) = 0 kg·m/s
            expect(calculateTotalMomentum(10, 5, 10, -5)).toBe(0);
        });

        test('should handle one object at rest', () => {
            // Given: m1=6kg at 10m/s, m2=4kg at 0m/s
            // Expected: p_total = 60 kg·m/s
            expect(calculateTotalMomentum(6, 10, 4, 0)).toBe(60);
        });

        test('should handle both objects at rest', () => {
            // Given: m1=5kg at 0m/s, m2=3kg at 0m/s
            // Expected: p_total = 0 kg·m/s
            expect(calculateTotalMomentum(5, 0, 3, 0)).toBe(0);
        });

        test('IGCSE example: collision setup', () => {
            // Object 1: 5kg at 8m/s, Object 2: 3kg at -4m/s
            // This is the setup from the app's default values
            expect(calculateTotalMomentum(5, 8, 3, -4)).toBe(28);
        });

        test('should handle negative velocities for both objects', () => {
            // Given: m1=4kg at -6m/s, m2=2kg at -3m/s
            // Expected: p_total = -24 - 6 = -30 kg·m/s
            expect(calculateTotalMomentum(4, -6, 2, -3)).toBe(-30);
        });
    });

    describe('calculateElasticCollision', () => {
        test('should calculate final velocities for elastic collision', () => {
            // Given: m1=5kg at 8m/s, m2=3kg at -4m/s (head-on collision)
            // Using elastic collision formulas
            const result = calculateElasticCollision(5, 8, 3, -4);

            // v1f = ((m1-m2)*v1 + 2*m2*v2) / (m1+m2)
            // v1f = ((5-3)*8 + 2*3*(-4)) / 8 = (16 - 24) / 8 = -1
            expect(result.v1f).toBe(-1);

            // v2f = ((m2-m1)*v2 + 2*m1*v1) / (m1+m2)
            // v2f = ((3-5)*(-4) + 2*5*8) / 8 = (8 + 80) / 8 = 11
            expect(result.v2f).toBe(11);
        });

        test('should conserve momentum in elastic collision', () => {
            const m1 = 5, v1 = 8, m2 = 3, v2 = -4;
            const initialMomentum = calculateTotalMomentum(m1, v1, m2, v2);

            const { v1f, v2f } = calculateElasticCollision(m1, v1, m2, v2);
            const finalMomentum = calculateTotalMomentum(m1, v1f, m2, v2f);

            expect(finalMomentum).toBeCloseTo(initialMomentum, 10);
        });

        test('should handle collision with stationary object', () => {
            // Given: m1=6kg at 10m/s hits m2=4kg at rest
            const result = calculateElasticCollision(6, 10, 4, 0);

            // Check momentum conservation
            const initialMomentum = 6 * 10; // 60
            const finalMomentum = 6 * result.v1f + 4 * result.v2f;

            expect(finalMomentum).toBeCloseTo(initialMomentum, 10);
        });

        test('should handle equal mass elastic collision with one at rest', () => {
            // Given: m1=5kg at 10m/s, m2=5kg at 0m/s
            // Expected: m1 stops, m2 moves at 10m/s (Newton's cradle effect)
            const result = calculateElasticCollision(5, 10, 5, 0);

            expect(result.v1f).toBeCloseTo(0, 10);
            expect(result.v2f).toBeCloseTo(10, 10);
        });

        test('should handle equal mass head-on collision with equal speeds', () => {
            // Given: m1=5kg at 10m/s, m2=5kg at -10m/s
            // Expected: velocities swap
            const result = calculateElasticCollision(5, 10, 5, -10);

            expect(result.v1f).toBeCloseTo(-10, 10);
            expect(result.v2f).toBeCloseTo(10, 10);
        });

        test('should conserve kinetic energy in elastic collision', () => {
            const m1 = 4, v1 = 6, m2 = 2, v2 = -3;

            const initialKE = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;

            const { v1f, v2f } = calculateElasticCollision(m1, v1, m2, v2);

            const finalKE = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;

            expect(finalKE).toBeCloseTo(initialKE, 10);
        });

        test('IGCSE example: billiard balls (equal masses)', () => {
            // Two billiard balls: 0.2kg each, one at 5m/s hits stationary ball
            const m = 0.2;
            const result = calculateElasticCollision(m, 5, m, 0);

            expect(result.v1f).toBeCloseTo(0, 10);
            expect(result.v2f).toBeCloseTo(5, 10);
        });

        test('should handle very different masses (large hits small)', () => {
            // Given: m1=10kg at 5m/s, m2=1kg at 0m/s
            const result = calculateElasticCollision(10, 5, 1, 0);

            // Large mass should barely slow down, small mass should move fast
            expect(result.v1f).toBeGreaterThan(4);
            expect(result.v2f).toBeGreaterThan(9);
        });

        test('should handle very different masses (small hits large)', () => {
            // Given: m1=1kg at 10m/s, m2=10kg at 0m/s
            const result = calculateElasticCollision(1, 10, 10, 0);

            // Small mass should bounce back, large mass should move slowly
            expect(result.v1f).toBeLessThan(0);
            expect(result.v2f).toBeGreaterThan(0);
        });
    });

    describe('calculateElasticCollision - Division by Zero Protection', () => {
        test('should handle zero total mass', () => {
            // Given: m1=0kg, m2=0kg (impossible but test edge case)
            const result = calculateElasticCollision(0, 10, 0, 5);

            expect(result.v1f).toBe(0);
            expect(result.v2f).toBe(0);
        });

        test('should handle one mass being zero', () => {
            // Given: m1=5kg at 10m/s, m2=0kg at 5m/s
            // When m2=0: v1f = ((5-0)*10 + 2*0*5) / 5 = 50/5 = 10
            // When m2=0: v2f = ((0-5)*5 + 2*5*10) / 5 = (-25 + 100) / 5 = 15
            const result = calculateElasticCollision(5, 10, 0, 5);

            // Should still calculate without division by zero
            expect(result.v1f).toBe(10);
            expect(result.v2f).toBe(15);
        });

        test('should handle Infinity mass', () => {
            // Given: m1=5kg at 10m/s, m2=Infinity at 0m/s
            const result = calculateElasticCollision(5, 10, Infinity, 0);

            expect(result.v1f).toBe(0);
            expect(result.v2f).toBe(0);
        });

        test('should handle NaN input', () => {
            const result = calculateElasticCollision(NaN, 10, 5, 5);

            expect(result.v1f).toBe(0);
            expect(result.v2f).toBe(0);
        });
    });

    describe('calculateInelasticCollision', () => {
        test('should calculate final velocity for inelastic collision', () => {
            // Given: m1=5kg at 8m/s, m2=3kg at -4m/s
            // vf = (m1*v1 + m2*v2) / (m1+m2) = (40 - 12) / 8 = 3.5 m/s
            const vf = calculateInelasticCollision(5, 8, 3, -4);

            expect(vf).toBe(3.5);
        });

        test('should conserve momentum in inelastic collision', () => {
            const m1 = 5, v1 = 8, m2 = 3, v2 = -4;
            const initialMomentum = calculateTotalMomentum(m1, v1, m2, v2);

            const vf = calculateInelasticCollision(m1, v1, m2, v2);
            const finalMomentum = (m1 + m2) * vf;

            expect(finalMomentum).toBeCloseTo(initialMomentum, 10);
        });

        test('should handle collision with stationary object', () => {
            // Given: m1=6kg at 10m/s, m2=4kg at 0m/s
            // vf = (6*10 + 4*0) / 10 = 6 m/s
            const vf = calculateInelasticCollision(6, 10, 4, 0);

            expect(vf).toBe(6);
        });

        test('should result in zero velocity for equal opposite momenta', () => {
            // Given: m1=5kg at 10m/s, m2=5kg at -10m/s
            // vf = (50 - 50) / 10 = 0 m/s
            const vf = calculateInelasticCollision(5, 10, 5, -10);

            expect(vf).toBe(0);
        });

        test('should handle both objects moving in same direction', () => {
            // Given: m1=4kg at 8m/s, m2=2kg at 4m/s
            // vf = (32 + 8) / 6 = 6.67 m/s
            const vf = calculateInelasticCollision(4, 8, 2, 4);

            expect(vf).toBeCloseTo(6.67, 2);
        });

        test('IGCSE example: car collision', () => {
            // 1000kg car at 20m/s collides with 800kg car at 0m/s, they stick
            // vf = (1000*20 + 0) / 1800 = 11.11 m/s
            const vf = calculateInelasticCollision(1000, 20, 800, 0);

            expect(vf).toBeCloseTo(11.11, 2);
        });

        test('kinetic energy should be lost in inelastic collision', () => {
            const m1 = 5, v1 = 8, m2 = 3, v2 = -4;

            const initialKE = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;

            const vf = calculateInelasticCollision(m1, v1, m2, v2);
            const finalKE = 0.5 * (m1 + m2) * vf * vf;

            // Final KE should be less than initial KE
            expect(finalKE).toBeLessThan(initialKE);
        });

        test('should handle decimal masses and velocities', () => {
            // Given: m1=2.5kg at 6.2m/s, m2=1.5kg at 3.8m/s
            const vf = calculateInelasticCollision(2.5, 6.2, 1.5, 3.8);

            const expectedVf = (2.5 * 6.2 + 1.5 * 3.8) / 4.0;
            expect(vf).toBeCloseTo(expectedVf, 10);
        });

        test('should handle large mass differences', () => {
            // Given: m1=1000kg at 5m/s, m2=10kg at 20m/s
            const vf = calculateInelasticCollision(1000, 5, 10, 20);

            // Larger mass dominates the final velocity
            const expectedVf = (5000 + 200) / 1010;
            expect(vf).toBeCloseTo(expectedVf, 10);
        });
    });

    describe('calculateInelasticCollision - Division by Zero Protection', () => {
        test('should handle zero total mass', () => {
            // Given: m1=0kg, m2=0kg
            const vf = calculateInelasticCollision(0, 10, 0, 5);

            expect(vf).toBe(0);
        });

        test('should handle one mass being zero', () => {
            // Given: m1=5kg at 10m/s, m2=0kg at 5m/s
            // vf = 50 / 5 = 10 m/s
            const vf = calculateInelasticCollision(5, 10, 0, 5);

            expect(vf).toBe(10);
        });

        test('should handle Infinity mass', () => {
            const vf = calculateInelasticCollision(5, 10, Infinity, 0);

            expect(vf).toBe(0);
        });

        test('should handle NaN input', () => {
            const vf = calculateInelasticCollision(NaN, 10, 5, 5);

            expect(vf).toBe(0);
        });
    });

    describe('isMomentumConserved', () => {
        test('should return true when momentum is exactly conserved', () => {
            expect(isMomentumConserved(100, 100)).toBe(true);
        });

        test('should return true when difference is within tolerance', () => {
            expect(isMomentumConserved(100, 100.05)).toBe(true);
        });

        test('should return false when difference exceeds tolerance', () => {
            expect(isMomentumConserved(100, 100.2)).toBe(false);
        });

        test('should handle negative momentum values', () => {
            expect(isMomentumConserved(-50, -50.05)).toBe(true);
            expect(isMomentumConserved(-50, -50.2)).toBe(false);
        });

        test('should work with custom tolerance', () => {
            expect(isMomentumConserved(100, 100.5, 0.6)).toBe(true);
            expect(isMomentumConserved(100, 100.5, 0.4)).toBe(false);
        });

        test('should handle zero momentum', () => {
            expect(isMomentumConserved(0, 0.05)).toBe(true);
            expect(isMomentumConserved(0, 0.15)).toBe(false);
        });

        test('should handle very small differences', () => {
            expect(isMomentumConserved(1000, 1000.01)).toBe(true);
        });
    });

    describe('Momentum Conservation in Collisions', () => {
        test('elastic collision should conserve momentum', () => {
            const m1 = 6, v1 = 12, m2 = 4, v2 = -8;

            const initialMomentum = calculateTotalMomentum(m1, v1, m2, v2);
            const { v1f, v2f } = calculateElasticCollision(m1, v1, m2, v2);
            const finalMomentum = calculateTotalMomentum(m1, v1f, m2, v2f);

            expect(isMomentumConserved(initialMomentum, finalMomentum)).toBe(true);
        });

        test('inelastic collision should conserve momentum', () => {
            const m1 = 8, v1 = 10, m2 = 5, v2 = -6;

            const initialMomentum = calculateTotalMomentum(m1, v1, m2, v2);
            const vf = calculateInelasticCollision(m1, v1, m2, v2);
            const finalMomentum = (m1 + m2) * vf;

            expect(isMomentumConserved(initialMomentum, finalMomentum)).toBe(true);
        });

        test('multiple collision scenarios should all conserve momentum', () => {
            const scenarios = [
                { m1: 5, v1: 8, m2: 3, v2: -4 },
                { m1: 10, v1: 5, m2: 10, v2: -5 },
                { m1: 2, v1: 15, m2: 8, v2: 0 },
                { m1: 7, v1: -6, m2: 4, v2: 9 }
            ];

            scenarios.forEach(({ m1, v1, m2, v2 }) => {
                const initialMomentum = calculateTotalMomentum(m1, v1, m2, v2);

                // Test elastic collision
                const { v1f, v2f } = calculateElasticCollision(m1, v1, m2, v2);
                const finalMomentumElastic = calculateTotalMomentum(m1, v1f, m2, v2f);
                expect(isMomentumConserved(initialMomentum, finalMomentumElastic)).toBe(true);

                // Test inelastic collision
                const vf = calculateInelasticCollision(m1, v1, m2, v2);
                const finalMomentumInelastic = (m1 + m2) * vf;
                expect(isMomentumConserved(initialMomentum, finalMomentumInelastic)).toBe(true);
            });
        });
    });

    describe('IGCSE Exam-style Problems', () => {
        test('collision problem: truck and car', () => {
            // A 2000kg truck traveling at 15m/s collides with a 1000kg car at rest
            // They stick together. Find final velocity.
            const m1 = 2000, v1 = 15, m2 = 1000, v2 = 0;

            const initialMomentum = calculateTotalMomentum(m1, v1, m2, v2);
            const vf = calculateInelasticCollision(m1, v1, m2, v2);
            const finalMomentum = (m1 + m2) * vf;

            expect(vf).toBe(10); // Final velocity = 10 m/s
            expect(isMomentumConserved(initialMomentum, finalMomentum)).toBe(true);
        });

        test('explosion problem: reverse collision', () => {
            // A stationary 12kg object explodes into two pieces
            // 8kg piece moves at 9m/s right, find velocity of 4kg piece
            const m1 = 8, v1 = 9, m2 = 4;

            // Initial momentum = 0 (stationary)
            // Final: 8*9 + 4*v2 = 0
            // v2 = -18 m/s
            const initialMomentum = 0;
            const v2 = (initialMomentum - m1 * v1) / m2;

            expect(v2).toBe(-18);

            const finalMomentum = calculateTotalMomentum(m1, v1, m2, v2);
            expect(isMomentumConserved(initialMomentum, finalMomentum)).toBe(true);
        });

        test('catching a ball problem', () => {
            // A 0.5kg ball moving at 20m/s is caught by a 60kg person at rest
            // Find their combined velocity
            const m1 = 0.5, v1 = 20, m2 = 60, v2 = 0;

            const vf = calculateInelasticCollision(m1, v1, m2, v2);

            // vf = (0.5*20 + 0) / 60.5 ≈ 0.165 m/s
            expect(vf).toBeCloseTo(0.165, 3);
        });
    });
});
