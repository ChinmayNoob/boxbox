#!/usr/bin/env node

/**
 * Helper script to list all circuits with their IDs
 * Usage: node scripts/list-circuits.js
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'db', 'f1.json');

try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonContent);

    console.log('\n🏎️  Available Circuits:\n');
    console.log('ID | Circuit Name         | Status      | Has Podium');
    console.log('---|----------------------|-------------|-----------');

    data.circuits.forEach(circuit => {
        const id = circuit.id.toString().padStart(2);
        const name = circuit.name.padEnd(20);
        const status = circuit.currentStatus.padEnd(11);
        const hasPodium = circuit.podium && circuit.podium.length > 0 ? 'Yes' : 'No';
        console.log(`${id}  | ${name} | ${status} | ${hasPodium}`);
    });

    console.log('\n');
} catch (error) {
    console.error('Error reading f1.json:', error.message);
    process.exit(1);
}

