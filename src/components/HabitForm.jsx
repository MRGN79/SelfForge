import React, { useState } from 'react'
import { t } from '../i18n.js'
import { toDateStr } from '../utils/dates.js'

const DAYS = ['dayMon', 'dayTue', 'dayWed', 'dayThu', 'dayFri', 'daySat', 'daySun']
const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6']

function defaultForm(habit) {
  return {
    name: habit?.name ?? '',
    description: habit?.description ?? '',
    type: habit?.type ?? 'daily',
    frequency: habit?.frequency ?? 1,
    targetDays: habit?.targetDays ?? [],
    category: habit?.category ?? '',
    color: habit?.color ?? '#6366f1',
    startDate: habit?.startDate ?? toDateStr(),
    endDate: habit?.endDate ?? '',
    active: habit?.active !== false,
  }
}

export default function HabitForm({ habit, onSave, onCancel }) {
  const [form, setForm] = useState(() => defaultForm(habit))
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function toggleDay(idx) {
    set('targetDays', form.targetDays.includes(idx)
      ? form.targetDays.filter(d => d !== idx)
      : [...form.targetDays, idx])
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = t('required')
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      frequency: Number(form.frequency),
      endDate: form.endDate || null,
    })
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">

      {/* Name */}
      <div>
        <label htmlFor="hf-name" className="block text-sm font-medium text-gray-700 mb-1">
          {t('habitName')} <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="hf-name"
          type="text"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder={t('habitNamePlaceholder')}
          aria-required="true"
          aria-describedby={errors.name ? 'hf-name-err' : undefined}
          className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`}
        />
        {errors.name && <p id="hf-name-err" role="alert" className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="hf-desc" className="block text-sm font-medium text-gray-700 mb-1">{t('habitDescription')}</label>
        <textarea
          id="hf-desc"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder={t('habitDescriptionPlaceholder')}
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Type */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-1">{t('habitType')}</legend>
        <div className="flex gap-4">
          {['daily', 'weekly'].map(tp => (
            <label key={tp} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="hf-type"
                value={tp}
                checked={form.type === tp}
                onChange={() => set('type', tp)}
                className="accent-indigo-600"
              />
              {t(tp === 'daily' ? 'habitTypeDaily' : 'habitTypeWeekly')}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Target days (daily only) */}
      {form.type === 'daily' && (
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-1">{t('habitTargetDays')}</legend>
          <div className="flex gap-1 flex-wrap" role="group">
            {DAYS.map((key, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => toggleDay(idx)}
                aria-pressed={form.targetDays.includes(idx)}
                className={`
                  px-2 py-1 rounded-md text-xs font-semibold border transition-colors
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
                  ${form.targetDays.includes(idx)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'}
                `}
              >
                {t(key)}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Frequency (weekly only) */}
      {form.type === 'weekly' && (
        <div>
          <label htmlFor="hf-freq" className="block text-sm font-medium text-gray-700 mb-1">
            {t('habitFrequency')} <span className="text-gray-400 font-normal">({t('habitFrequencyHelp')})</span>
          </label>
          <input
            id="hf-freq"
            type="number"
            min={1}
            max={7}
            value={form.frequency}
            onChange={e => set('frequency', e.target.value)}
            className={`${inputClass} w-24`}
          />
        </div>
      )}

      {/* Category & Color */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="hf-cat" className="block text-sm font-medium text-gray-700 mb-1">{t('habitCategory')}</label>
          <input
            id="hf-cat"
            type="text"
            value={form.category}
            onChange={e => set('category', e.target.value)}
            placeholder={t('habitCategoryPlaceholder')}
            className={inputClass}
          />
        </div>
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1" id="hf-color-label">{t('habitColor')}</p>
          <div className="flex gap-1 flex-wrap max-w-[140px]" role="group" aria-labelledby="hf-color-label">
            {COLORS.map(c => (
              <button
                type="button"
                key={c}
                onClick={() => set('color', c)}
                aria-pressed={form.color === c}
                aria-label={c}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-full border-2 transition-transform
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
                  ${form.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="hf-start" className="block text-sm font-medium text-gray-700 mb-1">{t('habitStartDate')}</label>
          <input
            id="hf-start"
            type="date"
            value={form.startDate}
            onChange={e => set('startDate', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="hf-end" className="block text-sm font-medium text-gray-700 mb-1">{t('habitEndDate')}</label>
          <input
            id="hf-end"
            type="date"
            value={form.endDate}
            onChange={e => set('endDate', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Active */}
      <label className="flex items-center gap-2 cursor-pointer text-sm">
        <input
          type="checkbox"
          checked={form.active}
          onChange={e => set('active', e.target.checked)}
          className="w-4 h-4 accent-indigo-600"
        />
        {t('habitActive')}
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {t('saveHabit')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
        >
          {t('cancelBtn')}
        </button>
      </div>
    </form>
  )
}
