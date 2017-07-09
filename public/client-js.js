var js = {
	socket: null,
	a: 1,
	editors: {

	},
	
	templete : 
	{
	},
	
	init: function() {
		var self = this;
		
		this.socket = io.connect('/');
		
		var emit = this.socket.emit;
		var queue = [];
		this.socket.emit = function () {
		  queue.push(arguments);
		  return self.socket;
		};
		setInterval(function () {
		  if (queue.length) {
			emit.apply(self.socket, queue.shift());
		  }
		}, 100);
	},
	
	get_editor: function(id) {
		return "editor-ace" + id;
	},
	
	setEditor: function( eid ) {
		
		var ae = ace.edit(eid);
		ae.$blockScrolling = Infinity; 
		ae.setTheme("ace/theme/xcode");
		ae.setReadOnly(true);
		
		var session = ae.getSession();
		session.setUseWrapMode(true);  
		session.setUseWorker(false); 
		session.setMode("ace/mode/javascript");
		
		this.editors[eid] = ae;	// aceInstance 잡았
		return ae;
	},
	
	setLogin: function( eid ) {

		var self = this;
		var loginForm = $("#login-form" + eid);
		var join_btn = $("#join-btn-" + eid);
	
		$(join_btn).click( function(e) {

			var count = 1;
			var username = $('#username' + eid).val();
			
			self.socket.emit('login', {
				name: username,
				id: eid,
				str: self.templete.base_str,

			}).on('logged_in', function(obj) {
								
				self.setEditor(self.get_editor(obj.id)).setOption('readOnly', false);
				$("#login-form" + obj.id).remove();
				$('.alert').remove();
				
			}).on('login-fail', function(obj) {

				if(count===1) {	
					if ($(".alert").is(":visible")) {
						return;
					}
					else {
						$(".yang" + obj.id).after([
							'<div class="alert alert-danger">',
								'<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> 중복된 아이디 입니다. 다른 아이로 로그인을 시도해주세요.',
							'</div>'
						].join(''));
						$(".alert").delay(4000).fadeOut(1000, function() {
							$(this).remove();
						});
						count++;
					}
				}
			});
		});
	},
	
	setClient: function(eid) {	
		var self = this;
		var EditorClient = ot.EditorClient;
		var SocketIOAdapter = ot.SocketIOAdapter;
		var ACEAdapter = ot.ACEAdapter;
		var disabledRegex = /(^|\s+)disabled($|\s+)/;

		var editor = this.setEditor(this.get_editor(eid));
		
		function enable (el) {
			$(el).removeClass("disabled");
		}

		
		function disable (el) {
			if (!disabledRegex.test($(el))) { 
				$(el).addClass(' disabled');
			}
		}
			
		function init (str, revision, clients, serverAdapter) {
			editor.setValue(str, -1);

			cmClient = new EditorClient(revision, clients, serverAdapter, new ACEAdapter(editor));

			$('#userlist-wrapper'+eid).append(cmClient.clientListEl);
			editor.on('change', function () {
				if (!cmClient ) { 
					return;
				}
			});
		}
		var cmClient;
		this.socket.on('doc', function (obj) {
			if (obj.id === eid) {
				init(obj.str, obj.revision, obj.clients, new SocketIOAdapter(self.socket, obj.id));
			}
		});
	}
};
