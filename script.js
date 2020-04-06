
var todaysDate;

$("button").on("click", function(){
    $("#currentLocation").empty();
    var location = $("#searchBar").val();

    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=ee1f399344dd6005017bc6cdb6b32e3b&units=imperial",
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
            weatherIcon = 'http://openweathermap.org/img/wn/03d.png';
        } else {

        }

        var city = response.name;

        todaysDate = moment().format('MMMM Do, YYYY');
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

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + location + "&appid=ee1f399344dd6005017bc6cdb6b32e3b&units=imperial",
            method: "GET"
        }).then(function(response) {
            $("#title").append("<h2>5-Day Forecast:</h2><br>")
            for (i=0; i<response.list.length; i++) {
                if (response.list[i].dt_txt.indexOf("12:00:00") !== -1) {
                    var newCol = $("<div>").attr("class", "col-md-2 forecast");
    
                    var day = moment(response.list[i].dt, "X").format("MMMM Do");
                    $(newCol).append(day + "<br><br>");

                    var img = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon;
                    $(newCol).append("<img src'" + img + "'>");

                    var nextDayTemp = Math.round(response.list[i].main.temp);
                    $(newCol).append("Temp: " + nextDayTemp + "° F<br>");
        
                    var nextDayHumidity = response.list[i].main.humidity;
                    $(newCol).append("Humidity: " + nextDayHumidity + "%");
        
                    $("#fiveDay").append(newCol);
                }
            }
        });
    

    });

})