# Podium Management Scripts

These scripts help you manage podium data in `f1.json` without manually typing all the driver information.

## Available Scripts

### 1. List Drivers
View all available drivers with their IDs:
```bash
npm run list-drivers
# or
node scripts/list-drivers.js
```

### 2. List Circuits
View all circuits with their IDs and current podium status:
```bash
npm run list-circuits
# or
node scripts/list-circuits.js
```

### 3. Add Podium
Add or update podium data for a circuit. **Automatically sets circuit status to "end"** when podium is added:
```bash
npm run add-podium <circuitId> <driverId1> <driverId2> <driverId3>
# or
node scripts/add-podium.js <circuitId> <driverId1> <driverId2> <driverId3>
```

**Example:**
```bash
# Add podium for Japan GP (circuit ID 3) with:
# 1st: Verstappen (ID 17)
# 2nd: Norris (ID 12)
# 3rd: Piastri (ID 11)
npm run add-podium 3 17 12 11
```

**Note:** The script automatically sets the circuit's `currentStatus` to `"end"` since adding podium results means the race has finished.

### 4. Reset Circuits
Clear all podium data and set all circuit statuses to "notStarted":
```bash
npm run reset-circuits
# or
node scripts/reset-circuits.js
```

**Warning:** This will clear all podium data and reset all circuit statuses. Use this when starting a new season or resetting the data.

### 5. Reset Points
Reset all driver points (currentPointsDWC) and constructor points (currentPointsWC) to 0:
```bash
npm run reset-points
# or
node scripts/reset-points.js
```

**Warning:** This will reset all points to 0 for all drivers and teams. Use this when starting a new season.

## Quick Reference

### Driver IDs
- 1: Gasly, 2: Colapinto, 3: Alonso, 4: Stroll, 5: Leclerc
- 6: Hamilton, 7: Ocon, 8: Bearman, 9: Hulkenberg, 10: Bortoleto
- 11: Piastri, 12: Norris, 13: Russell, 14: Antonelli, 15: Lawson
- 16: Hadjar, 17: Verstappen, 18: Tsunoda, 19: Sainz, 20: Albon

Run `npm run list-drivers` to see the full list with names and teams.

### Workflow
1. Run `npm run list-circuits` to find the circuit ID
2. Run `npm run list-drivers` to find driver IDs (if needed)
3. Run `npm run add-podium <circuitId> <1st> <2nd> <3rd>` to add the podium

The script automatically:
- Extracts all required fields (name, fullName, raceNumber, team, country, countryFlag, driverImage) from the driver data
- Sets the circuit status to `"end"` (since podium results indicate the race has finished)

You only need to provide the IDs!

