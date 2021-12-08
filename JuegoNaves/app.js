function initCanvas(){
    var ctx= document.getElementById('my_canvas').getContext('2d');
    var backgroundImage= new Image();
    var naveImage= new Image();
    var enemiespic1=new Image();
    var enemiespic2 = new Image();
    backgroundImage.src="images/background-pic.jpg";
    naveImage.src = "images/spaceship-pic.png";
    enemiespic1.src= "images/enemigo1.png";
    enemiespic2.src="images/enemigo2.png";

    var cW = ctx.canvas.width;
    var cH = ctx.canvas.height;

    var enemyTemplate= function(options){
        return{
            id:options.id || '',
            x:options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image : options.image || enemiespic1
        }
    }

    var enemies =[
                 new enemyTemplate({id: "enemy3", x:350 , y:50, w:80,h:30}),
                 new enemyTemplate({id: "enemy2", x: 225, y: -20, w: 50, h: 30 }),
                new enemyTemplate({id: "enemy3", x: 350, y: -20, w: 80, h: 30 }),
                new enemyTemplate({id: "enemy4", x:100,  y:-70,  w:80,  h: 30}),
                new enemyTemplate({id: "enemy5", x:225,  y:-70,  w:50,  h: 30}),
                new enemyTemplate({id: "enemy6", x:350,  y:-70,  w:50,  h: 30}),
                new enemyTemplate({id: "enemy7", x:475,  y:-70,  w:50,  h: 30}),
                new enemyTemplate({id: "enemy8", x:600,  y:-70,  w:80,  h: 30}),
                new enemyTemplate({id: "enemy9", x:475,  y:-20,  w:50,  h: 30}),
                new enemyTemplate({id: "enemy10",x: 600, y: -20, w: 50, h: 30}),

                // Segundo grupo de enemigos
                new enemyTemplate({ id: "enemy11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2 }),
                new enemyTemplate({ id: "enemy12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2 }),
                new enemyTemplate({ id: "enemy13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2 }),
                new enemyTemplate({ id: "enemy14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2 }),
                new enemyTemplate({ id: "enemy15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2 }),
                new enemyTemplate({ id: "enemy16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2 }),
                new enemyTemplate({ id: "enemy17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2 }),
                new enemyTemplate({ id: "enemy18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2 }),
                new enemyTemplate({ id: "enemy19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2 }),
        
    ];
    var renderEnemies= function(enemyList){
        for(var i= 0; i< enemyList.length ; i++ ){
            var enemy = enemyList[i];
            ctx.drawImage(enemy.image, enemy.x,enemy.y+= .5,enemy.w, enemy.h ); //imagen y ubicaciones
            launcher.hitLowerlevel(enemy);
            
        }
    }

    function launcher(){
        this.y=500,     //posicion de y
        this.x=cW*.5-25, //posicion de x
        this.w=100,   //ancho
        this.h=100,     //altura
        this.direccion,  //flechas
        this.bg="white" //color de fondo
        this.misiles=[]; //misiles disparados

        this.gameStatus = {
            over:false,
            message: "",
            fillStyle: 'red',
            font: 'italic bold 36px arial,  sans-serif', 
        }

        this.render=function(){    
            if(this.direccion === 'left'){
                this.x-=5;
    
            }
            if(this.direccion==='right'){
                this.x+=5
            }
            if(this.direccion==='downArrow'){
                this.y+=5
            }
            if(this.direccion==='upArrow'){
                this.y-=5
            }


            ctx.fillStyle=this.bg; //canvas
            ctx.drawImage(backgroundImage,0,0) ;//imagen de fondo  y posicion donde comenzara el fondo
            ctx.drawImage(naveImage, this.x,this.y,100,90) //imagen de fondo
            
            for(var i= 0;i < this.misiles.length ; i++){  //iterqando las balas 
                var m = this.misiles[i];    //m guardara las balas
                ctx.fillRect(m.x,m.y-=5 , m.w, m.h);    //se pintaran en el canvas ubicacion con coordenadas en x y  ancho y altura de bala
                this.hit(this.misiles[i],i);
                     if(m.y <= 0){ 
                          this.misiles.splice(i,1); //metodo splice para borrar la bala num de indice, cuantos elementos a remover
                
                     }
            }
            if(enemies.length === 0){
                clearInterval(animateInterval);
                ctx.fillStyle='yellow';
                ctx.font = this.gameStatus.font;
                ctx.fillText('You win' , cW * .5  -80,50)
            }
        
        
        }
        this.hit = function(m,mi){
            for(var i = 0;i<enemies.length;i++){
                var e = enemies[i];
                if (m.x + m.w >= e.x    && m.x <= e.x + e.w  &&
                    m.y >= e.y && m.y<=e.y + e.h){
                        
                    this.misiles.splice(this.misiles[mi],1); // Remove the missile
                    enemies.splice(i, 1); // Remove the enemy that the missile hit
                    document.querySelector('.barra').innerHTML = "Destroyed "+ e.id+ " ";
                }
            }
        }


        this.hitLowerlevel=function(enemy){
            if(enemy.y > 550){
                this.gameStatus.over=true;
                this.gameStatus.message='Enemy pased';
            }
            if((enemy.y > this.y -25 && enemy.y< this.y +25 )&&
                 (enemy.x > this.x -45 && enemy.x < this.x +45)){
                this.gameStatus.over= true;
                this.gameStatus.message= 'You died';
            }
            if(this.gameStatus.over === true){
                clearInterval(animateInterval);
                ctx.fillStyle = this.gameStatus.fillStyle;
                ctx.font = this.gameStatus.font;
                ctx.fillText(this.gameStatus.message,cW * .5 -80, 50);
            }
        }

    }

    var launcher = new launcher(); //instaciando la funcion

    function animate(){
        ctx.clearRect(0,0,cW,cH);
        launcher.render();
        renderEnemies(enemies);
    }
    var animateInterval = setInterval(animate,6)

    
    document.addEventListener('keydown',function(event){

        if(event.keyCode === 32){
            launcher.misiles.push({
                x:launcher.x+launcher.w*.5, //salgan las balas del centro de la nave
                y:launcher.y,
                w:3,
                h:10
            });  //cambiar el launcher
            
        }

    });
    
    
    //escucha el boton de izquierda y hace que no se pase del canvas
    
    
    
    document.addEventListener('keydown',function(event){

        if(event.keyCode === 37){
            launcher.direccion='left';  //cambiar el launcher
            if(launcher.x < cW*.2-130){ //impedir qeu se mueva todo hacia la izq
                launcher.x += 0;
                launcher.direccion = '';
            }
            
        }

    });
    
    document.addEventListener('keyup',function(event){

        if(event.keyCode===37){
            launcher.x +=0;
            launcher.direccion='';
        }
    });
    

    //DERECHA
    document.addEventListener('keydown',function(event){

        if(event.keyCode === 39){
            launcher.direccion='right';  //cambiar el launcher
            if(launcher.x > cW-130){ //impedir qeu se mueva todo hacia la izq
                launcher.x -= 0;
                launcher.direccion = '';
            }
        }

    });
    
    
    document.addEventListener('keyup',function(event){

        if(event.keyCode===39){
            launcher.x -=0;
            launcher.direccion='';
        }
    });

 //ARRIBA
    document.addEventListener('keydown',function(event){

        if(event.keyCode === 38){
            launcher.direccion='upArrow';  //cambiar el launcher
            if(launcher.y < cH*.2-130){ //impedir qeu se mueva todo hacia la izq
                launcher.y += 0;
                launcher.direccion = '';
            }
        }

    });

    
    document.addEventListener('keyup',function(event){

        if(event.keyCode===38){
            launcher.y +=0;
            launcher.direccion='';
        }
    });


    
 //ABAJO
    document.addEventListener('keydown',function(event){

        if(event.keyCode === 40){
            launcher.direccion='downArrow';  //cambiar el launcher
            if(launcher.y > cH-130){ //impedir qeu se mueva todo hacia la izq
                launcher.y -= 0;
                launcher.direccion = '';
            }
        }

    });  

    //abajo
    document.addEventListener('keyup',function(event){

        if(event.keyCode===40){
            launcher.y -=0;
            launcher.direccion='';
        }
    });

    document.addEventListener('keyup',function(event){

        if(event.keyCode===80){
            location.reload();
        }
    });
    //botones clickeados
    var left_btn=document.getElementById('left_btn');
    var right_btn=document.getElementById('right_btn');
    var fire_btn=document.getElementById('fire_btn');
    left_btn.addEventListener('mousedown',function(event){
        launcher.direccion='left';
    });

    left_btn.addEventListener('mouseup',function(event){
        launcher.direccion='';
    });

    right_btn.addEventListener('mousedown',function(event){
        launcher.direccion='right';
    });

    right_btn.addEventListener('mouseup',function(event){
        launcher.direccion='';
    });

    fire_btn.addEventListener('mousedown',function(event){
        launcher.misiles.push({
            x:launcher.x + launcher.w*.5, //salgan las balas del centro de la nave
            y:launcher.y,
            w:3,
            h:10
        }); 
    });
    


}

window.addEventListener('load',function(event){
    initCanvas();
});