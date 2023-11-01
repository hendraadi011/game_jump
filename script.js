window.addEventListener('load', function() {
    const index = 0;
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const tombolScroll = document.querySelector('.tombol');

    canvas.width = 1400;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let nomerAcak = 1;
    let gameOver = false;
    let padding = false;
    const fullScreenButton = document.querySelector('.fullScreenButton');
    const exitFullscreenButton = document.querySelector('.fullScreenButton1');
    const itemModalDetail = document.querySelector('#item-detail-modal');

    const questions = [
        {
            question: "https://img.freepik.com/free-photo/hands-holding-letter_53876-63656.jpg?w=360&t=st=1698807709~exp=1698808309~hmac=b0f40344c5e7722d1bab95555f3cb917ce28c823ec08d6bf4006a7c59384d50d",
            optionA: "Desain",
            optionB: "Grafis",
            optionC: "Desain Grafis",
            optionD: " grafik",
            correctOption: "optionC"
        },
    
        {
            question: "https://img.freepik.com/free-vector/hand-drawn-vowels-illustration_23-2150140072.jpg?w=740&t=st=1698803033~exp=1698803633~hmac=cdf67523d6698b13a375f45e81849bc541be059024be548e2d53ac787d151196?",
            optionA: "Desain",
            optionB: "Grafis",
            optionC: "Desain grafis",
            optionD: "Grafik",
            correctOption: "optionA"
        },
    
        {
            question: "https://img.freepik.com/free-vector/hand-drawn-vowels-illustration_23-2150140072.jpg?w=740&t=st=1698803033~exp=1698803633~hmac=cdf67523d6698b13a375f45e81849bc541be059024be548e2d53ac787d151196?",
            optionA: "grafik",
            optionB: "Citra visual",
            optionC: "Karya seni",
            optionD: "desain",
            correctOption: "optionB"
        },
    
        {
            question: "https://img.freepik.com/free-vector/hand-drawn-vowels-illustration_23-2150140072.jpg?w=740&t=st=1698803033~exp=1698803633~hmac=cdf67523d6698b13a375f45e81849bc541be059024be548e2d53ac787d151196?",
            optionA: "garis",
            optionB: "bidang",
            optionC: "warna",
            optionD: "ilustrasi",
            correctOption: "optionD"
        },
    
        {
            question: "https://img.freepik.com/free-vector/hand-drawn-vowels-illustration_23-2150140072.jpg?w=740&t=st=1698803033~exp=1698803633~hmac=cdf67523d6698b13a375f45e81849bc541be059024be548e2d53ac787d151196?",
            optionA: "ilustration",
            optionB: "ilustrate",
            optionC: "ilustrat",
            optionD: "ilustrate",
            correctOption: "optionB"
        },
    
       
    
    ];

    let shuffledQuestions = [];
    
    function handleQustions() {
        while(shuffledQuestions.length <= 4)
        {
            const random = questions[Math.floor(Math.random() * questions.length)];
           if(!shuffledQuestions.includes(random))
           {
            shuffledQuestions.push(random)
           }
        }
    }
   

    function nextQuestion(index) {
        handleQustions();
        const currentQuestion = shuffledQuestions[index];
        document.getElementById('display-question').src = currentQuestion.question;
        document.getElementById('option-one-label').innerHTML = currentQuestion.optionA;
        document.getElementById('option-two-label').innerHTML = currentQuestion.optionB;
        document.getElementById('option-three-label').innerHTML = currentQuestion.optionC;
        document.getElementById('option-four-label').innerHTML = currentQuestion.optionD;
       
    }

    function checkForAnswe() {
        const currentQuestion = shuffledQuestions[nomerAcak];
        const currentQuestionAnswer = currentQuestion.correctOption;
        const options = document.getElementsByName('option');
        let correctOption = null;
        console.log(currentQuestion)

        options.forEach((option) => {
           if(option.value === currentQuestionAnswer){
            correctOption = option.labels[0].id;
           }
        })

        if(options[0].checked === false && options[1].checked === false && options[2].checked === false && options[3].checked === false) {
            document.getElementById('option-modal').style.display = "flex"
        }

        options.forEach((option) => {
            if(option.checked === true && option.value === currentQuestionAnswer)
            {

            score += 5;
            document.getElementById('option-modal-benar').style.display = "flex"
            itemModalDetail.style.display = 'none';
            paddingGame()
            padding = false
           
            }else if(option.checked && option.value !== currentQuestionAnswer) {
                // const wrongLabelId = option.labels[0].id;
                // document.getElementById(wrongLabelId).style.background = 'red';
                // document.getElementById(correctOption).style.background = 'green';
               
                document.getElementById('option-modal-salah').style.display = "flex"
                itemModalDetail.style.display = 'none';
                
               

                // wrongAttempt++;
                // indexNumber++;
                // setTimeout(() => {
                //     questionNumber++
                // },100)

            }
         })
       
    }

    
    
   


    document.querySelector('#nextQuestion').addEventListener('click', function(e) {
        e.preventDefault();
        checkForAnswe();
        resetOptionBackground();
        unCheckRadioButtons()
       

    })

    function resetOptionBackground() {
        const options = document.getElementsByName("option");
        options.forEach((option) => {
            document.getElementById(option.labels[0].id).style.background = '';
        })
    }
    function unCheckRadioButtons() {
        const options = document.getElementsByName('option');
        for(let i = 0; i < options.length; i++){
            options[i].checked = false
            
        }
    }

    document.querySelector('.close-modal').addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById('option-modal').style.display = "none"
    });
    document.querySelector('.benar-close').addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById('option-modal-benar').style.display = "none"
    })

    

    
   
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
                    // gameOver = true;
                 
                  
                    padding = true;
                    itemModalDetail.style.display = 'flex';
                    

               
                   
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
                localStorage.setItem("score", score++);
                // score++;

              
              

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
             randomEnemyInterval = Math.random() * 1000 + 110;
             enemyTimer = 0;
    
             if(nomerAcak >= 9 )
             {
                nomerAcak = 1;
             }else if(nomerAcak > 0 && nomerAcak < 9) {
                nomerAcak++
             }
             console.log(nomerAcak)

             nextQuestion(nomerAcak)
            

            
            
             
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
            tombolScroll.classList.remove("active");
            itemModalDetail.style.display = 'none';
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
                    exitFullscreenButton.classList.add('active')
                });
            } else if (element.mozRequestFullScreen) { /* Firefox */
                element.mozRequestFullScreen().then(() => {
                    fullScreenButton.classList.add('active');
                    exitFullscreenButton.classList.add('active')
                });
            } else if (element.webkitRequestFullscreen) { /* Chrome, Safari, and Opera */
                element.webkitRequestFullscreen().then(() => {
                    fullScreenButton.classList.add('active');
                    exitFullscreenButton.classList.add('active')
                });
            } else if (element.msRequestFullscreen) { /* IE/Edge */
                element.msRequestFullscreen().then(() => {
                    fullScreenButton.classList.add('active');
                    exitFullscreenButton.classList.add('active')
                });
            }else if(element.webkitExitFullscreen){
                element.webkitRequestFullscreen().then(() => {
                    fullScreenButton.classList.add('active');
                    exitFullscreenButton.classList.add('active')
                });
            }      
        }

        
    }
    
    fullScreenButton.addEventListener('click', toggleFullScreen);

    exitFullscreenButton.addEventListener('click', function() {
        document.webkitExitFullscreen()
        fullScreenButton.classList.remove('active')
        exitFullscreenButton.classList.remove('active')
    });

    //klik tombol close

    document.querySelectorAll('.close-icon').onclick = (e) => {
        itemModalDetail.style.display = 'none';
        paddingGame()
        padding = false
        e.preventDefault();
    }
    document.querySelectorAll('.close-icon-salah').onclick = (e) => {
        itemModalDetail.style.display = 'none';
        paddingGame()
        padding = false
        e.preventDefault();
    }

  

    

    function paddingGame() {
        // background.restart()
        enemies = [];
        padding = false;
        animate(0)
    }
   
    function jawabanSalah() {
        gameOver = true
    }
    

    function restartGame() {
        player.restart()
        background.restart()
        enemies = [];
        score = 0;
        nomerAcak = 1;
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
     
        
        if(!gameOver && !padding)  requestAnimationFrame(animate);
    }

    animate(0);

})


