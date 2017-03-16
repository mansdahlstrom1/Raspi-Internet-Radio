let utils = {
    activeRadio: 0,
    changeIndex: function(playlist, isNext){
        if (isNext) {
            if (this.activeRadio == playlist.length - 1) 
                this.activeRadio = 0
            else 
                this.activeRadio++
        } else {
            if (activeRadio == 0) 
                this.activeRadio = playlist.length - 1
            else 
                this.activeRadio--
        } 
        return this.activeRadio 
    }

}
module.exports = utils
    