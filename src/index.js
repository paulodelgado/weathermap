import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class WeatherApp extends React.Component {
  constructor(props) {
    super(props);

    var $this = this;
    navigator.geolocation.getCurrentPosition(
      function(res_location) {
        console.log('getCurrentPosition completed with:');
        console.log(res_location);
        $this.setState({loc: res_location, loaded: true});
      }, this.geoError);

    this.state = {loc: null, loaded: false};
  }

  geoError() {
    alert("Unable to fetch geolocation data");
  }

  render() {
    const isLoaded = this.state.loaded;
    let map_content;

    if(isLoaded) {
      map_content = <WeatherAppMap loc={this.state.loc} />;
    } else {
      map_content = "Waiting for location...";
    }

    return (
      <div className="weatherapp">
        <div className="debug">
          Latitude: {this.state.loaded ? this.state.loc.coords.latitude : "Loading..." }
          / 
          Longitude: {this.state.loaded ? this.state.loc.coords.longitude : "Loading..."}
        </div>
        <div className="weatherapp-map">
          {map_content}
        </div>
        <div className="weatherapp-history">
          <WeatherAppHistory places={JSON.parse(localStorage.getItem("places")) } />
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
    var url = this.getWeatherUrl();
    if(url === "") {
      return;
    }
    fetch(this.getWeatherUrl())
      .then(res => res.json())
      .then(
        (result) => {
          console.log('got weather data');
          console.log(result);
          var places_raw = localStorage.getItem('places');
          var places = {};
          if(places_raw === null) {
            places_raw = "";
          } else {
            places = JSON.parse(places_raw);
          }
          places[result.id] = result;
          localStorage.setItem("places", JSON.stringify(places))
          this.setState({
            isLoaded: true,
            weatherData: result
          });
        },
        (error) => {
          this.setState({isLoaded: true, error})
        });
    console.log('weather app map component did mount');
  }

  api_key () {
    return "bd37b478e71e5926a36f792563875b5d";
  }

  getWeatherUrl() {
    if(this.props.loc === null) {
      return "";
    }
    return "https://api.openweathermap.org/data/2.5/weather?lat=" + this.props.loc.coords.latitude + "&lon=" + this.props.loc.coords.longitude + "&appid=" + this.api_key();
  }

  render() {
    return (
      <div className="map-container">
      {this.state.isLoaded ? "Loaded!" : "Got location, fetching weather data..."}
      </div>
    );
  }
}

class WeatherAppHistory extends React.Component {
  // constructor(props) {
  //   super(props);
  //   debugger
  // }
  render() {
    const elems = Object.keys(this.props.places).map(key =>
          <WeatherLocation key={key} loc={this.props.places[key]} />
    )
    return (
      <div>
        { elems }
      </div>
    )
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

