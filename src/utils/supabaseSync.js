import { supabase } from '../supabaseClient'

export const syncRMData = async (rmData) => {
  const { error } = await supabase
    .from('rms')
    .upsert(rmData, { onConflict: 'id' })
  
  if (error) console.error('Error syncing RM data:', error)
  return !error
}

export const syncCPData = async (cpData) => {
  const { error } = await supabase
    .from('channel_partners')
    .upsert(cpData, { onConflict: 'id' })
  
  if (error) console.error('Error syncing CP data:', error)
  return !error
}

export const syncSaleData = async (saleData) => {
  const { error } = await supabase
    .from('sales')
    .upsert(saleData, { onConflict: 'id' })
  
  if (error) console.error('Error syncing Sale data:', error)
  return !error
}

export const syncMeetingData = async (meetingData) => {
  const { error } = await supabase
    .from('meetings')
    .upsert(meetingData, { onConflict: 'id' })
  
  if (error) console.error('Error syncing Meeting data:', error)
  return !error
}