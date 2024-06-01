import React, { useState, useEffect } from "react";
import "./forecast.css";
import haze from "./assets/haze.png";
import sunny from "./assets/sun.png";
import rainy from "./assets/rainy.png";
import cloudy from "./assets/cloud.png";
import thunder from "./assets/thunder.png";

function Forecast({ weatherData, formatdate }) {
  return (
    <div>
      <div>
        {weatherData && (
          <div className="main-block">
            {weatherData.forecast.forecastday.map((day) => (
              <div className="forecast-card" key={day.date}>
                <div>
                  {formatdate(day.date)}
                  <br /> <br />
                  {day.day.condition.text === "Sunny" ? (
                    <img src={sunny} alt="Sunny" height="38" width="auto" />
                  ) : day.day.condition.text === "Partly Cloudy " ||
                    day.day.condition.text === "Cloudy " ? (
                    <img src={cloudy} alt="Cloud" height="38" width="auto" />
                  ) : day.day.condition.text === "Patchy rain nearby" ||
                    day.day.condition.text === "Moderate rain" ||
                    day.day.condition.text === "Heavy rain" ||
                    day.day.condition.text === "Patchy rain nearby" ? (
                    <img src={rainy} alt="Cloudy" height="38" width="auto" />
                  ) : day.day.condition.text === "Overcast " ||
                    day.day.condition.text ===
                      "Thundery outbreaks in nearby" ? (
                    <img src={thunder} alt="thunder" height="38" width="auto" />
                  ) : (
                    "Image Unavailable"
                  )}
                  <br />
                  {day.day.condition.text}
                  <br />
                  <div>
                    H : {day.day.maxtemp_c}&#176;C &nbsp;&nbsp; L :{" "}
                    {day.day.mintemp_c}&#176;C
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Forecast;
