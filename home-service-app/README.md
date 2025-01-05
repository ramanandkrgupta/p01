### Project Setup

1. **Initialize the Project**:
   Create a new directory for your project and initialize it with npm or yarn.

   ```bash
   mkdir home-service-app
   cd home-service-app
   npm init -y
   ```

2. **Install Required Packages**:
   Install the necessary packages for your application.

   ```bash
   npm install express prisma @prisma/client otpless dotenv cors
   ```

3. **Set Up Prisma**:
   Initialize Prisma in your project.

   ```bash
   npx prisma init
   ```

   This will create a `prisma` folder with a `schema.prisma` file.

4. **Configure PostgreSQL**:
   Update your `.env` file with your PostgreSQL database connection string.

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

5. **Define Your Prisma Schema**:
   In `prisma/schema.prisma`, define your data models for customers, service workers, and admins.

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }

   model User {
     id        Int      @id @default(autoincrement())
     phone     String   @unique
     role      UserRole
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }

   enum UserRole {
     CUSTOMER
     SERVICE_WORKER
     ADMIN
   }

   model Notification {
     id        Int      @id @default(autoincrement())
     userId    Int
     message   String
     createdAt DateTime @default(now())
     user      User     @relation(fields: [userId], references: [id])
   }
   ```

6. **Run Migrations**:
   Create and run the migration to set up your database.

   ```bash
   npx prisma migrate dev --name init
   ```

7. **Set Up Express Server**:
   Create a basic Express server in `index.js`.

   ```javascript
   const express = require('express');
   const cors = require('cors');
   const { PrismaClient } = require('@prisma/client');
   const otpless = require('otpless');

   const app = express();
   const prisma = new PrismaClient();

   app.use(cors());
   app.use(express.json());

   // OTP Login Endpoint
   app.post('/login', async (req, res) => {
     const { phone } = req.body;
     // Use Otpless to send OTP
     const otpService = otpless({ apiKey: 'YOUR_OTPLESS_API_KEY' });
     const otp = await otpService.sendOtp(phone);
     res.json({ message: 'OTP sent', otp });
   });

   // Verify OTP Endpoint
   app.post('/verify', async (req, res) => {
     const { phone, otp } = req.body;
     const otpService = otpless({ apiKey: 'YOUR_OTPLESS_API_KEY' });
     const isValid = await otpService.verifyOtp(phone, otp);
     if (isValid) {
       // Create or find user in the database
       let user = await prisma.user.findUnique({ where: { phone } });
       if (!user) {
         user = await prisma.user.create({ data: { phone, role: 'CUSTOMER' } });
       }
       res.json({ message: 'Login successful', user });
     } else {
       res.status(401).json({ message: 'Invalid OTP' });
     }
   });

   // Start the server
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });
   ```

8. **Implement Notifications**:
   You can create a function to send notifications to service workers when a new job is assigned.

   ```javascript
   async function sendNotification(userId, message) {
     await prisma.notification.create({
       data: {
         userId,
         message,
       },
     });
   }
   ```

### User Roles and Permissions

You can implement middleware to check user roles and permissions for different routes. For example:

```javascript
function checkRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

// Example usage
app.get('/admin', checkRole('ADMIN'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});
```

### Conclusion

This is a basic setup for a home service application with OTP login, user roles, and a PostgreSQL database using Prisma ORM. You can expand upon this by adding more features, such as job listings, service requests, and a frontend interface using React or another framework. Make sure to handle error cases and secure your application properly before deploying it.