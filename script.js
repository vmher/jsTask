'use strict';

(function (window, $) {
  $.fn.countries = function () {
    var self = this;

    var countries = [];

    function getCountries() {
      $.ajax({
        url: "https://restcountries.eu/rest/v2/all?fields=name;capital",
        method: "get",
        beforeSend: () => {
          $(".loading").addClass("active");
        },
        success: (resp) => {
          countries = resp.map((item) => ({ ...item, vote: 0 }));
          loadMore();
        },
        complete: () => {
          $(".loading").removeClass("active");
        },
      });
    }

    function bindEvents() {
      $(window).on('scroll', lazyLoad);

      $(this).find('.search-filter').on('input', search);
      $(this).on('click', '.btn', vote);
      $(this).find('.sort').on('click', sort);
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
      let foundCountries = countries.filter(
        (country) => country.name.toLowerCase().indexOf(value) > -1
      );
      appendCountries(foundCountries);
    }

    function vote(evt) {
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
    }

    function sort() {
      $(this).val("");
      let sortedCountries = countries.slice();
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
      for (let x = 0; x < 10; x++) {
        appendItem(countries[y]);
        y++;
      }
    }

    getCountries();
    bindEvents.call(this);

    return $(this);
  };
})(window, jQuery);
