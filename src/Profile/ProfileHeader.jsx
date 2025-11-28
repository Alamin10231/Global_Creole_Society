import React from 'react'
import UploadProfilePage from './UploadProfilePage'

const ProfileHeader = ({ data }) => {
    console.log(data)
    return (
        <div className="bg-white shadow-xl rounded-lg max-w-full max-h-[550px]">
            {/* Cover Photo */}
            <div className="relative h-[40%]">
                <img
                    className="w-full rounded-t-lg object-cover max-h-[270px] min-h-[200px]"
                    src={data?.coverImage || 'https://picsum.photos/800/200'}
                    alt="cover_Profile"
                />
                
                {/* Profile Image Upload Section */}
                <div className="transform transition-transform duration-700 ease-in-out hover:scale-103 absolute left-5 lg:left-10 -bottom-12 lg:-bottom-20 h-28 w-28 rounded-2xl bg-gray-100">
                   <img src={data?.profileImage || '/placeholder.svg'} alt="profile" />
                </div>
            </div>

            {/* Profile Information Section */}
            <div className="flex py-15 md:py-8 pl-8 rounded-lg h-[60%] flex-col sm:flex-row sm:justify-between">
                <div className='w-[20%]'>

                </div>
                <div className="sm:w-[40%] mb-4 sm:mb-0">
                    <h1 className="text-3xl font-bold pb-2">{data?.username || 'Reza'}</h1>
                    <p className="text-sm opacity-60 mb-2">{data?.description || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'}</p>
                    <h3 className="text-sm opacity-60">{data?.friends_count || '1000'} followers</h3>
                </div>

                <div className="sm:w-[40%] flex justify-between sm:justify-around sm:mt-0 mt-4">
                    <div>
                        <p className="text-sm font-semibold">Posts</p>
                        <p className="text-lg font-bold"> {data?.stats?.posts || '109k'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Friends</p>
                        <p className="text-lg font-bold">{data?.stats?.friends || '103k'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Likes</p>
                        <p className="font-bold text-lg">{data?.stats?.likes || '103k'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader
