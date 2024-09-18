"use client";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import heic2any from "heic2any";

type Props = {
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imageFiles: File[];
  downloadURLs?: string[];
};

const BecomeMemberDropzone: React.FC<Props> = (props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const [orderedImageFiles, setOrderedImageFiles] = useState<File[]>(
    props.imageFiles
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDropRejected: (fileRejections) => {
      const fileRejectionErrors = fileRejections.map((fileRejection) => {
        return fileRejection.errors.map((error) => error.message);
      });
      fileRejectionErrors.forEach((error) => toast.error(error));
      toast.error("File rejected. Please check the file's size and type.");
    },
    onDrop: async (acceptedFiles) => {
      const totalFilesAfterAdding =
        orderedImageFiles.length + acceptedFiles.length;
      if (totalFilesAfterAdding > 15) {
        toast.error("You can only upload up to 15 images.");
        return;
      }
      const existingFileNames = orderedImageFiles.map((file) => file.name);
      const newImageFiles = acceptedFiles.filter(
        (file) => !existingFileNames.includes(file.name)
      );

      if (newImageFiles.length < acceptedFiles.length) {
        // Display a toast alert for duplicates
        toast.warn("Some images were not added as they are duplicates.");
      }

      // Convert HEIC files to JPG
      const convertedFiles = await Promise.all(
        newImageFiles.map(async (file) => {
          if (file.type === "image/heic") {
            const arrayBuffer = await file.arrayBuffer();
            const jpegBlob = await heic2any({
              blob: new Blob([arrayBuffer]),
              toType: "image/jpeg",
            });
            return new File(
              [jpegBlob as Blob],
              `${file.name.replace(/\.heic$/, ".jpg")}`,
              { type: "image/jpeg" }
            );
          }
          return file;
        })
      );

      // Combine the new files with the existing files
      const updatedImageFiles = [...orderedImageFiles, ...convertedFiles];

      props.setImageFiles(updatedImageFiles);
      setOrderedImageFiles(updatedImageFiles);
      setItems(
        updatedImageFiles.map((file, index) => ({
          index,
          name: `Image ${index + 1}`,
          image: URL.createObjectURL(file),
        }))
      );
    },
  });

  const handleRemoveImage = (index: number) => {
    console.log("index", index);
    const updatedImageFiles = [...orderedImageFiles];
    updatedImageFiles.splice(index, 1);
    props.setImageFiles(updatedImageFiles);
    setOrderedImageFiles(updatedImageFiles);
    setItems(
      updatedImageFiles.map((file, index) => ({
        index,
        name: `Image ${index + 1}`,
        image: URL.createObjectURL(file),
      }))
    );
  };

  const [items, setItems] = useState(
    props.imageFiles.map((file, index) => ({
      index,
      name: `Image ${index + 1}`,
      image: URL.createObjectURL(file),
    }))
  );

  useEffect(() => {
    const convertURLsToFileObjects = async () => {
      if (props.downloadURLs) {
        const files = await Promise.all(
          props.downloadURLs.map(async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            return new File([blob], url.split("/").pop() || "downloaded", {
              type: blob.type,
            });
          })
        );
        props.setImageFiles(files);
        setOrderedImageFiles(files);
        setItems(
          files.map((file, index) => ({
            index,
            name: `Image ${index + 1}`,
            image: URL.createObjectURL(file),
          }))
        );
      }
    };
    convertURLsToFileObjects();
  }, [props.downloadURLs, props.setImageFiles]);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setItems((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    setOrderedImageFiles((array) =>
      arrayMoveImmutable(array, oldIndex, newIndex)
    );
    props.setImageFiles((array) =>
      arrayMoveImmutable(array, oldIndex, newIndex)
    );
  };

  return (
    <div className="flex bg-[#d2d2d244] z-0 rounded-lg flex-col h-fit w-full top-0 bottom-0 left-0 right-0 m-auto">
      <button
        type="button"
        className=" ml-auto z-10 w-fit mr-2 text-sm bg-red-300 text-white px-1 h-fit rounded-full cursor-pointer"
        onClick={() => {
          setState({
            ...state,
            imgUploadPopUp: false,
          });
        }}>
        X
      </button>
      <div
        {...getRootProps({
          className:
            "w-full flex h-full m-auto cursor-pointer p-4 text-center ",
        })}>
        <input {...getInputProps()} />
        <p className="text-[#000000] m-auto text-base border-2 border-[#939393] p-4">
          Drag and drop image(s) here, or click to select files
        </p>
      </div>

      <div className="border-y-2 border-gray-400 py-2">
        <p className="text-center text-base">
          You can upload up to 15 images. Drag to rearrange the order. The first
          image will be the cover image.
        </p>
      </div>
      <div className=" max-h-[50vh]  overflow-y-auto border-[#939393] pt-4">
        <SortableList
          onSortEnd={onSortEnd}
          draggedItemClassName="dragged"
          className="grid grid-cols-1 md:grid-cols-3 select-none gap-4 z-0">
          {items.map(({ image, name, index }) => (
            <div
              key={name}
              className={` flex ${
                index == items[0].index && "border-4 border-blue-500"
              }   justify-center  m-auto`}>
              <SortableItem>
                <div className="drag-item relative w-[200px] h-[200px] pointer-events-none">
                  <Image
                    className="m-auto object-cover"
                    fill
                    alt={name}
                    src={image}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute pointer-events-auto z-[1000] text-sm top-2 right-2 bg-red-300 text-white px-1 h-fit rounded-full cursor-pointer">
                    X
                  </button>
                </div>
              </SortableItem>
            </div>
          ))}
        </SortableList>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default BecomeMemberDropzone;
