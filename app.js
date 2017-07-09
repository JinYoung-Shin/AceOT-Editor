var ot = require('ot');

var socketIO = require('socket.io')(); 

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var port = process.env.PORT || 3000;

app.configure(function() {
	app.set('port', port);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var appServer = http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

var io = socketIO.listen(appServer);

var ot_servers = {};
var tabStatus = [];
var namelist = [];
var count = 1;

io.sockets.on('connection', function (socket) {
  
	socket.on('check', function(data) { 
	
		if(tabStatus.length !== 0) {
			socket.emit('response', {
				tabStatus: tabStatus
			});
		}
		
	});
	
	socket.on('same', function(obj) {
		socket.broadcast.emit('make', {
			change: obj.change
		});
	});
	
	socket.on('tab', function(obj) {
		tabStatus = obj.tabNum;
	});
	
    socket.on('login', function (obj) {
    	if (typeof obj.name !== 'string') {
			console.error('obj.name is not a string');
			return;
		}
		
		namelist[count] = obj.name;
		count = count + 1;
		
		for(i=0; i<namelist.length-1; i++) {
			if(obj.name == namelist[i]) {
				console.error('User tried to register with used ID');
				socket.emit('login-fail',  {
					id: obj.id
				});
				
				return;
			}
		}
		
		if (ot_servers[obj.id]) {
			var server = ot_servers[obj.id];
		
			socket.mayEdit = true;
			server.setName(socket, obj.name);
			server.addClient(socket);
		} 
		else {
			var socketIOServer = new ot.EditorSocketIOServer(obj.str || "", [], obj.id, function (socket, cb) {
				cb(!!socket.mayEdit);
			});

			socket.mayEdit = true;
			socketIOServer.setName(socket, obj.name);
			socketIOServer.addClient(socket);
		
			ot_servers[obj.id] = socketIOServer;	
		}
		socket.emit('logged_in', {
			id: obj.id
		}); 
	});
});