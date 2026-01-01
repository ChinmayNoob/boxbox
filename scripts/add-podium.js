#!/usr/bin/env node

/**
 * Utility script to add podium data to circuits in f1.json
 * Automatically sets circuit status to "end" when podium is added
 * Usage: node scripts/add-podium.js <circuitId> <driverId1> <driverId2> <driverId3>
 * Example: node scripts/add-podium.js 3 17 12 11
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);

if (args.length !== 4) {
    console.error('Usage: node scripts/add-podium.js <circuitId> <driverId1> <driverId2> <driverId3>');
    console.error('Example: node scripts/add-podium.js 3 17 12 11');
    console.error('\nDriver IDs:');
    console.error('  1: Gasly, 2: Colapinto, 3: Alonso, 4: Stroll, 5: Leclerc');
    console.error('  6: Hamilton, 7: Ocon, 8: Bearman, 9: Hulkenberg, 10: Bortoleto');
    console.error('  11: Piastri, 12: Norris, 13: Russell, 14: Antonelli, 15: Lawson');
    console.error('  16: Hadjar, 17: Verstappen, 18: Tsunoda, 19: Sainz, 20: Albon');
    process.exit(1);
}

const [circuitId, driverId1, driverId2, driverId3] = args.map(Number);

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

// Find all drivers from teams
const allDrivers = [];
data.teams.forEach(team => {
    team.drivers.forEach(driver => {
        allDrivers.push(driver);
    });
});

// Find drivers by ID
const drivers = [driverId1, driverId2, driverId3].map(id => {
    const driver = allDrivers.find(d => d.id === id);
    if (!driver) {
        console.error(`Driver with ID ${id} not found!`);
        process.exit(1);
    }
    return driver;
});

// Extract only the fields needed for podium
const createPodiumEntry = (driver) => ({
    id: driver.id,
    name: driver.name,
    fullName: driver.fullName,
    raceNumber: driver.raceNumber,
    team: driver.team,
    country: driver.country,
    countryFlag: driver.countryFlag,
    driverImage: driver.driverImage
});

const podium = drivers.map(createPodiumEntry);

// Find circuit by ID
const circuit = data.circuits.find(c => c.id === circuitId);
if (!circuit) {
    console.error(`Circuit with ID ${circuitId} not found!`);
    console.error(`Available circuits:`);
    data.circuits.forEach(c => {
        console.error(`  ${c.id}: ${c.name}`);
    });
    process.exit(1);
}

// Update podium and status
const previousStatus = circuit.currentStatus;
circuit.podium = podium;
circuit.currentStatus = 'end'; // If podium exists, race must have ended

// Write back to file
try {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`✅ Successfully added podium for ${circuit.name}:`);
    console.log(`   1st: ${drivers[0].fullName} (${drivers[0].team})`);
    console.log(`   2nd: ${drivers[1].fullName} (${drivers[1].team})`);
    console.log(`   3rd: ${drivers[2].fullName} (${drivers[2].team})`);
    if (previousStatus !== 'end') {
        console.log(`   Status updated from "${previousStatus}" to "end"`);
    }
} catch (error) {
    console.error('Error writing f1.json:', error.message);
    process.exit(1);
}

