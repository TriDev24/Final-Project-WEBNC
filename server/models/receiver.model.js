import generate from './generic.model.js';

const schema = {
    senderAccountNumber: String,
    receiverAccountNumber: String,
};

export default generate('Receivers', schema);
