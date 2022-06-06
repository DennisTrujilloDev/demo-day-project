var map = L.map("map");
map.setView([0, 0], 2);
// [lat, long], zoom 18 city. This is starting location

var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

map.addLayer(Esri_WorldImagery);
//

var circle = L.circle([51.508, -0.11], {
  //first arg lat and long
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: 500000,
});

circle.bindTooltip("Click Me");
//this fn added before circle.addtomap()
//adds hover to item above (circle)
circle.bindPopup(`<p><strong>This is a map</strong></p>`);
//backtips can be used to support multi line strings in editor
//use br to break line on broswer
//can type html in popup string, this msg shows when clicked
// circle.addEventListener()
// circle.addTo(map);

// var circleTwo = L.circle([20, 8], {
//   //first arg lat and long
//   color: "red",
//   fillColor: "#f03",
//   fillOpacity: 0.5,
//   radius: 300000,
// });

// circleTwo.addEventListener("click", clickCountry);
// function clickCountry() {
//   alert("hiiiii");
// }

// circleTwo.addTo(map);

//L from js file from leaflet,  its the endpoint for using leaflet to make maps

const countries = L.geoJSON(COUNTRY_GEOJSON, {
  style: (eachCountry) => {
    return { fillOpacity: 0.6, color: "black", fillColor: "lightgreen" };
    //style options go in object literal above
  },
  onEachFeature: (feature, country) => {
    let chosenCountry = "";
    //feature is data, country rfers to shape on map
    country.addEventListener("click", () => {
      console.log(feature.properties.admin);
      console.log(feature.properties.iso_a2);
      if (feature.properties.iso_a2 === "NG") {
        chosenCountry = "ng";
      } else if (feature.properties.iso_a2 === "TR") {
        chosenCountry = "tr";
      } else if (feature.properties.iso_a2 === "IN") {
        chosenCountry = "in";
      } else if (feature.properties.iso_a2 === "CN") {
        chosenCountry = "cn";
      }
      fetch(`article?chosenCountry=${chosenCountry}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.log(data);
          const news = data.foundItems;
          console.log("NEWS IS", news);
          // const numArticles = news.length >= 15 ? 15 : news.length
          //back end responsbile for decising how many articles shown, looks like line above^
          for (let i = 0; i < news.length; i++) {
            const articleTitle = document.createElement("h2");
            const textnode = document.createTextNode(news[i].title);
            articleTitle.appendChild(textnode);
            document.getElementById("articlesHere").appendChild(articleTitle);

            //metatag find way to display snipit of article
            const articleURL = document.createElement("p");
            const textURL = document.createTextNode(news[i].url);
            articleURL.appendChild(textURL);
            document.getElementById("articlesHere").appendChild(articleURL);

            const articleCat = document.createElement("span");
            const textCat = document.createTextNode(news[i].category);
            articleCat.appendChild(textCat);
            document.getElementById("articlesHere").appendChild(articleCat);

            const articleFave = document.createElement("button");
            articleFave.setAttribute("value", "0");
            articleFave.setAttribute("data-id", "0");
            articleFave.setAttribute("class", "likeButtons");

            const textFave = document.createTextNode("Like");
            articleFave.appendChild(textFave);
            document.getElementById("articlesHere").appendChild(articleFave);
          }
        });
    });
  },
});

const parentEle = document.querySelector("#articlesHere");
parentEle.addEventListener("click", function (event) {
  if (event.target.className === "likeButtons") {
    console.log("hi");
    

    // fetch('messages', {
    //   method: 'delete',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     'name': name,
    //     'msg': msg,
    //   })
    // }).then(function (response) {
    //   window.location.reload()
    // })
  }
});
//country_geojson is var created in countryGEOJSON.js which has info from geojson website
map.addLayer(countries);

// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
// var trash = document.getElementsByClassName("fa-trash");
// const thumbDown = document.getElementsByClassName('fa-thumbs-down');

// Array.from(thumbUp).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const likes = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'likes':likes,
//             'action':'like'
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

// Array.from(thumbDown).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const name = this.parentNode.parentNode.childNodes[1].innerText
//     const msg = this.parentNode.parentNode.childNodes[3].innerText
//     const likes = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//     fetch('thumbsDown', {
//       method: 'put',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         'name': name,
//         'msg': msg,
//         'likes': likes,
//         'action': 'dislike'
//       })
//     })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
//   });
// });

// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });
