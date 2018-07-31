import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class WeatherApp extends React.Component {
  constructor(props) {
    super(props);

    navigator.geolocation.getCurrentPosition(this.updateLocation, this.geoError);

    this.updateLocation = this.updateLocation.bind(this);
    this.state = {loc: null};
  }

  updateLocation(res_location) {
    debugger
    console.log('updateLocation!');
    console.log(res_location)
    this.setState({loc: res_location});
  }

  geoError() {
    alert("Unable to fetch geolocation data");
  }

  render() {
    return (
      <div className="weatherapp">
        <div className="debug">
          Latitude: {this.state.loc === undefined && this.state.loc.coords.latitude}
          <br/>
          Longitude: {this.state.loc === undefined && this.state.loc.coords.longitude}
        </div>
        <div className="weatherapp-bottom">
          <div className="weatherapp-map">
            <WeatherAppMap loc={this.state.loc} />
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
    super(props);
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
          this.setState({
            isLoaded: true
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
    return "http://api.openweathermap.org/data/2.5/weather?lat=" + this.props.loc.coords.latitude + "&lon=" + this.props.loc.coords.longitude;
  }

  render() {
    return (
      <div className="map-container">
      Hello
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

