import 'dotenv/config';

export default {
  expo: {
    name: "WeatherApp",
    slug: "weatherapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    extra: {
      OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    },
  },
};
