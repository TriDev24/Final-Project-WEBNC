import generate from './generic.model.js';

const schema = {
    senderAccountNumber: String,
    receiverAccountNumber: String,
    aliasName: String,
};

export default generate('Receivers', schema);
