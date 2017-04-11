//TODO

var networkVerbose = true;

class Network
{
    /**
     * Constructor for the Network class
     * @Network
     * @param {String} [connectionURL] URL to connect to for establishing a client + server connection.
     * @param {String} [port] Port that the Network will attempt to connect with.
     */
    constructor(connectionURL, port)
    {
        //check for network verbosity for constructor instance creation log
        if(networkVerbose)
        {
            console.log("Creating Network instance with values : {connectionURL=" + connectionURL + ", port=" + port +"}");
        }

        //initializing class variables
        this.connectionURL = connectionURL;
        this.port = port;
    }

    /**
     * Attempt to connect to the designated Server. Will return any troubles it is having.
     * @connect
     */
    connect()
    {

    }
}
