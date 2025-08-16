import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { landingAPI } from '../services/api';

const LandingPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await landingAPI.getData();
        setData(response.data);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching landing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>TravelPlatform</h2>
          </div>
          <ul className="nav-menu">
            <li><Link to="/browse-trips">Browse Trips</Link></li>
            <li><Link to="/company-register" className="btn btn-outline">Partner With Us</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>{data?.title || 'Discover Amazing Local Adventures'}</h1>
          <p>{data?.subtitle || 'Connect with verified local travel companies and book unforgettable experiences'}</p>
          
          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">{data?.totalCompanies || 0}</div>
              <div className="stat-label">Travel Companies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{data?.totalTrips || 0}</div>
              <div className="stat-label">Available Trips</div>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/browse-trips" className="btn btn-primary btn-large">
              Explore Trips
            </Link>
            <Link to="/company-register" className="btn btn-secondary btn-large">
              Join as Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-section">
        <div className="container">
          <h2>Popular Destinations</h2>
          <div className="destinations-grid">
            {data?.featuredDestinations?.map((destination, index) => (
              <div key={index} className="destination-card">
                <div className="destination-image">
                  <div className="placeholder">📍</div>
                </div>
                <h3>{destination}</h3>
                <Link to="/browse-trips" className="btn btn-small">
                  View Trips
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 TravelPlatform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;