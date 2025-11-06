// Testing all possible algorithms to convert SHA-1 hash to roulette number (0-36)

const testCases = [
  { hash: "0710f5c3e71e641cf28bd68347feff27d558ac2f", expected: 0 },
  { hash: "0a4d8ded4463e1bef68993784d221c33eeb9bf5f", expected: 29 },
  { hash: "ef4250cc5ab21a0d0979f49752c6b40fe07477ef", expected: 6 },
  { hash: "ca3a750c8b8a19ea91393a4a05fb8ce4211aefbe", expected: 15 },
  { hash: "23e0c801f995d6aeda8e0bf0d56634b2d6b3df19", expected: 6 },
];

function testAlgorithm(name: string, algorithm: (hash: string) => number) {
  console.log(`\n=== Testing: ${name} ===`);
  let allCorrect = true;
  
  for (const testCase of testCases) {
    const result = algorithm(testCase.hash);
    const correct = result === testCase.expected;
    allCorrect = allCorrect && correct;
    console.log(`Hash: ${testCase.hash.substring(0, 10)}... → Result: ${result}, Expected: ${testCase.expected} ${correct ? "✓" : "✗"}`);
  }
  
  if (allCorrect) {
    console.log(`\n🎯 FOUND IT! ${name} works for ALL cases!`);
  }
  
  return allCorrect;
}

// Algorithm 1: First N characters as hex → decimal % 37
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 1: First N characters");
console.log("=".repeat(60));

for (let n = 1; n <= 16; n++) {
  testAlgorithm(`First ${n} chars as hex % 37`, (hash) => {
    return parseInt(hash.substring(0, n), 16) % 37;
  });
}

// Algorithm 2: Last N characters as hex → decimal % 37
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 2: Last N characters");
console.log("=".repeat(60));

for (let n = 1; n <= 16; n++) {
  testAlgorithm(`Last ${n} chars as hex % 37`, (hash) => {
    return parseInt(hash.substring(hash.length - n), 16) % 37;
  });
}

// Algorithm 3: Sum of hex values of all characters % 37
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 3: Sum of character hex values");
console.log("=".repeat(60));

testAlgorithm("Sum of all hex digit values % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i++) {
    sum += parseInt(hash[i], 16);
  }
  return sum % 37;
});

// Algorithm 4: XOR of all bytes % 37
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 4: XOR operations");
console.log("=".repeat(60));

testAlgorithm("XOR of all bytes % 37", (hash) => {
  let xor = 0;
  for (let i = 0; i < hash.length; i += 2) {
    xor ^= parseInt(hash.substring(i, i + 2), 16);
  }
  return xor % 37;
});

testAlgorithm("XOR of all hex digits % 37", (hash) => {
  let xor = 0;
  for (let i = 0; i < hash.length; i++) {
    xor ^= parseInt(hash[i], 16);
  }
  return xor % 37;
});

// Algorithm 5: Product/multiplication approaches
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 5: Product operations");
console.log("=".repeat(60));

testAlgorithm("Product of first 4 bytes % 37", (hash) => {
  let product = 1;
  for (let i = 0; i < 8; i += 2) {
    product *= parseInt(hash.substring(i, i + 2), 16);
  }
  return product % 37;
});

// Algorithm 6: Middle characters extraction
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 6: Middle characters");
console.log("=".repeat(60));

for (let n = 1; n <= 16; n++) {
  testAlgorithm(`Middle ${n} chars as hex % 37`, (hash) => {
    const start = Math.floor((hash.length - n) / 2);
    return parseInt(hash.substring(start, start + n), 16) % 37;
  });
}

// Algorithm 7: Alternating character sums
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 7: Alternating sums");
console.log("=".repeat(60));

testAlgorithm("Alternating sum (even - odd positions) % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i++) {
    const value = parseInt(hash[i], 16);
    sum += (i % 2 === 0) ? value : -value;
  }
  return Math.abs(sum) % 37;
});

testAlgorithm("Even positions sum % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i += 2) {
    sum += parseInt(hash[i], 16);
  }
  return sum % 37;
});

testAlgorithm("Odd positions sum % 37", (hash) => {
  let sum = 0;
  for (let i = 1; i < hash.length; i += 2) {
    sum += parseInt(hash[i], 16);
  }
  return sum % 37;
});

// Algorithm 8: Binary operations
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 8: Binary operations");
console.log("=".repeat(60));

testAlgorithm("AND of all bytes % 37", (hash) => {
  let and = 255;
  for (let i = 0; i < hash.length; i += 2) {
    and &= parseInt(hash.substring(i, i + 2), 16);
  }
  return and % 37;
});

testAlgorithm("OR of all bytes % 37", (hash) => {
  let or = 0;
  for (let i = 0; i < hash.length; i += 2) {
    or |= parseInt(hash.substring(i, i + 2), 16);
  }
  return or % 37;
});

// Algorithm 9: Weighted sums
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 9: Weighted sums");
console.log("=".repeat(60));

testAlgorithm("Weighted sum (position * value) % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i++) {
    sum += i * parseInt(hash[i], 16);
  }
  return sum % 37;
});

testAlgorithm("Weighted sum (byte_index * byte_value) % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i += 2) {
    const byteValue = parseInt(hash.substring(i, i + 2), 16);
    sum += (i / 2) * byteValue;
  }
  return sum % 37;
});

// Algorithm 10: Byte pairs
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 10: Byte operations");
console.log("=".repeat(60));

testAlgorithm("Sum of all bytes % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i += 2) {
    sum += parseInt(hash.substring(i, i + 2), 16);
  }
  return sum % 37;
});

testAlgorithm("Sum of first 10 bytes % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 20; i += 2) {
    sum += parseInt(hash.substring(i, i + 2), 16);
  }
  return sum % 37;
});

testAlgorithm("Sum of last 10 bytes % 37", (hash) => {
  let sum = 0;
  for (let i = hash.length - 20; i < hash.length; i += 2) {
    sum += parseInt(hash.substring(i, i + 2), 16);
  }
  return sum % 37;
});

// Algorithm 11: Different modulo bases
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 11: Integer division approaches");
console.log("=".repeat(60));

testAlgorithm("First 8 chars hex / 37 floor % 37", (hash) => {
  const value = parseInt(hash.substring(0, 8), 16);
  return Math.floor(value / 37) % 37;
});

testAlgorithm("Last 8 chars hex / 37 floor % 37", (hash) => {
  const value = parseInt(hash.substring(hash.length - 8), 16);
  return Math.floor(value / 37) % 37;
});

// Algorithm 12: Specific byte positions
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 12: Specific byte positions");
console.log("=".repeat(60));

for (let pos = 0; pos < 20; pos++) {
  testAlgorithm(`Byte at position ${pos} % 37`, (hash) => {
    return parseInt(hash.substring(pos * 2, pos * 2 + 2), 16) % 37;
  });
}

// Algorithm 13: Pairs of bytes
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 13: Byte pair operations");
console.log("=".repeat(60));

testAlgorithm("XOR of byte pairs % 37", (hash) => {
  let result = 0;
  for (let i = 0; i < hash.length; i += 4) {
    const byte1 = parseInt(hash.substring(i, i + 2), 16);
    const byte2 = parseInt(hash.substring(i + 2, i + 4), 16);
    result ^= (byte1 ^ byte2);
  }
  return result % 37;
});

testAlgorithm("Sum of XORed byte pairs % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i += 4) {
    const byte1 = parseInt(hash.substring(i, i + 2), 16);
    const byte2 = parseInt(hash.substring(i + 2, i + 4), 16);
    sum += (byte1 ^ byte2);
  }
  return sum % 37;
});

// Algorithm 14: Convert to decimal and use different operations
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 14: BigInt operations");
console.log("=".repeat(60));

testAlgorithm("Full hash as BigInt % 37", (hash) => {
  const bigIntValue = BigInt("0x" + hash);
  return Number(bigIntValue % BigInt(37));
});

// Algorithm 15: Nibble (half-byte) operations
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 15: Custom combinations");
console.log("=".repeat(60));

testAlgorithm("First byte + last byte % 37", (hash) => {
  const first = parseInt(hash.substring(0, 2), 16);
  const last = parseInt(hash.substring(hash.length - 2), 16);
  return (first + last) % 37;
});

testAlgorithm("First byte XOR last byte % 37", (hash) => {
  const first = parseInt(hash.substring(0, 2), 16);
  const last = parseInt(hash.substring(hash.length - 2), 16);
  return (first ^ last) % 37;
});

testAlgorithm("First 4 bytes XOR last 4 bytes % 37", (hash) => {
  const first = parseInt(hash.substring(0, 8), 16);
  const last = parseInt(hash.substring(hash.length - 8), 16);
  return (first ^ last) % 37;
});

// Algorithm 16: Different chunk sizes
console.log("\n" + "=".repeat(60));
console.log("ALGORITHM 16: 4-byte chunks");
console.log("=".repeat(60));

testAlgorithm("Sum of 4-byte chunks % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < hash.length; i += 8) {
    sum += parseInt(hash.substring(i, i + 8), 16);
  }
  return sum % 37;
});

testAlgorithm("XOR of 4-byte chunks % 37", (hash) => {
  let xor = 0;
  for (let i = 0; i < hash.length; i += 8) {
    xor ^= parseInt(hash.substring(i, i + 8), 16);
  }
  return xor % 37;
});

// Run the test
console.log("\n" + "=".repeat(60));
console.log("TESTING COMPLETE");
console.log("=".repeat(60));
