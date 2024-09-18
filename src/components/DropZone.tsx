import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

type Props = {
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imageFiles: File[];
};

const DropZone: React.FC<Props> = (props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const [orderedImageFiles, setOrderedImageFiles] = useState<File[]>(
    props.imageFiles
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 2097152,
    onDropRejected: (fileRejections) => {
      const fileRejectionErrors = fileRejections.map((fileRejection) => {
        return fileRejection.errors.map((error) => error.message);
      });
      toast.error("Files can't be larger than 2MB");
    },
    onDrop: (acceptedFiles) => {
      const existingFileNames = orderedImageFiles.map((file) => file.name);
      const newImageFiles = acceptedFiles.filter(
        (file) => !existingFileNames.includes(file.name)
      );

      if (newImageFiles.length < acceptedFiles.length) {
        // Display a toast alert for duplicates
        toast.warn("Some images were not added as they are duplicates.");
      }

      // Combine the new files with the existing files
      const updatedImageFiles = [...orderedImageFiles, ...newImageFiles];

      props.setImageFiles(updatedImageFiles);
      setOrderedImageFiles(updatedImageFiles);
    },
  });

  console.log("orderedImageFiles", orderedImageFiles);

  // Function to handle reordering
  const handleOnDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(orderedImageFiles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedImageFiles(items);
    props.setImageFiles(items);
  };

  return (
    <div className="fixed bg-[#d2d2d2e9] z-10 rounded-lg flex flex-col h-fit w-2/3 top-0 bottom-0 left-0 right-0 m-auto">
      <button
        onClick={() => {
          setState({ ...state, imgUploadPopUp: false });
        }}
        className="w-fit ml-auto mr-[5%] mt-[2%] text-2xl">
        x
      </button>
      <div
        {...getRootProps({
          className:
            "w-full flex h-full m-auto cursor-pointer p-4 text-center ",
        })}>
        <input {...getInputProps()} />
        <p className="text-[#000000] m-auto text-xl border-2 border-[#939393] p-4">
          Drag and drop image(s) here, <br /> or click to select files
        </p>
      </div>
      <div className="border-t-2 max-h-[50vh] overflow-y-auto border-[#939393] pt-4">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppable">
            {(provided: any) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className=" flex flex-wrap justify-center w-fit gap-2 m-auto overflow-hidden">
                {orderedImageFiles.map((file, index) => (
                  <Draggable
                    key={file.name}
                    draggableId={file.name}
                    index={index}>
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="w-1/3 flex">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Uploaded Image ${index + 1}`}
                          className="m-auto"
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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

export default DropZone;
