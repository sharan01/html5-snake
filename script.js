var canvas = document.getElementsByTagName('canvas')[0];
var context = canvas.getContext('2d');
var pts = document.getElementById('points');

var startButton = document.getElementById('start');


function snakepart(a,b){
    this.x = a || 0;
    this.y = b || 0;
    this.w = 10;
    this.h = 10;
}
function snakeclass(context,w,h) {
    this.ctx = context;
    this.width = w;
    this.height = h;

    //colors
    this.colorWhite = "#ffffff";
    this.colorBlack = "#000000";
    this.colorBlue = "#0000ff";
    this.colorDarkGrey = "#999999";
    this.colorOrange = "orange";
    ////////////////////////////////

   
   
    

    

    //HELPER FUNCTIONS
    this.drawRect = function(x,y,w,h,color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y,w,h);
    };
    this.getRandomInt = function(min, max) {
        return Math.round((Math.floor(Math.random() * (max - min + 1)) + min)/10) * 10;
    };

    this.putfood = function(){
        while(true){
            var foodtmpx = this.getRandomInt(10, this.width-20);
            var foodtmpy = this.getRandomInt(10,this.height-20);
            for(var k =0; k< this.snake.length; k++){
                if(this.snake[k].x===foodtmpx && this.snake[k].y === foodtmpy){
                    continue;
                }                
            }
            this.food.x = foodtmpx;
            this.food.y = foodtmpy;

            break;
        }
        this.drawRect(this.food.x,this.food.y,10,10,this.colorOrange);
    };
    this.collision = function(){
        //collison with walls

        if(this.snake[0].x===0 || this.snake[0].x===this.width || this.snake[0].y===0 || this.snake[0].y===this.height){
            return true;
        }
        //collision with itself
        for(var i=2; i<this.snake.length; i++){
            if(this.snake[0].x===this.snake[i].x && this.snake[0].y===this.snake[i].y){
                return true;
            }
        }
        //collsion with food
        if(this.snake[0].x === this.food.x && this.snake[0].y === this.food.y){
            this.get = true;
            // put another food
            this.putfood();
            this.points+=10;
             //speed up game
             //pts.innerHTML = this.points;
             console.log(this.snake.length);

        }else{
            this.get = false;
        }

        return false;
    }; // end collison
    this.movesnake = function() {
        if(!this.get){
            this.drawRect(this.snake[this.snake.length-1].x,this.snake[this.snake.length-1].y,10,10,this.colorWhite);
            this.snake.pop();       
        }

        if(this.direction === 'l'){
            var tmpx = this.snake[0].x;
            var tmpy = this.snake[0].y;
            this.snake.unshift(new snakepart(tmpx-10,tmpy)); 
        }
        else if(this.direction === 'r'){
            this.snake.unshift(new snakepart(this.snake[0].x+10,this.snake[0].y));
        }
        else if(this.direction==='u'){
            this.snake.unshift(new snakepart(this.snake[0].x,this.snake[0].y-10));
        }
        else if(this.direction==='d'){
            this.snake.unshift(new snakepart(this.snake[0].x,this.snake[0].y+10));
        }
        else {
            console.log("direct is niether")
        }
        //now draw newly inserted one
        this.drawRect(this.snake[0].x,this.snake[0].y,10,10,this.colorBlue);
    }; //end movesnake


    this.initialize = function(){
        startButton.style.display = 'none';
        this.ctx.clearRect(0,0,this.width,this.height);
        this.direction = 'l';
        this.points = 0;

       
        this.snake = [];
        for(var i =0; i<5; i++){
            this.snake.push(new snakepart((this.width/2)+(10*i),(this.height/2)));
        }
        //draw snake
        for (var j = 0; j < this.snake.length; j++) {
            this.drawRect(this.snake[j].x,this.snake[j].y,10,10,this.colorBlue);
        };

        this.food = new snakepart(300,100); // create food object 
        this.putfood();

        //redraw edges
        this.drawRect(0,0,this.width,10,this.colorBlack);
        this.drawRect(0,this.height-10,this.width,10,this.colorBlack);
        this.drawRect(0,10,10,this.height-20,this.colorBlack);
        this.drawRect(this.width-10,10,10,this.height-20,this.colorBlack);
    };

    this.start = function() {
        this.initialize();
        var interval;
        var loop = function () {
            if(this.collision()){
                console.log("game over");
                startButton.style.display = 'block';


                //local storage for high score
                if(localStorage.highscore){
                    localStorage.highscore = localStorage.highscore < this.points ? this.points : localStorage.highscore;
                } else {
                    localStorage.highscore = this.points;
                }

                
                clearInterval(interval);
            }
            this.movesnake();
        }.bind(this); 
        interval = setInterval(loop, 170);
    };






    

    

    
     //draw edges
    this.drawRect(0,0,this.width,10,this.colorBlack);
    this.drawRect(0,this.height-10,this.width,10,this.colorBlack);
    this.drawRect(0,10,10,this.height-20,this.colorBlack);
    this.drawRect(this.width-10,10,10,this.height-20,this.colorBlack);






}


s = new snakeclass(context,canvas.width,canvas.height);
//s.start();


//key events
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        //left
        s.direction = s.direction === 'r' ? 'r' : 'l';
    }
    else if(event.keyCode == 38) {
        //up
        s.direction = s.direction === 'd' ? 'd' : 'u';
    }
    else if(event.keyCode == 39) {
        //right
        s.direction = s.direction === 'l' ? 'l' : 'r';
    }
    else if(event.keyCode == 40) {
        //down
        s.direction = s.direction === 'u' ? 'u' : 'd';

    }
});