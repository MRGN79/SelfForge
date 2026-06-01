import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Dashboard from '../views/Dashboard.jsx'
import HabitManager from '../views/HabitManager.jsx'
import Stats from '../views/Stats.jsx'

beforeEach(() => {
  localStorage.setItem('selfforge_lang', 'es')
})

const habit = {
  id: 'h1',
  name: 'Correr',
  description: '',
  type: 'daily',
  category: 'Salud',
  color: '#6366f1',
  active: true,
  startDate: '2024-01-01',
  endDate: null,
  targetDays: [],
  frequency: 1,
  createdAt: '2024-01-01T00:00:00.000Z',
}

// ── Dashboard ──────────────────────────────────────────────────────────────
describe('Dashboard', () => {
  it('shows empty state when no habits', () => {
    render(<Dashboard habits={[]} logs={[]} onToggle={vi.fn()} onNote={vi.fn()} />)
    expect(screen.getByText(/El yunque está frío/)).toBeInTheDocument()
  })

  it('renders habit cards for today', () => {
    render(<Dashboard habits={[habit]} logs={[]} onToggle={vi.fn()} onNote={vi.fn()} />)
    expect(screen.getByText('Correr')).toBeInTheDocument()
  })

  it('shows all-done message when all completed', () => {
    const today = new Date().toISOString().slice(0, 10)
    const logs = [{ id: 'l1', habitId: 'h1', date: today, completed: true, note: '' }]
    render(<Dashboard habits={[habit]} logs={logs} onToggle={vi.fn()} onNote={vi.fn()} />)
    expect(screen.getByText(/Todo templado/)).toBeInTheDocument()
  })

  it('shows progress text when some completed', () => {
    const habit2 = { ...habit, id: 'h2', name: 'Leer' }
    const today = new Date().toISOString().slice(0, 10)
    const logs = [{ id: 'l1', habitId: 'h1', date: today, completed: true, note: '' }]
    render(<Dashboard habits={[habit, habit2]} logs={logs} onToggle={vi.fn()} onNote={vi.fn()} />)
    expect(screen.getByText(/1 de 2/)).toBeInTheDocument()
  })

  it('calls onToggle when habit card toggle is clicked', () => {
    const onToggle = vi.fn()
    render(<Dashboard habits={[habit]} logs={[]} onToggle={onToggle} onNote={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Golpear' }))
    expect(onToggle).toHaveBeenCalledWith('h1')
  })
})

// ── HabitManager ───────────────────────────────────────────────────────────
describe('HabitManager', () => {
  const handlers = {
    onAdd: vi.fn(),
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
    onDeleteLogs: vi.fn(),
  }

  beforeEach(() => { Object.values(handlers).forEach(fn => fn.mockClear()) })

  it('shows empty state when no habits', () => {
    render(<HabitManager habits={[]} logs={[]} {...handlers} />)
    expect(screen.getByText(/El taller está vacío/)).toBeInTheDocument()
  })

  it('renders habit list', () => {
    render(<HabitManager habits={[habit]} logs={[]} {...handlers} />)
    expect(screen.getByText('Correr')).toBeInTheDocument()
  })

  it('opens new habit modal', () => {
    render(<HabitManager habits={[]} logs={[]} {...handlers} />)
    fireEvent.click(screen.getByText(/Nueva forja/))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('calls onAdd when habit form is saved', () => {
    render(<HabitManager habits={[]} logs={[]} {...handlers} />)
    fireEvent.click(screen.getByText(/Nueva forja/))
    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Meditar' } })
    fireEvent.click(screen.getByText('Forjar'))
    expect(handlers.onAdd).toHaveBeenCalledWith(expect.objectContaining({ name: 'Meditar' }))
  })

  it('closes modal on cancel', () => {
    render(<HabitManager habits={[]} logs={[]} {...handlers} />)
    fireEvent.click(screen.getByText(/Nueva forja/))
    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens edit modal for existing habit', () => {
    render(<HabitManager habits={[habit]} logs={[]} {...handlers} />)
    fireEvent.click(screen.getByLabelText(/Templar Correr/))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Correr')).toBeInTheDocument()
  })

  it('calls onUpdate when edit form saved', () => {
    render(<HabitManager habits={[habit]} logs={[]} {...handlers} />)
    fireEvent.click(screen.getByLabelText(/Templar Correr/))
    fireEvent.change(screen.getByDisplayValue('Correr'), { target: { value: 'Trotar' } })
    fireEvent.click(screen.getByText('Forjar'))
    expect(handlers.onUpdate).toHaveBeenCalledWith('h1', expect.objectContaining({ name: 'Trotar' }))
  })

  it('opens delete confirmation', () => {
    render(<HabitManager habits={[habit]} logs={[]} {...handlers} />)
    fireEvent.click(screen.getByLabelText(/Fundir Correr/))
    expect(screen.getByText(/Fundir "Correr"/)).toBeInTheDocument()
  })

  it('calls onDelete and onDeleteLogs on confirm', () => {
    render(<HabitManager habits={[habit]} logs={[]} {...handlers} />)
    fireEvent.click(screen.getByLabelText(/Fundir Correr/))
    fireEvent.click(screen.getByText('Fundir'))
    expect(handlers.onDelete).toHaveBeenCalledWith('h1')
    expect(handlers.onDeleteLogs).toHaveBeenCalledWith('h1')
  })

  it('cancels delete', () => {
    render(<HabitManager habits={[habit]} logs={[]} {...handlers} />)
    fireEvent.click(screen.getByLabelText(/Fundir Correr/))
    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByText(/Fundir "Correr"/)).not.toBeInTheDocument()
  })
})

// ── Stats ──────────────────────────────────────────────────────────────────
describe('Stats', () => {
  it('shows empty state when no active habits', () => {
    render(<Stats habits={[]} logs={[]} />)
    expect(screen.getByText(/Registro vacío/)).toBeInTheDocument()
  })

  it('renders stats for active habits', () => {
    render(<Stats habits={[habit]} logs={[]} />)
    expect(screen.getByText('Correr')).toBeInTheDocument()
    expect(screen.getByText('Calor actual')).toBeInTheDocument()
    expect(screen.getByText('Temple (30d)')).toBeInTheDocument()
  })

  it('does not show inactive habits', () => {
    render(<Stats habits={[{ ...habit, active: false }]} logs={[]} />)
    expect(screen.getByText(/Registro vacío/)).toBeInTheDocument()
  })

  it('shows overall consistency section', () => {
    render(<Stats habits={[habit]} logs={[]} />)
    expect(screen.getByText('Temple global')).toBeInTheDocument()
  })
})
