import React, { useEffect, useState } from 'react';
import useAuthStore from "@/store/AuthStore";
import 'react-toastify/dist/ReactToastify.css';

export default function ConfirmatioModal({ property_id,report_id, username, isOpen, onClose, onDelete, onPropertydelete ,ondailyReportDelete ,reportValues,handleAddClick1,userEdit ,userEditfinal,onPropertyEdit ,ondailyReportEdit,updated_item,action ,onprofileEdit ,onPasswordEdit,storedUsername,updated_profile_item}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [actionText, setActionText] = useState('');
  const authStore = useAuthStore();
  useEffect(()=>{
    if (action == "clicked"){
      setIsDisabled(false)
    }
  },[])
  if (!isOpen) return null;
  const handleDeleteClick = async() => {
    setIsDisabled(true); 
    setActionText('Loading...'); 
    try {
      if (username) await onDelete(username);
      else if (property_id) await onPropertydelete(property_id);
      else if (report_id) await ondailyReportDelete(report_id);
    } catch (error) {
      toast.error("Failed to delete item.");
    } finally {
      setIsDisabled(false); 
      setActionText('');
    }
  };
  const handleLogout = ()=>{
    authStore.setAuth({
      isAuthenticated: false,
      storedToken: null,
      storedUsername: null,
      storedEmail: null,
      storedRole: null,
    });
  }
  const handleProfileEdit = async()=>{
    setIsDisabled(true);
    setActionText('Loading...');
    try {
      if(storedUsername) await onprofileEdit(updated_profile_item,storedUsername)
    } catch (error) {
      toast.error("Failed to Update Profile.");
    } finally {
      setIsDisabled(false); 
      setActionText(''); 
    }
  }
  const handlePasswordEdit = async()=>{
    setIsDisabled(true);
    setActionText('Loading...');
    try {
     if(storedUsername) await onPasswordEdit(updated_profile_item,storedUsername)
    } catch (error) {
      toast.error("Failed to Update Password.");
    } finally {
      setIsDisabled(false); 
      setActionText('Update password'); 
    }
  }
  const handleEditClick =async() =>{
    setIsDisabled(true); 
    setActionText('Loading...'); 
    try {
      
      if (username) await userEditfinal(username, updated_item);
      // Add other conditions if needed
    } catch (error) {
      toast.error("Failed to edit item.");
    } finally {
      setIsDisabled(false); 
      setActionText('');
    }
    }
    const handleAddClick =async() =>{
      setIsDisabled(true); 
      setActionText('Loading...'); 
      try {
        
        if (reportValues) await handleAddClick1(reportValues);
        // Add other conditions if needed
      } catch (error) {
        toast.error("Failed to edit item.");
      } finally {
        setIsDisabled(false); 
        setActionText('Edit');
      }
      }
    const confirmationMessage = userEdit === "edit" || userEdit === "propEdit" ? "Are you sure you want to update this record?" : userEdit === "logout"
    ? "Are you sure you want to log out?" :userEdit === "profile1"
    ? "Are you sure you want to update this record?" :userEdit === "password"
    ? "Are you sure you want to update password?" :userEdit === "add"
    ? "Are you sure you want to add new record?":userEdit === "empty"
    ? "You have not made any changes":userEdit === "delete"
    ? "Are you sure you want to delete this record?":"Are you sure you want to delete this record?";
  const PropEdit = async()=>{
    setIsDisabled(true); 
    setActionText('Loading...'); 
    try {
      if (property_id) await onPropertyEdit(property_id, updated_item);
    } catch (error) {
      toast.error("Failed to edit property.");
    } finally {
      setIsDisabled(false); 
      setActionText(''); 
    }
  }

  return (
    <>
      <div
        className="z-[51] fixed inset-0 bg-black/10 backdrop-blur-md "
        onClick={onClose}
      ></div>
      <div
        className="z-[51] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-auto flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg  overflow-auto "
        onClick={(e) => e.stopPropagation()} 
      >
        <div className='h-full w-full'>
            <h1 className="text-xl text-black my-[20px]">{confirmationMessage}</h1>
          <div className="flex gap-2">
            <button
              id="actionButton"
              className={`flex h-10 items-center justify-center gap-2 px-4 py-2 text-white bg-${userEdit ? 'green-500' : 'blue-500'} border-none rounded-md shadow-md ring-1 ring-${userEdit ? 'green-600' : 'blue-600'}  hover:ring-black/33% active:shadow-[inset_0_0_0_1px_rgb(0_0_0/13%),inset_0_2px_0_rgb(0_0_0/13%)] focus:outline-none focus:ring-2 focus:ring-${userEdit ? 'green-600' : 'blue-600'} ${isDisabled ? 'bg-[#60a5fa] cursor-not-allowed' : ''}`}
              onClick={userEdit === "edit" ? handleEditClick : userEdit === "propEdit" ? PropEdit :userEdit === "logout" ?  handleLogout:userEdit === "profile1" ?  handleProfileEdit:userEdit === "password" ?  handlePasswordEdit:userEdit === "add" ?  handleAddClick:userEdit === "empty" ?  onClose:userEdit=== "delete"?handleDeleteClick: handleDeleteClick}
              disabled={isDisabled}
            >
              {actionText || (userEdit === "edit" ? "Edit" : userEdit === "propEdit" ? "Edit Property" :userEdit === "logout" ? "Logout":userEdit === "profile1" ? "Edit Profile":userEdit === "password" ? "Update Password":userEdit === "add" ? "Add record" :userEdit === "empty" ? "Ok":userEdit=== "delete"?"Delete": "Delete")}
            </button>
            <button
              id="cancelButton"
              className={`flex h-10 items-center justify-center gap-2 px-4 py-2  text-black bg-transparent border-none rounded-md hover:bg-black/5% dark:hover:bg-white/5% focus:outline-none ${isDisabled ? 'cursor-not-allowed' : ''}`}
              onClick={onClose}
              disabled={isDisabled}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
