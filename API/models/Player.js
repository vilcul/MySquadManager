const db = require('../db');

const playersCollection = db.collection('players');

const findAll = async () => {
    const snapshot = await playersCollection.get();
    const players = [];

    snapshot.forEach(doc => {
        players.push({
            id: doc.id,
            ...doc.data()
        });
    });

    return players;
};

const findById = async (id) => {
    const doc = await playersCollection.doc(id).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data()
    };
};

const create = async (playerData) => {
    const docRef = await playersCollection.add(playerData);
    return docRef.id;
};

const update = async (id, playerData) => {
    const docRef = playersCollection.doc(id);
    await docRef.update(playerData);

    const updatedDoc = await docRef.get();
    return {
        id: updatedDoc.id,
        ...updatedDoc.data()
    };
};

const remove = async (id) => {
    const docRef = playersCollection.doc(id);
    await docRef.delete();
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};
