var http = require('http'),
	fs = require('fs'),
	checksum = require('checksum');

const FILEDIR = '/root/transfers/';

var server = http.createServer(function(req, res) {
	var filename = req.headers.filename,
		hash = req.headers.hash,
		path = FILEDIR+filename,
		stream = fs.createWriteStream(path);

	req.on('data', function (chunk) {
		stream.write(chunk);
    });
  	req.on('end', function () {
		stream.end();
		checksum.file(path, {algorithm:'md5'}, function(err, sum){
			if (sum == hash){
				console.log('HDFS PUT FILE');
				res.writeHead(200);
			}else{
				res.writeHead(400);
			}
		});	
  	})
    res.end();
});
server.listen(8080);
