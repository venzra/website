import { Schema, Document, Model, model } from 'mongoose';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;

interface IAccountValidation {
    key: string;
    expires: Date;
}

interface IAccountModel extends Document {
    identity?: string;
    validation?: IAccountValidation;
    status?: string;
}

const AccountSchema: Schema = new Schema({
    identity: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: [
            (val: string) => EMAIL_REGEX.test(val), 'Invalid email address'
        ]
    },
    validation: {
        type: {
            key: {
                type: String,
                required: true
            },
            expires: {
                type: Date,
                required: true
            }
        }
    },
    status: {
        type: String,
        enum: ['REGISTERED', 'ACTIVE', 'RECOVERY', 'LOCKED', 'DISABLED'],
        required: true,
        default: 'REGISTERED'
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated: {
        type: Date,
        required: true,
        default: Date.now
    }
});

AccountSchema.index({ identity: 1 }, { unique: true });

AccountSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const AccountModel: Model<IAccountModel> = model('accounts', AccountSchema);

export { AccountModel, IAccountModel };
