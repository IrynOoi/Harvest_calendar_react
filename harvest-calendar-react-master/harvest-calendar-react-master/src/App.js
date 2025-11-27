// App.js
import React, { Component } from 'react';
import { db } from './firebase';
import Form from './Form';
import Calendar from './Calendar';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crops: [],
    };
  }

  componentDidMount() {
    this.fetchCrops();
  }

  fetchCrops() {
    db.collection("crops").get()
      .then(snapshot => {
        const cropsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        this.setState({ crops: cropsList });
      })
      .catch(error => console.error("Error fetching crops:", error));
  }

  addCrop() {
    const newCrop = { name: "", seasons: [{ start: "", end: "" }] };
    db.collection("crops").add(newCrop)
      .then(docRef => {
        this.setState({ crops: [...this.state.crops, { ...newCrop, id: docRef.id }] });
      })
      .catch(error => console.error("Error adding crop:", error));
  }

  deleteCrop(index) {
    const cropToDelete = this.state.crops[index];
    if (cropToDelete.id) db.collection("crops").doc(cropToDelete.id).delete().catch(console.error);
    this.setState({
      crops: [
        ...this.state.crops.slice(0, index),
        ...this.state.crops.slice(index + 1)
      ]
    });
  }

  updateCrop(index, updated) {
    const crops = [...this.state.crops];
    const crop = { ...crops[index] };

    if (updated.name !== undefined) crop.name = updated.name;
    if (updated.seasons !== undefined) crop.seasons = updated.seasons;

    crops[index] = crop;
    this.setState({ crops });

    if (crop.id) db.collection("crops").doc(crop.id).update(crop).catch(console.error);
  }

  addSeasonToCrop(index) {
    const crops = [...this.state.crops];
    crops[index].seasons.push({ start: "", end: "" });
    this.setState({ crops });
  }

  autoSchedulePineapple(index, batches = 4) {
    const crops = [...this.state.crops];
    const crop = crops[index];
    const year = new Date().getFullYear();
    const batchMonths = Math.floor(12 / batches);

    crop.seasons = [];
    for (let i = 0; i < batches; i++) {
      const startMonth = i * batchMonths;
      const endMonth = startMonth + batchMonths - 1;
      const startDate = new Date(year, startMonth, 1).toISOString().split('T')[0];
      const endDate = new Date(year, endMonth + 1, 0).toISOString().split('T')[0];
      crop.seasons.push({ start: startDate, end: endDate });
    }

    this.setState({ crops });
    if (crop.id) db.collection("crops").doc(crop.id).update(crop).catch(console.error);
  }

  saveAllCrops() {
    this.state.crops.forEach(crop => {
      if (crop.id) {
        db.collection("crops").doc(crop.id).update(crop).catch(console.error);
      } else {
        db.collection("crops").add(crop).catch(console.error);
      }
    });
    alert("All crop data saved!");
  }

  render() {
    return (
      <div id="app">
        {/* App Bar */}
        <div className="app-bar">
          <h1>Harvest Calendar</h1>
        </div>

        <header>
          <p>Plan pineapple farming with equal harvest distribution across the year.</p>
        </header>

        <div id="form-container">
          <div id="instructions">
            <h3>How to use it</h3>
            <p>Add your crops and schedule the seasons. Use Auto-Schedule for pineapple to balance harvest.</p>
            <button className="btn btn-secondary" onClick={() => this.addCrop()}>Add Crop</button>
            <button className="btn btn-primary" onClick={() => this.saveAllCrops()}>Save</button>
          </div>

          <Form 
            id="form"
            crops={this.state.crops}
            updateCrop={this.updateCrop.bind(this)}
            deleteCrop={this.deleteCrop.bind(this)}
            addSeasonToCrop={this.addSeasonToCrop.bind(this)}
            autoSchedulePineapple={this.autoSchedulePineapple.bind(this)}
          />
        </div>

        <Calendar crops={this.state.crops} />
      </div>
    );
  }
}

export default App;
