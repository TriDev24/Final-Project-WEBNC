import Identity from './identity.component.js';
import Debit from './debit.component.js';
import Debtor from './debtor.component.js';
import Notify from './notify.component.js';
import User from './user.component.js';
import Billing from './billing.component.js';
import BankAccount from './bank-account.component.js';
import Receiver from './receiver.component.js';

export default {
    schemas: {
        _id: {
            type: 'string',
            description: 'id của một model',
            example: '6399b69c68d8f792ed3bde8c',
        },
        ...Identity,
        ...Debit,
        ...Debtor,
        ...Notify,
        ...User,
        ...Billing,
        ...BankAccount,
        ...Receiver,
    },
    securitySchemes: {
        Authorization: {
            type: 'apiKey',
            name: 'authorization',
            in: 'header',
            description: 'Access token',
        },
    },
};
