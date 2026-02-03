const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');
require('./models'); // Import models to register them

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const saleRoutes = require('./routes/saleRoutes');
const repairRoutes = require('./routes/repairRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', saleRoutes);
app.use('/api', repairRoutes);

app.get('/', (req, res) => {
    res.send('MobileStore Manager API is running...');
});

// Database Connection & Server Start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models (force: false means don't drop tables)
        await sequelize.sync({ force: false });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('CRITICAL ERROR: Unable to connect to the database.');
        console.error('Check if MySQL is running and credentials in .env are correct.');
        console.error('Error Details:', error.message);
        process.exit(1);
    }
};

startServer();
