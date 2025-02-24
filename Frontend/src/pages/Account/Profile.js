import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeAddress, selectUserInfo } from "../../store/features/user";
import AddAddress from "./AddAddress";
import { setLoading } from "../../store/features/common";
import { deleteAddressAPI } from "../../api/userInfo";

const Profile = () => {
  const userInfo = useSelector(selectUserInfo);
  const [addAddress, setAddAddress] = useState(false);
  const dispatch = useDispatch();

  const onDeleteAddress = useCallback((id) => {
    dispatch(setLoading(true));
    deleteAddressAPI(id)
      .then(() => {
        dispatch(removeAddress(id));
      })
      .catch(() => {})
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 md:px-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold border-b pb-4">My Account</h1>
        {!addAddress && (
          <div className="mt-6">
            <div className="flex items-center justify-between pb-4 border-b">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <button className="text-blue-600 underline">Edit</button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-gray-600 font-medium">Full Name</p>
                <p className="text-lg font-semibold">{userInfo?.firstName} {userInfo?.lastName}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Phone Number</p>
                <p className="text-lg font-semibold">{userInfo?.phoneNumber ?? "None"}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Email</p>
                <p className="text-lg font-semibold">{userInfo?.email}</p>
              </div>
            </div>
            {/* Addresses Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-xl font-semibold">My Address Book</h3>
                <button className="text-blue-600 underline" onClick={() => setAddAddress(true)}>Add New</button>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {userInfo?.addressList?.map((address, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                    <p className="font-semibold">{address?.name}</p>
                    <p className="text-gray-600">{address?.phoneNumber}</p>
                    <p className="text-gray-600">{address?.street}, {address?.city}, {address?.state}</p>
                    <p className="text-gray-600">{address?.zipCode}</p>
                    <div className="flex gap-4 mt-2">
                      <button className="text-blue-600 underline">Edit</button>
                      <button onClick={() => onDeleteAddress(address?.id)} className="text-red-600 underline">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {addAddress && <AddAddress onCancel={() => setAddAddress(false)} />}
      </div>
    </div>
  );
};

export default Profile;