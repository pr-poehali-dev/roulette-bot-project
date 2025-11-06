const testCases = [
  { hash: "0710f5c3e71e641cf28bd68347feff27d558ac2f", expected: 0 },
  { hash: "0a4d8ded4463e1bef68993784d221c33eeb9bf5f", expected: 29 },
  { hash: "ef4250cc5ab21a0d0979f49752c6b40fe07477ef", expected: 6 },
  { hash: "ca3a750c8b8a19ea91393a4a05fb8ce4211aefbe", expected: 15 },
  { hash: "23e0c801f995d6aeda8e0bf0d56634b2d6b3df19", expected: 6 },
];

let testsRun = 0;
const test = (fn) => {
  testsRun++;
  return testCases.every(tc => fn(tc.hash) === tc.expected);
};

console.log("Testing all algorithms...\n");

// Test all substring positions
for (let start = 0; start < 40; start++) {
  for (let length = 1; length <= 40 - start; length++) {
    if (test(h => parseInt(h.substring(start, start + length), 16) % 37)) {
      console.log(`✅ FOUND: hash.substring(${start}, ${start + length}) % 37`);
      testCases.forEach(tc => console.log(`  ${tc.hash} → ${parseInt(tc.hash.substring(start, start + length), 16) % 37}`));
      process.exit(0);
    }
  }
}

// Test byte sums
for (let start = 0; start < 20; start++) {
  for (let end = start + 1; end <= 20; end++) {
    if (test(h => {
      let sum = 0;
      for (let i = start; i < end; i++) sum += parseInt(h.substring(i * 2, i * 2 + 2), 16);
      return sum % 37;
    })) {
      console.log(`✅ FOUND: Sum of bytes[${start}:${end}] % 37`);
      process.exit(0);
    }
  }
}

// Test two-byte operations
for (let i = 0; i < 20; i++) {
  for (let j = i + 1; j < 20; j++) {
    if (test(h => {
      const b1 = parseInt(h.substring(i * 2, i * 2 + 2), 16);
      const b2 = parseInt(h.substring(j * 2, j * 2 + 2), 16);
      return (b1 + b2) % 37;
    })) {
      console.log(`✅ FOUND: Byte[${i}] + Byte[${j}] % 37`);
      testCases.forEach(tc => {
        const b1 = parseInt(tc.hash.substring(i*2, i*2+2), 16);
        const b2 = parseInt(tc.hash.substring(j*2, j*2+2), 16);
        console.log(`  ${tc.hash} → ${b1}+${b2}=${(b1+b2)%37}`);
      });
      process.exit(0);
    }
  }
}

console.log(`❌ NOT FOUND after ${testsRun} tests`);
