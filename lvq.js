var dimensi,Class,epoch,alpha,ralpha,radius,weight,data,target;

exports.constructor = function(config){
	this.dimensi = config.dimensi || 13;
	this.Class = config.Class || 2;
	this.epoch = config.epoch || 100;
	this.alpha = config.alpha || 0.25;
	this.ralpha = config.ralpha || 0.977;
	this.radius = config.radius || 0;
	this.weight = init_weight(this.Class,this.dimensi);

}
exports.getDimensi = function(){
	return this.dimensi;
}
exports.getWeight = function(){
	return this.weight;
}


exports.setWeight = function(weight){
	this.weight = weight || init_weight(this.Class,this.dimensi);
}
exports.setData = function(data){
	this.data = data;
}
exports.setTarget=function(target){
	this.target = target;
}

function init_weight(kelas,dimen){
	var bobot = new Array();
	for(i=0;i<kelas;i++){
		var temp = new Array();
		for(j=0;j<dimen;j++){
			temp[j] = Math.floor((Math.random() * 10) + 1) / 10;
		}
		bobot.push(temp);
	}
	return bobot;
}

exports.hello = function() {
  return "Hello";
}