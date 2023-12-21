require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const router = require('./router');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/../client/build'));
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
