import React from 'react'
import { SITE_EMOJI, SITE_INFO } from '@/utils/site'

export function Footer() {
  const styles = `
    @keyframes slide {
      0% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(800%);
      }
    }

    .footer {
      overflow: hidden; /* Ensure the text outside the footer is hidden */
      white-space: nowrap; /* Prevent the text from wrapping */
    }

    .slide-from-left {
      animation: slide 180s linear infinite;
      display: inline-block; /* Ensure the text stays on one line */
    }
  `;

  return (
    <>
      <style>{styles}</style> {/* Include styles using a <style> tag */}
      <footer className='sticky top-[0vh]  footer w-full bg-accent text-primary z-20 p-1'>
        <p className="slide-from-left z-20">
          {SITE_EMOJI} This is a testnet version {SITE_EMOJI}
        </p>
      </footer>
    </>
  )
}
