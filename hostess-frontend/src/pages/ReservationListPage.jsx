import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import './ReservationListPage.css'

export default function ReservationListPage() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [filter, setFilter] = useState('ALL')
  const [onlyActive, setOnlyActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const isAdmin = localStorage.getItem('userRole') === 'admin'

  useEffect(() => { loadReservations() }, [date, filter])
  useEffect(() => {
    const interval = setInterval(() => loadReservations(), 60000)
    return () => clearInterval(interval)
  }, [date, filter])

  const loadReservations = async () => {
    setLoading(true)
    try {
      let url = `/reservations?date=${date}`
      if (filter !== 'ALL') url += `&type=${filter}`
      const res = await api.get(url)
      setReservations(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const getAutoStatus = (r) => {
    if (r.status === 'CANCELLED') return 'CANCELLED'
    if (r.status === 'COMPLETED') return 'COMPLETED'
    const now = new Date()
    const [h, m] = r.timeStart.split(':')
    const bookingTime = new Date()
    bookingTime.setHours(Number(h), Number(m), 0)
    const diffMinutes = (bookingTime - now) / 60000
    if (diffMinutes < -10) return 'LATE'
    if (diffMinutes <= 30) return 'PREPARING'
    return r.status
  }

  const filteredReservations = onlyActive
    ? reservations.filter(r => r.status !== 'CANCELLED' && r.status !== 'COMPLETED')
    : reservations

  const changeDate = (days) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    setDate(d.toISOString().split('T')[0])
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const today = new Date().toISOString().split('T')[0]
    const label = dateStr === today ? ' (Сегодня)' : ''
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) + label
  }

  const getStatusLabel = (status) => ({
    NEW: 'Новый', ACTIVE: 'Действует', LATE: '⚠️ Опаздывают!',
    PREPARING: '🔔 Пора готовить стол!', COMPLETED: 'Завершён', CANCELLED: 'Отменён'
  }[status] || status)

  const getStatusClass = (status) => ({
    NEW: 'status-new', ACTIVE: 'status-active', LATE: 'status-late',
    PREPARING: 'status-preparing', COMPLETED: 'status-completed', CANCELLED: 'status-cancelled'
  }[status] || '')

  const cancelReservation = async (id) => {
    if (!window.confirm('Отменить бронь?')) return
    try { await api.patch(`/reservations/${id}/cancel`); loadReservations() }
    catch { alert('Ошибка при отмене брони') }
  }

  const restoreReservation = async (id) => {
    if (!window.confirm('Восстановить бронь?')) return
    try { await api.patch(`/reservations/${id}/status?status=NEW`); loadReservations() }
    catch { alert('Ошибка при восстановлении брони') }
  }

  const logout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  return (
    <div className="page">
      <div className="header-top">
        <span className="user-label">{isAdmin ? '👔' : '🧑‍🍳'} {localStorage.getItem('userName')}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isAdmin && <button className="btn-settings" onClick={() => navigate('/settings')}>⚙️ Настройки</button>}
          <button className="btn-settings logout" onClick={logout}>🚪 Выйти</button>
        </div>
      </div>
      <div className="header">
        <div className="filter-tabs">
          <button className={filter === 'ALL' && !onlyActive ? 'tab active' : 'tab'} onClick={() => { setFilter('ALL'); setOnlyActive(false) }}>Все</button>
          <button className={filter === 'BANQUET' ? 'tab active' : 'tab'} onClick={() => { setFilter('BANQUET'); setOnlyActive(false) }}>Банкет</button>
          <button className={filter === 'RESERVE' ? 'tab active' : 'tab'} onClick={() => { setFilter('RESERVE'); setOnlyActive(false) }}>Резерв</button>
          <button className={onlyActive ? 'tab active-only' : 'tab'} onClick={() => { setFilter('ALL'); setOnlyActive(!onlyActive) }}>Только активные</button>
        </div>
      </div>
      <div className="date-bar">
        <button className="date-arrow" onClick={() => changeDate(-1)}>‹</button>
        <div className="date-label">{formatDate(date)}</div>
        <button className="date-arrow" onClick={() => changeDate(1)}>›</button>
      </div>
      <div className="table-wrapper">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Тип</th><th>Статус</th><th>Время</th><th>Зал, стол</th>
              <th>Гостей</th><th>Имя гостя</th><th>Комментарий</th>
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="8" className="loading">Загрузка...</td></tr>}
            {!loading && filteredReservations.length === 0 && <tr><td colSpan="8" className="empty">Броней на эту дату нет</td></tr>}
            {filteredReservations.map(r => {
              const autoStatus = getAutoStatus(r)
              return (
                <tr key={r.id} className={getStatusClass(autoStatus)} onClick={() => isAdmin && navigate(`/edit/${r.id}`)}>
                  <td>{r.type === 'BANQUET' ? 'Банкет' : 'Резерв'}</td>
                  <td>{getStatusLabel(autoStatus)}</td>
                  <td><strong>{r.timeStart}</strong><br /><span className="sub">Длит.: {r.durationHours}ч</span></td>
                  <td>Зал: {r.table?.number}</td>
                  <td>{r.guestsCount}</td>
                  <td>{r.guest?.name} {r.guest?.surname}<br /><span className="sub">т. {r.guest?.phone}</span></td>
                  <td>{r.comment}</td>
                  {isAdmin && (
                    <td>
                      {r.status !== 'CANCELLED' ? (
                        <button className="btn-cancel" onClick={e => { e.stopPropagation(); cancelReservation(r.id) }}>Снять</button>
                      ) : (
                        <button className="btn-restore" onClick={e => { e.stopPropagation(); restoreReservation(r.id) }}>Восстановить</button>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {isAdmin && (
        <div className="bottom-bar">
          <button className="btn-new reserve" onClick={() => navigate('/new?type=RESERVE')}>+ Новый резерв</button>
          <button className="btn-new banquet" onClick={() => navigate('/new?type=BANQUET')}>+ Новый банкет</button>
        </div>
      )}
    </div>
  )
}
