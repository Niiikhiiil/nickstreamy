import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { LoaderIcon } from 'react-hot-toast';
import { completeOnboarding } from '../lib/api';
import { CameraIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constants';

const OnBoardingPage = () => {
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();
    const [formState, setFormState] = useState({
        fullName: authUser?.fullName || "",
        bio: authUser?.bio || "",
        nativeLanguage: authUser?.nativeLanguage || "",
        learningLanguage: authUser?.learningLanguage || "",
        location: authUser?.location || "",
        profilePic: authUser?.profilePic || ""
    })

    const { mutate: onBoardingMutation, isPending } = useMutation({
        mutationFn: completeOnboarding,
        onSuccess: () => {
            toast.success("Profile onboarded successfully.");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message)
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        onBoardingMutation(formState)
    }

    const handleRandomAvatar = () => {
        const idx = Math.floor(Math.random() * 100) + 1; //between 1-100;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        setFormState({ ...formState, profilePic: randomAvatar });
        toast.success("Random Profile Picture generated.")
    }

    return (
        <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
            <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
                <div className='card-body p-6 sm:p-8'>
                    <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>
                        Complete Your Profile
                    </h1>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Profile Pic container */}
                        <div className='flex flex-col items-center justify-center space-y-4'>
                            {/* Image preview */}
                            <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                                {
                                    formState.profilePic ? (
                                        <img
                                            src={formState.profilePic}
                                            alt="Profile Preview"
                                            className='w-full h-full object-cover'
                                        />
                                    ) : (
                                        <div className='flex items-center justify-center h-full'>
                                            <CameraIcon className='size-12 text-base-content opacity-40' />
                                        </div>
                                    )
                                }
                            </div>

                            {/* Generate random avatar button  */}
                            <div className='flex items-center gap-2'>
                                <button className='btn btn-accent' type='button' onClick={handleRandomAvatar}>
                                    <ShuffleIcon className='size-4 mr-2' />
                                    Generate Random Avatar
                                </button>
                            </div>
                        </div>

                        {/* Full Name  */}
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text'>Full Name</span>
                            </label>
                            <input
                                className='input input-bordered w-full'
                                value={formState?.fullName}
                                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                                type='text'
                                name='fullName'
                                placeholder='Enter your full name...'
                            />
                        </div>

                        {/* Bio */}
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text'>Bio</span>
                            </label>
                            <textarea
                                className='input input-bordered w-full'
                                value={formState?.bio}
                                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                                type='text'
                                name='bio'
                                placeholder='Tell others about yourself and your language learning goals'
                                rows={"4"}
                            />
                        </div>

                        {/* Languages */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Native langauge  */}
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>
                                        Native Language
                                    </span>
                                </label>
                                <select
                                    className='select select-bordered w-full'
                                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                                    value={formState?.nativeLanguage}
                                    name='nativeLanguage'
                                >
                                    <option value={""}>Select your native language</option>
                                    {LANGUAGES?.map((lang) => (
                                        <option value={lang.toLowerCase()} key={`native-${lang}`}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Learning langauge  */}
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>
                                        Learning Language
                                    </span>
                                </label>
                                <select
                                    className='select select-bordered w-full'
                                    onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                                    value={formState?.learningLanguage}
                                    name='learningLanguage'
                                >
                                    <option value={""}>Select language you're learning</option>
                                    {LANGUAGES?.map((lang) => (
                                        <option value={lang.toLowerCase()} key={`native-${lang}`}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text'>Location</span>
                            </label>
                            <div className='relative'>
                                <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70' />
                                <input
                                    className='input input-bordered w-full pl-10'
                                    value={formState?.location}
                                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                                    type='text'
                                    name='location'
                                    placeholder='Enter your location (City, Country)...'
                                />
                            </div>
                        </div>

                        {/* Button  */}
                        <button type="submit" className='btn btn-primary w-full' disabled={isPending}>
                            {!isPending ? (
                                <>
                                    <ShipWheelIcon className='size-5 mr-2' />
                                    Complete Onboarding
                                </>
                            ) : (
                                <>
                                    <LoaderIcon className='animate-spin size-5 mr-2' />
                                    Onboarding...
                                </>
                            )}
                        </button>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default OnBoardingPage