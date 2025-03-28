import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { authState } from '../../states/authState';
import { login } from '../../services/authService';
import styles from './loginForm.module.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from '../../assets/logopms1.png'; 

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'email') {
      if (!value) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'Email is invalid';
      else delete newErrors.email;
    }

    if (name === 'password') {
      if (!value) newErrors.password = 'Password is required';
      else if (value.length < 8) newErrors.password = 'Password must be at least 8 characters';
      else delete newErrors.password;
    }

    setErrors(newErrors);
  };

  const handleBlur = (e) => validateField(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate before submission
    validateField('email', email);
    validateField('password', password);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await login({ email, password });

      setAuth({
        isAuthenticated: true,
        role: response.role,
        token: response.token
      });

      if (rememberMe) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
      } else {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('role', response.role);
      }

      if (onLogin) onLogin({ email, password, rememberMe });

      navigate(`/${response.role}/dashboard`); // ✅ Only navigates if login is successful

    } catch (error) {
      setErrors({
        form: error.response?.data?.message || error.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <img src={logo} alt="Logo" className={styles.logo} /> {/* ✅ Fixed Logo */}
      </div>

      <h2 className={styles.title}>Welcome Back!</h2>
      <p className={styles.subtitle}>Sign in if you have an account</p>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlur}
            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handleBlur}
              className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.toggleButton}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <i className="bi bi-eye-slash" style={{ fontSize: '1.2rem' }}></i>
              ) : (
                <i className="bi bi-eye" style={{ fontSize: '1.2rem' }}></i>
              )}
            </button>
          </div>
          {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
        </div>

        <div className={styles.rememberMe}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>

        {errors.form && <div className={styles.formError}>{errors.form}</div>}

        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;