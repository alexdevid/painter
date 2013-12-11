var Ball = function(s, x, y, m, c) {
    this.s = s;
    this.x = x;
    this.y = y;
    this.m = m;
    this.c = c;
    this.$o = $('<div class="ball"></div>');
    this.$o.css({
        top: this.y,
        width: s,
        height: s,
        left: this.x,
        backgroundColor: this.c
    });
    this.G = Const.Gravity( )
    /**
     * Добавление шарика на поле
     * @returns {jQuery}
     */
    this.draw = function() {
        $('#screen').append(this.$o);
        return this;
    }
    
    return this;
}