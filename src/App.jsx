import "./App.css";
import React, { useState, useEffect } from "react";
import Forecast from "./forecast";
import { Autocomplete, TextField } from "@mui/material";
import citiesData from "./cities.json";
import axios from "axios";
import mist from "./assets/mist.jpg";
import dayicon from "./assets/clear-day.svg";
import hazebg from "./assets/mist.jpg";
import rainbg from "./assets/rainy.jpg";
import thunderstormbg from "./assets/thunderstorm.jpg";
import sunnybg from "./assets/sunny.jpg";
import cloudbg from "./assets/cloudy.jpg";
import clearbg from "./assets/clear.jpg";

function App() {
  const [drop, setDrop] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nolocation, setNolocation] = useState();

  let isDisabled = selectedCity === null || "";

  const apiKey = "f1b62088ca164c33a1d203327242504";

  const formatdate = (ds) => {
    const date = new Date(ds);
    const formatDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return formatDate;
  };
  const formattime = (dt) => {
    const date = new Date(dt);
    const formatTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formatTime;
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    const cityNames = citiesData.cities;
    setCities(cityNames);
  }, []);

  // console.log(weatherData.location.localtime);
  useEffect(() => {
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=10&aqi=no&alerts=no`
        );
        console.log("userLocation.latitude", userLocation.latitude);
        console.log("userLocation.longitude", userLocation.longitude);
        if (!response.ok) {
          throw new Error("Failed to fetch weather data!");
        }
        const data = await response.json();
        if (userLocation) {
          setWeatherData(data, userLocation.latitude, userLocation.longitude);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    if (userLocation) {
      fetchWeatherData(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.log("Error fetching user location!", error);
          alert(
            "Allow location permission to be fetched to display weather details."
          );
        }
      );
    }
  };

  const handleCitySelect = (event, value) => {
    setSelectedCity(value);
  };

  const handleClickWeather = () => {
    setIsLoading(true);
    setNolocation("");

    if (selectedCity) {
      axios
        .get(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${selectedCity}&days=10&aqi=no&alerts=no`
        )
        .then((response) => {
          console.log("selected location-----", response.data);
          setWeatherData(response.data);
        })
        .catch((error) => {
          if (error.response.code === 1006 && error.response.status === 400)
            console.error("Error making API call:", error);
          console.log(
            "Status:",
            error.response.status,
            " | location not found!"
          );
          setNolocation("No matching location found!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const getBgImg = (conditionText) => {
    switch (conditionText) {
      case "Sunny":
        return sunnybg;
      case "Mist":
        return hazebg;
      case "Partly cloudy":
      case "Partly Cloudy":
      case "Cloudy ":
        return cloudbg;
      case "Patchy rain nearby":
      case "Moderate rain":
      case "Heavy rain":
      case "Moderate or heavy rain with thunder":
      case "Patchy light rain with thunder":
        return rainbg;
      case "Overcast":
      case "Thundery outbreaks in nearby":
      case "Thundery outbreaks possible":
        return thunderstormbg;
      case "Clear":
      case "clear":
        return clearbg;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="main">
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              fontSize: "20px",
              width: "100%",
              height: "120vh",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <img src={dayicon} height="100px"></img>
            <div>Checking weather for you...</div>
          </div>
        )}

        {weatherData && userLocation && (
          <div>
            <h2 className="project-name">
              WeatherWise<sup style={{ fontSize: "10px" }}>TM</sup>
            </h2>
            <Autocomplete
              options={cities}
              onChange={handleCitySelect}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select location"
                  style={{
                    background: "#242424",
                    WebkitTextFillColor: "white",
                    border: "none",
                    boxShadow: "7px 7px 14px #1e1e1e, -6px -6px 12px #2b2b2b",
                    borderRadius: "6px",
                    width: "50%",
                    margin: "auto",
                  }}
                />
              )}
            />
            <br />
            {nolocation && <span style={{ color: "red" }}>{nolocation}</span>}
            <br />
            <button
              className={isDisabled ? "weather-btn-disabled" : "weather-btn"}
              onClick={handleClickWeather}
              disabled={isDisabled ? true : ""}
            >
              GET WEATHER
            </button>
            <br />
            <br />
            <div
              // className="weather-card"
              style={{
                minWidth: "200px",
                width: "50%",
                height: "auto",
                border: "1px solid rgb(62, 62, 62)",
                borderRadius: "20px",
                margin: "0 auto",
                backgroundImage: `url(${getBgImg(
                  weatherData.current.condition.text
                )})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="opaci">
                <div className="loc-time">
                  {" "}
                  <div style={{ fontSize: "18px", textAlign: "left" }}>
                    {weatherData.location.name}
                    <br /> {weatherData.location.region}
                  </div>
                  <span style={{ fontSize: 11, textAlign: "right" }}>
                    {formatdate(weatherData.location.localtime)}
                    <br />
                    Updated at {formattime(weatherData.location.localtime)}
                  </span>
                </div>
                {/* need to add all details dynamically */}
                <h2 className="temp-deg">
                  {weatherData.current.temp_c}&#176;
                  {weatherData.current.temp_c
                    ? "C"
                    : weatherData.current.temp_f
                    ? "F"
                    : ""}
                </h2>
                <h3 className="temp-deg-type">
                  <div>{weatherData.current.condition.text}</div>
                  <div style={{ fontWeight: 300, fontSize: "18px" }}>
                    Feels like {weatherData.current.feelslike_c}&#176;
                  </div>
                </h3>
              </div>
              {/* Add functionality and animation to do something with the advanced stats */}
              <button className="advanced-stats" onClick={() => setDrop(!drop)}>
                Advanced stats &#9432;
              </button>
            </div>
            <div className={`advanced-drop ${drop ? "open" : "close"}`}>
              <div className="stats">
                <div>Visibility {weatherData.current.vis_km}km</div>
                <div>
                  Wind {weatherData.current.wind_kph}km/h{" "}
                  {weatherData.current.wind_dir}
                </div>
                <div>Rainfall {weatherData.current.precip_mm}mm</div>
                <div>Humidity {weatherData.current.humidity}%</div>
              </div>
            </div>
            <div
              className={`forecast-title ${
                drop ? "title-open" : "title-close"
              }`}
            >
              <br />
              10 DAY FORECAST &rarr;
            </div>
            <div
              className={`forecast-drop ${drop ? "fore-open" : "fore-close"}`}
            >
              <Forecast weatherData={weatherData} formatdate={formatdate} />
              <div className="forecast-details"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
