const {
    calculateFinalVelocity,
    calculateDisplacement,
    calculateAreaUnderGraph,
    calculateFinalVelocityFromDisplacement
} = require('../../../physics-calculations');

describe('Motion Physics Calculations', () => {

    describe('calculateFinalVelocity (v = u + at)', () => {
        test('should calculate correct final velocity with positive acceleration', () => {
            // Given: u=0, a=2, t=10
            // Expected: v = 0 + 2*10 = 20 m/s
            expect(calculateFinalVelocity(0, 2, 10)).toBe(20);
        });

        test('should calculate correct final velocity with initial velocity', () => {
            // Given: u=5, a=3, t=4
            // Expected: v = 5 + 3*4 = 17 m/s
            expect(calculateFinalVelocity(5, 3, 4)).toBe(17);
        });

        test('should handle negative acceleration (deceleration)', () => {
            // Given: u=20, a=-2, t=5
            // Expected: v = 20 + (-2)*5 = 10 m/s
            expect(calculateFinalVelocity(20, -2, 5)).toBe(10);
        });

        test('should handle zero acceleration (constant velocity)', () => {
            // Given: u=15, a=0, t=10
            // Expected: v = 15 + 0*10 = 15 m/s
            expect(calculateFinalVelocity(15, 0, 10)).toBe(15);
        });

        test('should handle coming to rest', () => {
            // Given: u=10, a=-2, t=5
            // Expected: v = 10 + (-2)*5 = 0 m/s
            expect(calculateFinalVelocity(10, -2, 5)).toBe(0);
        });

        test('should handle zero time', () => {
            // Given: u=10, a=5, t=0
            // Expected: v = 10 + 5*0 = 10 m/s
            expect(calculateFinalVelocity(10, 5, 0)).toBe(10);
        });

        test('should handle negative initial velocity', () => {
            // Given: u=-10, a=2, t=5
            // Expected: v = -10 + 2*5 = 0 m/s
            expect(calculateFinalVelocity(-10, 2, 5)).toBe(0);
        });

        test('should handle decimal values', () => {
            // Given: u=2.5, a=1.5, t=3.2
            // Expected: v = 2.5 + 1.5*3.2 = 7.3 m/s
            expect(calculateFinalVelocity(2.5, 1.5, 3.2)).toBeCloseTo(7.3, 10);
        });

        test('should handle large values', () => {
            // Given: u=100, a=50, t=20
            // Expected: v = 100 + 50*20 = 1100 m/s
            expect(calculateFinalVelocity(100, 50, 20)).toBe(1100);
        });
    });

    describe('calculateDisplacement (s = ut + ½at²)', () => {
        test('should calculate displacement from rest with constant acceleration', () => {
            // Given: u=0, a=2, t=10
            // Expected: s = 0*10 + 0.5*2*10² = 100 m
            expect(calculateDisplacement(0, 2, 10)).toBe(100);
        });

        test('should calculate displacement with initial velocity and acceleration', () => {
            // Given: u=5, a=2, t=10
            // Expected: s = 5*10 + 0.5*2*10² = 50 + 100 = 150 m
            expect(calculateDisplacement(5, 2, 10)).toBe(150);
        });

        test('should calculate displacement with negative acceleration', () => {
            // Given: u=20, a=-2, t=5
            // Expected: s = 20*5 + 0.5*(-2)*5² = 100 - 25 = 75 m
            expect(calculateDisplacement(20, -2, 5)).toBe(75);
        });

        test('should calculate displacement with zero acceleration (constant velocity)', () => {
            // Given: u=10, a=0, t=5
            // Expected: s = 10*5 + 0.5*0*5² = 50 m
            expect(calculateDisplacement(10, 0, 5)).toBe(50);
        });

        test('should handle zero time', () => {
            // Given: u=10, a=5, t=0
            // Expected: s = 10*0 + 0.5*5*0² = 0 m
            expect(calculateDisplacement(10, 5, 0)).toBe(0);
        });

        test('should calculate negative displacement', () => {
            // Given: u=-10, a=-2, t=5
            // Expected: s = -10*5 + 0.5*(-2)*5² = -50 - 25 = -75 m
            expect(calculateDisplacement(-10, -2, 5)).toBe(-75);
        });

        test('should handle stopping distance calculation', () => {
            // Given: u=30, a=-5, t=6
            // Expected: s = 30*6 + 0.5*(-5)*6² = 180 - 90 = 90 m
            expect(calculateDisplacement(30, -5, 6)).toBe(90);
        });

        test('should handle decimal values with high precision', () => {
            // Given: u=2.5, a=1.2, t=3.5
            // Expected: s = 2.5*3.5 + 0.5*1.2*3.5² = 8.75 + 7.35 = 16.1 m
            expect(calculateDisplacement(2.5, 1.2, 3.5)).toBeCloseTo(16.1, 10);
        });

        test('IGCSE example: car accelerating from rest', () => {
            // A car accelerates from rest at 3 m/s² for 8 seconds
            // Expected: s = 0*8 + 0.5*3*8² = 96 m
            expect(calculateDisplacement(0, 3, 8)).toBe(96);
        });

        test('IGCSE example: object thrown upward', () => {
            // Object thrown upward at 20 m/s with g=-9.8 m/s² for 2 seconds
            // Expected: s = 20*2 + 0.5*(-9.8)*2² = 40 - 19.6 = 20.4 m
            expect(calculateDisplacement(20, -9.8, 2)).toBeCloseTo(20.4, 10);
        });
    });

    describe('calculateAreaUnderGraph (s = ½(u+v)t)', () => {
        test('should calculate area for triangle (starting from rest)', () => {
            // Given: u=0, v=20, t=10
            // Expected: s = 0.5*(0+20)*10 = 100 m
            expect(calculateAreaUnderGraph(0, 20, 10)).toBe(100);
        });

        test('should calculate area for trapezoid', () => {
            // Given: u=5, v=15, t=10
            // Expected: s = 0.5*(5+15)*10 = 100 m
            expect(calculateAreaUnderGraph(5, 15, 10)).toBe(100);
        });

        test('should calculate area for rectangle (constant velocity)', () => {
            // Given: u=10, v=10, t=5
            // Expected: s = 0.5*(10+10)*5 = 50 m
            expect(calculateAreaUnderGraph(10, 10, 5)).toBe(50);
        });

        test('should handle deceleration (decreasing velocity)', () => {
            // Given: u=30, v=10, t=4
            // Expected: s = 0.5*(30+10)*4 = 80 m
            expect(calculateAreaUnderGraph(30, 10, 4)).toBe(80);
        });

        test('should match displacement calculation for consistent values', () => {
            // For u=0, a=2, t=10: v=20, s=100
            const u = 0, a = 2, t = 10;
            const v = calculateFinalVelocity(u, a, t);
            const displacementMethod1 = calculateDisplacement(u, a, t);
            const displacementMethod2 = calculateAreaUnderGraph(u, v, t);
            expect(displacementMethod1).toBe(displacementMethod2);
        });

        test('should handle negative velocities', () => {
            // Given: u=-10, v=-5, t=3
            // Expected: s = 0.5*(-10-5)*3 = -22.5 m
            expect(calculateAreaUnderGraph(-10, -5, 3)).toBe(-22.5);
        });

        test('should handle zero time', () => {
            // Given: u=10, v=20, t=0
            // Expected: s = 0.5*(10+20)*0 = 0 m
            expect(calculateAreaUnderGraph(10, 20, 0)).toBe(0);
        });
    });

    describe('calculateFinalVelocityFromDisplacement (v² = u² + 2as)', () => {
        test('should calculate final velocity from rest', () => {
            // Given: u=0, a=2, s=100
            // Expected: v² = 0 + 2*2*100 = 400, v = 20 m/s
            expect(calculateFinalVelocityFromDisplacement(0, 2, 100)).toBe(20);
        });

        test('should calculate final velocity with initial velocity', () => {
            // Given: u=10, a=2, s=100
            // Expected: v² = 10² + 2*2*100 = 100 + 400 = 500, v ≈ 22.36 m/s
            expect(calculateFinalVelocityFromDisplacement(10, 2, 100)).toBeCloseTo(22.36, 2);
        });

        test('should handle deceleration', () => {
            // Given: u=20, a=-2, s=50
            // Expected: v² = 20² + 2*(-2)*50 = 400 - 200 = 200, v ≈ 14.14 m/s
            expect(calculateFinalVelocityFromDisplacement(20, -2, 50)).toBeCloseTo(14.14, 2);
        });

        test('should handle object coming to rest', () => {
            // Given: u=20, a=-2, s=100
            // Expected: v² = 20² + 2*(-2)*100 = 400 - 400 = 0, v = 0 m/s
            expect(calculateFinalVelocityFromDisplacement(20, -2, 100)).toBe(0);
        });

        test('should return 0 for impossible negative v² (physically invalid)', () => {
            // Given: u=10, a=-5, s=50
            // Expected: v² = 10² + 2*(-5)*50 = 100 - 500 = -400, return 0
            expect(calculateFinalVelocityFromDisplacement(10, -5, 50)).toBe(0);
        });

        test('should handle zero displacement', () => {
            // Given: u=10, a=5, s=0
            // Expected: v² = 10² + 2*5*0 = 100, v = 10 m/s
            expect(calculateFinalVelocityFromDisplacement(10, 5, 0)).toBe(10);
        });

        test('IGCSE example: braking distance', () => {
            // Car traveling at 30 m/s brakes with a=-10 m/s², find v after 40m
            // Expected: v² = 30² + 2*(-10)*40 = 900 - 800 = 100, v = 10 m/s
            expect(calculateFinalVelocityFromDisplacement(30, -10, 40)).toBe(10);
        });
    });

    describe('Motion equations consistency', () => {
        test('all three equations should give consistent results', () => {
            const u = 5, a = 3, t = 4;

            // Method 1: v = u + at
            const v = calculateFinalVelocity(u, a, t);
            expect(v).toBe(17);

            // Method 2: s = ut + ½at²
            const s = calculateDisplacement(u, a, t);
            expect(s).toBe(44);

            // Method 3: s = ½(u+v)t
            const s2 = calculateAreaUnderGraph(u, v, t);
            expect(s2).toBe(s);

            // Method 4: v² = u² + 2as
            const vFromS = calculateFinalVelocityFromDisplacement(u, a, s);
            expect(vFromS).toBeCloseTo(v, 10);
        });

        test('equations should work for deceleration scenario', () => {
            const u = 25, a = -5, t = 3;

            const v = calculateFinalVelocity(u, a, t);
            expect(v).toBe(10);

            const s = calculateDisplacement(u, a, t);
            expect(s).toBe(52.5);

            const s2 = calculateAreaUnderGraph(u, v, t);
            expect(s2).toBeCloseTo(s, 10);

            const vFromS = calculateFinalVelocityFromDisplacement(u, a, s);
            expect(vFromS).toBeCloseTo(v, 10);
        });
    });
});
