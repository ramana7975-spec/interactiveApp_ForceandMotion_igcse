const {
    calculateCentreOfMass,
    isSystemBalanced
} = require('../../../physics-calculations');

describe('Centre of Mass Physics Calculations', () => {

    describe('calculateCentreOfMass', () => {
        test('should calculate centre of mass for equal masses', () => {
            // Given: m1=5kg at 100, m2=5kg at 200
            // Expected: x_cm = (5*100 + 5*200) / 10 = 150
            expect(calculateCentreOfMass(5, 100, 5, 200)).toBe(150);
        });

        test('should calculate centre of mass for different masses', () => {
            // Given: m1=3kg at 100, m2=7kg at 200
            // Expected: x_cm = (3*100 + 7*200) / 10 = 170
            expect(calculateCentreOfMass(3, 100, 7, 200)).toBe(170);
        });

        test('should be closer to heavier mass', () => {
            // Given: m1=2kg at 0, m2=8kg at 100
            // Expected: x_cm = (0 + 800) / 10 = 80 (closer to m2)
            const cm = calculateCentreOfMass(2, 0, 8, 100);
            expect(cm).toBe(80);
            expect(cm).toBeGreaterThan(50); // Closer to the heavier mass
        });

        test('should handle masses at same position', () => {
            // Given: m1=3kg at 150, m2=7kg at 150
            // Expected: x_cm = 150 (same position)
            expect(calculateCentreOfMass(3, 150, 7, 150)).toBe(150);
        });

        test('should handle one mass being zero', () => {
            // Given: m1=0kg at 100, m2=10kg at 300
            // Expected: x_cm = (0 + 3000) / 10 = 300 (at the only mass)
            expect(calculateCentreOfMass(0, 100, 10, 300)).toBe(300);
        });

        test('should handle negative positions', () => {
            // Given: m1=4kg at -50, m2=6kg at 100
            // Expected: x_cm = (4*(-50) + 6*100) / 10 = 40
            expect(calculateCentreOfMass(4, -50, 6, 100)).toBe(40);
        });

        test('should handle decimal values', () => {
            // Given: m1=2.5kg at 100.5, m2=3.5kg at 200.5
            // Expected: x_cm = (2.5*100.5 + 3.5*200.5) / 6
            const expected = (2.5 * 100.5 + 3.5 * 200.5) / 6;
            expect(calculateCentreOfMass(2.5, 100.5, 3.5, 200.5)).toBeCloseTo(expected, 10);
        });

        test('IGCSE example: seesaw problem', () => {
            // A 30kg child at 1m from pivot, 50kg adult at xm from pivot
            // For balance: 30*1 = 50*x, so x = 0.6m
            // Centre of mass should be at pivot (position 0)
            const childMass = 30, childPos = 1;
            const adultMass = 50, adultPos = -0.6;

            const cm = calculateCentreOfMass(childMass, childPos, adultMass, adultPos);
            expect(cm).toBeCloseTo(0, 10);
        });

        test('should handle app default values', () => {
            // Default: m1=5kg at 100, m2=3kg at 400
            const cm = calculateCentreOfMass(5, 100, 3, 400);

            // Expected: (500 + 1200) / 8 = 212.5
            expect(cm).toBe(212.5);
        });

        test('centre of mass should be between the two masses (for same sign positions)', () => {
            const m1 = 4, x1 = 100, m2 = 6, x2 = 300;
            const cm = calculateCentreOfMass(m1, x1, m2, x2);

            expect(cm).toBeGreaterThan(x1);
            expect(cm).toBeLessThan(x2);
        });

        test('should handle very large position values', () => {
            const cm = calculateCentreOfMass(1, 1000, 1, 2000);
            expect(cm).toBe(1500);
        });

        test('should handle very small position values', () => {
            const cm = calculateCentreOfMass(1, 0.001, 1, 0.002);
            expect(cm).toBeCloseTo(0.0015, 10);
        });
    });

    describe('calculateCentreOfMass - Division by Zero Protection', () => {
        test('should return 0 when total mass is zero', () => {
            // Given: m1=0kg, m2=0kg
            expect(calculateCentreOfMass(0, 100, 0, 200)).toBe(0);
        });

        test('should handle Infinity mass', () => {
            expect(calculateCentreOfMass(Infinity, 100, 5, 200)).toBe(0);
        });

        test('should handle NaN input', () => {
            expect(calculateCentreOfMass(NaN, 100, 5, 200)).toBe(0);
        });

        test('should handle negative infinity', () => {
            expect(calculateCentreOfMass(5, 100, -Infinity, 200)).toBe(0);
        });

        test('should correctly handle one zero mass (not division by zero)', () => {
            // This should work normally since total mass is non-zero
            const cm = calculateCentreOfMass(0, 100, 5, 200);
            expect(cm).toBe(200); // Should be at position of the only mass
        });
    });

    describe('isSystemBalanced', () => {
        test('should return true for perfectly balanced system', () => {
            // Given: m1=5kg at 100, m2=5kg at 200, pivot at 150
            // Moment1 = 5 * |100-150| = 250
            // Moment2 = 5 * |200-150| = 250
            expect(isSystemBalanced(5, 100, 5, 200, 150)).toBe(true);
        });

        test('should return true when system is balanced at centre of mass', () => {
            const m1 = 3, x1 = 100, m2 = 7, x2 = 200;
            const pivot = calculateCentreOfMass(m1, x1, m2, x2);

            expect(isSystemBalanced(m1, x1, m2, x2, pivot)).toBe(true);
        });

        test('should return false for unbalanced system', () => {
            // Given: m1=5kg at 100, m2=5kg at 200, pivot at 120 (not centre)
            expect(isSystemBalanced(5, 100, 5, 200, 120)).toBe(false);
        });

        test('should use custom tolerance', () => {
            // Given: m1=5kg at 100, m2=5kg at 201, pivot at 150
            // Moment1 = 5 * 50 = 250
            // Moment2 = 5 * 51 = 255
            // Difference = 5 (within tolerance of 10)
            expect(isSystemBalanced(5, 100, 5, 201, 150, 10)).toBe(true);
            expect(isSystemBalanced(5, 100, 5, 201, 150, 4)).toBe(false);
        });

        test('should handle unequal masses balanced correctly', () => {
            // Given: m1=30kg at 1m, m2=50kg at -0.6m from pivot at 0
            // Moment1 = 30 * 1 = 30
            // Moment2 = 50 * 0.6 = 30
            expect(isSystemBalanced(30, 1, 50, -0.6, 0)).toBe(true);
        });

        test('should handle pivot not between masses', () => {
            // Given: m1=5kg at 100, m2=3kg at 200, pivot at 50
            // This tests that absolute distance is used correctly
            const m1 = 5, x1 = 100, m2 = 3, x2 = 200, pivot = 50;

            // Moment1 = 5 * |100-50| = 250
            // Moment2 = 3 * |200-50| = 450
            expect(isSystemBalanced(m1, x1, m2, x2, pivot)).toBe(false);
        });

        test('IGCSE example: lever balance', () => {
            // A 20N weight at 0.5m balances a 10N weight at 1.0m
            // Using weight as "mass" and distance as position from pivot at 0
            expect(isSystemBalanced(20, 0.5, 10, -1.0, 0)).toBe(true);
        });

        test('should handle same position for both masses (edge case)', () => {
            // If both masses at same position, any pivot at that position is balanced
            expect(isSystemBalanced(5, 100, 3, 100, 100)).toBe(true);
        });

        test('should handle one mass at pivot', () => {
            // m1 at pivot has zero moment
            // m2 away from pivot has non-zero moment
            // System is unbalanced
            expect(isSystemBalanced(5, 150, 5, 200, 150)).toBe(false);
        });

        test('should handle both masses at pivot', () => {
            // Both at pivot, zero moments, balanced
            expect(isSystemBalanced(5, 150, 3, 150, 150)).toBe(true);
        });

        test('should handle negative positions correctly', () => {
            // m1=4kg at -100, m2=6kg at 100, pivot at 20
            // Moment1 = 4 * |-100-20| = 480
            // Moment2 = 6 * |100-20| = 480
            expect(isSystemBalanced(4, -100, 6, 100, 20)).toBe(true);
        });
    });

    describe('Centre of Mass and Balance Integration', () => {
        test('system should always balance when pivot is at centre of mass', () => {
            const testCases = [
                { m1: 5, x1: 100, m2: 3, x2: 400 },
                { m1: 10, x1: 50, m2: 20, x2: 200 },
                { m1: 2, x1: -100, m2: 8, x2: 100 },
                { m1: 7, x1: 0, m2: 3, x2: 500 }
            ];

            testCases.forEach(({ m1, x1, m2, x2 }) => {
                const cm = calculateCentreOfMass(m1, x1, m2, x2);
                const balanced = isSystemBalanced(m1, x1, m2, x2, cm);
                expect(balanced).toBe(true);
            });
        });

        test('moment principle: m1*d1 = m2*d2 for balance', () => {
            const m1 = 15, x1 = 200;
            const m2 = 25, x2 = 380;
            const pivot = calculateCentreOfMass(m1, x1, m2, x2);

            const d1 = Math.abs(x1 - pivot);
            const d2 = Math.abs(x2 - pivot);

            const moment1 = m1 * d1;
            const moment2 = m2 * d2;

            expect(moment1).toBeCloseTo(moment2, 10);
        });

        test('moving pivot away from centre of mass creates imbalance', () => {
            const m1 = 5, x1 = 100, m2 = 5, x2 = 300;
            const cm = calculateCentreOfMass(m1, x1, m2, x2); // Should be 200

            // At centre of mass - balanced
            expect(isSystemBalanced(m1, x1, m2, x2, cm)).toBe(true);

            // Away from centre of mass - unbalanced (with default tolerance)
            expect(isSystemBalanced(m1, x1, m2, x2, cm + 10)).toBe(false);
            expect(isSystemBalanced(m1, x1, m2, x2, cm - 10)).toBe(false);
        });
    });

    describe('IGCSE Exam-style Problems', () => {
        test('uniform rod with masses at ends', () => {
            // A 2m uniform rod of mass 4kg with a 6kg mass at one end
            // Treat rod mass at centre (1m), other mass at end (2m)
            // Find centre of mass
            const rodMass = 4, rodPos = 1;
            const endMass = 6, endPos = 2;

            const cm = calculateCentreOfMass(rodMass, rodPos, endMass, endPos);

            // Expected: (4*1 + 6*2) / 10 = 1.6m
            expect(cm).toBe(1.6);
        });

        test('balancing irregular object', () => {
            // Two point masses: 8kg at 0.3m and 12kg at 0.7m
            // Where is the balance point?
            const cm = calculateCentreOfMass(8, 0.3, 12, 0.7);

            // Expected: (8*0.3 + 12*0.7) / 20 = 0.54m
            expect(cm).toBeCloseTo(0.54, 10);

            // Verify it balances at this point
            expect(isSystemBalanced(8, 0.3, 12, 0.7, cm)).toBe(true);
        });

        test('seesaw problem with known balance point', () => {
            // A seesaw balances when a 40kg child sits 1.5m from pivot
            // Where must a 60kg adult sit to balance?
            const childMass = 40, childPos = 1.5;
            const adultMass = 60;

            // For balance: m1*d1 = m2*d2
            // 40*1.5 = 60*d2, so d2 = 1m
            // If pivot is at 0, adult must be at -1m
            const adultPos = -(childMass * childPos / adultMass);

            expect(adultPos).toBe(-1);

            // Verify balance
            expect(isSystemBalanced(childMass, childPos, adultMass, adultPos, 0)).toBe(true);

            // Verify centre of mass at pivot
            const cm = calculateCentreOfMass(childMass, childPos, adultMass, adultPos);
            expect(cm).toBeCloseTo(0, 10);
        });

        test('finding unknown mass for balance', () => {
            // A 15kg mass at 2m from pivot balances an unknown mass at 3m
            // Find the unknown mass
            const m1 = 15, d1 = 2;
            const d2 = 3;

            // For balance: m1*d1 = m2*d2
            const m2 = (m1 * d1) / d2;

            expect(m2).toBe(10);

            // Verify balance (using positions relative to pivot at 0)
            expect(isSystemBalanced(m1, d1, m2, -d2, 0)).toBe(true);
        });
    });

    describe('Stability Concepts', () => {
        test('wider base means lower centre of mass with same total mass', () => {
            // Configuration 1: masses closer together
            const cm1 = calculateCentreOfMass(5, 100, 5, 200);

            // Configuration 2: masses farther apart (same total mass)
            const cm2 = calculateCentreOfMass(5, 50, 5, 250);

            // Centre of mass should be at midpoint for equal masses
            expect(cm1).toBe(150);
            expect(cm2).toBe(150);
            // This shows that equal masses always balance at midpoint
        });

        test('heavier mass creates centre of mass closer to it', () => {
            // Light mass at 0, heavy mass at 100
            const cm1 = calculateCentreOfMass(1, 0, 9, 100);

            // Equal masses at 0 and 100
            const cm2 = calculateCentreOfMass(5, 0, 5, 100);

            // Heavy mass case should have CM closer to 100
            expect(cm1).toBeGreaterThan(cm2);
            expect(cm1).toBe(90); // Much closer to heavy mass
            expect(cm2).toBe(50); // At midpoint
        });
    });
});
