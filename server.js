const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Read hospitals data from JSON file
function getHospitals() {
  const data = fs.readFileSync('hospitals.json');
  return JSON.parse(data);
}

// Write hospitals data to JSON file
function saveHospitals(hospitals) {
  fs.writeFileSync('hospitals.json', JSON.stringify(hospitals, null, 2));
}

// Redirect root path to "/hospitals" endpoint
app.get('/', (req, res) => {
  res.redirect('/hospitals');
});

// Get all hospitals
app.get('/hospitals', (req, res) => {
  const hospitals = getHospitals().hospitals;
  res.json(hospitals);
});

// Get a specific hospital
app.get('/hospitals/:id', (req, res) => {
  const hospitals = getHospitals().hospitals;
  const hospital = hospitals.find((h) => h.id === parseInt(req.params.id));
  if (!hospital) {
    res.status(404).json({ error: 'Hospital not found' });
  } else {
    res.json(hospital);
  }
});

// Create a new hospital
app.post('/hospitals', (req, res) => {
  const hospitals = getHospitals();
  const newHospital = req.body;
  hospitals.hospitals.push(newHospital);
  saveHospitals(hospitals);
  res.status(201).json(newHospital);
});

// Update a hospital
app.put('/hospitals/:id', (req, res) => {
  const hospitals = getHospitals();
  const hospital = hospitals.hospitals.find((h) => h.id === parseInt(req.params.id));
  if (!hospital) {
    res.status(404).json({ error: 'Hospital not found' });
  } else {
    hospital.name = req.body.name || hospital.name;
    hospital.patientCount = req.body.patientCount || hospital.patientCount;
    hospital.location = req.body.location || hospital.location;
    saveHospitals(hospitals);
    res.json(hospital);
  }
});

// Delete a hospital
app.delete('/hospitals/:id', (req, res) => {
  const hospitals = getHospitals();
  const index = hospitals.hospitals.findIndex((h) => h.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Hospital not found' });
  } else {
    const deletedHospital = hospitals.hospitals.splice(index, 1);
    saveHospitals(hospitals);
    res.json(deletedHospital[0]);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
