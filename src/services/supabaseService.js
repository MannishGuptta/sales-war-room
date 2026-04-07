import { supabase } from '../supabaseClient'

// ============================================
// RM CRUD OPERATIONS
// ============================================

export const getRMs = async () => {
  const { data, error } = await supabase
    .from('rms')
    .select('*')
    .order('id')
  
  if (error) throw error
  return data
}

export const addRM = async (rmData) => {
  const { data, error } = await supabase
    .from('rms')
    .insert([{
      name: rmData.name,
      email: rmData.email,
      phone: rmData.phone,
      monthly_target: rmData.monthlyTarget || 0,
      cp_target: rmData.cpTarget || 0,
      active_cp_target: rmData.activeCPTarget || 0,
      status: 'active'
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateRM = async (id, rmData) => {
  const { data, error } = await supabase
    .from('rms')
    .update({
      name: rmData.name,
      email: rmData.email,
      phone: rmData.phone,
      monthly_target: rmData.monthlyTarget,
      cp_target: rmData.cpTarget,
      active_cp_target: rmData.activeCPTarget
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteRM = async (id) => {
  const { error } = await supabase
    .from('rms')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

// ============================================
// TEAM LEADER CRUD OPERATIONS
// ============================================

export const getTeamLeaders = async () => {
  const { data, error } = await supabase
    .from('team_leaders')
    .select('*')
    .order('id')
  
  if (error) throw error
  return data
}

export const addTeamLeader = async (tlData) => {
  const { data, error } = await supabase
    .from('team_leaders')
    .insert([{
      name: tlData.name,
      email: tlData.email,
      phone: tlData.phone,
      region: tlData.region,
      monthly_target: tlData.monthlyTarget || 0
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateTeamLeader = async (id, tlData) => {
  const { data, error } = await supabase
    .from('team_leaders')
    .update({
      name: tlData.name,
      email: tlData.email,
      phone: tlData.phone,
      region: tlData.region,
      monthly_target: tlData.monthlyTarget
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteTeamLeader = async (id) => {
  const { error } = await supabase
    .from('team_leaders')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

// ============================================
// CHANNEL PARTNER CRUD OPERATIONS
// ============================================

export const getChannelPartners = async (rmId = null) => {
  let query = supabase.from('channel_partners').select('*')
  if (rmId) {
    query = query.eq('rm_id', rmId)
  }
  const { data, error } = await query.order('id')
  
  if (error) throw error
  return data
}

export const addChannelPartner = async (cpData) => {
  const { data, error } = await supabase
    .from('channel_partners')
    .insert([{
      name: cpData.name,
      rm_id: cpData.rmId,
      phone: cpData.phone,
      email: cpData.email,
      status: cpData.status || 'active',
      onboarded_date: new Date().toISOString().split('T')[0]
    }])
    .select()
  
  if (error) throw error
  
  // Update RM's cp_onboarded count
  await supabase.rpc('increment_cp_count', { rm_id: cpData.rmId })
  
  return data[0]
}

export const updateChannelPartner = async (id, cpData) => {
  const { data, error } = await supabase
    .from('channel_partners')
    .update({
      name: cpData.name,
      rm_id: cpData.rmId,
      phone: cpData.phone,
      email: cpData.email,
      status: cpData.status
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteChannelPartner = async (id) => {
  const { error } = await supabase
    .from('channel_partners')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

// ============================================
// SALES CRUD OPERATIONS
// ============================================

export const getSales = async (rmId = null) => {
  let query = supabase.from('sales').select('*, channel_partners(name)')
  if (rmId) {
    query = query.eq('rm_id', rmId)
  }
  const { data, error } = await query.order('sale_date', { ascending: false })
  
  if (error) throw error
  return data
}

export const addSale = async (saleData) => {
  const { data, error } = await supabase
    .from('sales')
    .insert([{
      rm_id: saleData.rmId,
      cp_id: saleData.cpId,
      amount: saleData.amount,
      sale_date: saleData.date,
      payment_mode: saleData.paymentMode,
      invoice_no: saleData.invoiceNo,
      notes: saleData.notes,
      status: 'completed'
    }])
    .select()
  
  if (error) throw error
  
  // Update RM's monthly_achieved and CP's sales_count
  await supabase.rpc('update_rm_achievement', { rm_id: saleData.rmId, amount: saleData.amount })
  await supabase.rpc('increment_cp_sales', { cp_id: saleData.cpId })
  
  return data[0]
}

export const deleteSale = async (id) => {
  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

// ============================================
// MEETINGS CRUD OPERATIONS
// ============================================

export const getMeetings = async (rmId = null) => {
  let query = supabase.from('meetings').select('*')
  if (rmId) {
    query = query.eq('rm_id', rmId)
  }
  const { data, error } = await query.order('meeting_date', { ascending: true })
  
  if (error) throw error
  return data
}

export const addMeeting = async (meetingData) => {
  const { data, error } = await supabase
    .from('meetings')
    .insert([{
      rm_id: meetingData.rmId,
      type: meetingData.type,
      title: meetingData.title,
      with_person: meetingData.with,
      meeting_date: meetingData.date,
      meeting_time: meetingData.time,
      duration: meetingData.duration,
      notes: meetingData.notes,
      status: 'scheduled',
      reminder: meetingData.reminder || true,
      reminder_minutes: meetingData.reminderMinutes || 30,
      follow_up: meetingData.followUp || false,
      follow_up_date: meetingData.followUpDate
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateMeetingStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('meetings')
    .update({ status: status })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteMeeting = async (id) => {
  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}