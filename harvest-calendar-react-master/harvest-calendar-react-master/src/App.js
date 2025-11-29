// src/App.js
import React, { Component } from 'react';
import { db, firebase } from './firebase';
import Form from './Form';
import Calendar from './Calendar';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      email: '',
      password: '',
      crops: [],
      loading: false,
      signedIn: false,
    };
  }

  // Sign in with email/password
  signInWithEmail = async () => {
    const { email, password } = this.state;
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    this.setState({ loading: true });

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = firebase.auth().currentUser;
      if (user) {
        this.setState({ uid: user.uid, signedIn: true }, () => {
          this.fetchCrops();
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error.message}`);
      this.setState({ loading: false });
    }
  };

  fetchCrops = () => {
    const { uid } = this.state;
    const user = firebase.auth().currentUser;

    if (!uid || !user) {
      console.warn("User not signed in or UID not available yet");
      this.setState({ loading: false });
      return;
    }

   db.collection("crops")
  .where("userId", "==", uid)
  .get()
  .then(snapshot => {
    const cropsList = snapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure each crop has at least one valid season
      if (!data.seasons || data.seasons.length === 0) {
        const year = new Date().getFullYear();
        data.seasons = [{ start: `${year}-01-01`, end: `${year}-03-31` }]; // default season
      }
      return { id: doc.id, ...data };
    });
    this.setState({ crops: cropsList, loading: false });
  })
  .catch(error => {
    console.error("Error fetching crops:", error);
    this.setState({ loading: false });
  });

  };

  addCrop = () => {
    const { uid, crops } = this.state;
    const newCrop = { name: "", seasons: [{ start: "", end: "" }], userId: uid };

    db.collection("crops").add(newCrop).then(docRef => {
      this.setState({ crops: [...crops, { ...newCrop, id: docRef.id }] });
    });
  };

  deleteCrop = index => {
    const { crops } = this.state;
    const crop = crops[index];
    if (crop.id) db.collection("crops").doc(crop.id).delete();
    this.setState({ crops: crops.filter((_, i) => i !== index) });
  };

  updateCrop = (index, updated) => {
    const crops = [...this.state.crops];
    crops[index] = { ...crops[index], ...updated };
    this.setState({ crops });
    if (crops[index].id) db.collection("crops").doc(crops[index].id).update(crops[index]);
  };

  addSeasonToCrop = index => {
    const crops = [...this.state.crops];
    crops[index].seasons.push({ start: "", end: "" });
    this.setState({ crops });
  };

  saveAllCrops = () => {
    this.state.crops.forEach(crop => {
      if (crop.id) db.collection("crops").doc(crop.id).update(crop);
    });
    alert("All crops saved!");
  };

  render() {
    const { signedIn, loading, crops, email, password } = this.state;

    if (!signedIn) {
      return (
        <div style={{ padding: "2rem" }}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            style={{ display: "block", marginBottom: "1rem" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            style={{ display: "block", marginBottom: "1rem" }}
          />
          <button onClick={this.signInWithEmail}>Sign In</button>
          {loading && <p>Loading...</p>}
        </div>
      );
    }

    if (loading) return <p>Loading crops...</p>;

    return (
      <div id="app">
        <div className="app-bar">
          <h1>Harvest Calendar</h1>
        </div>

        <header>
          <p>Plan pineapple farming with equal harvest distribution.</p>
        </header>

        <div id="form-container">
          <div id="instructions">
            <h3>How to use</h3>
            <p>Add crops and schedule the seasons.</p>
            <button className="btn btn-secondary" onClick={this.addCrop}>Add Crop</button>
            <button className="btn btn-primary" onClick={this.saveAllCrops}>Save</button>
          </div>

          <Form
            id="form"
            crops={crops}
            updateCrop={this.updateCrop}
            deleteCrop={this.deleteCrop}
            addSeasonToCrop={this.addSeasonToCrop}
          />
        </div>

        <Calendar crops={crops} />
      </div>
    );
  }
}

export default App;
