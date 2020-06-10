let countries = [];
function getCountries() {
  let url = "https://restcountries.eu/rest/v2/all?fields=name;capital";
  $.ajax({
    url: url,
    method: "get",
    beforeSend: () => {
      $(".loading").addClass("active");
    },
    success: function (resp) {
      for (let x = 0; x < resp.length; x++) {
        countries.push(resp[x]);
        countries[x].vote = 0;
      }
      $(".load-more").click();
    },
    complete: () => {
      $(".loading").removeClass("active");
    },
  });
}
getCountries();

// search
$(document).on("input", "#search", function () {
  $(".countries").html("");
  let value = $(this).val().toLowerCase();
  for (let x = 0; x < countries.length; x++) {
    if (countries[x].name.toLowerCase().match(value)) {
      $(".countries").append(
        `<div class='country'>
            <div class='info'>
            <p>country name: <span class='name'>${countries[x].name}</span></p>
            <p>capital city: <span>${countries[x].capital}</span></p>
            </div>
            <div class='votes'>
            <p>
                votes <span>${countries[x].vote}</span> <button class='up btn'>&#8679;</button
                ><button class='down btn'>&#8681;</button>
            </p>
            </div>
        </div>`
      );
    }
  }
});

// vote +
$(document).on("click", ".up", function () {
  if ($(this).parents(".votes").find("span").html() != 30) {
    let votes = $(this).parents(".votes").find("span").html();
    votes++;
    $(this).parents(".votes").find("span").html(votes);
    let country = countries.find(
      (x) => x.name == $(this).parents(".country").find(".name").html()
    );
    country.vote = votes;
    // sessionStorage.setItem(country, votes);
  }
});

// vote -
$(document).on("click", ".down", function () {
  if ($(this).parents(".votes").find("span").html() != 0) {
    let votes = $(this).parents(".votes").find("span").html();
    votes--;
    $(this).parents(".votes").find("span").html(votes);
    let country = countries.find(
      (x) => x.name == $(this).parents(".country").find(".name").html()
    );
    country.vote = votes;
    // sessionStorage.setItem(country, votes);
  }
});

// sort
$(".sort").click(function () {
  countries = countries.filter((country) => country.vote != 0);
  console.log(Object.keys(sessionStorage));
  if (countries.length > 1) {
    countries.sort((a, b) => b.vote - a.vote);
    console.log(countries);
    $(".countries").html("");
    for (let x = 0; x < countries.length; x++) {
      // var votes = Object.keys(sessionStorage).map(
      //   (countryName) => countryName == countries[x].name
      // );
      // var getValue = sessionStorage.getItem(votes);
      $(".countries").append(
        `<div class='country'>
            <div class='info'>
            <p>country name: <span class='name'>${countries[x].name}</span></p>
            <p>capital city: <span>${countries[x].capital}</span></p>
            </div>
            <div class='votes'>
            <p>
                votes <span>${countries[x].vote}</span> <button class='up btn'>&#8679;</button
                ><button class='down btn'>&#8681;</button>
            </p>
            </div>
        </div>`
      );
    }
  }
});

// lazy load
$(window).on("scroll", function () {
  var scrollHeight = $(document).height();
  var scrollPos = $(window).height() + $(window).scrollTop();
  if ((scrollHeight - 300 >= scrollPos) / scrollHeight == 0) {
    $(".load-more").click();
  }
});
var y = 0;
$(document).on("click", ".load-more", function () {
  for (let x = 0; x < 10; x++) {
    $(".countries").append(
      `<div class='country'>
            <div class='info'>
            <p>country name: <span class='name'>${countries[y].name}</span></p>
            <p>capital city: <span>${countries[y].capital}</span></p>
            </div>
            <div class='votes'>
            <p>
                votes <span>0</span> <button class='up btn'>&#8679;</button
                ><button class='down btn'>&#8681;</button>
            </p>
            </div>
        </div>`
    );
    y++;
  }
});
