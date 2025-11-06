// Brute force search for the SHA-1 to roulette algorithm

const testCases = [
  { hash: "0710f5c3e71e641cf28bd68347feff27d558ac2f", expected: 0 },
  { hash: "0a4d8ded4463e1bef68993784d221c33eeb9bf5f", expected: 29 },
  { hash: "ef4250cc5ab21a0d0979f49752c6b40fe07477ef", expected: 6 },
  { hash: "ca3a750c8b8a19ea91393a4a05fb8ce4211aefbe", expected: 15 },
  { hash: "23e0c801f995d6aeda8e0bf0d56634b2d6b3df19", expected: 6 },
];

function test(algorithm) {
  return testCases.every(tc => algorithm(tc.hash) === tc.expected);
}

function found(name, algorithm) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`🎯 FOUND: ${name}`);
  console.log("=".repeat(70));
  testCases.forEach(tc => {
    const result = algorithm(tc.hash);
    console.log(`${tc.hash} → ${result} ✓`);
  });
  console.log("=".repeat(70));
  return true;
}

// Let me also manually verify the examples first
console.log("Manual verification of test cases:");
testCases.forEach((tc, idx) => {
  console.log(`${idx + 1}. ${tc.hash} → expected: ${tc.expected}`);
  
  // Show first few bytes
  console.log(`   First byte: 0x${tc.hash.substring(0, 2)} = ${parseInt(tc.hash.substring(0, 2), 16)}`);
  console.log(`   Last byte: 0x${tc.hash.substring(38, 40)} = ${parseInt(tc.hash.substring(38, 40), 16)}`);
  
  // BigInt mod 37
  const bigIntMod = Number(BigInt("0x" + tc.hash) % BigInt(37));
  console.log(`   BigInt % 37 = ${bigIntMod}`);
  
  // Sum all bytes
  let byteSum = 0;
  for (let i = 0; i < tc.hash.length; i += 2) {
    byteSum += parseInt(tc.hash.substring(i, i + 2), 16);
  }
  console.log(`   Sum of bytes % 37 = ${byteSum % 37}`);
  console.log();
});

console.log("\nStarting systematic search...\n");

// CATEGORY 1: Direct modulo of hash segments
console.log("Testing direct modulo approaches...");

// Full hash
if (test((hash) => Number(BigInt("0x" + hash) % BigInt(37))) && found("Full hash % 37", (hash) => Number(BigInt("0x" + hash) % BigInt(37)))) process.exit(0);

// First N chars
for (let n = 1; n <= 20; n++) {
  if (test((hash) => parseInt(hash.substring(0, n), 16) % 37) && found(`First ${n} chars % 37`, (hash) => parseInt(hash.substring(0, n), 16) % 37)) process.exit(0);
}

// Last N chars
for (let n = 1; n <= 20; n++) {
  if (test((hash) => parseInt(hash.substring(40 - n), 16) % 37) && found(`Last ${n} chars % 37`, (hash) => parseInt(hash.substring(40 - n), 16) % 37)) process.exit(0);
}

// CATEGORY 2: Byte operations
console.log("Testing byte operations...");

// Sum of all bytes
if (test((hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 2) sum += parseInt(hash.substring(i, i + 2), 16);
  return sum % 37;
}) && found("Sum of all 20 bytes % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 2) sum += parseInt(hash.substring(i, i + 2), 16);
  return sum % 37;
})) process.exit(0);

// XOR of all bytes
if (test((hash) => {
  let xor = 0;
  for (let i = 0; i < 40; i += 2) xor ^= parseInt(hash.substring(i, i + 2), 16);
  return xor % 37;
}) && found("XOR of all 20 bytes % 37", (hash) => {
  let xor = 0;
  for (let i = 0; i < 40; i += 2) xor ^= parseInt(hash.substring(i, i + 2), 16);
  return xor % 37;
})) process.exit(0);

// Sum of first N bytes
for (let n = 1; n <= 20; n++) {
  if (test((hash) => {
    let sum = 0;
    for (let i = 0; i < n * 2; i += 2) sum += parseInt(hash.substring(i, i + 2), 16);
    return sum % 37;
  }) && found(`Sum of first ${n} bytes % 37`, (hash) => {
    let sum = 0;
    for (let i = 0; i < n * 2; i += 2) sum += parseInt(hash.substring(i, i + 2), 16);
    return sum % 37;
  })) process.exit(0);
}

// Sum of last N bytes
for (let n = 1; n <= 20; n++) {
  if (test((hash) => {
    let sum = 0;
    for (let i = 40 - n * 2; i < 40; i += 2) sum += parseInt(hash.substring(i, i + 2), 16);
    return sum % 37;
  }) && found(`Sum of last ${n} bytes % 37`, (hash) => {
    let sum = 0;
    for (let i = 40 - n * 2; i < 40; i += 2) sum += parseInt(hash.substring(i, i + 2), 16);
    return sum % 37;
  })) process.exit(0);
}

// CATEGORY 3: Individual byte positions
console.log("Testing individual byte positions...");

for (let pos = 0; pos < 20; pos++) {
  if (test((hash) => parseInt(hash.substring(pos * 2, pos * 2 + 2), 16) % 37) && found(`Byte ${pos} % 37`, (hash) => parseInt(hash.substring(pos * 2, pos * 2 + 2), 16) % 37)) process.exit(0);
}

// CATEGORY 4: 4-byte (32-bit) chunks
console.log("Testing 4-byte chunk operations...");

// XOR of 4-byte chunks
if (test((hash) => {
  let xor = 0;
  for (let i = 0; i < 40; i += 8) xor ^= parseInt(hash.substring(i, i + 8), 16);
  return xor % 37;
}) && found("XOR of 4-byte chunks % 37", (hash) => {
  let xor = 0;
  for (let i = 0; i < 40; i += 8) xor ^= parseInt(hash.substring(i, i + 8), 16);
  return xor % 37;
})) process.exit(0);

// Sum of 4-byte chunks
if (test((hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 8) sum += parseInt(hash.substring(i, i + 8), 16);
  return sum % 37;
}) && found("Sum of 4-byte chunks % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 8) sum += parseInt(hash.substring(i, i + 8), 16);
  return sum % 37;
})) process.exit(0);

// CATEGORY 5: Nibble (hex digit) operations
console.log("Testing nibble (hex digit) operations...");

// Sum of all hex digits
if (test((hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i++) sum += parseInt(hash[i], 16);
  return sum % 37;
}) && found("Sum of all 40 hex digits % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i++) sum += parseInt(hash[i], 16);
  return sum % 37;
})) process.exit(0);

// CATEGORY 6: Combinations of bytes
console.log("Testing byte combinations...");

// First + last byte
if (test((hash) => {
  const first = parseInt(hash.substring(0, 2), 16);
  const last = parseInt(hash.substring(38, 40), 16);
  return (first + last) % 37;
}) && found("First + Last byte % 37", (hash) => {
  const first = parseInt(hash.substring(0, 2), 16);
  const last = parseInt(hash.substring(38, 40), 16);
  return (first + last) % 37;
})) process.exit(0);

// First XOR last byte
if (test((hash) => {
  const first = parseInt(hash.substring(0, 2), 16);
  const last = parseInt(hash.substring(38, 40), 16);
  return (first ^ last) % 37;
}) && found("First XOR Last byte % 37", (hash) => {
  const first = parseInt(hash.substring(0, 2), 16);
  const last = parseInt(hash.substring(38, 40), 16);
  return (first ^ last) % 37;
})) process.exit(0);

// CATEGORY 7: Even/Odd position operations
console.log("Testing even/odd position operations...");

// Even position bytes
if (test((hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 4) sum += parseInt(hash.substring(i, i + 2), 16);
  return sum % 37;
}) && found("Sum of even position bytes % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 4) sum += parseInt(hash.substring(i, i + 2), 16);
  return sum % 37;
})) process.exit(0);

// Odd position bytes
if (test((hash) => {
  let sum = 0;
  for (let i = 2; i < 40; i += 4) sum += parseInt(hash.substring(i, i + 2), 16);
  return sum % 37;
}) && found("Sum of odd position bytes % 37", (hash) => {
  let sum = 0;
  for (let i = 2; i < 40; i += 4) sum += parseInt(hash.substring(i, i + 2), 16);
  return sum % 37;
})) process.exit(0);

// Even hex digit positions
if (test((hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 2) sum += parseInt(hash[i], 16);
  return sum % 37;
}) && found("Sum of even hex digit positions % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 2) sum += parseInt(hash[i], 16);
  return sum % 37;
})) process.exit(0);

// Odd hex digit positions
if (test((hash) => {
  let sum = 0;
  for (let i = 1; i < 40; i += 2) sum += parseInt(hash[i], 16);
  return sum % 37;
}) && found("Sum of odd hex digit positions % 37", (hash) => {
  let sum = 0;
  for (let i = 1; i < 40; i += 2) sum += parseInt(hash[i], 16);
  return sum % 37;
})) process.exit(0);

// CATEGORY 8: Weighted sums
console.log("Testing weighted sum operations...");

// Weighted by byte position
if (test((hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 2) {
    const byteVal = parseInt(hash.substring(i, i + 2), 16);
    sum += (i / 2) * byteVal;
  }
  return sum % 37;
}) && found("Weighted sum (byte_index * byte_value) % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 2) {
    const byteVal = parseInt(hash.substring(i, i + 2), 16);
    sum += (i / 2) * byteVal;
  }
  return sum % 37;
})) process.exit(0);

// CATEGORY 9: Division approaches
console.log("Testing division approaches...");

for (let n = 1; n <= 10; n++) {
  if (test((hash) => {
    const value = parseInt(hash.substring(0, n * 2), 16);
    return Math.floor(value / 37) % 37;
  }) && found(`First ${n} bytes / 37 then % 37`, (hash) => {
    const value = parseInt(hash.substring(0, n * 2), 16);
    return Math.floor(value / 37) % 37;
  })) process.exit(0);
}

console.log("\n❌ Algorithm not found in standard approaches. Trying advanced combinations...\n");

// CATEGORY 10: Advanced combinations - all pairs of bytes
console.log("Testing all byte pair combinations (this may take a while)...");

for (let i = 0; i < 20; i++) {
  for (let j = i + 1; j < 20; j++) {
    // Sum
    if (test((hash) => {
      const b1 = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
      const b2 = parseInt(hash.substring(j * 2, j * 2 + 2), 16);
      return (b1 + b2) % 37;
    }) && found(`Byte[${i}] + Byte[${j}] % 37`, (hash) => {
      const b1 = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
      const b2 = parseInt(hash.substring(j * 2, j * 2 + 2), 16);
      return (b1 + b2) % 37;
    })) process.exit(0);
    
    // XOR
    if (test((hash) => {
      const b1 = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
      const b2 = parseInt(hash.substring(j * 2, j * 2 + 2), 16);
      return (b1 ^ b2) % 37;
    }) && found(`Byte[${i}] XOR Byte[${j}] % 37`, (hash) => {
      const b1 = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
      const b2 = parseInt(hash.substring(j * 2, j * 2 + 2), 16);
      return (b1 ^ b2) % 37;
    })) process.exit(0);
  }
}

console.log("\n❌ No matching algorithm found!");
