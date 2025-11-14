# Test Suite for IGCSE Physics Force and Motion App

## Overview

This comprehensive test suite ensures the accuracy and reliability of all physics calculations in the IGCSE Physics Force and Motion interactive application.

## Test Statistics

- **Total Tests**: 324 passing
- **Test Suites**: 7
- **Code Coverage**:
  - Statements: 100%
  - Branches: 96.96%
  - Functions: 100%
  - Lines: 100%

## Test Structure

```
tests/
└── unit/
    └── physics/
        ├── motion.test.js                  (49 tests)
        ├── force.test.js                   (61 tests)
        ├── momentum.test.js                (78 tests)
        ├── terminal-velocity.test.js       (48 tests)
        ├── centre-of-mass.test.js          (41 tests)
        ├── moment.test.js                  (46 tests)
        └── division-by-zero.test.js        (101 tests)
```

## What's Tested

### 1. **Motion Physics (49 tests)**
- ✅ Final velocity calculation (v = u + at)
- ✅ Displacement calculation (s = ut + ½at²)
- ✅ Area under velocity-time graph
- ✅ Final velocity from displacement (v² = u² + 2as)
- ✅ Equation consistency verification
- ✅ Edge cases: zero values, negative acceleration, decimal values

### 2. **Force Physics (61 tests)**
- ✅ Resultant force calculation (Pythagorean theorem)
- ✅ Force angle calculation (atan2)
- ✅ Acceleration calculation (F = ma)
- ✅ Weight calculation (W = mg)
- ✅ **Division by zero protection** for mass = 0
- ✅ Newton's Second Law integration tests
- ✅ Edge cases: Infinity, NaN, very small masses

### 3. **Momentum Physics (78 tests)**
- ✅ Momentum calculation (p = mv)
- ✅ Total momentum of system
- ✅ **Elastic collision calculations**
- ✅ **Inelastic collision calculations**
- ✅ **Momentum conservation verification**
- ✅ Kinetic energy conservation (elastic only)
- ✅ **Division by zero protection** for zero mass collisions
- ✅ IGCSE exam-style problems

### 4. **Terminal Velocity Physics (48 tests)**
- ✅ Air resistance calculation (R = kv²)
- ✅ Terminal velocity calculation
- ✅ Net force during fall
- ✅ Force balance at terminal velocity
- ✅ **Division by zero protection** for drag = 0
- ✅ Edge cases: zero mass, Infinity drag, NaN

### 5. **Centre of Mass Physics (41 tests)**
- ✅ Centre of mass position calculation
- ✅ System balance verification
- ✅ Moment principle (m₁d₁ = m₂d₂)
- ✅ **Division by zero protection** for total mass = 0
- ✅ IGCSE seesaw and balance problems

### 6. **Moment/Torque Physics (46 tests)**
- ✅ Moment calculation (M = F × d)
- ✅ Net moment calculation
- ✅ Balance detection
- ✅ Tilt angle calculation
- ✅ Principle of moments verification
- ✅ Mechanical advantage calculations
- ✅ IGCSE exam-style problems

### 7. **Division by Zero Protection (101 tests)**
Comprehensive edge case testing across all modules:
- ✅ Zero values (0)
- ✅ Positive Infinity
- ✅ Negative Infinity
- ✅ NaN (Not a Number)
- ✅ Very small numbers near zero
- ✅ Very large numbers
- ✅ Negative zero (-0)
- ✅ Boundary values (MAX_SAFE_INTEGER, MIN_VALUE)
- ✅ Real-world user input scenarios

## Key Features

### 1. **Physics Accuracy**
Every formula is tested against:
- Known physics problems
- IGCSE exam-style questions
- Multiple calculation methods (cross-verification)
- Boundary conditions

### 2. **Momentum Conservation**
Special attention to ensure:
- Conservation in elastic collisions
- Conservation in inelastic collisions
- Tolerance-based verification (±0.1 kg·m/s)
- Multiple collision scenarios

### 3. **Division by Zero Protection**
Critical safety measures:
- `calculateAcceleration(F, 0)` returns 0 (not Infinity)
- `calculateElasticCollision(0, v, 0, v)` returns {0, 0}
- `calculateInelasticCollision(0, v, 0, v)` returns 0
- `calculateCentreOfMass(0, x, 0, y)` returns 0
- `calculateTerminalVelocity(m, 0)` returns Infinity (vacuum)

### 4. **Floating Point Precision**
Tests use appropriate comparison methods:
- `toBe()` for integer results
- `toBeCloseTo(value, precision)` for decimal results
- Tolerances for physical reality checks

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with verbose output
npm run test:verbose
```

## Test Examples

### Example 1: Motion Calculation Test
```javascript
test('should calculate displacement from rest with constant acceleration', () => {
    // Given: u=0, a=2, t=10
    // Expected: s = 0*10 + 0.5*2*10² = 100 m
    expect(calculateDisplacement(0, 2, 10)).toBe(100);
});
```

### Example 2: Momentum Conservation Test
```javascript
test('elastic collision should conserve momentum', () => {
    const m1 = 5, v1 = 8, m2 = 3, v2 = -4;
    const initialMomentum = calculateTotalMomentum(m1, v1, m2, v2);

    const { v1f, v2f } = calculateElasticCollision(m1, v1, m2, v2);
    const finalMomentum = calculateTotalMomentum(m1, v1f, m2, v2f);

    expect(isMomentumConserved(initialMomentum, finalMomentum)).toBe(true);
});
```

### Example 3: Division by Zero Protection Test
```javascript
test('calculateAcceleration MUST return 0 when mass is 0', () => {
    // CRITICAL: Prevent division by zero
    expect(calculateAcceleration(100, 0)).toBe(0);
});
```

## Coverage Report

Latest coverage (run `npm run test:coverage`):

```
-------------------------|---------|----------|---------|---------|
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files                |     100 |    96.96 |     100 |     100 |
 physics-calculations.js |     100 |    96.96 |     100 |     100 |
-------------------------|---------|----------|---------|---------|
```

## Physics Formulas Tested

### Motion
- v = u + at
- s = ut + ½at²
- v² = u² + 2as
- s = ½(u + v)t

### Force
- F = ma
- R = √(F₁² + F₂²)
- W = mg
- θ = atan2(F₂, F₁)

### Momentum
- p = mv
- m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂
- Elastic: v₁f = ((m₁-m₂)u₁ + 2m₂u₂)/(m₁+m₂)
- Inelastic: vf = (m₁u₁ + m₂u₂)/(m₁+m₂)

### Terminal Velocity
- R = kv²
- v_terminal = √(mg/k)
- F_net = mg - kv²

### Centre of Mass
- x_cm = (m₁x₁ + m₂x₂)/(m₁+m₂)
- Balance: m₁d₁ = m₂d₂

### Moment
- M = F × d
- Equilibrium: ΣM_clockwise = ΣM_anticlockwise
- θ = atan(M_net / scale)

## IGCSE Alignment

All tests align with Cambridge IGCSE Physics curriculum:
- Core physics principles
- Standard calculation methods
- Exam-style problem formats
- Required precision levels

## Continuous Integration

These tests can be integrated with CI/CD pipelines:
```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Check coverage
  run: npm run test:coverage
```

## Future Improvements

Potential enhancements:
1. Integration tests with DOM manipulation
2. Performance benchmarks
3. Visual regression tests for graphs
4. Cross-browser compatibility tests
5. Accessibility tests

## Contributing

When adding new physics calculations:
1. Add function to `physics-calculations.js`
2. Export function at bottom
3. Create test file or add to existing
4. Test accuracy with known values
5. Test edge cases (0, Infinity, NaN)
6. Test IGCSE-style problems
7. Verify coverage remains >95%

## Resources

- Jest Documentation: https://jestjs.io/
- IGCSE Physics Syllabus: Cambridge International
- Physics Reference: OpenStax Physics

---

**Test Suite Version**: 1.0.0
**Last Updated**: 2025-11-14
**Maintainer**: IGCSE Physics App Team
