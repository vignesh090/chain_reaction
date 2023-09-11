
var arr= [[1,2,2,2,2,1],
[2,3,3,3,3,2],
[2,3,3,3,3,2],
[2,3,3,3,3,2],
[2,3,3,3,3,2],
[2,3,3,3,3,2],
[2,3,3,3,3,2],
[2,3,3,3,3,2],
        [1,2,2,2,2,1]
    ]
var game=[[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0]
    ]
var player=[[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0],
[0,0,0,0,0,0]
    ]
var nx=[0,1,0,-1]
var ny=[1,0,-1,0]
var n=9,m=6
var playerTurn=1
var gameEnd= false
var chartNum=0
var index= document.getElementsByTagName('td');
var orbs=["",
"./media/orange.png",
"./media/green.png",
"./media/blue.png",
"./media/yellow.png",
"./media/purple.png",
"./media/red.png",
"./media/pink.png",
"./media/skyblue.png"
]
var border=["","darkorange","green","dodgerblue","yellow","purple","red","violet","skyblue"]
//violet= pink skyblue= green
var numPlayers
var first=[0,0,0,0,0,0,0,0,0]


function inputPlayers(promptString="Enter number of players: (between 2-8)"){
    let num= prompt(promptString,"4")
    let numInt= parseInt(num)
    console.log(numInt)
    if(numInt==NaN||numInt>8||numInt<2){
        return inputPlayers("Please provide a valid input!!\nEnter number of players: (between 2-8)")
    }
    else{ return numInt}
}
//Function to create table
function create_table(){
    var table= document.getElementById('table');
    for(let i=0;i<n;i++){
        let tr =document.createElement("tr")
        for(let j=0;j<m;j++){
            let box =document.createElement("td");
            let span= document.createElement("span");
            let span2= document.createElement("span");
            //span2.appendChild(document.createElement('span'))
            box.appendChild(span2);
            span.innerHTML=game[i][j];
            span.classList.add("number")
            // span.style.display= "None"
            box.appendChild(span);
            box.addEventListener("click",()=>{change(i,j)})
            tr.appendChild(box);
        }
        table.appendChild(tr);
    }
}

function chart(){
    if(gameEnd) location.reload()
    if(chartNum===0) {
        numPlayers= inputPlayers()
        create_table();
        chartNum=1;
        let chart= document.getElementById('chart')
        chart.innerHTML=`Game started`
    }
}

//Function to add image to the grid
function addImage(){
    let image= document.createElement('img')
    image.style.width="50%"
    image.src= orbs[playerTurn]
    return image
}

//changes player turn
function changePlayerTurn(arr=5){
    if(playerTurn===numPlayers){
        playerTurn=1
    }
    else playerTurn++
    if(arr===5) return
    if(arr[playerTurn]===0) changePlayerTurn(arr)
}

function setBackground(){
    for(let i=0;i<index.length;i++){
        index[i].style.borderColor= border[playerTurn]
    }
}

function checkForWin(){
    if(first[playerTurn]===0){
        first[playerTurn]=1
        changePlayerTurn()
        return false
    }
    let available=[0,0,0,0,0,0,0,0,0]
    player.forEach((items)=>{
        items.forEach(item=>{
            available[item]++
        })
    })
    let cnt=0
    for(let i=1;i<=numPlayers;i++){
        if(available[i]!==0) cnt++
    }
    if(cnt===1) return true
    else{
        changePlayerTurn(available)
        return false
    }
}

// updates the grid elements while bfs is performed
function updateBlock(i,j){
    game[i][j]+=1
    player[i][j]=playerTurn
    index[i*m+j].lastChild.innerHTML= game[i][j]
    if(game[i][j]>arr[i][j]){
        index[i*m+j].firstChild.removeChild(index[i*m+j].firstChild.firstChild)
        index[i*m+j].lastChild.innerHTML=0
    }
    else{
        game[i][j]===1?
        index[i*m+j].firstChild.appendChild(addImage()):
        index[i*m+j].firstChild.replaceChild(addImage(),index[i*m+j].firstChild.firstChild)
    }
}

//checks if the index is with grid range
function check(x,y,n,m){
    if(x>=0&&y>=0&&x<n&&y<m) return true;
    return false;
}

//BFS(Breadth-First-Search) function is used to search any graph.
async function bfs(i,j){
    queue=[]
    queue.push([i,j])
    while(queue.length>0){
        front= queue[0]
        queue.shift()
        for(let k=0;k<4;k++){
            let x= front[0] +nx[k]
            let y=front[1]+ny[k]
            if(check(x,y,n,m)){
                updateBlock(x,y)
                if(game[x][y]>arr[x][y]){
                    queue.push([x,y])
                    game[x][y]=0
                    player[x][y]=0
                }
                await new Promise((resolve)=>setTimeout(()=>{resolve()},100))
            }
        }
    }
}

//change function executes everytime a player clicks on any element of the grid
async function change(i ,j){
    if(gameEnd) return
    if(player[i][j]!=0 && player[i][j]!=playerTurn) return;
    updateBlock(i,j)
    if(game[i][j]>arr[i][j]){
        game[i][j]=0
        player[i][j]=0
        await bfs(i,j)
    }
    console.log(`${i} ${j}`);
    if(checkForWin()){
        gameEnd=true
        let chart= document.getElementById('chart')
        chart.innerHTML=`Player ${playerTurn} won\nTap to restart`
    }
    setBackground()
    console.log(playerTurn)
}

function collapsible(){
    let element= document.getElementsByClassName("collapsible")
    let content = document.getElementById("list")
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
}


