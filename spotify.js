//spotify//
var client_id = 'f217948018f644109395e591ab9da52f'; // Your client id
var client_secret = '0904f3353f8c416db75b9e6fdd3eb2e0 '; // Your secret
var redirect_uri = 'REDIRECT_URI'; // Your redirect uri


var stateKey = 'spotify_auth_state';


var app = express();

app.use(express.static(__dirname + '/public'))
    .use(cookieParser());

app.get('/login', function (req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    //  application requests authorization
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get('/callback', function (req, res) {

    // application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

app.get('/refresh_token', function (req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

console.log('Listening on 8888');
app.listen(8888);

//Auth End//



const app = {};

app.getArtist = (artist) => $.ajax({
    url: 'https://api.spotify.com/v1/search',
    method: 'GET',
    dataType: 'json',
    data: {
        type: 'artist',
        q: artist
    }
});


//Getting the artist Obtner el artista
app.getArtistAlbums = (id) => $.ajax({
    url: `https://api.spotify.com/v1/artists/${id}/albums`,
    method: 'GET',
    dataType: 'json',
    data: {
        album_type: 'album',
    }
});

//Getting the Album Tracks Obtiene los track de cada album
app.getAlbumTracks = (id) => $.ajax({
    url: `https://api.spotify.com/v1/albums/${id}/tracks`,
    method: 'GET',
    dataType: 'json'
});

//Getting the albums 
app.getAlbums = function (artists) {
    let albums = artists.map(artist => app.getAristsAlbums(artist.id));
    $.when(...albums)
        .then((...albums) => {
            let albumIds = albums
                .map(a => a[0].items)
                .reduce((prev, curr) => [...prev, ...curr], [])
                .map(album => app.getAlbumTracks(album.id));

            app.getTracks(albumIds);
        });
};

//Getting the tracks
app.getTracks = function (tracks) {
    $.when(...tracks)
        .then((...tracks) => {
            tracks = tracks
                .map(getDataObject)
                .reduce((prev, curr) => [...prev, ...curr], []);
            app.createPlayList(randomPlayList);
        })
};

//Create PlayList Crear la playlists
app.createPlayList = function (songs) {
    const baseUrl = 'https://embed.spotify.com/?theme=white&uri=spotify:trackset:My Playlist:';
    songs = songs.map(song => song.id).join(',');
    $('.loader').removeClass('show');
    $('.playlist').append(`<iframe src="${baseUrl + songs}" height="400"></iframe>`);
}

app.init = function () {
    $('form').on('submit', function (e) {
        e.preventDefault();
        let artists = $('input[type=search]').val();
        $('.loader').addClass('show');
        artists = artists
            .split(',')
            .map(app.getArists);

        $.when(...artists)
            .then((...artists) => {
                artists = artists.map(a => a[0].artists.items[0]);
                console.log(artists);
                app.getAlbums(artists);
            });
    });

}

//Gets the elements of the first element

const getDataObject = arr => arr[0].items;


}

$(app.init);