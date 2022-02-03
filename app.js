var express = require("express");
app = express();
axios = require("axios");
app.set("view engine", 'ejs');
app.use(express.static("public"));

app.get('/', function(req, res) {
    res.render('index');
})

app.get('/user', function(req, res) {
    var name = req.query.search;
    var user = axios({
        method: 'get',
        url: 'https://api.github.com/users/' + name,
        headers: {
            'User-Agent': name
        }

    });

    var repo = axios({
        method: 'get',
        url: 'https://api.github.com/users/' + name + '/repos',
        headers: {
            'User-Agent': name
        }

    });

    axios.all([user, repo]).then(function(response) {
        if (response[0].status == 200 && response[1].status == 200) {
            var userData = response[0].data;
            var repoData = response[1].data;
            res.render('result', { user: userData, repo: repoData });
        } else
            res.render('err');

    }).catch(function(error) {
        if (error)
            res.render('err');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);