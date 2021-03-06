/* eslint-env jquery */
/* global database window WebSocket YT AudioPlayer Network*/

//Requires Firebase API. For any documentation questions regarding this,
//Please refer to https://firebase.google.com/docs/reference/js

//Requires Youtube Player API. For any documentation questions regarding this,
//Please refer to https://developers.google.com/youtube/js_api_reference

require("audioplayer.js");
require("network.js");

//audio players
var youtubePlayer = new AudioPlayer(0);
var soundCloudPlayer = new AudioPlayer(1);

//network client connection
var fullstackConnection = new Network("INSERT URL", "8080");

//firebase references for (read-only) database interaction
var roomRef;
var songPlayingRef;
var songListRef;
var usersRef;

//JQuery ready function callback for when the webpage is ready
$("document").ready(function() {
    //setting up audio player systems
    youtubePlayer.setup();
    soundCloudPlayer.setup();

    //attempt to connect
    fullstackConnection.connect();

    //hide audio player systems as we don't know what is playing yet
    youtubePlayer.hide();
    soundCloudPlayer.hide();

    //find the location of the room from the url that was given to us
    var room = window.location.pathname;
    room = room.substring(room.lastIndexOf("/"), room.lastIndexOf("."));

    //establishing all the references we will need and try to minimize the amount of mass data updating necessary
    roomRef = database.ref("rooms" + room);
    songPlayingRef = roomRef.child("song-playing");
    songListRef = roomRef.child("song-list");
    usersRef = roomRef.child("users");

    initialize();
});

/**
 * Initializes events for firebase interaction (read-only)
 * @initialize
 */
function initialize()
{
    //setting up current playing song events
    songPlayingRef.on("child_changed", onSongChanged);

    //setting up song list events
    songListRef.on("child_added", onSongAdded);
    songListRef.on("child_removed", onSongRemoved);
    songListRef.on("child_changed", onSongUpvote);

    //setting up user events
    usersRef.on("child_added", onUserJoin);
    usersRef.on("child_removed", onUserLeave);
    usersRef.on("child_changed", onUserUpdate);
}

/**
 * Called when the current playing song is changed to a new song
 * @onSongChanged
 * @param {DataSnapshot} [childSnapshot] the current instance of the child and it's retained values
 * @param {String} [prevChildKey] a string containing the key of the previous sibling child by sort order, or null if it is the first child.
 */
function onSongChanged(childSnapshot, prevChildKey)
{

}

/**
 * Called when a song has been added to the song list
 * @onSongAdded
 * @param {DataSnapshot} [childSnapshot] the current instance of the child and it's retained values
 * @param {String} [prevChildKey] a string containing the key of the previous sibling child by sort order, or null if it is the first child.
 */
function onSongAdded(childSnapshot, prevChildKey)
{

}

/**
 * Called when a song has been removed from the song list
 * @onSongRemoved
 * @param {DataSnapshot} [oldChildSnapshot] the instance of the removed child and it's retained values
 */
function onSongRemoved(oldChildSnapshot)
{

}

/**
 * Called when a song has been upvoted (the only instance of change) by a user
 * @onSongUpvote
 * @param {DataSnapshot} [childSnapshot] the current instance of the child and it's retained values
 * @param {String} [prevChildKey] a string containing the key of the previous sibling child by sort order, or null if it is the first child.
 */
function onSongUpvote(childSnapshot, prevChildKey)
{

}

/**
 * Called when a new user enters the party room
 * @onUserJoin
 * @param {DataSnapshot} [childSnapshot] the current instance of the child and it's retained values
 * @param {String} [prevChildKey] a string containing the key of the previous sibling child by sort order, or null if it is the first child.
 */
function onUserJoin(childSnapshot, prevChildKey)
{

}

/**
 * Called when a user leaves the party room
 * @onUserLeave
 * @param {DataSnapshot} [oldChildSnapshot] the instance of the removed child and it's retained values
 */
function onUserLeave(oldChildSnapshot)
{

}

/**
 * Called when a users data is being updated to reflect current meta data
 * @onUserUpdate
 * @param {DataSnapshot} [childSnapshot] the current instance of the child and it's retained values
 * @param {String} [prevChildKey] a string containing the key of the previous sibling child by sort order, or null if it is the first child.
 */
function onUserUpdate(childSnapshot, prevChildKey)
{

}

var player;
var shouldMute = true;
var socket;
var doPause = true;

function initialize()
{
    if(shouldMute)
    {
        player.mute();
    }

    var url = window.location.pathname;
    url = url.substring(url.lastIndexOf("/"), url.lastIndexOf("."));

    var socket = setupWebSocket();

    //THIS SHOULD BE REMOVED LATER
    url = "/Test";

    var room = database.ref("rooms" + url);
    var songs = database.ref("rooms" + url + "/songs");
    var currentSong = database.ref("rooms" + url + "/currentsong");

    room.once("value", function(snapshot)
    {
        $("#room-name").text(snapshot.val().name);
        $("#room-code").text("#" + url.substring(1));
    });

    songs.on("value", function(snapshot)
    {
        var songsObject = snapshot.val();
        var songsArray = Object.keys(songsObject);
        var rightContainer = $("#right");
        var children = rightContainer.children();

        while(children.length - 3 <= songsArray.length)
        {
            var copy = children[1].cloneNode(true);
            var songData = $(copy).children()[0];

            $(songData.childNodes[1]).click(function()
            {
                //socket.send({"type":"vote-update", "vote":"upvote"});

                var element = this.parentNode.parentNode;

                var mode = (this.src.endsWith("img/upvoteClicked.png") ? -1 : 1);
                mode += (this.parentNode.childNodes[5].src.endsWith("img/downvoteClicked.png") ? 1 : 0);

                if(mode == 2)
                {
                    this.parentNode.childNodes[5].src = "img/downvote.png";
                }

                if(mode != -1)
                {
                    this.src = "img/upvoteClicked.png";
                }
                else
                {
                    this.src = "img/upvote.png";
                }

                songsObject[element.id].votes += mode;
                room.child("songs").child(element.id).update({"votes":songsObject[element.id].votes});
            });

            $(songData.childNodes[5]).click(function()
            {
                //socket.send({"type":"vote-update", "vote":"downvote"});

                var element = this.parentNode.parentNode;

                var mode = (this.parentNode.childNodes[1].src.endsWith("img/upvoteClicked.png") ? 1 : 0);
                mode += (this.src.endsWith("img/downvoteClicked.png") ? -1 : 1);

                if(mode == 2)
                {
                    this.parentNode.childNodes[1].src = "img/upvote.png";
                }

                if(mode != -1)
                {
                    this.src = "img/downvoteClicked.png";
                }
                else
                {
                    this.src = "img/downvote.png";
                }

                songsObject[element.id].votes -= mode;
                room.child("songs").child(element.id).update({"votes":songsObject[element.id].votes});
            });

            $(children[1]).after(copy);
            children = $("#right").children();
        }

        while(children.length - 4 > songsArray.length)
        {
            children[children.length - 3].remove();
            children = $("#right").children();
        }

        rightContainer = $("#right");

        for (var i in songsObject)
        {
            var song = songsObject[i];

            var songElement = $(children[song.position + 1]);

            songElement.attr("id", i);
            console.log(songElement);
            $(songElement.children()[0].childNodes[3]).text(song.votes);

            songData = songElement.children()[1];

            $(songData.childNodes[1]).text(song.name);
            $(songData.childNodes[3]).text(song.artist);
            $(songData.childNodes[5]).text(song.album);
            $(songData.childNodes[7]).text(song.time);
            $(songData.childNodes[9]).text(song.name);

            songElement.show();
        }
    });

    currentSong.on("value", function(snapshot)
    {
        var songData = snapshot.val();
        $($("#art-container").children()[0]).attr("src", songData.imgSrc);
        $("#song-title").text(songData.name);
        $("#song-artist").text(songData.artist);
        $("#song-album").text(songData.album);
        $("#music-player-skip-vote-count").text(songData.skipVotes);

        $("#art-container").css("visibility", "visible");
        $("#song-data").css("visibility", "visible");

        if(songData.source == 0)
        {
            doPause = true;
            player.loadVideoById(songData.url);
            $("#youtubeplayer").css("visibility", "visible");
            $("#music-player-progress-bar-value").width("0%");
        }
    });

    var offTop = true;
    var offBot = true;

    $("#searchbar-container").css("borderTop", "1px solid black");

    $("#right").scroll(function(e)
    {
        if($(this).scrollTop() > 50)
        {
            if(offTop)
            {
                $("#room-info").css("border-bottom", "1px solid black");
                offTop = false;
            }
        }
        else if(!offTop)
        {
            $("#room-info").css("border-bottom", "");
            offTop = true;
        }

        if(this.scrollHeight - 700 < $(this).scrollTop())
        {
            if(offBot)
            {
                $("#searchbar-container").css("borderTop", "");
                offBot = false;
            }
        }
        else if(!offBot)
        {
            $("#searchbar-container").css("borderTop", "1px solid black");
            offBot = true;
        }
    });

    $("#music-player-mute").click(function()
    {
        shouldMute = !shouldMute;

        $("#music-player-mute").attr("src", (shouldMute ? "img/mute.png" : "img/unmute.png"));

        if(shouldMute)
        {
            player.mute();
        }
        else
        {
            player.unMute();
        }
    });

    $("#music-player-skip-button").click(function()
    {
        socket.send(JSON.stringify({"type":"skip-vote-update"}));
    });
}

function onYouTubeIframeAPIReady()
{
    player = new YT.Player("youtubeplayer", {
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
        events: {
            "onReady": onPlayerReady,
            "onStateChange" : onStateChange
        }
    });
    $("#youtubeplayer").css("visibility", "hidden");
}

function onPlayerReady(event)
{
    $("document").ready(initialize);
}

function onStateChange(event)
{
    if(event.data == 1)
    {
        //$("#music-player-progress-bar-value").animate({width:"100%"}, player.getDuration() * 1000);
        startTimer();
    }
    console.log(event.data + " " + doPause);
    if(event.data == 3 && doPause)
    {
        player.pauseVideo();
    }
}

function startTimer()
{
    $("#music-player-progress-bar-value").width((player.getCurrentTime() / player.getDuration()) * 100 + "%");

    var time = parseInt(player.getCurrentTime(), 10);
    $("#music-player-time-played").text(parseInt((time / 60), 10) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60));

    time = parseInt(player.getDuration() - player.getCurrentTime(), 10);
    if(player.getDuration() - player.getCurrentTime() < .2)
    {
        $("#music-player-time-played").text("0:00");
        $("#music-player-time-remaining").text("0:00");

        socket.send(JSON.stringify({"type":"video-ended"}));
    }
    else
    {
        $("#music-player-time-remaining").text("-" + parseInt((time / 60), 10) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60));
        setTimeout(function() { startTimer();}, 100);
    }
}

function setupWebSocket()
{
    socket = new WebSocket("ws://maxocull.com:9090");

    socket.onopen = function()
    {
        console.log("sent");
        socket.send(JSON.stringify({"type":"join"}));
    };

    socket.onclose = function()
    {
        console.log("could not connect");
    };

    socket.onmessage = function(e)
    {
        var message = JSON.parse(e.data);
        if(message.type == "sync")
        {
            doPause = false;
            player.playVideo();
        }
    };

    window.onbeforeunload = function()
    {
        socket.onclose = function () {}; // Disable onclose event
        socket.close();
    };

    return socket;
}
