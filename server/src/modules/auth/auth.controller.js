import authService from './auth.service.js';

class AuthController {
  async signup(req, res, next) {
    try {
      const { email, name, university, password } = req.body;

      if (!email || !name || !university || !password) {
        return res.status(400).json({ 
          error: 'All fields are required: email, name, university, password' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'Password must be at least 6 characters long' 
        });
      }

      const result = await authService.signup({
        email: email.toLowerCase(),
        name,
        university,
        password
      });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          university: result.user.university
        },
        token: result.token
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ 
          error: 'User with this email already exists' 
        });
      }
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required' 
        });
      }

      const result = await authService.login({
        email: email.toLowerCase(),
        password
      });

      if (!result) {
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        });
      }

      res.json({
        message: 'Login successful',
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          university: result.user.university
        },
        token: result.token
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();