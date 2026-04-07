import { supabase } from '../supabaseClient'

// Real-time subscription handlers
let subscriptions = []

export const subscribeToRMChanges = (callback) => {
  const subscription = supabase
    .channel('rms_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'rms' }, 
      (payload) => {
        console.log('RM change detected:', payload)
        callback(payload)
      }
    )
    .subscribe()
  
  subscriptions.push(subscription)
  return subscription
}

export const subscribeToCPChanges = (callback) => {
  const subscription = supabase
    .channel('cp_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'channel_partners' }, 
      (payload) => {
        console.log('CP change detected:', payload)
        callback(payload)
      }
    )
    .subscribe()
  
  subscriptions.push(subscription)
  return subscription
}

export const subscribeToSalesChanges = (callback) => {
  const subscription = supabase
    .channel('sales_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'sales' }, 
      (payload) => {
        console.log('Sale change detected:', payload)
        callback(payload)
      }
    )
    .subscribe()
  
  subscriptions.push(subscription)
  return subscription
}

export const subscribeToMeetingChanges = (callback) => {
  const subscription = supabase
    .channel('meetings_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'meetings' }, 
      (payload) => {
        console.log('Meeting change detected:', payload)
        callback(payload)
      }
    )
    .subscribe()
  
  subscriptions.push(subscription)
  return subscription
}

export const unsubscribeAll = () => {
  subscriptions.forEach(sub => {
    supabase.removeChannel(sub)
  })
  subscriptions = []
}
