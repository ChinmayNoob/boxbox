#!/usr/bin/env node

/**
 * Utility script to clear all podium data and set all circuit statuses to "notStarted"
 * Usage: node scripts/reset-circuits.js
 */

const fs = require('fs');
const path = require('path');

// Path to f1.json
const jsonPath = path.join(__dirname, '..', 'db', 'f1.json');

// Read and parse JSON
let data;
try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    data = JSON.parse(jsonContent);
} catch (error) {
    console.error('Error reading f1.json:', error.message);
    process.exit(1);
}

// Count circuits with podiums before reset
const circuitsWithPodiums = data.circuits.filter(c => c.podium && c.podium.length > 0).length;

// Reset all circuits
data.circuits.forEach(circuit => {
    circuit.podium = [];
    circuit.currentStatus = 'notStarted';
});

// Write back to file
try {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log('✅ Successfully reset all circuits:');
    console.log(`   - Cleared podium data from ${circuitsWithPodiums} circuit(s)`);
    console.log(`   - Set all ${data.circuits.length} circuit statuses to "notStarted"`);
} catch (error) {
    console.error('Error writing f1.json:', error.message);
    process.exit(1);
}

