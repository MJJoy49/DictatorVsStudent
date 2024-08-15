
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart');
const hitSound = new Audio("./asset/audio/enemyShoot.wav");
const over = new Audio("./asset/audio/sojon.wav");

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
let finalScore=0;

const scoreElement = document.getElementById('score');

if (innerWidth <= 425) {
    canvas.height = innerHeight-90;
}

else if (innerWidth <= 768 && innerWidth >= 424) {
    canvas.height = innerHeight-100;
}

else {
    canvas.height = innerHeight-100;
}

canvas.width = innerWidth-100;



class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        };

        this.rotation = 0;
        this.opacity = 1;

        // Fighter image 
        const fighterImg = new Image();
        fighterImg.src = "./asset/player.png";

        fighterImg.onload = () => {
            const scale = innerWidth <= 425 ? 0.10 : 0.15;
            this.fighterImg = fighterImg;
            this.height = fighterImg.height * scale;
            this.width = fighterImg.width * scale;

            if (innerWidth <= 425) {

                this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - 50 
            };
            } else {
                this.position = {
                    x: canvas.width / 2 - this.width / 2,
                    y: canvas.height - 85
                };
            }
            
        };
    }

    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        );
        c.rotate(this.rotation);
        c.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        );

        if (this.fighterImg) {
            c.drawImage(
                this.fighterImg,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        }

        c.restore();
    }

    update() {
        if (this.fighterImg) {
            this.draw();
            this.position.x += this.velocity.x;
        }
    }
}




class Enemy {
    static flag = 1;

    constructor({ position }) {
        this.velocity = {
            x: 0,
            y: 0
        };

        // Image options
        this.photo = {
            1: "./asset/police.png",
            2: "./asset/sh.png",
            3: "./asset/slig.png",
            4: "./asset/k.png",
            5: "./asset/s.png",
            6: "./asset/p.png",
            7: "./asset/police.png",
            8: "./asset/slig.png",
            9: "./asset/police.png"
        };

        let fighterImg = new Image();
        fighterImg.src = this.photo[Enemy.flag];

        Enemy.flag += 1;
        if (Enemy.flag > 9) {
            Enemy.flag = 1;
        }

        fighterImg.onload = () => {
            this.fighterImg = fighterImg;

            
            if (innerWidth <= 425) {
                this.width = 25; 
                this.height = 30; 
            }

            else if (innerWidth <= 768 && innerWidth >= 424) {
                this.width = 35; 
                this.height = 40; 
            }
            
            else {
                this.width = 50; 
                this.height = 60; 
            }

            this.position = {
                x: position.x,
                y: position.y
            };
        };
    }

    draw() {
        if (this.fighterImg) {
            c.drawImage(
                this.fighterImg,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        }
    }

    update({ velocity }) {
        if (this.fighterImg) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }

    shoot(enemyBullets) {
        enemyBullets.push(new EnemyBullet({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }));
    }
}


















class Bullet {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;

        this.radius = 4;
    }

    draw() {
        c.beginPath();
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        );
        c.fillStyle = "red";
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}





class EnemyBullet {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;

        this.width = 3;
        this.height= 10;
    }

    draw() {
        c.fillStyle="white";
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}





class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        };

        this.velocity = {
            x: 0,
            y: 0
        };

        if (innerWidth <= 425) {
            this.velocity.x =this.velocity.x+2;
        }

        else if (innerWidth <= 768 && innerWidth >= 424) {
            this.velocity.x =this.velocity.x+3;
        }
        
        else {
            this.velocity.x =this.velocity.x+4;
        }

        this.enemy = [];

        const enemyWidth = innerWidth <= 425 ? 25 : 50;
        const enemyHeight = innerWidth <= 425 ? 30 : 60;

        this.width = 3 * enemyWidth;

        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                this.enemy.push(new Enemy({
                    position: {
                        x: x * enemyWidth,
                        y: y * enemyHeight
                    }
                }));
            }
        }
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            

            if (innerWidth <= 425) {
                this.velocity.y =25;
            }

            else if (innerWidth <= 768 && innerWidth >= 424) {
                this.velocity.y =30;
            }
            
            else {
                this.velocity.y =45;
            }
        }
    }
}










const playerSpeed = 7;
const player = new Player();
const bullets = [];
const grid=[];
const enemyBullets=[];

const keys = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    Space: {
        pressed: false
    }
};

let frame=0;
let gameOver=false;




function restartGame() {
    over.pause();
    over.currentTime = 0;
    scoreElement.style.display="block";
    player.position.x = canvas.width / 2 - player.width / 2; 
    innerWidth <= 425 ?  player.position.y = canvas.height -50 :  player.position.y = canvas.height -85;


    player.velocity.x = 0;
    bullets.length = 0;
    enemyBullets.length = 0;
    grid.length = 0;
    player.opacity=1;
    frame = 0;
    finalScore = 0;
    gameOverElement.style.display = 'none';
    gameOver = false;
    animate(); 
}

restartButton.addEventListener('click', restartGame);










function animate() {
    if (gameOver==true) {
        gameOverElement.style.display = 'block';
        over.play();
        finalScoreElement.textContent = `স্বৈরাচার পতন: ${finalScore} টি`;
        return;
    }

    
    scoreElement.textContent = `স্বৈরাচার পতন: ${finalScore}`;
    requestAnimationFrame(animate);
    
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    enemyBullets.forEach((enemyBullet, i) => {
        enemyBullet.update();
        
        const playerCenterX = player.position.x + player.width / 2;
        const collisionMargin = (player.width / 3);
    
        if (
            enemyBullet.position.y + enemyBullet.height >= player.position.y &&
            enemyBullet.position.x >= playerCenterX - collisionMargin &&
            enemyBullet.position.x <= playerCenterX + collisionMargin
        ) {
            player.opacity = 0;
            scoreElement.style.display="none";
            
            setTimeout(() => {
                gameOver = true;
            }, 100);
        }
    
        if (enemyBullet.position.y + enemyBullet.height > canvas.height) {
            setTimeout(() => {
                enemyBullets.splice(i, 1);
            }, 0);
        }
    });

    



    bullets.forEach((bullet, index) => {
        if (bullet.position.y + bullet.radius <= 0) {
            setTimeout(() => {
                bullets.splice(index, 1);
            }, 0);
        } else {
            bullet.update();
        }

    });

    
    


    grid.forEach((grid)=>{
        grid.update();


        if (innerWidth <= 425) {
            if (frame % 80 == 0 && grid.enemy.length > 0) {
                grid.enemy[Math.floor(Math.random() * grid.enemy.length)].shoot(enemyBullets);
            }
        }
    
        else if (innerWidth <= 768 && innerWidth >= 424) {
            if (frame % 80 == 0 && grid.enemy.length > 0) {
                grid.enemy[Math.floor(Math.random() * grid.enemy.length)].shoot(enemyBullets);
            }
        }
        
        else {
            if (frame % 100 == 0 && grid.enemy.length > 0) {
                grid.enemy[Math.floor(Math.random() * grid.enemy.length)].shoot(enemyBullets);
            }
        }


        


        grid.enemy.forEach((enemy, i) => {
            enemy.update({ velocity: grid.velocity });

            // Collision detection between player and enemy
            if (
                enemy.position.y + enemy.height >= player.position.y &&
                enemy.position.x + enemy.width >= player.position.x &&
                enemy.position.x <= player.position.x + player.width &&
                enemy.position.y <= player.position.y + player.height
            ) {
                player.opacity = 0;
                 
                setTimeout(() => {
                    gameOver = true;
                }, 100);
            }

            bullets.forEach((bullet, j) => {
                if (
                    bullet.position.y - bullet.radius <= enemy.position.y + enemy.height &&
                    bullet.position.x + bullet.radius >= enemy.position.x &&
                    bullet.position.x - bullet.radius <= enemy.position.x + enemy.width &&
                    bullet.position.y + bullet.radius >= enemy.position.y
                ) {
                    setTimeout(() => {
                        const enemyFound = grid.enemy.find((enemy2) => enemy2 === enemy);
                        const bulletFound = bullets.find((bullet2) => bullet2 === bullet);

                        if (enemyFound && bulletFound) {
                            grid.enemy.splice(i, 1);
                            bullets.splice(j, 1);

                            // Play hit sound
                            hitSound.play();

                            if (grid.enemy.length > 0) {
                                const firstEnemy = grid.enemy[0];
                                const lastEnemy = grid.enemy[grid.enemy.length - 1];
                                grid.width = lastEnemy.position.x - firstEnemy.position.x + lastEnemy.width;
                                grid.position.x = firstEnemy.position.x;
                            }
                            finalScore++;
                        }
                    }, 0);
                }
            });
        });
    });










    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -playerSpeed;
        player.rotation = -0.15;
    } else if (keys.ArrowRight.pressed && (player.position.x + player.width) <= canvas.width) {
        player.velocity.x = playerSpeed;
        player.rotation = 0.15;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }

    

    if (innerWidth <= 425) {
        if (frame%180==0) {
            grid.push(new Grid())
            
        }
    }

    else if (innerWidth <= 768 && innerWidth >= 424) {
        if (frame%150==0) {
            grid.push(new Grid())
            
        }
    }
    
    else {
        if (frame%150==0) {
            grid.push(new Grid())
            
        }
    }

    
    frame++;
}







animate();












addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            break;

        case " ":
            keys.Space.pressed = true;
            break;

        default:
            break;
    }
});

addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;

        case " ":
            keys.Space.pressed = false;
            bullets.push(new Bullet({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }));
            break;

        default:
            break;
    }
});


























// Mobile controls
const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const shootButton1 = document.getElementById("shoot1");
const shootButton2 = document.getElementById("shoot2");

leftButton.addEventListener("touchstart", () => {
    keys.ArrowLeft.pressed = true;
});

leftButton.addEventListener("touchend", () => {
    keys.ArrowLeft.pressed = false;
});

rightButton.addEventListener("touchstart", () => {
    keys.ArrowRight.pressed = true;
});

rightButton.addEventListener("touchend", () => {
    keys.ArrowRight.pressed = false;
});

shootButton1.addEventListener("touchstart", () => {
    keys.Space.pressed = true;
    bullets.push(new Bullet({
        position: {
            x: player.position.x + player.width / 2,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -10
        }
    }));
});

shootButton1.addEventListener("touchend", () => {
    keys.Space.pressed = false;
});


shootButton2.addEventListener("touchstart", () => {
    keys.Space.pressed = true;
    bullets.push(new Bullet({
        position: {
            x: player.position.x + player.width / 2,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -10
        }
    }));
});

shootButton2.addEventListener("touchend", () => {
    keys.Space.pressed = false;
});

