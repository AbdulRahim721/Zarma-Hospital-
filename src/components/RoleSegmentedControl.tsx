import React from 'react';
import { motion } from 'motion/react';
import { User, Stethoscope, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface RoleSegmentedControlProps {
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  disabled?: boolean;
}

interface RoleOption {
  id: UserRole;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'Patient',
    label: 'Patient',
    icon: User,
    description: 'Personal health portal & appointments',
  },
  {
    id: 'Doctor',
    label: 'Doctor',
    icon: Stethoscope,
    description: 'Clinical charting & physician portal',
  },
  {
    id: 'Admin',
    label: 'Admin',
    icon: ShieldCheck,
    description: 'Staff directory & clinic administration',
  },
];

export const RoleSegmentedControl: React.FC<RoleSegmentedControlProps> = ({
  activeRole,
  onChangeRole,
  disabled = false,
}) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Select Portal Role
        </label>
        <span className="text-[11px] font-medium text-slate-400">
          {ROLES.find((r) => r.id === activeRole)?.description}
        </span>
      </div>

      {/* Segmented Control Container */}
      <div
        id="role-segmented-control"
        role="tablist"
        aria-label="User Role Selection"
        className="relative grid grid-cols-3 p-1.5 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-inner"
      >
        {ROLES.map((role) => {
          const isActive = activeRole === role.id;
          const Icon = role.icon;

          return (
            <button
              key={role.id}
              id={`tab-role-${role.id.toLowerCase()}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              disabled={disabled}
              onClick={() => onChangeRole(role.id)}
              className={`relative z-10 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a5f7a] focus-visible:ring-offset-2 select-none ${
                isActive
                  ? 'text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {/* Sliding active highlight background */}
              {isActive && (
                <motion.div
                  layoutId="roleActivePill"
                  className="absolute inset-0 rounded-lg bg-[#1a5f7a] shadow-md shadow-[#1a5f7a]/25"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              <span className="relative z-20 flex items-center gap-1.5 whitespace-nowrap">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{role.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
