import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ToggleIcon from "./ToggleIcon";
import Logo from "./Logo";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";

const Main = () => {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [sideBarWidth, setSideBarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const handleToggleSideBar = () => {
    setToggleSidebar((prev) => !prev);
    console.log("clicked");
  };
  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseDown = () => {
    setIsResizing(true);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 150 && newWidth < 400) {
        setSideBarWidth(newWidth);
        console.log("new width id", newWidth);
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  //close sidebar if clicked outside
  const handleCloseSidebar = (e: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
      setToggleSidebar(false);
    }
  };
  useEffect(() => {
    if (toggleSidebar) {
      document.addEventListener("mousedown", handleCloseSidebar);
    } else {
      document.removeEventListener("mousedown", handleCloseSidebar);
    }
    return () => {
      document.removeEventListener("mousedown", handleCloseSidebar);
    };
  }, [toggleSidebar]);
  return (
    <div className="flex  ">
      {/*Sidebar*/}
      <div className=" flex bg-green-200 ">
        {toggleSidebar ? (
          <div
            ref={sidebarRef}
            style={{ width: `${sideBarWidth}px` }}
            className={`bg-[#20131d] text-[#f9f8fb]  h-screen  relative   flex flex-col p-2 gap-2`}
          >
            <div className="flex ">
              <Button
                className="text-white p-0  "
                onClick={handleToggleSideBar}
              >
                <ToggleIcon />

                <Link href="/">
                  <Logo />
                </Link>
              </Button>
            </div>

            <div className=" text-center w-full ">
              <Button className="bg-[#A3004c33] justify-center   w-full border   text-sm hover:bg-[#a3004c75] text-[#fbd0e8] border-[#b04680] px-2 py-1 text-center">
                New Chat
              </Button>
            </div>
            <div className="   flex items-center  w-full ">
              <CiSearch className="absolute left-2  " size={16} />
              <Input
                className=" focus:outline-none focus:ring-0 border-0 placeholder:text-sm pl-6 text-sm"
                id="search"
                type="text"
                placeholder="search your chats"
              />
              <button>
                {" "}
                <IoIosClose size={18} />
              </button>
            </div>
            {/* Resizer handle */}
            <div
              onMouseDown={handleMouseDown}
              className="absolute bg-transparent w-1 top-0 right-0 h-full  hover:cursor-col-resize"
            ></div>
          </div>
        ) : (
          <p>:</p>
        )}

        <div className="flex flex-col text-white  ">
          <div className="  p-2 bg-purple-950 md:hidden">
            <Button className="text-white p-0" onClick={handleToggleSideBar}>
              <ToggleIcon />
            </Button>
            <Button className="text-white p-0  ">
              <div className="p-1 font-bold  rounded hover:bg-white/10 cursor-pointer">
                <CiSearch />
              </div>
            </Button>
          </div>
          <h1>How can I help you?</h1>
          <div>
            <button>Create</button>
            <button>Explore</button>
            <button>Code</button>
            <button>Learn</button>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default Main;
