import app from './app.js';

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`API Boneco Veio ouvindo em http://localhost:${PORT}`);
});
