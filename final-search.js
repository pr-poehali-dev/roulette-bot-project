#!/usr/bin/env node

const cases = [
  { h: "0710f5c3e71e641cf28bd68347feff27d558ac2f", e: 0 },
  { h: "0a4d8ded4463e1bef68993784d221c33eeb9bf5f", e: 29 },
  { h: "ef4250cc5ab21a0d0979f49752c6b40fe07477ef", e: 6 },
  { h: "ca3a750c8b8a19ea91393a4a05fb8ce4211aefbe", e: 15 },
  { h: "23e0c801f995d6aeda8e0bf0d56634b2d6b3df19", e: 6 },
];

const check = (fn) => cases.every(c => fn(c.h) === c.e);

const found = (name, fn) => {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`🎯 SOLUTION: ${name}`);
  console.log("=".repeat(80));
  cases.forEach(c => console.log(`${c.h} → ${fn(c.h)} ✓`));
  console.log("=".repeat(80));
  
  // Show the code
  console.log(`\nJavaScript/TypeScript implementation:\n`);
  console.log(`function sha1ToRoulette(hash: string): number {`);
  console.log(`  ${fn.toString().split('\n').slice(1, -1).join('\n  ')}`);
  console.log(`}\n`);
};

console.log("Final comprehensive search...\n");

// 1. All substrings
for (let i = 0; i < 40; i++) {
  for (let j = i+1; j <= 40; j++) {
    if (check(h => parseInt(h.substring(i, j), 16) % 37)) {
      found(`Substring [${i}:${j}] % 37`, h => parseInt(h.substring(i, j), 16) % 37);
      process.exit(0);
    }
  }
}

// 2. Byte operations
for (let i = 0; i < 20; i++) {
  for (let j = 0; j < 20; j++) {
    if (i === j) {
      if (check(h => parseInt(h.substr(i*2,2), 16) % 37)) {
        found(`Byte[${i}] % 37`, h => parseInt(h.substr(i*2,2), 16) % 37);
        process.exit(0);
      }
    } else {
      const b = (h) => [parseInt(h.substr(i*2,2),16), parseInt(h.substr(j*2,2),16)];
      
      if (check(h => {const[a,b]=b(h); return(a+b)%37})) {
        found(`Byte[${i}]+Byte[${j}] % 37`, h => {
          const b1 = parseInt(h.substring(i*2, i*2+2), 16);
          const b2 = parseInt(h.substring(j*2, j*2+2), 16);
          return (b1 + b2) % 37;
        });
        process.exit(0);
      }
      
      if (check(h => {const[a,b]=b(h); return(a^b)%37})) {
        found(`Byte[${i}]^Byte[${j}] % 37`, h => {
          const b1 = parseInt(h.substring(i*2, i*2+2), 16);
          const b2 = parseInt(h.substring(j*2, j*2+2), 16);
          return (b1 ^ b2) % 37;
        });
        process.exit(0);
      }
      
      if (check(h => {const[a,b]=b(h); return(a*b)%37})) {
        found(`Byte[${i}]*Byte[${j}] % 37`, h => {
          const b1 = parseInt(h.substring(i*2, i*2+2), 16);
          const b2 = parseInt(h.substring(j*2, j*2+2), 16);
          return (b1 * b2) % 37;
        });
        process.exit(0);
      }
    }
  }
}

// 3. Byte ranges
for (let i = 0; i < 20; i++) {
  for (let j = i+1; j <= 20; j++) {
    // Sum
    if (check(h => {
      let s = 0;
      for (let k = i; k < j; k++) s += parseInt(h.substr(k*2,2), 16);
      return s % 37;
    })) {
      found(`Sum(bytes[${i}:${j}]) % 37`, h => {
        let sum = 0;
        for (let k = i; k < j; k++) sum += parseInt(h.substring(k*2, k*2+2), 16);
        return sum % 37;
      });
      process.exit(0);
    }
    
    // XOR
    if (check(h => {
      let x = 0;
      for (let k = i; k < j; k++) x ^= parseInt(h.substr(k*2,2), 16);
      return x % 37;
    })) {
      found(`XOR(bytes[${i}:${j}]) % 37`, h => {
        let xor = 0;
        for (let k = i; k < j; k++) xor ^= parseInt(h.substring(k*2, k*2+2), 16);
        return xor % 37;
      });
      process.exit(0);
    }
  }
}

// 4. BigInt
if (check(h => Number(BigInt("0x" + h) % 37n))) {
  found("BigInt(hash) % 37", h => Number(BigInt("0x" + h) % 37n));
  process.exit(0);
}

// 5. Hex digits
if (check(h => {
  let s = 0;
  for (const c of h) s += parseInt(c, 16);
  return s % 37;
})) {
  found("Sum of hex digits % 37", h => {
    let sum = 0;
    for (const c of h) sum += parseInt(c, 16);
    return sum % 37;
  });
  process.exit(0);
}

// 6. Three bytes
for (let i = 0; i < 18; i++) {
  for (let j = i+1; j < 19; j++) {
    for (let k = j+1; k < 20; k++) {
      if (check(h => {
        const a = parseInt(h.substr(i*2,2), 16);
        const b = parseInt(h.substr(j*2,2), 16);
        const c = parseInt(h.substr(k*2,2), 16);
        return (a + b + c) % 37;
      })) {
        found(`Byte[${i}]+Byte[${j}]+Byte[${k}] % 37`, h => {
          const b1 = parseInt(h.substring(i*2, i*2+2), 16);
          const b2 = parseInt(h.substring(j*2, j*2+2), 16);
          const b3 = parseInt(h.substring(k*2, k*2+2), 16);
          return (b1 + b2 + b3) % 37;
        });
        process.exit(0);
      }
    }
  }
}

console.log("\n❌ Not found. The algorithm may be non-standard.");
