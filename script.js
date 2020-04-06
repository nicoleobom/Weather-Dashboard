var prevSearched;
var showCities;
var cityArray = [];


$(document).ready(getSavedCities());



function getSavedCities() {
    prevSearched = JSON.parse(localStorage.getItem("location"));
    if (prevSearched !== null) {
        for (i=0; i<prevSearched.length; i++) {
            showCities = prevSearched[i];
            var cityDiv = $("<div>");
            $(cityDiv).attr("class", "list-group-item");
            var cityLink = $("<a>");
            $(cityLink).attr("class", "searchHist");
            $(cityLink).append(showCities);
            $(cityDiv).append(cityLink);
            $(".previousSearch").prepend(cityDiv);
            // $(".previousSearch").append(showCities);
        }
    }
}



$("#search").on("click", function(){    
    $("#currentLocation").empty();
    $("#title").empty();
    $("#fiveDay").empty();
    var todaysDate;
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
                    $(newCol).append(day + "<br>");

                    var img = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png";
                    $(newCol).append("<img src='" + img + "'><br>");

                    var nextDayTemp = Math.round(response.list[i].main.temp);
                    $(newCol).append("Temp: " + nextDayTemp + "° F<br>");
        
                    var nextDayHumidity = response.list[i].main.humidity;
                    $(newCol).append("Humidity: " + nextDayHumidity + "%");
        
                    $("#fiveDay").append(newCol);
                }
            }
        });
    });

    cityArray = JSON.parse(localStorage.getItem("location"));
    // if (cityArray === null) {
        cityArray.push(location);
        localStorage.setItem("location", JSON.stringify(cityArray));
    // }
    var cityDiv = $("<div>");
    var cityLink = $("<a>");
    $(cityLink).attr("class", "searchHist");
    $(cityLink).append(location);
    $(cityDiv).append(cityLink);
    $(".previousSearch").prepend(cityDiv);
    

})

$(".searchHist").on("click", function(){
    $("#searchBar").val($(this).html());
    $("#search").trigger("click");
})