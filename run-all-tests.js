#!/usr/bin/env node

// This script will find the algorithm by brute force

const cases = [
  { hash: "0710f5c3e71e641cf28bd68347feff27d558ac2f", expected: 0 },
  { hash: "0a4d8ded4463e1bef68993784d221c33eeb9bf5f", expected: 29 },
  { hash: "ef4250cc5ab21a0d0979f49752c6b40fe07477ef", expected: 6 },
  { hash: "ca3a750c8b8a19ea91393a4a05fb8ce4211aefbe", expected: 15 },
  { hash: "23e0c801f995d6aeda8e0bf0d56634b2d6b3df19", expected: 6 },
];

console.log("🔎 EXHAUSTIVE SEARCH FOR ROULETTE ALGORITHM\n");
console.log("Testing 5 known hash → result mappings\n");

let totalTests = 0;
const startTime = Date.now();

function check(fn) {
  totalTests++;
  return cases.every(c => fn(c.hash) === c.expected);
}

function found(name, fn) {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n${"=".repeat(100)}`);
  console.log(`🎯🎯🎯 SOLUTION FOUND! 🎯🎯🎯`);
  console.log("=".repeat(100));
  console.log(`\nAlgorithm: ${name}`);
  console.log(`Found after ${totalTests} tests in ${elapsed} seconds\n`);
  console.log("Verification:");
  cases.forEach((c, i) => {
    const result = fn(c.hash);
    console.log(`  ${i+1}. ${c.hash} → ${result} ✓`);
  });
  console.log("\n" + "=".repeat(100));
  console.log("\n📝 TypeScript Implementation:\n");
  console.log("```typescript");
  console.log("function sha1ToRoulette(hash: string): number {");
  
  // Try to extract the algorithm logic
  const fnStr = fn.toString();
  if (fnStr.includes("=>")) {
    const body = fnStr.split("=>")[1].trim();
    if (body.startsWith("{")) {
      console.log(body.slice(1, -1).trim().split("\n").map(line => "  " + line).join("\n"));
    } else {
      console.log(`  return ${body};`);
    }
  } else {
    console.log("  // " + name);
  }
  
  console.log("}");
  console.log("```");
  console.log("\n" + "=".repeat(100) + "\n");
  process.exit(0);
}

// CATEGORY 1: Substring extractions (every possible start and length)
console.log("📍 Testing all substring combinations...");
for (let start = 0; start < 40; start++) {
  for (let len = 1; len <= 40 - start; len++) {
    if (check(h => parseInt(h.substring(start, start + len), 16) % 37)) {
      found(`Characters [${start}:${start+len}] as hex % 37`, 
        h => parseInt(h.substring(start, start + len), 16) % 37);
    }
  }
}

// CATEGORY 2: Byte operations (all positions, all range combinations)
console.log("📍 Testing byte range sums...");
for (let start = 0; start < 20; start++) {
  for (let end = start + 1; end <= 20; end++) {
    if (check(h => {
      let sum = 0;
      for (let i = start; i < end; i++) sum += parseInt(h.substring(i*2, i*2+2), 16);
      return sum % 37;
    })) {
      found(`Sum of bytes[${start}:${end}] % 37`,
        h => {
          let sum = 0;
          for (let i = start; i < end; i++) sum += parseInt(h.substring(i*2, i*2+2), 16);
          return sum % 37;
        });
    }
  }
}

console.log("📍 Testing byte range XORs...");
for (let start = 0; start < 20; start++) {
  for (let end = start + 1; end <= 20; end++) {
    if (check(h => {
      let xor = 0;
      for (let i = start; i < end; i++) xor ^= parseInt(h.substring(i*2, i*2+2), 16);
      return xor % 37;
    })) {
      found(`XOR of bytes[${start}:${end}] % 37`,
        h => {
          let xor = 0;
          for (let i = start; i < end; i++) xor ^= parseInt(h.substring(i*2, i*2+2), 16);
          return xor % 37;
        });
    }
  }
}

// CATEGORY 3: Two-byte combinations
console.log("📍 Testing all two-byte operations...");
for (let i = 0; i < 20; i++) {
  for (let j = i+1; j < 20; j++) {
    // Sum
    if (check(h => {
      const b1 = parseInt(h.substring(i*2, i*2+2), 16);
      const b2 = parseInt(h.substring(j*2, j*2+2), 16);
      return (b1 + b2) % 37;
    })) {
      found(`Byte[${i}] + Byte[${j}] % 37`,
        h => {
          const b1 = parseInt(h.substring(i*2, i*2+2), 16);
          const b2 = parseInt(h.substring(j*2, j*2+2), 16);
          return (b1 + b2) % 37;
        });
    }
    
    // XOR
    if (check(h => {
      const b1 = parseInt(h.substring(i*2, i*2+2), 16);
      const b2 = parseInt(h.substring(j*2, j*2+2), 16);
      return (b1 ^ b2) % 37;
    })) {
      found(`Byte[${i}] XOR Byte[${j}] % 37`,
        h => {
          const b1 = parseInt(h.substring(i*2, i*2+2), 16);
          const b2 = parseInt(h.substring(j*2, j*2+2), 16);
          return (b1 ^ b2) % 37;
        });
    }
    
    // Multiply
    if (check(h => {
      const b1 = parseInt(h.substring(i*2, i*2+2), 16);
      const b2 = parseInt(h.substring(j*2, j*2+2), 16);
      return (b1 * b2) % 37;
    })) {
      found(`Byte[${i}] * Byte[${j}] % 37`,
        h => {
          const b1 = parseInt(h.substring(i*2, i*2+2), 16);
          const b2 = parseInt(h.substring(j*2, j*2+2), 16);
          return (b1 * b2) % 37;
        });
    }
  }
}

// CATEGORY 4: Three-byte sums
console.log("📍 Testing three-byte sums (this may take a minute)...");
for (let i = 0; i < 18; i++) {
  for (let j = i+1; j < 19; j++) {
    for (let k = j+1; k < 20; k++) {
      if (check(h => {
        const b1 = parseInt(h.substring(i*2, i*2+2), 16);
        const b2 = parseInt(h.substring(j*2, j*2+2), 16);
        const b3 = parseInt(h.substring(k*2, k*2+2), 16);
        return (b1 + b2 + b3) % 37;
      })) {
        found(`Byte[${i}] + Byte[${j}] + Byte[${k}] % 37`,
          h => {
            const b1 = parseInt(h.substring(i*2, i*2+2), 16);
            const b2 = parseInt(h.substring(j*2, j*2+2), 16);
            const b3 = parseInt(h.substring(k*2, k*2+2), 16);
            return (b1 + b2 + b3) % 37;
          });
      }
    }
  }
}

// CATEGORY 5: BigInt and other full-hash operations
console.log("📍 Testing full-hash operations...");
if (check(h => Number(BigInt("0x" + h) % BigInt(37)))) {
  found("Full hash as BigInt % 37", h => Number(BigInt("0x" + h) % BigInt(37)));
}

// CATEGORY 6: Sum of hex digits
if (check(h => {
  let sum = 0;
  for (const c of h) sum += parseInt(c, 16);
  return sum % 37;
})) {
  found("Sum of all 40 hex digit values % 37", h => {
    let sum = 0;
    for (const c of h) sum += parseInt(c, 16);
    return sum % 37;
  });
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(`\n❌ Algorithm NOT FOUND after ${totalTests} tests (${elapsed} seconds)`);
console.log("\nThe algorithm may require:");
console.log("  • Four or more bytes in combination");
console.log("  • Complex bit manipulation");
console.log("  • Additional secret input");
console.log("  • Non-standard mathematical operations\n");
