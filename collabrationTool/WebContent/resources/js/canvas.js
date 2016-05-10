var canvas = document.getElementById('myCanvas'),
ctx = canvas.getContext("2d"),
painting = false,
lastX = 0,
lastY = 0,
lineThickness = 0.5,
imageSrc;
var ws;
var isadmin,room;
isadmin= document.getElementById('formId:isadmin').value;
room= document.getElementById('formId:room').value;
name=document.getElementById('formId:name').value;

//********************************************


//********************************************
function selectSlide(image){    	  

	if(isadmin=="true"){  
		if(image){
			imageSrc=image;
		}
		if(imageSrc){
		var imageObj = new Image();
		imageObj.onload = function() {
			ctx.drawImage(imageObj,5, 5,590,370);
		};
		imageObj.src =imageSrc;
		var JSONimg = {
				'room':room,
			    'type' : 'img',
			    'data' : imageSrc,
			  }
			  ws.send(JSON.stringify(JSONimg));
	}else{
		var JSONimg = {
				'room':room,
			    'type' : 'img',
			    'data' : 'clear',
			  }
			  ws.send(JSON.stringify(JSONimg));
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	}
}


canvas.onmousedown = function(e) {
	var JSONimg = {
			'room':room,
		    'type' : 'mousedown',
		    'data' : e.pageX+","+e.pageY+","+this.offsetLeft+","+this.offsetTop,
		  }
		  ws.send(JSON.stringify(JSONimg));
	painting = true;
	ctx.fillStyle = "#000000";
	lastX = e.pageX - this.offsetLeft;
	lastY = e.pageY - this.offsetTop;
}

canvas.onmouseup = function(e){
	painting = false;
	var JSONimg = {
			'room':room,
		    'type' : 'mouseup',
		    'data' : '',
		  }
		  ws.send(JSON.stringify(JSONimg));	
}

canvas.onmousemove = function(e) {
	if (painting && (isadmin=="true")) {
		var JSONimg = {
				'room':room,
			    'type' : 'mousemove',
			    'data' : e.pageX+","+e.pageY+","+this.offsetLeft+","+this.offsetTop,
			  }
			  ws.send(JSON.stringify(JSONimg));
		
		mouseX = e.pageX - this.offsetLeft;
		mouseY = e.pageY - this.offsetTop;

	       
		var x1 = mouseX,
		x2 = lastX,
		y1 = mouseY,
		y2 = lastY;


		var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
		if (steep){
			var x = x1;
			x1 = y1;
			y1 = x;

			var y = y2;
			y2 = x2;
			x2 = y;
		}
		if (x1 > x2) {
			var x = x1;
			x1 = x2;
			x2 = x;

			var y = y1;
			y1 = y2;
			y2 = y;
		}

		var dx = x2 - x1,
		dy = Math.abs(y2 - y1),
		error = 0,
		de = dy / dx,
		yStep = -1,
		y = y1;

		if (y1 < y2) {
			yStep = 1;
		}

		lineThickness = 5 - Math.sqrt((x2 - x1) *(x2-x1) + (y2 - y1) * (y2-y1))/10;
		if(lineThickness < 1){
			lineThickness = 1;   
		}

		for (var x = x1; x < x2; x++) {
			if (steep) {
				ctx.fillRect(y, x, lineThickness , lineThickness );
			} else {
				ctx.fillRect(x, y, lineThickness , lineThickness );
			}

			error += de;
			if (error >= 0.5) {
				y += yStep;
				error -= 1.0;
			}
		}



		lastX = mouseX;
		lastY = mouseY;

	}
}

function sendchat(){
	var chatmsg= document.getElementById("formId:name").value+":"+
				 document.getElementById("main:chatmsg").value+"\n";
	var JSONimg = {
			'room':room,
		    'type' : 'chat',
		    'data' : chatmsg,
		  }
	ws.send(JSON.stringify(JSONimg));
	document.getElementById("main:chatmsg").value="";
}

function webSocket(){

		if(ws == undefined || ws.readyState == WebSocket.CLOSED){
			ws = new WebSocket("ws://52.38.120.103:80/collabrationTool/echo/"+room);
		}
	
	ws.onmessage = function (evt) 
	{ 
		 var msg = JSON.parse(evt.data);
		
		 if(msg['type']=='chat'){
			  var current = document.getElementById('main:chathistory').value;
			  document.getElementById('main:chathistory').value= current+msg['data'];
				current.scrollTop = current.scrollHeight;
		 }
		 if(isadmin=="false"){
			  if(msg['type']=='img'){
				  if(msg['data']=='clear'){
					  ctx.clearRect(0, 0, canvas.width, canvas.height);
				  }else{
				  var imageObj = new Image();
					imageObj.onload = function() {
						ctx.drawImage(imageObj,5, 5,590,370);
					};
					imageObj.src = msg['data'];
			  }
			  }else if(msg['type']=='mouseup'){
				  painting = false;
			  }else if(msg['type']=='mousedown'){
				  
				  painting = true;
					ctx.fillStyle = "#000000";
					var mouse=msg['data'].split(",");
					lastX = mouse[0] - mouse[2];
					lastY = mouse[1] - mouse[3];
					
			  }else if(msg['type']=='mousemove'){
				  var mouse=msg['data'].split(",");
				  mouseX =  mouse[0] - mouse[2];
					mouseY = mouse[1] - mouse[3];

				       
					var x1 = mouseX,
					x2 = lastX,
					y1 = mouseY,
					y2 = lastY;


					var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
					if (steep){
						var x = x1;
						x1 = y1;
						y1 = x;

						var y = y2;
						y2 = x2;
						x2 = y;
					}
					if (x1 > x2) {
						var x = x1;
						x1 = x2;
						x2 = x;

						var y = y1;
						y1 = y2;
						y2 = y;
					}

					var dx = x2 - x1,
					dy = Math.abs(y2 - y1),
					error = 0,
					de = dy / dx,
					yStep = -1,
					y = y1;

					if (y1 < y2) {
						yStep = 1;
					}

					lineThickness = 5 - Math.sqrt((x2 - x1) *(x2-x1) + (y2 - y1) * (y2-y1))/10;
					if(lineThickness < 1){
						lineThickness = 1;   
					}

					for (var x = x1; x < x2; x++) {
						if (steep) {
							ctx.fillRect(y, x, lineThickness , lineThickness );
						} else {
							ctx.fillRect(x, y, lineThickness , lineThickness );
						}

						error += de;
						if (error >= 0.5) {
							y += yStep;
							error -= 1.0;
						}
					}



					lastX = mouseX;
					lastY = mouseY;
				 
			  }
		}
	}

	ws.onclose = function(event){
		console.log("connection closed"+event);
	}

}

