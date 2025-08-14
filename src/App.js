import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const onSubmit = (data) => {
    console.log('Booking submitted:', data);
    setBookingSubmitted(true);
    reset();
    setTimeout(() => setBookingSubmitted(false), 3000);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="App">
      <header role="banner">
        <div className="logo" aria-label="Little Lemon Restaurant Logo">
          <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="logo-title">
            <title id="logo-title">Little Lemon Restaurant</title>
            <rect width="200" height="60" fill="#F4CE14" rx="10"/>
            <text x="100" y="35" textAnchor="middle" fill="#495E57" fontSize="24" fontWeight="bold">Little Lemon</text>
          </svg>
        </div>
        
        <nav role="navigation" aria-label="Main navigation">
          <button 
            className="menu-toggle"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="main-menu"
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
          <ul id="main-menu" className={isMenuOpen ? 'menu-open' : ''}>
            <li><a href="#home" className="active" aria-current="page">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#reservations">Reservations</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main role="main">
        <section className="hero-banner" aria-labelledby="hero-title">
          <div className="hero-content">
            <h1 id="hero-title">Little Lemon</h1>
            <p>A charming neighborhood bistro that serves simple food and classic cocktails in a lively but casual environment.</p>
            <button className="cta-button" onClick={() => document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' })}>
              Reserve a Table
            </button>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Interior of Little Lemon restaurant showing elegant dining area with warm lighting"
            />
          </div>
        </section>

        <section className="features" aria-labelledby="features-title">
          <h2 id="features-title" className="sr-only">Our Specialties</h2>
          
          <article className="feature-card">
            <img 
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
              alt="Fresh Mediterranean salad with olives and feta cheese"
            />
            <h3>Fresh Ingredients</h3>
            <p>We source the finest Mediterranean ingredients to create authentic flavors that transport you to the sunny shores of Greece.</p>
          </article>
          
          <article className="feature-card">
            <img 
              src="https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
              alt="Chef preparing traditional Mediterranean dish in kitchen"
            />
            <h3>Traditional Recipes</h3>
            <p>Our chefs bring generations of culinary expertise, preparing each dish with time-honored techniques and passion.</p>
          </article>
          
          <article className="feature-card">
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
              alt="Cozy restaurant atmosphere with warm lighting and comfortable seating"
            />
            <h3>Cozy Atmosphere</h3>
            <p>Enjoy your meal in our warm, inviting space designed for memorable dining experiences with family and friends.</p>
          </article>
        </section>

        <section className="booking-section" aria-labelledby="booking-title">
          <form 
            id="booking-form" 
            className="booking-form" 
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-labelledby="booking-title"
          >
            <h2 id="booking-title">Reserve Your Table</h2>
            
            {bookingSubmitted && (
              <div className="success-message" role="alert" aria-live="polite">
                Thank you! Your reservation has been submitted successfully.
              </div>
            )}
            
            <div className={`form-group ${errors.name ? 'error' : ''}`}>
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                {...register('name', { 
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <span id="name-error" className="error-message" role="alert">
                  {errors.name.message}
                </span>
              )}
            </div>
            
            <div className={`form-group ${errors.email ? 'error' : ''}`}>
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <span id="email-error" className="error-message" role="alert">
                  {errors.email.message}
                </span>
              )}
            </div>
            
            <div className={`form-group ${errors.phone ? 'error' : ''}`}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                type="tel"
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[1-9][\d]{0,15}$/,
                    message: 'Invalid phone number'
                  }
                })}
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <span id="phone-error" className="error-message" role="alert">
                  {errors.phone.message}
                </span>
              )}
            </div>
            
            <div className={`form-group ${errors.date ? 'error' : ''}`}>
              <label htmlFor="date">Reservation Date *</label>
              <input
                id="date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register('date', { 
                  required: 'Date is required'
                })}
                aria-invalid={errors.date ? 'true' : 'false'}
                aria-describedby={errors.date ? 'date-error' : undefined}
              />
              {errors.date && (
                <span id="date-error" className="error-message" role="alert">
                  {errors.date.message}
                </span>
              )}
            </div>
            
            <div className={`form-group ${errors.time ? 'error' : ''}`}>
              <label htmlFor="time">Reservation Time *</label>
              <select
                id="time"
                {...register('time', { 
                  required: 'Time is required'
                })}
                aria-invalid={errors.time ? 'true' : 'false'}
                aria-describedby={errors.time ? 'time-error' : undefined}
              >
                <option value="">Select a time</option>
                <option value="17:00">5:00 PM</option>
                <option value="17:30">5:30 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="18:30">6:30 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="19:30">7:30 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="20:30">8:30 PM</option>
                <option value="21:00">9:00 PM</option>
              </select>
              {errors.time && (
                <span id="time-error" className="error-message" role="alert">
                  {errors.time.message}
                </span>
              )}
            </div>
            
            <div className={`form-group ${errors.guests ? 'error' : ''}`}>
              <label htmlFor="guests">Number of Guests *</label>
              <select
                id="guests"
                {...register('guests', { 
                  required: 'Number of guests is required'
                })}
                aria-invalid={errors.guests ? 'true' : 'false'}
                aria-describedby={errors.guests ? 'guests-error' : undefined}
              >
                <option value="">Select number of guests</option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6 Guests</option>
                <option value="7">7 Guests</option>
                <option value="8">8 Guests</option>
              </select>
              {errors.guests && (
                <span id="guests-error" className="error-message" role="alert">
                  {errors.guests.message}
                </span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="occasion">Special Occasion (Optional)</label>
              <select id="occasion" {...register('occasion')}>
                <option value="">Select an occasion</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="date">Date Night</option>
                <option value="business">Business Dinner</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="requests">Special Requests (Optional)</label>
              <textarea
                id="requests"
                rows="3"
                placeholder="Any dietary restrictions, seating preferences, or special requests..."
                {...register('requests')}
              ></textarea>
            </div>
            
            <button type="submit" className="submit-button">
              Reserve Table
            </button>
          </form>
        </section>
      </main>

      <footer role="contentinfo">
        <div className="footer-logo" aria-label="Little Lemon Restaurant Logo">
          <svg width="150" height="40" viewBox="0 0 150 40" xmlns="http://www.w3.org/2000/svg" role="img">
            <rect width="150" height="40" fill="#F4CE14" rx="8"/>
            <text x="75" y="25" textAnchor="middle" fill="#495E57" fontSize="16" fontWeight="bold">Little Lemon</text>
          </svg>
        </div>
        <div className="footer-info">
          <p>© 2024 Little Lemon Restaurant. All rights reserved.</p>
          <p>123 Mediterranean Ave, Chicago, IL 60601 | (555) 123-4567</p>
        </div>
      </footer>
    </div>
  );
}

export default App;