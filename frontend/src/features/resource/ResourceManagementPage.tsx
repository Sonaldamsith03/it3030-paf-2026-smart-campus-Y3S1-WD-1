import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Package,
  MapPin,
  Users
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { resourceService, Resource, ResourceStatus } from './resourceService';
import { ConfirmModal } from '../../shared/components/ConfirmModal';

export const ResourceManagementPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ResourceStatus | 'ALL'>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentResource, setCurrentResource] = useState<Partial<Resource>>({
    name: '',
    type: 'LECTURE_HALL',
    faculty: 'Computing',
    building: 'Main Building',
    capacity: 0,
    location: '',
    status: 'ACTIVE',
    description: ''
  });

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const data = await resourceService.getResources();
      setResources(data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentResource({
      name: '',
      type: 'LECTURE_HALL',
      faculty: 'Computing',
      building: 'Main Building',
      capacity: 0,
      location: '',
      status: 'ACTIVE',
      description: ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (resource: Resource) => {
    setIsEditing(true);
    setCurrentResource(resource);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentResource(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentResource.id) {
        await resourceService.updateResource(currentResource.id, currentResource);
      } else {
        await resourceService.createResource(currentResource);
      }
      await fetchResources();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save resource:', error);
      alert('Error saving resource. Please try again.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setResourceToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (resourceToDelete) {
      try {
        await resourceService.deleteResource(resourceToDelete);
        await fetchResources();
      } catch (error) {
        console.error('Failed to delete resource:', error);
        alert('Error deleting resource.');
      } finally {
        setResourceToDelete(null);
      }
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesFilter = filter === 'ALL' || r.status === filter;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (r.id && r.id.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: ResourceStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-50 text-green-600 border-green-100';
      case 'OUT_OF_SERVICE': return 'bg-red-50 text-red-600 border-red-100';
      case 'MAINTENANCE': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-ink uppercase">Resource Nexus</h1>
          <p className="text-xl serif-italic text-ink/30 lowercase italic">Manage campus facilities, labs, and equipment inventory.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="h-16 px-10 bg-accent text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-glow shadow-accent/20 flex items-center gap-4 active:scale-95 transition-all duration-300"
        >
          <Plus size={20} /> Register Source
        </button>
      </div>


      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex flex-wrap items-center gap-4">
          {['ALL', 'ACTIVE', 'OUT_OF_SERVICE', 'MAINTENANCE'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={cn(
                "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 border",
                filter === s 
                  ? "bg-accent text-slate-950 border-accent shadow-glow shadow-accent/20" 
                  : "bg-ink/5 text-ink/30 border-[var(--border)] hover:border-accent hover:text-ink"
              )}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search Registry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 h-18 premium-input"
          />
        </div>
      </div>


      {/* Resources List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-ink/5 animate-pulse rounded-[3rem] border border-[var(--border)]" />
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="space-y-6">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id} 
                className="bg-card tactical-border p-8 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 justify-between group strat-shadow ring-1 ring-white/5 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-8 flex-1">
                  <div className="w-20 h-20 bg-ink/5 rounded-[2rem] flex items-center justify-center text-ink/10 group-hover:text-accent border border-[var(--border)] transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                    <Package size={32} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-2xl text-ink tracking-tight uppercase leading-none">{resource.name}</h3>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border italic serif-italic shadow-glow",
                        resource.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-emerald-500/10" :
                        resource.status === 'OUT_OF_SERVICE' ? "bg-red-500/10 text-red-600 border-red-500/20 shadow-red-500/10" :
                        resource.status === 'MAINTENANCE' ? "bg-orange-500/10 text-orange-600 border-orange-500/20 shadow-orange-500/10" :
                        "bg-ink/5 text-ink/30 border-white/10 shadow-transparent font-medium"
                      )}>
                        {resource.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-ink/20 uppercase tracking-[0.25em] italic serif-italic">
                      <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent/30" /> {resource.type?.replace('_', ' ')}</span>
                      <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent/30" /> {resource.faculty}</span>
                      <span className="flex items-center gap-2 font-black text-accent/60 tracking-[0.4em] font-mono">{resource.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12 text-center md:text-left border-x border-[var(--border)] px-12">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/10 italic serif-italic">Building</span>
                    <div className="flex items-center gap-3 text-ink/40 group-hover:text-ink transition-colors">
                      <MapPin size={18} className="text-accent/40" />
                      <span className="text-sm font-black tracking-tight uppercase leading-none">{resource.building}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/10 italic serif-italic">Load Factor</span>
                    <div className="flex items-center gap-3 text-ink/40 group-hover:text-ink transition-colors">
                      <Users size={18} className="text-accent/40" />
                      <span className="text-sm font-black tracking-tight uppercase leading-none">{resource.capacity} Pax</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-4">
                  <button 
                    onClick={() => handleOpenEditModal(resource)}
                    className="w-14 h-14 bg-ink/5 hover:bg-accent hover:text-slate-950 rounded-2xl transition-all duration-500 text-ink/20 border border-[var(--border)] flex items-center justify-center active:scale-95"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => resource.id && handleDeleteClick(resource.id)}
                    className="w-14 h-14 bg-ink/5 hover:bg-red-600 hover:text-white rounded-2xl transition-all duration-500 text-ink/20 border border-[var(--border)] flex items-center justify-center active:scale-95"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-32 bg-card tactical-border rounded-[4rem] text-center border border-dashed border-ink/10 strat-shadow">
            <div className="w-24 h-24 bg-ink/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-[var(--border)] shadow-2xl">
              <AlertCircle className="text-accent/20" size={48} />
            </div>
            <h3 className="text-4xl font-black text-ink mb-4 tracking-tighter uppercase">Null Search Exception</h3>
            <p className="text-ink/20 serif-italic text-lg lowercase font-medium">No resource nodes matched your query parameters.</p>
          </div>
        )}
      </div>


      {/* Resource Modal (Add/Edit) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
          <div className="bg-card rounded-[4rem] p-16 max-w-3xl w-full tactical-border strat-shadow my-8 relative overflow-hidden shadow-glow shadow-accent/5">
            <div className="absolute -right-24 -top-24 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
            <h2 className="text-5xl font-black tracking-tighter text-ink mb-2 uppercase relative z-10 leading-none">{isEditing ? 'Pulse Registry Update' : 'Initialize Nexus Source'}</h2>
            <p className="text-xl serif-italic text-ink/30 lowercase mb-12 relative z-10 italic">Establishing new parameters for the campus hub nexus.</p>
            
            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 ml-2 italic serif-italic">Nexus Identifier</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    value={currentResource.name}
                    onChange={handleInputChange}
                    className="w-full premium-input h-14" 
                    placeholder="e.g. Lab 404" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 ml-2 italic serif-italic">Nexus Node Class</label>
                  <div className="relative group">
                    <select 
                      name="type"
                      value={currentResource.type}
                      onChange={handleInputChange}
                      className="w-full premium-input h-14 appearance-none cursor-pointer"
                    >
                      <option value="LECTURE_HALL">LECTURE HALL</option>
                      <option value="LAB">LAB</option>
                      <option value="EQUIPMENT">EQUIPMENT</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 ml-2 italic serif-italic">Affiliated Faculty</label>
                  <div className="relative group">
                    <select 
                      name="faculty"
                      value={currentResource.faculty}
                      onChange={handleInputChange}
                      className="w-full premium-input h-14 appearance-none cursor-pointer"
                    >
                      <option value="Computing">Computing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Business">Business</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 ml-2 italic serif-italic">Deploy Building</label>
                  <div className="relative group">
                    <select 
                      name="building"
                      value={currentResource.building}
                      onChange={handleInputChange}
                      className="w-full premium-input h-14 appearance-none cursor-pointer"
                    >
                      <option value="Main Building">Main Building</option>
                      <option value="New Building">New Building</option>
                      <option value="Engineering Building">Engineering Building</option>
                      <option value="BM Building">BM Building</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 ml-2 italic serif-italic">Load Capacity</label>
                  <input 
                    name="capacity"
                    type="number" 
                    required
                    value={currentResource.capacity}
                    onChange={handleInputChange}
                    className="w-full premium-input h-14" 
                    placeholder="0" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 ml-2 italic serif-italic">Local Coordinates (Floor/Room)</label>
                  <input 
                    name="location"
                    type="text" 
                    required
                    value={currentResource.location}
                    onChange={handleInputChange}
                    className="w-full premium-input h-14" 
                    placeholder="e.g. 3rd Floor" 
                  />
                </div>
                {isEditing && (
                  <div className="space-y-3 col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 ml-2 italic serif-italic">Nexus Pulse State</label>
                    <div className="relative group">
                      <select 
                        name="status"
                        value={currentResource.status}
                        onChange={handleInputChange}
                        className="w-full premium-input h-14 appearance-none cursor-pointer"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="space-y-3 col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 ml-2 italic serif-italic">Source Narrative</label>
                  <textarea 
                    name="description"
                    value={currentResource.description}
                    onChange={handleInputChange}
                    className="w-full premium-input min-h-[140px] py-5 resize-none font-bold placeholder:font-normal" 
                    placeholder="Brief description of the resource..." 
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 pt-8">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)} 
                  className="flex-1 h-18 premium-button-ghost text-[10px]"
                >
                  Cancel Calibration
                </button>
                <button 
                  type="submit"
                  className="flex-[2] h-18 bg-accent text-slate-950 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-glow shadow-accent/20 active:scale-95"
                >
                  {isEditing ? 'Dispatch Update' : 'Establish Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Resource?"
        message="Are you sure you want to delete this campus resource? This will remove all associated booking data and cannot be undone."
      />
    </div>
  );
};
