import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <StyledWrapper className={`theme-switch-wrapper ${className}`}>
      <label className="switch" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <input
          type="checkbox"
          checked={isDark}
          onChange={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          role="switch"
          aria-checked={isDark}
        />
        <span className="slider" />
      </label>
    </StyledWrapper>
  );
};

export const Switch = ThemeToggle;
export default ThemeToggle;

const StyledWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 13px;

  /* The switch - the box around the slider */
  .switch {
    display: block;
    --width-of-switch: 3.5em;
    --height-of-switch: 2em;
    /* size of sliding icon -- sun and moon */
    --size-of-icon: 1.4em;
    /* it is like a inline-padding of switch */
    --slider-offset: 0.3em;
    --travel-distance: calc(var(--width-of-switch) - var(--size-of-icon) - (var(--slider-offset) * 2));
    position: relative;
    width: var(--width-of-switch);
    height: var(--height-of-switch);
    margin: 0;
    cursor: pointer;
    user-select: none;
    transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .switch:hover {
    transform: scale(1.04);
  }

  .switch:active {
    transform: scale(0.96);
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
    pointer-events: none;
  }

  /* The slider track with buttery color transition */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f4f4f5;
    border-radius: 30px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
    transition: background-color 0.45s cubic-bezier(0.25, 1, 0.5, 1),
                border-color 0.45s cubic-bezier(0.25, 1, 0.5, 1),
                box-shadow 0.45s cubic-bezier(0.25, 1, 0.5, 1);
  }

  /* ☀️ Sun Knob (Layer 1) - GPU translated, buttery spring curve */
  .slider:before {
    position: absolute;
    content: "";
    height: var(--size-of-icon);
    width: var(--size-of-icon);
    border-radius: 50%;
    left: var(--slider-offset);
    top: 50%;
    transform: translateY(-50%) translateX(0) rotate(0deg) scale(1);
    background: linear-gradient(40deg, #ff0080, #ff8c00 70%);
    box-shadow: 0 0 10px rgba(255, 140, 0, 0.45), 0 0 4px rgba(255, 0, 128, 0.2);
    opacity: 1;
    z-index: 1;
    will-change: transform, opacity;
    transition: transform 0.5s cubic-bezier(0.34, 1.25, 0.64, 1),
                opacity 0.35s cubic-bezier(0.25, 1, 0.5, 1),
                width 0.2s ease,
                box-shadow 0.4s ease;
  }

  /* 🌙 Moon Knob (Layer 2) - Seamless cross-fade with glowing crescent inset */
  .slider:after {
    position: absolute;
    content: "";
    height: var(--size-of-icon);
    width: var(--size-of-icon);
    border-radius: 50%;
    left: var(--slider-offset);
    top: 50%;
    transform: translateY(-50%) translateX(0) rotate(-60deg) scale(0.65);
    background: #303136;
    box-shadow: inset -3px -2px 5px -2px #8983f7,
                inset -10px -4px 0 0 #a3dafb,
                0 0 10px rgba(163, 218, 251, 0.35);
    opacity: 0;
    z-index: 2;
    pointer-events: none;
    will-change: transform, opacity;
    transition: transform 0.5s cubic-bezier(0.34, 1.25, 0.64, 1),
                opacity 0.35s cubic-bezier(0.25, 1, 0.5, 1),
                width 0.2s ease,
                box-shadow 0.4s ease;
  }

  /* Checked Slider Track */
  input:checked + .slider {
    background-color: #303136;
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.15);
  }

  /* Checked Sun Knob: glides to right, smoothly rotates & fades out */
  input:checked + .slider:before {
    transform: translateY(-50%) translateX(var(--travel-distance)) rotate(360deg) scale(0.65);
    opacity: 0;
    box-shadow: none;
  }

  /* Checked Moon Knob: glides into position, rotates upright & illuminates */
  input:checked + .slider:after {
    transform: translateY(-50%) translateX(var(--travel-distance)) rotate(0deg) scale(1);
    opacity: 1;
  }

  /* Tactile stretch on click */
  .switch:active .slider:before,
  .switch:active .slider:after {
    width: calc(var(--size-of-icon) * 1.15);
  }

  /* Focus outline for accessibility */
  .switch input:focus-visible + .slider {
    outline: 2px solid #1F7A8C;
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .switch,
    .slider,
    .slider:before,
    .slider:after {
      transition-duration: 0.05s !important;
    }
  }
`;
