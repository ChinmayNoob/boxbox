#!/usr/bin/env node

/**
 * Utility script to reset all driver points (currentPointsDWC) and constructor points (currentPointsWC) to 0
 * Usage: node scripts/reset-points.js
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

// Count teams and drivers with points before reset
let totalDriverPoints = 0;
let totalConstructorPoints = 0;
let driversWithPoints = 0;
let teamsWithPoints = 0;

data.teams.forEach(team => {
    if (team.currentPointsWC > 0) {
        teamsWithPoints++;
        totalConstructorPoints += team.currentPointsWC;
    }
    
    team.drivers.forEach(driver => {
        if (driver.currentPointsDWC > 0) {
            driversWithPoints++;
            totalDriverPoints += driver.currentPointsDWC;
        }
    });
});

// Reset all points
data.teams.forEach(team => {
    team.currentPointsWC = 0;
    team.drivers.forEach(driver => {
        driver.currentPointsDWC = 0;
    });
});

// Write back to file
try {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log('✅ Successfully reset all points:');
    console.log(`   - Reset constructor points for ${data.teams.length} teams`);
    if (teamsWithPoints > 0) {
        console.log(`     (${teamsWithPoints} teams had points, total: ${totalConstructorPoints})`);
    }
    const totalDrivers = data.teams.reduce((sum, team) => sum + team.drivers.length, 0);
    console.log(`   - Reset driver points for ${totalDrivers} drivers`);
    if (driversWithPoints > 0) {
        console.log(`     (${driversWithPoints} drivers had points, total: ${totalDriverPoints})`);
    }
} catch (error) {
    console.error('Error writing f1.json:', error.message);
    process.exit(1);
}

