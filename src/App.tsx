import './App.css'
import { useState } from 'react'
import { UserProvider } from './contexts/UserContext'
import Sidebar from './components/Sidebar'
import PlayView from './components/views/PlayView'
import DeckView from './components/views/DeckView'
import StoreView from './components/views/StoreView'

function App() {
  const [activeView, setActiveView] = useState<'play' | 'deck' | 'store'>('play')

  const renderActiveView = () => {
    switch (activeView) {
      case 'play':
        return <PlayView />
      case 'deck':
        return <DeckView />
      case 'store':
        return <StoreView />
      default:
        return <PlayView />
    }
  }

  return (
    <UserProvider>
      <div className="flex h-screen bg-gray-900">
        {/* Sidebar */}
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderActiveView()}
        </main>
      </div>
    </UserProvider>
  )
}

export default App
