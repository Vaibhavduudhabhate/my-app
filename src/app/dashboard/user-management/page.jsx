// "use client"
import Table from '@/components/Table';
import Comnavbar from '@/components/Comnavbar';
import UserModal from '@/components/UserModel';
import Loading from '@/components/Loading';
import UserManagementTable from '@/components/UserManagementTable';

const Usermanagement = () => {
    
    // const [userData, setUserData] = useState([]);
    // const [refreshData, setRefreshData] = useState(false);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [isLoading, setIsLoading] = useState(true); // Track loading state
    // const [error, setError] = useState(null);
    
    // Fetch data when refreshData changes
    // useEffect(() => {
    //     const fetchData = async () => {
    //         setIsLoading(true);
    //         setError(null);
    //         try {
    //             const response = await fetch('/api/user-listing', { method: "GET", cache: "no-cache" });
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const records = await response.json();
    //             // console.log(records);
                
    //             setUserData(records);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             setError('Error fetching data. Please try again later.');
    //         }finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchData();

    // }, [refreshData]);

    // Toggle refreshData to re-fetch data
    // const handleDataChange = () => {
    //     setRefreshData(prev => !prev);
    // }

    // // Handle search input change
    // const handleSearchChange = (e) => {
    //     setSearchTerm(e.target.value);
    // };

    // // Filter userData based on username only
    // const filteredData = userData && userData.filter(user => 
    //     user.userFullName && user.userFullName.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // Create a composite key for re-rendering
    // const compositeKey = `${searchTerm}-${refreshData}`;
    // const {storedRole} = useAuthStore()
    // const columnsConfig = [
    //     { header: "NAME", accessorKey: "userFullName" },
    //     { header: "EMAIL ADDRESS", accessorKey: "email" },
    //     { header: "MOBILE NUMBER", accessorKey: "phoneNumber" },
    //     { header: "ROLE", accessorKey: "role" },
    //     // { header: "Action", accessorKey: "action" },
    // ];
    // if (storedRole == 'Admin') {
    //     columnsConfig.push({ header: "Action", accessorKey: "action" });
    // }

    return (
        <>
            <Comnavbar comHeading="User Management" comPara="Centralize and streamline user access and permissions effortlessly." />
            <div className='m-8 bg-white text-black border-1x border-border-A4A4A9'>
                {/* <div className="p-4 flex justify-between flex-wrap items-center">
                    <div className="w-full md:w-4/12 mb-2 md:mb-0">
                        <h3 className="text-lg font-normal text-101828">Users</h3>
                    </div>
                    <div className="w-full md:w-8/12 flex flex-wrap justify-start md:justify-end">
                        <div className="relative mb-2 md:mb-0 md:ml-2 w-full md:w-auto">
                            <input 
                                type="text" 
                                placeholder="Search by name" 
                                className="pl-11 pr-4 py-0 h-10 bg-white border-1x border-22222E shadow-custom-shadow w-full md:w-72 text-sm font-normal text-101828 placeholder:text-7F7F86 focus:outline-none" 
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-2 pointer-events-none">
                                <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.5 16L12.875 12.375M14.8333 7.66667C14.8333 11.3486 11.8486 14.3333 8.16667 14.3333C4.48477 14.3333 1.5 11.3486 1.5 7.66667C1.5 3.98477 4.48477 1 8.16667 1C11.8486 1 14.8333 3.98477 14.8333 7.66667Z" stroke="#22222E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <UserModal btn_title='Add New User' />
                    </div>
                </div> */}
                {/* {isLoading ? (
                    <Loading />
                ) : error ? (
                    <div className="p-4 text-center text-red-500">{error}</div>
                ) : userData.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No data found.</div>
                ) : ( */}
                    {/* // <Table */}
                    {/* //     key={compositeKey} 
                    //     data={filteredData} 
                    //     pageName="user-management" 
                    //     showPaginationButton="true" 
                    //     maximumDisplayData={10} 
                    //     columnsConfig={columnsConfig} 
                    //     displayTrashandPencilIcon="true" 
                    //     onEditOrDelete={handleDataChange}
                    // /> */}
                    <UserManagementTable />
                {/* )} */}
            </div>
        </>
    );
}

export default Usermanagement;
