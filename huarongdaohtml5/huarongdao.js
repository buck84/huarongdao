// 角色信息
function Node(name, img, x, y, w, h)
{
	this.name = name;
	this.image = img;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

// 所有角色
var nodes = new Array();
nodes[0] = new Node("caocao", new Image(), 1, 0, 2, 2)
nodes[1] = new Node("zhangfei", new Image(), 0, 0, 1, 2)
nodes[2] = new Node("zhaoyun", new Image(), 3, 0, 1, 2)
nodes[3] = new Node("huangzhong", new Image(), 0, 2, 1, 2)
nodes[4] = new Node("machao", new Image(), 3, 2, 1, 2)
nodes[5] = new Node("guanyu", new Image(), 1, 2, 2, 1)
nodes[6] = new Node("zu", new Image(), 0, 4, 1, 1)
nodes[7] = new Node("zu", new Image(), 1, 4, 1, 1)
nodes[8] = new Node("zu", new Image(), 2, 4, 1, 1)
nodes[9] = new Node("zu", new Image(), 3, 4, 1, 1)

// 角色位置
function NodePos(x, y)
{
	this.x = x;
	this.y = y;
}

// 所有空点位置
var emptyNodes = new Array();
emptyNodes[0] = new NodePos(1, 3);
emptyNodes[1] = new NodePos(2, 3);

// 游戏相关变量
var clickIndex = -1;
var clickX = -1;
var clickY = -1;

// 搜索相关变量

// 判断位置是否为空
function isEmpty(x, y)
{
	if(emptyNodes[0].x==x && emptyNodes[0].y==y)
		return true;
	if(emptyNodes[1].x==x && emptyNodes[1].y==y)
	return true;
	return false;
}

// x1y1设置为非空，x2y2设置为空
function switchEmpty(x1, y1, x2, y2)
{
	if(emptyNodes[0].x==x1 && emptyNodes[0].y==y1)
	{
		emptyNodes[0].x = x2
		emptyNodes[0].y = y2
	}
	if(emptyNodes[1].x==x1 && emptyNodes[1].y==y1)
	{
		emptyNodes[1].x = x2
		emptyNodes[1].y = y2
	}
}

// 判断是否能移动以及移动操作函数
function canMoveUp()
{
	var n = nodes[clickIndex];

	if(n.y==0)
	return false

	if(!isEmpty(n.x, n.y-1))
	return false;
	if(n.w>1)
	{
		if(!isEmpty(n.x+1, n.y-1))
		return false;
	}
	return true;
}

function moveUp()
{
	if(canMoveUp())
	{
		showstr("move up")
		nodes[clickIndex].y = nodes[clickIndex].y-1;
		switchEmpty(nodes[clickIndex].x, nodes[clickIndex].y, nodes[clickIndex].x, nodes[clickIndex].y+nodes[clickIndex].h)
		if(nodes[clickIndex].w>1)
		switchEmpty(nodes[clickIndex].x+1, nodes[clickIndex].y, nodes[clickIndex].x+1, nodes[clickIndex].y+nodes[clickIndex].h)
	}
}

function canMoveDown()
{
	var n = nodes[clickIndex];
	if((n.y+n.h)>=5)
	return false
	if(!isEmpty(n.x, n.y+n.h))
	return false;
	if(n.w>1)
	{
		if(!isEmpty(n.x+1, n.y+n.h))
		return false;
	}
	return true;
}

function moveDown()
{
	if(canMoveDown())
	{
		showstr("move down")
		nodes[clickIndex].y = nodes[clickIndex].y+1;
		switchEmpty(nodes[clickIndex].x, nodes[clickIndex].y+nodes[clickIndex].h-1, nodes[clickIndex].x, nodes[clickIndex].y-1)
		if(nodes[clickIndex].w>1)
		switchEmpty(nodes[clickIndex].x+1, nodes[clickIndex].y+nodes[clickIndex].h-1, nodes[clickIndex].x+1, nodes[clickIndex].y-1)
	}
}

function canMoveLeft()
{
	var n = nodes[clickIndex];
	if(n.x==0)
	return false
	if(!isEmpty(n.x-1, n.y))
	return false;
	if(n.h>1)
	{
		if(!isEmpty(n.x-1, n.y+1))
		return false;
	}
	return true;
}

function moveLeft()
{
	if(canMoveLeft())
	{
		showstr("move left")
		nodes[clickIndex].x = nodes[clickIndex].x-1;
		switchEmpty(nodes[clickIndex].x, nodes[clickIndex].y, nodes[clickIndex].x+nodes[clickIndex].w, nodes[clickIndex].y)
		if(nodes[clickIndex].h>1)
		switchEmpty(nodes[clickIndex].x, nodes[clickIndex].y+1, nodes[clickIndex].x+nodes[clickIndex].w, nodes[clickIndex].y+1)
	}
}

function canMoveRight()
{
	var n = nodes[clickIndex];
	if((n.x+n.w)>=4)
	return false
	if(!isEmpty(n.x+n.w, n.y))
	return false;
	if(n.h>1)
	{
		if(!isEmpty(n.x+n.w, n.y+1))
		return false;
	}
	return true;
}

function moveRight()
{
	if(canMoveRight())
	{
		showstr("move right")
		nodes[clickIndex].x = nodes[clickIndex].x+1;
		switchEmpty(nodes[clickIndex].x+nodes[clickIndex].w-1, nodes[clickIndex].y, nodes[clickIndex].x-1, nodes[clickIndex].y)
		if(nodes[clickIndex].h>1)
		switchEmpty(nodes[clickIndex].x+nodes[clickIndex].w-1, nodes[clickIndex].y+1, nodes[clickIndex].x-1, nodes[clickIndex].y+1)
	}
}

// 鼠标在画布上按下响应函数
function mouseDown(e)
{
	clickIndex = -1;
	clickX = -1;
	clickY = -1;
	var x = e.offsetX;
	var y = e.offsetY;
	for(var i=0; i<nodes.length; i++)	//nodes.length
	{
		if(x>nodes[i].x*100 && x<(nodes[i].x+nodes[i].w)*100 && y>nodes[i].y*100 && y<(nodes[i].y+nodes[i].h)*100)
		{
			clickIndex = i;
			clickX = x;
			clickY = y;
			break;
		}
	}
	document.getElementById("info1").innerHTML="click: " + clickIndex +"(" + x + "," + y + ")";
	var showIndex = 2;
	document.getElementById("info2").innerHTML=nodes[showIndex].x+","+nodes[showIndex].y+","+nodes[showIndex].w+","+nodes[showIndex].h;
}

// 输出调试信息到info2
function showstr(s)
{
	document.getElementById("info2").innerHTML=s
}

// 鼠标在画布上抬起操作响应函数
function mouseUp(e)
{
	if(clickIndex<0)
	{
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	if(Math.abs(x-clickX)>Math.abs(y-clickY))
	{
		if(x>clickX)
		{
			moveRight();
		}
		else
		{
			moveLeft();
		}
	}
	else
	{
		if(y>clickY)
		{
			moveDown();
		}
		else
		{
			moveUp();
		}
	}
	DisplayGame()
}

// 初始化图片资源
for (var i=0; i<nodes.length; i++)
{
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	var img = nodes[i].image;
	img.src = "images/" + nodes[i].name + ".png";
	var x = nodes[i].x;
	var y = nodes[i].y;
	/*img.onload = function ()
	{
		ctx.drawImage(img, x*100, y*100);
	}*/
}

// 刷新canvas显示
function DisplayGame()
{
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	ctx.clearRect(0,0,400,500);

	for (var i=0; i<nodes.length; i++)
	{
		ctx.drawImage(nodes[i].image, nodes[i].x*100, nodes[i].y*100, nodes[i].w*100, nodes[i].h*100);
	}
}


function GraphNode(nodesPos, edges, checked)
{
	this.nodesPos = nodesPos;
	this.edges = edges;
	this.checked = checked;
	this.isEmpty = function(x, y)
	{
		for(var i=0; i<this.nodesPos.length; i++)
		{
			var dx = x-this.nodesPos[i].x;
			var dy = y-this.nodesPos[i].y;
			if(dx>=0 && dx<nodes[i].w && dy>=0 && dy<nodes[i].h)
				return false;
		}
		return true;
	}
}

var graphNodes = new Array();

var buildGraphFinish = false;
var isWin = false

function CopyNodesPos(nodesPos)
{
	var r = new Array;
	for(var i=0; i<nodesPos.length; i++)
	{
		r[i] = new NodePos(nodesPos[i].x, nodesPos[i].y);
	}
	return r;
}

// 对于判断节点每一个位置，查看待判断表中是否有相应大小元素
function AddOneGraphNode(nodesPos)
{
	var i;
	for(i=0; i<graphNodes.length; i++)
	{
		var j;
		for(j=0; j<graphNodes[i].nodesPos.length; j++)
		{
			var k;
			for(k=0; k<nodesPos.length; k++)
			{
				if(nodes[k].w==nodes[j].w && nodes[k].h==nodes[j].h && graphNodes[i].nodesPos[j].x==nodesPos[k].x && graphNodes[i].nodesPos[j].y==nodesPos[k].y)
					break;
			}
			if(k==nodesPos.length)
				break;
		}
		if(j==graphNodes[i].nodesPos.length)
			return i;
	}
	if(i==graphNodes.length)
	{
		graphNodes[graphNodes.length] = new GraphNode(nodesPos, new Array, false);
		if(nodesPos[0].x==1 && nodesPos[0].y==3)
			isWin = true;
		return graphNodes.length;
	}
}

function SearchOne(index)
{
	var n = graphNodes[index]
	n.checked = true;
	for(var i=0; i<nodes.length; i++)
	{
		// up
		if(n.nodesPos[i].y>0)
		{
			if(n.isEmpty(n.nodesPos[i].x, n.nodesPos[i].y-1))
			{
				if(nodes[i].w==1 || n.isEmpty(n.nodesPos[i].x+1, n.nodesPos[i].y-1))
				{
					var newNodesPos = CopyNodesPos(n.nodesPos);
					newNodesPos[i].y = newNodesPos[i].y - 1;
					var insertPos = AddOneGraphNode(newNodesPos);
					n.edges[n.edges.length] = insertPos
				}
			}
		}
		// down
		if((n.nodesPos[i].y+nodes[i].h)<5)
		{
			if(n.isEmpty(n.nodesPos[i].x, n.nodesPos[i].y+nodes[i].h))
			{
				if(nodes[i].w==1 || n.isEmpty(n.nodesPos[i].x+1, n.nodesPos[i].y+nodes[i].h))
				{
					var newNodesPos = CopyNodesPos(n.nodesPos);
					newNodesPos[i].y = newNodesPos[i].y + 1;
					var insertPos = AddOneGraphNode(newNodesPos);
					n.edges[n.edges.length] = insertPos
				}
			}
		}
		// left
		if(n.nodesPos[i].x>0)
		{
			if(n.isEmpty(n.nodesPos[i].x-1, n.nodesPos[i].y))
			{
				if(nodes[i].h==1 || n.isEmpty(n.nodesPos[i].x-1, n.nodesPos[i].y+1))
				{
					var newNodesPos = CopyNodesPos(n.nodesPos);
					newNodesPos[i].x = newNodesPos[i].x - 1;
					var insertPos = AddOneGraphNode(newNodesPos);
					n.edges[n.edges.length] = insertPos
				}
			}
		}
		// right
		if((n.nodesPos[i].x+nodes[i].w)<4)
		{
			if(n.isEmpty(n.nodesPos[i].x+nodes[i].w, n.nodesPos[i].y))
			{
				if(nodes[i].h==1 || n.isEmpty(n.nodesPos[i].x+nodes[i].w, n.nodesPos[i].y+1))
				{
					var newNodesPos = CopyNodesPos(n.nodesPos);
					newNodesPos[i].x = newNodesPos[i].x + 1;
					var insertPos = AddOneGraphNode(newNodesPos);
					n.edges[n.edges.length] = insertPos
				}
			}
		}
	}

}

// 搜索解
function FindPath()
{
	var nodesPos = new Array();
	for (var i=0; i<nodes.length; i++)
	{
		nodesPos[i] = new NodePos(nodes[i].x, nodes[i].y);
	}

	graphNodes[0] = new GraphNode(nodesPos, new Array(), false)
	//while(true)
	for(var k=0; k<11111; ++k)
	{
		var i;
		for(i=0; i<graphNodes.length; i++)
		{
			if(!graphNodes[i].checked)
			{
				SearchOne(i);
				break;
			}
		}
		if(isWin)
		{
			showstr("win");
			break;
		}
		if(i==graphNodes.length)
		{
			showstr("somethingwrong");
			break;
		}
	}
	showstr("current node:"+graphNodes.length);
	DisplayAllGraph();
}

function findObj(theObj, theDoc)
{
    var p, i, foundObj;
  
    if(!theDoc) theDoc = document;
    if( (p = theObj.indexOf("?")) > 0 && parent.frames.length)
    {
      theDoc = parent.frames[theObj.substring(p+1)].document;
      theObj = theObj.substring(0,p);
    }
    if(!(foundObj = theDoc[theObj]) && theDoc.all) foundObj = theDoc.all[theObj];
    for (i=0; !foundObj && i < theDoc.forms.length; i++)
      foundObj = theDoc.forms[i][theObj];
    for(i=0; !foundObj && theDoc.layers && i < theDoc.layers.length; i++)
      foundObj = findObj(theObj,theDoc.layers[i].document);
    if(!foundObj && document.getElementById) foundObj = document.getElementById(theObj);
  
    return foundObj;
}


function DisplayAllGraph()
{
	var tbl = document.getElementById("deallist");//findObj("deallist",document);
	for(var i=0; i<graphNodes.length/5; i++)
	{
		var r = tbl.insertRow(0);
		for(var j=0; j<5; j++)
		{
			if((i*5+j)>=graphNodes.length)
				break;
			var c = r.insertCell(j);
			c.innerHTML = "<canvas id=\"graphcanvas" + (i*5+j) +"\" width=\"200\" height=\"250\" style=\"border:1px solid #d3d3d3;background:#ffffff;\"> </canvas>";
			var c=document.getElementById("graphcanvas" + (i*5+j));
			var ctx=c.getContext("2d");
			ctx.clearRect(0,0,200,250);

			//*
			for (var k=0; k<graphNodes[i*5+j].nodesPos.length; k++)
			{
				ctx.drawImage(nodes[k].image, graphNodes[i*5+j].nodesPos[k].x*50, graphNodes[i*5+j].nodesPos[k].y*50, nodes[k].w*50, nodes[k].h*50);
			}
			//*/
		}
	}
}
