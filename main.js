
//console.log("input stuff");
//const val = "a"
//console.log('Hash value: ', sha1(val));


function sha() {
    var stuff = document.getElementById("input").value;
    document.getElementById("update").innerHTML = "Hash Value >> " + sha1(stuff);
  }
  
  
  
  function sha1(text) {
    let h0 = '01100111010001010010001100000001';
    let h1 = '11101111110011011010101110001001';
    let h2 = '10011000101110101101110011111110';
    let h3 = '00010000001100100101010001110110';
    let h4 = '11000011110100101110000111110000';
  
    const asciiText = text.split('').map((letter) => letter.charCodeAt(0)); 
  
    let binary8bit = asciiText.map((num) => num.toString(2));
  
    for(var i = 0; i < binary8bit.length; i++){
      let temp = binary8bit[i].toString().split('');
       
      while (temp.length < 8) {
        temp.unshift('0');
      }
      binary8bit[i] =  temp.join('');
    }
  
    var x = binary8bit.join('');
    let numString = x + '1';
  
    while (numString.length % 512 !== 448) {
      numString += '0';
    }
  
    const binaryLength = (x.length).toString(2);
    
    var paddedBinLength = binaryLength.toString();
  
    while(paddedBinLength.length<64){
      paddedBinLength = '0' + paddedBinLength;
    }
  
    numString += paddedBinLength; 
    // console.log(numString);
    let temp2 = [];
    let prev = 0;
    for (let i = 512; i <= numString.length; i += 512) {
      temp2.push(numString.slice(prev, i));
      prev = i;
    }
  
    const chunks = temp2;
  
    const words = chunks.map((chunk) => {
      let array2 = [];
      let prev = 0;
      for (let i = 32; i <= chunk.length; i += 32) {
        array2.push(chunk.slice(prev, i));
        prev = i;
      }
      return array2;
    });
  
    const words80 = words.map((array3) => {
  
      for (let i = 16; i <= 79; i++) {
        const q = array3[i - 3];
        const w = array3[i - 8];
        const e = array3[i - 14];
        const r = array3[i - 16];
      //console.log(wordA,wordB,wordC,wordD);
        const xorA = xOR(q, w);
        const xorB = xOR(xorA, e);
        const xorC = xOR(xorB, r);
  
        const leftRotated =  xorC.slice(1) + xorC.slice(0, 1);
        array3.push(leftRotated);
      }
      return array3;
    });
    
    for (let i = 0; i < words80.length; i++) {
      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;
      for (let j = 0; j < 80; j++) {
        let f;
        let k;
        if (j < 20) {
          const BandC = and(b, c);
          const notB = and(not(b), d);
          f = or(BandC, notB);
          k = '01011010100000100111100110011001';
        }
        else if (j < 40) {
          const BxorC = xOR(b, c);
          f = xOR(BxorC, d);
          k = '01101110110110011110101110100001';
        }
        else if (j < 60) {
          const BandC = and(b, c);
          const BandD = and(b, d);
          const CandD = and(c, d);
          const BandCorBandD = or(BandC, BandD);
          f = or(BandCorBandD, CandD);
          k = '10001111000110111011110011011100';
        }
        else {
          const BxorC = xOR(b, c);
          f = xOR(BxorC, d);
          k = '11001010011000101100000111010110';
        }
        const word = words80[i][j];
        const tempA = binaryAddition(leftRotate(a, 5), f);
        const tempB = binaryAddition(tempA, e);
        const tempC = binaryAddition(tempB, k);
        let temp = binaryAddition(tempC, word);
  
        temp = truncate(temp, 32);
        e = d;
        d = c;
        c = leftRotate(b, 30);
        b = a;
        a = temp;
      }
  
      h0 = truncate(binaryAddition(h0, a), 32);
      h1 = truncate(binaryAddition(h1, b), 32);
      h2 = truncate(binaryAddition(h2, c), 32);
      h3 = truncate(binaryAddition(h3, d), 32);
      h4 = truncate(binaryAddition(h4, e), 32);
    }
    return [h0, h1, h2, h3, h4].map((string) => binaryToHex(string)).join('');
  }
  /*
  function addStuff(temp){ //heap error???
    for(let i = temp.length; i >=1; i++){
      temp[i] = temp[i-1];
      //console.log(temp.length);
    }
    temp[0] = '0';
  }
  */
  function xOR(stringA, stringB) {
    let arrayA = stringA.split('').map((letter) => +letter );
    let arrayB = stringB.split('').map((letter) => +letter );
    const xORarray = arrayA.map((num, index) => num ^ arrayB[index]);
    return xORarray.join('').toString();
  }
  
  
  
  function and(stringA, stringB) {
    let arrayA = stringA.split('').map((letter) => +letter );
    let arrayB = stringB.split('').map((letter) => +letter );
    const xORarray = arrayA.map((num, index) => num & arrayB[index]);
    return xORarray.join('').toString();
  }
  
  
  function not(stringA) {
    let array = stringA.split('').map((letter) => letter );
    return array.map(letter => {
      if (letter === '1') return '0';
      return '1';
    }).join('');
  }
  
  function or(stringA, stringB) {
    let arrayA = stringA.split('').map((letter) => +letter );
    let arrayB = stringB.split('').map((letter) => +letter );
    const xORarray = arrayA.map((num, index) => num | arrayB[index]);
    return xORarray.join('').toString();
  }
  
  function binaryAddition(stringA, stringB) {
    const numA = parseInt(stringA, 2);
    const numB = parseInt(stringB, 2);
    let sum = (numA + numB).toString(2);
    const length = stringA.length;
  
    while (sum.length < stringA.length) {
      sum = '0' + sum;
    }
  
    return sum.length === length ? '1' + sum : sum;
  }
  
  function truncate(string, length) {
    while (string.length > length) {
      string = string.slice(1);
    }
  
    return string;
  }
  
  
  function xOR(stringA, stringB) {
    let arrayA = stringA.split('').map((letter) => +letter );
    let arrayB = stringB.split('').map((letter) => +letter );
    const xORarray = arrayA.map((num, index) => num ^ arrayB[index]);
    return xORarray.join('').toString();
  }
  
  
  function leftRotate(string, num) {
    // console.log( string)
    if (num > string.length) {
      throw new Error('cannot shift a number above string length');
    }
    return string.slice(num) + string.slice(0, num);
  }
  
  function binaryToHex(string) {
    if (typeof string !== 'string') string = string.toString();
    let decimal = parseInt(string, 2);
    return decimal.toString(16);
  }
  
  
  