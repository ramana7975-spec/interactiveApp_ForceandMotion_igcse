const {
    calculateAirResistance,
    calculateTerminalVelocity,
    calculateNetForceFalling,
    calculateWeight
} = require('../../../physics-calculations');

describe('Terminal Velocity Physics Calculations', () => {

    describe('calculateAirResistance', () => {
        test('should calculate air resistance correctly', () => {
            // Given: drag=0.1, velocity=10m/s
            // Expected: R = 0.1 * 10² = 10N
            expect(calculateAirResistance(0.1, 10)).toBe(10);
        });

        test('should calculate air resistance at different speeds', () => {
            // Given: drag=0.2, velocity=5m/s
            // Expected: R = 0.2 * 5² = 5N
            expect(calculateAirResistance(0.2, 5)).toBe(5);
        });

        test('should show quadratic relationship with velocity', () => {
            const drag = 0.1;

            // At v=10: R=10N
            const r1 = calculateAirResistance(drag, 10);
            expect(r1).toBe(10);

            // At v=20: R should be 4x (velocity doubled, resistance 4x)
            const r2 = calculateAirResistance(drag, 20);
            expect(r2).toBe(40);

            // At v=30: R should be 9x
            const r3 = calculateAirResistance(drag, 30);
            expect(r3).toBe(90);
        });

        test('should handle zero velocity', () => {
            // At rest, no air resistance
            expect(calculateAirResistance(0.1, 0)).toBe(0);
        });

        test('should handle zero drag coefficient', () => {
            // No drag means no air resistance (vacuum)
            expect(calculateAirResistance(0, 20)).toBe(0);
        });

        test('should handle negative velocity (upward motion)', () => {
            // Air resistance magnitude depends on speed squared
            // Given: drag=0.1, velocity=-10m/s
            // Expected: R = 0.1 * (-10)² = 10N
            expect(calculateAirResistance(0.1, -10)).toBe(10);
        });

        test('should handle decimal values', () => {
            // Given: drag=0.05, velocity=12.5m/s
            // Expected: R = 0.05 * 156.25 = 7.8125N
            expect(calculateAirResistance(0.05, 12.5)).toBeCloseTo(7.8125, 10);
        });

        test('should handle very small drag coefficient', () => {
            // Given: drag=0.001, velocity=100m/s
            // Expected: R = 0.001 * 10000 = 10N
            expect(calculateAirResistance(0.001, 100)).toBe(10);
        });

        test('should handle very high velocity', () => {
            // Given: drag=0.1, velocity=100m/s
            // Expected: R = 0.1 * 10000 = 1000N
            expect(calculateAirResistance(0.1, 100)).toBe(1000);
        });
    });

    describe('calculateTerminalVelocity', () => {
        test('should calculate terminal velocity correctly', () => {
            // Given: mass=2kg, drag=0.1, g=9.8m/s²
            // Weight = 2 * 9.8 = 19.6N
            // v_terminal = √(19.6/0.1) = √196 = 14 m/s
            expect(calculateTerminalVelocity(2, 0.1, 9.8)).toBe(14);
        });

        test('should calculate terminal velocity with default gravity', () => {
            // Given: mass=5kg, drag=0.2 (g defaults to 9.8)
            // Weight = 5 * 9.8 = 49N
            // v_terminal = √(49/0.2) = √245 ≈ 15.65 m/s
            expect(calculateTerminalVelocity(5, 0.2)).toBeCloseTo(15.65, 2);
        });

        test('should show higher terminal velocity for heavier objects', () => {
            const drag = 0.1;

            const v1 = calculateTerminalVelocity(2, drag);
            const v2 = calculateTerminalVelocity(8, drag); // 4x mass

            // Terminal velocity should be 2x (√4 = 2)
            expect(v2 / v1).toBeCloseTo(2, 10);
        });

        test('should show lower terminal velocity for higher drag', () => {
            const mass = 10;

            const v1 = calculateTerminalVelocity(mass, 0.1);
            const v2 = calculateTerminalVelocity(mass, 0.4); // 4x drag

            // Terminal velocity should be halved (√(1/4) = 0.5)
            expect(v2 / v1).toBeCloseTo(0.5, 10);
        });

        test('should handle zero mass', () => {
            // Zero mass has zero weight, so terminal velocity is 0
            expect(calculateTerminalVelocity(0, 0.1)).toBe(0);
        });

        test('IGCSE example: skydiver', () => {
            // 80kg skydiver with drag coefficient 0.25
            // Weight = 80 * 9.8 = 784N
            // v_terminal = √(784/0.25) = √3136 = 56 m/s
            expect(calculateTerminalVelocity(80, 0.25)).toBe(56);
        });

        test('IGCSE example: feather vs ball', () => {
            // Feather: 0.001kg, drag=0.0001
            const vFeather = calculateTerminalVelocity(0.001, 0.0001);

            // Ball: 0.1kg, drag=0.001
            const vBall = calculateTerminalVelocity(0.1, 0.001);

            // Ball should have higher terminal velocity
            expect(vBall).toBeGreaterThan(vFeather);
        });

        test('should handle custom gravity (e.g., Moon)', () => {
            // On Moon: g=1.6 m/s²
            const mass = 10, drag = 0.2;

            const vMoon = calculateTerminalVelocity(mass, drag, 1.6);
            const vEarth = calculateTerminalVelocity(mass, drag, 9.8);

            // Terminal velocity on Moon should be lower
            expect(vMoon).toBeLessThan(vEarth);
            expect(vMoon).toBeCloseTo(8.94, 2);
        });

        test('at terminal velocity, air resistance equals weight', () => {
            const mass = 5, drag = 0.2;

            const vTerminal = calculateTerminalVelocity(mass, drag);
            const weight = calculateWeight(mass);
            const airResistance = calculateAirResistance(drag, vTerminal);

            expect(airResistance).toBeCloseTo(weight, 10);
        });
    });

    describe('calculateTerminalVelocity - Division by Zero Protection', () => {
        test('should return Infinity when drag is zero', () => {
            // In vacuum (no drag), terminal velocity is infinite
            expect(calculateTerminalVelocity(10, 0)).toBe(Infinity);
        });

        test('should return Infinity when drag is not finite', () => {
            expect(calculateTerminalVelocity(10, NaN)).toBe(Infinity);
        });

        test('should handle negative drag (physically impossible)', () => {
            // Mathematical result even if physically meaningless
            const result = calculateTerminalVelocity(10, -0.1);
            expect(isNaN(result)).toBe(true);
        });

        test('should handle very small drag coefficient', () => {
            // Very small drag means very high terminal velocity
            const v = calculateTerminalVelocity(1, 0.0001);
            expect(v).toBeGreaterThan(300);
        });
    });

    describe('calculateNetForceFalling', () => {
        test('should calculate net force at start of fall (v=0)', () => {
            // Given: mass=10kg, velocity=0m/s, drag=0.1
            // Weight = 98N, Air resistance = 0N
            // Net force = 98N downward
            expect(calculateNetForceFalling(10, 0, 0.1)).toBe(98);
        });

        test('should calculate net force at intermediate velocity', () => {
            // Given: mass=2kg, velocity=10m/s, drag=0.1
            // Weight = 19.6N, Air resistance = 0.1*10² = 10N
            // Net force = 19.6 - 10 = 9.6N
            expect(calculateNetForceFalling(2, 10, 0.1)).toBeCloseTo(9.6, 10);
        });

        test('should calculate zero net force at terminal velocity', () => {
            // Given: mass=2kg, drag=0.1
            const vTerminal = calculateTerminalVelocity(2, 0.1);

            const netForce = calculateNetForceFalling(2, vTerminal, 0.1);

            // At terminal velocity, net force should be zero
            expect(netForce).toBeCloseTo(0, 10);
        });

        test('should show decreasing net force as velocity increases', () => {
            const mass = 5, drag = 0.2;

            const f1 = calculateNetForceFalling(mass, 0, drag);
            const f2 = calculateNetForceFalling(mass, 5, drag);
            const f3 = calculateNetForceFalling(mass, 10, drag);

            // Net force should decrease as velocity increases
            expect(f1).toBeGreaterThan(f2);
            expect(f2).toBeGreaterThan(f3);
        });

        test('should handle custom gravity', () => {
            // On Moon: g=1.6 m/s²
            const netForceMoon = calculateNetForceFalling(10, 5, 0.2, 1.6);
            const netForceEarth = calculateNetForceFalling(10, 5, 0.2, 9.8);

            // Net force on Moon should be less (lower gravity)
            expect(netForceMoon).toBeLessThan(netForceEarth);
        });

        test('should handle no drag (free fall)', () => {
            // Given: mass=10kg, velocity=50m/s, drag=0
            // Net force = Weight = 98N (constant in vacuum)
            expect(calculateNetForceFalling(10, 50, 0)).toBe(98);
        });

        test('IGCSE example: falling ball', () => {
            // A 0.5kg ball falling at 8m/s with drag=0.01
            // Weight = 0.5 * 9.8 = 4.9N
            // Air resistance = 0.01 * 64 = 0.64N
            // Net force = 4.9 - 0.64 = 4.26N
            expect(calculateNetForceFalling(0.5, 8, 0.01)).toBeCloseTo(4.26, 10);
        });

        test('should calculate correct acceleration from net force', () => {
            const mass = 10, velocity = 5, drag = 0.2;

            const netForce = calculateNetForceFalling(mass, velocity, drag);
            const acceleration = netForce / mass;

            // Acceleration should be positive (still accelerating downward)
            expect(acceleration).toBeGreaterThan(0);
            expect(acceleration).toBeLessThan(9.8); // But less than free fall
        });
    });

    describe('Terminal Velocity Behavior', () => {
        test('object should accelerate less as it approaches terminal velocity', () => {
            const mass = 2, drag = 0.1;
            const vTerminal = calculateTerminalVelocity(mass, drag);

            // At various velocities
            const a1 = calculateNetForceFalling(mass, 0, drag) / mass;
            const a2 = calculateNetForceFalling(mass, vTerminal * 0.5, drag) / mass;
            const a3 = calculateNetForceFalling(mass, vTerminal * 0.9, drag) / mass;
            const a4 = calculateNetForceFalling(mass, vTerminal, drag) / mass;

            // Acceleration should decrease
            expect(a1).toBeCloseTo(9.8, 1); // Nearly free fall at start
            expect(a2).toBeGreaterThan(a3);
            expect(a3).toBeGreaterThan(a4);
            expect(a4).toBeCloseTo(0, 10); // Nearly zero at terminal velocity
        });

        test('heavier objects reach terminal velocity faster', () => {
            // Compare acceleration at same velocity for different masses
            const velocity = 10, drag = 0.1;

            const a1 = calculateNetForceFalling(2, velocity, drag) / 2;
            const a2 = calculateNetForceFalling(20, velocity, drag) / 20;

            // Heavier object still has more acceleration at same velocity
            expect(a2).toBeGreaterThan(a1);
        });

        test('air resistance becomes dominant force at high speeds', () => {
            const mass = 1, drag = 0.1;
            const weight = calculateWeight(mass);

            // At high velocity
            const velocity = 50;
            const airResistance = calculateAirResistance(drag, velocity);

            // Air resistance should exceed weight
            expect(airResistance).toBeGreaterThan(weight);

            // This means object would decelerate (if launched at this speed)
            const netForce = calculateNetForceFalling(mass, velocity, drag);
            expect(netForce).toBeLessThan(0); // Negative = upward net force
        });
    });

    describe('IGCSE Exam-style Problems', () => {
        test('parachutist problem', () => {
            // A 75kg parachutist falls. With parachute open, drag=1.5
            // Calculate terminal velocity
            const mass = 75;
            const dragNoPara = 0.5; // Without parachute
            const dragWithPara = 1.5; // With parachute

            const vTerminalNoPara = calculateTerminalVelocity(mass, dragNoPara);
            const vTerminalWithPara = calculateTerminalVelocity(mass, dragWithPara);

            // Terminal velocity should reduce significantly
            expect(vTerminalNoPara).toBeGreaterThan(vTerminalWithPara);
            expect(vTerminalWithPara).toBeCloseTo(22.14, 2);
        });

        test('comparing two falling objects', () => {
            // Object A: 2kg, drag=0.1
            // Object B: 8kg, drag=0.4
            const vA = calculateTerminalVelocity(2, 0.1);
            const vB = calculateTerminalVelocity(8, 0.4);

            // Both should have same terminal velocity
            expect(vA).toBeCloseTo(vB, 10);
        });

        test('calculating time to reach 99% terminal velocity', () => {
            // This is a conceptual test showing force behavior
            const mass = 5, drag = 0.2;
            const vTerminal = calculateTerminalVelocity(mass, drag);
            const v99 = vTerminal * 0.99;

            const netForce = calculateNetForceFalling(mass, v99, drag);
            const acceleration = netForce / mass;

            // At 99% terminal velocity, acceleration should be very small
            expect(acceleration).toBeLessThan(0.2);
        });
    });
});
