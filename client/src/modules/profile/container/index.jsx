import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  clearAuthState,
} from "../slice/profileSlice";

import Developer from "../components/Developer";
import Admin from "../components/Admin";
import ProjectOwner from "../components/ProjectOwner";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, message } = useSelector((state) => state.user);

  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ---------------- Functions ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getUser = () => {
    dispatch(getUserProfile()).then((res) => {
      if (res?.payload) {
        setUserData(res.payload.user);
        setForm(res.payload.user);
      }
    });
  };

  const handleSave = () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (
        key !== "resume" &&
        key !== "avatar" &&
        key !== "avatarPreview" &&
        key !== "newSkill"
      ) {
        if (key === "skills") {
          formData.append("skills", JSON.stringify(value));
        } else {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : value
          );
        }
      }
    });

    if (form.resume instanceof File) {
      formData.append("resume", form.resume);
    }
    if (form.avatar instanceof File) {
      formData.append("avatar", form.avatar);
    }

    dispatch(updateUserProfile(formData)).then((res) => {
      if (res?.payload?.status === 200) {
        getUser();
        setEditing(false);
        setForm((prev) => ({
          ...prev,
          avatarPreview: null,
          newSkill: "",
        }));
      }
    });
  };

  const handleDelete = () => setShowConfirm(true);

  const confirmDelete = () => {
    if (userData?.id) {
      dispatch(deleteUser(userData.id)).then((res) => {
        if (res?.payload?.status === 200) {
          navigate("/");
        }
      });
    }
    setShowConfirm(false);
  };

  const cancelDelete = () => setShowConfirm(false);

  const handleResumeChange = (e) => {
    setForm((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  // ---------------- Effects ----------------
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    getUser();
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearAuthState());
    } else if (error) {
      toast.error(error);
      dispatch(clearAuthState());
    }
  }, [message, error]);

  // ---------------- Props for children ----------------
  const commonProps = {
    user,
    userData,
    form,
    setForm,
    editing,
    setEditing,
    imgError,
    setImgError,
    loading,
    showConfirm,
    setShowConfirm,
    handleChange,
    handleSave,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleResumeChange,
    handleAvatarChange,
    navigate,
  };

  if (user?.role === "admin") return <Admin {...commonProps} />;
  if (user?.role === "project-owner") return <ProjectOwner {...commonProps} />;
  return <Developer {...commonProps} />;
};

export default Profile;
