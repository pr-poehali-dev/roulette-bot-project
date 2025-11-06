// Testing all possible algorithms to convert SHA-1 hash to roulette number (0-36)

const testCases = [
  { hash: "0710f5c3e71e641cf28bd68347feff27d558ac2f", expected: 0 },
  { hash: "0a4d8ded4463e1bef68993784d221c33eeb9bf5f", expected: 29 },
  { hash: "ef4250cc5ab21a0d0979f49752c6b40fe07477ef", expected: 6 },
  { hash: "ca3a750c8b8a19ea91393a4a05fb8ce4211aefbe", expected: 15 },
  { hash: "23e0c801f995d6aeda8e0bf0d56634b2d6b3df19", expected: 6 },
];

function testAlgorithm(name, algorithm) {
  const results = testCases.map(tc => ({
    hash: tc.hash,
    result: algorithm(tc.hash),
    expected: tc.expected,
    correct: algorithm(tc.hash) === tc.expected
  }));
  
  const allCorrect = results.every(r => r.correct);
  
  if (allCorrect) {
    console.log(`\n🎯 FOUND IT! ${name}`);
    console.log("=".repeat(70));
    results.forEach(r => {
      console.log(`Hash: ${r.hash} → ${r.result} (expected ${r.expected}) ✓`);
    });
    console.log("=".repeat(70));
    return true;
  }
  
  return false;
}

console.log("Starting exhaustive search...\n");

// Test 1: First N characters
for (let n = 1; n <= 16; n++) {
  if (testAlgorithm(`First ${n} chars % 37`, (hash) => parseInt(hash.substring(0, n), 16) % 37)) process.exit(0);
}

// Test 2: Last N characters
for (let n = 1; n <= 16; n++) {
  if (testAlgorithm(`Last ${n} chars % 37`, (hash) => parseInt(hash.substring(hash.length - n), 16) % 37)) process.exit(0);
}

// Test 3: Middle N characters
for (let n = 1; n <= 16; n++) {
  const start = Math.floor((40 - n) / 2);
  if (testAlgorithm(`Middle ${n} chars % 37`, (hash) => parseInt(hash.substring(start, start + n), 16) % 37)) process.exit(0);
}

// Test 4: Sum of all hex digits
if (testAlgorithm("Sum of all hex digit values % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i++) {
    sum += parseInt(hash[i], 16);
  }
  return sum % 37;
})) process.exit(0);

// Test 5: XOR of all bytes
if (testAlgorithm("XOR of all bytes % 37", (hash) => {
  let xor = 0;
  for (let i = 0; i < hash.length; i += 2) {
    xor ^= parseInt(hash.substring(i, i + 2), 16);
  }
  return xor % 37;
})) process.exit(0);

// Test 6: Sum of all bytes
if (testAlgorithm("Sum of all bytes % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i += 2) {
    sum += parseInt(hash.substring(i, i + 2), 16);
  }
  return sum % 37;
})) process.exit(0);

// Test 7: Full hash as BigInt % 37
if (testAlgorithm("Full hash as BigInt % 37", (hash) => {
  return Number(BigInt("0x" + hash) % BigInt(37));
})) process.exit(0);

// Test 8: Specific byte positions
for (let pos = 0; pos < 20; pos++) {
  if (testAlgorithm(`Byte at position ${pos} % 37`, (hash) => {
    return parseInt(hash.substring(pos * 2, pos * 2 + 2), 16) % 37;
  })) process.exit(0);
}

// Test 9: Sum of first N bytes
for (let n = 1; n <= 20; n++) {
  if (testAlgorithm(`Sum of first ${n} bytes % 37`, (hash) => {
    let sum = 0;
    for (let i = 0; i < n * 2; i += 2) {
      sum += parseInt(hash.substring(i, i + 2), 16);
    }
    return sum % 37;
  })) process.exit(0);
}

// Test 10: Sum of last N bytes
for (let n = 1; n <= 20; n++) {
  if (testAlgorithm(`Sum of last ${n} bytes % 37`, (hash) => {
    let sum = 0;
    for (let i = hash.length - n * 2; i < hash.length; i += 2) {
      sum += parseInt(hash.substring(i, i + 2), 16);
    }
    return sum % 37;
  })) process.exit(0);
}

// Test 11: XOR of 4-byte chunks
if (testAlgorithm("XOR of 4-byte chunks % 37", (hash) => {
  let xor = 0;
  for (let i = 0; i < hash.length; i += 8) {
    xor ^= parseInt(hash.substring(i, i + 8), 16);
  }
  return xor % 37;
})) process.exit(0);

// Test 12: Sum of 4-byte chunks
if (testAlgorithm("Sum of 4-byte chunks % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i += 8) {
    sum += parseInt(hash.substring(i, i + 8), 16);
  }
  return sum % 37;
})) process.exit(0);

// Test 13: Even position hex digits
if (testAlgorithm("Sum of even position digits % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i += 2) {
    sum += parseInt(hash[i], 16);
  }
  return sum % 37;
})) process.exit(0);

// Test 14: Odd position hex digits
if (testAlgorithm("Sum of odd position digits % 37", (hash) => {
  let sum = 0;
  for (let i = 1; i < hash.length; i += 2) {
    sum += parseInt(hash[i], 16);
  }
  return sum % 37;
})) process.exit(0);

// Test 15: First byte + last byte
if (testAlgorithm("First byte + last byte % 37", (hash) => {
  const first = parseInt(hash.substring(0, 2), 16);
  const last = parseInt(hash.substring(hash.length - 2), 16);
  return (first + last) % 37;
})) process.exit(0);

// Test 16: First byte XOR last byte
if (testAlgorithm("First byte XOR last byte % 37", (hash) => {
  const first = parseInt(hash.substring(0, 2), 16);
  const last = parseInt(hash.substring(hash.length - 2), 16);
  return (first ^ last) % 37;
})) process.exit(0);

// Test 17: Weighted sum by position
if (testAlgorithm("Weighted sum (position * value) % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i++) {
    sum += i * parseInt(hash[i], 16);
  }
  return sum % 37;
})) process.exit(0);

// Test 18: Weighted byte sum
if (testAlgorithm("Weighted byte sum % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i += 2) {
    const byteValue = parseInt(hash.substring(i, i + 2), 16);
    sum += (i / 2) * byteValue;
  }
  return sum % 37;
})) process.exit(0);

// Test 19: Sum of XORed byte pairs
if (testAlgorithm("Sum of XORed byte pairs % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i += 4) {
    const byte1 = parseInt(hash.substring(i, i + 2), 16);
    const byte2 = parseInt(hash.substring(i + 2, i + 4), 16);
    sum += (byte1 ^ byte2);
  }
  return sum % 37;
})) process.exit(0);

// Test 20: Different modulo operations on first/last segments
for (let n = 1; n <= 10; n++) {
  if (testAlgorithm(`First ${n} chars hex / 37 then % 37`, (hash) => {
    const value = parseInt(hash.substring(0, n * 2), 16);
    return Math.floor(value / 37) % 37;
  })) process.exit(0);
}

// Test 21: Specific combinations of bytes
for (let i = 0; i < 20; i++) {
  for (let j = i + 1; j < 20; j++) {
    if (testAlgorithm(`Byte ${i} + Byte ${j} % 37`, (hash) => {
      const byte1 = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
      const byte2 = parseInt(hash.substring(j * 2, j * 2 + 2), 16);
      return (byte1 + byte2) % 37;
    })) process.exit(0);
  }
}

console.log("\n❌ No algorithm found in the tested approaches!");
