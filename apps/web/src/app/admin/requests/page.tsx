'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Eye, Clock, User, MapPin, Phone, Mail, FileText, Video, Award } from 'lucide-react';

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
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await fetch(`/api/requests${params}`);
      const data = await res.json();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
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

  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  const getStatusBadge = (status: Request['status']) => {
    switch (status) {
      case 'pending':
      case 'in_review':
        return <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> {status === 'pending' ? 'Pendiente' : 'En Revisión'}</span>;
      case 'approved':
        return <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Aprobada</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full flex items-center gap-1"><X className="w-3 h-3" /> Rechazada</span>;
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending' || r.status === 'in_review').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Solicitudes</h1>
        <p className="text-slate-600 mt-1">Gestiona las solicitudes de registro</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-slate-100 text-slate-700' },
          { label: 'Pendientes', value: stats.pending, color: 'bg-yellow-100 text-yellow-700' },
          { label: 'Aprobadas', value: stats.approved, color: 'bg-green-100 text-green-700' },
          { label: 'Rechazadas', value: stats.rejected, color: 'bg-red-100 text-red-700' },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-2xl ${stat.color}`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              statusFilter === filter
                ? 'bg-primary text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filter === 'all' ? 'Todas' : filter === 'pending' ? 'Pendientes' : filter === 'approved' ? 'Aprobadas' : 'Rechazadas'}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="grid gap-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-soft">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-slate-800">{request.first_name} {request.last_name}</h3>
                  {getStatusBadge(request.status)}
                  {request.evaluation_score !== undefined && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.evaluation_score >= 80 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      Score: {request.evaluation_score}%
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {request.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {request.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {request.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {request.service_type}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Solicitado el {request.application_date}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRequest(request)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {request.status === 'pending' || request.status === 'in_review' ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedRequest(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-slate-800">{selectedRequest.first_name} {selectedRequest.last_name}</h2>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Evaluation Score */}
            {selectedRequest.evaluation_score !== undefined && (
              <div className={`mb-4 p-4 rounded-xl ${
                selectedRequest.evaluation_score >= 80 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">Calificación de Evaluación</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-bold ${
                    selectedRequest.evaluation_score >= 80 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedRequest.evaluation_score}%
                  </span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    selectedRequest.evaluation_score >= 80 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedRequest.evaluation_score >= 80 ? 'Aprobado' : 'No aprobado'}
                  </span>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-3 text-sm mb-4">
              <p><strong>Email:</strong> {selectedRequest.email}</p>
              <p><strong>Teléfono:</strong> {selectedRequest.phone}</p>
              <p><strong>Ubicación:</strong> {selectedRequest.location}</p>
              <p><strong>Servicio:</strong> {selectedRequest.service_type}</p>
              <p><strong>Cédula:</strong> {selectedRequest.id_number}</p>
              <p><strong>Experiencia:</strong> {selectedRequest.experience}</p>
              <p><strong>Mensaje:</strong> {selectedRequest.message}</p>
              <p><strong>Fecha:</strong> {selectedRequest.application_date}</p>
              <p><strong>Estado:</strong> {getStatusBadge(selectedRequest.status)}</p>
            </div>

            {/* Documents */}
            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold mb-3">Documentos Adjuntos</h3>
              <div className="space-y-2">
                {selectedRequest.cv_url && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{selectedRequest.cv_file_name || 'CV'}</span>
                    <a href={selectedRequest.cv_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-primary text-sm hover:underline">Descargar</a>
                  </div>
                )}
                {selectedRequest.presentation_video_url && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">{selectedRequest.presentation_video_name || 'Presentación'}</span>
                    <a href={selectedRequest.presentation_video_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-primary text-sm hover:underline">Ver</a>
                  </div>
                )}
                {selectedRequest.reference_video_url && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">{selectedRequest.reference_video_name || 'Referencia'}</span>
                    <a href={selectedRequest.reference_video_url} target="_blank" rel="noopener noreferrer" className="ml-auto text-primary text-sm hover:underline">Ver</a>
                  </div>
                )}
              </div>
            </div>

            {selectedRequest.status === 'pending' || selectedRequest.status === 'in_review' ? (
              <div className="flex gap-3">
                <Button onClick={() => handleApprove(selectedRequest.id)} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-2" /> Aprobar
                </Button>
                <Button onClick={() => handleReject(selectedRequest.id)} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                  <X className="w-4 h-4 mr-2" /> Rechazar
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
