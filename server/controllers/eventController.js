import Models from '../models/Event.js';
const { Event, Scholarship } = Models;
import sendMail from '../util/mail.js';
import User from '../models/User.js';

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      maxParticipants,
      organizerId,
      category,
      paymentType,
      evaluationMarkers // new field
    } = req.body;

    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize time

    if (eventDate < today) {
      return res.status(400).json({ message: 'Event date cannot be in the past' });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      maxParticipants,
      category,
      paymentType,
      organizer: organizerId,
      evaluationMarkers: evaluationMarkers || []
    });

    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Error creating event', error: e.message });
  }
};


export const createScholarship = async (req, res) => {
  try {
    const { title, degrees, courses, nationalities, funding, deadline,organizerId } = req.body;


    const eventDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize time


    if (eventDate < today) {
      return res.status(400).json({ message: 'Event date cannot be in the past' });
    }

    const newEvent = new Scholarship({
      title,
      degrees,
      courses,
      nationalities,
      funding,
      deadline,
      organizer: organizerId,
    });

    await newEvent.save();

    res.status(201).json({ message: 'Scholarship created successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Error creating event', error: e.message });
  }
};

export const getRegisteredEvents = async (req, res) => {
  const { userId } = req.params;

  try {
    const events = await Event.find({ participants: userId })
                              .populate('organizer', 'name email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching registered egetRegisteredEventsvents', error: err.message });
  }
};

export const getAllEvents = async (req, res) => {
  const { userId } = req.query; // Expect userId from query parameter
  try {
    const query = userId ? { organizer: { $ne: userId } } : {};
    const events = await Event.find().populate('organizer', 'name email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
};

export const getAllScholarship = async (req, res) => {
  try {
    const events = await Scholarship.find().populate('organizer', 'name email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
};

export const registerForEvent = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organizer.toString() === userId) {
      return res.status(403).json({ message: "Organizers cannot register for their own event" });
    }

    if (event.participants.includes(userId)) {
      return res.status(409).json({ message: 'User already registered' });
    }

    if (event.participants.length >= event.maxParticipants) {
      return res.status(409).json({ message: 'Event is full' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });


    event.participants.push(userId);
    await event.save();

    await sendMail({
      email: user.email,
      subject:`Registration was Successfull for the event ${event.title}`,
      message:` Hi ${user.name},

Thank you for registering!

We’re excited to confirm your successful registration for the event: "${event.title}".

Here are the details of your registration:
Event Name: ${event.title}
Date: ${event.date}
Location: ${event.location}

Please keep this email for your records. You will receive further updates and reminders as the event approaches.

If you have any questions, feel free to reach out to us.

Best regards,  
Event Management Team,
Eventhon.

`
    });


    res.status(200).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};


export const registerForScholarship = async (req, res) => {
  const { ScholarshipId } = req.params;
  const { userId } = req.body;

  try {
    const event = await Scholarship.findById(ScholarshipId);
    if (!event) return res.status(404).json({ message: 'Scholarship not found' });

    if (event.organizer.toString() === userId) {
      return res.status(403).json({ message: "Organizers cannot register for their own Scholarship" });
    }


    if (event.participants.includes(userId)) {
      return res.status(409).json({ message: 'User already registered' });
    }
  
    event.participants.push(userId);
    await event.save();

    res.status(200).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  // console.log(eventId)
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};

export const deleteScholarship = async (req, res) => {
  const { ScholarshipId } = req.params;
  // console.log(ScholarshipId)
  try {
    const event = await Scholarship.findById(ScholarshipId);
    if (!event) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    await Scholarship.findByIdAndDelete(ScholarshipId);
    res.status(200).json({ message: 'ScholarshipId deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete Scholarship', error: err.message });
  }
};

export const getEventParticipants = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId).populate('participants', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json(event.participants);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching participants', error: err.message });
  }
};

export const getScholarshipParticipants = async (req, res) => {
  const { ScholarshipId } = req.params;

  try {
    const event = await Scholarship.findById(ScholarshipId).populate('participants', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json(event.participants);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching participants', error: err.message });
  }
};
export const getAllEventsByOrganizer = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.params.organizerId })
                              .populate('participants', 'name email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events by organizer', error: err.message });
  }
};

export const getAllScholarshipByOrganizer = async (req, res) => {
  try {
    const events = await Scholarship.find({ organizer: req.params.organizerId })
                              .populate('participants', 'name email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events by organizer', error: err.message });
  }
};




export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const {
    title,
    description,
    date,
    location,
    maxParticipants,
    category,
    paymentType,
    organizerId,
    evaluationMarkers // ✅ accept from request
  } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organizer.toString() !== organizerId) {
      return res.status(403).json({ message: 'Only the organizer can update this event' });
    }

    const newDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate < today) {
      return res.status(400).json({ message: 'Event date cannot be in the past' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        description,
        date,
        location,
        maxParticipants,
        category,
        paymentType,
        evaluationMarkers // ✅ include in update
      },
      { new: true }
    ).populate('organizer', 'name email');

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event', error: err.message });
  }
};

export const cancelRegistration = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const index = event.participants.indexOf(userId);
    if (index === -1) {
      return res.status(409).json({ message: 'User is not registered for this event' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });


    event.participants.splice(index, 1); // remove user from participants array
    await event.save();


    await sendMail({
      email: user.email,
      subject: `Registration Cancelled Successfully: "${event.title}"`,
      message:`Hi ${user.name},

We wanted to let you know that your registration for the event "${event.title}" has been successfully cancelled.

If this was a mistake or if you have any questions regarding the cancellation, please don’t hesitate to contact the event organizer or our support team.

We hope to see you in future events!

Best regards,  
Event Management Team  
[Your Organization Name or Contact Info]
            `
    });

    res.status(200).json({ message: 'Registration cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel registration', error: err.message });
  }
};

export const getEventById = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId)
                             .populate('organizer', 'name email')
                             .populate('participants', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event details', error: err.message });
  }
};
export const removeParticipant = async (req, res) => {
  const { eventId } = req.params;
  const { userId, organizerId,reason } = req.body;
  // console.log(reason)

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const index = event.participants.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ message: 'User is not a participant' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    event.participants.splice(index, 1);
    await event.save();

    // Send email to the removed participant
    await sendMail({
      email: user.email,
      subject: `You were removed from the event: ${event.title}`,
      message:` Hi ${user.name},\n\nYou have been removed from the event "${event.title}" due to ${reason}. If you have any questions, please contact the organizer.\n\nBest regards,\nEvent Management Team`
    });

    res.status(200).json({ message: 'Participant removed and email sent successfully' });
  } catch (err) {
    console.error('Error in removeParticipant:', err);
    res.status(500).json({ message: 'Failed to remove participant', error: err.message });
  }
};

export const deleteEvent_org = async (req, res) => {
  const { eventId } = req.params;
  const { organizerId } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== organizerId) {
      return res.status(403).json({ message: 'Only the organizer can delete this event' });
    }

    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};