const { sequelize } = require('./config/database');
const { models } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync database (altering tables if needed)
        await sequelize.sync({ alter: true });

        // 1. Create Admin User
        const adminEmail = 'admin@mobilestore.com';
        const existingAdmin = await models.User.findOne({ where: { email: adminEmail } });

        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);

            await models.User.create({
                name: 'Admin Owner',
                email: adminEmail,
                password: hashedPassword,
                role: 'owner'
            });
            console.log('Admin user created: admin@mobilestore.com / 123456');
        } else {
            console.log('Admin user already exists.');
        }

        // 2. Create Categories
        const categories = [
            { name: 'Smartphones', type: 'product' },
            { name: 'Accessories', type: 'accessory' },
            { name: 'Repairs', type: 'service' },
            { name: 'Spare Parts', type: 'spare_part' }
        ];

        for (const cat of categories) {
            const exists = await models.Category.findOne({ where: { name: cat.name } });
            if (!exists) {
                await models.Category.create(cat);
            }
        }
        console.log('Categories seeded.');

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
