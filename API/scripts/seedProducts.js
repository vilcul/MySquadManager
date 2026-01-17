const db = require('../db');
const { faker } = require('@faker-js/faker');

const POSITIONS = ['Goalkeeper', 'Center Back', 'Full Back', 'Defensive Midfielder', 'Central Midfielder', 'Winger', 'Striker'];
const FEET = ['Right', 'Left', 'Both'];

function generateJuniorPlayer() {
    const matches = faker.number.int({ min: 0, max: 40 });
    const goals = faker.number.int({ min: 0, max: Math.ceil(matches / 2) }); 
    
    return {
        name: faker.person.fullName(),
        position: faker.helpers.arrayElement(POSITIONS),
        age: faker.number.int({ min: 8, max: 20 }),
        team: faker.location.city() + " Academy",
        
        // NESTED OBJECT 1: Physical Data
        physical: {
            height: faker.number.int({ min: 150, max: 200 }), // cm
            weight: faker.number.int({ min: 50, max: 90 }),   // kg
            preferredFoot: faker.helpers.arrayElement(FEET)
        },
        
        // NESTED OBJECT 2: Statistics
        stats: {
            matchesPlayed: matches,
            goalsScored: goals,
            assists: faker.number.int({ min: 0, max: 20 }),
            skillRatings: {
                technical: faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
                physical: faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
                tactical: faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
                mental: faker.number.float({ min: 1, max: 10, fractionDigits: 1 })
            }
        },
        
        createdAt: new Date().toISOString(),
        isScouted: faker.datatype.boolean()
    };
}

async function seedPlayers(count = 20) {
    try {
        console.log(`Generating ${count} junior players for MySquad platform...`);
        
        const playersCollection = db.collection('players'); 
        const batch = db.batch();

        for (let i = 0; i < count; i++) {
            const docRef = playersCollection.doc();
            batch.set(docRef, generateJuniorPlayer());
        }

        await batch.commit();
        console.log(`Success! ${count} players have been created with physical data and statistics.`);
        
    } catch (error) {
        console.error('Error generating players:', error);
    }
}

if (require.main === module) {
    seedPlayers().then(() => process.exit());
}

module.exports = { seedPlayers };