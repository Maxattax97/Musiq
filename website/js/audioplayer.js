/* global YT */

var audioplayerVerbose = true;
var audioplayerVerboseExtra = false;

class AudioPlayer
{
    /**
     * Constructor for the AudioPlayer class
     * @AudioPlayer
     * @param {Integer} [source] For setting up the Youtube Player, source = 0; for setting up the SoundCloud Player, source = 1
     */
    constructor(source)
    {
        //check for audioplayer verbosity for constructor instance creation log.
        if(audioplayerVerbose) {
            console.log("Creating audioplayer instance with values : {source=" + (["Youtube", "SoundCloud"][source]) + "}");
        }

        //initializing class variables
        this.source = source;
    }

    /**
     * Setup audio player function call, must be called before using the player.
     * @setup
     * @param {Function} [onReadyCallback] Callback function for the event that the player is ready.
     * @param {Function} [onStateCallback] Callback function for the event that the player's state changes.
     */
    setup(onReadyCallback, onStateCallback)
    {
        //Checks if the audioplayer is SoundCloud or Youtube
        if(this.source === 0) {
            //Establishing the events for Youtube, checks in case the values passed are undefined.
            var handleEvents;
            if(onReadyCallback === undefined) {
                handleEvents.onReady = function(event) {
                    //verbosity check for console logging.
                    if(audioplayerVerbose) {
                        console.log("Youtube player is ready");
                    }
                    //parameter callback
                    onReadyCallback(event);
                };
            }
            if(onStateCallback === undefined) {
                handleEvents.onStateChange = function (event) {
                    //verbosity check for console logging.
                    if(audioplayerVerbose) {
                        console.log("Youtube player state has changed to : " + (["Unstarted", "Ended", "Playing", "Paused", "Buffering", "Video Cued"][event.data + 1]));
                    }
                    //parameter callback
                    onStateCallback(event);
                };
            }
            //Creates the player object in the audioplayer class.
            this.player = new YT.Player("youtubeplayer", {
                playerVars: {
                    "allowsInlineMediaPlayback":0,
                    "autoplay": 1,
                    "cc_load_policy":0,
                    "controls": 0,
                    "disablekb":1,
                    "enablejsapi":1,
                    "fs":0,
                    "iv_load_policy":3,
                    "modestbranding":1,
                    "rel" : 0,
                    "showinfo":0,
                },
                events: handleEvents
            });
        } //currently waiting for our soundcloud api key before implementing this portion.
        /*else {

        }*/
        //verbosity check for console logging.
        if(audioplayerVerbose) {
            console.log("Finished setting up the audioplayer, you can now call any other function.");
        }
    }

    /**
     * Mute the audio player
     * @mute
     */
    mute()
    {
        //verbosity check for console logging.
        if(audioplayerVerbose) {
            console.log("Muting this audioplayer.");
        }
        if(this.source === 0) {
            this.player.mute();
        } //currently waiting for our soundcloud api key before implementing this portion.
        /*else {

        }*/
    }

    /**
     * Unmute the audio player
     * @unmute
     */
    unmute()
    {
        //verbosity check for console logging.
        if(audioplayerVerbose) {
            console.log("Unmuting this audioplayer.");
        }
        if(this.source === 0) {
            this.player.unMute();
        } //currently waiting for our soundcloud api key before implementing this portion.
        /*else {

        }*/
    }

    /**
     * Get the current time of the current playing song.
     * @getCurrentTime
     */
    getCurrentTime()
    {
        if(this.source === 0) {
            //extra verbosity check for console logging.
            if(audioplayerVerboseExtra) {
                console.log("Returning Current Time=" + this.player.getCurrentTime());
            }
            return this.player.getCurrentTime();
        } //currently waiting for our soundcloud api key before implementing this portion.
        /*else {

        }*/
    }

    /**
     * Get the remaining time of the current playing song.
     * @getRemainingTime
     */
    getRemainingTime()
    {
        if(this.source === 0) {
            //extra verbosity check for console logging.
            if(audioplayerVerboseExtra) {
                console.log("Returning Remaining Time=" + (this.player.getDuration() - this.player.getCurrentTime()));
            }
            return this.player.getDuration() - this.player.getCurrentTime();
        } //currently waiting for our soundcloud api key before implementing this portion.
        /*else {

        }*/
    }

    /**
     * Get the percentage of time that has been passed of the current playing song.
     * @getPercentComplete
     */
    getPercentComplete()
    {
        if(this.source === 0) {
            //extra verbosity check for console logging.
            if(audioplayerVerboseExtra) {
                console.log("Returning Percent Complete=" + (this.player.getCurrentTime() / this.player.getDuration()));
            }
            return this.player.getCurrentTime() / this.player.getDuration();
        } //currently waiting for our soundcloud api key before implementing this portion.
        /*else {

        }*/
    }
}
