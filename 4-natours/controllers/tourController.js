const Tour = require('../models/tourModel');
//

class ApiFeature {}

//
const aliasTours = (req, res, next) => {
  (req.query.limit = '5'), (req.query.sort = '-ratingAverage,price');
  req.query.fields = 'name,price,ratingsAverage,summary,difficlty';
  next();
};

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

    // so in order to exclude some certian request queries like page, sort etc, we will be needing to create an array of the files we need to exclude then ue the delete functionalites for them.

    //BUILD THE QUERY
    // 1A) Filtering

    /* const queryObj = { ...req.query };
    // array of excluded fields
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));*/

    // 2)Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    // 3)Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('This page does not exist');
      }
    }
    //
    //

    // EXECUTE THE QUERY
    const tours = await query;

    // SEND RESPONSE
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
  aliasTours,
};
