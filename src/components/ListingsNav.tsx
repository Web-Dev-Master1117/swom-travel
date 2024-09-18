// import { Slider } from '@material-tailwind/react';
// import Link from 'next/link';
// import React from 'react';
// import Datepicker from 'react-tailwindcss-datepicker';

// type Props = {};

// type MenuItem = {
//   label: string;
//   submenus: string[];
// };

// type OpenState = {
//   [id: number]: boolean;
// };
// const menuItems: MenuItem[] = [
//   {
//     label: 'Your Swap',
//     submenus: ['House', 'Cabins', 'Boats'], // Example submenu items
//   },
//   {
//     label: 'Location',
//     submenus: ['EUROPE', 'AMERICA', 'AFRICA', 'OCEANIA', 'ASIA'], // Example submenu items
//   },
// ];

// const ListingsNav = (props: Props) => {
//   const [isOpen, setIsOpen] = React.useState<OpenState>({});
//   const [isDateOpen, setIsDateOpen] = React.useState<boolean>(false);
//   const [isCostOpen, setIsCostOpen] = React.useState<boolean>(false);
//   const [sliderValue, setSliderValue] = React.useState<number>(500);
//   const [isGuestOpen, setIsGuestOpen] = React.useState<boolean>(false);
//   const [totalGuests, setTotalGuests] = React.useState({
//     adults: 0,
//     kids: 0,
//     pets: 0,
//   });
//   const [value, setValue] = React.useState({
//     startDate: new Date(),
//     endDate: new Date(new Date().setMonth(1)),
//   });
//   const [mobileActive, setMobileActive] = React.useState(false);

//   const handleValueChange = (newValue: any) => {
//     console.log('newValue:', newValue);
//     setValue(newValue);
//   };

//   const totalGuestsCount =
//     totalGuests.adults + totalGuests.kids + totalGuests.pets;

//   return (
//     <div className="w-full relative bg-white flex pb-4 pt-6 h-full border-b-[1px] border-[#6C7186]">
//       <div className=" hidden lg:flex w-10/12 justify-evenly mx-auto ">
//         {menuItems.map((menuItem, id) => (
//           <div
//             onMouseLeave={() => {
//               setIsOpen((prev) => {
//                 const newState: OpenState = {};
//                 Object.keys(prev).forEach((key: any) => {
//                   newState[key] = false;
//                 });
//                 return newState;
//               });
//             }}
//             key={id}
//             className="relative  w-1/6">
//             <div
//               onMouseEnter={() => {
//                 setIsOpen((prev) => {
//                   const newState: OpenState = {};
//                   Object.keys(prev).forEach((key: any) => {
//                     newState[key] = false;
//                   });
//                   newState[id] = true;
//                   return newState;
//                 });
//               }}
//               className="flex gap-2 justify-center w-full menu-item"
//               key={id}>
//               {menuItem.label}
//               <svg
//                 className={`my-auto transform arrow-icon ${
//                   isOpen[id] ? 'rotate-180' : ''
//                 }`}
//                 width="10px"
//                 height="10px"
//                 viewBox="0 -4.5 20 20"
//                 version="1.1"
//                 xmlns="http://www.w3.org/2000/svg"
//                 xmlnsXlink="http://www.w3.org/1999/xlink">
//                 <title>arrow_down [#338]</title>
//                 <desc>Created with Sketch.</desc>
//                 <defs></defs>
//                 <g
//                   id="Page-1"
//                   stroke="none"
//                   stroke-width="1"
//                   fill="none"
//                   fill-rule="evenodd">
//                   <g
//                     id="Dribbble-Light-Preview"
//                     transform="translate(-220.000000, -6684.000000)"
//                     fill="#000000">
//                     <g id="icons" transform="translate(56.000000, 160.000000)">
//                       <path
//                         d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583"
//                         id="arrow_down-[#338]"></path>
//                     </g>
//                   </g>
//                 </g>
//               </svg>
//             </div>
//             <div
//               onMouseLeave={() => {
//                 setIsOpen((prevIsOpen) => {
//                   return {
//                     ...prevIsOpen,
//                     [id]: false,
//                   };
//                 });
//               }}
//               className={`absolute z-10 top-full right-0 w-fit  mx-auto left-0 bg-white shadow-md ${
//                 isOpen[id] ? 'flex' : 'hidden'
//               } submenu`}>
//               <ul className="text-center w-full ">
//                 {menuItem.submenus.map((submenuItem, subId) => (
//                   <Link
//                     className="text-center w-fit m-auto flex justify-center border-b-[1px] py-2 px-6 border-[#d1d8f1]"
//                     href="/listings"
//                     key={subId}>
//                     <li className="cursor-pointer  flex">{submenuItem}</li>
//                   </Link>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         ))}
//         <div
//           onMouseLeave={() => {
//             setIsDateOpen(false);
//           }}
//           className="relative  w-1/6">
//           <div
//             onMouseEnter={() => {
//               setIsDateOpen(true);
//             }}
//             className="flex gap-2 justify-center w-full menu-item">
//             Date{' '}
//             <svg
//               className={`my-auto transform arrow-icon ${
//                 isDateOpen ? 'rotate-180' : ''
//               }`}
//               width="10px"
//               height="10px"
//               viewBox="0 -4.5 20 20"
//               version="1.1"
//               xmlns="http://www.w3.org/2000/svg"
//               xmlnsXlink="http://www.w3.org/1999/xlink">
//               <title>arrow_down [#338]</title>
//               <desc>Created with Sketch.</desc>
//               <defs></defs>
//               <g
//                 id="Page-1"
//                 stroke="none"
//                 stroke-width="1"
//                 fill="none"
//                 fill-rule="evenodd">
//                 <g
//                   id="Dribbble-Light-Preview"
//                   transform="translate(-220.000000, -6684.000000)"
//                   fill="#000000">
//                   <g id="icons" transform="translate(56.000000, 160.000000)">
//                     <path
//                       d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583"
//                       id="arrow_down-[#338]"></path>
//                   </g>
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <div
//             onMouseLeave={() => {
//               setIsDateOpen(false);
//             }}
//             className={`absolute w-[250px] z-10 top-full right-0   mx-auto left-0 bg-white shadow-md ${
//               isDateOpen ? 'flex' : 'hidden'
//             } submenu`}>
//             <Datepicker
//               placeholder={'Select Dates'}
//               displayFormat={'MM/DD/YYYY'}
//               inputClassName=" px-4 py-2 w-full rounded-md focus:ring-0 font-normal "
//               value={value}
//               onChange={handleValueChange}
//             />
//           </div>
//         </div>
//         <div
//           onMouseLeave={() => {
//             setIsCostOpen(false);
//           }}
//           className="relative  w-1/6">
//           <div
//             onMouseEnter={() => {
//               setIsCostOpen(true);
//             }}
//             className="flex gap-2 justify-center w-full menu-item">
//             How Much{' '}
//             <svg
//               className={`my-auto transform arrow-icon ${
//                 isCostOpen ? 'rotate-180' : ''
//               }`}
//               width="10px"
//               height="10px"
//               viewBox="0 -4.5 20 20"
//               version="1.1"
//               xmlns="http://www.w3.org/2000/svg"
//               xmlnsXlink="http://www.w3.org/1999/xlink">
//               <title>arrow_down [#338]</title>
//               <desc>Created with Sketch.</desc>
//               <defs></defs>
//               <g
//                 id="Page-1"
//                 stroke="none"
//                 stroke-width="1"
//                 fill="none"
//                 fill-rule="evenodd">
//                 <g
//                   id="Dribbble-Light-Preview"
//                   transform="translate(-220.000000, -6684.000000)"
//                   fill="#000000">
//                   <g id="icons" transform="translate(56.000000, 160.000000)">
//                     <path
//                       d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583"
//                       id="arrow_down-[#338]"></path>
//                   </g>
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <div
//             onMouseLeave={() => {
//               setIsCostOpen(false);
//             }}
//             className={`absolute z-20 top-full right-0 w-[200px] py-4   mx-auto left-0 bg-white shadow-md ${
//               isCostOpen ? 'flex flex-col' : 'hidden'
//             } submenu`}>
//             <h3 className="w-full px-4 pb-2 border-b-[1px] border-gray-500">
//               Price Range ${sliderValue}
//             </h3>
//             {/* create a slider */}
//             <div className="flex flex-col mt-4 px-2 py-4  relative justify-between">
//               <Slider
//                 value={sliderValue / 10}
//                 max={100}
//                 min={1}
//                 step={1}
//                 onChange={(e) => {
//                   if (Math.round(parseFloat(e.target.value)) > 0) {
//                     console.log(Math.round(parseFloat(e.target.value) * 10));

//                     setSliderValue(Math.round(parseFloat(e.target.value) * 10));
//                   }
//                 }}
//                 className="text-[#4c4c4c] rounded-xl relative min-w-0 max-w-full"
//                 barClassName="rounded-xl bg-[#7F8119]"
//                 // thumbClassName="[&::-moz-range-thumb]:rounded-none [&::-webkit-slider-thumb]:rounded-none [&::-moz-range-thumb]:-mt-[4px] [&::-webkit-slider-thumb]:-mt-[4px]"
//                 // trackClassName="[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent rounded-none !bg-[#7F8119]/10 border border-[#7F8119]/20"
//               />
//               <div className="flex mt-2 justify-between">
//                 <p className="text-xs">MIN</p>
//                 <p className="text-xs">MAX</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div
//           onMouseLeave={() => {
//             setIsGuestOpen(false);
//           }}
//           className="relative  w-1/6">
//           <div
//             onMouseEnter={() => {
//               setIsGuestOpen(true);
//             }}
//             className="flex gap-2 justify-center w-full menu-item">
//             How Many{' '}
//             <svg
//               className={`my-auto transform arrow-icon ${
//                 isGuestOpen ? 'rotate-180' : ''
//               }`}
//               width="10px"
//               height="10px"
//               viewBox="0 -4.5 20 20"
//               version="1.1"
//               xmlns="http://www.w3.org/2000/svg"
//               xmlnsXlink="http://www.w3.org/1999/xlink">
//               <title>arrow_down [#338]</title>
//               <desc>Created with Sketch.</desc>
//               <defs></defs>
//               <g
//                 id="Page-1"
//                 stroke="none"
//                 stroke-width="1"
//                 fill="none"
//                 fill-rule="evenodd">
//                 <g
//                   id="Dribbble-Light-Preview"
//                   transform="translate(-220.000000, -6684.000000)"
//                   fill="#000000">
//                   <g id="icons" transform="translate(56.000000, 160.000000)">
//                     <path
//                       d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583"
//                       id="arrow_down-[#338]"></path>
//                   </g>
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <div
//             onMouseLeave={() => {
//               setIsGuestOpen(false);
//             }}
//             className={`absolute z-20 top-full right-0 w-[200px] py-4   mx-auto left-0 bg-white shadow-md ${
//               isGuestOpen ? 'flex flex-col' : 'hidden'
//             } submenu`}>
//             <h3 className="w-full uppercase text-xs px-4 pb-2 border-b-[1px] border-gray-500">
//               Capacity for <strong>{totalGuestsCount}</strong> people
//             </h3>
//             {/* create a slider */}
//             <div className="flex flex-col px-4 py-2  relative justify-between">
//               <div className="flex justify-between py-2 border-b-2 border-gray-200">
//                 <label htmlFor="">Adults</label>
//                 {/* a slider with decrese and increase button that looks like this - 2 + */}
//                 <div className="flex gap-[1px] justify-center">
//                   <button
//                     onClick={() => {
//                       if (totalGuests.adults > 0) {
//                         setTotalGuests({
//                           ...totalGuests,
//                           adults: totalGuests.adults - 1,
//                         });
//                       }
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     -
//                   </button>
//                   <p className="w-6 h-6 rounded-full flex justify-center items-center">
//                     {totalGuests.adults}
//                   </p>
//                   <button
//                     onClick={() => {
//                       setTotalGuests({
//                         ...totalGuests,
//                         adults: totalGuests.adults + 1,
//                       });
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     +
//                   </button>
//                 </div>
//               </div>

//               <div className="flex justify-between py-2 border-b-2 border-gray-200">
//                 <label htmlFor="">Kids</label>
//                 {/* a slider with decrese and increase button that looks like this - 2 + */}
//                 <div className="flex gap-[1px] justify-center">
//                   <button
//                     onClick={() => {
//                       if (totalGuests.kids > 0) {
//                         setTotalGuests({
//                           ...totalGuests,
//                           kids: totalGuests.kids - 1,
//                         });
//                       }
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     -
//                   </button>
//                   <p className="w-6 h-6 rounded-full flex justify-center items-center">
//                     {totalGuests.kids}
//                   </p>
//                   <button
//                     onClick={() => {
//                       setTotalGuests({
//                         ...totalGuests,
//                         kids: totalGuests.kids + 1,
//                       });
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     +
//                   </button>
//                 </div>
//               </div>

//               <div className="flex justify-between py-2 ">
//                 <label htmlFor="">Pets</label>
//                 {/* a slider with decrese and increase button that looks like this - 2 + */}
//                 <div className="flex gap-[1px] justify-center">
//                   <button
//                     onClick={() => {
//                       if (totalGuests.pets > 0) {
//                         setTotalGuests({
//                           ...totalGuests,
//                           pets: totalGuests.pets - 1,
//                         });
//                       }
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     -
//                   </button>
//                   <p className="w-6 h-6 rounded-full flex justify-center items-center">
//                     {totalGuests.pets}
//                   </p>
//                   <button
//                     onClick={() => {
//                       setTotalGuests({
//                         ...totalGuests,
//                         pets: totalGuests.pets + 1,
//                       });
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     +
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         Listing ___
//       </div>

//       <div className="lg:hidden mr-auto px-4">
//         <button onClick={() => setMobileActive(!mobileActive)}>
//           <svg
//             width="20"
//             height="20"
//             viewBox="0 0 20 20"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg">
//             <path
//               d="M1.66667 3.33333H18.3333V5.83333H1.66667V3.33333ZM1.66667 8.33333H18.3333V10.8333H1.66667V8.33333ZM1.66667 13.3333H18.3333V15.8333H1.66667V13.3333Z"
//               fill="#000000"
//             />
//           </svg>
//         </button>
//       </div>

//       <div
//         style={{
//           maxHeight: mobileActive ? '100vh' : '0',
//           borderTop: mobileActive ? '1px solid #a9a9a9' : 'none',
//           padding: mobileActive ? '5px 0' : '0',
//           overflow: mobileActive ? 'visible' : 'hidden',
//           opacity: mobileActive ? '1' : '0',
//         }}
//         className={`lg:hidden z-20 w-full ${
//           !mobileActive && 'overflow-hidden'
//         }  align-middle  gap-4 box-border top-full flex flex-col justify-center text-center transition-all duration-300 ease-in-out  max-h-[100vh] right-0 bg-[#F4ECE8]  absolute`}>
//         {menuItems.map((menuItem, id) => (
//           <div key={id} className="relative px-4  w-fit">
//             <div
//               onClick={() => {
//                 setIsOpen((prev) => {
//                   const newState: OpenState = {};
//                   Object.keys(prev).forEach((key: any) => {
//                     newState[key] = false;
//                   });
//                   newState[id] = !prev[id];
//                   return newState;
//                 });
//               }}
//               className="flex gap-2 justify-center w-fit menu-item"
//               key={id}>
//               {menuItem.label}
//               <svg
//                 className={`my-auto transform arrow-icon ${
//                   isOpen[id] ? 'rotate-180' : ''
//                 }`}
//                 width="10px"
//                 height="10px"
//                 viewBox="0 -4.5 20 20"
//                 version="1.1"
//                 xmlns="http://www.w3.org/2000/svg"
//                 xmlnsXlink="http://www.w3.org/1999/xlink">
//                 <title>arrow_down [#338]</title>
//                 <desc>Created with Sketch.</desc>
//                 <defs></defs>
//                 <g
//                   id="Page-1"
//                   stroke="none"
//                   stroke-width="1"
//                   fill="none"
//                   fill-rule="evenodd">
//                   <g
//                     id="Dribbble-Light-Preview"
//                     transform="translate(-220.000000, -6684.000000)"
//                     fill="#000000">
//                     <g id="icons" transform="translate(56.000000, 160.000000)">
//                       <path
//                         d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583"
//                         id="arrow_down-[#338]"></path>
//                     </g>
//                   </g>
//                 </g>
//               </svg>
//             </div>

//             <div
//               onClick={() => {
//                 setIsOpen((prevIsOpen) => {
//                   return {
//                     ...prevIsOpen,
//                     [id]: false,
//                   };
//                 });
//               }}
//               className={`absolute z-[2000] top-0 left-full w-fit  mx-auto  bg-white shadow-md ${
//                 isOpen[id] ? 'flex' : 'hidden'
//               } submenu`}>
//               <ul className="text-center z-[2000] w-full ">
//                 {menuItem.submenus.map((submenuItem, subId) => (
//                   <Link
//                     className="text-center w-fit m-auto flex justify-center border-b-[1px] py-2 px-6 border-[#d1d8f1]"
//                     href="/listings"
//                     key={subId}>
//                     <li className="cursor-pointer  flex">{submenuItem}</li>
//                   </Link>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         ))}
//         <div className="relative  w-fit">
//           <div
//             onClick={() => {
//               setIsDateOpen(!isDateOpen);
//             }}
//             className="flex gap-2 px-4 justify-center w-fit menu-item">
//             Date{' '}
//             <svg
//               className={`my-auto transform arrow-icon ${
//                 isDateOpen ? 'rotate-180' : ''
//               }`}
//               width="10px"
//               height="10px"
//               viewBox="0 -4.5 20 20"
//               version="1.1"
//               xmlns="http://www.w3.org/2000/svg"
//               xmlnsXlink="http://www.w3.org/1999/xlink">
//               <title>arrow_down [#338]</title>
//               <desc>Created with Sketch.</desc>
//               <defs></defs>
//               <g
//                 id="Page-1"
//                 stroke="none"
//                 stroke-width="1"
//                 fill="none"
//                 fill-rule="evenodd">
//                 <g
//                   id="Dribbble-Light-Preview"
//                   transform="translate(-220.000000, -6684.000000)"
//                   fill="#000000">
//                   <g id="icons" transform="translate(56.000000, 160.000000)">
//                     <path
//                       d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583"
//                       id="arrow_down-[#338]"></path>
//                   </g>
//                 </g>
//               </g>
//             </svg>
//           </div>

//           <div
//             className={`absolute w-[250px] z-10 top-0  left-full   mx-auto bg-white shadow-md ${
//               isDateOpen ? 'flex' : 'hidden'
//             } submenu`}>
//             <Datepicker
//               placeholder={'Select Dates'}
//               displayFormat={'MM/DD/YYYY'}
//               inputClassName=" px-4 py-2 w-full rounded-md focus:ring-0 font-normal "
//               value={value}
//               onChange={handleValueChange}
//             />
//           </div>
//         </div>
//         <div className="relative  ">
//           <div
//             onClick={() => {
//               setIsCostOpen(!isCostOpen);
//             }}
//             className="flex gap-2 justify-center w-fit px-4 menu-item">
//             How Much{' '}
//             <svg
//               className={`my-auto transform arrow-icon ${
//                 isCostOpen ? 'rotate-180' : ''
//               }`}
//               width="10px"
//               height="10px"
//               viewBox="0 -4.5 20 20"
//               version="1.1"
//               xmlns="http://www.w3.org/2000/svg"
//               xmlnsXlink="http://www.w3.org/1999/xlink">
//               <title>arrow_down [#338]</title>
//               <desc>Created with Sketch.</desc>
//               <defs></defs>
//               <g
//                 id="Page-1"
//                 stroke="none"
//                 stroke-width="1"
//                 fill="none"
//                 fill-rule="evenodd">
//                 <g
//                   id="Dribbble-Light-Preview"
//                   transform="translate(-220.000000, -6684.000000)"
//                   fill="#000000">
//                   <g id="icons" transform="translate(56.000000, 160.000000)">
//                     <path
//                       d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583"
//                       id="arrow_down-[#338]"></path>
//                   </g>
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <div
//             className={`absolute z-50 top-0 right-0 left-0 w-[200px] py-4  mx-auto bg-white shadow-md ${
//               isCostOpen ? 'flex flex-col' : 'hidden'
//             } submenu`}>
//             <h3 className="w-full px-4 pb-2 border-b-[1px] border-gray-500">
//               Price Range ${sliderValue}
//             </h3>
//             {/* create a slider */}
//             <div className="flex flex-col mt-4 px-2 py-4  relative justify-between">
//               <Slider
//                 value={sliderValue / 10}
//                 max={100}
//                 min={1}
//                 step={1}
//                 onChange={(e) => {
//                   if (Math.round(parseFloat(e.target.value)) > 0) {
//                     console.log(Math.round(parseFloat(e.target.value) * 10));

//                     setSliderValue(Math.round(parseFloat(e.target.value) * 10));
//                   }
//                 }}
//                 className="text-[#4c4c4c] rounded-xl relative min-w-0 max-w-full"
//                 barClassName="rounded-xl bg-[#7F8119]"
//                 // thumbClassName="[&::-moz-range-thumb]:rounded-none [&::-webkit-slider-thumb]:rounded-none [&::-moz-range-thumb]:-mt-[4px] [&::-webkit-slider-thumb]:-mt-[4px]"
//                 // trackClassName="[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent rounded-none !bg-[#7F8119]/10 border border-[#7F8119]/20"
//               />
//               <div className="flex mt-2 justify-between">
//                 <p className="text-xs">MIN</p>
//                 <p className="text-xs">MAX</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="relative  ">
//           <div
//             onClick={() => {
//               setIsGuestOpen(!isGuestOpen);
//             }}
//             className="flex gap-2 px-4 justify-center w-fit menu-item">
//             How Many{' '}
//             <svg
//               className={`my-auto transform arrow-icon ${
//                 isGuestOpen ? 'rotate-180' : ''
//               }`}
//               width="10px"
//               height="10px"
//               viewBox="0 -4.5 20 20"
//               version="1.1"
//               xmlns="http://www.w3.org/2000/svg"
//               xmlnsXlink="http://www.w3.org/1999/xlink">
//               <title>arrow_down [#338]</title>
//               <desc>Created with Sketch.</desc>
//               <defs></defs>
//               <g
//                 id="Page-1"
//                 stroke="none"
//                 stroke-width="1"
//                 fill="none"
//                 fill-rule="evenodd">
//                 <g
//                   id="Dribbble-Light-Preview"
//                   transform="translate(-220.000000, -6684.000000)"
//                   fill="#000000">
//                   <g id="icons" transform="translate(56.000000, 160.000000)">
//                     <path
//                       d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583"
//                       id="arrow_down-[#338]"></path>
//                   </g>
//                 </g>
//               </g>
//             </svg>
//           </div>
//           <div
//             onClick={() => {
//               setIsGuestOpen(!isGuestOpen);
//             }}
//             className={`absolute z-20 top-full right-0 w-[200px] py-4   mx-auto left-0 bg-white shadow-md ${
//               isGuestOpen ? 'flex flex-col' : 'hidden'
//             } submenu`}>
//             <h3 className="w-full uppercase text-xs px-4 pb-2 border-b-[1px] border-gray-500">
//               Capacity for <strong>{totalGuestsCount}</strong> people
//             </h3>
//             {/* create a slider */}
//             <div className="flex flex-col px-4 py-2  relative justify-between">
//               <div className="flex justify-between py-2 border-b-2 border-gray-200">
//                 <label htmlFor="">Adults</label>
//                 {/* a slider with decrese and increase button that looks like this - 2 + */}
//                 <div className="flex gap-[1px] justify-center">
//                   <button
//                     onClick={() => {
//                       if (totalGuests.adults > 0) {
//                         setTotalGuests({
//                           ...totalGuests,
//                           adults: totalGuests.adults - 1,
//                         });
//                       }
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     -
//                   </button>
//                   <p className="w-6 h-6 rounded-full flex justify-center items-center">
//                     {totalGuests.adults}
//                   </p>
//                   <button
//                     onClick={() => {
//                       setTotalGuests({
//                         ...totalGuests,
//                         adults: totalGuests.adults + 1,
//                       });
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     +
//                   </button>
//                 </div>
//               </div>

//               <div className="flex justify-between py-2 border-b-2 border-gray-200">
//                 <label htmlFor="">Kids</label>
//                 {/* a slider with decrese and increase button that looks like this - 2 + */}
//                 <div className="flex gap-[1px] justify-center">
//                   <button
//                     onClick={() => {
//                       if (totalGuests.kids > 0) {
//                         setTotalGuests({
//                           ...totalGuests,
//                           kids: totalGuests.kids - 1,
//                         });
//                       }
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     -
//                   </button>
//                   <p className="w-6 h-6 rounded-full flex justify-center items-center">
//                     {totalGuests.kids}
//                   </p>
//                   <button
//                     onClick={() => {
//                       setTotalGuests({
//                         ...totalGuests,
//                         kids: totalGuests.kids + 1,
//                       });
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     +
//                   </button>
//                 </div>
//               </div>

//               <div className="flex justify-between py-2 ">
//                 <label htmlFor="">Pets</label>
//                 {/* a slider with decrese and increase button that looks like this - 2 + */}
//                 <div className="flex gap-[1px] justify-center">
//                   <button
//                     onClick={() => {
//                       if (totalGuests.pets > 0) {
//                         setTotalGuests({
//                           ...totalGuests,
//                           pets: totalGuests.pets - 1,
//                         });
//                       }
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     -
//                   </button>
//                   <p className="w-6 h-6 rounded-full flex justify-center items-center">
//                     {totalGuests.pets}
//                   </p>
//                   <button
//                     onClick={() => {
//                       setTotalGuests({
//                         ...totalGuests,
//                         pets: totalGuests.pets + 1,
//                       });
//                     }}
//                     className="w-6 h-6 rounded-full  flex justify-center items-center">
//                     +
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-fit px-4">Listing ___</div>
//       </div>

//       <style jsx>{`
//         .arrow-icon {
//           transition: transform 0.3s ease-in-out;
//         }

//         .rotate-180 {
//           transform: rotate(180deg);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ListingsNav;
