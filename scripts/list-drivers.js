#!/usr/bin/env node

/**
 * Helper script to list all drivers with their IDs
 * Usage: node scripts/list-drivers.js
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'db', 'f1.json');

try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonContent);

    console.log('\n📋 Available Drivers:\n');
    console.log('ID | Name                  | Team           | Race Number');
    console.log('---|----------------------|----------------|------------');

    data.teams.forEach(team => {
        team.drivers.forEach(driver => {
            const id = driver.id.toString().padStart(2);
            const name = driver.fullName.padEnd(22);
            const teamName = team.name.padEnd(14);
            const raceNumber = driver.raceNumber.padStart(2);
            console.log(`${id}  | ${name} | ${teamName} | ${raceNumber}`);
        });
    });

    console.log('\n');
} catch (error) {
    console.error('Error reading f1.json:', error.message);
    process.exit(1);
}

