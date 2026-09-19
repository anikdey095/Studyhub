import authService from './auth.service.js';

class AuthController {
  async signup(req, res, next) {
    try {
      const { email, name, university, studentId, password } = req.body;

      if (!email || !name || !password) {
        return res.status(400).json({ 
          error: 'Email, name, and password are required',
          message: 'Email, name, and password are required'
        });
      }

      if (studentId && !/^\d{3}-\d{3}-\d{3}$/.test(studentId.trim())) {
        return res.status(400).json({
          error: 'Invalid Student ID format',
          message: 'University Student ID must be formatted like 231-115-095 (3 digits - 3 digits - 3 digits).'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'Password must be at least 6 characters long',
          message: 'Password must be at least 6 characters long'
        });
      }

      const userUniversity = university && university.trim() ? university.trim() : 'General Student';

      const result = await authService.signup({
        email: email.toLowerCase().trim(),
        name: name.trim(),
        university: userUniversity,
        studentId: studentId ? studentId.trim() : undefined,
        password
      });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          university: result.user.university,
          studentId: result.user.studentId || studentId,
          role: result.user.role || 'student',
        },
        token: result.token
      });
    } catch (error) {
      if (error.code === 'P2002' || error.statusCode === 409 || error.isDuplicate) {
        return res.status(409).json({ 
          success: false,
          error: 'Email already registered',
          message: error.message || 'An account with this email already exists. Please log in or use a different email.'
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
          error: 'Email and password are required',
          message: 'Email and password are required'
        });
      }

      const result = await authService.login({
        email: email.toLowerCase().trim(),
        password
      });

      if (!result) {
        return res.status(401).json({ 
          error: 'Invalid email or password',
          message: 'Invalid email or password'
        });
      }

      res.json({
        message: 'Login successful',
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          university: result.user.university,
          role: result.user.role || 'student',
        },
        token: result.token
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();