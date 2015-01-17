
/*
 * GET home page.
 */
var crypto = require('crypto');

exports.index = function(req, res){
	var id = crypto.randomBytes(20).toString('hex');
	res.render('index', { id: id, title: 'caster' });
}; 

exports.streamView = function(req, res){
	res.send(req.params.id)
};