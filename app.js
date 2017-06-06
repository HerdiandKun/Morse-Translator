let Lvq = require('./lvq.js');

const config = {
    dimensi: 2,
	Class:3
};
Lvq.constructor(config);
bo = [ [7, 8],
       [8, 8],
       [9, 8],
       [8, 7],
       [8, 9],
       [1, 3],
       [3, 1],
       [5, 3],
       [3, 5],
       [2, 13],
       [3, 13],
       [4, 13],
       [3, 12],
       [3, 14]
];
target = [ 0,0,0,0,0,1,1,1,1,2,2,2,2,2];
tes = [ [7, 8],
       [8, 8],
	   [3,14]
	  ]
Lvq.setTarget(target);
Lvq.setData(bo);
console.log(Lvq.weight);
console.log("DATA==============");
console.log(Lvq.data);
Lvq.main();
console.log(Lvq.weight);
Lvq.setDataTest(tes);
Lvq.test();