import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { fetchUserDetails } from "../../api/userInfo";
import { loadUserInfo, selectUserInfo } from "../../store/features/user";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchUserDetails()
      .then((res) => {
        console.log("Fetched user details:", res);
        dispatch(loadUserInfo(res));
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, []);

  const isUserAdmin = 1;
  console.log(isUserAdmin);
  
  return (
    <div className="p-8">
      {userInfo?.email && (
        <>
          <p className="text-xl font-bold">Hello {userInfo?.firstName}</p>
          <p>Welcome to your account</p>
          <div className="md:flex mt-4">
            <ul className="lex-column space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
              <li>
                <NavLink
                  to={"/account-details/profile"}
                  className={({ isActive }) =>
                    [
                      isActive
                        ? "bg-black hover:bg-gray-400"
                        : "bg-gray-400 hover:bg-black",
                      "inline-flex items-center px-4 py-3 text-white rounded-lg active w-full",
                    ].join(" ")
                  }
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/account-details/orders"}
                  className={({ isActive }) =>
                    [
                      isActive
                        ? "bg-black hover:bg-gray-400"
                        : "bg-gray-400 hover:bg-black",
                      "inline-flex items-center px-4 py-3 text-white rounded-lg active w-full",
                    ].join(" ")
                  }
                >
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/account-details/settings"}
                  className={({ isActive }) =>
                    [
                      isActive
                        ? "bg-black hover:bg-gray-400"
                        : "bg-gray-400 hover:bg-black",
                      "inline-flex items-center px-4 py-3 text-white rounded-lg active w-full",
                    ].join(" ")
                  }
                >
                  Settings
                </NavLink>
              </li>
              {isUserAdmin && (
                <li>
                  <NavLink
                    to={"/admin"}
                    className={({ isActive }) =>
                      [
                        isActive
                          ? "bg-black hover:bg-gray-400"
                          : "bg-gray-400 hover:bg-black",
                        "inline-flex items-center px-4 py-3 text-white rounded-lg active w-full",
                      ].join(" ")
                    }
                  >
                    Manage Admin
                  </NavLink>
                </li>
              )}
            </ul>
            <div className="px-4 w-full rounded-lg">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Account;
