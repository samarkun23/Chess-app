import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Game } from './pages/Game'
import { SignUp } from './pages/Signup'
import { SignIn } from './pages/Singin'

function App() {

  return (
    <div className='h-screen bg-black/80'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/game' element={<Game />} />
          <Route path='/signup' element = {<SignUp />} />
          <Route path='/signin' element = {<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
