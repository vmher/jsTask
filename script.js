(function bindEvents() {
  getCountries();

  $(window).on("scroll", function () {
    lazyLoad();
  });

  $(document).on("input", "#search", function () {
    search();
  });

  $(document).on("click", ".up", function () {
    $(this).vote(); // $('.up').on('click', function(){})-i vaxt chem jogum xi chi ashxatum
  });

  $(document).on("click", ".down", function () {
    $(this).vote("down"); // nuyny stex
  });

  $(document).on("click", ".sort", function () {
    sort();
  });
})();

var countries = [];
function getCountries() {
  $.ajax({
    url: "https://restcountries.eu/rest/v2/all?fields=name;capital",
    method: "get",
    beforeSend: () => {
      $(".loading").addClass("active");
    },
    success: function (resp) {
      countries = resp.map((item) => ({ ...item, vote: 0 }));
      loadMore();
    },
    complete: () => {
      $(".loading").removeClass("active");
    },
  });
}

function lazyLoad() {
  var scrollHeight = $(document).height();
  var scrollPos = $(window).height() + $(window).scrollTop();
  if ((scrollHeight - 300 >= scrollPos) / scrollHeight == 0) {
    loadMore();
  }
}

function search() {
  let value = $("#search").val().toLowerCase();
  let foundCountries = countries.filter(
    (country) => country.name.toLowerCase().indexOf(value) > -1
  );
  appendCountries(foundCountries);
}

$.fn.vote = function (up = "up") {
  var votes = $(this).parents(".votes").find("span").html();
  var voteSpan = $(this).parents(".votes").find("span");
  var name = $(this).parents(".country").find(".name").html();
  var countryName = countries.find((x) => x.name == name);
  if (up === "up") {
    votes < 30 ? votes++ : votes; // es pahy chjogeci vonc aveli sirun dnem paymany mekel appendcountries u loadmore-y amusnacnely
  } else {
    votes > 0 ? votes-- : votes;
  }
  voteSpan.html(votes);
  countryName.vote = votes;
};

function sort() {
  $("#search").val("");
  let sortedCountries = countries.slice();
  sortedCountries.sort((a, b) => b.vote - a.vote);
  appendCountries(sortedCountries);
}

function appendCountries(countries) {
  $(".countries").html("");
  for (let x = 0; x < countries.length; x++) {
    $(".countries").append(
      `<div class='country'>
      <div class='info'>
          <p>country name: <span class='name'>${countries[x].name}</span></p>
          <p>capital city: <span>${countries[x].capital}</span></p>
          </div>
          <div class='votes'>
          <p>
          votes <span>${countries[x].vote}</span> <button class='btn up'>&#8679;</button
          ><button class='btn down'>&#8681;</button>
          </p>
          </div>
          </div>`
    );
  }
}

var y = 0;
function loadMore() {
  for (let x = 0; x < 10; x++) {
    $(".countries").append(
      `<div class='country'>
      <div class='info'>
      <p>country name: <span class='name'>${countries[y].name}</span></p>
      <p>capital city: <span>${countries[y].capital}</span></p>
            </div>
            <div class='votes'>
            <p>
            votes <span>${countries[y].vote}</span> <button class='btn up'>&#8679;</button
            ><button class='btn down'>&#8681;</button>
            </p>
            </div>
            </div>`
    );
    y++;
  }
}
