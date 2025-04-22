import express from 'express';
import { 
  createEvent, 
  getAllEvents, 
  registerForEvent, 
  getEventParticipants, 
  getAllEventsByOrganizer ,
  deleteEvent
} from '../controllers/eventController.js';

import {authadmin,authuser,authOrganizer} from '../middleware/auth.js'

const router = express.Router();

router.post('/create', authOrganizer,createEvent); // Create a new eventauthOrganizer
router.get('/', getAllEvents); // Get all events
router.post('/register/:eventId',authuser, registerForEvent); // Register for an event
router.get('/:eventId/participants',authOrganizer, getEventParticipants); // Get participants of an event
router.get('/organizer/:organizerId',authOrganizer, getAllEventsByOrganizer); // Get events by organizer
router.delete('/:eventId',authadmin, deleteEvent);// Delete from admin only


export default router;
