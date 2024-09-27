'use client';
import { useFormik } from 'formik'
import Comnavbar from '@/components/Comnavbar';
import { defaultValue, resetDefaultValue, resetValidationSchema, validationSchema } from '@/validation/editProfile';
import useAuthStore from '@/store/AuthStore';
import React, { useEffect, useRef, useState } from 'react'
import ConfirmatioModal from '@/components/ConfirmationBox';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Editprofile = () => {
    return (
        <>
    <Comnavbar comHeading="Edit Profile" comPara="Manage your profile, change your password and much more."  />

    <div className='max-[1025px]:flex max-[1025px]:items-center max-[1025px]:justify-center'>
        <div className="container w-full">     
            <div className="flex flex-col gap-4 lg:flex-row md:flex-col sm:flex-col sm:h-[100%] h-[404px] max-[786px]:h-full px-[32px] pt-[32px]">
                <EditUserPro />
                <ResetPassword />
               
            </div>
        </div>
    </div>
    </>
  )
}




function EditUserPro() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { storedUserId } =useAuthStore();
    const [profileInfo, setProfileInfo] = useState();
    const [updatedItems, setUpdatedItems] = useState();
    const [edit, selectedEdit] = useState("");
    const fetchCalled = useRef(false);
    // useEffect(()=>{
        const getProfileData = async() =>{
            try{
                const response = await fetch(`/api/read-profile/?user_id=${storedUserId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id: storedUserId }),
                });
                const data = await response.json();
                const profileData = data.data;
                setProfileInfo(profileData);
                if (profileData) {
                    formik.setFieldValue(
                        "userFullName",
                        profileData.userFullName
                    );
                    formik.setFieldValue(
                        "email",
                        profileData.email
                    );
                    formik.setFieldValue(
                        "phoneNumber",
                        profileData.phoneNumber
                    );
                }
            }catch(err){
                console.error("Error get user profile details:", err);
            }
        }
        // getProfileData();
    // },[storedUserId])
    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        getProfileData();
    }, []);
    const handleProfileEdit =async(updated_item,storedUserId)=>{
        try{
            const response = await fetch(`/api/edit-profile/?user_id=${storedUserId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({user_id: storedUserId, updated_item}),
            });
            if(response.status == 200 ){
                setUpdatedItems({})
                setIsModalOpen(false)
                getProfileData();
                toast.success("profile updated successfully")
            }
          }
          catch(error){
          }
    }
    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: async function (values) {
            const editedFields = Object.keys(values).filter(
                (key) => values[key] !== profileInfo[key]
            );
            const updated_item = {};
            editedFields.forEach((field) => {
                updated_item[field] = values[field];
            });
            // setIsModalOpen(true)
            setUpdatedItems(updated_item);
            console.log('updatedItems',updatedItems)
            if(updated_item && Object.keys(updated_item).length > 0){
                setIsModalOpen(true);
                selectedEdit("profile1")
              }else{
                setIsModalOpen(true);
                selectedEdit("empty")
              }
        }
      })
    return (
        <>
           <div className="basis-[57%] max-[786px]:basis-[100% p-[16px] bg-white border border-gray-400 ">
                  <form className='h-full' onSubmit={formik.handleSubmit}>
                    <div className="flex h-full flex-col justify-between">
                        <div className="profileInnercontainer w-full flex flex-row">
                                <div className="profileImag basis-[24%] text-center gap-4">
                                    <div className="imgavtar ">
                                        <img className='rounded-full border-4 border-white shadow-lg shadow-rgba(16, 24, 40, 0.03)' src="/Avatardummy.jpeg" alt="Avatar Image" srcSet="" />
                                    </div>
                                        {/* <button className='bg-transparent rounded font-bold text-center h-[34px] w-[110px] mt-[16px]' type="button">Edit</button> */}
                                </div>
                                <div className="profileEditsectioin pl-[20px] basis-[76%]">
                                    <div className="headingEditProfile">
                                        <h1 className='font-bold text-grey-900 text-[16px]'>Edit Profile</h1>
                                        <label className="block mt-[20px]">
                                            <span className=" block text-sm font-medium text-slate-700">
                                                Name
                                            </span>
                                            <input type="text" name="userFullName" id="userFullName" value={formik.values.userFullName} onChange={formik.handleChange} className="text-black mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm" placeholder="Enter your Name" />
                                            {formik.touched.userFullName && formik.errors.userFullName && (
                                                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.userFullName}</div>
                                            )}
                                        </label>
                                        <div className="mailNofields flex max-[600px]:flex-col flex-row mt-[20px]">
                                            <label className="block w-[50%] max-[600px]:w-[100%] mr-[20px]">
                                                <span className=" block text-sm font-medium text-slate-700">
                                                    Email Address
                                                </span>
                                                <input type="email" name="email" id="email" value={formik.values.email} onChange={formik.handleChange}  className="text-black mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm" placeholder="you@example.com" />
                                                {formik.touched.email && formik.errors.email && (
                                                    <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.email}</div>
                                                )}
                                            </label>
                                            <label className="block w-[50%] max-[600px]:w-[100%]">
                                                <span className=" block text-sm font-medium text-slate-700">
                                                Mobile Number
                                                </span>
                                                <input type="text" name="phoneNumber" id="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange}  className="text-black mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm" placeholder="enter your phone number" />
                                                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                                    <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.phoneNumber}</div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className="buttonContainer text-center text-15151C mt-[20px] w-full py-[16px] px-[28px] border-2 border-black">
                            <button className=' w-[100%] font-bold text-lg' type="submit" >Save Changes</button>
                        </div>
                      </div>
                    </form>
                </div>
                <ConfirmatioModal
                        userEdit={edit}
                        storedUsername = {storedUserId}
                        updated_profile_item={updatedItems}
                        onprofileEdit={handleProfileEdit}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                    </>
    );
}

function ResetPassword() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedItems, setUpdatedItems] = useState();
    const { storedUserId } =useAuthStore();
    const handlePasswordEdit =async(updatedItems,storedUserId)=>{
        try {
            const response = await fetch(`/api/reset-password-profile/?user_id=${storedUserId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({user_id: storedUserId, updatedItems}),
            });
            if(response.status == 400){
                setIsModalOpen(false)
                toast.error("old password does not match")
            }
            if(response.status == 200 ){
                setIsModalOpen(false)
                toast.success("password updated successfully")
            }
        } catch (error) {
            console.error("Error Reset user password", error);
        }
    }
    const formik = useFormik({
        initialValues: resetDefaultValue,
        validationSchema: resetValidationSchema,
        onSubmit: async function (values) {
            setIsModalOpen(true)
          const { confirmPassword, ...updated_item } = values;
          setUpdatedItems(updated_item);
        }
      })
    return (
        <>
        <div className="basis-[43%] max-[786px]:basis-[100%]">
            <div className="p-[16px] bg-white border border-gray-400  flex flex-col justify-between">
                <form onSubmit={formik.handleSubmit}>
                    <div className="profileEditsectioin basis-[76%]">
                            <div className="profileInnercontainer w-full flex flex-row">
                                <div className="headingEditProfile w-full">
                                    <h1 className='font-bold text-grey-900 text-[16px]'>Reset Password</h1>
                                    <label className="block w-full mt-[20px]">
                                        <span className=" block text-sm font-medium text-slate-700">
                                        Enter Current Password 
                                        </span>
                                        <input type="password" name="old_password" value={formik.values.old_password} onChange={formik.handleChange} className="text-black mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm" placeholder="Current Password" />
                                        {formik.touched.old_password && formik.errors.old_password && (
                                            <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.old_password}</div>
                                        )}
                                    </label>
                                        <label className="block w-full mt-[20px]">
                                            <span className=" block text-sm font-medium text-slate-700">
                                            Enter New Password
                                            </span>
                                            <input type="password" name="new_password" value={formik.values.new_password} onChange={formik.handleChange}  className="text-black mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm" placeholder="New Password" />
                                            {formik.touched.new_password && formik.errors.new_password && (
                                                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.new_password}</div>
                                            )}
                                        </label>
                                        <label className="block w-full mt-[20px]">
                                            <span className=" block text-sm font-medium text-slate-700">
                                            Confirm Password
                                            </span>
                                            <input type="password" name="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} className="text-black mt-2 px-[14px] py-[10px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 w-full sm:text-sm" placeholder="Confirm Password" />
                                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                                <div className="error text-red text-sm font-normal mt-1.5">{formik.errors.confirmPassword}</div>
                                            )}
                                        </label>
                                </div>
                            </div>
                    </div>
                    <div className="buttonContainer  text-center text-15151C mt-[20px] w-full py-[16px] px-[28px] border-2 border-black">
                        <button className=' w-[100%] font-bold text-lg' type="submit">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
        <ConfirmatioModal
        userEdit="password"
        onPasswordEdit={handlePasswordEdit}
        storedUsername = {storedUserId}
        updated_profile_item={updatedItems}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
    />
    </>
    );
}

export default Editprofile
