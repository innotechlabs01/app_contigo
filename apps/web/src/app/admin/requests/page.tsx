'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Check, X, Eye, Clock, User, MapPin, Phone, Mail,
  FileText, Video, Award, Search, XCircle, CheckCircle2,
  Users, AlertTriangle, ArrowUpRight, Calendar, ChevronRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface Request {
  id: string;
  first_name: string;
  last_name: string;
  id_number: string;
  email: string;
  phone: string;
  location: string;
  service_type: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  application_date: string;
  evaluation_score?: number;
  cv_file_name?: string;
  cv_url?: string;
  presentation_video_url?: string;
  presentation_video_name?: string;
  reference_video_url?: string;
  reference_video_name?: string;
  experience?: string;
  message?: string;
  rejection_reason?: string;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const statusConfig = {
  pending: { label: 'Pendiente', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400', icon: Clock },
  in_review: { label: 'En Revisión', bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400', icon: AlertTriangle },
  approved: { label: 'Aprobada', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400', icon: CheckCircle2 },
  rejected: { label: 'Rechazada', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400', icon: XCircle },
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await fetch(`/api/requests${params}`);
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectingId || !rejectReason.trim()) return;
    try {
      await fetch(`/api/requests/${rejectingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejection_reason: rejectReason.trim() })
      });
      fetchRequests();
      setSelectedRequest(null);
      setShowRejectModal(false);
      setRejectingId(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending' || r.status === 'in_review').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  const filteredRequests = requests.filter((r) => {
    const fullName = `${r.first_name} ${r.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || r.email.toLowerCase().includes(query) || r.id_number.includes(query);
  });

  const statCards = [
    { label: 'Total', value: stats.total, icon: Users, gradient: 'from-[#00668A] to-[#87CEEB]', shadow: 'shadow-[#00668A]/20', bg: 'bg-[#00668A]/5', textColor: 'text-[#00668A]' },
    { label: 'Pendientes', value: stats.pending, icon: Clock, gradient: 'from-amber-500 to-orange-400', shadow: 'shadow-amber-500/20', bg: 'bg-amber-50', textColor: 'text-amber-600' },
    { label: 'Aprobadas', value: stats.approved, icon: CheckCircle2, gradient: 'from-emerald-500 to-green-400', shadow: 'shadow-emerald-500/20', bg: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { label: 'Rechazadas', value: stats.rejected, icon: XCircle, gradient: 'from-red-500 to-rose-400', shadow: 'shadow-red-500/20', bg: 'bg-red-50', textColor: 'text-red-600' },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Solicitudes</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona las solicitudes de registro</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o cédula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-[#00668A] focus:outline-none text-sm bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === filter
                  ? 'bg-[#00668A] text-white shadow-lg shadow-[#00668A]/20'
                  : 'bg-white text-slate-500 hover:text-[#00668A] border border-slate-200'
              }`}
            >
              {filter === 'all' ? 'Todas' : filter === 'pending' ? 'Pendientes' : filter === 'approved' ? 'Aprobadas' : 'Rechazadas'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Empty / List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-[#00668A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center">
            <Users className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium mb-1">
            {searchQuery ? 'Sin resultados' : 'No hay solicitudes'}
          </p>
          <p className="text-sm text-slate-400">
            {searchQuery ? 'Intenta con otra búsqueda' : 'Las solicitudes aparecerán aquí cuando los usuarios se registren'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredRequests.map((request) => {
            const status = statusConfig[request.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={request.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-all duration-200 group cursor-pointer"
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#00668A] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {request.first_name[0]}{request.last_name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-medium text-slate-800 truncate">
                          {request.first_name} {request.last_name}
                        </h3>
                        <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        {request.evaluation_score !== undefined && (
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            request.evaluation_score >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            Score: {request.evaluation_score}%
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {request.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {request.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {request.application_date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#00668A] transition-colors shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Panel */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onClick={() => setSelectedRequest(null)}>
          <div
            className="w-full max-w-lg bg-white h-full overflow-y-auto translate-x-0 transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 z-10">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#00668A] flex items-center justify-center text-white font-bold text-sm">
                    {selectedRequest.first_name[0]}{selectedRequest.last_name[0]}
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {selectedRequest.first_name} {selectedRequest.last_name}
                    </h2>
                    <p className="text-xs text-slate-400">Detalle de solicitud</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Status + Score */}
              <div className="flex items-center gap-3">
                {(() => {
                  const st = statusConfig[selectedRequest.status];
                  const Si = st.icon;
                  return (
                    <span className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${st.bg} ${st.text}`}>
                      <Si className="w-4 h-4" />
                      {st.label}
                    </span>
                  );
                })()}
                {selectedRequest.evaluation_score !== undefined && (
                  <span className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${
                    selectedRequest.evaluation_score >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <Award className="w-4 h-4" />
                    Score: {selectedRequest.evaluation_score}%
                  </span>
                )}
              </div>

              {/* Evaluation Score Detail */}
              {selectedRequest.evaluation_score !== undefined && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-[#00668A]" />
                    <span className="font-medium text-sm text-slate-700">Evaluación</span>
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-3xl font-bold text-slate-800">{selectedRequest.evaluation_score}%</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      selectedRequest.evaluation_score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedRequest.evaluation_score >= 80 ? 'Aprobado' : 'No aprobado'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selectedRequest.evaluation_score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-rose-500'
                      }`}
                      style={{ width: `${selectedRequest.evaluation_score}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Información Personal</h3>
                <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50">
                  {[
                    { icon: Mail, label: 'Email', value: selectedRequest.email, href: `mailto:${selectedRequest.email}` },
                    { icon: Phone, label: 'Teléfono', value: selectedRequest.phone, href: `tel:${selectedRequest.phone}` },
                    { icon: MapPin, label: 'Ubicación', value: selectedRequest.location },
                    { icon: User, label: 'Servicio', value: (() => { try { return JSON.parse(selectedRequest.service_type); } catch { return [selectedRequest.service_type]; } })() },
                    { icon: User, label: 'Cédula', value: selectedRequest.id_number },
                    { icon: Calendar, label: 'Fecha', value: selectedRequest.application_date },
                  ].map((item, i) => {
                    const ItemIcon = item.icon;
                    const isServiceArray = item.label === 'Servicio' && Array.isArray(item.value);
                    return (
                      <div key={i} className="flex items-center gap-3 px-4 py-3">
                        <div className="p-1.5 rounded-lg bg-slate-50">
                          <ItemIcon className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">{item.label}</p>
                          {isServiceArray ? (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {(item.value as string[]).map((s) => (
                                <span key={s} className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#00668A]/10 text-[#00668A]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          ) : item.href ? (
                            <a href={item.href} className="text-sm text-slate-700 hover:text-[#00668A] truncate block font-medium">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm text-slate-700 truncate font-medium">{String(item.value)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Experience & Message */}
              {(selectedRequest.experience || selectedRequest.message) && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Información Adicional</h3>
                  <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50">
                    {selectedRequest.experience && (
                      <div className="px-4 py-3">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Experiencia</p>
                        <p className="text-sm text-slate-600">{selectedRequest.experience}</p>
                      </div>
                    )}
                    {selectedRequest.message && (
                      <div className="px-4 py-3">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Mensaje</p>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{selectedRequest.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documents */}
              {(selectedRequest.cv_url || selectedRequest.presentation_video_url || selectedRequest.reference_video_url) && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Documentos Adjuntos</h3>
                  <div className="space-y-2">
                    {selectedRequest.cv_url && (
                      <a href={selectedRequest.cv_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-blue-100">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="flex-1 text-sm text-slate-700 group-hover:text-[#00668A] transition-colors">
                          {selectedRequest.cv_file_name || 'CV'}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#00668A] transition-colors" />
                      </a>
                    )}
                    {selectedRequest.presentation_video_url && (
                      <a href={selectedRequest.presentation_video_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-purple-100">
                          <Video className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="flex-1 text-sm text-slate-700 group-hover:text-[#00668A] transition-colors">
                          {selectedRequest.presentation_video_name || 'Video de Presentación'}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#00668A] transition-colors" />
                      </a>
                    )}
                    {selectedRequest.reference_video_url && (
                      <a href={selectedRequest.reference_video_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-purple-100">
                          <Video className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="flex-1 text-sm text-slate-700 group-hover:text-[#00668A] transition-colors">
                          {selectedRequest.reference_video_name || 'Video de Referencia'}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#00668A] transition-colors" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === 'pending' || selectedRequest.status === 'in_review' ? (
                <div className="sticky bottom-0 bg-white pt-2 pb-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleReject(selectedRequest.id)}
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <X className="w-4 h-4 mr-2" /> Rechazar
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25"
                    >
                      <Check className="w-4 h-4 mr-2" /> Aprobar
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      <Dialog open={showRejectModal} onOpenChange={(open) => {
        if (!open) {
          setShowRejectModal(false);
          setRejectingId(null);
          setRejectReason('');
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Motivo de rechazo</DialogTitle>
            <DialogDescription>
              Describe el motivo por el cual se rechaza esta solicitud. Este motivo será visible para el usuario.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Describe el motivo del rechazo..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-400 focus:outline-none text-sm resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectingId(null);
                setRejectReason('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim()}
            >
              Confirmar rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
