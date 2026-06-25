"use client";
import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FaUser, FaLock, FaCheckCircle, FaCamera, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dbdj8yyjn";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "arthub";

const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition shadow-sm dark:shadow-none";

export default function ArtistProfilePage() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sync state when session finishes loading (useState initial value locks before session resolves)
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
    }
  }, [user?.id]);

  if (!user) return <div className="text-slate-500 p-8">Loading...</div>;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      
      if (res.ok && data.secure_url) {
        setImage(data.secure_url);
        toast.success("Image uploaded! Don't forget to save profile.");
      } else {
        toast.error("Upload failed: " + (data.error?.message || "Unknown error"));
      }
    } catch (err) {
      toast.error("Cloudinary upload error.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      // Update session via BetterAuth
      const { data, error } = await authClient.updateUser({ name, image });
      
      if (error) {
        toast.error(error.message || "Update failed.");
        setSavingProfile(false);
        return;
      }
      
      // Update custom backend using email (safest identifier)
      await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/update-profile/${user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      toast.success("Profile updated!");
      
      // Force a reload so the entire website (navbar, layouts) gets the new name
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch {
      toast.error("Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords don't match.");
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters.");
    
    setSavingPassword(true);
    
    try {
      const { data, error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message || "Password change failed.");
      } else {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      toast.error("Password change failed. Check your current password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your ArtHub account details.</p>
      </div>

      {/* Avatar + Basic Info */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 flex items-center gap-6 transition-colors duration-500">
        <div className="relative shrink-0 group">
          <label className={`cursor-pointer block relative rounded-full overflow-hidden w-24 h-24 ring-4 ring-indigo-500/20 ring-offset-2 ring-offset-white transition-all ${uploadingImage ? 'opacity-70' : 'hover:opacity-90'}`}>
            <img
              src={image || user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&bold=true`}
              alt={user.name}
              className="w-full h-full object-cover"
            />
            {/* Hover overlay for changing image */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploadingImage ? <FaSpinner className="text-white animate-spin" /> : <FaCamera className="text-white text-xl" />}
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
          </label>
          <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-green-500 border-4 border-white flex items-center justify-center shadow-md">
            <FaCheckCircle className="text-white text-[12px]" />
          </span>
        </div>
        <div>
          <p className="text-slate-900 dark:text-white font-bold text-xl">{user.name}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{user.email}</p>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            {user.role || "user"}
          </span>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-5 transition-colors duration-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FaUser size={14} />
          </div>
          <div>
            <h2 className="text-slate-900 dark:text-white font-bold text-base">Edit Profile</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Update your display name.</p>
          </div>
        </div>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Display Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
            <input value={user.email} disabled className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-600 text-sm cursor-not-allowed shadow-inner dark:shadow-none" />
            <p className="text-slate-500 dark:text-slate-500 text-xs mt-1.5">Email cannot be changed.</p>
          </div>
          <Button type="submit" isLoading={savingProfile} color="primary" className="font-semibold shadow-lg shadow-primary/20 px-8">
            Save Profile
          </Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-5 transition-colors duration-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FaLock size={14} />
          </div>
          <div>
            <h2 className="text-slate-900 dark:text-white font-bold text-base">Change Password</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Keep your account secure with a strong password.</p>
          </div>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Confirm New Password</label>
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
