const Loading = () => {
    return (
        <div>
            <div className='h-screen w-full flex items-center justify-center bg-gray-100'>
                <div
                    className="rounded-md p-4 px-[100px] py-[100px] my-[300px] h-full w-full"
                >
                    <div className="animate-pulse flex space-x-4">
                        {/* <!-- <div className="rounded-full bg-slate-700 h-10 w-10"></div> --> */}
                        <div className="flex-1 space-y-6 py-1">
                            <div className="my-[30px] h-3 bg-gray-200 rounded"></div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <div
                                        className="my-[30px] h-3 bg-gray-200 rounded col-span-2"
                                    ></div>
                                    <div
                                        className="my-[30px] h-3 bg-gray-200 rounded col-span-1"
                                    ></div>
                                </div>
                                <div className="my-[30px] h-3 bg-gray-200 rounded"></div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div
                                        className="my-[30px] h-3 bg-gray-200 rounded col-span-2"
                                    ></div>
                                    <div
                                        className="my-[30px] h-3 bg-gray-200 rounded col-span-1"
                                    ></div>
                                </div>
                                <div className="my-[30px] h-3 bg-gray-200 rounded"></div>
                                <div className="my-[30px] h-3 bg-gray-200 rounded"></div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div
                                        className="my-[30px] h-3 bg-gray-200 rounded col-span-2"
                                    ></div>
                                    <div
                                        className="my-[30px] h-3 bg-gray-200 rounded col-span-1"
                                    ></div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div
                                        className="my-[30px] h-3 bg-gray-200 rounded col-span-2"
                                    ></div>
                                    <div
                                        className="my-[30px] h-3 bg-gray-200 rounded col-span-1"
                                    ></div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div></div>
    )
}

export default Loading