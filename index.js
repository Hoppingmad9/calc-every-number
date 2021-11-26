import {writeFile} from 'fs/promises';

function calc_array(arr) {
  for (let index = 0; index < arr.length; index++) {
    if (Array.isArray(arr[index])) {
      arr[index] = calc_array(arr[index]);
    }
  }
  arr = operator_adjustment(arr);
  // console.log('arr',(arr));
  // console.log('arr join',(arr.join(' ')));
  // console.log('eval',eval(arr.join(' ')));
  const result = eval(arr.join(' '));
  // console.log(result);
  return result;
}

function check_sum(arr) {
  const left = arr[0];
  const right = arr[1];
  const leftRes = calc_array(left);
  const rightRes = calc_array(right)
  // console.log(`${left.join('')} = ${leftRes} == ${rightRes} = ${right.join('')}`);
  // return [left_res == right_res, `${left.join('')} = ${leftRes} == ${rightRes} = ${right.join('')}`];
  return [leftRes == rightRes, [leftRes, rightRes]];
}

function operator_adjustment(arr) {
  let newArr = arr;
  let change = false;
  change = replace_caret(newArr);
  if (change) {
    // console.log('repeat');
    // console.log(newArr);
    newArr = operator_adjustment(newArr);
  }
  return newArr;
}

function arr_to_string(arr) {
  if (Array.isArray(arr)) {
    arr = arr.join(' ');
    arr = `(${arr})`;
  }
  return(arr);
}

function replace_caret(arr) {
  if (arr.includes('^')) {
    // console.log('replace caret');
    // console.log(arr);
    const pos = arr.indexOf('^');
    let n1 = arr_to_string(arr[pos-1]);
    let n2 = arr_to_string(arr[pos+1]);
    arr[pos-1] = `Math.pow(${n1}, ${n2})`;
    arr.splice(pos, 2);
    // console.log(arr);
    return true;
  }
  return false;
}

function add_modifiers(arr) {
  // const modifiers = ['[NUM]', 'Math.sqrt([NUM])', '[NUM]!'];



  // for (let i = 0; i < modifiers.length; i++) {
  //   const modifer = modifiers[i];
  //   // left side
  //   const left = arr[0];
  //   for (let j = 0; j < left.length; j++) {
  //     const element = arr_to_string(left[j]);
      
  //   }
    
  // }

  return check_sum(arr);
}


function calc_orders(arr) {
  const startArr = JSON.parse(JSON.stringify(arr));
  arr = split_on_equal(arr);
  // console.log(arr);
  let result;
  let outputArr;
  if (arr[0].length == 5) {
    // 2 orders on left
    const first = JSON.parse(JSON.stringify(arr[0]));
    const left = first.slice(0,3);
    first[0] = left;
    first.splice(1,2);
    outputArr = JSON.parse(JSON.stringify([first, arr[1]]));
    result = add_modifiers([first, arr[1]]);
    if (result[0]) {
      // console.log(result[1]);
      return [outputArr,result[1]];
    }
    const second = JSON.parse(JSON.stringify(arr[0]));
    const right = second.slice(2,5);
    second[2] = right;
    second.splice(3,2);
    outputArr = JSON.parse(JSON.stringify([second, arr[1]]));
    result = add_modifiers([second, arr[1]]);
    if (result[0]) {
      // console.log(result[1]);
      return [outputArr,result[1]];
    }
  } else if (arr[1].length == 5) {
    // 2 orders on right
    const first = JSON.parse(JSON.stringify(arr[1]));
    const left = first.slice(0,3);
    first[0] = left;
    first.splice(1,2);
    // console.log(first);
    outputArr = JSON.parse(JSON.stringify([arr[0], first]));
    result = add_modifiers([arr[0], first]);
    if (result[0]) {
      // console.log(result[1]);
      return [outputArr,result[1]];
    }
    const second = JSON.parse(JSON.stringify(arr[1]));
    const right = second.slice(2,5);
    second[2] = right;
    second.splice(3,2);
    outputArr = JSON.parse(JSON.stringify([arr[0], second]));
    result = add_modifiers([arr[0], second]);
    if (result[0]) {
      // console.log(result[1]);
      return [outputArr,result[1]];
    }
  } else {
    // only 1 order
    outputArr = JSON.parse(JSON.stringify(arr));
    result = add_modifiers(arr);
    if (result[0]) {
      // console.log(result[1]);
      return [outputArr,result[1]];
    }
  }
  return [false, [startArr]];
}

function format_output(arr, csv=false) {
  if (arr[0] === false) {
    return `No result for ${arr[1]}.`;
  } else {
    // console.log(arr);
    const leftRes = arr[1][0];
    const rightRes = arr[1][1];
    const left = arr[0][0];
    const right = arr[0][1];
    for (let index = 0; index < left.length; index++) {
      if (Array.isArray(left[index])) {
        left[index] = left[index].join('');
        left[index] = `(${left[index]})`;
      }    
    }
    for (let index = 0; index < right.length; index++) {
      if (Array.isArray(right[index])) {
        right[index] = right[index].join('');
        right[index] = `(${right[index]})`;
      }    
    }
    // return `${left.join('')} = ${leftRes} == ${rightRes} = ${right.join('')}`;
    if (csv) {
      return [`${left.join('')} = ${right.join('')}`, leftRes];
    } else {
      return `${left.join('')} = ${right.join('')} : ${leftRes} == ${rightRes}`;
    }
  }
}

function split_on_equal(arr) {
  const pos = arr.indexOf('=');
  // console.log(arr);
  // console.log([arr.slice(0, pos), arr.slice(pos+1)]);
  return [arr.slice(0, pos), arr.slice(pos+1)];
}


function calc_modifier(mod, num, str=false) {
  if (mod == '') {
    return num;
  } else if (mod === 'sqrt') {
    if (str) {
      return `(√${num})`;
    } else {
      return Math.sqrt(num);
    }
  } else if (mod === '!') {
    if (str) {
      return `(${num}!)`
    } else {
      return factorialize(num);
    }
  } else {
    return num;
  }
}

function factorialize(num) {
  if (num < 0) 
        return -1;
  else if (num == 0) 
      return 1;
  else {
      return (num * factorialize(num - 1));
  }
}

function arrayReplace(str, findArray, replaceArray) {
  const pieces = [];
  let tempStr = str;
  for (let i = 0; i < findArray.length; i++) {
    const number = findArray[i];
    let endPos = tempStr.indexOf(number);
    endPos += number.length;
    pieces.push(tempStr.slice(0, endPos));
    tempStr = tempStr.slice(endPos);
  }
  for (let i = 0; i < findArray.length; i++) {
    const numberToFind = findArray[i];
    const numberToUse = replaceArray[i];
    pieces[i] = pieces[i].replace(numberToFind, numberToUse);
  }
  return pieces.join('');
}

function add_symbols(i,j,k,l, mods=false) {
  for (let i1 = 0; i1 < symbols.length; i1++) {
    const s1 = symbols[i1];
    for (let i2 = 0; i2 < symbols.length; i2++) {
      const s2 = symbols[i2];
      if (s1 === '=' && s2 === '=') continue;
      for (let i3 = 0; i3 < symbols.length; i3++) {
        const s3 = symbols[i3];
        if ((s1 === '=' || s2 === '=') && s3 === '=') continue;
        if (s1 != '=' && s2 != '=' && s3 != '=') continue;
        if (!mods) {
          const calcArr = [i, s1, j, s2, k, s3, l];
          // const calcArr = ['1','=','0','-','0','-','1'];
          const result = calc_orders(calcArr);
          if (result[0] != false) {
            answered.push([i, j, k, l].concat(format_output(result, true)).join());
            // console.log(format_output(result));
            return 0;
          }
        } else {
          for (let j1 = 0; j1 < modifiers.length; j1++) {
            const m1 = modifiers[j1];
            for (let j2 = 0; j2 < modifiers.length; j2++) {
              const m2 = modifiers[j2];
              for (let j3 = 0; j3 < modifiers.length; j3++) {
                const m3 = modifiers[j3];
                for (let j4 = 0; j4 < modifiers.length; j4++) {
                  const m4 = modifiers[j4];
                  const iVal = calc_modifier(m1, i);
                  const jVal = calc_modifier(m2, j);
                  const kVal = calc_modifier(m3, k);
                  const lVal = calc_modifier(m4, l);
                  const calcArr = [iVal, s1, jVal, s2, kVal, s3, lVal];
                  // console.log(calcArr);
                  const result = calc_orders(calcArr);
                  if (result[0] != false) {
                    const iStr = calc_modifier(m1, i, true);
                    const jStr = calc_modifier(m2, j, true);
                    const kStr = calc_modifier(m3, k, true);
                    const lStr = calc_modifier(m4, l, true);
                    const strRes = format_output(result, true)
                    const regex = /\d+/g;
                    const matches = strRes[0].match(regex);
                    const replaced = arrayReplace(strRes[0], matches, [iStr, jStr, kStr, lStr]);

                    answered.push([i, j, k, l].concat([replaced]).concat(strRes[1]).join());
                    // answered.push([i, j, k, l].concat(format_output(result, true)).join());
                    return 0;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  // try adding modifiers to numbers
  if (!mods) {
    return add_symbols(i,j,k,l, true);
  } else {
    console.log(`No result for ${i}, ${j}, ${k}, ${l}.`);
    notAnswered.push([i, j, k, l].join());
    return 1;
  }
}

const symbols = ['=', '+', '-', '*', '/', '^', '%'];
const modifiers = ['', 'sqrt', '!'];
let failed = 0;
const answered = [];
const notAnswered = [];

// const test = ['1','^','2','+','3','=','4'];
const test = ['3','+','1','^','2','=','4'];
// const test = ['4','=','1','^','2','+','3'];
// const test = ['4','=','3','+','1','^','2'];
// const test2 = [['1','^','2','+','3'], ['4']];
// console.log(test2);
// format_output(calc_orders(test));
// console.log(format_output(calc_orders(test), true));

// add_symbols(1,0,2,4);
end:
for (let i = 1; i < 2; i++) {
  for (let j = 0; j < 10; j++) {
    for (let k = 0; k < 10; k++) {
      for (let l = 0; l < 10; l++) {
        // break end;
        failed += add_symbols(i,j,k,l);
        // if (failed > 0) {
        //   break end;
        // }
      }
    }
  }
}

console.log(`Failed: ${failed}`);
console.log(answered);
console.log(notAnswered);

writeFile('answered.csv', answered.join('\n'));
writeFile('notAnswered.csv', notAnswered.join('\n'));