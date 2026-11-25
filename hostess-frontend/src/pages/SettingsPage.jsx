import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SettingsPage.css'

export default function SettingsPage() {
  const navigate = useNavigate()
  const role = localStorage.getItem('userRole')
  const [oldAdminPin, setOldAdminPin] = useState('')
  const [adminPin1, setAdminPin1] = useState('')
  const [adminPin2, setAdminPin2] = useState('')
  const [waiterPin1, setWaiterPin1] = useState('')
  const [waiterPin2, setWaiterPin2] = useState('')
  const [msg, setMsg] = useState({ text: '', ok: true })

  const showMsg = (text, ok = true) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg({ text: '', ok: true }), 3000)
  }

  const saveAdminPin = () => {
    const currentPin = localStorage.getItem('adminPin') || '1234'
    if (oldAdminPin !== currentPin) { showMsg('Неверный текущий PIN!', false); return }
    if (adminPin1.length !== 4 || !/^\d{4}$/.test(adminPin1)) { showMsg('PIN должен быть 4 цифры!', false); return }
    if (adminPin1 !== adminPin2) { showMsg('PIN-коды не совпадают!', false); return }
    localStorage.setItem('adminPin', adminPin1)
    setOldAdminPin(''); setAdminPin1(''); setAdminPin2('')
    showMsg('✅ PIN администратора изменён!')
  }

  const saveWaiterPin = () => {
    if (waiterPin1.length !== 4 || !/^\d{4}$/.test(waiterPin1)) { showMsg('PIN должен быть 4 цифры!', false); return }
    if (waiterPin1 !== waiterPin2) { showMsg('PIN-коды не совпадают!', false); return }
    localStorage.setItem('waiterPin', waiterPin1)
    setWaiterPin1(''); setWaiterPin2('')
    showMsg('✅ PIN официанта изменён!')
  }

  const logout = () => { localStorage.removeItem('userRole'); localStorage.removeItem('userName'); navigate('/login') }

  if (role !== 'admin') return (
    <div className="settings-page"><div className="settings-box">
      <h2>⛔ Нет доступа</h2><p>Только администратор.</p>
      <button className="btn-back-s" onClick={() => navigate('/')}>← Назад</button>
    </div></div>
  )

  return (
    <div className="settings-page">
      <div className="settings-box">
        <button className="btn-back-s" onClick={() => navigate('/')}>← Назад</button>
        <h1 className="settings-title">⚙️ Настройки</h1>
        <p className="settings-sub">Управление PIN-кодами</p>
        {msg.text && <div className={`settings-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
        <div className="settings-card">
          <h3>👔 PIN администратора</h3>
          <p>Для смены нужно ввести текущий PIN</p>
          <div className="pin-inputs">
            <input type="password" inputMode="numeric" maxLength={4} placeholder="Текущий PIN" value={oldAdminPin} onChange={e => setOldAdminPin(e.target.value.replace(/\D/g,'').slice(0,4))} />
            <input type="password" inputMode="numeric" maxLength={4} placeholder="Новый PIN (4 цифры)" value={adminPin1} onChange={e => setAdminPin1(e.target.value.replace(/\D/g,'').slice(0,4))} />
            <input type="password" inputMode="numeric" maxLength={4} placeholder="Повторите новый PIN" value={adminPin2} onChange={e => setAdminPin2(e.target.value.replace(/\D/g,'').slice(0,4))} />
          </div>
          <button className="btn-save-pin admin" onClick={saveAdminPin}>Сохранить PIN администратора</button>
        </div>
        <div className="settings-card">
          <h3>🧑‍🍳 PIN официанта</h3>
          <p>Администратор может менять PIN официанта</p>
          <div className="pin-inputs">
            <input type="password" inputMode="numeric" maxLength={4} placeholder="Новый PIN (4 цифры)" value={waiterPin1} onChange={e => setWaiterPin1(e.target.value.replace(/\D/g,'').slice(0,4))} />
            <input type="password" inputMode="numeric" maxLength={4} placeholder="Повторите PIN" value={waiterPin2} onChange={e => setWaiterPin2(e.target.value.replace(/\D/g,'').slice(0,4))} />
          </div>
          <button className="btn-save-pin waiter" onClick={saveWaiterPin}>Сохранить PIN официанта</button>
        </div>
        <button className="btn-logout" onClick={logout}>🚪 Выйти из системы</button>
      </div>
    </div>
  )
}
