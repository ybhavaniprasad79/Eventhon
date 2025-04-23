import express from 'express';
import { 
  createEvent,
  createScholarship,
  getRegisteredEvents,
  getAllEvents,
  getAllScholarship, 
  registerForEvent,
  registerForScholarship, 
  deleteEvent,
  deleteScholarship,
  getEventParticipants,
  getScholarshipParticipants, 
  getAllEventsByOrganizer ,
  getAllScholarshipByOrganizer,
  updateEvent,
  cancelRegistration,
  getEventById,
  removeParticipant,
  deleteEvent_org
} from '../controllers/eventController.js';

import {authadmin,authuser,authOrganizer} from '../middleware/auth.js'

const router = express.Router();

router.post('/create', authOrganizer,createEvent); // Create a new eventauthOrganizer
router.post('/createScholarship', authOrganizer,createScholarship);
router.get('/event', getAllEvents); // Get all events
router.get('/Scholarship', getAllScholarship);
router.post('/register_event/:eventId',authuser, registerForEvent); // Register for an event
router.post('/register_Scholarship/:ScholarshipId',authuser, registerForScholarship); // Register for an Scholarship
router.get('/:eventId/participants',authOrganizer, getEventParticipants); // Get participants of an event
router.get('/:ScholarshipId/participants',authOrganizer, getScholarshipParticipants); // Get participants of an ScholarshipId
router.get('/organizer_events/:organizerId',authOrganizer, getAllEventsByOrganizer); // Get events by organizer
router.get('/organizer_Scholarship/:organizerId',authOrganizer, getAllScholarshipByOrganizer); // Get events by organizer
router.delete('/eve/:eventId',authadmin, deleteEvent);// Delete from admin only
router.delete('/Sch/:ScholarshipId',authadmin, deleteScholarship);// Delete from admin only
router.get('/registered/:userId', getRegisteredEvents); // Get events user is registered in
router.put('/update/:eventId', updateEvent);
router.put('/cancel/:eventId', cancelRegistration);
router.get('/:eventId', getEventById);
router.put('/cancel-registration/:eventId', removeParticipant);
router.delete('/delete/:eventId', deleteEvent_org);
export default router;
