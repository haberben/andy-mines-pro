import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, Save, Gift } from 'lucide-react';

interface ProfileModalProps {
  profile: any;
  onClose: () => void;
  onUpdate: (updates: any) => Promise<any>;
}

export const ProfileModal = ({ profile, onClose, onUpdate }: ProfileModalProps) => {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate({ full_name: fullName, address: address });
    setIsSaving(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-candy-primary to-candy-secondary rounded-full flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black italic tracking-tighter">USER PROFILE</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{profile?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name (Ad Soyad)</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:border-candy-primary transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping Address (Hediye Gönderimi İçin)</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3 w-4 h-4 text-gray-500" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:border-candy-primary transition-colors resize-none"
                placeholder="Your detailed address..."
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
             <button
              onClick={handleSave}
              disabled={isSaving}
              className="glass-button w-full flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
            <p className="text-[9px] text-center text-gray-500 italic">
               Physical rewards are sent based on monthly ranking. Ensure your address is correct.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
