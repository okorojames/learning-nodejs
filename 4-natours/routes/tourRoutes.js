const express = require('express');
const router = express.Router();
//
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

// new route method of handling route functionality
router.route('/').get(getAllTours).post(createTour);
//
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
//
module.exports = router;
