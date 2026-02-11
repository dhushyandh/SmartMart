import React from 'react'
import { FaGraduationCap, FaMapMarkerAlt, FaCog } from 'react-icons/fa'

const Sidebar = ({ setSection, section }) => {
  const baseClass = 'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition'

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-sm">
      <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Navigation
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <button
          className={`${baseClass} ${section === 'student' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
          onClick={() => setSection('student')}
        >
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${section === 'student' ? 'bg-white/15 text-white' : 'bg-white text-slate-600'}`}>
            <FaGraduationCap />
          </span>
          Student Verification
        </button>

        <button
          className={`${baseClass} ${section === 'address' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
          onClick={() => setSection('address')}
        >
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${section === 'address' ? 'bg-white/15 text-white' : 'bg-white text-slate-600'}`}>
            <FaMapMarkerAlt />
          </span>
          Addresses
        </button>

        <button
          className={`${baseClass} ${section === 'settings' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
          onClick={() => setSection('settings')}
        >
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${section === 'settings' ? 'bg-white/15 text-white' : 'bg-white text-slate-600'}`}>
            <FaCog />
          </span>
          Settings
        </button>
      </div>
    </div>
  )
}

export default Sidebar
