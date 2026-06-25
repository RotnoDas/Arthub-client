"use client";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FaUser, FaLock, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm";

export default function ArtistProfilePage() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) return <div className="text-slate-500 p-8">Loading...</div>;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) toast.success("Profile updated!");
      else toast.error("Update failed.");
    } catch { toast.error("Could not update profile."); }
    finally { setSavingProfile(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords don't match.");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters.");
    setSavingPassword(true);
    try {
      await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
      toast.success("Password changed!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch { toast.error("Password change failed."); }
    finally { setSavingPassword(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Artist Profile</h1>
        <p className="text-slate-500">Manage your ArtHub artist account.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 flex items-center gap-5">
        <div className="relative shrink-0">
          <img
            src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&bold=true`}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-indigo-500/60 ring-offset-2 ring-offset-slate-50"
          />
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center">
            <FaCheckCircle className="text-white text-[10px]" />
          </span>
        </div>
        <div>
          <p className="text-slate-900 font-bold text-xl">{user.name}</p>
          <p className="text-slate-500 text-sm">{user.email}</p>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">Artist</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center"><FaUser size={14} /></div>
          <div>
            <h2 className="text-slate-900 font-bold text-base">Edit Profile</h2>
            <p className="text-slate-500 text-xs">Update your display name.</p>
          </div>
        </div>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Email Address</label>
            <input value={user.email} disabled className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-sm cursor-not-allowed shadow-inner" />
          </div>
          <Button type="submit" isLoading={savingProfile} color="primary" className="font-semibold px-8 shadow-lg shadow-primary/20">Save Profile</Button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center"><FaLock size={14} /></div>
          <div>
            <h2 className="text-slate-900 font-bold text-base">Change Password</h2>
            <p className="text-slate-500 text-xs">Keep your account secure.</p>
          </div>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>
          <Button type="submit" isLoading={savingPassword} color="secondary" className="font-semibold px-8">Update Password</Button>
        </form>
      </div>
    </div>
  );
}
