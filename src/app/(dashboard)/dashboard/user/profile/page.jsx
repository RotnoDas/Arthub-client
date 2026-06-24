"use client";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FaUser, FaLock, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500/60 transition";

export default function ProfilePage() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) return <div className="text-white p-8">Loading...</div>;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        toast.success("Profile updated!");
      } else {
        toast.error("Update failed.");
      }
    } catch {
      toast.error("Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords don't match.");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters.");
    setSavingPassword(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      toast.success("Password changed!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Password change failed. Check your current password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Profile Settings</h1>
        <p className="text-slate-400">Manage your ArtHub account details.</p>
      </div>

      {/* Avatar + Basic Info */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex items-center gap-5">
        <div className="relative shrink-0">
          <img
            src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ec4899&color=fff&bold=true`}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-pink-500/60 ring-offset-2 ring-offset-[#080c16]"
          />
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-[#080c16] flex items-center justify-center">
            <FaCheckCircle className="text-white text-[10px]" />
          </span>
        </div>
        <div>
          <p className="text-white font-bold text-xl">{user.name}</p>
          <p className="text-slate-400 text-sm">{user.email}</p>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[10px] font-bold uppercase tracking-wider">
            {user.role || "user"}
          </span>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <FaUser size={14} />
          </div>
          <div>
            <h2 className="text-white font-bold text-base">Edit Profile</h2>
            <p className="text-slate-500 text-xs">Update your display name.</p>
          </div>
        </div>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Display Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
            <input value={user.email} disabled className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 text-sm opacity-60 cursor-not-allowed" />
            <p className="text-slate-600 text-xs mt-1.5">Email cannot be changed.</p>
          </div>
          <Button type="submit" isLoading={savingProfile} color="primary" className="font-semibold shadow-lg shadow-primary/20 px-8">
            Save Profile
          </Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FaLock size={14} />
          </div>
          <div>
            <h2 className="text-white font-bold text-base">Change Password</h2>
            <p className="text-slate-500 text-xs">Keep your account secure with a strong password.</p>
          </div>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>
          <Button type="submit" isLoading={savingPassword} color="secondary" className="font-semibold px-8">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
