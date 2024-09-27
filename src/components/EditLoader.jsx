import React from 'react';

const EditLoader = () => {
    return (
        <div className="fixed h-full w-full inset-0 flex items-center justify-center bg-gray-100 z-50">
            <div className="rounded-md w-[100%] p-4 px-12 py-12 bg-white shadow-lg">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                        <div className="my-4 h-3 bg-gray-200 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="my-4 h-3 bg-gray-200 rounded col-span-2"></div>
                                <div className="my-4 h-3 bg-gray-200 rounded col-span-1"></div>
                            </div>
                            <div className="my-4 h-3 bg-gray-200 rounded"></div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="my-4 h-3 bg-gray-200 rounded col-span-2"></div>
                                <div className="my-4 h-3 bg-gray-200 rounded col-span-1"></div>
                            </div>
                            <div className="my-4 h-3 bg-gray-200 rounded"></div>
                            <div className="my-4 h-3 bg-gray-200 rounded"></div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="my-4 h-3 bg-gray-200 rounded col-span-2"></div>
                                <div className="my-4 h-3 bg-gray-200 rounded col-span-1"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="my-4 h-3 bg-gray-200 rounded col-span-2"></div>
                                <div className="my-4 h-3 bg-gray-200 rounded col-span-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditLoader;
