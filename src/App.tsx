import './App.css'
import { useState } from 'react'
import { UserProvider, useUser } from './contexts/UserContext'
import Sidebar from './components/Sidebar'
import PlayView from './components/views/PlayView'
import CollectionView from './components/views/CollectionView'
import StoreView from './components/views/StoreView'
import WelcomeView from './components/views/WelcomeView'

function AppContent() {
  const [activeView, setActiveView] = useState<'play' | 'collection' | 'store'>('collection')
  const { state } = useUser()
  const { isAuthenticated } = state

  const renderActiveView = () => {
    // Si no está autenticado, mostrar la vista de bienvenida
    if (!isAuthenticated) {
      return <WelcomeView />
    }

    // Si está autenticado, mostrar las vistas normales
    switch (activeView) {
      case 'play':
        return <PlayView />
      case 'collection':
        return <CollectionView />
      case 'store':
        return <StoreView />
      default:
        return <CollectionView />
    }
  }

  return (
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
  )
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}

export default App
