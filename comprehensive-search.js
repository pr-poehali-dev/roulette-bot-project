// Most comprehensive search for SHA-1 to roulette algorithm

const testCases = [
  { hash: "0710f5c3e71e641cf28bd68347feff27d558ac2f", expected: 0 },
  { hash: "0a4d8ded4463e1bef68993784d221c33eeb9bf5f", expected: 29 },
  { hash: "ef4250cc5ab21a0d0979f49752c6b40fe07477ef", expected: 6 },
  { hash: "ca3a750c8b8a19ea91393a4a05fb8ce4211aefbe", expected: 15 },
  { hash: "23e0c801f995d6aeda8e0bf0d56634b2d6b3df19", expected: 6 },
];

let foundCount = 0;

function test(algorithm) {
  return testCases.every(tc => algorithm(tc.hash) === tc.expected);
}

function report(name, algorithm) {
  if (test(algorithm)) {
    foundCount++;
    console.log(`\n${"=".repeat(80)}`);
    console.log(`🎯 SOLUTION #${foundCount}: ${name}`);
    console.log("=".repeat(80));
    testCases.forEach(tc => {
      const result = algorithm(tc.hash);
      console.log(`${tc.hash} → ${result} ✓`);
    });
    console.log("=".repeat(80) + "\n");
    return true;
  }
  return false;
}

console.log("COMPREHENSIVE SHA-1 TO ROULETTE ALGORITHM SEARCH\n");

// Parse all test cases into bytes for easier manipulation
const parsedCases = testCases.map(tc => {
  const bytes = [];
  for (let i = 0; i < tc.hash.length; i += 2) {
    bytes.push(parseInt(tc.hash.substring(i, i + 2), 16));
  }
  return { hash: tc.hash, bytes, expected: tc.expected };
});

// SECTION 1: Single operation on full hash
console.log("Testing single operations on full hash...");
report("Full hash as BigInt % 37", (hash) => Number(BigInt("0x" + hash) % BigInt(37)));

// SECTION 2: Substring operations (all possible lengths and positions)
console.log("Testing substring operations...");

// First N characters
for (let len = 1; len <= 40; len++) {
  report(`First ${len} chars % 37`, (hash) => parseInt(hash.substring(0, len), 16) % 37);
}

// Last N characters
for (let len = 1; len <= 40; len++) {
  report(`Last ${len} chars % 37`, (hash) => parseInt(hash.substring(40 - len), 16) % 37);
}

// Middle sections
for (let len = 1; len <= 40; len++) {
  for (let start = 0; start + len <= 40; start++) {
    report(`Chars [${start}:${start+len}] % 37`, (hash) => parseInt(hash.substring(start, start + len), 16) % 37);
  }
}

// SECTION 3: Single byte at any position
console.log("Testing single byte positions...");
for (let pos = 0; pos < 20; pos++) {
  report(`Byte ${pos} % 37`, (hash) => parseInt(hash.substring(pos * 2, pos * 2 + 2), 16) % 37);
}

// SECTION 4: Sum of bytes (all ranges)
console.log("Testing sum of byte ranges...");

// All bytes
report("Sum of all 20 bytes % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 2) sum += parseInt(hash.substring(i, i + 2), 16);
  return sum % 37;
});

// First N bytes
for (let n = 1; n <= 20; n++) {
  report(`Sum of first ${n} bytes % 37`, (hash) => {
    let sum = 0;
    for (let i = 0; i < n * 2; i += 2) sum += parseInt(hash.substring(i, i + 2), 16);
    return sum % 37;
  });
}

// Last N bytes
for (let n = 1; n <= 20; n++) {
  report(`Sum of last ${n} bytes % 37`, (hash) => {
    let sum = 0;
    for (let i = 40 - n * 2; i < 40; i += 2) sum += parseInt(hash.substring(i, i + 2), 16);
    return sum % 37;
  });
}

// SECTION 5: XOR operations
console.log("Testing XOR operations...");

// XOR of all bytes
report("XOR of all 20 bytes % 37", (hash) => {
  let xor = 0;
  for (let i = 0; i < 40; i += 2) xor ^= parseInt(hash.substring(i, i + 2), 16);
  return xor % 37;
});

// XOR of first N bytes
for (let n = 1; n <= 20; n++) {
  report(`XOR of first ${n} bytes % 37`, (hash) => {
    let xor = 0;
    for (let i = 0; i < n * 2; i += 2) xor ^= parseInt(hash.substring(i, i + 2), 16);
    return xor % 37;
  });
}

// SECTION 6: Two-byte operations
console.log("Testing two-byte combinations (this will take a moment)...");

// All pairs: sum
for (let i = 0; i < 20; i++) {
  for (let j = i + 1; j < 20; j++) {
    report(`Byte[${i}] + Byte[${j}] % 37`, (hash) => {
      const b1 = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
      const b2 = parseInt(hash.substring(j * 2, j * 2 + 2), 16);
      return (b1 + b2) % 37;
    });
  }
}

// All pairs: XOR
for (let i = 0; i < 20; i++) {
  for (let j = i + 1; j < 20; j++) {
    report(`Byte[${i}] XOR Byte[${j}] % 37`, (hash) => {
      const b1 = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
      const b2 = parseInt(hash.substring(j * 2, j * 2 + 2), 16);
      return (b1 ^ b2) % 37;
    });
  }
}

// All pairs: multiply
for (let i = 0; i < 20; i++) {
  for (let j = i + 1; j < 20; j++) {
    report(`Byte[${i}] * Byte[${j}] % 37`, (hash) => {
      const b1 = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
      const b2 = parseInt(hash.substring(j * 2, j * 2 + 2), 16);
      return (b1 * b2) % 37;
    });
  }
}

// SECTION 7: Three-byte operations (selected combinations to save time)
console.log("Testing three-byte combinations (selected patterns)...");

// First, middle, last
report("Byte[0] + Byte[10] + Byte[19] % 37", (hash) => {
  const b0 = parseInt(hash.substring(0, 2), 16);
  const b10 = parseInt(hash.substring(20, 22), 16);
  const b19 = parseInt(hash.substring(38, 40), 16);
  return (b0 + b10 + b19) % 37;
});

// SECTION 8: Hex digit operations
console.log("Testing hex digit (nibble) operations...");

// Sum of all hex digits
report("Sum of all 40 hex digits % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i++) sum += parseInt(hash[i], 16);
  return sum % 37;
});

// SECTION 9: Chunk operations
console.log("Testing chunk operations...");

// 4-byte chunks
report("XOR of 4-byte chunks % 37", (hash) => {
  let xor = 0;
  for (let i = 0; i < 40; i += 8) xor ^= parseInt(hash.substring(i, i + 8), 16);
  return xor % 37;
});

report("Sum of 4-byte chunks % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 8) sum += parseInt(hash.substring(i, i + 8), 16);
  return sum % 37;
});

// SECTION 10: Division and modulo combinations
console.log("Testing division approaches...");

for (let n = 1; n <= 16; n++) {
  report(`(First ${n} chars / 37) % 37`, (hash) => {
    const val = parseInt(hash.substring(0, n * 2), 16);
    return Math.floor(val / 37) % 37;
  });
}

// SECTION 11: Bit operations
console.log("Testing bit operations...");

// AND of all bytes
report("AND of all bytes % 37", (hash) => {
  let result = 255;
  for (let i = 0; i < 40; i += 2) result &= parseInt(hash.substring(i, i + 2), 16);
  return result % 37;
});

// OR of all bytes
report("OR of all bytes % 37", (hash) => {
  let result = 0;
  for (let i = 0; i < 40; i += 2) result |= parseInt(hash.substring(i, i + 2), 16);
  return result % 37;
});

// SECTION 12: Weighted sums
console.log("Testing weighted operations...");

report("Weighted sum (byte_index * byte_value) % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 2) {
    const byteVal = parseInt(hash.substring(i, i + 2), 16);
    sum += (i / 2) * byteVal;
  }
  return sum % 37;
});

report("Weighted sum (position * hex_digit_value) % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i++) {
    sum += i * parseInt(hash[i], 16);
  }
  return sum % 37;
});

// SECTION 13: Alternating operations
console.log("Testing alternating operations...");

report("Alternating sum/sub of bytes % 37", (hash) => {
  let result = 0;
  for (let i = 0; i < 40; i += 2) {
    const byte = parseInt(hash.substring(i, i + 2), 16);
    result += ((i / 2) % 2 === 0) ? byte : -byte;
  }
  return Math.abs(result) % 37;
});

report("Even byte positions sum % 37", (hash) => {
  let sum = 0;
  for (let i = 0; i < 40; i += 4) sum += parseInt(hash.substring(i, i + 2), 16);
  return sum % 37;
});

report("Odd byte positions sum % 37", (hash) => {
  let sum = 0;
  for (let i = 2; i < 40; i += 4) sum += parseInt(hash.substring(i, i + 2), 16);
  return sum % 37;
});

// Summary
console.log("\n" + "=".repeat(80));
if (foundCount > 0) {
  console.log(`✅ SUCCESS! Found ${foundCount} matching algorithm(s)!`);
} else {
  console.log("❌ No matching algorithm found.");
  console.log("The algorithm may involve more complex operations not covered in this search.");
}
console.log("=".repeat(80));
