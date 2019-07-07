module.exports = function(){

    this.getCurrentDateTime = function (){
        return new Date();
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
}