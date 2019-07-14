module.exports = function(dateHelper){

    if(!dateHelper){
        throw new Error(ERR_MESSAGE_INVALID_ARGS);
    }

    this.dateHelper = dateHelper;

    this.LOG_TYPES = {
        ERROR : 'error',
        WARNING : 'warning',
        INFO : 'info'
    }

    this.attachLogger = function (obj, notRecursive) {
        let name, fn;
        for (name in obj) {
            fn = obj[name];
            if (typeof fn === 'function') {
                obj[name] = (function(name, fn) {
                    var args = arguments;
                    return function() {
                        (function(name, fn) {
                            console.log("calling " + name);
                       }).apply(this, args);
                        return fn.apply(this, arguments);
                    }
                })(name, fn);
            } else if(typeof fn === 'object' && !notRecursive){
                this.attachLogger(fn, true);
            }
        }
    }

    this.log = function (message, logType){
        //message = this.dateHelper.getCurrentDateTimeAsString() + ': ' + message;
        switch(logType){
            case this.LOG_TYPES.ERROR:
                this.logRed(message);
                break;
            case this.LOG_TYPES.WARNING:
                this.logYellow(message);
                break;
            default:
                console.log(message);
                break;
        }
    }

    this.logError = function (error){
        this.log('An error has occured!', this.LOG_TYPES.ERROR);
        this.logRed('message: ' + error.message );
        this.logRed('name: ' + error.name );
        this.logRed('error occured on file: ' + error.filename + ' line: ' + error.lineNumber + ' column: ' + error.columnNumber );
        this.logRed('stacktrace ' + error.stack );
    }

    this.logRed = function (message){
        console.log(message);
    }

    this.logYellow = function (message){
        console.log(message);
    }
};