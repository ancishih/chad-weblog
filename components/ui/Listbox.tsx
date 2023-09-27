'use client'
import React from 'react'
import {Listbox} from '@headlessui/react'

interface Item {
  label: string
  value: Record<string, unknown>
  isSelected: boolean
}

export default function ListBox<Item extends Record<string, unknown>>({
  items,
  updateFn,
  defaultValue,
}: {
  items: Item[]
  updateFn: React.Dispatch<React.SetStateAction<Item>>
  defaultValue: Item
}) {
  const [selectedItem, setSelectedItem] = React.useState<Item>(
    () => defaultValue,
  )

  React.useEffect(() => {
    updateFn(selectedItem)
  }, [selectedItem])

  return (
    <>
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button>{selectedItem.label}</Listbox.Button>
        <Listbox.Options>
          {items.map(item => (
            <Listbox.Option key={item.label} value={item.value}>
              <li className={`${item.isSelected ? '' : ''}`}>{item.label}</li>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </>
  )
}
