import mongoose, { Mongoose } from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    date: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    maxParticipants: {
      type: Number,
      required: true
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    category: {
      type: String,
      enum: ['Technical', 'Non-Technical'],
      required: true
    },
    paymentType: {
      type: String,
      enum: ['Free', 'Paid'],
      required: true
    },
    evaluationMarkers: [
      {
        name: {
          type: String,
          required: true
        },
        weight: {
          type: Number, // percentage or points, your call
          required: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);



const ScholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    degrees: {
      type: String,
      required: true
    },
    courses: {
      type: String,
      required: true
    },
    nationalities: {
      type: String,
      required: true
    },
    funding: {
      type: String,
      required: true
    },
    deadline:{
      type: Date,
      required: true
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

const Event=new mongoose.model('Event', eventSchema);
const Scholarship=new mongoose.model('Scholarship',ScholarshipSchema)

export default {Event,Scholarship}


