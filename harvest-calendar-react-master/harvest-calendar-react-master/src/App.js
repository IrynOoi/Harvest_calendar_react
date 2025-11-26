// App.js// App.js
import React, { Component } from 'react';
import { db } from './firebase'; // Make sure firebase.js exports firebase from v8
import Form from './Form';
import Calendar from './Calendar';
import './App.css';
import Logo from './Logo.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crops: [], // start empty, we'll fetch from Firestore
      svgLink: "#"
    };
  }

  componentDidMount() {
    this.fetchCrops();
  }

  // Fetch crops from Firestore (v8)
  fetchCrops() {
    db.collection("crops").get().then(snapshot => {
      const cropsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      this.setState({ crops: cropsList });
    }).catch(error => {
      console.error("Error fetching crops:", error);
    });
  }

  // Add a new empty crop
  addCrop() {
    const newCrop = {
      name: "",
      seasons: [
        { start: "2018-01-01", end: "2018-01-01" },
        { start: "2018-01-01", end: "2018-01-01" },
      ]
    };

    db.collection("crops").add(newCrop)
      .then(docRef => {
        this.setState({
          crops: [...this.state.crops, { ...newCrop, id: docRef.id }]
        });
      })
      .catch(error => {
        console.error("Error adding crop:", error);
      });
  }

  // Delete crop
  deleteCrop(index) {
    const cropToDelete = this.state.crops[index];
    if (cropToDelete.id) {
      db.collection("crops").doc(cropToDelete.id).delete()
        .catch(error => {
          console.error("Error deleting crop:", error);
        });
    }

    this.setState({
      crops: [
        ...this.state.crops.slice(0, index),
        ...this.state.crops.slice(index + 1)
      ]
    });
  }

  // Update crop
  updateCrop(index, { name, startOne, endOne, startTwo, endTwo }) {
    const crops = [...this.state.crops];
    const crop = { ...crops[index] };

    if (name !== undefined) crop.name = name;
    if (startOne !== undefined) crop.seasons[0].start = startOne;
    if (endOne !== undefined) crop.seasons[0].end = endOne;
    if (startTwo !== undefined) crop.seasons[1].start = startTwo;
    if (endTwo !== undefined) crop.seasons[1].end = endTwo;

    crops[index] = crop;
    this.setState({ crops });

    if (crop.id) {
      db.collection("crops").doc(crop.id).update(crop)
        .catch(error => {
          console.error("Error updating crop:", error);
        });
    }
  }

  // Generate SVG download link
  downloadSvg() {
    const svg = document.getElementById("svg-container").innerHTML;
    this.setState({
      svgLink: `data:application/octet-stream;base64,${btoa(svg)}`
    });
  }

  render() {
    return (
      <div id="app">
        <header>
          <h1>Harvest Calendar Generator</h1>
          <p>For small farms and local farmers markets, a harvest calendar can be an effective marketing visualization. It shows customers when their favorite fruits and vegetables will be in season, or it can simply be used to browse what is currently available.</p>
        </header>
        <div id="form-container">
          <div id="instructions">
            <h3>How to use it</h3>
            <p>Add the crops you sell to the calendar and set the date range when they are available. Harvest windows which span one calendar year to the next will require two date ranges. When you're finished, download the calendar as an SVG file and use it in your promotional materials.</p>
            <button 
              className="btn btn-secondary" 
              onClick={() => this.addCrop()}
            >
              Add Crop
            </button>
            <a 
              className="btn btn-primary"
              href={this.state.svgLink}
              download="harvest-calendar.svg"
              onClick={() => this.downloadSvg()}
            >
              Download
            </a>
          </div>
          <Form 
            id="form"
            crops={this.state.crops}
            updateCrop={this.updateCrop.bind(this)}
            deleteCrop={this.deleteCrop.bind(this)}
          />
        </div>
        <Calendar crops={this.state.crops} />
        <div className="footer" >
          <a href="https://jgaehring.com">
            <div className="logo">
              <Logo color="rgba(0,0,0,.35)"/>
            </div>
            <br/>
            J. Gaehring 2018
          </a>
        </div>
      </div>
    );
  }
}

export default App;
