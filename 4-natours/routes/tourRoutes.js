const express = require('express');
const router = express.Router();
//
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTours,
} = require('../controllers/tourController');

// Alias routes
router.route('/top-5-cheap').get(aliasTours, getAllTours);

// new route method of handling route functionality
router.route('/').get(getAllTours).post(createTour);
//
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
//
module.exports = router;
