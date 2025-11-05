import { Menu, X } from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { navItems } from "./constants/index";
import { useDarkMode } from "../../../Contexts/DarkModeWrapper";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { logoutUser } from "../../../constants/apiCalls";
import { useRecoilState } from "recoil";
import { userData } from "../../../atoms/state";
import ModalWrapper from "../../../common/ModalWrapper";
import Confirmation from "../../Auth/components/confirmation";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { mode, toggleMode } = useDarkMode();
  const [currUser, setCurrUser] = useRecoilState(userData);
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  const navigate = useNavigate();

  const hadleLogOut = () =>
    logoutUser().then((res) => {
      if (res) {
        setCurrUser(null);
        navigate("/login");
      }
    });

  return (
    <nav
      className={`sticky  dark:text-white  top-0 z-[100] py-3   shadow-sm  border-neutral-700/80  ${
        mobileDrawerOpen ? "max-sm:dark:bg-stone-900 max-sm:bg-white" : ""
      }`}
    >
      <ModalWrapper open={isModalOpen} setOpenModal={setModalOpen}>
        <Confirmation handler={hadleLogOut} setOpenModal={setModalOpen} />
      </ModalWrapper>

      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <Link to={"/"} className="flex items-center flex-shrink-0">
            <div
              className={`text-2xl md:pl-2 text-blue-600 font-bold ${
                !open && "hidden"
              }`}
            >
              👋
              <span className="text-gray-700 ml-2 dark:text-gray-100 ">
                BharatChat
              </span>
            </div>
          </Link>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-4 items-center">
            {!mode ? (
              <MdDarkMode
                className="text-2xl text-stone-800  dark:text-gray-100 cursor-pointer "
                onClick={toggleMode}
              />
            ) : (
              <MdLightMode
                className="text-2xl text-stone-800 dark:text-gray-100 cursor-pointer"
                onClick={toggleMode}
              />
            )}

            {currUser ? (
              <>
                <button
                  onClick={() => {
                    setModalOpen(true);
                  }}
                  className="py-2 px-3 border rounded-md"
                >
                  Log out
                </button>

                <button
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                  className="py-2 px-3 border rounded-md bg-blue-700 text-white font-semibold"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <Link to={"/login"} className="py-2 px-3 border rounded-md">
                  Log In
                </Link>

                <Link
                  to="/signup"
                  className="bg-gradient-to-r text-white from-blue-500 to-blue-800 py-2 px-3 rounded-md"
                >
                  Create an account
                </Link>
              </>
            )}
          </div>
          <div className="lg:hidden  md:flex flex-col justify-end">
            <div className="flex space-x-4">
              {!mode ? (
                <MdDarkMode
                  className="text-2xl text-stone-800 dark:text-gray-100  cursor-pointer "
                  onClick={toggleMode}
                />
              ) : (
                <MdLightMode
                  className="text-2xl text-stone-800 dark:text-gray-100  cursor-pointer"
                  onClick={toggleMode}
                />
              )}
              <button onClick={toggleNavbar}>
                {mobileDrawerOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 shadow-md z-50 dark:text-white dark:bg-stone-900 bg-white w-full p-12 flex flex-col  lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6 z-50">
              {currUser ? (
                <>
                  <button
                    onClick={() =>
                      logoutUser().then((res) => {
                        if (res) {
                          setCurrUser(null);
                          navigate("/login");
                        }
                      })
                    }
                    className="py-2 px-3 border rounded-md"
                  >
                    Log out
                  </button>

                  <button
                    onClick={() => {
                      navigate("/dashboard");
                    }}
                    className="py-2 px-3 border rounded-md bg-blue-700 text-white font-semibold"
                  >
                    Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    // onClick={handleLogout}
                    className="py-2 px-3 border text-xs rounded-md"
                  >
                    Log in
                  </button>
                  <Link
                    to="/signup"
                    className="py-2 px-3 text-xs rounded-md bg-gradient-to-r from-blue-500 to-blue-800"
                  >
                    Create an account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
