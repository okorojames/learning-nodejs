const express = require('express');

const fs = require('fs');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 😍');
  next();
});

//
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
//
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'Success',
    reuestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

//
const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  //   return res.status(404).json({ status: 'Fail', message: 'Invalid ID' });
  // }

  if (!tour) {
    return res.status(404).json({ status: 'Fail', message: 'Invalid ID' });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

//
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err, data) => {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

//
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(400).json({ status: 'Failed', message: 'Invalid ID' });
  }
  return res.status(200).json({
    status: 'Success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

//
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(400).json({ status: 'Failed', message: 'Invalid ID' });
  }
  return res.status(204).json({
    status: 'Success',
    data: null,
  });
};

// get tours
// app.get('/api/v1/tours', getAllTours);

// get a single tour
// app.get('/api/v1/tours/:id', getTour);

// post tour
// app.post('/api/v1/tours', createTour);

// updating a single tour
// app.patch('/api/v1/tours/:id', updateTour);

// updating a single tour
// app.delete('/api/v1/tours/:id', deleteTour);
//

// new route method of handling route functionality
app.route('/api/v1/tours').get(getAllTours).post(createTour);
//
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//
const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
