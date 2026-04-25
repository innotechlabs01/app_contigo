'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Eye, Clock, User, MapPin, Phone, Mail, FileText, Video, Award } from 'lucide-react';

interface Request {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  serviceType: 'Acompañamiento' | 'Cuidado' | 'Apoyo';
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  experience: string;
  message: string;
  evaluationScore?: number;
  cvFile?: string;
  presentationVideo?: string;
  referenceVideo?: string;
}

const MOCK_REQUESTS: Request[] = [
  {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+57 300 123 4567',
    location: 'Bogotá, Colombia',
    serviceType: 'Acompañamiento',
    status: 'pending',
    date: '2026-04-20',
    experience: '2 años en cuidado de adultos mayores',
    message: 'Me gustaría trabajar con Contigo porque valoro mucho el cuidado digno para los adultos mayores.',
    evaluationScore: 85,
    cvFile: 'maria_gonzalez_cv.pdf',
    presentationVideo: 'presentacion_maria.mp4',
    referenceVideo: 'referencia_maria.mp4',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+57 310 987 6543',
    location: 'Medellín, Colombia',
    serviceType: 'Cuidado',
    status: 'pending',
    date: '2026-04-21',
    experience: '3 años en enfermería domiciliaria',
    message: 'Soy enfermero con experiencia en el cuidado de personas mayores con movilidad reducida.',
    evaluationScore: 92,
    cvFile: 'carlos_rodriguez_cv.pdf',
    presentationVideo: 'presentacion_carlos.mp4',
    referenceVideo: 'referencia_carlos.mp4',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    phone: '+57 320 456 7890',
    location: 'Cali, Colombia',
    serviceType: 'Apoyo',
    status: 'approved',
    date: '2026-04-18',
    experience: '1 año en servicios de apoyo doméstico',
    message: 'Busco una plataforma seria y profesional para ofrecer mis servicios.',
    evaluationScore: 78,
    cvFile: 'ana_martinez_cv.pdf',
    presentationVideo: 'presentacion_ana.mp4',
    referenceVideo: 'referencia_ana.mp4',
  },
  {
    id: '4',
    name: 'José Hernández',
    email: 'jose.hernandez@email.com',
    phone: '+57 315 321 6549',
    location: 'Barranquilla, Colombia',
    serviceType: 'Acompañamiento',
    status: 'rejected',
    date: '2026-04-15',
    experience: 'Sin experiencia previa',
    message: 'Me gustaría aprender y crecer con la empresa.',
    evaluationScore: 65,
    cvFile: 'jose_hernandez_cv.pdf',
    presentationVideo: 'presentacion_jose.mp4',
    referenceVideo: '',
  },
  {
    id: '5',
    name: 'Laura Gómez',
    email: 'laura.gomez@email.com',
    phone: '+57 350 789 1234',
    location: 'Bogotá, Colombia',
    serviceType: 'Cuidado',
    status: 'pending',
    date: '2026-04-22',
    experience: '5 años en clínicas de adultos mayores',
    message: 'Cuento con certificaciones en primeros auxilios y cuidado geriátrico.',
    evaluationScore: 88,
    cvFile: 'laura_gomez_cv.pdf',
    presentationVideo: 'presentacion_laura.mp4',
    referenceVideo: 'referencia_laura.mp4',
  },
];

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter((r) => r.status === statusFilter);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r))
    );
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r))
    );
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: Request['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Pendiente</span>;
      case 'approved':
        return <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Aprobada</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full flex items-center gap-1"><X className="w-3 h-3" /> Rechazada</span>;
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Solicitudes</h1>
        <p className="text-slate-600 mt-1">Gestiona las solicitudes de registro</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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
      <div className="flex gap-2 mb-6">
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
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white p-6 rounded-2xl shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-800">{request.name}</h3>
                  {getStatusBadge(request.status)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-500">
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
                    {request.serviceType}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Solicitado el {request.date}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRequest(request)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {request.status === 'pending' && (
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
                )}
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
              <h2 className="text-xl font-bold text-slate-800">{selectedRequest.name}</h2>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Evaluation Score */}
            {selectedRequest.evaluationScore !== undefined && (
              <div className={`mb-4 p-4 rounded-xl ${
                selectedRequest.evaluationScore >= 80 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">Calificación de Evaluación</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-bold ${
                    selectedRequest.evaluationScore >= 80 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedRequest.evaluationScore}%
                  </span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    selectedRequest.evaluationScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedRequest.evaluationScore >= 80 ? 'Aprobado' : 'No aprobado'}
                  </span>
                </div>
              </div>
            )}

            {/* Documentation */}
            <div className="space-y-3 text-sm mb-4">
              <p><strong>Email:</strong> {selectedRequest.email}</p>
              <p><strong>Teléfono:</strong> {selectedRequest.phone}</p>
              <p><strong>Ubicación:</strong> {selectedRequest.location}</p>
              <p><strong>Servicio:</strong> {selectedRequest.serviceType}</p>
              <p><strong>Experiencia:</strong> {selectedRequest.experience}</p>
              <p><strong>Mensaje:</strong> {selectedRequest.message}</p>
              <p><strong>Fecha:</strong> {selectedRequest.date}</p>
              <p><strong>Estado:</strong> {getStatusBadge(selectedRequest.status)}</p>
            </div>

            {/* Documents */}
            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold mb-3">Documentos Adjuntos</h3>
              <div className="space-y-2">
                {selectedRequest.cvFile && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{selectedRequest.cvFile}</span>
                    <a href="#" className="ml-auto text-primary text-sm hover:underline">Ver</a>
                  </div>
                )}
                {selectedRequest.presentationVideo && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">{selectedRequest.presentationVideo}</span>
                    <a href="#" className="ml-auto text-primary text-sm hover:underline">Ver</a>
                  </div>
                )}
                {selectedRequest.referenceVideo && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">{selectedRequest.referenceVideo}</span>
                    <a href="#" className="ml-auto text-primary text-sm hover:underline">Ver</a>
                  </div>
                )}
              </div>
            </div>

            {selectedRequest.status === 'pending' && (
              <div className="flex gap-3">
                <Button onClick={() => handleApprove(selectedRequest.id)} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-2" /> Aprobar
                </Button>
                <Button onClick={() => handleReject(selectedRequest.id)} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                  <X className="w-4 h-4 mr-2" /> Rechazar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
