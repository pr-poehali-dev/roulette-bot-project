// Quick manual verification

const testCases = [
  { hash: "0710f5c3e71e641cf28bd68347feff27d558ac2f", expected: 0 },
  { hash: "0a4d8ded4463e1bef68993784d221c33eeb9bf5f", expected: 29 },
  { hash: "ef4250cc5ab21a0d0979f49752c6b40fe07477ef", expected: 6 },
  { hash: "ca3a750c8b8a19ea91393a4a05fb8ce4211aefbe", expected: 15 },
  { hash: "23e0c801f995d6aeda8e0bf0d56634b2d6b3df19", expected: 6 },
];

console.log("Quick Test: Full hash % 37\n");
testCases.forEach((tc, i) => {
  const result = Number(BigInt("0x" + tc.hash) % BigInt(37));
  const match = result === tc.expected ? "✓" : "✗";
  console.log(`${i+1}. Expected: ${tc.expected}, Got: ${result} ${match}`);
});

console.log("\n\nQuick Test: Last 2 chars % 37\n");
testCases.forEach((tc, i) => {
  const result = parseInt(tc.hash.substring(38), 16) % 37;
  const match = result === tc.expected ? "✓" : "✗";
  console.log(`${i+1}. Last 2: "${tc.hash.substring(38)}" Expected: ${tc.expected}, Got: ${result} ${match}`);
});

console.log("\n\nQuick Test: Last 1 char % 37\n");
testCases.forEach((tc, i) => {
  const result = parseInt(tc.hash.substring(39), 16) % 37;
  const match = result === tc.expected ? "✓" : "✗";
  console.log(`${i+1}. Last 1: "${tc.hash.substring(39)}" = ${parseInt(tc.hash.substring(39), 16)}, Expected: ${tc.expected}, Got: ${result} ${match}`);
});

console.log("\n\nQuick Test: First 2 chars % 37\n");
testCases.forEach((tc, i) => {
  const result = parseInt(tc.hash.substring(0, 2), 16) % 37;
  const match = result === tc.expected ? "✓" : "✗";
  console.log(`${i+1}. First 2: "${tc.hash.substring(0, 2)}" = ${parseInt(tc.hash.substring(0, 2), 16)}, Expected: ${tc.expected}, Got: ${result} ${match}`);
});

console.log("\n\nQuick Test: Last byte (positions 38-39) % 37\n");
testCases.forEach((tc, i) => {
  const lastByte = parseInt(tc.hash.substring(38, 40), 16);
  const result = lastByte % 37;
  const match = result === tc.expected ? "✓" : "✗";
  console.log(`${i+1}. Last byte: "${tc.hash.substring(38, 40)}" = ${lastByte}, % 37 = ${result}, Expected: ${tc.expected} ${match}`);
});

console.log("\n\nQuick Test: First byte (positions 0-1) % 37\n");
testCases.forEach((tc, i) => {
  const firstByte = parseInt(tc.hash.substring(0, 2), 16);
  const result = firstByte % 37;
  const match = result === tc.expected ? "✓" : "✗";
  console.log(`${i+1}. First byte: "${tc.hash.substring(0, 2)}" = ${firstByte}, % 37 = ${result}, Expected: ${tc.expected} ${match}`);
});

console.log("\n\nDetailed byte analysis:");
testCases.forEach((tc, idx) => {
  console.log(`\nCase ${idx + 1}: ${tc.hash} → Expected: ${tc.expected}`);
  
  // Show all 20 bytes
  const bytes = [];
  for (let i = 0; i < 40; i += 2) {
    bytes.push(parseInt(tc.hash.substring(i, i + 2), 16));
  }
  
  console.log("Bytes:", bytes.map((b, i) => `[${i}]:${b}`).join(" "));
  console.log("Bytes % 37:", bytes.map((b, i) => {
    const mod = b % 37;
    return `[${i}]:${mod}${mod === tc.expected ? "★" : ""}`;
  }).join(" "));
});
