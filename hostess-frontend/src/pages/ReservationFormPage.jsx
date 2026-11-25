import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import api from '../api'
import './ReservationFormPage.css'

export default function ReservationFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const typeFromUrl = searchParams.get('type') || 'RESERVE'
  const isEdit = !!id

  const [form, setForm] = useState({
    type: typeFromUrl, date: new Date().toISOString().split('T')[0],
    timeStart: '19:00', durationHours: 2, guestsCount: 2,
    comment: '', menuNote: '', deposit: ''
  })
  const [guestSearch, setGuestSearch] = useState('')
  const [guests, setGuests] = useState([])
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [showGuestForm, setShowGuestForm] = useState(false)
  const [newGuest, setNewGuest] = useState({ name: '', surname: '', phone: '' })
  const [tables, setTables] = useState([])
  const [selectedTable, setSelectedTable] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadAllTables(); if (isEdit) loadReservation() }, [])

  const loadAllTables = async () => {
    try { const res = await api.get('/tables'); setTables(res.data) }
    catch (err) { console.error(err) }
  }

  const loadReservation = async () => {
    try {
      const res = await api.get(`/reservations/${id}`)
      const r = res.data
      setForm({ type: r.type, date: r.date, timeStart: r.timeStart,
        durationHours: r.durationHours, guestsCount: r.guestsCount,
        comment: r.comment || '', menuNote: '', deposit: '' })
      setSelectedGuest(r.guest); setSelectedTable(r.table)
    } catch { setError('Ошибка загрузки брони') }
  }

  const searchGuests = async (value) => {
    setGuestSearch(value); setSelectedGuest(null)
    if (value.length < 1) { setGuests([]); return }
    try { const res = await api.get(`/guests/search?name=${value}`); setGuests(res.data) }
    catch { console.error('Ошибка поиска') }
  }

  const selectGuest = (g) => {
    setSelectedGuest(g)
    setGuestSearch(g.name + ' ' + (g.surname || ''))
    setGuests([])
  }

  const createNewGuest = async () => {
    if (!newGuest.name) { setError('Введите имя гостя'); return }
    try {
      const res = await api.post('/guests', newGuest)
      setSelectedGuest(res.data)
      setShowGuestForm(false); setGuests([])
      setGuestSearch(res.data.name + ' ' + (res.data.surname || ''))
      setNewGuest({ name: '', surname: '', phone: '' })
    } catch { setError('Ошибка создания гостя') }
  }

  const handleSave = async () => {
    setError('')
    if (!selectedGuest) { setError('Выберите гостя'); return }
    if (!selectedTable) { setError('Выберите стол'); return }
    setLoading(true)
    try {
      const reservationData = {
        type: form.type, date: form.date, timeStart: form.timeStart,
        durationHours: Number(form.durationHours), guestsCount: Number(form.guestsCount),
        comment: form.comment
      }
      let savedReservation
      if (isEdit) {
        const res = await api.put(`/reservations/${id}`, reservationData)
        savedReservation = res.data
      } else {
        const res = await api.post(`/reservations?guestId=${selectedGuest.id}&tableId=${selectedTable.id}`, reservationData)
        savedReservation = res.data
      }
      if (form.type === 'BANQUET' && !isEdit) {
        await api.post(`/banquets?reservationId=${savedReservation.id}`, {
          menuNote: form.menuNote, deposit: form.deposit ? Number(form.deposit) : null
        })
      }
      navigate('/')
    } catch (err) { setError(err.response?.data?.message || 'Ошибка сохранения') }
    finally { setLoading(false) }
  }

  return (
    <div className="form-page">
      <div className="form-header">
        <div className="form-title">{isEdit ? `Редактировать № ${id}` : `Новый ${form.type === 'BANQUET' ? 'банкет' : 'резерв'}`}</div>
        <div className="form-status">Статус: <strong>Новый</strong></div>
      </div>
      {error && <div className="error-bar">{error}</div>}
      <div className="form-body">
        <div className="form-col">
          <div className="col-title">КЛИЕНТ</div>
          <div className="field-group">
            <label>Поиск гостя</label>
            <input type="text" value={guestSearch} onChange={e => searchGuests(e.target.value)} placeholder="Введите имя..." />
            {guests.length > 0 && !selectedGuest && (
              <div className="dropdown">
                {guests.map(g => (
                  <div key={g.id} className="dropdown-item" onClick={() => selectGuest(g)}>{g.name} {g.surname} — {g.phone}</div>
                ))}
                <div className="dropdown-item new-guest" onClick={() => { setShowGuestForm(true); setGuests([]) }}>+ Новый гость</div>
              </div>
            )}
            {guests.length === 0 && guestSearch.length > 0 && !selectedGuest && (
              <div className="dropdown">
                <div className="dropdown-item new-guest" onClick={() => setShowGuestForm(true)}>+ Новый гость</div>
              </div>
            )}
          </div>
          {selectedGuest && (
            <div className="selected-guest">
              <div className="guest-name">{selectedGuest.name} {selectedGuest.surname}</div>
              <div className="guest-phone">т. {selectedGuest.phone}</div>
              <button className="btn-clear" onClick={() => { setSelectedGuest(null); setGuestSearch(''); setGuests([]) }}>✕</button>
            </div>
          )}
          {showGuestForm && (
            <div className="new-guest-form">
              <div className="col-title">НОВЫЙ ГОСТЬ</div>
              <input placeholder="Имя *" value={newGuest.name} onChange={e => setNewGuest({ ...newGuest, name: e.target.value })} />
              <input placeholder="Фамилия" value={newGuest.surname} onChange={e => setNewGuest({ ...newGuest, surname: e.target.value })} />
              <input placeholder="Телефон" value={newGuest.phone} onChange={e => setNewGuest({ ...newGuest, phone: e.target.value })} />
              <div className="guest-btns">
                <button className="btn-save" onClick={createNewGuest}>Сохранить</button>
                <button className="btn-secondary" onClick={() => { setShowGuestForm(false); setNewGuest({ name: '', surname: '', phone: '' }) }}>Отмена</button>
              </div>
            </div>
          )}
          <div className="field-group">
            <label>Комментарий</label>
            <textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} rows={3} placeholder="Дополнительная информация..." />
          </div>
        </div>
        <div className="form-col">
          <div className="col-title">{form.type === 'BANQUET' ? 'БАНКЕТ' : 'РЕЗЕРВ'}</div>
          <div className="details-grid">
            <div className="field-group"><label>Дата</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div className="field-group"><label>Время</label><input type="time" value={form.timeStart} onChange={e => setForm({ ...form, timeStart: e.target.value })} /></div>
            <div className="field-group"><label>Длительность (ч)</label><input type="number" min="1" max="12" value={form.durationHours} onChange={e => setForm({ ...form, durationHours: e.target.value })} /></div>
            <div className="field-group"><label>Гостей</label><input type="number" min="1" value={form.guestsCount} onChange={e => setForm({ ...form, guestsCount: e.target.value })} /></div>
          </div>
          <div className="field-group">
            <label>Выберите стол</label>
            <div className="tables-grid">
              {tables.length === 0 && <div className="no-tables">Загрузка столов...</div>}
              {tables.map(t => (
                <div key={t.id} className={`table-card ${selectedTable?.id === t.id ? 'selected' : ''}`} onClick={() => setSelectedTable(t)}>
                  <div className="table-number">Зал: {t.number}</div>
                  <div className="table-cap">до {t.capacity} чел.</div>
                </div>
              ))}
            </div>
          </div>
          {form.type === 'BANQUET' && (
            <>
              <div className="field-group"><label>Меню / Пожелания</label><textarea value={form.menuNote} onChange={e => setForm({ ...form, menuNote: e.target.value })} rows={3} placeholder="Опишите меню банкета..." /></div>
              <div className="field-group"><label>Депозит (руб.)</label><input type="number" value={form.deposit} onChange={e => setForm({ ...form, deposit: e.target.value })} placeholder="0" /></div>
            </>
          )}
        </div>
      </div>
      <div className="form-footer">
        <button className="btn-back" onClick={() => navigate('/')}>‹ Назад</button>
        <div className="footer-right">
          <button className="btn-save" onClick={handleSave} disabled={loading}>{loading ? 'Сохранение...' : 'Сохранить'}</button>
          <button className="btn-secondary" onClick={() => navigate('/')}>Отмена</button>
        </div>
      </div>
    </div>
  )
}
