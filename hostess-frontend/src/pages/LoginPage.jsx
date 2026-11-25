import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setPin('')
    setError('')
  }

  const handlePinClick = (digit) => {
    if (pin.length >= 4) return
    const newPin = pin + digit
    setPin(newPin)
    if (newPin.length === 4) setTimeout(() => checkPin(newPin), 150)
  }

  const handleDelete = () => { setPin(pin.slice(0, -1)); setError('') }

  const checkPin = (enteredPin) => {
    const adminPin = localStorage.getItem('adminPin') || '1234'
    const waiterPin = localStorage.getItem('waiterPin') || '5678'
    if (selectedRole === 'admin' && enteredPin === adminPin) {
      localStorage.setItem('userRole', 'admin')
      localStorage.setItem('userName', 'Администратор')
      navigate('/')
    } else if (selectedRole === 'waiter' && enteredPin === waiterPin) {
      localStorage.setItem('userRole', 'waiter')
      localStorage.setItem('userName', 'Официант')
      navigate('/')
    } else {
      setError('Неверный PIN-код')
      setPin('')
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">🍽️</div>
        <h1 className="login-title">Hostess</h1>
        <p className="login-subtitle">Система управления бронированием</p>
        {!selectedRole ? (
          <div className="role-select">
            <p className="role-hint">Выберите роль для входа:</p>
            <button className="role-btn admin" onClick={() => handleRoleSelect('admin')}>
              <span className="role-icon">👔</span>
              <div><span className="role-name">Администратор</span><span className="role-desc">Полный доступ к системе</span></div>
            </button>
            <button className="role-btn waiter" onClick={() => handleRoleSelect('waiter')}>
              <span className="role-icon">🧑‍🍳</span>
              <div><span className="role-name">Официант</span><span className="role-desc">Просмотр бронирований</span></div>
            </button>
          </div>
        ) : (
          <div className="pin-section">
            <button className="back-btn" onClick={() => setSelectedRole(null)}>← Назад</button>
            <p className="pin-role-label">{selectedRole === 'admin' ? '👔 Администратор' : '🧑‍🍳 Официант'}</p>
            <p className="pin-hint">Введите PIN-код</p>
            <div className="pin-dots">
              {[0,1,2,3].map(i => <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />)}
            </div>
            {error && <div className="pin-error">{error}</div>}
            <div className="pin-keyboard">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} className="pin-key" onClick={() => handlePinClick(String(n))}>{n}</button>
              ))}
              <button className="pin-key empty" disabled></button>
              <button className="pin-key" onClick={() => handlePinClick('0')}>0</button>
              <button className="pin-key delete" onClick={handleDelete}>⌫</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
