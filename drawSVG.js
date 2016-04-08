//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
function drawSVG() {};
//----------------------------------------------------------------------------------------
var NS="http://www.w3.org/2000/svg";
//----------------------------------------------------------------------------------------
// desenha um arco
drawSVG.Arc = function(svg,style,axes,arco) {
	var escalaX = calc.EscalaX(axes);
	var x0 = calc.X1(axes,arco.x0);
	var y0 = calc.Y1(axes,arco.y0);
	var stroke = [0, arco.raio*escalaX*(2*Math.PI-arco.alphaMax), arco.raio*escalaX*7].join(" ");
		
	var elem = document.createElementNS(NS,"circle");
	elem.setAttribute("cx",x0);
	elem.setAttribute("cy",y0);
	elem.setAttribute("r",arco.raio*escalaX);
	//elem.setAttribute("fill","none");
	
	elem.style.strokeDasharray = stroke;
	elem.style.strokeWidth = "3";
	elem.style.stroke = "black";
	addProperties(elem.style, style);
	svg.appendChild(elem);
	
	return elem;
}
//----------------------------------------------------------------------------------------
drawSVG.ArcDim = function(svg,style,axes,arco) {
	var g = document.createElementNS(NS,"g");
	svg.appendChild(g);
	
	var a = 10;
	var b = calc.X1(axes, arco.raio)-calc.X0(axes);
	var alfa = Math.acos(1-0.5*a*a/(b*b));
		
	var escalaX = calc.EscalaX(axes);

	var x0 = calc.X1(axes,arco.x0);
	var y0 = calc.Y1(axes,arco.y0);
	
	var arrowLength = a;

	if (b*(arco.alphaMax-arco.alphaMin) < 3*a){
		alfa = -alfa;
	}

	// primeira ponta
	var x1 = calc.X1(axes, arco.x0 + arco.raio*Math.cos(arco.alphaMin+alfa));
	var y1 = calc.Y1(axes, arco.y0 + arco.raio*Math.sin(arco.alphaMin+alfa));
	var x2 = calc.X1(axes, arco.x0 + arco.raio*Math.cos(arco.alphaMin));
	var y2 = calc.Y1(axes, arco.y0 + arco.raio*Math.sin(arco.alphaMin));
	drawSVG.ArrowHead(svg,style,arrowLength,x1,y1,x2,y2);

	// segunda ponta
	var x1 = calc.X1(axes, arco.x0 + arco.raio*Math.cos(arco.alphaMax-alfa));
	var y1 = calc.Y1(axes, arco.y0 + arco.raio*Math.sin(arco.alphaMax-alfa));
	var x2 = calc.X1(axes, arco.x0 + arco.raio*Math.cos(arco.alphaMax));
	var y2 = calc.Y1(axes, arco.y0 + arco.raio*Math.sin(arco.alphaMax));
	drawSVG.ArrowHead(svg,style,arrowLength,x1,y1,x2,y2);
	
	// arco
	var style = addProperties({}, style, {fill: "none"});
	var elem = drawSVG.Arc(g,style,axes,arco);
	
	return elem;
}
//----------------------------------------------------------------------------------------
// desenha uma seta
drawSVG.Arrow = function(svg,style,axes,pos) {
	var x1 = calc.PxX(axes,pos.x0);
	var y1 = calc.PxY(axes,pos.y0);
	var x2 = calc.PxX(axes,pos.x1);
	var y2 = calc.PxY(axes,pos.y1);
	
	//var elem = document.createElementNS(NS,"path");
	//addProperties(elem.style, style);
	//elem.setAttribute("d",["M", x1, y1, "L", x2, y2].join(" "));
	//svg.appendChild(elem);
	
	var arrowLength = Math.sqrt(Math.pow(y2-y1,2)+Math.pow(x2-x1,2));
	if (arrowLength < 20) {
		arrowLength = arrowLength/2;
	}
	else {
		arrowLength = 10;
	}

	var elem = drawSVG.ArrowHead(svg,style,arrowLength,x1,y1,x2,y2);
	
	return elem;
}
//----------------------------------------------------------------------------------------
// desenha a ponta da seta
drawSVG.ArrowHead = function(svg,style,arrowLength,x1,y1,x2,y2){
	var angle = Math.atan2(y2-y1,x2-x1);
	var w = (style.strokeWidth||2)/20;
	arrowLength = Math.min(arrowLength+50*w,     Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))        );
	var x3 = x2 - (arrowLength)*Math.cos(angle+0.2);
	var y3 = y2 - (arrowLength)*Math.sin(angle+0.2);
	var x4 = x2 - (arrowLength)*Math.cos(angle-0.2);
	var y4 = y2 - (arrowLength)*Math.sin(angle-0.2);
	var x5 = (x4+x3)/2;
	var y5 = (y4+y3)/2;

	var g = document.createElementNS(NS,"g");
	svg.appendChild(g);
	
	//corpo do vetor
	var elem = document.createElementNS(NS,"line");
	elem.setAttribute("x1",x1);
	elem.setAttribute("y1",y1);
	elem.setAttribute("x2",x5);
	elem.setAttribute("y2",y5);
	addProperties(elem.style,style);
	g.appendChild(elem);
	
	//arrow head
	var elem = document.createElementNS(NS,"path");
	g.appendChild(elem);
	addProperties(elem.style, style);
	//elem.setAttribute("d",["M",x1,y1,"L",x2,y2, x5,y5, x3,y3, x2,y2, x4,y4, x2,y2, x5,y5, x2,y2].join(" "));
	//elem.setAttribute("d",["M",x1,y1,"L",x2,y2, x5,y5, x3,y3, x2,y2, x4,y4, x3,y3, x5,y5].join(" "));
	elem.setAttribute("d",["M",x5,y5,"L", x3,y3, x2,y2, x4,y4, x5,y5, "Z"].join(" "));
	elem.style.strokeWidth = 1;
	g.appendChild(elem);
	
	//elem.setAttribute("d",["M",x1,y1,"L",x2,y2, x5,y5, x3,y3, x2,y2, x4,y4, x3,y3, x5,y5].join(" "));

	return g;
}
//----------------------------------------------------------------------------------------
// desenhar eixos
drawSVG.Axes = function(svg, style, axes) {
	var g = document.createElementNS(NS,"g");
	svg.appendChild(g);
	
	var x0 = axes.left+(-axes.width*axes.xmin/(axes.xmax-axes.xmin));
	var y0 = axes.top+(axes.height*axes.ymax/(axes.ymax-axes.ymin));

	//style.fill = "none";
	drawSVG.Arrow(g,style,axes,{x0: axes.xmin, y0: 0, x1: axes.xmax, y1: 0});
	drawSVG.Arrow(g,style,axes,{x0: 0, y0: axes.ymin, x1: 0, y1: axes.ymax});
	
	//axes labels
	if (typeof(axes.ylabel) !== "undefined"){
		var style = {fontSize: "14px", fontFamily: "Arial", textAnchor: "start"};
		drawSVG.Text(g, style, axes.ylabel, x0+6, axes.top+15);
	}
	
	//calc.Y0(axes);
	var yLabelAbaixo = calc.Y1(axes,axes.ymin)-calc.Y0(axes) > 20;
	if (typeof(axes.xlabel) !== "undefined"){
		var style = {fontSize: "14px", fontFamily: "Arial", textAnchor: "end"};
		//drawSVG.Text(g, style, axes.xlabel, axes.left+axes.width-2, (y0+10<axes.top+axes.height)?y0+20:y0-10);
		drawSVG.Text(g, style, axes.xlabel, axes.left+axes.width-2, (yLabelAbaixo)?y0+20:y0-10);
	}
	
	//draw grid rectangular
	if (typeof(axes.grid) !== "undefined"){
		if (typeof(axes.grid.x) !== "undefined"){
			for (var ii=0;ii<axes.grid.y.length;ii++){
				drawSVG.Line(svg, styleGridS, axes, calc.X0(axes), calc.Y1(axes,axes.grid.y[ii]), calc.X1(axes,2*Math.PI), calc.Y1(axes,axes.grid.y[ii]));
			}
			for (var ii=0;ii<axes.grid.x.length;ii++){
				drawSVG.Line(svg, styleGridS, axes, calc.X1(axes,axes.grid.x[ii]), calc.Y1(axes,axes.grid.y[0]), calc.X1(axes,axes.grid.x[ii]), calc.Y1(axes,axes.grid.y[axes.grid.y.length-1]));
			}
			
			//legenda
			var txt = "Vert: "+ axes.grid.escalaY + "/div Horiz: "+axes.grid.escalaX + "/div";
			var elem2 = document.createElementNS(NS,"text");
			elem2.setAttribute("x", axes.left+6);
			elem2.setAttribute("y", axes.top+axes.height+15);
			elem2.innerHTML = txt;
			elem2.style.fontFamily = "Arial";
			svg.appendChild(elem2);
			
			var width = elem2.getComputedTextLength();
			
			var style = addProperties({}, {fill: "white", stroke: "black"});
			drawSVG.Rect(svg, style, axes.left+4, axes.top+axes.height, width+5, 20);
			
			svg.appendChild(elem2);
		}
	
		//draw grid polar
		if (typeof(axes.grid.r) !== "undefined"){
			for (var ii=0;ii<axes.grid.r.length;ii++){
				if (axes.grid.r[ii]>0){
					var r = -calc.Y1(axes,axes.grid.r[ii]) + calc.Y0(axes);
					drawSVG.Circle(svg, styleLinhaBaseS, axes, calc.X0(axes,0), calc.Y0(axes,0), r);
					//texto do grid
					drawSVG.Text(svg, styleTexto, fixNum(axes.grid.r[ii]), calc.X1(axes,axes.grid.r[ii])+3, calc.Y0(axes,0)-4);
				}
			}
		}
	}
	
	//draw ticks
	var tickLength = 4;
	if (typeof(axes.tick) !== "undefined"){
		for (var ii=0;ii<axes.tick.y.length;ii++){
			drawSVG.Line(svg, style, axes, calc.X0(axes)-tickLength, calc.Y1(axes,axes.tick.y[ii]), calc.X0(axes)+tickLength, calc.Y1(axes,axes.tick.y[ii]));
			
			//tick labels
			var elem2 = document.createElementNS(NS,"text");
			elem2.setAttribute("x", calc.X0(axes)-8);
			elem2.setAttribute("y", calc.Y1(axes,axes.tick.y[ii]));
			elem2.innerHTML = String(axes.tick.y[ii]);
			elem2.style.fontFamily = "Arial";
			elem2.style.fontSize = 12;
			elem2.style.dominantBaseline = "central";
			elem2.style.textAnchor = "end";
			svg.appendChild(elem2);
			//var width = elem2.getComputedTextLength();
			
			svg.appendChild(elem2);
		}
		for (var ii=0;ii<axes.tick.x.length;ii++){
			drawSVG.Line(svg, style, axes, calc.X1(axes,axes.tick.x[ii]), calc.Y0(axes)+tickLength, calc.X1(axes,axes.tick.x[ii]), calc.Y0(axes)-tickLength);
			
			//tick labels
			var elem2 = document.createElementNS(NS,"text");
			elem2.setAttribute("x", calc.X1(axes,axes.tick.x[ii]));
			if (yLabelAbaixo){
				elem2.setAttribute("y", calc.Y0(axes)+8);
			}
			else{
				elem2.setAttribute("y", calc.Y0(axes)-18);
			}
			elem2.innerHTML = String(axes.tick.x[ii]);
			elem2.style.fontFamily = "Arial";
			elem2.style.fontSize = 12;
			elem2.style.dominantBaseline = "hanging";
			elem2.style.textAnchor = "middle";
			svg.appendChild(elem2);
				
			svg.appendChild(elem2);
		}
	}
	
	return g;
}
//----------------------------------------------------------------------------------------
drawSVG.Circle = function(svg,style,axes,cx,cy,r){
	var elem = document.createElementNS(NS,"circle");
	elem.setAttribute("cx",cx);
	elem.setAttribute("cy",cy);
	elem.setAttribute("r",r);
	addProperties(elem.style, style);
	svg.appendChild(elem);
}
//----------------------------------------------------------------------------------------
// desenha um círculo de 4 px na posição desejada
drawSVG.Dot = function(svg,style,axes,x,y) {
	var x0 = calc.X1(axes,x);
	var y0 = calc.Y1(axes,y);

	var elem = document.createElementNS(NS,"circle");
	elem.setAttribute("cx",x0);
	elem.setAttribute("cy",y0);
	elem.setAttribute("r",4);
	addProperties(elem.style, style);
	svg.appendChild(elem);
	
	return elem;
}
//----------------------------------------------------------------------------------------
// desenha linha
drawSVG.Line = function(svg,style,axes,x1,y1,x2,y2) {
	var elem = document.createElementNS(NS,"line");
	elem.setAttribute("x1",x1);
	elem.setAttribute("y1",y1);
	elem.setAttribute("x2",x2);
	elem.setAttribute("y2",y2);
	addProperties(elem.style,style);
	svg.appendChild(elem);
	
	return elem;
}
//----------------------------------------------------------------------------------------
// desenha linha entre dois eixos
drawSVG.LineBetweenAxes = function(svg,style,axes1,axes2,x1,y1,x2,y2) {
	var elem = document.createElementNS(NS,"line");
	elem.setAttribute("x1",calc.X1(axes1,x1));
	elem.setAttribute("y1",calc.Y1(axes1,y1));
	elem.setAttribute("x2",calc.X1(axes2,x2));
	elem.setAttribute("y2",calc.Y1(axes2,y2));
	addProperties(elem.style,style);
	svg.appendChild(elem);
	
	return elem;
}
//----------------------------------------------------------------------------------------
drawSVG.Parametric = function(svg,style,axes,func1,func2) {
	var xx, yy;
	ctx.beginPath();

	var escalaX = calc.EscalaX(axes);
	var escalaY = calc.EscalaY(axes);

	var x0 = calc.X0(axes);
	var y0 = calc.Y0(axes);

	var pxXMax = calc.PxXMax(axes, func1);
	var pxXMin = calc.PxXMin(axes, func1);

	for (var i=func1.xmin;i<=func1.xmax;i=i+Math.PI/18) {
		x = func2(i);
		y = func1(i);
		var xx = calc.PxX(axes, x);
		var yy = calc.PxY(axes, func1(i));

		if (i==pxXMin) {
			ctx.moveTo(xx,yy);
		}
		else {
			ctx.lineTo(xx,yy);
			ctx.stroke();
		}
	}
	ctx.stroke();
	
	return elem;
}
//----------------------------------------------------------------------------------------
// desenhar textos
drawSVG.Text = function(svg, style, texto, x, y) {
	var elem = document.createElementNS(NS,"text");
	elem.setAttribute("x",x);
	elem.setAttribute("y",y);
	if (texto.indexOf('_')<0){
		elem.innerHTML = texto;
	}
	else{
		texto = "<tspan>" + texto + "</tspan>";
		var pos = texto.indexOf('_');
		texto = texto.replace(texto.substr(pos,2), '<tspan baseline-shift = "sub" font-size = "' + Number(style.fontSize.replace("px",""))*0.75 + '">' + texto.substr(pos+1,1) + '</tspan>');
		elem.innerHTML = texto;
	}
	addProperties(elem.style, style);
	svg.appendChild(elem);
	elem.style.stroke = "none";
	
	return elem;
}
//----------------------------------------------------------------------------------------
// desenhar retângulo
drawSVG.Rect = function(svg, style, x, y, width, height) {
	var elem = document.createElementNS(NS,"rect");
	elem.setAttribute("x", x);
	elem.setAttribute("y", y);
	elem.setAttribute("width", width);
	elem.setAttribute("height", height);
	addProperties(elem.style,style);
	svg.appendChild(elem);
	
	return elem;
}
//----------------------------------------------------------------------------------------
// desenhar função
drawSVG.Equation = function(svg,style,axes,func) {
	var xx, yy;
	var pxXMax = calc.PxX(axes, func.xmax);
	var pxXMin = calc.PxX(axes, func.xmin);

	for (var i=pxXMin;i<=pxXMax;i++) {
		xx = calc.XFromPx(axes,i);
		yy = calc.PxY(axes,func.func(xx)).toFixed(2);
		if (i==pxXMin) {
			var points = ["M", i, yy].join(" ");
		}
		else {
			points += ["L", i, yy].join(" ");
		}
	}
	//criar grupo
	var g = document.createElementNS(NS,"g");
	//criar título
	var elem = document.createElementNS(NS,"title");
	elem.innerHTML = "teste";
	g.appendChild(elem);
	//criar gráfico
	var elem = document.createElementNS(NS,"path");
	g.appendChild(elem);
	elem.setAttribute("d",points);
	addProperties(elem.style,style);
	svg.appendChild(g);
	g.setAttribute("ax",calc.EscalaX(axes));
	g.setAttribute("bx",calc.PxX(axes,0));
	g.setAttribute("ay",calc.EscalaY(axes));
	g.setAttribute("by",calc.PxY(axes,0));
	//elem.setAttribute("title",);
	g.addEventListener('mouseover', function drawSVG_EquationMouseover(evt) {
		//console.log("mouseover");
		var ax = evt.currentTarget.getAttribute("ax");
		var bx = evt.currentTarget.getAttribute("bx");
		//console.log("ax: " + ax + "; bx: " + bx);
		//console.log( (evt.offsetX-bx)/ax )
		
		for (var ii=0;ii<evt.currentTarget.lastElementChild.pathSegList.length;ii++){
			if (evt.currentTarget.lastElementChild.pathSegList[ii].x >= evt.offsetX){
				var x = evt.currentTarget.lastElementChild.pathSegList[ii].x;
				var y = evt.currentTarget.lastElementChild.pathSegList[ii].y;
				break;
			}
		}
		
		
		
		var ay = evt.currentTarget.getAttribute("ay");
		var by = evt.currentTarget.getAttribute("by");
		//console.log("ay: " + ay + "; by: " + by);
		//console.log( (evt.offsetY-by)/ay )
		//evt.currentTarget.children[0].innerHTML = "x: "+ ((evt.offsetX-bx)/ax).toFixed(2) + "; y: " + ((evt.offsetY-by)/ay).toFixed(2);
		evt.currentTarget.children[0].innerHTML = "x: "+ ((x-bx)/ax).toFixed(2) + "; y: " + ((y-by)/ay).toFixed(2);
		}, false);
		//
	
	return g;
}
//----------------------------------------------------------------------------------------
// desenhar objeto
drawSVG.Obj = function(svg, el, offsetX, offsetY, escala, modify) {
	var lineCaps = ["butt", "round", "square"];
	for (var ii=0;ii<Object.keys(el).length;ii++){
		//alterar valores dos grupos
		if ("indexes" in modify) {
			if (modify.indexes.indexOf(el[ii].grupo)>=0){
				//ctx.setLineDash([2,6]);
				var keys = Object.keys(modify.props);
				for (var jj=0;jj<keys.length;jj++){
					el[ii][keys[jj]] = modify.props[keys[jj]];	
				}
			}
		}
		else {
			if (el[ii].grupo in modify){
				var keys = Object.keys(modify[el[ii].grupo]);
				for (var jj=0;jj<keys.length;jj++){
					el[ii][keys[jj]] = modify[el[ii].grupo][keys[jj]];
				}
			}
		}
		
		switch (el[ii].type){
			case 'curveLine': {
				if ((el[ii].closed)){
					var elem = document.createElementNS(NS,"polygon");
					elem.style.strokeLinejoin = "round";
				}
				else{
					var elem = document.createElementNS(NS,"polyline");
				}
				var points = "";
				for (var jj=0;jj<el[ii].points.length;jj++){
					points += (offsetX+escala*el[ii].points[jj][0]) + "," + (offsetY-escala*el[ii].points[jj][1]) + " ";
				}
				elem.setAttribute("points",points);
				elem.style.strokeLinecap = lineCaps[el[ii].linecaps];
				elem.style.strokeLinejoin = lineCaps[el[ii].linecaps];
				elem.style.fill = el[ii].fillStyle;
				elem.style.stroke = el[ii].strokeStyle;
				elem.style.strokeWidth = escala*el[ii].outline;
				svg.appendChild(elem);
				if (el[ii].endArrow){
					drawSVG.ArrowHead(svg,{fill: el[ii].strokeStyle, stroke: el[ii].strokeStyle,strokeWidth: escala*el[ii].outline},5,
					offsetX+escala*el[ii].points[0][0],offsetY-escala*el[ii].points[0][1],
					offsetX+escala*el[ii].points[1][0],offsetY-escala*el[ii].points[1][1]);
				}
				if (el[ii].startArrow){
					drawSVG.ArrowHead(svg,{fill: el[ii].strokeStyle, stroke: el[ii].strokeStyle,strokeWidth: escala*el[ii].outline},5,
					offsetX+escala*el[ii].points[1][0],offsetY-escala*el[ii].points[1][1],
					offsetX+escala*el[ii].points[0][0],offsetY-escala*el[ii].points[0][1]);
				}
				break;
			}
			case 'curveCurve': {
				var elem = document.createElementNS(NS,"path");
				var points = "";
				for (var jj=0;jj<Object.keys(el[ii].points).length;jj++){
					if (jj==0){
						points += "M" +(offsetX+escala*el[ii].points[jj].start[0]) + "," + (offsetY-escala*el[ii].points[jj].start[1]) + " ";
					}			
					points += "C" + (offsetX+escala*el[ii].points[jj].startC[0]) + "," + (offsetY-escala*el[ii].points[jj].startC[1]) + " ";
					points += (offsetX+escala*el[ii].points[jj].endC[0]) + "," + (offsetY-escala*el[ii].points[jj].endC[1]) + " ";
					points += (offsetX+escala*el[ii].points[jj].end[0]) + "," + (offsetY-escala*el[ii].points[jj].end[1]) + " ";
				}
				if ((el[ii].closed)&&(el[ii].fillStyle !== "none")){
					points += "z";
				}
				elem.setAttribute("d",points);
				elem.setAttribute("fill","black");
				elem.style.strokeLinecap = lineCaps[el[ii].linecaps];
				elem.style.fill = el[ii].fillStyle;
				elem.style.stroke = el[ii].strokeStyle;
				elem.style.strokeWidth = escala*el[ii].outline;
				svg.appendChild(elem);
				break;
			}
			case "text": {
				var elem = document.createElementNS(NS,"text");
				elem.setAttribute("x",offsetX+escala*el[ii].posicao[0]);
				elem.setAttribute("y",offsetY-escala*el[ii].posicao[1]);
				var texto = el[ii].text;
				if (texto.indexOf('_')<0){
					elem.innerHTML = texto;
				}
				else{
					texto = "<tspan>" + texto + "</tspan>";
					var pos = texto.indexOf('_');
					texto = texto.replace(texto.substr(pos,2), '<tspan baseline-shift = "sub" font-size = "' + escala*el[ii].size*0.7 + '">' + texto.substr(pos+1,1) + '</tspan>');
					elem.innerHTML = texto;
				}
				elem.innerHTML = texto;
				elem.style.fontSize = escala*el[ii].size*1.4+ "px ";
				elem.style.fontFamily = el[ii].font;;
				elem.style.fill = el[ii].fillStyle;
				elem.style.stroke = el[ii].strokeStyle;
				elem.style.strokeWidth = escala*el[ii].outline;
				svg.appendChild(elem);
				break;
			}
			case "rectangle": {
				var elem = document.createElementNS(NS,"rect");
				elem.setAttribute("x",offsetX+escala*el[ii].points[0]);
				elem.setAttribute("y",offsetY-(escala*el[ii].points[1]+el[ii].dims[1]));
				elem.setAttribute("width",escala*(el[ii].dims[0]));
				elem.setAttribute("height",escala*(el[ii].dims[1]));
				elem.style.fill = el[ii].fillStyle;
				elem.style.stroke = el[ii].strokeStyle;
				elem.style.strokeWidth = escala*el[ii].outline;
				elem.style.strokeLinecap = lineCaps[el[ii].linecaps];
				svg.appendChild(elem);
				break;
			}
			case "ellipse": {
				var elem = document.createElementNS(NS,"ellipse");
				elem.setAttribute("cx",offsetX+escala*el[ii].center[0]);
				elem.setAttribute("cy",offsetY-escala*el[ii].center[1]);
				elem.setAttribute("rx",escala*el[ii].radius[0]);
				elem.setAttribute("ry",escala*el[ii].radius[1]);
				elem.style.fill = el[ii].fillStyle;
				elem.style.stroke = el[ii].strokeStyle;
				elem.style.strokeWidth = escala*el[ii].outline;
				svg.appendChild(elem);		
				break;
			}
			default: {
				console.log("Tipo não encontrado");
			}
		}
		elem.setAttribute("objIndex",ii);
		if ("lineStyle" in el[ii]){
			elem.style.strokeDasharray = el[ii].lineStyle.join(",");
		}
		else{
			elem.style.strokeDasharray = "[]";
		}
	}
}
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
function get() {};
//----------------------------------------------------------------------------------------
get.Limits = function (el,escala) {
	// auto find offsets
	var minX = 1e10;
	var minY = -1e10;
	var maxX = -1e10;
	var maxY = 1e10;
	for (var ii=0;ii<Object.keys(el).length;ii++){
		//if (ii == 81){1;}
		var points = get.AllPoints(el[ii]);
		for (var jj=0;jj<points.length;jj++){
			if (escala*points[jj][0] < minX){
				minX = escala*points[jj][0];
			}
			if (escala*points[jj][1] > minY){
				minY = escala*points[jj][1];
			}
			if (escala*points[jj][0] > maxX){
				maxX = escala*points[jj][0];
			}
			if (escala*points[jj][1] < maxY){
				maxY = escala*points[jj][1];
			}
		}
	}
	//console.log(minX);
	return {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
}
//----------------------------------------------------------------------------------------
get.Selected = function(el,offsetX,offsetY,escala,x1,y1,x2,y2) {
	// auto find offsets
	var gruposSelecionados = [];
	var indicesSelecionados = [];
	
	var keys = Object.keys(el);
	for (var ii=0;ii<keys.length;ii++){
		//if (el[ii].grupo==29) {1;}
		var selected = true;
		var points = get.AllPoints(el[keys[ii]]);
		//console.log(ii);
		for (var jj=0;jj<points.length;jj++){
			if ((escala*points[jj][0] + offsetX < x1)||(escala*points[jj][0] + offsetX > x2)||
				(-escala*points[jj][1] + offsetY < y1)||(-escala*points[jj][1] + offsetY > y2)){
				selected = false;
			}
		}
		if (selected){
			gruposSelecionados.push(el[keys[ii]].grupo);
			indicesSelecionados.push(keys[ii]);
		}
	}
	console.log("Groups selected:");
	console.log(gruposSelecionados);
	console.log("Indexes selected:");
	console.log(gruposSelecionados);
	
	return gruposSelecionados;
}
//----------------------------------------------------------------------------------------
get.AllPoints = function(el){
	var points = [];
	switch (el.type){
		case 'curveLine': {
			for (var jj=0;jj<el.points.length;jj++){
				points.push([el.points[jj][0],el.points[jj][1]]);
			}
			break;
		}
		case 'curveCurve': {
			points.push([el.points[0].start[0], el.points[0].start[1]]);
			for (var jj=0;jj<Object.keys(el.points).length;jj++){
				points.push([el.points[jj].end[0], el.points[jj].end[1]]);
			}
			break;
		}
		case "text": {
			points.push([el.posicao[0], el.posicao[1]]);
			points.push([el.posicao[0], el.posicao[1]+Number(el.size)]);
			break;
		}
		case "rectangle": {
			points.push(el.points);
			points.push([el.points[0]+el.dims[0], el.points[1]+el.dims[1]]);
			break;
		}
		case "ellipse": {
			points.push([el.center[0]+el.radius[0], el.center[1]+el.radius[1]]);
			points.push([el.center[0]-el.radius[0], el.center[1]+el.radius[1]]);
			points.push([el.center[0]+el.radius[0], el.center[1]-el.radius[1]]);
			points.push([el.center[0]-el.radius[0], el.center[1]-el.radius[1]]);
			break;
		}
		default: {
			console.log("Tipo não encontrado");
		}
	}
	return points;
}
//----------------------------------------------------------------------------------------
//get closest group to point x1, y1
get.Closest = function(el,offsetX,offsetY,escala,x1,y1) {
	function dist(x1,x2,y1,y2){return Math.pow(x1-x2,2) + Math.pow(y1-y2,2);}
	// auto find offsets
	var distancia = 1e10;
	var distancias = [];
	var grupo = 0;
	
	for (var ii=0;ii<Object.keys(el).length;ii++){
		if ("posicao" in el[ii]){
			var dist2 = dist(escala*el[ii].posicao[0] + offsetX,x1,-escala*el[ii].posicao[1] + offsetY, y1);
			distancias.push({dist: dist2, grupo: el[ii].grupo});
			if (dist2 < distancia){
				distancia = dist2;
				grupo = el[ii].grupo;
			}
		}
		
		if ("points" in el[ii]){
			var dist3 = 1e10;
			for (var jj=0;jj<el[ii].points.length;jj++){
				var dist2 = dist(escala*el[ii].points[jj][0] + offsetX, x1,-escala*el[ii].points[jj][1] + offsetY, y1);
				if (dist2 < distancia){
					distancia = dist2;
					grupo = el[ii].grupo;
				}
				if (dist2 < dist3){
					dist3 = dist2;
				}
			}
			distancias.push({dist: dist3, grupo: el[ii].grupo})
		}
	}
	console.log(distancia);
	console.log("grupo: " + grupo);
	distancias.sort(function (a,b) {if (a.dist>b.dist) {return 1}else {return -1}});
	console.log(distancias);
	return grupo;
}
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
function calc(){};
	//calcular escalas
	calc.EscalaX = function(axes) {return axes.width/(axes.xmax-axes.xmin);}
	calc.EscalaY = function(axes) {return -axes.height/(axes.ymax-axes.ymin);}
	
	// calcular origens
	calc.X0 = function(axes) {return axes.left-axes.xmin*calc.EscalaX(axes);}
	calc.Y0 = function(axes) {return axes.top-axes.ymax*calc.EscalaY(axes);}
	
	// calcular ponto em determinado eixo
	calc.X1 = function(axes,x1) {return Math.round(calc.X0(axes)+x1*calc.EscalaX(axes));}
	calc.Y1 = function(axes,y1) {return Math.round(calc.Y0(axes)+y1*calc.EscalaY(axes));}
	
	//calcular pontos em pixels
	calc.PxXMin = function(axes,func) {return Math.round(calc.X0(axes)+func.xmin*calc.EscalaX(axes));}
	calc.PxXMax = function(axes,func) {return Math.round(calc.X0(axes)+func.xmax*calc.EscalaX(axes));}
	calc.PxX		= function(axes,pos)	{return Math.round(calc.X0(axes)+pos*calc.EscalaX(axes));}
	
	calc.XFromPx	= function(axes,valor) {return (valor-calc.X0(axes))/calc.EscalaX(axes);}
	calc.PxY			= function(axes,valor) {return calc.Y0(axes)+valor*calc.EscalaY(axes);}
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////
// adicionar propriedades a um objeto
function addProperties(obj, options, options2) {
	var keys = Object.keys(options);
	for (var ii=0;ii<keys.length;ii++){
		obj[keys[ii]] = options[keys[ii]];
	}
	if (typeof(options2) !== "undefined"){
		var keys = Object.keys(options2);
		for (var ii=0;ii<keys.length;ii++){
			obj[keys[ii]] = options2[keys[ii]];
		}
	}
	return obj;
}
//////////////////////////////////////////////////////////////////////////////////////////
function fixNum(num){
	if (num !== 0){
		var modo = "";
		if (modo == "exp"){
			var exp = Math.floor(Math.log10(num));
			num = Math.round(num/Math.pow(10, exp)*100)/100;
			var out = String(num) + "e" + exp;
		}
		var prefixos = ["u", "m", "", "k", "M", "G", "T"];
		var exp = Math.floor(Math.log(num)/Math.log(1000));
		num = Math.round(num/Math.pow(1000, exp)*100)/100;
		var out = String(num) + prefixos[2+exp];
		console.log(num);
	}
	return out;
}