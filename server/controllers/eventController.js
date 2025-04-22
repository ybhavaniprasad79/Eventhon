import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants, organizerId } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      maxParticipants,
      organizer: organizerId,
    });

    await newEvent.save();

    // Optionally populate the organizer when returning the new event
    const eventWithOrganizer = await Event.findById(newEvent._id).populate('organizer', 'name email');
    
    res.status(201).json(eventWithOrganizer);
  } catch (e) {
    res.status(500).json({ message: 'Error creating event', error: e.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
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

    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: 'User already registered' });
    }

    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
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
export const getAllEventsByOrganizer = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.params.organizerId })
                              .populate('participants', 'name email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events by organizer', error: err.message });
  }
};
