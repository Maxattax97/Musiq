//TODO

var networkVerbose = true;

class Network
{
    constructor(source, port)
    {
        if(networkVerbose)
        {
            console.log("Creating Network instance with values : {source=" + source + ", port=" + port +"}");
        }
        this.source = source;
        this.port = port;
    }

    function connect()
    {
        
    }
}
