import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"




class WeatherApp extends React.Component {
  constructor(props) {
    super(props);


    this.state = {loc: null, geo_loaded: false, weather_loaded: false, weather: null};

    this.location_loaded = this.location_loaded.bind(this);
    this.location_error = this.location_error.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.location_loaded, this.location_error);
  }

  getWeatherUrl() {
    const api_key = "bd37b478e71e5926a36f792563875b5d";
    if(this.state.loc) {
      return "https://api.openweathermap.org/data/2.5/weather?lat=" + this.state.loc.coords.latitude + "&lon=" + this.state.loc.coords.longitude + "&appid=" + api_key;
    } else {
      return false;
    }
  }

  fetchWeatherData() {
    var url = this.getWeatherUrl();
    console.log("weather url: " + url);
    if(!url) {
      return;
    }
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          console.log('got weather data');
          console.log(result);
          var places_raw = localStorage.getItem('places');
          var places = {};
          if(places_raw) {
            places = JSON.parse(places_raw);
          }
          places[result.id] = result;
          localStorage.setItem("places", JSON.stringify(places))
          this.setState({
            weather_loaded: true,
            weather: result,
            places
          });
        },
        (error) => {
          this.setState({isLoaded: true, error})
        });
  }

  location_loaded(res_location) {
    console.log('getCurrentPosition completed with:');
    console.log(res_location);
    this.setState({loc: res_location, geo_loaded: true});

    this.fetchWeatherData();
  }

  location_error() {
    console.log('There was an error loading your location');
  }

  geoError() {
    alert("Unable to fetch geolocation data");
  }

  render() {
    const isLoaded = this.state.geo_loaded;
    let map_content;

    if(isLoaded) {
      map_content = <WeatherAppMap loc={this.state.loc} />;
    } else {
      map_content = "Waiting for location...";
    }

    return (
      <div className="weatherapp">
        <div className="debug">
          Latitude: {this.state.geo_loaded ? this.state.loc.coords.latitude : "Loading..." }
          / 
          Longitude: {this.state.geo_loaded ? this.state.loc.coords.longitude : "Loading..."}
        </div>
        <div className="weatherapp-map">
          {map_content}
        </div>
        <div className="weatherapp-history">
          <WeatherAppHistory places={this.state.places} />
        </div>
      </div>
    );
  }
}

class WeatherAppMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isLoaded: false, weatherData: null};
  }

  componentDidMount () {
    console.log('weather app map component did mount');
  }

  render() {

    const MyMapComponent = withGoogleMap((props) =>
      <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: this.props.loc.coords.latitude, lng: this.props.loc.coords.longitude }}
      >
        <Marker position={{ lat: this.props.loc.coords.latitude, lng: this.props.loc.coords.longitude }} />}
      </GoogleMap>
    )


    return (
      <div className="map-container">
        <MyMapComponent
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

class WeatherAppHistory extends React.Component {
  render() {

    console.log(this.props.places);


    if(this.props.places) {

      const elems = Object.keys(this.props.places).map(key => <WeatherLocation key={key} loc={this.props.places[key]} /> ) ;
      return (
        <div>
          { elems }
        </div>
      )
    } else {
      return (
        <div>No places yet</div>
      )
    }
  };
}

class WeatherLocation extends React.Component {

  toFahrenheit(num) {
   return Math.round(num * (9/5) - 459.67);
  }
  render() {
    return (
      <div className="placeInfo">
        <h3>{this.props.loc.name}</h3>
        <span className="temp">{this.toFahrenheit(this.props.loc.main.temp)} degrees</span>
        <span className="humidity">{this.props.loc.main.humidity}% humidity</span>

        
      </div>
    )
  }
}


ReactDOM.render(
  <WeatherApp  />,
  document.getElementById('root')
);
