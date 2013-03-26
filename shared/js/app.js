var loadTracks = function(input) {
    var query = new Parse.Query("Tracks");
    if (typeof input.config !== "undefined") {
        config(query);
    }
    if (input.after != null) {
        query.greaterThan("updatedAt", input.after); 
    } 

    query.find({ 
        success: function (results) {
            input.on(results);
        }, 
        error: function (err) {
            if (typeof input.error === "undefined") {
                console.log(err);
                return;
            }
            input.error(err);
        }
    }); 
}

var sortByVotes = function(parse_tracks) {
    a = _.clone(parse_tracks).sort(function (a,b) {
        var votesByHref =  function(href) {   
            parse_track = parse_object_href_map[href];
            return parse_track.attributes.votes;
        },
        votes_of_a = a.attributes.votes;
        votes_of_b = b.attributes.votes;
        if (votes_of_a > votes_of_b) return 1;
        if (votes_of_b > votes_of_a) return -1;
        return 0;
    }).reverse();
    return a;
}


var setTrackVote = function(input) {
        if (input.track === "undefined") return;
        input.track.set("votes", input.votes);
        
        input.track.save(null, { 
            success: function(track) {
                input.on(input.track);
            },
            error: input.error
        }); 
    }