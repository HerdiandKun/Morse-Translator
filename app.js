let Lvq = require('./lvq.js');

const config = {
		dimensi: 10
	};
Lvq.constructor(config);
bo = [ [ 0.7, 0.3, 0.7, 0.7, 0.7, 1, 0.6, 0.9, 0.9, 0.7 ],
  [ 0.9, 1, 0.8, 0.8, 0.8, 0.5, 0.6, 0.4, 1, 0.6 ] ];
Lvq.setData(bo);
console.log(Lvq.weight);
console.log("DATA==============");
console.log(Lvq.data);
