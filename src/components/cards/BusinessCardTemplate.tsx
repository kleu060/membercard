'use client';

import { useState, useEffect } from 'react';

interface BusinessCardTemplateProps {
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  photo?: string;
  cardVariant: 10;
  onCall?: () => void;
  onEmail?: () => void;
  onVisitWebsite?: () => void;
}

export default function BusinessCardTemplate({
  name,
  position,
  company,
  phone,
  email,
  website,
  photo,
  cardVariant,
  onCall,
  onEmail,
  onVisitWebsite
}: BusinessCardTemplateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCall = () => {
    if (onCall) {
      onCall();
    } else {
      alert(`撥打電話: ${phone}`);
    }
  };

  const handleEmail = () => {
    if (onEmail) {
      onEmail();
    } else {
      alert(`發送郵件至: ${email}`);
    }
  };

  const handleVisitWebsite = () => {
    if (onVisitWebsite) {
      onVisitWebsite();
    } else {
      alert(`訪問網站: ${website}`);
    }
  };

  const getCardClass = () => {
    return `card card${cardVariant}`;
  };

  const getTopSectionStyle = () => {
    return {
      background: 'linear-gradient(to right, #FFCF71, #2376DD)'
    };
  };

  if (!mounted) {
    return (
      <div className={getCardClass()} style={{ 
        width: '320px', 
        borderRadius: '16px', 
        overflow: 'hidden', 
        fontFamily: "'Segoe UI', sans-serif", 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
        margin: '40px auto', 
        background: 'white' 
      }}>
        <div className="card-top" style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          height: '160px',
          position: 'relative',
          ...getTopSectionStyle()
        }}>
          <div className="photo" style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'gray', 
            border: '4px solid white'
          }} />
          <div className="logo" style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: 'white' 
          }}>
            {company}
          </div>
        </div>
        <div className="card-bottom" style={{ 
          padding: '20px', 
          textAlign: 'center' 
        }}>
          <h2 style={{ margin: '0', fontSize: '22px', fontWeight: 'bold' }}>{name}</h2>
          <p className="title" style={{ margin: '4px 0 12px', fontSize: '14px', color: '#555' }}>{position}</p>
          <div className="contact">
            <p style={{ margin: '6px 0', fontSize: '14px' }}><span>📞</span> {phone}</p>
            <p style={{ margin: '6px 0', fontSize: '14px' }}><span>✉️</span> {email}</p>
            <p style={{ margin: '6px 0', fontSize: '14px' }}><span>🌐</span> {website}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={getCardClass()} style={{ 
      width: '320px', 
      borderRadius: '16px', 
      overflow: 'hidden', 
      fontFamily: "'Segoe UI', sans-serif", 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
      margin: '40px auto', 
      background: 'white' 
    }}>
      <div className="card-top" style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        height: '160px',
        position: 'relative',
        ...getTopSectionStyle()
      }}>
        <div className="photo" style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: photo ? `url(${photo})` : 'gray', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          border: '4px solid white'
        }} />
        <div className="logo" style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: 'white' 
        }}>
          {company}
        </div>
      </div>
      <div className="card-bottom" style={{ 
        padding: '20px', 
        textAlign: 'center' 
      }}>
        <h2 style={{ margin: '0', fontSize: '22px', fontWeight: 'bold' }}>{name}</h2>
        <p className="title" style={{ margin: '4px 0 12px', fontSize: '14px', color: '#555' }}>{position}</p>
        <div className="contact">
          <p 
            style={{ margin: '6px 0', fontSize: '14px', cursor: 'pointer', color: '#007bff' }}
            onClick={handleCall}
          >
            <span>📞</span> {phone}
          </p>
          <p 
            style={{ margin: '6px 0', fontSize: '14px', cursor: 'pointer', color: '#007bff' }}
            onClick={handleEmail}
          >
            <span>✉️</span> {email}
          </p>
          <p 
            style={{ margin: '6px 0', fontSize: '14px', cursor: 'pointer', color: '#007bff' }}
            onClick={handleVisitWebsite}
          >
            <span>🌐</span> {website}
          </p>
        </div>
      </div>
    </div>
  );
}