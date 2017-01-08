/**
 * home.js - Default route for GET requests to home page.
 */

exports.index = function(req, res){
    req.
    res.render('index', {title: 'Using EclairJS to Count Words in a File', results: 'test'});
};
