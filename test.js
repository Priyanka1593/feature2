var finalResult = {};
var myData = [
['a', 1],
['b', 2],
['c', 10],
['d', 4]
];

for(var i=0; i<myData.length;i++)
{
    var childArr = myData[i];
 finalResult[childArr[0]] =childArr[1];

}

console.log(finalResult);