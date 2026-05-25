'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { TrendingUp, Package, Plus, Upload, CheckCircle, Eye, RefreshCw, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import OrderProgress from '@/components/order/OrderProgress'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/lib/useAuth'
import type { OrderStatus } from '@/types'
import { generateGigSlug } from '@/lib/utils/slugify'

type SellerGig = {
  id: string
  status: string
  category: string
  title: string
  basicPrice: number
  totalOrders?: number
  rating?: number
}

type SellerOrder = {
  id: string
  status: OrderStatus
  package: string
  price: number
  deadline?: string | null
  updatedAt: string
  requirements?: string | null
  buyer: { name: string; email: string }
  gig: { title: string; status: string }
}

const GIG_STATUS_BADGE: Record<string, { label: string; variant: 'forest' | 'teal' | 'grey' | 'warning' | 'danger' }> = {
  PUBLISHED:      { label: 'Live',           variant: 'forest'  },
  PENDING_REVIEW: { label: 'Under Review',   variant: 'warning' },
  DRAFT:          { label: 'Draft',          variant: 'grey'    },
  REJECTED:       { label: 'Rejected',       variant: 'danger'  },
}

export default function SellerDashboard() {
  const { user, loading: authLoading } = useAuth('SELLER')
  const [activeTab, setActiveTab]     = useState<'orders' | 'gigs' | 'history'>('orders')
  const [gigs, setGigs]               = useState<SellerGig[]>([])
  const [orders, setOrders]           = useState<SellerOrder[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [deliverModal, setDeliverModal] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast]             = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const fetchAll = useCallback(async (userId: string) => {
    setDataLoading(true)
    try {
      const [gr, or] = await Promise.all([
        fetch(`/api/gigs?sellerId=${userId}`),
        fetch(`/api/orders?view=seller`),
      ])
      if (gr.ok) { const d = await gr.json(); setGigs(d.gigs || d.data?.gigs || []) }
      if (or.ok) { const d = await or.json(); setOrders(d.orders || d.data?.orders || []) }
    } catch {
      setToast({ msg: 'Failed to sync data', type: 'error' })
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) fetchAll(user.userId)
  }, [user, fetchAll])

  const handleDeliver = async (orderId: string, deliveryUrl: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deliver', deliveryFile: deliveryUrl })
      })
      if (res.ok) {
        setToast({ msg: 'Work delivered! Awaiting buyer review.', type: 'success' })
        if (user) fetchAll(user.userId)
      } else {
        const d = await res.json()
        setToast({ msg: d.error || 'Delivery failed', type: 'error' })
      }
    } catch {
      setToast({ msg: 'Network error', type: 'error' })
    }
  }

  const handleDeleteGig = async () => {
    if (!deleteConfirm) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/gigs/${deleteConfirm}`, { method: 'DELETE' })
      if (res.ok) {
        setToast({ msg: 'Gig deleted successfully', type: 'success' })
        if (user) fetchAll(user.userId)
      } else {
        const d = await res.json()
        setToast({ msg: d.error || 'Failed to delete gig', type: 'error' })
      }
    } catch {
      setToast({ msg: 'Network error. Please try again.', type: 'error' })
    } finally {
      setDeleteLoading(false)
      setDeleteConfirm(null)
    }
  }

  if (authLoading) return null

  const totalEarnings = orders.filter(o => o.status === 'COMPLETED').reduce((s, o) => s + o.price, 0)
  const activeProjects = orders.filter(o => 
    !['COMPLETED','CANCELLED','PENDING_PAYMENT','PAYMENT_VERIFICATION'].includes(o.status) 
    && o.gig.status !== 'ARCHIVED'
  )

  return (
    <div className="aurora-page min-h-screen">
      <Navbar />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}

      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-24 md:pt-28 pb-12 md:pb-20">
        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}>
            <p className="text-[11px] uppercase tracking-[2.5px] text-[var(--muted)] font-semibold mb-2">Seller Workspace</p>
            <h1 className="font-display text-display text-[var(--ink)]">
              Hello, {user?.name || user?.email?.split('@')[0]}.
            </h1>
          </motion.div>
          <div className="flex gap-3">
            <button onClick={() => user && fetchAll(user.userId)} className="w-9 h-9 rounded-full border border-[var(--line-strong)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] transition-all">
              <RefreshCw size={14} className={dataLoading ? 'animate-spin' : ''}/>
            </button>
            <Link href="/dashboard/seller/create-gig">
              <Button size="md"><Plus size={13}/> Create Gig</Button>
            </Link>
          </div>
        </div>

        {/* Floating metrics — no boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-14 pb-14 border-b border-[var(--line)]">
          {[
            { num: `₹${(totalEarnings * 0.9).toLocaleString()}`, label: 'Net Earnings', icon: <TrendingUp size={14}/> },
            { num: activeProjects.length, label: 'Active Projects', icon: <Package size={14}/> },
            { num: gigs.filter(g=>g.status==='PUBLISHED').length, label: 'Live Gigs', icon: <Eye size={14}/> },
            { num: `${gigs.reduce((s,g)=>s+(g.rating??0),0) > 0 ? (gigs.reduce((s,g)=>s+(g.rating??0),0)/gigs.filter(g=>g.rating&&g.rating>0).length).toFixed(1) : '—'} ★`, label: 'Avg Rating', icon: <CheckCircle size={14}/> },
          ].map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16,1,0.3,1] }}>
              <div className="font-display text-[42px] text-[var(--ink)] leading-none mb-2">{m.num}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] font-medium uppercase tracking-[1.5px]">
                {m.icon} {m.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pill tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'orders',  label: `Active Orders (${activeProjects.length})` },
            { key: 'history', label: 'History' },
            { key: 'gigs',    label: `My Gigs (${gigs.length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as 'orders' | 'gigs' | 'history')}
              className={`px-5 py-2.5 rounded-full text-[12px] font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-[var(--ink)] text-[var(--bg)] shadow-[0_2px_12px_rgba(15,23,42,0.20)]'
                  : 'bg-transparent text-[var(--muted)] border border-[var(--line-strong)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
              }`}
            >{tab.label}</button>
          ))}
        </div>

        {dataLoading ? (
          <div className="text-center py-20">
            <RefreshCw size={24} className="mx-auto animate-spin text-[var(--grey-light)]"/>
          </div>
        ) : (
          <>
            {activeTab === 'orders' && (
              <div className="space-y-4 animate-slide-up">
                {activeProjects.length === 0 ? (
                  <div className="bento-card flex flex-col items-center py-24 text-center">
                    <div className="font-display text-[64px] text-[var(--line-strong)] leading-none mb-4 select-none">∅</div>
                    <p className="font-display-medium text-[18px] text-[var(--muted)]">No active orders yet.</p>
                    <p className="text-[13px] text-[var(--muted-light)] mt-2 font-light">Gigs go live after admin approval.</p>
                  </div>
                ) : activeProjects.map(order => (
                  <div key={order.id} className="bento-card overflow-hidden hover:-translate-y-0.5 transition-all">
                    <div className="h-[3px] bg-blue-400"/>
                    <div className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                        <div>
                          <h3 className="text-[15px] font-medium text-[var(--charcoal)] font-[Jost] mb-1">{order.gig.title}</h3>
                          <p className="text-[12px] text-[var(--grey)] font-[Jost] font-light">
                            {order.package} · Buyer: {order.buyer.name} · ₹{order.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-[2px] text-[var(--grey-light)] font-[Jost]">Deadline</p>
                          <p className="text-[13px] font-medium text-[var(--charcoal)] font-[Jost]">
                            {order.deadline ? new Date(order.deadline).toLocaleDateString('en-IN') : 'TBD'}
                          </p>
                          <p className="font-display text-xl font-light text-[var(--forest)] mt-1">
                            ₹{Math.round(order.price * 0.9).toLocaleString()}
                            <span className="text-[10px] text-[var(--grey-light)] ml-1 font-[Jost]">net</span>
                          </p>
                        </div>
                      </div>

                      {order.requirements && (
                        <div className="mb-5">
                           <p className="text-[9px] uppercase tracking-[2px] text-[var(--grey-light)] font-[Jost] font-medium mb-2">Requirements</p>
                           <div className="p-4 bg-[var(--paper-dark)] border-[0.5px] border-[var(--line)] text-[12px] text-[var(--charcoal)] font-[Jost] font-light whitespace-pre-wrap">
                             {order.requirements}
                           </div>
                        </div>
                      )}

                      {order.status === 'REQUIREMENTS_PENDING' && (
                        <div className="p-4 bg-[var(--paper-dark)] border-[0.5px] border-[var(--line)] mb-5 text-[12px] text-[var(--grey)] font-[Jost] font-light">
                          ⏳ Waiting for buyer to submit project requirements.
                        </div>
                      )}

                      {!['REQUIREMENTS_PENDING'].includes(order.status) && (
                        <div className="mb-5"><OrderProgress status={order.status}/></div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--line)]">
                        {order.status === 'IN_PROGRESS' && (
                          <Button size="sm" onClick={() => setDeliverModal(order.id)}>
                            <Upload size={12}/> Deliver Work
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => {
                          window.location.href = `mailto:${order.buyer.email}?subject=${encodeURIComponent(`Order Update: ${order.gig.title}`)}`
                        }}>Message Buyer</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4 animate-slide-up">
                {orders.filter(o => ['COMPLETED','CANCELLED','DELIVERED'].includes(o.status)).length === 0 ? (
                  <div className="text-center py-20 border-[0.5px] border-dashed border-[var(--line)]">
                    <p className="font-[Jost] text-[13px] text-[var(--grey-light)]">No completed orders yet.</p>
                  </div>
                ) : orders.filter(o => ['COMPLETED','CANCELLED','DELIVERED'].includes(o.status)).map(order => (
                  <div key={order.id} className="border-[0.5px] border-[var(--line)] bg-[var(--paper)] p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <Badge variant={order.status === 'COMPLETED' ? 'grey' : 'danger'} size="sm">{order.status}</Badge>
                           <span className="text-[10px] text-[var(--grey-light)] font-[Jost]">Order #CO-{order.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <h3 className="text-[14px] font-medium text-[var(--charcoal)] font-[Jost] mb-1">{order.gig.title}</h3>
                        <p className="text-[11px] text-[var(--grey)] font-[Jost]">Buyer: {order.buyer.name} · Completed on {new Date(order.updatedAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-light text-[var(--forest)]">₹{Math.round(order.price * 0.9).toLocaleString()}</p>
                        <p className="text-[9px] uppercase tracking-[1px] text-[var(--grey-light)] font-[Jost]">Earned</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gigs' && (
              <div className="space-y-4 animate-slide-up">
                {gigs.length === 0 ? (
                   <div className="bento-card flex flex-col items-center py-24 text-center">
                    <div className="font-display text-[64px] text-[var(--line-strong)] leading-none mb-4 select-none">∅</div>
                    <p className="font-display-medium text-[18px] text-[var(--muted)]">No gigs created yet.</p>
                  </div>
                ) : gigs.map(gig => {
                  const badge = GIG_STATUS_BADGE[gig.status]
                  return (
                    <div key={gig.id} className="bento-card hover:-translate-y-0.5 transition-all p-5 flex items-center gap-5">
                      <div className="w-14 h-14 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-20"><path d="M12 2L22 7v10L12 22 2 17V7z" stroke="#1B3D2F" strokeWidth="1"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {badge && <Badge variant={badge.variant} size="sm">{badge.label}</Badge>}
                          <Badge variant="grey" size="sm">{gig.category}</Badge>
                        </div>
                        <h3 className="text-[14px] font-medium text-[var(--charcoal)] font-[Jost] truncate">{gig.title}</h3>
                        <p className="text-[11px] text-[var(--grey)] mt-1 font-[Jost]">
                          From ₹{gig.basicPrice.toLocaleString()} · {gig.totalOrders ?? 0} orders · {(gig.rating ?? 0) > 0 ? `${gig.rating}★` : 'No reviews yet'}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Link href={`/gig/${generateGigSlug(gig.title, gig.id)}`}><Button variant="ghost" size="sm"><Eye size={12}/></Button></Link>
                        <Link href={`/dashboard/seller/edit-gig/${gig.id}`}><Button variant="ghost" size="sm"><Edit2 size={12}/></Button></Link>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(gig.id)} className="text-[var(--danger)] hover:bg-[var(--danger)]/10">
                          <Trash2 size={12}/>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Deliver Work Modal */}
      <Modal isOpen={!!deliverModal} onClose={() => setDeliverModal(null)} title="Deliver Your Work" size="md">
        <DeliverForm onSubmit={(url) => { 
          if (deliverModal) handleDeliver(deliverModal, url)
          setDeliverModal(null) 
        }}/>
      </Modal>

      <ConfirmDialog 
        isOpen={!!deleteConfirm}
        title="Delete Gig?"
        message="Are you sure you want to delete this gig? This action cannot be undone."
        confirmLabel="Delete Forever"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteGig}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}

function DeliverForm({ onSubmit }: { onSubmit: (url: string) => void }) {
  const [file, setFile]       = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Mock upload
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    onSubmit(file ? `https://storage.co.in/deliveries/${file.name}` : 'https://storage.co.in/deliveries/project.zip')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-[9px] uppercase tracking-[2.5px] text-[var(--grey-light)] mb-2 font-[Jost] font-medium">Delivery Message</label>
        <textarea rows={3} required className="input-underline resize-none"
          placeholder="Describe what you've delivered, how to run the code..."
          value={message} onChange={e => setMessage(e.target.value)}/>
      </div>
      <div>
        <label className="block text-[9px] uppercase tracking-[2.5px] text-[var(--grey-light)] mb-2 font-[Jost] font-medium">Attach Delivery File *</label>
        <label className="block border-[0.5px] border-dashed border-[var(--grey-light)] p-6 text-center cursor-pointer hover:border-[var(--forest)] transition-colors">
          <input type="file" className="hidden" required accept=".zip,.pdf,.py,.js,.ts" onChange={e => setFile(e.target.files?.[0] ?? null)}/>
          {file ? (
            <div className="flex items-center justify-center gap-2 text-[var(--forest)]">
              <CheckCircle size={16}/><span className="text-[12px] font-[Jost]">{file.name}</span>
            </div>
          ) : (
            <>
              <Upload size={20} className="mx-auto mb-2 text-[var(--grey-light)]"/>
              <p className="text-[12px] text-[var(--grey)] font-[Jost]">Upload your delivery (ZIP recommended)</p>
              <p className="text-[10px] text-[var(--grey-light)] mt-1">Max 100MB</p>
            </>
          )}
        </label>
      </div>
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        <Upload size={13}/> Submit Delivery
      </Button>
    </form>
  )
}
