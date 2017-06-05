var dimensi, Class, epoch, alpha, ralpha, radius, weight;
var data = [];
var target = [];

exports.constructor = function(config) {
    this.dimensi = config.dimensi || 13;
    this.Class = config.Class || 2;
    this.epoch = config.epoch || 100;
    this.alpha = config.alpha || 0.25;
    this.ralpha = config.ralpha || 0.977;
    this.radius = config.radius || 0;
    this.weight = init_weight(this.Class, this.dimensi);

}
exports.getDimensi = function() {
    return this.dimensi;
}
exports.getWeight = function() {
    return this.weight;
}


exports.setWeight = function(weight) {
    this.weight = weight || init_weight(this.Class, this.dimensi);
}

exports.setData = function(data) {
    this.data = data;
}
exports.setTarget = function(target) {
    this.target = target;
}

function init_weight(kelas, dimen) {
    var bobot = [];
    for (i = 0; i < kelas; i++) {
        var temp = [];
        for (j = 0; j < dimen; j++) {
            temp[j] = Math.floor((Math.random() * 10) + 1) / 10;
        }
        bobot.push(temp);
    }
    return bobot;
}

function calc(cl, dt, dimen, bobot) {
    var d = [];
    for (i = 0; i < cl; i++) {
        d[i] = 0;
        for (j = 0; j < dimen; j++) {
            d[i] += (bobot[i][j] - (dt[j])) * (bobot[i][j] - (dt[j]));
        }
    }

    // for (i = 0; i < cl; i++) {
    //     console.log(d[i]);
    // }

    console.log("Data Minimum" + d.indexOf(Math.min.apply(null, d)));
    var min_index = d.indexOf(Math.min.apply(null, d));
    return min_index;
    // echo 'Data Minimum : '.min( d).
    // '<br/>';
    //  key = array_keys( d, min( d))[0];
    // echo 'Update : '.substr( key, 1);
    //return substr(key, 1);
}

function update(kelas, dimensi, d, bobot, dt, alpha, radius, target) {
    console.log("Test" + target);

    if (d == target) {
        console.log("Target SAMA");
        for (; radius >= 0; radius--) {
            for (j = 0; j < dimensi; j++) {
                if (radius != 0) {
                    if (d != 0) {
                        bobot[d - radius][j] = bobot[d - radius][j] + (alpha * (dt[j] + bobot[d - radius][j]));
                    }
                    if (d != kelas - 1) {
                        bobot[d + radius][j] = bobot[d + radius][j] + (alpha * (dt[j] + bobot[d + radius][j]));
                    }
                } else {
                    bobot[d][j] = bobot[d][j] + (alpha * (dt[j] - bobot[d][j]));
                }
            }
        }
    } else {
        console.log("Target TIDAK SAMA");
        for (; radius >= 0; radius--) {
            for (j = 0; j < dimensi; j++) {
                if (radius != 0) {
                    if (d != 0) {
                        bobot[d - radius][j] = bobot[d - radius][j] + (alpha * (dt[j] - bobot[d - radius][j]));
                    }
                    if (d != kelas - 1) {
                        bobot[d + radius][j] = bobot[d + radius][j] + (alpha * (dt[j] - bobot[d + radius][j]));
                    }
                } else {
                    bobot[d][j] = bobot[d][j] + (alpha * (dt[j] - bobot[d][j]));
                }
            }
        }
    }
    console.log("BOBOT BARU");

    for (i = 0; i < kelas; i++) {
        for (j = 0; j < dimensi; j++) {
            console.log("bobot  i  j =" + bobot[i][j]);
        }
    }
    return bobot;
}

exports.main = function() {
    for (ep = 1; ep <= this.epoch; ep++) {
        for (k = 0; k < this.data.length;) {
            console.log(k);
            var selected_class = calc(this.Class, this.data[k], this.dimensi, this.weight);
            update(this.Class, this.dimensi, selected_class, this.weight, this.data[k], this.alpha, this.radius, this.target[k]);

            k++;
        }
        this.alpha = this.alpha * this.ralpha;
    }
    console.log(this.Class);
}