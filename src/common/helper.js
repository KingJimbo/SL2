module.exports = function(){

    this.objExists = function (obj){
        return (typeof obj !== "undefined" &&
            obj !== null);
    }

    this.getCurrentDateTimeAsString = function (){
        var date = new Date();
        var sp = '-';
        var dd = date.getDate();
        var mm = date.getMonth()+1; //As January is 0.
        var yyyy = date.getFullYear();

        if(dd<10) dd='0'+dd;
        if(mm<10) mm='0'+mm;
        return (mm+sp+dd+sp+yyyy);
    }

    this.getFuncName = function(fn){
        var f = typeof fn == 'function';
        var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));
        return (!f && 'not a function') || (s && s[1] || 'anonymous');
    }

}