'use strict';

$(document).ready(function () {
    let city;
    let cities;
    // Pulls the current date
    let NowMoment = moment().format("l");
  
    // adds days to moment for forecast
    let day1 = moment().add(1, "days").format("l");
    let day2 = moment().add(2, "days").format("l");
    let day3 = moment().add(3, "days").format("l");
    let day4 = moment().add(4, "days").format("l");
    let day5 = moment().add(5, "days").format("l");

    // button functionality to intercept the click event (search city button)
    $("#submit").on("click", (e) => {
            e.preventDefault();
            city = $("#city-input").val();
            getWeatherData(city);
          });

    // event handler for clear button
    $("#clr-btn").click(() => {
        cities = []; //cities equals an empty array
        listCities();
        $("#icon").html("");
        $("#city-name").html("");
        $("#city-cond").text("");
        $("#temp").text("");
        $("#humidity").text("");
        $("#wind-speed").text("");
        $("#date1").text("");
        $("#date2").text("");
        $("#date3").text("");
        $("#date4").text("");
        $("#date5").text("");
        $("#uv-index").text("");
        $("#high").text("");
        $("#temp1").text("");
        $("#temp2").text("");
        $("#temp3").text("");
        $("#temp4").text("");
        $("#temp5").text("");
        $("#hum1").text("");
        $("#hum2").text("");
        $("#hum3").text("");
        $("#hum4").text("");
        $("#hum5").text("");
        $("#icon1").html("");
        $("#icon2").html("");
        $("#icon3").html("");
        $("#icon4").html("");
        $("#icon5").html("");
    });
       
    // event handler for recently searched cities in table
    $(document).on("click", "td", (e) => {
        e.preventDefault();
        let listedCity = $(e.target).text();
        city = listedCity;
        getWeatherData(city);
    });
    
    // searches the API for the chosen city
    function getWeatherData(city) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=42d98d76405f5b8038f2ad71187af430";
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            let cityName = response.name;
            let cityCond = response.weather[0].description.toUpperCase();
            let cityTemp = response.main.temp;
            let cityHum = response.main.humidity;
            let cityWind = response.wind.speed;
            let icon = response.weather[0].icon;
            $("#icon").html(
                `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
            );
            $("#city-name").html(cityName + " " + "(" + NowMoment + ")");
            $("#city-cond").text("Current Conditions: " + cityCond);
            $("#temp").text("Current Temp (F): " + cityTemp.toFixed(1));
            $("#humidity").text("Humidity: " + cityHum + "%");
            $("#wind-speed").text("Wind Speed: " + cityWind + "mph");
            $("#date1").text(day1);
            $("#date2").text(day2);
            $("#date3").text(day3);
            $("#date4").text(day4);
            $("#date5").text(day5);
            getUV(response.coord.lat, response.coord.lon);
            saveToLocalStorage(cityName);
            listCities();
            $("#city-input").val("");
        }).fail(function (){
            alert("Could not get data")
        });
    }  
    // Function to get 5-day forecast and UV index and put them on page
    function getUV(lat, lon) {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial&appid=42d98d76405f5b8038f2ad71187af430",
            method: "GET",
        }).then(function (response) {
        
        // code to determine UV index severity
        let uvIndex = response.current.uvi;
        $("#uv-index").text("UV Index:" + " " + uvIndex);
        if (uvIndex >= 8) {
            $("#uv-index").css("color", "red");
        } 
        else if (uvIndex > 4 && uvIndex < 8) {
            $("#uv-index").css("color", "yellow");
        } 
        else {
            $("#uv-index").css("color", "green");
        }
        
        let cityHigh = response.daily[0].temp.max;
        $("#high").text("Expected high (F): " + " " + cityHigh);

        // forecast temp variables
        let day1temp = response.daily[1].temp.max;
        let day2temp = response.daily[2].temp.max;
        let day3temp = response.daily[3].temp.max;
        let day4temp = response.daily[4].temp.max;
        let day5temp = response.daily[5].temp.max;
        // forecast humidity variables
        let day1hum = response.daily[1].humidity;
        let day2hum = response.daily[2].humidity;
        let day3hum = response.daily[3].humidity;
        let day4hum = response.daily[4].humidity;
        let day5hum = response.daily[5].humidity;
        // forecast weather icon variables
        let icon1 = response.daily[1].weather[0].icon;
        let icon2 = response.daily[2].weather[0].icon;
        let icon3 = response.daily[3].weather[0].icon;
        let icon4 = response.daily[4].weather[0].icon;
        let icon5 = response.daily[5].weather[0].icon;
        // set the temp values to the 5 day forecast
        $("#temp1").text("Temp(F):" + " " + day1temp.toFixed(1));
        $("#temp2").text("Temp(F):" + " " + day2temp.toFixed(1));
        $("#temp3").text("Temp(F):" + " " + day3temp.toFixed(1));
        $("#temp4").text("Temp(F):" + " " + day4temp.toFixed(1));
        $("#temp5").text("Temp(F):" + " " + day5temp.toFixed(1));
        // set the humidity values to the 5 day forecast
        $("#hum1").text("Hum:" + " " + day1hum + "%");
        $("#hum2").text("Hum:" + " " + day2hum + "%");
        $("#hum3").text("Hum:" + " " + day3hum + "%");
        $("#hum4").text("Hum:" + " " + day4hum + "%");
        $("#hum5").text("Hum:" + " " + day5hum + "%");
        // set the weather icons to the 5 day forecast
        $("#icon1").html(
          `<img src="http://openweathermap.org/img/wn/${icon1}@2x.png">`
        );
        $("#icon2").html(
          `<img src="http://openweathermap.org/img/wn/${icon2}@2x.png">`
        );
        $("#icon3").html(
          `<img src="http://openweathermap.org/img/wn/${icon3}@2x.png">`
        );
        $("#icon4").html(
          `<img src="http://openweathermap.org/img/wn/${icon4}@2x.png">`
        );
        $("#icon5").html(
          `<img src="http://openweathermap.org/img/wn/${icon5}@2x.png">`
        );
      });
    }
    //function to render recently searched cities to page
    function listCities() {
        $("#cityList").text("");
        cities.forEach((city) => {
            $("#cityList").prepend("<tr><td>" + city + "</td></tr>");
        });
    }
    //function to load recently searched cities from local storage
    function loadCitiesFromLocalStorage() {
        let savedCities = JSON.parse(localStorage.getItem("cities"));
        if (savedCities) {
            cities = savedCities;
        } else {
            cities = []; //if it doesnt exist, assign to an emtpy array
        }
        listCities();
    }
    // function to save searched cities to local storage
    function saveToLocalStorage(city) {
        localStorage.setItem("lastCity", city);
        if (!cities.includes(city)) { //if its not included, then put it in the list of cities and localStorage
            cities.push(city);
            localStorage.setItem("cities", JSON.stringify(cities));
        }
    }
     // function to load most recently searched city from local storage
    function loadLastCity() {
        let lastSearch = localStorage.getItem("lastCity");
        if (lastSearch) {
        city = lastSearch;
        getWeatherData(city);
        } else {
        city = "San Diego";
        getWeatherData(city);
        }
    }

    loadLastCity();
    loadCitiesFromLocalStorage();
});