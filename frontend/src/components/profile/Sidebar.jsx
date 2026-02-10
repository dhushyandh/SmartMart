import React from 'react'
import { FaGraduationCap, FaMapMarkerAlt, FaCog } from 'react-icons/fa'

const Sidebar = ({ setSection, section }) => {
  const baseClass = 'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition'

  return (
    <div className="flex flex-col gap-3">
      <button
        className={`${baseClass} ${section === 'student' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-700 border'}`}
        onClick={() => setSection('student')}
      >
        <FaGraduationCap />
        Student
      </button>

      <button
        className={`${baseClass} ${section === 'address' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-700 border'}`}
        onClick={() => setSection('address')}
      >
        <FaMapMarkerAlt />
        Addresses
      </button>

      <button
        className={`${baseClass} ${section === 'settings' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-700 border'}`}
        onClick={() => setSection('settings')}
      >
        <FaCog />
        Settings
      </button>
    </div>
  )
}

export default Sidebar
