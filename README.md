# Weather App
Technologies: EJS | Express | NodeJS | Bootstrap

Using a combination of EJS templating and Bootstrap I developed this simple Weather App that allows users to type in their specific location and receive a forecast for the next five days.

The App consumes an API from OpenWeatherMap.org and is designed using Bootstrap elements. This App will also tell a user if they have placed in a location that is not recognised.

While creating this App I noticed a few anomalies with certain locations not being able to be returned as the data that was being received was too large. I therefore had to research about Buffering to handle raw binary data so that the JSON transfer could be completed (This is further explained in the comments of my code).

[Live Page](https://my-weather-app-of.herokuapp.com/)
