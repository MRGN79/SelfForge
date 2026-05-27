import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../components/Modal.jsx'
import HabitForm from '../components/HabitForm.jsx'
import { consistency30, currentStreak, maxStreak } from '../utils/gamification.js'

beforeEach(() => localStorage.setItem('selfforge_lang', 'es'))

// ── Modal: focus trap ──────────────────────────────────────────────────────
describe('Modal focus trap', () => {
  it('Tab cycles focus within the modal', async () => {
    const user = userEvent.setup()
    render(
      <Modal title="Trap" onClose={vi.fn()}>
        <button>A</button>
        <button>B</button>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    const buttons = dialog.querySelectorAll('button')
    buttons[buttons.length - 1].focus()
    await user.tab()
    expect(document.activeElement).toBe(buttons[0])
  })

  it('Shift+Tab cycles focus backwards within the modal', async () => {
    const user = userEvent.setup()
    render(
      <Modal title="Trap" onClose={vi.fn()}>
        <button>A</button>
        <button>B</button>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    const buttons = dialog.querySelectorAll('button')
    buttons[0].focus()
    await user.tab({ shift: true })
    expect(document.activeElement).toBe(buttons[buttons.length - 1])
  })

  it('Tab with no focusable elements does not crash', () => {
    const onClose = vi.fn()
    const { container } = render(<Modal title="Empty" onClose={onClose}><div /></Modal>)
    const closeBtn = container.querySelector('button')
    closeBtn?.remove()
    fireEvent.keyDown(document, { key: 'Tab' })
  })

  it('closes when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<Modal title="M" onClose={onClose}><button>inner</button></Modal>)
    const backdrop = screen.getByRole('dialog')
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when inner content is clicked', () => {
    const onClose = vi.fn()
    render(<Modal title="M" onClose={onClose}><button>inner</button></Modal>)
    fireEvent.click(screen.getByText('inner'))
    expect(onClose).not.toHaveBeenCalled()
  })
})

// ── HabitForm: weekly type and all branches ────────────────────────────────
describe('HabitForm weekly type', () => {
  it('switches to weekly type and shows frequency', () => {
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Semanal'))
    expect(screen.getByLabelText(/Frecuencia/)).toBeInTheDocument()
    expect(screen.queryByText('Lun')).not.toBeInTheDocument()
  })

  it('saves weekly habit with correct type and frequency', () => {
    const onSave = vi.fn()
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Semanal'))
    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Gym' } })
    fireEvent.change(screen.getByLabelText(/Frecuencia/), { target: { value: '3' } })
    fireEvent.click(screen.getByText('Forjar'))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ type: 'weekly', frequency: 3 }))
  })

  it('saves with endDate when provided', () => {
    const onSave = vi.fn()
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Gym' } })
    fireEvent.change(screen.getByLabelText(/Último temple/), { target: { value: '2025-12-31' } })
    fireEvent.click(screen.getByText('Forjar'))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ endDate: '2025-12-31' }))
  })

  it('sets endDate to null when empty', () => {
    const onSave = vi.fn()
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'X' } })
    fireEvent.click(screen.getByText('Forjar'))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ endDate: null }))
  })

  it('toggles active checkbox', () => {
    const onSave = vi.fn()
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />)
    const activeCheck = screen.getByRole('checkbox')
    expect(activeCheck).toBeChecked()
    fireEvent.click(activeCheck)
    expect(activeCheck).not.toBeChecked()
  })
})

// ── Gamification: remaining branches ──────────────────────────────────────
const daily = { id: 'h1', type: 'daily', active: true, startDate: '2024-01-01', endDate: null, targetDays: [], frequency: 1 }
const weekly2 = { id: 'h2', type: 'weekly', active: true, startDate: '2024-01-01', endDate: null, targetDays: [], frequency: 1 }

function log(habitId, date, completed = true) {
  return { id: `l_${date}`, habitId, date, completed, note: '' }
}

describe('gamification edge cases', () => {
  it('currentStreak skips non-scheduled days (targetDays set)', () => {
    const mon = { ...daily, targetDays: [0] }
    const logs = [log('h1', '2024-01-01'), log('h1', '2024-01-08')]
    expect(currentStreak(mon, logs, '2024-01-08')).toBe(2)
  })

  it('maxStreak with targetDays respects gaps', () => {
    const mon = { ...daily, targetDays: [0] }
    const logs = [log('h1', '2024-01-01'), log('h1', '2024-01-08')]
    expect(maxStreak(mon, logs, '2024-01-08')).toBe(2)
  })

  it('consistency30 returns 50% when half completed', () => {
    const days = []
    for (let i = 0; i < 30; i++) {
      const d = new Date(2024, 0, 2 + i)
      if (i % 2 === 0) {
        const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        days.push(log('h1', str))
      }
    }
    const result = consistency30(daily, days, '2024-01-31')
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThan(100)
  })

  it('weekly consistency with no matching weeks returns 0', () => {
    const habitFarFuture = { ...weekly2, startDate: '2030-01-01' }
    expect(consistency30(habitFarFuture, [], '2024-01-31')).toBe(0)
  })

  it('currentStreak weekly with 1 frequency per week', () => {
    const logs = [log('h2', '2024-01-03')]
    expect(currentStreak(weekly2, logs, '2024-01-05')).toBe(1)
  })

  it('maxStreak weekly breaks on incomplete week', () => {
    const logs = [
      log('h2', '2024-01-01'),
      log('h2', '2024-01-15'),
    ]
    expect(maxStreak(weekly2, logs, '2024-01-21')).toBe(1)
  })
})
