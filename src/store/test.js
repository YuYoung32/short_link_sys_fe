const arr = [1,2,3];

function pushAndPop(arr, val) {
    arr.shift();
    arr.push(val);
}

pushAndPop(arr, 4);

console.log(arr);
