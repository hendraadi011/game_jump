window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const tombolScroll = document.querySelector('.tombol');

    canvas.width = 1400;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;
    const fullScreenButton = document.querySelector('.fullScreenButton');

    class inputHandler {
        constructor() {
            this.keys = [];
            this.touchY = '';
            this.touchTreshold = 30;
            window.addEventListener('keydown', e => {
                if(   e.key === 'ArrowDown' || 
                      e.key === 'ArrowUp' ||
                      e.key === 'ArrowLeft' || 
                      e.key === 'ArrowRight' && 
                      this.keys.indexOf(e.key) === -1
                 ){
                    this.keys.push(e.key);

                }else if(e.key === 'Enter' && gameOver) restartGame()
            });
            window.addEventListener('keyup', e => {
                if( e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' || 
                    e.key === 'ArrowRight' 
                ){
                    this.keys.splice(e.key.indexOf(e.key), 1)
                }
            });

            window.addEventListener('touchstart', e => {
                this.touchY = e.changedTouches[0].pageY
            })
            window.addEventListener('touchmove', e => {
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if(swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
                else if(swipeDistance > this.touchTreshold  && this.keys.indexOf('swipe down') === -1) {
                    this.keys.push('swipe down')
                    if(gameOver) restartGame()
                }
            })
            window.addEventListener('touchend', e => {
                
                this.keys.splice(this.keys.indexOf('swipe up'), 1)
                this.keys.splice(this.keys.indexOf('swipe down'), 1)
            })
        }

    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight
            this.width = 200;
            this.height = 200;
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.maxFrame = 8;
            this.frameY = 0;
            this.fps = 20;
            this.frameTimer = 0,
            this.frameInterval = 1000/this.fps;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }
        restart() {
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 8;
            this.frameY = 0;
        }
        draw(context) {
           
            // context.strokeStyle = 'white'
            // context.strokeRect(
            //     this.x,
            //     this.y,
            //     this.width,
            //     this.height
            // )
            // context.beginPath();
            // context.arc(
            //     this.x + this.width / 2,
            //     this.y + this.height/2,
            //     this.width/2,
            //     0,
            //     Math.PI * 2
            // )
            // context.stroke()
            // context.strokeStyle = 'blue'
            // context.beginPath();
            // context.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
            // context.stroke()
            context.drawImage(
                this.image, 
                this.frameX * this.width, 
                0 * this.height, 
                this.width, 
                this.height,
                this.x,
                this.y,
                this.width,
                this.height,
               
            )
            // context.lineWidth = 5;
            // context.strokeStyle = 'white'
            // context.beginPath();
            // context.arc(this.x + this.width/2 + 20 , this.y + this.height/2 , this.width/3, 0, Math.PI * 2);
            // context.stroke();

        }
        update(input, deltaTime, enemies) {
             //collision detection
             enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width / 2 - 20) - (this.x + this.width / 2);
                const dy = (enemy.y + enemy.height / 2) - (this.y + this.height / 2 + 20);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if(distance < enemy.width / 3 + this.width/3)
                {
                    gameOver = true;
                }
             })
            // sprite animation
            if(this.frameTimer > this.frameInterval){
                if(this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            }else {
                this.frameTimer += deltaTime;
            }

            // controls
            if(input.keys.indexOf('ArrowRight') > -1 )
            {
                this.speed = 5;
            }
            else if(input.keys.indexOf('ArrowLeft') > -1)
            {
                this.speed = -5;
                
            }
            else if((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) && this.onGround()) 
            {
    
                this.vy -= 32;
            
            }
            else
            {
                this.speed = 0;
            }

            //horizontal movement
            this.x += this.speed;
            if(this.x < 0) this.x = 0;
            else if(this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width
            // // vertical movement
            this.y += this.vy;
            if(!this.onGround()){
                this.vy += this.weight;
                this.maxFrame = 5;
                this.frameY = 1;
            } else {
                this.vy = 0;
            }
            if(this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height


        }
        onGround() {
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {
        constructor (gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 7;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height)
        }

        update () {
            this.x -= this.speed;
            if(this.x < 0 - this.width)
            {
                this.x = 0;
            }

        }
        restart() {
            this.x = 0;
        }


    }

    class Enemy {
        constructor (gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = document.getElementById('enemyImage');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 2;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed = 8;
            this.markedForDelation = false;
        }

        draw(context) {
            // context.lineWidth = 5;
            // context.strokeStyle = 'white'
            // context.beginPath();
            // context.arc(this.x + this.width/2 - 20, this.y + this.height/2, this.width/3, 0, Math.PI * 2);
            // context.stroke();
            // context.strokeStyle = 'white'
            // context.strokeRect(
            //     this.x,
            //     this.y,
            //     this.width,
            //     this.height
            // );
            // context.beginPath();
            // context.arc(
            //     this.x + this.width / 2,
            //     this.y + this.height/2,
            //     this.width/2,
            //     0,
            //     Math.PI * 2
            // )
            // context.stroke()
            // context.strokeStyle = 'blue'
            // context.beginPath();
            // context.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
            // context.stroke()
            context.drawImage(
                this.image, 
                this.frameX * this.width,
                0 * this.height,
                this.width,
                this.height,
                this.x, 
                this.y,
                this.width, 
                this.height
                );
        }

        update(deltaTime) {
            if(this.frameX >= this.maxFrame) {
                this.frameX = 0;
            }
            else this.frameX++;
            this.x -= this.speed;

            if(this.x < 0 - this.width) {
                this.markedForDelation = true;
                score++;
            }

            if(score > 10 )
            {
                this.speed = 10;
            }
        }

    }

    function handleEnemies(deltaTime) {
       if(enemyTimer > enemyInterval + randomEnemyInterval){
             enemies.push(new Enemy(canvas.width, canvas.height));
             randomEnemyInterval = Math.random() * 1000 + 100;
             enemyTimer = 0;
       }else {
            enemyTimer += deltaTime;
       }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        })

        enemies = enemies.filter(enemy => !enemy.markedForDelation)

    }

    function displayStatusText(context) {
      

        context.textAlign = 'left';
        context.font = '20px Arial';
        context.fillStyle = 'yellow';
        context.fillText('SCORE : ' + score, 20,40)

        if(score < 4 ) {
            tombolScroll.classList.add("active");
        }
        else{
            tombolScroll.classList.remove("active")
        }

        
        if(gameOver) {
            context.textAlign = 'center';
            context.fillStyle = 'white';
            context.fillText('GAME OVER', canvas.width/2, 200);
            context.fillStyle = 'black';
            context.fillText('GAME OVER,swipe down to restrat!', canvas.width/2 ,250)
            tombolScroll.classList.remove("active")
        }

    


    }

    function toggleFullScreen() {
        // if(!document.fullscreenElement) {
        //     canvas.requestFullscreen().catch(err => {
        //         alert(`Error, tidak dapat mengaktifkan mode layar penuh : ${err.message}`)
        //     });
        // }else{
          
        //     document.exitFullscreen();
        // }
        
      
        const element = document.documentElement;
  
    
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            // Pengguna dalam mode layar penuh, maka keluar dari mode layar penuh
           
         
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {
                   
                    // Hapus kelas 'active' dari tombol setelah berhasil keluar dari mode layar penuh
                    console.log('hallo')
                    fullScreenButton.classList.remove('active');
                });
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen().then(() => {
                   
                    fullScreenButton.classList.remove('active');
                });
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen().then(() => {
                    fullScreenButton.classList.remove('active');
                });
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen().then(() => {  
                    fullScreenButton.classList.remove('active');
                });
            }
           
        } else {
            // Pengguna tidak dalam mode layar penuh, aktifkan mode layar penuh
            if (element.requestFullscreen) {
                element.requestFullscreen().then(() => {
                    // Tambahkan kelas 'active' ke tombol setelah berhasil masuk ke mode layar penuh
                    fullScreenButton.classList.add('active');
                });
            } else if (element.mozRequestFullScreen) { /* Firefox */
                element.mozRequestFullScreen().then(() => {
                    fullScreenButton.classList.add('active');
                });
            } else if (element.webkitRequestFullscreen) { /* Chrome, Safari, and Opera */
                element.webkitRequestFullscreen().then(() => {
                    fullScreenButton.classList.add('active');
                });
            } else if (element.msRequestFullscreen) { /* IE/Edge */
                element.msRequestFullscreen().then(() => {
                    fullScreenButton.classList.add('active');
                });
            }else if(element.webkitExitFullscreen){
                element.webkitRequestFullscreen().then(() => {
                    console.log('cek')
                });
            }      
        }
    }
    fullScreenButton.addEventListener('click', toggleFullScreen);

    document.querySelector('.fullScreenButton1').addEventListener('click', function() {
        document.webkitExitFullscreen()
        fullScreenButton.classList.remove('active')
    })

    

    function restartGame() {
        player.restart()
        background.restart()
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0)

   
    }

   

    const input = new inputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    // const enemy1 = new Enemy(canvas.width, canvas.height);    

    


    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 2000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        
        ctx.clearRect(0,0, canvas.width, canvas.height)
        background.draw(ctx)
        background.update()
        player.draw(ctx);
        player.update(input, deltaTime, enemies);
        handleEnemies(deltaTime);
        displayStatusText(ctx)
     
        if(!gameOver)  requestAnimationFrame(animate);
    }

    animate(0);

})