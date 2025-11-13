import React from 'react';
import './RippleButton.css';

export const RippleButton = ({ children, className = '', ...props }) => {
  const handleClick = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }
    button.appendChild(circle);
  };

  return (
    <button
      className={`ripple-btn ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default RippleButton;
