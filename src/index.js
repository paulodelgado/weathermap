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
          <br/>
          Longitude: {this.state.loaded ? this.state.loc.coords.longitude : "Loading..."}
        </div>
        <div className="weatherapp-bottom">
          <div className="weatherapp-map">
            {map_content}
          </div>
          <div className="weatherapp-history">
            <WeatherAppHistory />
          </div>
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
    return "http://api.openweathermap.org/data/2.5/weather?lat=" + this.props.loc.coords.latitude + "&lon=" + this.props.loc.coords.longitude + "&appid=" + this.api_key();
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
  render() {
    return (
      <div className="history-list">
      History goes here
      </div>
    );
  }
}


ReactDOM.render(
  <WeatherApp  />,
  document.getElementById('root')
);

