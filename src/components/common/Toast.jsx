import { useEffect, useState } from 'react'

export default function Toast({ message, visible, onHide, duration = 2500 }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => onHide(), duration)
      return () => clearTimeout(timer)
    }
  }, [visible, duration, onHide])

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}>
      <div className="bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-modal whitespace-nowrap">
        {message}
      </div>
    </div>
  )
}