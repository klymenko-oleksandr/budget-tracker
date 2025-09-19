import { TransactionType } from '@prisma/client'

// Core Transaction interface used across all components
export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: string
  date: string
  description: string | null
  note: string | null
  categoryId?: string | null
  category?: {
    id: string
    name: string
    color: string
    icon: string
  } | null
  account?: {
    id: string
    name: string
  } | null
  createdAt?: string
  updatedAt?: string
}

// Category interface used across components
export interface Category {
  id: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  budget: number | null
  createdAt: string
  updatedAt: string
}

// Simplified Transaction interface for forms (without relations)
export interface TransactionFormData {
  type: TransactionType
  amount: number
  date: string
  categoryId?: string | null
  description?: string | null
  note?: string | null
}

// Category form data interface
export interface CategoryFormData {
  name: string
  description?: string | null
  color?: string | null
  icon?: string | null
  budget?: number | null
}
