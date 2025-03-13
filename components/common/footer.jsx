import React from 'react';
import styled from '@emotion/styled';

const FooterWrapper = styled.footer`
  background-color: #111827;
  color: #9CA3AF;
  padding: 3rem 0 1.5rem;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  
  .footer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2.5rem;
    margin-bottom: 3rem;
  }
  
  .footer-section {
    .title {
      font-size: 1.125rem;
      font-weight: 600;
      color: white;
      margin-bottom: 1.25rem;
    }
    
    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        
        i {
          color: #10B981;
          margin-right: 0.75rem;
          font-size: 0.875rem;
        }
      }
    }
    
    .brand-text {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(to right, #10B981, #34D399);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
      font-family: 'Poppins', system-ui, sans-serif;
    }
    
    .description {
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    
    .social-links {
      display: flex;
      gap: 1rem;
      
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        background-color: #1F2937;
        border-radius: 50%;
        color: #E5E7EB;
        transition: all 0.2s ease;
        
        &:hover {
          background-color: #10B981;
          color: white;
          transform: translateY(-2px);
        }
      }
    }
  }
  
  .footer-bottom {
    border-top: 1px solid #374151;
    padding-top: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    
    .copyright {
      font-size: 0.875rem;
      
      a {
        color: #10B981;
        text-decoration: none;
        font-weight: 600;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    .legal-links {
      display: flex;
      gap: 1.5rem;
      
      a {
        font-size: 0.875rem;
        color: #9CA3AF;
        text-decoration: none;
        
        &:hover {
          color: #10B981;
        }
      }
    }
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
      
      .legal-links {
        justify-content: center;
      }
    }
  }
`;

const Footer = () => {
  const features = [
    { icon: 'fas fa-shield-alt', text: 'End-to-end encryption' },
    { icon: 'fas fa-ban', text: 'No data collection' },
    { icon: 'fas fa-server', text: 'No server storage' },
    { icon: 'fas fa-file', text: 'Any file size supported' }
  ];

  return (
    <FooterWrapper>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <div className="brand-text">Droply</div>
            <p className="description">
              A simple, secure and privacy-focused file transfer solution.
              Transfer files of any size directly between devices.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="title">Features</h3>
            <ul className="features-list">
              {features.map((feature, index) => (
                <li key={index}>
                  <i className={feature.icon}></i>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="title">Quick Links</h3>
            <ul className="features-list">
              <li><i className="fas fa-chevron-right"></i><span>How it works</span></li>
              <li><i className="fas fa-chevron-right"></i><span>About us</span></li>
              <li><i className="fas fa-chevron-right"></i><span>Support</span></li>
              <li><i className="fas fa-chevron-right"></i><span>FAQ</span></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            Created by <a href="#">Robin</a> &copy; 2025 All Rights Reserved
          </div>
          
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </FooterWrapper>
  );
};

export default Footer;