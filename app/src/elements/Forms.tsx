import { FC, useState } from 'react';
import { classNames } from '../lib/utils';
import { Combobox as HeadlessComboBox, Switch } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';


type TextFieldProp = {
  label: string
  showLabel?: boolean
  inputProps: Record<string, unknown> & {name: string}
}
export const TextInput: FC<TextFieldProp> = ({label, inputProps, showLabel = true, ...rest}) => (
  showLabel ?
    <div>
      <label htmlFor={inputProps.name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={inputProps.name}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
    :
    <div>
      <label htmlFor={inputProps.name} className="sr-only">
        {label}
      </label>
      <input
        id={inputProps.name}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        {...inputProps}
      />
    </div>
)

export const ToggleWithIcon: FC = () => {
  const [enabled, setEnabled] = useState(false)

  const toggleEnabled = () => setEnabled((a) => !a)

  return (
    <Switch
      checked={enabled}
      onChange={toggleEnabled}
      className={classNames(
        enabled ? 'bg-indigo-600' : 'bg-gray-200',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
        )}
      >
        <span
          className={classNames(
            enabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
          )}
          aria-hidden="true"
        >
          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          className={classNames(
            enabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
          )}
          aria-hidden="true"
        >
          <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
          </svg>
        </span>
      </span>
    </Switch>
  )
}

type ComboboxProps = {
  options: ComboboxOption[]
  showLabel: boolean
  label: string
}

export type ComboboxOption = {
  key: string
  label: string

}
export const Combobox: FC<ComboboxProps> = ({options, label, showLabel, }) => {
  const [query, setQuery] = useState('')
  const [selectedOption, setSelectedOption] = useState<ComboboxOption>()

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
        return option.label.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <HeadlessComboBox as="div" value={selectedOption} onChange={setSelectedOption}>
      {showLabel && <HeadlessComboBox.Label className="block text-sm font-medium text-gray-700">{label}</HeadlessComboBox.Label>}
      <div className="relative mt-1">
        <HeadlessComboBox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option: ComboboxOption) => option?.label}
        />
        <HeadlessComboBox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </HeadlessComboBox.Button>

        {filteredOptions.length > 0 && (
          <HeadlessComboBox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <HeadlessComboBox.Option
                key={option.key}
                value={option.label}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('block truncate', (selected ? 'font-semibold' : ''))}>{option.label}</span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </HeadlessComboBox.Option>
            ))}
          </HeadlessComboBox.Options>
        )}
      </div>
    </HeadlessComboBox>
  )
}

