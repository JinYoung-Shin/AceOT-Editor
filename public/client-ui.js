var ui = {
	tabnum : 1 ,
	tabNum: [],
	editors : {},
	socket: js.socket,
	
	init: function () {
		var self = this;
		this.init_html();
		this.init_event();
	
		js.socket.on('response', function(obj) {
			for(i=0;i<obj.tabStatus.length;i++) {
				self.createTab(obj.tabStatus[i]);				
			}
			self.tabnum = obj.tabStatus[obj.tabStatus.length - 1] + 1;
			self.tabNum = obj.tabStatus;
		});
		
		js.socket.emit('check', {
			current: self.tabNum
		});
	
		js.socket.on('make', function(obj) {
			self.createOtherTab(obj.change);
			self.tabnum = obj.change + 1;
			self.tabNum.push(obj.change);
		});
	},
	
	init_html: function () {
		$('#tab').append([
			'<div class="container">',
				'<ul class="nav nav-tabs">',
					'<li><a href="#" class="add-tab" >탭 추가</a></li>',
				'</ul>',
				'<div class="tab-content">',
				'</div>',
			'</div>'
		].join(''));
	},
	
	init_editor: function ( id ) {
		return [
				'<div class="tab-pane" id="contact_'+ id +'" style="margin-top: 10px">',
					'<div class="row">',
						'<div class="col-md-9 no-padding" id="editor-ace' + id + '">',
						'</div>',
						'<div class="col-md-3 no-padding">',
								'<form id="login-form' + id + '" class="form-inline btn-toolbar">',
									'<div class="input-group" style="width:275px">',
										'<input id="username' + id + '" class="form-control col-sm-2"autofocus="autofocus" type="text"placeholder="아이디 입력" 													required="required"value="" />',
										'<span class="input-group-btn">', 
											'<button id="join-btn-' + id + '" type="button" class="btn btn-success" style="width:105px">접속</button>',
										'</span>',
									'</div>',
								'</form>',		
							'<div class="yang' + id + '">',
							'</div>',
							'<div class="well" id="userlist-wrapper' + id + '" >',
							'<h4>접속 중인 사용자</h4>',
						'</div>',
					'</div>',
				'</div>',
		].join('');
	},

	get_editor: function(id) {
		return "editor-ace" + id;
	},

	deleteTab: function(id) {
		var tabDel = ($(".tab-delete").get(id));
		var self = this;
		
		$(tabDel).parent().parent().remove();
		$('#contact_'+ self.tabNum[id]).remove();
	},
	
	createTab: function(id) {
		var self = this;
		
		$('.add-tab').closest('li').before('<li><a class="tab-select" tab_id="' + id + '" href="#contact_' + id + '">탭 ' + id + ' <span class ="tab-delete badge" getid="' + id + '" > x </span></a></li>'); 
		$('.tab-content').append( self.init_editor(id) );
		$('.tab-select[tab_id="' + id + '"]').click();

		self.editors[id] = js.setEditor(self.get_editor(id));
		js.setClient(id);
		js.setLogin(id);
	},
	
	createOtherTab: function(id) {
		var self = this;
		
		$('.add-tab').closest('li').before('<li><a class="tab-select" tab_id="' + id + '" href="#contact_' + id + '">탭 ' + id + ' <span class ="tab-delete badge" getid="' + id + '" > x </span></a></li>'); 
		$('.tab-content').append( self.init_editor(id) );
	
		self.editors[id] = js.setEditor(self.get_editor(id));
		js.setClient(id);
		js.setLogin(id);
	},
	
	findIndexByValue: function (arraytosearch, value) {
 
		for (var i = 0; i < arraytosearch.length; i++) {

			if (arraytosearch[i] == value) {
				return i;
			}
		}
		return null;
	},

	init_event: function ()	{
		var self = this;
		var nav_tabs = $(".nav-tabs");
		nav_tabs.on("click", ".tab-select", function(e) {
		 	e.preventDefault();
				
		 	$(this).tab('show');
			$('.ace_content').click();
		});
		
		nav_tabs.on("click", ".tab-delete", function () {
			var id = $(this).attr('getid');
			var array = self.tabNum;
			var index = self.findIndexByValue(array, id);
						
			js.socket.emit('tab', { 
				tabNum: self.tabNum
			});
			
			self.deleteTab(index);
			self.tabNum.splice(index, 1);
		});
		
		$('.add-tab').click(function(e) {
			e.preventDefault();

			var id = self.tabnum++;
			
			self.createTab(id);
			self.tabNum.push(id);
			
			js.socket.emit('tab', { 
				tabNum: self.tabNum
			}).emit('same', {
				change: id
			});
		});
	},
};