const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors()); 

app.use('/auth', require('./routes/auth'));
app.use('/playlists', require('./routes/playlists'));
app.use('/tracks', require('./routes/tracks'));

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
