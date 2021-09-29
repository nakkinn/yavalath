let s=70,point,pre;
let board=new Array(81);
let peer,room,stone;

function setup(){
    createCanvas(windowWidth,windowHeight);

    peer=new Peer({
        key: 'cf1155ef-ab9f-41a3-bd4a-b99c30cc0663',
        debug:1
    });
    peer.on('open',()=>{
        id=peer.id;
        room=peer.joinRoom("rooma",{
            mode:'sfu'
        });
        room.on('open',()=>{
            stone=room.members.length%3+1;
        });
        room.on('peerJoin',peerId=>{
            console.log(peerId+"参加");
        });
        room.on('peerLeave',peerId=>{
            console.log(peerId+"退出");
        });
        room.on('data',message=>{
            console.log(message.data);
            receive(message.data);
        });
    });

    reset();
}

function draw(){
    background(255);

    for(let i=-4;i<5;i++){
        point=-1;
        let a=0,b=0;
        if(i>0) b=i;
        else    a=i
        for(let j=-4-a;j<5-b;j++){
            if(dist(mouseX,mouseY,width/2+i*s*sqrt(3)/2,height/2+j*s+i*s/2)<s/2){
                point=i*9+j+40;
                i=j=5;
            }
        }
    }  

    for(let i=-4;i<5;i++){
        let a=0,b=0;
        if(i>0) b=i;
        else    a=i
        for(let j=-4-a;j<5-b;j++){
            if(i*9+j+40==pre) fill(200);
            else    noFill();
            strokeWeight(1);
            if(i*9+j+40==point) strokeWeight(3);
            hexa(width/2+i*s*sqrt(3)/2,height/2+j*s+i*s/2,s/sqrt(3));
            noStroke();
            if(board[i*9+j+40]!=0){
                if(board[i*9+j+40]==1)  fill(0);
                if(board[i*9+j+40]==2)  fill('#ff0000');
                if(board[i*9+j+40]==3)  fill('#0000ff');
                circle(width/2+i*s*sqrt(3)/2,height/2+j*s+i*s/2,s*0.55);
            }
        }
    }
        
}

function hexa(x,y,r){
    beginShape();
    stroke(0);
    for(let i=0;i<6;i++){
        vertex(x+r*cos(2*PI/6*i),y+r*sin(2*PI/6*i))
    }
    endShape(CLOSE);
}

function mouseClicked(){
    for(let i=-4;i<5;i++){
        point=-1;
        let a=0,b=0;
        if(i>0) b=i;
        else    a=i
        for(let j=-4-a;j<5-b;j++){
            if(dist(mouseX,mouseY,width/2+i*s*sqrt(3)/2,height/2+j*s+i*s/2)<s/2){
                if(board[i*9+j+40]==0)  board[i*9+j+40]=stone;
                else    board[i*9+j+40]=0;
                room.send(board[i*9+j+40]+','+(i*9+j+40));
                pre=i*9+j+40;
                i=j=5;
            }
        }
    }     
}

function keyPressed(){
    if(key=='r'){
        reset();
        room.send("reset");
    }
}

function receive(mes){
    if(mes=="reset"){
        reset();
    }else{
        mes=mes.split(',');
        mes[0]=int(mes[0]);
        mes[1]=int(mes[1]);
        pre=mes[1];
        board[mes[1]]=mes[0];
    }
}

function reset(){
    for(let i=0;i<81;i++)   board[i]=0;
    pre=-1;
}