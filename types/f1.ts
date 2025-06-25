export interface F1Info {
    teams: Team[]
    circuits: Circuit[]
}

export interface Circuit {
    id: number
    name: string
    fullName: string
    circuit: string
    country: string
    countryFlag: string
    circuitLogo: string
    circuitImage: string
    generalDate: string
    firstGrandPrix: string
    numberOfLaps: string
    circuitLength: string
    raceDistance: string
    lapRecord: string
    driverLapRecord: string
    currentStatus: 'end' | 'onGoing' | 'notStarted'
    podium: Pick<
        Driver,
        | 'id'
        | 'name'
        | 'fullName'
        | 'raceNumber'
        | 'team'
        | 'country'
        | 'countryFlag'
        | 'driverImage'
    >[]
}

export interface Team {
    id: number
    name: string
    fullName: string
    description: string
    base: string
    homeRace: string
    teamChief: string
    technicalChief: string
    chassis: string
    chassisImage: string
    chassisRenderImage: string
    powerUnit: string
    firstTeamEntry: string
    worldChampionship: string
    currentPointsWC: number
    highestRaceFinish: string
    polePosition: string
    fastestLaps: string
    logo: string
    logoWithName: string
    drivers: Driver[]
}

export interface Driver {
    id: number
    name: string
    fullName: string
    raceNumber: string
    team: string
    country: string
    countryFlag: string
    podiums: string
    wins: string
    points: string
    grandsPrixEntered: string
    worldChampionships: string
    highestRaceFinish: string
    highestGridPosition: string
    dateOfBirth: string
    age: string
    placeOfBirth: string
    helmetImage: string
    driverImage: string
    homeRace: string
    currentPointsDWC: number
}
