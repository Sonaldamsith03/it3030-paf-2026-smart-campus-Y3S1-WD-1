import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, CheckCircle2, AlertCircle, MapPin, Tag, MessageSquare, Phone, User, Mail, GraduationCap } from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { ticketService } from './ticketService';
import { TicketCategory, TicketPriority } from './ticket';
import { cn } from '../../lib/utils';

export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string; time: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    faculty: '',
    title: '',
    description: '',
    category: 'OTHER' as TicketCategory,
    priority: 'MEDIUM' as TicketPriority,
    location: '',
    contactDetails: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      if (images.length + files.length > 3) {
        setError('Maximum 3 images allowed.');
        return;
      }

      const validFiles = files.filter(f => f.type === 'image/jpeg' || f.type === 'image/png');
      if (validFiles.length !== files.length) {
        setError('Only JPG and PNG files are allowed.');
        return;
      }

      setImages([...images, ...validFiles]);
      const newPreviews = validFiles.map(f => URL.createObjectURL(f));
      setPreviews([...previews, ...newPreviews]);
      setError(null);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Process images to attachments
      const processedAttachments = await Promise.all(
        images.map(async (file, index) => ({
          id: `att-${Date.now()}-${index}`,
          url: await fileToBase64(file),
          fileName: file.name
        }))
      );

      const newTicket = await ticketService.createTicket({
        ...formData,
        createdBy: user?.id,
        createdByName: formData.name,
        attachments: processedAttachments,
      });
      setSuccessData({
        id: newTicket.id,
        time: new Date().toLocaleString()
      });
      setTimeout(() => navigate('/tickets'), 5000);
    } catch (err) {
      setError('Failed to create ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-12">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-emerald-500 blur-[60px] opacity-20 animate-pulse" />
          <div className="w-28 h-28 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-glow shadow-emerald-500/40 animate-bounce">
            <CheckCircle2 size={56} className="text-slate-950" />
          </div>
        </div>
        
        <h2 className="text-5xl font-black tracking-tighter mb-8 text-white uppercase">Issue Dispatched</h2>
        
        <div className="premium-glass rounded-[3.5rem] p-10 max-w-lg w-full mb-12 space-y-6 border border-white/5">
          <div className="flex justify-between items-center border-b border-white/5 pb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic serif-italic">Nexus Identifier</span>
            <span className="text-sm font-black text-accent tracking-widest">{successData.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic serif-italic">Temporal Stamp</span>
            <span className="text-sm font-black text-white/60 tracking-tight">{successData.time}</span>
          </div>
        </div>

        <p className="text-2xl serif-italic text-white/30 max-w-2xl mx-auto leading-relaxed lowercase">
          Your diagnostic report has been queued for neural audit. Our engineering cohorts will initialize resolution protocols imminently.
        </p>
        
        <div className="mt-16 flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">
            Redirecting to Intelligence Vault...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-16">
      <div className="flex items-center gap-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-16 h-16 premium-glass rounded-2xl flex items-center justify-center text-white/20 hover:text-accent border border-white/5 transition-all duration-500 hover:rotate-[-10deg]"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-white uppercase">Raise Neural Ticket</h1>
          <p className="text-xl serif-italic text-white/30 lowercase">Report a campus issue or maintenance request for administrative audit.</p>
        </div>
      </div>

      <div className="premium-glass rounded-[4rem] p-16 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-32 -top-32 w-80 h-80 bg-accent/10 rounded-full blur-[120px]" />
        
        {error && (
          <div className="mb-12 p-8 bg-red-400/10 border border-red-400/20 text-red-400 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 shadow-glow shadow-red-400/5">
            <AlertCircle size={20} />
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic serif-italic">Entity Identifier</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="text"
                  required
                  readOnly={!!user?.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={cn(
                    "premium-input w-full pl-16 py-4.5",
                    user?.name && "opacity-40 cursor-not-allowed"
                  )}
                  placeholder="Operational Name"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic serif-italic">Communication Uplink</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="email"
                  required
                  readOnly={!!user?.email}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={cn(
                    "premium-input w-full pl-16 py-4.5",
                    user?.email && "opacity-40 cursor-not-allowed"
                  )}
                  placeholder="nexus.node@sliit.lk"
                />
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic serif-italic">Affiliated Core</label>
              <div className="relative group">
                <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <select
                  required
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  className="premium-input w-full pl-16 py-4.5 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Core Faculty</option>
                  <option value="Computing">Computing</option>
                  <option value="Business">Business</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Humanities">Humanities & Sciences</option>
                  <option value="Graduate">Graduate Studies</option>
                  <option value="Other">External Node</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic serif-italic">Issue Narrative Summary</label>
              <div className="relative group">
                <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="premium-input w-full pl-16 py-4.5"
                  placeholder="Diagnostic Title"
                />
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic serif-italic">Temporal Coordinates</label>
              <div className="relative group">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="premium-input w-full pl-16 py-4.5"
                  placeholder="Terminal / Lab Identifier"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic serif-italic">Node Classification</label>
              <div className="relative group">
                <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
                  className="premium-input w-full pl-16 py-4.5 appearance-none cursor-pointer"
                >
                  <option value="FACILITY">Infrastructure / Maintenance</option>
                  <option value="IT">Neural / Network</option>
                  <option value="ACADEMIC">Clinical Support</option>
                  <option value="SECURITY">Defensive Protocol</option>
                  <option value="OTHER">Miscellaneous Delta</option>
                </select>
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic serif-italic">Urgency Scalar</label>
              <div className="relative group">
                <AlertCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={20} />
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                  className="premium-input w-full pl-16 py-4.5 appearance-none cursor-pointer"
                >
                  <option value="LOW">Low Latency</option>
                  <option value="MEDIUM">Standard Sync</option>
                  <option value="HIGH">Mission Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic serif-italic">Shadow Contact (Optional)</label>
              <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input
                  type="text"
                  value={formData.contactDetails}
                  onChange={(e) => setFormData({ ...formData, contactDetails: e.target.value })}
                  className="premium-input w-full pl-16 py-4.5"
                  placeholder="Direct Pulse / Protocol"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic serif-italic">Detailed Diagnostic Narrative</label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="premium-input w-full px-8 py-6 resize-none h-[180px]"
              placeholder="Provide a comprehensive breakdown of the system anomaly..."
            />
          </div>


          <div className="space-y-6">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic serif-italic">Visual Data Evidence (Max 3)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {previews.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl">
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all duration-500" />
                  <img src={url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Preview" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-slate-950 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-glow shadow-red-500/20"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className="aspect-square rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 hover:border-amber-500/30 transition-all duration-500 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-all duration-700" />
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-amber-500 transition-all border border-white/10">
                    <Upload size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white transition-colors relative z-10">Upload Telemetry</span>
                  <input type="file" className="hidden" accept="image/jpeg,image/png" multiple onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>


          <div className="pt-10 flex gap-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 h-18 premium-button-ghost"
            >
              Cancel Sync
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] h-18 premium-button-primary"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>Dispatch Neural Ticket</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

