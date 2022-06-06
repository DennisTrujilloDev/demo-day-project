module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    //if /profile chnages to /favorites then res.render name changes and the nwould use favorites route on localhost:xxxx/favorites
    //   db.collection("").find( { _id : { $in : [req.user.liked] } } );
    db.collection("demoFirstCol")
      .find( { _id : { $in : [req.user.liked] } })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          likedArticles: result,
        });
      });
  });
  //in profile, will find all the articles with the id is in the liked array
  //then in profile.ejs

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // message board routes ===============================================================

  //sending country name via query params to back end & fetching articles from mediastack========================================================================================

  const apiKey = "7625170bc33b1fe3194db78b1ed38216";
  app.get("/country", function (req, res) {
    console.log("QPARAM IS", req.query);
    //this ^^ will say {countryName:ng}
    res.send({ message: req.query });
  });

  // db.collection.insertMany(
  //   [ <document 1> , <document 2>, ... ],
  //   {
  //      writeConcern: <document>,
  //      ordered: <boolean>
  //   }
  // )

  app.get("/article", async (req, res) => {
    //iso country code in lowercase letters
    let foundItems = await db
    .collection("demoFirstCol")
    .find({ country: req.query.chosenCountry })
    .toArray();
    if (foundItems.length === 0) {
      const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&countries=${req.query.chosenCountry}&languages=en`;
      // urlLink = data.data[0].url;
      const response = await fetch(url);
      const data = await response.json();
      news = data.data
      const numArticles = news.length >= 15 ? 15 : news.length
          
      for(let i=0; i<numArticles; i++){
      // for (let i = 0; i < 15; i++) {
       await db.collection("demoFirstCol").insertOne(
          { ...news[i], likes: 0 },
          (err, result) => {
            if (err) return console.log(err);
            console.log("saved to database");
          }
        );
      }

     foundItems = await db.collection("demoFirstCol")
        .find({ country: req.query.chosenCountry })
        .toArray()
      console.log("FOUND = ", foundItems);
    }
    res.send({ foundItems });

    // res.send({articles: db.demoFirstCol.find({})})
  });

  app.put("/likeArticle", (req, res) => {
    db.collection("users").findOneAndUpdate(
      { userID: req.body.name, msg: req.body.msg },
      {
        $set: {
          thumbUp: req.body.thumbUp + 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });





















  

  app.put("/messages", (req, res) => {
    db.collection("messages").findOneAndUpdate(
      { name: req.body.name, msg: req.body.msg },
      {
        $set: {
          thumbUp: req.body.thumbUp + 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.put("/thumbDown", (req, res) => {
    db.collection("messages").findOneAndUpdate(
      { name: req.body.name, msg: req.body.msg },
      {
        $set: {
          thumbUp: req.body.thumbUp - 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.delete("/messages", (req, res) => {
    db.collection("messages").findOneAndDelete(
      { name: req.body.name, msg: req.body.msg },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
