import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaInfoCircle, FaGift, FaExclamationTriangle, FaBell, FaArrowLeft } from 'react-icons/fa';

export default function Notifications() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: "Booking Confirmed",
      message: "Your booking for Washer C-01 at Sparkle Wash has been confirmed.",
      time: "2 mins ago",
      type: "success",
      read: false
    },
    {
      id: 2,
      title: "Laundry Ready",
      message: "Your order #LDN-8392 is ready for pickup at Fresh & Clean.",
      time: "1 hour ago",
      type: "info",
      read: true
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment of PKR 1250 received via Cash.",
      time: "1 hour ago",
      type: "success",
      read: true
    },
    {
      id: 4,
      title: "Special Offer",
      message: "Get 20% off on your next dry cleaning service!",
      time: "1 day ago",
      type: "promo",
      read: true
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="notif-icon-svg success" />;
      case 'info': return <FaInfoCircle className="notif-icon-svg info" />;
      case 'promo': return <FaGift className="notif-icon-svg promo" />;
      case 'warning': return <FaExclamationTriangle className="notif-icon-svg warning" />;
      default: return <FaBell className="notif-icon-svg default" />;
    }
  };

  return (
    <div className="screen">
      <div className="notifications-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span className="back-icon"><FaArrowLeft /></span> Back
        </button>
        <h2>Notifications</h2>
        <button className="mark-read-btn">Mark all as read</button>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-card ${!notification.read ? 'unread' : ''}`}
          >
            <div className={`notification-icon-wrapper ${notification.type}`}>
              {getIcon(notification.type)}
            </div>
            <div className="notification-content">
              <div className="notification-top">
                <h4 className="notification-title">{notification.title}</h4>
                <span className="notification-time">{notification.time}</span>
              </div>
              <p className="notification-message">{notification.message}</p>
            </div>
            {!notification.read && <div className="unread-dot"></div>}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon"><FaBell /></span>
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
