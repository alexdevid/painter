var Painter = {
    alpha: 0.01, //  прозрачночть холста
    strokeWidth: 5, //  размер кисти
    strokeStyle: 'rgb(0, 0, 0)', //  цвет по умолчанию
    toolType: 'Brush', //  инструмент по умолчанию
    press: false, //  идет рисование или нет
    mx: 0, //  координата X
    my: 0, //  координата Y

    /**
     * Объявление переменных
     * @returns {undefined}
     */
    DefineVars: function() {
        this.canvas = document.getElementById('Painter'),
                this.ctx = this.canvas.getContext('2d'),
                this.width = this.canvas.parentNode.clientWidth,
                this.height = this.canvas.parentNode.clientHeight,
                this.canvas.width = this.width,
                this.canvas.height = this.height;
                this.strokeStyle = document.getElementById('colorPicker').value;
    },
    /**
     * Инициализация
     * @returns {Painter}
     */
    Init: function() {
        this.DefineVars();
        this.Events();
        this.Tools.init();
        return this;
    },
    /**
     * События
     * @returns {Painter}
     */
    Events: function() {

        /**
         * Нажатие мыши
         */
        this.canvas.onmousedown = function(e) {
            Painter.mx = e.clientX;
            Painter.my = e.clientY;

            Painter.ctx.beginPath();
            Painter.ctx.globalAlpha = Painter.alpha;
            Painter.ctx.strokeStyle = Painter.strokeStyle;
            Painter.ctx.lineWidth = Painter.strokeWidth;
            Painter.ctx.moveTo(Painter.mx, Painter.my);

            Painter.press = true;
        };

        /**
         * Отжатие мыши
         */
        this.canvas.onmouseup = function(e) {
            Painter.mx = e.clientX;
            Painter.my = e.clientY;
            Painter.ctx.lineTo(Painter.mx, Painter.my);

            Painter.press = false;
        };

        /**
         * Движение мыши
         */
        this.canvas.onmousemove = function(e) {
            Painter.mx = e.clientX;
            Painter.my = e.clientY;
            if (Painter.press) {
                Painter.Draw();
            }
        }
        return this;
    },
    /**
     * Процесс рисования
     * @returns {undefined}
     */
    Draw: function() {
        this.Tools.tools[this.toolType].Draw();
    },
    /**
     * Инструменты
     * @type type
     */
    Tools: {
        tools: {
            Brush: {
                id: 'toolBrush',
                Draw: function() {
                    Painter.ctx.globalAlpha = Painter.alpha;
                    console.log(Painter.alpha);
                    Painter.ctx.lineCap = "round";
                    Painter.ctx.lineTo(Painter.mx, Painter.my);
                    Painter.ctx.stroke();
                    Painter.ctx.moveTo(Painter.mx, Painter.my);
                }
            },
            Pencil: {
                id: 'toolPencil',
                Draw: function() {
                    Painter.ctx.globalAlpha = 1;
                    Painter.ctx.lineCap = "square";
                    Painter.ctx.lineTo(Painter.mx, Painter.my);
                    Painter.ctx.stroke();
                    Painter.ctx.moveTo(Painter.mx, Painter.my);
                }
            },
            Eraser: {
                id: 'toolEraser',
                Draw: function() {
                    Painter.ctx.globalAlpha = Painter.alpha;
                    Painter.ctx.strokeStyle = '#ffffff';
                    Painter.ctx.lineTo(Painter.mx, Painter.my);
                    Painter.ctx.stroke();
                    Painter.ctx.moveTo(Painter.mx, Painter.my);
                }
            }
        },
        type: 'Brush',
        /**
         * Инициализация
         * @returns {undefined}
         */
        init: function() {
            this.events();
        },
        /**
         * События
         * @returns {undefined}
         */
        events: function() {
            /**
             * Выбор инструмента
             */
            for (var tool in Painter.Tools.tools) {
                var el = document.getElementById(Painter.Tools.tools[tool].id);
                document.getElementById(Painter.Tools.tools[tool].id).onclick = function(e) {
                    Painter.toolType = this.getAttribute('data-id');
                    Painter.Tools._resetBtnStyle();
                    this.style.backgroundColor = '#aaa';
                };
            }
            ;
            /**
             * Выбор цвета
             */
            var colors = document.getElementsByClassName('color');
            for (var i = 0; i < colors.length; i++) {
                colors[i].onclick = function(e) {
                    Painter.strokeStyle = this.getAttribute('data-color');
                    this.style.backgroundColor = '#aaa';
                };
            }
            ;
            /**
             * Изменение прозрачности
             */
            document.getElementById('opacityValue').onchange = function() {
                if  (5 <= this.value <= 100) {
                    Painter.alpha = this.value;
                } else {
                    this.value = 100;
                    Painter.alpha = 1;
                }
            };
            /**
             * Изменение размера
             */
            document.getElementById('strokeWidthValue').onchange = function() {
                Painter.strokeWidth = this.value;
            };
            /**
             * Изменение цвета
             */
            document.getElementById('colorPicker').onchange = function() {
                Painter.strokeStyle = this.value;
            };
        },
        /**
         * Сброс стилей кнопок
         * @returns {undefined}
         */
        _resetBtnStyle: function() {
            for (var tool in Painter.Tools.tools) {
                var el = document.getElementById(Painter.Tools.tools[tool].id);
                el.style.backgroundColor = '#cccccc';
            }
        },
        sliderChangeEvent: function(id, callback) {
            document.getElementById(id).onmousedown = function() {
                Painter.Tools.id = true;
            };
            document.getElementById(id.replace('Caret', '')).onmouseup = function() {
                Painter.Tools.id = false;
            };
            document.getElementById(id.replace('Caret', '')).onmouseclick = function(e) {
                var caret = document.getElementById(id);
                caret.style.left = (e.offsetX) + 'px';
                var totalWidth = document.getElementById('opacitySlider').offsetWidth;
                var alpha = e.offsetX * 100 / totalWidth;
                Painter.alpha = alpha / 1000;
                document.getElementById('opacityValue').textContent = (alpha / 1000).toFixed(2);
            };
            document.getElementById('PainterPanel').onselectstart = function() {
                return false;
            };
            document.getElementById(id.replace('Caret', '')).onmousemove = function(e) {
                if (Painter.Tools.id) {
                    var caret = document.getElementById(id);
                    caret.style.left = (e.offsetX) + 'px';
                    var totalWidth = document.getElementById('opacitySlider').offsetWidth;
                    var alpha = e.offsetX * 100 / totalWidth;
                    Painter.alpha = (alpha / 100);
                    document.getElementById('opacityValue').textContent = Painter.alpha.toFixed(2);
                }
            };
        }
    }

}

window.onload = function() {
    Painter.Init();
};

