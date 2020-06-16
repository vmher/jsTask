"use strict";

(function (window, $) {
  $.fn.countries = function ({
    limit = 10,
    url = "https://restcountries.eu/rest/v2/all?fields=name;capital",
  } = {}) {
    var self = this;

    var countries = [];

    var foundCountries = [];

    function getCountries() {
      $.ajax({
        url: url,
        method: "get",
        beforeSend: () => {
          $(".loading").addClass("active");
        },
        success: (resp) => {
          countries = resp.map((item) => ({ ...item, vote: 0 }));
          foundCountries = countries;
        },
        complete: () => {
          $(".loading").removeClass("active");
          if (location.reload) {
            getFromStorage();
            loadMore();
          }
        },
      });
    }

    function bindEvents() {
      $(window).on("scroll", lazyLoad);

      $(this).find(".search-filter").on("input", search);
      $(this).on("click", ".btn", vote);
      $(this).find(".sort").on("click", sort);
    }

    function lazyLoad() {
      var scrollHeight = $(document).height();
      var scrollPos = $(this).height() + $(this).scrollTop();
      if ((scrollHeight - 300 >= scrollPos) / scrollHeight == 0) {
        loadMore();
      }
    }

    function search() {
      let value = $(this).val().toLowerCase();
      foundCountries = countries.filter(
        (country) => country.name.toLowerCase().indexOf(value) > -1
      );
      appendCountries(foundCountries);
      $(window).off("scroll");
    }

    function vote() {
      var votes = +$(this).parents(".votes").find("span").html();
      var voteSpan = $(this).parents(".votes").find("span");
      var name = $(this).parents(".country").find(".name").html();
      var countryName = countries.find((x) => x.name == name);
      var className = $(this).attr("class");
      if (className === "btn up") {
        votes += Number(votes < 30);
      } else {
        votes -= Number(votes > 0);
      }
      voteSpan.html(votes);
      countryName.vote = votes;
      sessionStorage.setItem(countryName.name, votes);
    }

    function getFromStorage() {
      let keys = Object.keys(sessionStorage);
      for (let x = 0; x < keys.length; x++) {
        for (let y = 0; y < countries.length; y++) {
          if (countries[y].name == keys[x]) {
            countries[y].vote = sessionStorage.getItem(keys[x]);
          }
        }
      }
    }

    function sort() {
      let sortedCountries = foundCountries.slice();
      sortedCountries.sort((a, b) => b.vote - a.vote);
      appendCountries(sortedCountries);
    }

    function appendItem(country) {
      $(self).find(".countries").append(
        `<div class='country'>
          <div class='info'>
          <p>country name: <span class='name'>${country.name}</span></p>
          <p>capital city: <span>${country.capital}</span></p>
          </div>
          <div class='votes'>
          <p>
          votes <span>${country.vote}</span> <button class='btn up'>&#8679;</button
          ><button class='btn down'>&#8681;</button>
          </p>
          </div>
          </div>`
      );
    }

    function appendCountries(countries) {
      $(self).find(".countries").html("");
      for (let x = 0; x < countries.length; x++) {
        appendItem(countries[x]);
      }
    }

    function loadMore() {
      var y = 0;
      for (let x = 0; x < limit; x++) {
        appendItem(countries[y]);
        y++;
      }
    }

    getCountries();
    bindEvents.call(this);

    return $(this);
  };
})(window, jQuery);
