require('dotenv').config();
const seed = require('./dataUpd');
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database');

const app = express();
const PORT = process.env.PORT || 4000; // daca nu gaseste cheia
const path = require('path');
//midelware
app.use(cors()); //toata lumea are acces sa faca req
app.use(express.json()); //transforma jsonul din req intr un obiect ca sa fie folosit mai departe

// Rute (vom crea după)
app.use('/users', require('./routes/users'));
app.use('/pets', require('./routes/pets'));
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sincronizare DB + start server
sequelize.sync({force:true}).then(()  => {
  console.log('Database synced');

  app.listen(PORT, async ()=>
    { console.log(`Server running on port ${PORT}`)
  await seed();}
);
});
