const { comparePassword } = require('../auth');
const db  = require('../db')

const usersCollection = db.collection('users')

const findByEmail = async (email) => {

        const snapshot = await usersCollection
            .where('email', '==', email)
            .get();

        if (snapshot.empty) {
            return null
        }

        const userDoc = snapshot.docs[0];
        const user = {
            id: userDoc.id,
            ...userDoc.data()
        };

        return user
}

const verifyPassword = async (plainPassword, hashedPassword) => {
    return await comparePassword(plainPassword, hashedPassword)
}

const checkEmailExists = async (email) => {
    const snapshot = await usersCollection
        .where('email', '==', email)
        .get();

    return !snapshot.empty;
}

const create = async (userData) => {
    const docRef = await usersCollection.add(userData);
    return docRef.id;
}

const findById = async (id) => {
    const doc = await usersCollection.doc(id).get();
    
    if (!doc.exists) {
        return null;
    }
    
    const userData = doc.data();
    const { password, ...userWithoutPassword } = userData;
    
    return {
        id: doc.id,
        ...userWithoutPassword
    };
}

const update = async (id, updateData) => {
    updateData.updatedAt = new Date().toISOString();
    await usersCollection.doc(id).update(updateData);
    
    const updatedDoc = await usersCollection.doc(id).get();
    const userData = updatedDoc.data();
    const { password, ...userWithoutPassword } = userData;
    
    return {
        id: updatedDoc.id,
        ...userWithoutPassword
    };
}

const remove = async (id) => {
    await usersCollection.doc(id).delete();
    return true;
}

module.exports = {
    findByEmail,
    verifyPassword,
    checkEmailExists,
    create,
    findById,
    update,
    remove
}