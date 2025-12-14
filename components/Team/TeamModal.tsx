// components/Team/TeamModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/Tools/ThemeContext';
import { X, Plus, Mail, UserPlus, Trash2, Crown, Shield } from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
}

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId?: string;
}

export function TeamModal({ isOpen, onClose, boardId }: TeamModalProps) {
  const { theme } = useTheme();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      email: 'you@example.com',
      name: 'You',
      role: 'owner',
      status: 'active'
    }
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'team' | 'invite'>('team');

  const handleInvite = async () => {
    if (!inviteEmail) return;
    
    setLoading(true);
    try {
      // Send invite
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          boardId, 
          email: inviteEmail,
          role: inviteRole
        }),
      });
      
      if (response.ok) {
        const newMember: TeamMember = {
          id: Date.now().toString(),
          email: inviteEmail,
          name: inviteEmail.split('@')[0],
          role: inviteRole,
          status: 'pending'
        };
        setTeamMembers([...teamMembers, newMember]);
        setInviteEmail('');
        setActiveTab('team');
      }
    } catch (error) {
      console.error('Failed to invite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm('Remove this member?')) return;
    
    try {
      await fetch(`/api/team/members/${memberId}`, {
        method: 'DELETE',
      });
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'member') => {
    try {
      await fetch(`/api/team/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      setTeamMembers(teamMembers.map(m => 
        m.id === memberId ? { ...m, role: newRole } : m
      ));
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl rounded-2xl shadow-2xl z-50 overflow-hidden"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: theme.colors.border }}
        >
          <h2 
            className="text-2xl font-bold"
            style={{ color: theme.colors.text }}
          >
            Team Management
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ 
              backgroundColor: theme.colors.surfaceHover,
              color: theme.colors.text
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div 
          className="flex border-b"
          style={{ borderColor: theme.colors.border }}
        >
          <button
            onClick={() => setActiveTab('team')}
            className="flex-1 px-6 py-3 font-semibold transition-colors relative"
            style={{ 
              color: activeTab === 'team' ? theme.colors.primary : theme.colors.textSecondary
            }}
          >
            Team Members ({teamMembers.length})
            {activeTab === 'team' && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('invite')}
            className="flex-1 px-6 py-3 font-semibold transition-colors relative"
            style={{ 
              color: activeTab === 'invite' ? theme.colors.primary : theme.colors.textSecondary
            }}
          >
            Invite Members
            {activeTab === 'invite' && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: theme.colors.primary }}
              />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'team' ? (
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ backgroundColor: theme.colors.surfaceHover }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      {member.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div 
                        className="font-semibold"
                        style={{ color: theme.colors.text }}
                      >
                        {member.name}
                        {member.status === 'pending' && (
                          <span 
                            className="ml-2 text-xs px-2 py-0.5 rounded"
                            style={{ 
                              backgroundColor: theme.colors.primary + '20',
                              color: theme.colors.primary
                            }}
                          >
                            Pending
                          </span>
                        )}
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Role Badge */}
                    <div 
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold"
                      style={{ 
                        backgroundColor: member.role === 'owner' 
                          ? '#fbbf24' + '20'
                          : member.role === 'admin'
                          ? theme.colors.primary + '20'
                          : theme.colors.border,
                        color: member.role === 'owner'
                          ? '#f59e0b'
                          : member.role === 'admin'
                          ? theme.colors.primary
                          : theme.colors.textSecondary
                      }}
                    >
                      {member.role === 'owner' && <Crown size={14} />}
                      {member.role === 'admin' && <Shield size={14} />}
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </div>

                    {/* Role Change & Remove (only if not owner) */}
                    {member.role !== 'owner' && (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as 'admin' | 'member')}
                          className="px-3 py-1.5 rounded-lg text-sm outline-none"
                          style={{
                            backgroundColor: theme.colors.surface,
                            color: theme.colors.text,
                            border: `1px solid ${theme.colors.border}`
                          }}
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>

                        <button
                          onClick={() => handleRemove(member.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme.colors.text }}
                >
                  Email Address
                </label>
                <div 
                  className="flex items-center gap-2 p-3 rounded-xl border"
                  style={{ 
                    backgroundColor: theme.colors.surfaceHover,
                    borderColor: theme.colors.border
                  }}
                >
                  <Mail size={18} style={{ color: theme.colors.textSecondary }} />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="flex-1 bg-transparent outline-none"
                    style={{ color: theme.colors.text }}
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme.colors.text }}
                >
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{
                    backgroundColor: theme.colors.surfaceHover,
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`
                  }}
                >
                  <option value="member">Member - Can view and edit</option>
                  <option value="admin">Admin - Can manage team</option>
                </select>
              </div>

              <button
                onClick={handleInvite}
                disabled={loading || !inviteEmail}
                className="w-full px-4 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#ffffff'
                }}
              >
                <UserPlus size={18} />
                {loading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}