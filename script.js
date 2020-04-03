$(window).on("load", function() {
    var location = prompt("What's your zipcode?");

    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?zip=" + location + "&appid=ee1f399344dd6005017bc6cdb6b32e3b&units=imperial",
        method: "GET"
    }).then(function(response) {
        var weatherID = response.weather[0].id;
        var weatherIcon;

        // Thunderstorm
        if (weatherID >= 200 && weatherID <= 232) {
            weatherIcon = 'http://openweathermap.org/img/wn/11d.png';
        // Drizzle and rain
        } else if ((weatherID >= 300 && weatherID <= 321) || (weatherID >= 500 && weatherID <= 531)) {
            weatherIcon = 'http://openweathermap.org/img/wn/10d.png';
        // Snow
        } else if (weatherID >= 600 && weatherID <= 622) {
            weatherIcon = 'http://openweathermap.org/img/wn/13d.png';
        // Clear
        } else if (weatherID === 800) {
            weatherIcon = 'http://openweathermap.org/img/wn/01d.png';
        // Cloudy
        } else if (weatherID >= 801 && weatherID <= 804) {
            weatherIcon = 'http://openweathermap.org/img/wn/03d12309.png';
        } else {

        }

        var city = response.name;
        var todaysDate = moment().format('MMMM Do, YYYY');
        $("#currentLocation").append("<h2>" + city + "<img src='" + weatherIcon + "'</h2>");
        $("#currentLocation").append("<b>" + todaysDate + "</b><br><br>");

        var temp = Math.round(response.main.temp);
        $("#currentLocation").append("Temperature: " + temp + "° F<br><br>");
      
        var humidity = response.main.humidity;
        $("#currentLocation").append("Humidity: " + humidity + "% <br><br>");
      
        var wind = response.wind.speed;
        $("#currentLocation").append("Wind Speed: " + wind + " MPH <br><br>");

        var lat = response.coord.lat;
        var lon = response.coord.lon;

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=ee1f399344dd6005017bc6cdb6b32e3b&lat=" + lat + "&lon=" + lon,
            method: "GET"
        }).then(function(response) {
            var uv = response.value;
            $("#currentLocation").append("UV Index: " + uv + "<br><br>");
        });

    });

    $.ajax({
        url: "api.openweathermap.org/data/2.5/forecast?zip=" + location + ",us&appid=ee1f399344dd6005017bc6cdb6b32e3b",
        method: "GET"
    }).then(function(response) {
        var day1 = moment().subtract(10, 'days').calendar();
        var day2 = moment().add(1, 'days').calendar();

        console.log(day1);
        console.log(day2);
    });

});