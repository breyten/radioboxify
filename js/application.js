$(document).ready(function() {
    var results = $.get(
        //"http://radiobox2.omroep.nl/track/search.json?q=startdatetime<NOW AND songfile.id>'0'",
        "http://radiobox2.omroep.nl/track/search.json?q=channel.id:'3' AND songfile.id>'0' AND startdatetime>'2013-06-29 09:00:00' AND stopdatetime<'2013-06-29 17:00:00'&order=startdatetime:desc&max-results=100",
        function (data) {
            //console.log(data);
            for (track_idx in data.results) {
                console.log(track);
                var track = data.results[track_idx];
                $('body').append($('<h2>' + track.songfile.artist + ' - ' + track.songfile.title + '</h2>'));
                
                var sp = getSpotifyApi();
                var models = sp.require('$api/models');
                var views = sp.require("$api/views");

                console.log(track.songfile.artist + ' - ' + track.songfile.title);
                var search = new models.Search(track.songfile.artist + ' ' + track.songfile.title);
                search.localResults = models.LOCALSEARCHRESULTS.APPEND;

                var searchHTML = document.getElementById('results');

                search.observe(models.EVENT.CHANGE, function() {
                    var results = search.tracks;
                    var fragment = document.createDocumentFragment();
                    //for (var i=0; i<results.length; i++){
                    var max_res = results.length > 1 ? 1 : 0;
                    for (var i=0; i<max_res; i++){
                        //var link = document.createElement('li');
                        //var a = document.createElement('a');
                        //a.href = results[i].uri;
                        //link.appendChild(a);
                        //a.innerHTML = results[i].name;
                        var single_track = models.Track.fromURI(results[i].uri);
                        var single_track_playlist = new models.Playlist();
                        single_track_playlist.add(single_track);
                        var single_track_player = new views.Player();
                        single_track_player.track = null; // Don't play the track right away
                        single_track_player.context = single_track_playlist;

                        fragment.appendChild(single_track_player.node);
                    }

                    searchHTML.appendChild(fragment);
                });

                search.appendNext();
            }
            
        }
    );
});