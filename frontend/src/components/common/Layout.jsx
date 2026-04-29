import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 animate-fade-in">
        {children}
      </div>
    </main>
  </div>
)

export default Layout
