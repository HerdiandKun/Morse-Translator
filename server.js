//Depedency MFCC
const fft = require('fft-js'); // is dependency 
const {framer, mfcc} = require('sound-parameters-extractor');

//Depedency readWAV
let fs = require('fs');
let wav = require('node-wav'); 
let Lvq = require('./lvq.js');

//Depedency Exspress 
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;


//Depedency jsonfile
var jsonfile = require('jsonfile')

//dependency for body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true,  parameterLimit: 10000000 }));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8012');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//fungsi mfcc
function mfcc_function(signal, sRate){
	const config = {
	  fftSize: 1,
	  bankCount: 24,
	  lowFrequency: 1,
	  highFrequency: sRate/2, // samplerate/2 here 
	  sampleRate: sRate
	};
	const windowSize = config.fftSize * 2;
	const overlap = '39%';
	const mfccSize = 13;

	//console.log(signal);
	//console.log(sRate);
	//const signal = new Array(1024).fill(0).map((val, index) => index);
	const framedSignal = framer(signal, windowSize, overlap);

	//mfccSize is optionnal default 12 
	const mfccMatrix = mfcc.construct(config, mfccSize);
	const mfccSignal = framedSignal.map(window => {
	const phasors = fft.fft(window);
	return mfccMatrix(fft.util.fftMag(phasors));
	});
 
	//console.log(mfccSignal);
	
	var mfccRataan = new Array();
	for(i=0;i<13;i++){
		var sum = 0;
		for(j=0;j<mfccSignal.length;j++){
			sum += mfccSignal[j][i];
		}
		mfccRataan.push(sum/mfccSignal.length);
	}
	
	return mfccRataan;
	//return mfccSignal;
	//return signal;
}

//fungsi baca wav
function read_wav(file){
	let buffer = fs.readFileSync(file);
	let result = wav.decode(buffer);
	//console.log(result.sampleRate);
	//console.log(result.channelData[0][0]); // array of Float32Arrays
	wav.encode(result.channelData, { sampleRate: result.sampleRate, float: true, bitDepth: 32 });
	var data = new Array();
		data['samplingRate'] = result.sampleRate;
		data['channelData'] = result.channelData[0];
		
	return data;
}

app.post('/api/nlp', function(req, res) {
  /*var user_id = req.param('id');
  var token = req.param('token');
  var geo = req.param('geo');  */
  var data = [];
  data = req.body.buffer_data;
	var arr = Object.values(data);
  console.log("Berhasil");
  console.log(Object.keys(data).length);
  return "Berhasil";
//console.log(samRate);
});

app.get('/api/make_training_data', function(req,res){
	var jumlah_data = 10;
	var data_awal = 1;
	var kelas = 2;
	var data = [];
	var array_kelas = [];
	for (iter=1;iter<=kelas; iter++){
			var array_data = [];
			for(jter=data_awal; jter < data_awal + jumlah_data; jter++ ){
				var wav_data = read_wav('Dataset/latih_2/C'+iter+'/'+jter+'.wav');
				var signal = Array.prototype.slice.call(wav_data['channelData']);
				var samRate = wav_data['samplingRate'];
				var nfcc = mfcc_function(signal,samRate);
				console.log('Dataset/C'+iter+'/'+jter+'.wav');
				console.log('Data Kelas C' + iter +' dan file ='+jter);
				array_data.push(nfcc);
			}
		array_kelas.push(array_data);	
		//res.send("Data Latih kelas C"+iter+" selesai dibuat");
	}
	//data.push(array_kelas);
	console.log("END LOOP!!!!!!!!!!!!!!!!!!!!!!!!!!");
	var file = './data_latih.json'
	//var obj = {name: 'JP'}
	console.log(array_kelas)
	//console.log(data)
	var obj = toObject(array_kelas);
	jsonfile.writeFile(file, obj, function (err) {
	  console.error(err)
	})
	res.send("Data Latih selesai dibuat");
});

app.get('/api/make_testing_data', function(req,res){
	var jumlah_data = 6;
	var data_awal = 1;
	var kelas = 2;
	var data = new Array();
	var array_kelas = new Array();
	for (iter=1;iter<=kelas; iter++){
			var array_data = new Array();
			for(jter=data_awal; jter < data_awal + jumlah_data; jter++ ){
				var wav_data = read_wav('Dataset/uji_2/C'+iter+'/'+jter+'.wav');
				var signal = Array.prototype.slice.call(wav_data['channelData']);
				var samRate = wav_data['samplingRate'];
				var nfcc = mfcc_function(signal,samRate);
				console.log('Data Uji Kelas C' + iter +' dan file ='+ jter);
				array_data.push(nfcc);
			}
		array_kelas.push(array_data);	
		//res.send("Data Latih kelas C"+iter+" selesai dibuat");
	}
	//data.push(array_kelas);
	console.log("END LOOP!!!!!!!!!!!!!!!!!!!!!!!!!!");
	var file = './data_uji.json'
	//var obj = {name: 'JP'}
	console.log(array_kelas)
	//console.log(data)
	var obj = toObject(array_kelas);
	jsonfile.writeFile(file, obj, function (err) {
	  console.error(err)
	})
	res.send("Data Uji selesai dibuat");
});

app.get('/api/bobot', function(req,res){
	var jumlah_data = 1;
	var kelas = 2;
	var array_data = new Array();
	for (iter=1;iter<=kelas;iter++){
				
				var wav_data = read_wav('Dataset/latih_2/weight/'+iter+'.wav');
				var signal = Array.prototype.slice.call(wav_data['channelData']);
				var samRate = wav_data['samplingRate'];
				var nfcc = mfcc_function(signal,samRate);
				console.log('weight/'+iter+'.wav');
				console.log('Data Bobot ' + iter);
				array_data.push(nfcc);
				
	}
	console.log('End Loop ');
	var file = './bobot.json';
	var obj = toObject(array_data);
	jsonfile.writeFile(file, obj, function (err) {
	  console.error(err)
	})
	console.log(array_data);
	res.send("Data Bobot selesai aja dulu dibuat");
});

app.get('/api/train_data_lvq',function(req,res){
	var jumlah_data = 10;
	var kelas = 2;
	var bobot = new Array();
	var target = new Array();
	file = 'data_latih.json'
	file_bobot = 'bobot.json'
	k=0;
	var data = new Array();
	for(i=1;i<=kelas;i++){
		for(j=0;j<jumlah_data;j++){
			data.push(jsonfile.readFileSync(file)['Kelas ke '+i][j]);
			k++;
			target.push(i-1);
		}
		bobot.push(jsonfile.readFileSync(file_bobot)['Kelas ke '+i]);
	}
	const config = {
		dimensi: 13,
		epoch : 200,
		alpha : 0.3
	};
	Lvq.constructor(config);
		console.log(Lvq.alpha);
		Lvq.setTarget(target);
		Lvq.setData(data);
		Lvq.setWeight(bobot);
		//console.log(Lvq.weight);
		console.log("BOBOT BARU	==============");
		//console.log(Lvq.data);
		Lvq.main();
		var file = './bobot_baru.json';
		var obj = toObject(Lvq.weight);
		jsonfile.writeFile(file, obj, function (err) {
		  console.error(err)
		})
		console.log(Lvq.alpha);
});
app.get('/api/test_data_lvq',function(req,res){
	const config = {
		dimensi: 13
	};
	Lvq.constructor(config);
	var jumlah_data = 6;
	var kelas = 2;
	var bobot = new Array();
	file = 'data_uji.json'
	file_bobot = 'bobot_baru.json'
	k=0;
	var data = new Array();
	for(i=1;i<=kelas;i++){
		for(j=0;j<jumlah_data;j++){
			data.push(jsonfile.readFileSync(file)['Kelas ke '+i][j]);
			k++;
		}
		bobot.push(jsonfile.readFileSync(file_bobot)['Kelas ke '+i]);
	}
	
	Lvq.setDataTest(data);
	Lvq.setWeight(bobot);
	Lvq.test();
});

function toObject(arr) {
	var rv = {};
	for (var i = 0; i < arr.length; ++i){
		var klas = i+1;
		if (arr[i] !== undefined) rv["Kelas ke "+ klas] = arr[i];
	}
	return rv;
}

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);