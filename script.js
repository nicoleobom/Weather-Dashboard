// Assign appropriate global variables
var prevSearched;
var showCities;
var cityArray = [];

// On document load, call getSavedCities function
$(document).ready(getSavedCities());

// Grabs previously searched cities and appends them under the search bar
function getSavedCities() {
    prevSearched = JSON.parse(localStorage.getItem("location"));
    if (prevSearched !== null) {
        for (i = 0; i < prevSearched.length; i++) {
            showCities = prevSearched[i];
            var cityDiv = $("<div>");
            var cityLink = $("<a>");
            $(cityLink).attr("class", "searchHist");
            $(cityLink).append(showCities);
            $(cityDiv).append(cityLink);
            $(".previousSearch").prepend(cityDiv);

            // Removes the last item in the list if the list is greater than 7 divs
            if ($(".previousSearch").children().length > 7) {
                $(".previousSearch").children().last().remove();
            }
        }
    }
}

// jQuery event listener for the "enter" keypress
$('#searchBar').keypress(function (e) {
    var key = e.which;
    if (key == 13) {
        $('#search').click();
        return false;
    }
});

// On search button click, empty all content areas, assign local variables, and call ajax function
$("#search").on("click", function () {

    if ($("#searchBar").val() == '') {
        alert("Please enter a valid city name!");
    }

    // Empty out everything that's currently in content sections
    $("#currentLocation").empty();
    $("#title").empty();
    $("#fiveDay").empty();

    // Assign local variables
    var todaysDate;
    var location = $("#searchBar").val();

    // Pull current weather api and then displays the appropriate weather
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=ee1f399344dd6005017bc6cdb6b32e3b&units=imperial",
        method: "GET"
    }).then(function (response) {
        var weatherID = response.weather[0].id;
        var weatherIcon;

        // Thunderstorm
        if (weatherID >= 200 && weatherID <= 232) {
            weatherIcon = 'https://openweathermap.org/img/wn/11d.png';
            // Drizzle and rain
        } else if ((weatherID >= 300 && weatherID <= 321) || (weatherID >= 500 && weatherID <= 531)) {
            weatherIcon = 'https://openweathermap.org/img/wn/10d.png';
            // Snow
        } else if (weatherID >= 600 && weatherID <= 622) {
            weatherIcon = 'https://openweathermap.org/img/wn/13d.png';
            // Clear
        } else if (weatherID === 800) {
            weatherIcon = 'https://openweathermap.org/img/wn/01d.png';
            // Cloudy
        } else if (weatherID >= 801 && weatherID <= 804) {
            weatherIcon = 'https://openweathermap.org/img/wn/03d.png';
            // Atmosphere
        } else if (weatherID >= 701 && weatherID <= 781) {
            weatherIcon = 'https://openweathermap.org/img/wn/50d.png';
            // If anything else, put clouds
        } else {
            weatherIcon = 'https://openweathermap.org/img/wn/03d.png';
        }

        // Call key variables and append them to the appropriate divs to display on screen
        var city = response.name;

        todaysDate = moment().format('MMMM Do, YYYY');
        $("#currentLocation").append("<h2>" + city + "<img src='" + weatherIcon + "'</h2>");
        $("#currentLocation").append("<b>" + todaysDate + "</b><br><br>");
        $("#currentLocation").attr("class", "mainCity");

        var temp = Math.round(response.main.temp);
        $("#currentLocation").append("Temperature: " + temp + "° F<br><br>");

        var humidity = response.main.humidity;
        $("#currentLocation").append("Humidity: " + humidity + "% <br><br>");

        var wind = response.wind.speed;
        $("#currentLocation").append("Wind Speed: " + wind + " MPH <br><br>");

        // Determine latitude and longitude for upcoming UV index API
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        // Within previous ajax function, this ajax will pull the UV api and display on screen with the rest
        // of the information
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=ee1f399344dd6005017bc6cdb6b32e3b&lat=" + lat + "&lon=" + lon,
            method: "GET"
        }).then(function (response) {
            var uv = response.value;

            // If UV index is within a certain range, display its respective color
            if (uv >= 0 && uv <= 2) {
                $("#currentLocation").append("UV Index: <span class='low'>" + uv + "</span><br><br>");
            } else if (uv > 2 && uv <= 5) {
                $("#currentLocation").append("UV Index: <span class='med'>" + uv + "</span><br><br>");
            } else if (uv > 5 && uv <= 7) {
                $("#currentLocation").append("UV Index: <span class='med-high'>" + uv + "</span><br><br>");
            } else if (uv > 7 && uv <= 10) {
                $("#currentLocation").append("UV Index: <span class='high'>" + uv + "</span><br><br>");
            } else {
                $("#currentLocation").append("UV Index: <span class='ultra'>" + uv + "</span><br><br>");
            }

        });

        // This pulls the forecast api and displays under all other info
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q=" + location + "&appid=ee1f399344dd6005017bc6cdb6b32e3b&units=imperial",
            method: "GET"
        }).then(function (response) {
            $("#title").append("<h2>5-Day Forecast:</h2><br>")
            for (i = 0; i < response.list.length; i++) {
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

    // Push into local storage and prepend on the lefthand side
    if (JSON.parse(localStorage.getItem("location")) === null) {
        cityArray.push(location);
        localStorage.setItem("location", JSON.stringify(cityArray));
    } else {
        cityArray = JSON.parse(localStorage.getItem("location"));
        cityArray.push(location);
        localStorage.setItem("location", JSON.stringify(cityArray));
    }
    var cityDiv = $("<div>");
    $(cityDiv).attr("class", "pointer");
    var cityLink = $("<a>");
    $(cityLink).attr("class", "searchHist");
    $(cityLink).append(location);
    $(cityDiv).append(cityLink);
    $(".previousSearch").prepend(cityDiv);

    if ($(".previousSearch").children().length > 7) {
        $(".previousSearch").children().last().remove();
    }
})

// If a previously searched city is clicked, call the on-click function above
$(".previousSearch").on("click", ".searchHist", function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    $("#searchBar").val($(this).html());
    $("#search").trigger("click");

    // If the clicked city has already been searched, remove from the array and add it back in,
    // prepending to the top of the list
    if (cityArray.indexOf($(this).html()) !== -1) {
        for (var i = 0; i < cityArray.length; i++) {
            if (cityArray[i] === $(this).html()) {
                cityArray.splice(i, 1);
                i--;
            }
        }
        cityArray.push($(this).html());
        localStorage.setItem("location", JSON.stringify(cityArray));
        $(".previousSearch").empty();
        getSavedCities();
    }
})
