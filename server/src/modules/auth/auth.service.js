import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../middleware/database.js';

class AuthService {
  generateToken(userId) {
    const payload = { userId };
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }

  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async signup(userData) {
    const { email, name, university, password } = userData;

    // Hash the password
    const hashedPassword = await this.hashPassword(password);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        university,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        university: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = this.generateToken(user.id);

    return { user, token };
  }

  async login(credentials) {
    const { email, password } = credentials;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return null;
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  }
}

export default new AuthService();