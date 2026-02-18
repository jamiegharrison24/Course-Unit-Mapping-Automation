import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define the schema for the additional information required for role verification
const AdditionalInfoSchema = new Schema({
    university: { 
        type: String, 
        trim: true 
    },
    major: { 
        type: String, 
        trim: true 
    },
    department: { 
        type: String, 
        trim: true 
    },
    faculty: {
        type: String,
        trim: true
    },
    professionalTitle: { 
        type: String, 
        trim: true 
    },
    studentId: { 
        type: String, 
        trim: true 
    },
    staffId: { 
        type: String, 
        trim: true 
    }
});

// Define the schema for password reset information
const PasswordResetSchema = new Schema({
    resetToken: { 
        type: String 
    },
    resetTokenExpiry: { 
        type: Date 
    },
});

// Define the schema for refresh token information
const RefreshTokenSchema = new Schema({
    token: { 
        type: String 
    },
    expiry: { 
        type: Date 
    },
});

// Define the main User schema
const UserSchema = new Schema({
    // Authentication Fields
    // For users authenticated via Google
    userGoogleId: { 
        type: String, 
        index: true, 
        sparse: true 
    }, 
    // For users authenticated via email/password
    hashedPassword: { 
        type: String 
    }, 

    // Personal Information
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    emailVerified: { 
        type: Boolean, 
        default: false 
    },
    emailHD: { 
        type: String, 
        trim: true 
    },
    firstName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    lastName: { 
        type: String, 
        required: true, 
        trim: true 
    },

    // Role and Status Fields
    role: { 
        type: String, 
        enum: ['student', 'course_director', 'general_user', 'admin'] 
    },
    askingRole:{
        type: String,
        enum: ['student', 'course_director', 'general_user']
    },
    status: {
        type: String,
        enum: ['pending_role', 'active', 'rejected']
    },

    // Additional Information for Role Verification
    additional_info: AdditionalInfoSchema,

    // User Connections
    connections: [
        {
            unitAId: { 
                type: Schema.Types.ObjectId, 
                ref: 'Unit' 
            },
            unitBId: { 
                type: Schema.Types.ObjectId, 
                ref: 'Unit' 
            }
        },
    ],

    // Multi-Factor Authentication Fields
    mfaEnabled: { 
        type: Boolean, 
        default: false 
    },
    mfaSecret: { 
        type: String 
    },

    // Password Reset Information
    passwordReset: PasswordResetSchema,

    // Refresh Token
    refreshToken: RefreshTokenSchema,

    // Timestamps
    createdDate: { 
        type: Date, 
        default: Date.now 
    },
    updatedDate: { 
        type: Date, 
        default: Date.now 
    },
    lastLogin: { 
        type: Date 
    },

    // Verification Timestamps
    verificationRequestedAt: { 
        type: Date 
    },
    verifiedAt: { 
        type: Date 
    },
});

// Pre-save middleware to update the updatedDate field
UserSchema.pre('save', function (next) {
  this.updatedDate = Date.now();
  next();
});


const User = mongoose.model('User', UserSchema);

export default User;
