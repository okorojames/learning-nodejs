const Tour = require('../models/tourModel');
//

//
const getAllTours = async (req, res) => {
  try {
    //
    // first method of getting based on search queries
    /* const tours = await Tour.find({
      duration: 5,
      difficulty: 'easy',
    });*/

    //
    // Second method of getting data based on search queries using mongoos methods
    // const tours = await Tour.find()
    //   .sort({ createdAt: -1 })
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //
    // Third but best method of getting data baed on search queries (similar to the first one),
    // though the issue with it is that if page is included, then it'll show in t he search params as well which will query the database as well, of which we would not want, so the solution is to desctructure the queryObject and delete most the ones we do not need.
    // const tours = await Tour.find(req.query).sort({ createdAt: -1 });

    const queryObj = { ...req.query };
    delete queryObj.page;
    const tours = await Tour.find(queryObj).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'Success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'Failed', message: err });
  }
};

//
const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // findById is a shorthand for writing " Tour.findOne({_id:req.params.id})  "
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'Failed', message: err });
  }
};

//
const createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      satus: 'Failed',
      message: err,
    });
  }
};

//
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: 'Success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'Failed', message: err });
  }
};

//
const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({ status: 'Failed', message: err });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
