# 06 Server-Side APIs: Weather Dashboard

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```


## My Weather Dashboard

```
I've created a weather dashboard that takes the users input and displays the current and forecasted weather on the screen.
I used one 3 APIs within OpenWeatherMap to grab the current weather, 5-day forecast, and UV index.
Once user searches for a city, the city is then kept in local storage and displayed under the search bar in list format.
Each city in the list can be clicked on and will run the click function for that city and display it again.
It will also erase any duplicates within the list of cities and re-display it (prepend it) on top.

```
https://nicoleobom.github.io/Weather-Dashboard/
