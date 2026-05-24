'use client'
import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, Clock, Eye, Shield, Package, TrendingUp, RefreshCw, Trash2, RotateCcw, AlertTriangle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'

type AdminTab = 'payments' | 'gigs' | 'orders' | 'users'

interface PendingPayment {
  id: string; amount: number; transactionId: string; screenshot?: string
  status: string; createdAt: string
  order: { id: string; package: string; gig: { id: string; title: string }; buyer: { id: string; name: string; email: string } }
}
interface PendingGig {
  id: string; title: string; category: string; techStack: string; description: string
  basicPrice: number; standardPrice: number; premiumPrice: number; deliveryDays: number
  status: string; createdAt: string
  seller: { id: string; name: string; email: string; sellerBio?: string }
}
interface LiveOrder {
  id: string; package: string; price: number; status: string; createdAt: string
  gig: { id: string; title: string }
  buyer: { id: string; name: string }
  seller: { id: string; name: string }
}
interface LiveUser {
  id: string; name: string; email: string; role: string; isSeller: boolean; isActive: boolean; deletedAt: string | null; createdAt: string
}

const ORDER_BADGE: Record<string, { label: string; variant: 'forest'|'teal'|'grey'|'warning'|'danger' }> = {
  PENDING_PAYMENT:      { label: 'Awaiting Payment',   variant: 'warning' },
  PAYMENT_VERIFICATION: { label: 'Verifying Payment',  variant: 'warning' },
  REQUIREMENTS_PENDING: { label: 'Needs Requirements', variant: 'warning' },
  IN_PROGRESS:          { label: 'In Progress',        variant: 'teal'    },
  IN_REVIEW:            { label: 'In Review',          variant: 'teal'    },
  DELIVERED:            { label: 'Delivered',          variant: 'forest'  },
  COMPLETED:            { label: 'Completed',          variant: 'grey'    },
  CANCELLED:            { label: 'Cancelled',          variant: 'danger'  },
}

export default function AdminPanel() {
  const [tab, setTab]               = useState<AdminTab>('gigs')
  const [payments, setPayments]     = useState<PendingPayment[]>([])
  const [gigs, setGigs]             = useState<PendingGig[]>([])
  const [orders, setOrders]         = useState<LiveOrder[]>([])
  const [users, setUsers]           = useState<LiveUser[]>([])
  const [loading, setLoading]       = useState(true)
  const [preview, setPreview]       = useState<PendingPayment | null>(null)
  const [gigPreview, setGigPreview] = useState<PendingGig | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast]           = useState<{ msg: string; type: 'success'|'error' } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<LiveUser | null>(null)

  const showToast = (msg: string, type: 'success'|'error') => setToast({ msg, type })

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [pr, gr, or_, ur] = await Promise.all([
        fetch('/api/payments?status=PENDING'),
        fetch('/api/gigs/pending'),
        fetch('/api/orders?view=admin'),
        fetch('/api/users'),
      ])
      if (pr.ok) { const d = await pr.json(); setPayments(d.payments || d.data?.payments || []) }
      if (gr.ok) { const d = await gr.json(); setGigs(d.gigs || d.data?.gigs || []) }
      if (or_.ok) { const d = await or_.json(); setOrders(d.orders || d.data?.orders || []) }
      if (ur.ok) { const d = await ur.json(); setUsers(d.users || d.data?.users || []) }
    } catch { showToast('Failed to load data', 'error') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handlePayment = async (id: string, action: 'approve'|'reject') => {
    setActionLoading(id)
    try {
      const res  = await fetch(`/api/payments/${id}/verify`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) })
      const data = await res.json()
      if (!res.ok) { showToast(data.error ?? 'Action failed', 'error'); return }
      setPayments(p => p.filter(x => x.id !== id))
      setPreview(null)
      showToast(action === 'approve' ? '✓ Payment verified. Order is now active.' : 'Payment rejected.', action === 'approve' ? 'success' : 'error')
    } catch { showToast('Network error', 'error') }
    finally { setActionLoading(null) }
  }

  const handleGig = async (id: string, action: 'approve'|'reject') => {
    setActionLoading(id)
    try {
      const res  = await fetch(`/api/admin/gigs/${id}/review`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) })
      const data = await res.json()
      if (!res.ok) { showToast(data.error ?? 'Action failed', 'error'); return }
      setGigs(g => g.filter(x => x.id !== id))
      setGigPreview(null)
      showToast(action === 'approve' ? '✓ Gig approved and published.' : 'Gig rejected.', action === 'approve' ? 'success' : 'error')
    } catch { showToast('Network error', 'error') }
    finally { setActionLoading(null) }
  }

  const handleDeleteUser = async (user: LiveUser) => {
    setActionLoading(user.id)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { showToast(data.error ?? 'Failed to delete user', 'error'); return }
      setUsers(u => u.map(x => x.id === user.id ? { ...x, isActive: false, deletedAt: new Date().toISOString() } : x))
      setDeleteConfirm(null)
      showToast(`✓ ${user.name} has been deactivated.`, 'success')
    } catch { showToast('Network error', 'error') }
    finally { setActionLoading(null) }
  }

  const handleReactivateUser = async (user: LiveUser) => {
    setActionLoading(user.id)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'PATCH' })
      const data = await res.json()
      if (!res.ok) { showToast(data.error ?? 'Failed to reactivate user', 'error'); return }
      setUsers(u => u.map(x => x.id === user.id ? { ...x, isActive: true, deletedAt: null } : x))
      showToast(`✓ ${user.name} has been reactivated.`, 'success')
    } catch { showToast('Network error', 'error') }
    finally { setActionLoading(null) }
  }

  const TABS: { key: AdminTab; label: string; badge?: number }[] = [
    { key: 'gigs',     label: 'Gig Approvals',       badge: gigs.length     },
    { key: 'payments', label: 'Payment Verification', badge: payments.length },
    { key: 'orders',   label: 'All Orders'                                   },
    { key: 'users',    label: 'Users'                                        },
  ]

  const Spinner = () => (
    <div className="text-center py-16">
      <RefreshCw size={24} className="mx-auto mb-3 text-white/30 animate-spin"/>
    </div>
  )

  return (
    <div className="section-dark min-h-screen">
      <Navbar/>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}

      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-28 pb-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Shield size={14} className="text-blue-400"/>
              <p className="text-[11px] uppercase tracking-[2.5px] text-blue-400 font-semibold">Admin Control</p>
            </div>
            <h1 className="font-display text-display text-white">Platform Centre.</h1>
          </div>
          <button onClick={fetchAll} disabled={loading}
            className="flex items-center gap-2 text-[12px] font-medium text-white/50 hover:text-white transition-colors mt-2 px-4 py-2 rounded-full border border-white/10 hover:border-white/20">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''}/>{loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        {/* Floating metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14 pb-14 border-b border-white/10">
          {[
            { num: loading ? '…' : payments.length, label: 'Pending Payments',     icon: <Clock      size={14}/> },
            { num: loading ? '…' : gigs.length,     label: 'Awaiting Review',      icon: <Eye        size={14}/> },
            { num: loading ? '…' : orders.length,   label: 'Total Orders',         icon: <Package    size={14}/> },
            { num: loading ? '…' : users.length,    label: 'Registered Users',     icon: <TrendingUp size={14}/> },
          ].map(({ num, label, icon }) => (
            <div key={label}>
              <div className="font-display text-[48px] text-white leading-none mb-2">{num}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-medium uppercase tracking-[1.5px]">{icon} {label}</div>
            </div>
          ))}
        </div>

        {/* Pill tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap ${
                tab===t.key
                  ? 'bg-white text-[var(--ink)] shadow-[0_2px_12px_rgba(255,255,255,0.15)]'
                  : 'text-white/60 border border-white/15 hover:border-white/30 hover:text-white'
              }`}>
              {t.label}
              {t.badge !== undefined && t.badge > 0 && <span className="bg-amber-400 text-slate-900 text-[9px] px-1.5 py-0.5 rounded-full font-bold">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* ── GIG APPROVALS ── */}
        {tab === 'gigs' && (
          <div className="space-y-4">
            {loading ? <Spinner/> : gigs.length === 0 ? (
              <div className="bento-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <div className="flex flex-col items-center py-24 text-center">
                  <CheckCircle size={32} className="mb-4 text-emerald-400"/>
                  <p className="font-display-medium text-[18px] text-white">All gigs reviewed.</p>
                </div>
              </div>
            ) : gigs.map(g => (
              <div key={g.id} className="overflow-hidden rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <div className="h-[3px] bg-blue-400"/>
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"/>
                        <span className="text-[10px] uppercase tracking-[2px] text-blue-400 font-semibold">Pending Review</span>
                        <Badge variant="muted" size="sm">{g.category}</Badge>
                      </div>
                      <h3 className="font-display-medium text-[16px] text-white mb-1">{g.title}</h3>
                      <p className="text-[12px] text-white/50 font-light">
                        by <span className="text-white/80 font-medium">{g.seller.name}</span>
                        <span className="text-white/30"> · {g.seller.email}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-[24px] text-white leading-none">₹{g.basicPrice.toLocaleString()}</p>
                      <p className="text-[11px] text-white/40 mt-1">{new Date(g.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {g.techStack.split(',').map(t => <span key={t} className="pill-badge" style={{ background: 'rgba(37,99,235,0.15)', color: '#93C5FD', border: '1px solid rgba(37,99,235,0.25)' }}>{t.trim()}</span>)}
                    <span className="text-[11px] text-white/30 ml-1">{g.deliveryDays}d delivery</span>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button size="sm" loading={actionLoading===g.id} onClick={() => handleGig(g.id,'approve')}><CheckCircle size={12}/> Approve</Button>
                    <Button variant="danger" size="sm" loading={actionLoading===g.id} onClick={() => handleGig(g.id,'reject')}><XCircle size={12}/> Reject</Button>
                    <button onClick={() => setGigPreview(g)} className="text-[12px] text-white/50 hover:text-white flex items-center gap-1.5 transition-colors">
                      <Eye size={12}/> Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PAYMENT VERIFICATION ── */}
        {tab === 'payments' && (
          <div className="space-y-4">
            {loading ? <Spinner/> : payments.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle size={28} className="mx-auto mb-3 text-[var(--forest)]"/>
                <p className="font-display text-xl font-light text-[var(--grey)]">All payments verified</p>
              </div>
            ) : payments.map(p => (
              <div key={p.id} className="border-[0.5px] border-[var(--line)] bg-[var(--paper)]">
                <div className="h-[2px] bg-[#d4870a]"/>
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-[#d4870a] animate-pulse"/>
                        <span className="text-[9px] uppercase tracking-[2px] text-[#d4870a] font-medium font-[Jost]">Pending Verification</span>
                      </div>
                      <h3 className="text-[15px] font-medium text-[var(--charcoal)] font-[Jost]">{p.order.gig.title}</h3>
                      <p className="text-[12px] text-[var(--grey)] font-[Jost] font-light mt-1">
                        Buyer: <span className="font-medium">{p.order.buyer.name}</span>
                        <span className="text-[var(--grey-light)]"> · {p.order.buyer.email}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl font-light text-[var(--charcoal)]">₹{p.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-[var(--grey-light)] mt-1 font-[Jost]">{new Date(p.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[var(--paper-dark)] mb-5">
                    {[['Order ID', `#${p.order.id.slice(0,8).toUpperCase()}`],['Package', p.order.package.toUpperCase()],['UTR / Txn ID', p.transactionId],['Screenshot', p.screenshot ? '✓ Uploaded' : '✗ Missing']].map(([k,v]) => (
                      <div key={k as string}>
                        <p className="text-[8px] uppercase tracking-[2px] text-[var(--grey-light)] font-[Jost] font-medium mb-0.5">{k}</p>
                        <p className="text-[12px] font-mono-co text-[var(--charcoal)]">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-[var(--line)]">
                    <Button size="sm" loading={actionLoading===p.id} onClick={() => handlePayment(p.id,'approve')}><CheckCircle size={12}/> Verify Payment</Button>
                    <Button variant="danger" size="sm" loading={actionLoading===p.id} onClick={() => handlePayment(p.id,'reject')}><XCircle size={12}/> Reject</Button>
                    {p.screenshot && <button onClick={() => setPreview(p)} className="text-[10px] uppercase tracking-[2px] text-[var(--grey)] hover:text-[var(--forest)] flex items-center gap-1.5 font-medium font-[Jost] transition-colors"><Eye size={12}/> View Screenshot</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ALL ORDERS ── */}
        {tab === 'orders' && (
          loading ? <Spinner/> : (
            <table className="w-full border-collapse">
              <thead><tr className="border-b border-[var(--line)]">
                {['Order ID','Gig','Buyer','Seller','Package','Amount','Status','Date'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-[9px] uppercase tracking-[2px] text-[var(--grey-light)] font-medium font-[Jost]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-[var(--grey-light)] font-[Jost] text-sm">No orders yet</td></tr>
                ) : orders.map(o => {
                  const badge = ORDER_BADGE[o.status]
                  return (
                    <tr key={o.id} className="border-b border-[var(--line)] hover:bg-[var(--paper-dark)] transition-colors">
                      <td className="py-4 px-3 font-mono-co text-[11px] text-[var(--grey)]">#{o.id.slice(0,8).toUpperCase()}</td>
                      <td className="py-4 px-3 text-[12px] text-[var(--charcoal)] font-[Jost] max-w-[160px] truncate">{o.gig.title}</td>
                      <td className="py-4 px-3 text-[12px] text-[var(--grey)] font-[Jost]">{o.buyer.name}</td>
                      <td className="py-4 px-3 text-[12px] text-[var(--grey)] font-[Jost]">{o.seller.name}</td>
                      <td className="py-4 px-3 text-[11px] text-[var(--grey-light)] font-[Jost] capitalize">{o.package}</td>
                      <td className="py-4 px-3 text-[12px] font-medium text-[var(--charcoal)] font-[Jost]">₹{o.price.toLocaleString()}</td>
                      <td className="py-4 px-3">{badge && <Badge variant={badge.variant} size="sm">{badge.label}</Badge>}</td>
                      <td className="py-4 px-3 text-[11px] text-[var(--grey-light)] font-[Jost]">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          loading ? <Spinner/> : (
            <table className="w-full border-collapse">
              <thead><tr className="border-b border-[var(--line)]">
                {['Name','Email','Role','Status','Joined','Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-[9px] uppercase tracking-[2px] text-[var(--grey-light)] font-medium font-[Jost]">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-[var(--grey-light)] font-[Jost] text-sm">No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u.id} className={`border-b border-[var(--line)] hover:bg-[var(--paper-dark)] transition-colors ${!u.isActive ? 'opacity-50' : ''}`}>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 flex items-center justify-center text-[var(--paper)] text-[11px] font-medium shrink-0 ${u.isActive ? 'bg-[var(--forest)]' : 'bg-[var(--grey-light)]'}`}>{u.name.charAt(0).toUpperCase()}</div>
                        <span className="text-[13px] font-medium text-[var(--charcoal)] font-[Jost]">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-[12px] text-[var(--grey)] font-mono-co">{u.email}</td>
                    <td className="py-4 px-3"><Badge variant={u.role==='ADMIN'?'danger':u.isSeller?'forest':'teal'} size="sm">{u.role==='ADMIN'?'Admin':u.isSeller?'Seller':'Buyer'}</Badge></td>
                    <td className="py-4 px-3">
                      {u.isActive
                        ? <Badge variant="forest" size="sm">Active</Badge>
                        : <Badge variant="danger" size="sm">Deactivated</Badge>
                      }
                    </td>
                    <td className="py-4 px-3 text-[11px] text-[var(--grey-light)] font-[Jost]">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-4 px-3">
                      {u.role !== 'ADMIN' && (
                        u.isActive ? (
                          <button
                            onClick={() => setDeleteConfirm(u)}
                            disabled={actionLoading === u.id}
                            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] text-red-500 hover:text-red-700 font-medium font-[Jost] transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={12}/> Delete
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivateUser(u)}
                            disabled={actionLoading === u.id}
                            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] text-[var(--forest)] hover:text-[var(--forest-light)] font-medium font-[Jost] transition-colors disabled:opacity-50"
                          >
                            <RotateCcw size={12}/> {actionLoading === u.id ? 'Loading…' : 'Reactivate'}
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      {/* Payment screenshot modal */}
      <Modal isOpen={!!preview} onClose={() => setPreview(null)} title="Payment Screenshot" size="md">
        <div className="aspect-video bg-[var(--bg-secondary)] flex items-center justify-center rounded-2xl mb-4 overflow-hidden border border-[var(--line)]">
          {preview?.screenshot
            ? <img src={preview.screenshot} alt="Payment proof" className="max-w-full max-h-full object-contain"/>
            : <p className="text-[13px] text-[var(--muted)]">No screenshot uploaded</p>}
        </div>
        <div className="flex gap-3">
          <Button size="md" className="flex-1" loading={actionLoading===preview?.id} onClick={() => preview && handlePayment(preview.id,'approve')}><CheckCircle size={13}/> Verify Payment</Button>
          <Button variant="danger" size="md" loading={actionLoading===preview?.id} onClick={() => preview && handlePayment(preview.id,'reject')}><XCircle size={13}/> Reject</Button>
        </div>
      </Modal>

      {/* Gig description modal */}
      <Modal isOpen={!!gigPreview} onClose={() => setGigPreview(null)} title="Gig Details" size="lg">
        {gigPreview && (
          <div className="space-y-4">
            <p className="text-[9px] uppercase tracking-[2px] text-[var(--grey-light)] font-[Jost] font-medium mb-1">Description</p>
            <p className="text-[13px] text-[var(--grey)] font-[Jost] font-light leading-relaxed whitespace-pre-wrap">{gigPreview.description}</p>
            <div className="pt-4 border-t border-[var(--line)] flex gap-3">
              <Button size="md" className="flex-1" loading={actionLoading===gigPreview.id} onClick={() => handleGig(gigPreview.id,'approve')}><CheckCircle size={13}/> Approve & Publish</Button>
              <Button variant="danger" size="md" loading={actionLoading===gigPreview.id} onClick={() => handleGig(gigPreview.id,'reject')}><XCircle size={13}/> Reject</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete user confirmation modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete User Account" size="sm">
        {deleteConfirm && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-[10px]">
              <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5"/>
              <div>
                <p className="text-[13px] font-medium text-red-800 font-[Jost] mb-1">This action will:</p>
                <ul className="text-[12px] text-red-700 font-[Jost] font-light space-y-1 list-disc list-inside">
                  <li>Deactivate <strong>{deleteConfirm.name}</strong>&apos;s account</li>
                  <li>Invalidate all their active sessions</li>
                  <li>Archive all their published gigs</li>
                  <li>Block them from logging in</li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-[var(--paper-dark)] border-[0.5px] border-[var(--line)]">
              <div className="grid grid-cols-2 gap-3 text-[12px] font-[Jost]">
                <div><span className="text-[var(--grey-light)] font-light">Name</span><br/><span className="font-medium text-[var(--charcoal)]">{deleteConfirm.name}</span></div>
                <div><span className="text-[var(--grey-light)] font-light">Email</span><br/><span className="font-mono-co text-[var(--charcoal)]">{deleteConfirm.email}</span></div>
                <div><span className="text-[var(--grey-light)] font-light">Role</span><br/><span className="font-medium text-[var(--charcoal)]">{deleteConfirm.role}</span></div>
                <div><span className="text-[var(--grey-light)] font-light">Joined</span><br/><span className="text-[var(--charcoal)]">{new Date(deleteConfirm.createdAt).toLocaleDateString('en-IN')}</span></div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="md" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" size="md" className="flex-1" loading={actionLoading === deleteConfirm.id} onClick={() => handleDeleteUser(deleteConfirm)}>
                <Trash2 size={13}/> Delete Account
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
