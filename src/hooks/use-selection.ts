"use client"

import { useState, useCallback } from "react"

export function useSelection<T extends string>(initialSelected: T[] = []) {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelected)

  const isSelected = useCallback(
    (id: T) => selectedItems.includes(id),
    [selectedItems]
  )

  const toggle = useCallback((id: T) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  const selectAll = useCallback((ids: T[]) => {
    setSelectedItems(ids)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedItems([])
  }, [])

  const toggleAll = useCallback((ids: T[]) => {
    if (selectedItems.length === ids.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(ids)
    }
  }, [selectedItems.length])

  return {
    selectedItems,
    isSelected,
    toggle,
    selectAll,
    clearSelection,
    toggleAll,
    count: selectedItems.length,
    hasSelection: selectedItems.length > 0,
    isAllSelected: useCallback(
      (ids: T[]) => ids.length > 0 && selectedItems.length === ids.length,
      [selectedItems.length]
    ),
  }
}
