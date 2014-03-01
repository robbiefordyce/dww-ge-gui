/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('index', {
        title: 'DWW Data Visualisation'
    });
};

exports.vizMain = function(req, res) {
    res.render('viz-main.jade', {
        title: 'DWW Data Visualisation'
    });
};