import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Server, MapPin, Clock } from 'lucide-react';
import { api } from '../../lib/api';

interface BookHardwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (lab: string, quota: string, hours: number) => void;
}

const LABS = [
  'Advanced Computing Lab 4',
  'Robotics Bay // Bench 03',
  'Ascent Tech Suite A',
  'Embedded Systems Node',
  'Quantum Simulation Cluster',
];

const EQUIPMENTS = [
  'GPU Cluster (NVIDIA RTX 4090)',
  'Jetson Orin Nano + LiDAR Scanner',
  'FPGA Development Board Rack',
  'General Workstation Access',
];

export const BookHardwareModal: React.FC<BookHardwareModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [lab, setLab] = useState(LABS[0]);
  const [equipment, setEquipment] = useState(EQUIPMENTS[0]);
  const [hours, setHours] = useState<number>(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await api.hardware.requestPass({
        assigned_lab: lab,
        active_quota: equipment,
        allocated_hours: hours,
      });
      onSuccess(lab, equipment, hours);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to request hardware pass. Ensure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#0A0A0A] border border-[#26282A] rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#26282A]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#26282A] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#D4A373]" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-white">Book Lab Pass</h3>
                <p className="text-xs text-[#8E9296]">Request workstation or hardware access</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#1A1C1E] text-[#8E9296] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Lab Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#D1D5DB]">
                <MapPin className="w-4 h-4 text-[#8E9296]" />
                Select Lab Location
              </label>
              <select
                value={lab}
                onChange={(e) => setLab(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#26282A] text-white focus:outline-none focus:border-[#D4A373] transition-colors"
              >
                {LABS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Equipment/Quota */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#D1D5DB]">
                <Server className="w-4 h-4 text-[#8E9296]" />
                Equipment / Resource Quota
              </label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#26282A] text-white focus:outline-none focus:border-[#D4A373] transition-colors"
              >
                {EQUIPMENTS.map((eq) => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#D1D5DB]">
                <Clock className="w-4 h-4 text-[#8E9296]" />
                Allocated Hours Requested
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#26282A] text-white focus:outline-none focus:border-[#D4A373] transition-colors"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-sm font-subheading text-[#8E9296] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-[#D4A373] hover:bg-[#C29262] text-black font-subheading font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? 'Requesting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
