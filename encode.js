'use strict';

const inHex = process.argv[2];
if (typeof inHex == 'undefined') {
  const path = require('path');
  const fileName = path.basename(module.filename);
  console.log("Usage:\nnode "+fileName+" HEX_TO_ENCODE");
  process.exit(1);
}

const emoji = require('./emoji_codes');
let inBuff = Buffer.from(inHex, 'hex');

// Ensure Buffer length is divisible by five
while (inBuff.length % 5 != 0) {
  inBuff = Buffer.concat([Buffer.from([0]), inBuff], inBuff.length+1);
}
console.log(inBuff.toString('hex'));

// Take 5-byte chunks out of the buffer and parse
let decIndexes = [];
for (let i = inBuff.length-5; i >= 0; i -= 5) {
  let chunk = inBuff.slice(i, i+5);
  let binaryStr = '';
  for (let j = 0; j < chunk.length; j++) {
    binaryStr += ("00000000" + chunk[j].toString(2)).substr(-8,8);
  }

  // Split binary string into four pieces of 10-bits each
  let tmpDec = [];
  for (let j = 0; j < binaryStr.length; j += 10) {
    tmpDec.push(parseInt(binaryStr.substr(j, 10), 2));
  }
  decIndexes = tmpDec.concat(decIndexes);
  console.log(chunk, binaryStr);
}

// Trim out the leading zeroes
while (decIndexes.length > 1 && decIndexes[0] == 0) {
  decIndexes.shift();
}

// Assemble emoji string
let emojiStr = decIndexes.map(index => {
  return String.fromCodePoint(emoji.list[index]);
}).join('');
let emojiBuff = Buffer.from(emojiStr, 'utf8');
console.log(emojiBuff.toString('utf8'));
console.log(emojiBuff.toString('hex'));
