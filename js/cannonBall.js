window.onload = function() {
    var gameObjects = [],
            canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d');

    var vector2d = function(x, y) {
        var vec = {
            vx: x,
            vy: y,
            /**
             * Масштабирование вектора
             * @param {int} scale масштаб
             */
            scale: function(scale) {
                vec.vx *= scale;
                vec.vy *= scale;
            },
            /**
             * сложение векторов
             * @param {vector2} vec2 второй вектор
             */
            add: function(vec2) {
                vec.vx += vec2.vx;
                vec.vy += vec2.vy;
            },
            /**
             * вычитание вектора
             * @param {vector2} vec2 второй вектор
             */
            sub: function(vec2) {
                vec.vx -= vec2.vx;
                vec.vy -= vec2.vy;
            },
            /**
             * переориентация в противоположном направлении
             */
            negate: function() {
                vec.vx = -vec.vx;
                vec.vy = -vec.vy;
            },
            /**
             * длина вектора
             */
            length: function() {
                return Math.sqrt(vec.vx * vec.vx + vec.vy * vec.vy);
            },
            /***
             * длина вектора в квадрате
             */
            lengthSquared: function() {
                return vec.vx * vec.vx + vec.vy * vec.vy;
            },
            /**
             * превращает вектор в единичный
             */
            normalize: function() {
                var len = Math.sqrt(vec.vx * vec.vx + vec.vy * vec.vy);
                if (len) {
                    vec.vx /= len;
                    vec.vy /= len;
                }
                return len;
            },
            /**
             * поворот
             * @param {int} angle угол в радианах
             */
            rotate: function(angle) {
                var vx = vec.vx,
                        vy = vec.vy,
                        cosVal = Math.cos(angle),
                        sinVal = Math.sin(angle);
                vec.vx = vx * cosVal - vy * sinVal;
                vec.vy = vx * sinVal - vy * cosVal;
            },
            /**
             * дебуг
             */
            toString: function() {
                return '(' + vec.vx.toFixed(3) + ' , ' + vec.vy.toFixed(3) + ')';
            }

        };
        return vec;
    };
    var cannonBall = function(x, y, vector) {
        var gravity = 0,
                that = {
                    x: x,
                    y: y,
                    removeMe: false,
                    move: function() {
                        vector.vy += gravity;
                        gravity += 0.1;
                        that.x += vector.vx;
                        that.y += vector.vy;

                        if (that.y > canvas.height - 150) {
                            that.removeMe = true;
                        }
                    },
                    draw: function() {
                        ctx.beginPath();
                        ctx.arc(that.x, that.y, 5, 0, Math.PI * 2, true);
                        ctx.fill();
                        ctx.closePath();
                    }
                };
        return that;
    };
    var cannon = function(x, y) {
        var mx = 0,
                my = 0,
                angle = 0,
                that = {
                    x: x,
                    y: y,
                    angle: 0,
                    removeMe: false,
                    move: function() {
                        angle = Math.atan2(my - that.y, mx - that.x);
                    },
                    draw: function() {
                        ctx.save();
                        ctx.lineWidth = 2;
                        ctx.translate(that.x, that.y);
                        ctx.rotate(angle);
                        ctx.strokeRect(0, -5, 50, 10);

                        ctx.moveTo(0, 0);
                        ctx.beginPath();
                        ctx.arc(0, 0, 15, 0, Math.PI * 2, true);
                        ctx.fill();
                        ctx.closePath();
                        ctx.restore();
                    }
                };
        canvas.onmousedown = function() {
            var vec = vector2d(mx - that.x, my - that.y);
            vec.normalize();
            vec.scale(25);
            gameObjects.push(cannonBall(that.x, that.y, vec));
        };
        canvas.onmousemove = function(event) {
            var bb = canvas.getBoundingClientRect();
            mx = (event.clientX - bb.left);
            my = (event.clientY - bb.top);
        };
        return that;
    };
    var drawEnvironment = function() {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.9;
        var linGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        linGrad.addColorStop(0, '#00BFFF');
        linGrad.addColorStop(0.5, '#FFFFFF');
        linGrad.addColorStop(0.5, '#55dd00');
        linGrad.addColorStop(1, '#FFFFFF');
        ctx.fillStyle = linGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    };

    gameObjects.push(cannon(50, canvas.height - 150));

    setInterval(function() {
        drawEnvironment();
        gameObjectsFresh = [];

        for (var i = 0; i < gameObjects.length; i++) {

            gameObjects[i].move();
            gameObjects[i].draw();

            if (gameObjects[i].removeMe === false) {
                gameObjectsFresh.push(gameObjects[i]);
            }

        }
        gameObjects = gameObjectsFresh;

    }, 30);
};