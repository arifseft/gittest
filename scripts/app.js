(function() {
  'use strict';

  // Insert injected weather forecast here
  /*var initialWeatherForecast = {
    key: 'newyorks',
    label: 'New York, NY',
    currently: {
      time: 1453489481,
      summary: 'Clear',
      icon: 'partly-cloudy-day',
      temperature: 52.74,
      apparentTemperature: 74.34,
      precipProbability: 0.20,
      humidity: 0.77,
      windBearing: 125,
      windSpeed: 1.52
    },
    daily: {
      data: [
        {icon: 'clear-day', temperatureMax: 55, temperatureMin: 34},
        {icon: 'rain', temperatureMax: 55, temperatureMin: 34},
        {icon: 'snow', temperatureMax: 55, temperatureMin: 34},
        {icon: 'sleet', temperatureMax: 55, temperatureMin: 34},
        {icon: 'fog', temperatureMax: 55, temperatureMin: 34},
        {icon: 'wind', temperatureMax: 55, temperatureMin: 34},
        {icon: 'partly-cloudy-day', temperatureMax: 55, temperatureMin: 34}
      ]
    }
  };*/

  var app = {
    isLoading: true,
    hasRequestPending: false,
    visibleCards: {},
    terbaruList: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    terbaruPage: 0
    //,daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh all of the forecasts
    app.updateForecasts();
  });

  /*$(".title").on("click", function (event) {
    event.stopPropagation();

    var $articleEle = $('.article');

    if ($articleEle.hasClass("visible")) {
      $articleEle.removeClass("visible");
      $(".article").removeClass("visible");
    }
    else {
      $articleEle.addClass("visible");
      $(".article").addClass("visible");
    }

  });*/

  //Hamburger menu function
  $("#menu-overlay, .menu-icon, #menu a").on("click", function (event) {
    event.stopPropagation();

    var $menuEle = $('#menu');

    if ($menuEle.hasClass("visible")) {
      $menuEle.removeClass("visible");
      $("#menu-overlay").removeClass("visible");
    }
    else {
      $menuEle.addClass("visible");
      $("#menu-overlay").addClass("visible");
    }

  });
  function article() {
    var id = $('.id').get(onclick);
  }

  /*
    To find device is online or offline
  */

  function onLineStatus(event) {
    console.log("Online: ", navigator.onLine);
    if (navigator.onLine) {
      $("#sw-offline-state").attr("data-offline", false);
      $("#sw-offline-state").html("✕");
      $("#turn-on-notification").attr("disabled", false);
      $(".custom-checkbox").removeClass("offline");
    }
    else {
      $("#sw-offline-state").attr("data-offline", true);
      $("#sw-offline-state").html("✓");
    }
  }

  //Event listener for offline/online events
  window.addEventListener("online", onLineStatus);
  window.addEventListener("offline", onLineStatus);
  

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function(data) {
    //var card = app.visibleCards[data.key];
  var i = 0;
  var terbarujson = data.response[0].terbaru;
  terbarujson.forEach(function(){
    var card = app.visibleCards[terbarujson[i].id];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      //card.querySelector('.location').textContent = data.label;
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      //app.visibleCards[data.key] = card;
      app.visibleCards[terbarujson[i].id] = card;
    }
    //console.log(data.response[0].terbaru.length);
    card.querySelector('.id').textContent = terbarujson[i].id;
    card.querySelector('.title').textContent = terbarujson[i].title;
    card.querySelector('.date').textContent = terbarujson[i].date_publish;
    card.querySelector('.image').src = terbarujson[i].image_url;
    i++;
  });
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  // Gets a forecast for a specific city and update the card with the data
  app.getForecast = function(start) {
    var start = start*10;
    var url = 'http://api.viva.co.id/v/901/terbarulist/start/'+start;
    //var url = 'http://api.viva.co.id/v/901/detail/id/[id]';
    //var url = 'http://localhost/pwa-viva/contoh.json';
    //var url = 'http://192.168.204.7/pwa-viva/contoh.json';
    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function(json) {
            // Only update if the XHR is still pending, otherwise the XHR
            // has already returned and provided the latest data.
            if (app.hasRequestPending) {
              console.log('[App] Forecast Updated From Cache');
              //json.key = key;
              //json.label = label;
              app.updateForecastCard(json);
            }
          });
        }
      });
    }

    app.hasRequestPending = true;
    // Make the XHR to get the data, then update the card
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          //JSON.stringify(response.response[0].terbaru.nomor = key;
          //response.label = label;
          var j = 0;
          var terbarujson = response.response[0].terbaru;

          terbarujson.forEach(function(key) {

            var found = app.terbaruList.some(function (el) {
              return el.id === terbarujson[j].id;
            });
            if (!found) { app.terbaruList.push({id:terbarujson[j].id}); }

            j++;
          });
          app.saveTerbaruList();
          app.hasRequestPending = false;
          app.terbaruPage = app.terbaruPage+1;
          console.log('[App] Forecast Updated From Network');
          app.updateForecastCard(response);
        }
      }
    };
    request.open('GET', url);
    request.send();
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateForecasts = function() {
    var keys = Object.keys(app.visibleCards);
    app.getForecast(app.terbaruPage);
    //alert(keys);
    /*keys.forEach(function(key) {
      app.getForecast(key);
    });*/
  };

  // Save list of cities to localStorage, see note below about localStorage.
  app.saveTerbaruList = function() {
    var terbaruList = JSON.stringify(app.terbaruList);
    // IMPORTANT: See notes about use of localStorage.
    localStorage.terbaruList = terbaruList;
  };

  /*****************************************************************************
   *
   * Code required to start the app
   *
   * NOTE: To simplify this getting started guide, we've used localStorage.
   *   localStorage is a syncronous API and has serious performance
   *   implications. It should not be used in production applications!
   *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
   *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
   *
   ****************************************************************************/

  app.terbaruList = localStorage.terbaruList;
  if (app.terbaruList) {
    app.terbaruList = JSON.parse(app.terbaruList);
    
    console.info('disini');
    var terbaruList = JSON.stringify(app.terbaruList);
    console.info(terbaruList);

    app.getForecast(app.terbaruPage);
    
  } else {
    
    console.info('disitu');
    app.saveTerbaruList();
  }

  // Add feature check for Service Workers here
  if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

})();