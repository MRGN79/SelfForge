import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import NavBar from '../components/NavBar.jsx'
import Modal from '../components/Modal.jsx'
import StreakBadge from '../components/StreakBadge.jsx'
import ConsistencyBar from '../components/ConsistencyBar.jsx'
import HabitCard from '../components/HabitCard.jsx'
import HabitForm from '../components/HabitForm.jsx'

beforeEach(() => {
  localStorage.setItem('selfforge_lang', 'es')
})

const baseHabit = {
  id: 'h1',
  name: 'Correr',
  description: 'Salir a correr',
  type: 'daily',
  category: 'Salud',
  color: '#6366f1',
  active: true,
  startDate: '2024-01-01',
  endDate: null,
  targetDays: [],
  frequency: 1,
}

// ── NavBar ─────────────────────────────────────────────────────────────────
describe('NavBar', () => {
  it('renders nav items', () => {
    render(<NavBar currentView="dashboard" onNavigate={vi.fn()} lang="es" onLangChange={vi.fn()} />)
    expect(screen.getByText('Fragua')).toBeInTheDocument()
    expect(screen.getByText('Forjas')).toBeInTheDocument()
    expect(screen.getByText('Registro')).toBeInTheDocument()
  })

  it('marks current page with aria-current', () => {
    render(<NavBar currentView="habits" onNavigate={vi.fn()} lang="es" onLangChange={vi.fn()} />)
    const btn = screen.getByText('Forjas').closest('button')
    expect(btn).toHaveAttribute('aria-current', 'page')
  })

  it('calls onNavigate when a nav button is clicked', () => {
    const onNavigate = vi.fn()
    render(<NavBar currentView="dashboard" onNavigate={onNavigate} lang="es" onLangChange={vi.fn()} />)
    fireEvent.click(screen.getByText('Forjas'))
    expect(onNavigate).toHaveBeenCalledWith('habits')
  })

  it('calls onLangChange when lang button is clicked', () => {
    const onLangChange = vi.fn()
    render(<NavBar currentView="dashboard" onNavigate={vi.fn()} lang="es" onLangChange={onLangChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(onLangChange).toHaveBeenCalledWith('en')
  })
})

// ── Modal ─────────────────────────────────────────────────────────────────
describe('Modal', () => {
  it('renders title and children', () => {
    render(<Modal title="Test modal" onClose={vi.fn()}><p>Content here</p></Modal>)
    expect(screen.getByText('Test modal')).toBeInTheDocument()
    expect(screen.getByText('Content here')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<Modal title="Modal" onClose={onClose}><span /></Modal>)
    fireEvent.click(screen.getByLabelText('Cerrar'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn()
    render(<Modal title="Modal" onClose={onClose}><span /></Modal>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('has role=dialog and aria-modal', () => {
    render(<Modal title="A" onClose={vi.fn()}><span /></Modal>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })
})

// ── StreakBadge ────────────────────────────────────────────────────────────
describe('StreakBadge', () => {
  it('renders streak and max streak', () => {
    render(<StreakBadge streak={5} maxStreak={10} type="daily" />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText(/Récord: 10/)).toBeInTheDocument()
  })

  it('renders weekly variant', () => {
    render(<StreakBadge streak={3} maxStreak={7} type="weekly" />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})

// ── ConsistencyBar ─────────────────────────────────────────────────────────
describe('ConsistencyBar', () => {
  it('renders correct percentage', () => {
    render(<ConsistencyBar value={75} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('clamps value to 0-100', () => {
    render(<ConsistencyBar value={150} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('has progressbar role', () => {
    render(<ConsistencyBar value={50} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '50')
  })
})

// ── HabitCard ──────────────────────────────────────────────────────────────
describe('HabitCard', () => {
  const defaultProps = {
    habit: baseHabit,
    log: null,
    streak: 3,
    maxStreak: 7,
    consistency: 80,
  }

  it('renders habit name and category', () => {
    render(<HabitCard {...defaultProps} />)
    expect(screen.getByText('Correr')).toBeInTheDocument()
    expect(screen.getByText('Salud')).toBeInTheDocument()
  })

  it('shows toggle button when onToggle provided', () => {
    render(<HabitCard {...defaultProps} onToggle={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Golpear' })).toBeInTheDocument()
  })

  it('calls onToggle with habitId', () => {
    const onToggle = vi.fn()
    render(<HabitCard {...defaultProps} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button', { name: 'Golpear' }))
    expect(onToggle).toHaveBeenCalledWith('h1')
  })

  it('shows completed state when log.completed is true', () => {
    render(<HabitCard {...defaultProps} log={{ completed: true }} onToggle={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Deshacer golpe' })).toBeInTheDocument()
  })

  it('shows note input when note button is clicked', () => {
    render(<HabitCard {...defaultProps} onNote={vi.fn()} />)
    fireEvent.click(screen.getByText(/Marcar/))
    expect(screen.getByPlaceholderText('Marca del día...')).toBeInTheDocument()
  })

  it('calls onNote when note form submitted', () => {
    const onNote = vi.fn()
    render(<HabitCard {...defaultProps} onNote={onNote} />)
    fireEvent.click(screen.getByText(/Marcar/))
    fireEvent.change(screen.getByPlaceholderText('Marca del día...'), { target: { value: 'great' } })
    fireEvent.click(screen.getByText('Grabar marca'))
    expect(onNote).toHaveBeenCalledWith('h1', 'great')
  })

  it('cancels note editing', () => {
    render(<HabitCard {...defaultProps} onNote={vi.fn()} />)
    fireEvent.click(screen.getByText(/Marcar/))
    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByPlaceholderText('Marca del día...')).not.toBeInTheDocument()
  })

  it('shows existing note text', () => {
    render(<HabitCard {...defaultProps} log={{ completed: false, note: 'my note' }} onNote={vi.fn()} />)
    expect(screen.getByText(/my note/)).toBeInTheDocument()
  })

  it('renders edit and delete buttons when handlers provided', () => {
    render(<HabitCard {...defaultProps} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByLabelText(/Templar Correr/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Fundir Correr/)).toBeInTheDocument()
  })
})

// ── HabitForm ─────────────────────────────────────────────────────────────
describe('HabitForm', () => {
  it('renders form fields', () => {
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByLabelText(/Nombre/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Descripción/)).toBeInTheDocument()
  })

  it('shows error when name is empty on submit', () => {
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByText('Forjar'))
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onSave with form data', () => {
    const onSave = vi.fn()
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Meditar' } })
    fireEvent.click(screen.getByText('Forjar'))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'Meditar' }))
  })

  it('calls onCancel', () => {
    const onCancel = vi.fn()
    render(<HabitForm onSave={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onCancel).toHaveBeenCalled()
  })

  it('pre-fills form when editing existing habit', () => {
    render(<HabitForm habit={baseHabit} onSave={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByDisplayValue('Correr')).toBeInTheDocument()
  })

  it('shows frequency input for weekly type', () => {
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByDisplayValue('weekly') || screen.getByLabelText(/Semanal/))
    expect(screen.getByLabelText(/Frecuencia/)).toBeInTheDocument()
  })

  it('shows target days for daily type', () => {
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Lun')).toBeInTheDocument()
  })

  it('toggles target day selection', () => {
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />)
    const monBtn = screen.getByRole('button', { name: 'Lun' })
    expect(monBtn).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(monBtn)
    expect(monBtn).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(monBtn)
    expect(monBtn).toHaveAttribute('aria-pressed', 'false')
  })

  it('toggles color selection', () => {
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />)
    const redBtn = screen.getByLabelText('#ef4444')
    fireEvent.click(redBtn)
    expect(redBtn).toHaveAttribute('aria-pressed', 'true')
  })
})
