#include <iostream>
#include <vector>

using namespace std;

enum Role
{
	RoleCaoCao,
	RoleZhangFe,
	RoleZhaoYun,
	RoleHuangZhong,
	RoleMaChao,
	RoleGuanYu,
	RoleZu1,
	RoleZu2,
	RoleZu3,
	RoleZu4,
	RoleEmpty1,
	RoleEmpty2,
};

// 角色大小，如曹操是2x2
enum NodeType
{
	Role22,
	Role21,
	Role12,
	Role11,
	Role00,
};

const int BoardWidth = 4;
const int BoardHeight = 5;

bool IsWin = false;

// 每个角色信息
struct Node
{
	Node(string n, NodeType t, int _x, int _y) { name=n; type=t; x=_x; y=_y; }
	string name;
	NodeType type;
	int x;
	int y;
};

// 每个角色位置，可达图中只需要保存位置即可
struct NodePos
{
	NodePos(int _x=0, int _y=0) { x=_x; y=_y; }
	int x;
	int y;
};

// 游戏中所有角色
vector<Node> NodeVector;

// 搜索过程中可达图节点
struct NodeGraph
{
	vector<NodePos> Poses;
	vector<NodeGraph*> CanTransfers;
	bool checked;
};

// 搜索过程中可达图
vector<NodeGraph> NodeGraphVector;

// 初始化局面
void initGame()
{
	NodeVector.push_back(Node("CaoCao", Role22, 1, 0));
	NodeVector.push_back(Node("ZhangFei", Role12, 0, 0));
	NodeVector.push_back(Node("ZhaoYun", Role12, 3, 0));
	NodeVector.push_back(Node("HuangZhong", Role12, 0, 2));
	NodeVector.push_back(Node("MaChao", Role12, 3, 2));
	NodeVector.push_back(Node("GuanYu", Role21, 1, 2));
	NodeVector.push_back(Node("Zu1", Role11, 1, 3));
	NodeVector.push_back(Node("Zu2", Role11, 2, 3));
	NodeVector.push_back(Node("Zu3", Role11, 4, 0));
	NodeVector.push_back(Node("Zu4", Role11, 4, 3));
	NodeVector.push_back(Node("Empty1", Role00, 4, 1));
	NodeVector.push_back(Node("Empty2", Role00, 4, 2));

	NodeGraph nodeStart;
	nodeStart.Poses.clear();
	for(unsigned int i=0; i<NodeVector.size(); ++i)
	{
		nodeStart.Poses.push_back(NodePos(NodeVector[i].x, NodeVector[i].y));
	}
	nodeStart.CanTransfers.clear();
	nodeStart.checked = false;
	NodeGraphVector.push_back(nodeStart);
}

void AddOneGraphNode(vector<NodePos> newPoses)
{
	unsigned int i;
	for(i=0; i<NodeGraphVector.size(); ++i)
	{
		unsigned int j;
		for(j=0; j<NodeGraphVector[i].Poses.size(); ++j)
		{
			if(NodeGraphVector[i].Poses[j].x!=newPoses[j].x || NodeGraphVector[i].Poses[j].y!=newPoses[j].y)
				break;
		}
		if(j==NodeGraphVector[i].Poses.size())
			break;
	}
	if(i==NodeGraphVector.size())
	{
		NodeGraph node;
		node.Poses = newPoses;
		node.CanTransfers.clear();
		node.checked = false;
		NodeGraphVector.push_back(node);
		if(node.Poses[RoleCaoCao].x==1 && node.Poses[RoleCaoCao].y==2)
			IsWin = true;
	}
}

bool IsEmpty(int x, int y)
{
	if(NodeVector[RoleEmpty1].x==x && NodeVector[RoleEmpty1].y==y)
		return true;
	if(NodeVector[RoleEmpty2].x==x && NodeVector[RoleEmpty2].y==y)
		return true;
	return false;
}

// 搜索位于index的节点并计算全部可达点
// 依次判断是否可以上下左右移动
bool SearchOne(int index)
{
	NodeGraphVector[index].checked = true;
	vector<NodePos> testPoses = NodeGraphVector[index].Poses;
	//22
	NodePos testPos = testPoses[RoleCaoCao];
	if(testPos.y>0)
	{
		if(IsEmpty(testPos.x, testPos.y-1) && IsEmpty(testPos.x+1, testPos.y-1))
		{
			vector<NodePos> addPoses = testPoses;
			addPoses[RoleCaoCao].y = addPoses[RoleCaoCao].y-1;
			AddOneGraphNode(addPoses);
		}
	}
	if(testPos.y<BoardHeight-2)
	{
		if(IsEmpty(testPos.x, testPos.y+2) && IsEmpty(testPos.x+1, testPos.y+2))
		{
			vector<NodePos> addPoses = testPoses;
			addPoses[RoleCaoCao].y = addPoses[RoleCaoCao].y+1;
			AddOneGraphNode(addPoses);
		}
	}
	if(testPos.x>0)
	{
		if(IsEmpty(testPos.x-1, testPos.y) && IsEmpty(testPos.x-1, testPos.y+1))
		{
			vector<NodePos> addPoses = testPoses;
			addPoses[RoleCaoCao].x = addPoses[RoleCaoCao].x-1;
			AddOneGraphNode(addPoses);
		}
	}
	if(testPos.y<BoardWidth-2)
	{
		if(IsEmpty(testPos.x+2, testPos.y) && IsEmpty(testPos.x+2, testPos.y+1))
		{
			vector<NodePos> addPoses = testPoses;
			addPoses[RoleCaoCao].x = addPoses[RoleCaoCao].x+1;
			AddOneGraphNode(addPoses);
		}
	}

	//12*4
	int i;
	for(i=RoleZhangFe; i<=RoleMaChao; ++i)
	{
		NodePos testPos = testPoses[i];
		if(testPos.y>0)
		{
			if(IsEmpty(testPos.x, testPos.y-1))
			{
				vector<NodePos> addPoses = testPoses;
				addPoses[i].y = addPoses[i].y-1;
				AddOneGraphNode(addPoses);
			}
		}
		if(testPos.y<BoardHeight-2)
		{
			if(IsEmpty(testPos.x, testPos.y+2))
			{
				vector<NodePos> addPoses = testPoses;
				addPoses[i].y = addPoses[i].y+1;
				AddOneGraphNode(addPoses);
			}
		}
		if(testPos.x>0)
		{
			if(IsEmpty(testPos.x-1, testPos.y) && IsEmpty(testPos.x-1, testPos.y+1))
			{
				vector<NodePos> addPoses = testPoses;
				addPoses[i].x = addPoses[i].x-1;
				AddOneGraphNode(addPoses);
			}
		}
		if(testPos.y<BoardWidth-2)
		{
			if(IsEmpty(testPos.x+1, testPos.y) && IsEmpty(testPos.x+1, testPos.y+1))
			{
				vector<NodePos> addPoses = testPoses;
				addPoses[i].x = addPoses[i].x+1;
				AddOneGraphNode(addPoses);
			}
		}
	}

	//21
	NodePos testPos = testPoses[RoleGuanYu];
	if(testPos.y>0)
	{
		if(IsEmpty(testPos.x, testPos.y-1) && IsEmpty(testPos.x+1, testPos.y-1))
		{
			vector<NodePos> addPoses = testPoses;
			addPoses[RoleGuanYu].y = addPoses[RoleGuanYu].y-1;
			AddOneGraphNode(addPoses);
		}
	}
	if(testPos.y<BoardHeight-1)
	{
		if(IsEmpty(testPos.x, testPos.y+2) && IsEmpty(testPos.x+1, testPos.y+1))
		{
			vector<NodePos> addPoses = testPoses;
			addPoses[RoleGuanYu].y = addPoses[RoleGuanYu].y+1;
			AddOneGraphNode(addPoses);
		}
	}
	if(testPos.x>0)
	{
		if(IsEmpty(testPos.x-1, testPos.y))
		{
			vector<NodePos> addPoses = testPoses;
			addPoses[RoleGuanYu].x = addPoses[RoleGuanYu].x-1;
			AddOneGraphNode(addPoses);
		}
	}
	if(testPos.y<BoardWidth-2)
	{
		if(IsEmpty(testPos.x+2, testPos.y))
		{
			vector<NodePos> addPoses = testPoses;
			addPoses[RoleGuanYu].x = addPoses[RoleGuanYu].x+1;
			AddOneGraphNode(addPoses);
		}
	}

	//11*4
	for(i=RoleZu1; i<=RoleZu4; ++i)
	{
		NodePos testPos = testPoses[i];
		if(testPos.y>0)
		{
			if(IsEmpty(testPos.x, testPos.y-1))
			{
				vector<NodePos> addPoses = testPoses;
				addPoses[i].y = addPoses[i].y-1;
				AddOneGraphNode(addPoses);
			}
		}
		if(testPos.y<BoardHeight-2)
		{
			if(IsEmpty(testPos.x, testPos.y+1))
			{
				vector<NodePos> addPoses = testPoses;
				addPoses[i].y = addPoses[i].y+1;
				AddOneGraphNode(addPoses);
			}
		}
		if(testPos.x>0)
		{
			if(IsEmpty(testPos.x-1, testPos.y))
			{
				vector<NodePos> addPoses = testPoses;
				addPoses[i].x = addPoses[i].x-1;
				AddOneGraphNode(addPoses);
			}
		}
		if(testPos.y<BoardWidth-2)
		{
			if(IsEmpty(testPos.x+1, testPos.y))
			{
				vector<NodePos> addPoses = testPoses;
				addPoses[i].x = addPoses[i].x+1;
				AddOneGraphNode(addPoses);
			}
		}
	}

	return true;
}

// 搜索可达图
bool SearchPath()
{
	while(1)
	{
		for(unsigned int i=0; i<NodeGraphVector.size(); ++i)
		{
			if(!NodeGraphVector[i].checked)
			{
				SearchOne(i);
				break;
			}
		}
		if(IsWin)
			break;
	}
	return true;
}

void ShowInfo()
{
}

void main()
{
	cout<<"Start HuaRongDao game..."<<endl;
	initGame();
	SearchPath();
	cout<<"Search end"<<endl;
}
