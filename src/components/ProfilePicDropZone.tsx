'use client';
import Image from 'next/image';
import React from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
  setProfileImage: React.Dispatch<React.SetStateAction<File[]>>;
  setImageUpload?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfilePicDropZone = (props: Props) => {
  const onDrop = (acceptedFiles: any) => {
    props.setProfileImage(acceptedFiles);
    props.setImageUpload && props.setImageUpload(false);
    console.log('setImageUpload', false);
    console.log('profilePic', acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1, // Allow only one file to be uploaded
  });
  return (
    <div {...getRootProps()} className="relative  my-4 mx-auto h-[80px]">
      <input {...getInputProps()} />
      <p className="text-[#000000] m-auto text-xl border-2 border-[#939393] p-4">
        Drag and drop image(s) here, <br /> or click to select files
      </p>
    </div>
  );
};

export default ProfilePicDropZone;
