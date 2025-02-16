// components/shared/order-status-select.tsx
'use client'


import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui/select';
import { useState, useTransition } from 'react'
import { updateOrderStatus } from '../../../lib/actions/order.actions'
import { useToast } from '../../ui/use-toast'

export default function OrderStatusSelect({ 
  orderId, 
  currentStatus,
  statusOptions 
}: { 
  orderId: string
  currentStatus: string
  statusOptions: Array<{
    status: string
    text: string
    icon: React.ReactNode
  }>
}) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(currentStatus)

  const handleStatusChange = async (newStatus: string) => {
    startTransition(async () => {
      const res = await updateOrderStatus({
        orderId,
        status: newStatus
      })
      
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message
        })
      } else {
        setStatus(newStatus)
        toast({
          description: 'Order status updated successfully'
        })
      }
    })
  }

  return (
    <Select 
      value={status}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem 
            key={option.status} 
            value={option.status}
          >
            <div className='flex items-center gap-1'>
              <span className='order-select-icon'>{option.icon}</span> 
              {option.text}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}