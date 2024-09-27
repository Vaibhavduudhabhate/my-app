"use client"
import Comnavbar from '@/components/Comnavbar';
import { X, FileText } from "feather-icons-react";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const Notification = () => {
    const [userData, setUserData] = useState('');
    const fetchCalled = useRef(false);
    const router = useRouter();

    // Function to fetch notification data
    const fetchNotifications = () => {
        fetch('/api/notification-listing', { method: "GET", cache: "no-cache" })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(records => {
                console.log(records);
                setUserData(records);
            })
            .catch(error => {
                console.log(error);
            });
    };

    // Fetch notifications on component mount
    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;
        fetchNotifications();
    }, []);

    // Function to handle notification status update
    const handleNotificationStatus = async (notification_id, status, report_id) => {
        if (status != "read") {
            try {
                const response = await fetch('/api/notification-read-api', {
                    method: "POST",
                    body: JSON.stringify({ notification_id }),
                    cache: "no-cache"
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const records = await response.json();
                console.log("records", records);
                fetchNotifications();  // Re-fetch notifications after status update
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        else {
            // alert("Notification Already Seen")
            router.push(`/dashboard/daily-reports/report-details/${report_id}`)
        }
    }

    // Function to format time ago
    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const createdAt = new Date(timestamp);
        const diffInSeconds = Math.floor((now - createdAt) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div>
            <Comnavbar comHeading="Manage your Notifications" comPara="Set your notification according to your preference." />
            <div className='m-8 bg-white text-black border-1x border-border-A4A4A9'>
                <div className='relative h-[100vh]'>
                    <div>
                        <div className="p-4 border-b-[1px] border-[#E2E8F0] flex justify-between flex-wrap items-center">
                            <div className="w-full md:w-4/12 mb-2 md:mb-0">
                                <h3 className="text-2xl font-normal text-101828">Notifications</h3>
                            </div>
                            <div className="w-full md:w-8/12 flex flex-wrap justify-start md:justify-end">
                                <div className="flex items-center text-[20px] gap-[12px] relative mb-2 md:mb-0 md:ml-2 w-full md:w-auto">
                                    Mark all as read
                                    <X />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='h-[81vh] overflow-auto'>
                        {
                            userData && userData.length > 0 ? (userData.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => { handleNotificationStatus(notification.id, notification.status, notification.report_id) }}
                                    className={`grid grid-cols-9 py-[20px] px-[40px] cursor-pointer ${notification.status === 'read' ? 'bg-white' : 'bg-[#E6EAEB]'
                                        }`}
                                >
                                    <div className='text-start flex items-center  '>
                                        <img className={`w-[10px] h-[10px] items-center justify-center mr-[10px] ${notification.status === 'read' ? "invisible" : 'block'}`} src="/Dot.png" alt="Dot" srcset="" />
                                        <div className={`flex w-[60px] h-[60px]  rounded-[100%] items-center justify-center ${notification.status === 'read' ? "bg-[#E6EAEB]" : 'bg-white'}`}>
                                            <FileText className="h-[30px] w-[30px] text-black " />
                                        </div>
                                    </div>
                                    <div className='col-span-7 flex items-center'>
                                        <div className="p font-bold text-[18px] mr-2">
                                            {`${notification.property_name}`}
                                        </div>
                                        <div>
                                            {`${notification.message}`}
                                        </div>
                                    </div>
                                    <div className='text-end flex items-center justify-end'>
                                        {formatTimeAgo(notification.createdAt)}
                                    </div>
                                </div>
                            ))) : (
                                <>
                                    <div className='absolute top-[50%] left-[50%] transform -translate-x-[50px] -translate-y-[50px] text-xl text-344054 font-normal'>
                                        No Data Found
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div>
                        <div className="absolute 
                        w-full bottom-0 text-center p-4 flex justify-between flex-wrap items-center">
                            <div className="flex text-center w-full py-[8px] px-[16px]">
                                <div className="flex text-center w-full justify-center">
                                    <img className='h-[48px]' src="/logo_horizontal_darkgrey.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification;
