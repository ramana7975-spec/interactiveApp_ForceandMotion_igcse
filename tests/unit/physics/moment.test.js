const {
    calculateMoment,
    calculateNetMoment,
    areMomentsBalanced,
    calculateTiltAngle
} = require('../../../physics-calculations');

describe('Moment (Torque) Physics Calculations', () => {

    describe('calculateMoment (Moment = Force × Distance)', () => {
        test('should calculate moment correctly', () => {
            // Given: F=30N, d=2m
            // Expected: M = 30 * 2 = 60 N·m
            expect(calculateMoment(30, 2)).toBe(60);
        });

        test('should handle zero force', () => {
            // Given: F=0N, d=5m
            // Expected: M = 0 N·m
            expect(calculateMoment(0, 5)).toBe(0);
        });

        test('should handle zero distance', () => {
            // Given: F=100N, d=0m (force at pivot)
            // Expected: M = 0 N·m
            expect(calculateMoment(100, 0)).toBe(0);
        });

        test('should handle decimal values', () => {
            // Given: F=25.5N, d=1.5m
            // Expected: M = 38.25 N·m
            expect(calculateMoment(25.5, 1.5)).toBeCloseTo(38.25, 10);
        });

        test('should handle large forces', () => {
            // Given: F=1000N, d=10m
            // Expected: M = 10000 N·m
            expect(calculateMoment(1000, 10)).toBe(10000);
        });

        test('should handle small distances', () => {
            // Given: F=50N, d=0.1m
            // Expected: M = 5 N·m
            expect(calculateMoment(50, 0.1)).toBe(5);
        });

        test('IGCSE example: door handle', () => {
            // A 20N force applied 0.8m from hinge
            // Expected: M = 20 * 0.8 = 16 N·m
            expect(calculateMoment(20, 0.8)).toBe(16);
        });

        test('IGCSE example: spanner/wrench', () => {
            // 150N force on a 0.3m spanner
            // Expected: M = 150 * 0.3 = 45 N·m
            expect(calculateMoment(150, 0.3)).toBe(45);
        });

        test('should show longer distance increases moment', () => {
            const force = 50;

            const m1 = calculateMoment(force, 1);
            const m2 = calculateMoment(force, 2);
            const m3 = calculateMoment(force, 3);

            expect(m2).toBe(2 * m1);
            expect(m3).toBe(3 * m1);
        });

        test('should show larger force increases moment', () => {
            const distance = 2;

            const m1 = calculateMoment(10, distance);
            const m2 = calculateMoment(20, distance);
            const m3 = calculateMoment(30, distance);

            expect(m2).toBe(2 * m1);
            expect(m3).toBe(3 * m1);
        });

        test('should handle app default values', () => {
            // Left: 30N at 2m, Right: 20N at 3m
            const leftMoment = calculateMoment(30, 2);
            const rightMoment = calculateMoment(20, 3);

            expect(leftMoment).toBe(60);
            expect(rightMoment).toBe(60);
        });
    });

    describe('calculateNetMoment', () => {
        test('should calculate zero net moment for balanced system', () => {
            // Given: anticlockwise=60 N·m, clockwise=60 N·m
            // Expected: net = 0 N·m
            expect(calculateNetMoment(60, 60)).toBe(0);
        });

        test('should calculate positive net moment (anticlockwise dominates)', () => {
            // Given: anticlockwise=80 N·m, clockwise=50 N·m
            // Expected: net = 30 N·m (anticlockwise)
            expect(calculateNetMoment(80, 50)).toBe(30);
        });

        test('should calculate negative net moment (clockwise dominates)', () => {
            // Given: anticlockwise=40 N·m, clockwise=70 N·m
            // Expected: net = -30 N·m (clockwise)
            expect(calculateNetMoment(40, 70)).toBe(-30);
        });

        test('should handle zero anticlockwise moment', () => {
            // Given: anticlockwise=0 N·m, clockwise=50 N·m
            // Expected: net = -50 N·m
            expect(calculateNetMoment(0, 50)).toBe(-50);
        });

        test('should handle zero clockwise moment', () => {
            // Given: anticlockwise=60 N·m, clockwise=0 N·m
            // Expected: net = 60 N·m
            expect(calculateNetMoment(60, 0)).toBe(60);
        });

        test('should handle both moments being zero', () => {
            expect(calculateNetMoment(0, 0)).toBe(0);
        });

        test('should handle decimal values', () => {
            // Given: anticlockwise=45.5 N·m, clockwise=23.3 N·m
            expect(calculateNetMoment(45.5, 23.3)).toBeCloseTo(22.2, 10);
        });

        test('IGCSE example: unbalanced lever', () => {
            // Left side: 30N at 1.5m = 45 N·m
            // Right side: 20N at 2m = 40 N·m
            // Net moment = 5 N·m anticlockwise
            expect(calculateNetMoment(45, 40)).toBe(5);
        });

        test('should handle large moments', () => {
            expect(calculateNetMoment(10000, 9500)).toBe(500);
        });

        test('should handle negative moments input (edge case)', () => {
            // Even if inputs are negative, calculation should work
            expect(calculateNetMoment(-30, -20)).toBe(-10);
        });
    });

    describe('areMomentsBalanced', () => {
        test('should return true for perfectly balanced moments', () => {
            expect(areMomentsBalanced(60, 60)).toBe(true);
        });

        test('should return true when difference is within tolerance', () => {
            // Default tolerance is 0.5
            expect(areMomentsBalanced(60, 60.4)).toBe(true);
        });

        test('should return false when difference exceeds tolerance', () => {
            // Default tolerance is 0.5
            expect(areMomentsBalanced(60, 61)).toBe(false);
        });

        test('should use custom tolerance', () => {
            expect(areMomentsBalanced(60, 65, 10)).toBe(true);
            expect(areMomentsBalanced(60, 65, 4)).toBe(false);
        });

        test('should handle zero moments', () => {
            expect(areMomentsBalanced(0, 0)).toBe(true);
        });

        test('should handle very small differences', () => {
            expect(areMomentsBalanced(100, 100.1, 0.5)).toBe(true);
        });

        test('should handle large moments with small percentage difference', () => {
            // 1000 vs 1000.3 is only 0.03% difference but within tolerance
            expect(areMomentsBalanced(1000, 1000.3)).toBe(true);
        });

        test('IGCSE example: checking equilibrium', () => {
            // Left: 30N × 2m = 60 N·m
            // Right: 20N × 3m = 60 N·m
            const leftMoment = calculateMoment(30, 2);
            const rightMoment = calculateMoment(20, 3);

            expect(areMomentsBalanced(leftMoment, rightMoment)).toBe(true);
        });

        test('IGCSE example: slightly unbalanced', () => {
            // Left: 30N × 2m = 60 N·m
            // Right: 19N × 3m = 57 N·m (difference = 3)
            const leftMoment = calculateMoment(30, 2);
            const rightMoment = calculateMoment(19, 3);

            expect(areMomentsBalanced(leftMoment, rightMoment)).toBe(false);
        });

        test('should work with negative moments', () => {
            expect(areMomentsBalanced(-60, -60)).toBe(true);
            expect(areMomentsBalanced(-60, -61)).toBe(false);
        });

        test('should handle one positive one negative moment', () => {
            expect(areMomentsBalanced(60, -60)).toBe(false);
        });
    });

    describe('calculateTiltAngle', () => {
        test('should calculate zero angle for balanced system', () => {
            // Given: net moment = 0
            // Expected: angle = 0 radians
            expect(calculateTiltAngle(0)).toBe(0);
        });

        test('should calculate positive angle for anticlockwise net moment', () => {
            // Given: net moment = 50 N·m
            // Expected: angle = atan(50/100) ≈ 0.464 radians
            expect(calculateTiltAngle(50)).toBeCloseTo(0.464, 3);
        });

        test('should calculate negative angle for clockwise net moment', () => {
            // Given: net moment = -50 N·m
            // Expected: angle = atan(-50/100) ≈ -0.464 radians
            expect(calculateTiltAngle(-50)).toBeCloseTo(-0.464, 3);
        });

        test('should use custom scale factor', () => {
            const netMoment = 50;

            const angle1 = calculateTiltAngle(netMoment, 100);
            const angle2 = calculateTiltAngle(netMoment, 200);

            // Larger scale factor should give smaller angle
            expect(Math.abs(angle2)).toBeLessThan(Math.abs(angle1));
        });

        test('should handle very small net moment', () => {
            const angle = calculateTiltAngle(0.1);
            expect(angle).toBeCloseTo(0.001, 5);
        });

        test('should handle very large net moment', () => {
            // atan(1000/100) = atan(10) ≈ 1.471 radians (close to π/2)
            const angle = calculateTiltAngle(1000);
            expect(angle).toBeCloseTo(1.471, 3);
            expect(angle).toBeLessThan(Math.PI / 2); // Should be less than 90°
        });

        test('should convert to degrees correctly', () => {
            const netMoment = 100; // atan(100/100) = atan(1) = π/4
            const angleRadians = calculateTiltAngle(netMoment);
            const angleDegrees = angleRadians * 180 / Math.PI;

            expect(angleDegrees).toBeCloseTo(45, 2);
        });

        test('IGCSE example: lever tilt visualization', () => {
            // Net moment of 30 N·m with default scale
            const angle = calculateTiltAngle(30);

            // Should be positive (anticlockwise tilt)
            expect(angle).toBeGreaterThan(0);

            // Convert to degrees for intuition
            const degrees = angle * 180 / Math.PI;
            expect(degrees).toBeCloseTo(16.7, 1);
        });

        test('should be symmetric for opposite moments', () => {
            const angle1 = calculateTiltAngle(50);
            const angle2 = calculateTiltAngle(-50);

            expect(angle1).toBeCloseTo(-angle2, 10);
        });

        test('should approach π/2 asymptotically for very large moments', () => {
            // Due to atan function, angle approaches π/2 but never reaches it
            const angle1 = calculateTiltAngle(100);
            const angle2 = calculateTiltAngle(1000);
            const angle3 = calculateTiltAngle(10000);

            // All angles should be less than π/2
            expect(angle1).toBeLessThan(Math.PI / 2);
            expect(angle2).toBeLessThan(Math.PI / 2);
            expect(angle3).toBeLessThan(Math.PI / 2);

            // Angles should be increasing
            expect(angle2).toBeGreaterThan(angle1);
            expect(angle3).toBeGreaterThan(angle2);

            // But angle3 should be very close to π/2 (flattening)
            expect(angle3).toBeGreaterThan(Math.PI / 2 - 0.1);
        });
    });

    describe('Principle of Moments', () => {
        test('should verify principle of moments: equilibrium', () => {
            // For equilibrium: sum of clockwise = sum of anticlockwise
            const leftForce = 30, leftDist = 2;
            const rightForce = 20, rightDist = 3;

            const anticlockwise = calculateMoment(leftForce, leftDist);
            const clockwise = calculateMoment(rightForce, rightDist);

            expect(anticlockwise).toBe(clockwise);
            expect(areMomentsBalanced(anticlockwise, clockwise)).toBe(true);

            const netMoment = calculateNetMoment(anticlockwise, clockwise);
            expect(netMoment).toBe(0);
        });

        test('should verify unbalanced system has non-zero net moment', () => {
            const leftForce = 40, leftDist = 2;
            const rightForce = 20, rightDist = 3;

            const anticlockwise = calculateMoment(leftForce, leftDist); // 80
            const clockwise = calculateMoment(rightForce, rightDist); // 60

            const netMoment = calculateNetMoment(anticlockwise, clockwise);
            expect(netMoment).toBe(20);
            expect(areMomentsBalanced(anticlockwise, clockwise)).toBe(false);
        });

        test('multiple forces on each side should sum', () => {
            // Left side: 20N at 1m + 30N at 2m = 20 + 60 = 80 N·m
            const anticlockwise = calculateMoment(20, 1) + calculateMoment(30, 2);

            // Right side: 10N at 3m + 25N at 2m = 30 + 50 = 80 N·m
            const clockwise = calculateMoment(10, 3) + calculateMoment(25, 2);

            expect(anticlockwise).toBe(80);
            expect(clockwise).toBe(80);
            expect(areMomentsBalanced(anticlockwise, clockwise)).toBe(true);
        });
    });

    describe('IGCSE Exam-style Problems', () => {
        test('finding unknown force for balance', () => {
            // A lever balances with 40N at 0.5m on one side
            // What force at 0.8m balances it?
            const knownForce = 40, knownDist = 0.5;
            const unknownDist = 0.8;

            const knownMoment = calculateMoment(knownForce, knownDist);

            // For balance: F × 0.8 = 20
            const unknownForce = knownMoment / unknownDist;

            expect(unknownForce).toBe(25);

            // Verify balance
            const unknownMoment = calculateMoment(unknownForce, unknownDist);
            expect(areMomentsBalanced(knownMoment, unknownMoment)).toBe(true);
        });

        test('finding unknown distance for balance', () => {
            // 60N force at unknown distance balances 45N at 2m
            // Find the distance
            const knownForce = 45, knownDist = 2;
            const unknownForce = 60;

            const knownMoment = calculateMoment(knownForce, knownDist); // 90

            // For balance: 60 × d = 90
            const unknownDist = knownMoment / unknownForce;

            expect(unknownDist).toBe(1.5);

            // Verify balance
            const unknownMoment = calculateMoment(unknownForce, unknownDist);
            expect(areMomentsBalanced(knownMoment, unknownMoment)).toBe(true);
        });

        test('beam with weight and support force', () => {
            // A 4m beam weighing 100N (weight at centre, 2m from each end)
            // Supported at one end. What force needed at other end?
            const beamWeight = 100, beamCentre = 2;
            const beamLength = 4;

            // Taking moments about left end:
            // Clockwise: 100N × 2m = 200 N·m
            const clockwiseMoment = calculateMoment(beamWeight, beamCentre);

            // For balance, force at right end:
            const supportForce = clockwiseMoment / beamLength;

            expect(supportForce).toBe(50);
        });

        test('crowbar problem', () => {
            // A crowbar is 1.2m long. Force of 200N applied at one end
            // lifts a rock 0.1m from pivot. What force on rock?
            const appliedForce = 200, appliedDist = 1.1; // 1.2 - 0.1
            const rockDist = 0.1;

            const appliedMoment = calculateMoment(appliedForce, appliedDist);

            // Force on rock
            const rockForce = appliedMoment / rockDist;

            expect(rockForce).toBe(2200); // Mechanical advantage!
        });

        test('balancing asymmetric object', () => {
            // A 3m plank with 50N weight at 0.5m and 30N weight at 2.5m
            // Where should pivot be for balance?
            const w1 = 50, x1 = 0.5;
            const w2 = 30, x2 = 2.5;

            // Centre of mass calculation gives pivot point
            const pivot = (w1 * x1 + w2 * x2) / (w1 + w2);
            // (50*0.5 + 30*2.5) / 80 = (25 + 75) / 80 = 100/80 = 1.25

            expect(pivot).toBeCloseTo(1.25, 2);

            // Verify moments balance at this pivot
            const moment1 = calculateMoment(w1, Math.abs(x1 - pivot));
            const moment2 = calculateMoment(w2, Math.abs(x2 - pivot));

            expect(areMomentsBalanced(moment1, moment2)).toBe(true);
        });

        test('door moment problem', () => {
            // A door 0.9m wide requires 15 N·m to open
            // Force applied at edge, perpendicular to door
            // What force is needed?
            const requiredMoment = 15;
            const distance = 0.9;

            const force = requiredMoment / distance;

            expect(force).toBeCloseTo(16.67, 2);

            // If force applied at 0.3m from hinge instead
            const force2 = requiredMoment / 0.3;
            expect(force2).toBe(50); // Need more force closer to hinge
        });

        test('mechanical advantage of lever', () => {
            // Effort force at 2m, load at 0.2m from pivot
            const effortDist = 2;
            const loadDist = 0.2;

            // Mechanical advantage = effort distance / load distance
            const MA = effortDist / loadDist;
            expect(MA).toBe(10);

            // Verify: 10N effort can lift 100N load
            const effortForce = 10;
            const loadForce = effortForce * MA;

            const effortMoment = calculateMoment(effortForce, effortDist);
            const loadMoment = calculateMoment(loadForce, loadDist);

            expect(loadForce).toBe(100);
            expect(areMomentsBalanced(effortMoment, loadMoment)).toBe(true);
        });
    });

    describe('Integration Tests', () => {
        test('complete lever system analysis', () => {
            // Setup: 30N at 2m (left), 20N at 3m (right)
            const leftF = 30, leftD = 2;
            const rightF = 20, rightD = 3;

            // Calculate moments
            const leftMoment = calculateMoment(leftF, leftD);
            const rightMoment = calculateMoment(rightF, rightD);

            expect(leftMoment).toBe(60);
            expect(rightMoment).toBe(60);

            // Calculate net moment
            const netMoment = calculateNetMoment(leftMoment, rightMoment);
            expect(netMoment).toBe(0);

            // Check balance
            const balanced = areMomentsBalanced(leftMoment, rightMoment);
            expect(balanced).toBe(true);

            // Calculate tilt
            const tilt = calculateTiltAngle(netMoment);
            expect(tilt).toBe(0);
        });

        test('unbalanced lever system analysis', () => {
            // Setup: 40N at 2m (left), 20N at 3m (right)
            const leftF = 40, leftD = 2;
            const rightF = 20, rightD = 3;

            const leftMoment = calculateMoment(leftF, leftD);
            const rightMoment = calculateMoment(rightF, rightD);

            expect(leftMoment).toBe(80);
            expect(rightMoment).toBe(60);

            const netMoment = calculateNetMoment(leftMoment, rightMoment);
            expect(netMoment).toBe(20);

            const balanced = areMomentsBalanced(leftMoment, rightMoment);
            expect(balanced).toBe(false);

            const tilt = calculateTiltAngle(netMoment);
            expect(tilt).toBeGreaterThan(0); // Tilts anticlockwise
        });
    });
});
