import React, { useContext, useEffect, useState } from "react";
import LoginContext from "../../contexts/loginContext";
import { MdEventAvailable } from "react-icons/md";
import supabase from "../../utils/supabase";

function TechniciansDashboard() {
  const [searchTerm, setSearchInput] = useState("");
  const { currentUser } = useContext(LoginContext);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchTerm) return;

      const { data } = await supabase
        .from("equipments")
        .select("*")
        .or(
          `product_name.ilike.%${searchTerm}%,product_desc.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,sub_category.ilike.%${searchTerm}%`,
        );

      setResults(data);
      console.log(data);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };
  return (
    <div className="px-10">
      {/* for title and user email */}
      <div className="flex flex-col mt-20">
        <h1 className="text-5xl font-bold tracking-[-3px]">Hi there,</h1>
        <p className="font-thin text-2xl tracking-normal ">
          {currentUser?.user?.email}
        </p>
      </div>
      {/* for buttons  */}
      <div>
        <div className="max-w-fit border-2 border-blue-200 mt-10 p-5 rounded-lg cursor-pointer hover:bg-[#f3f3e9] transition-all duration-200">
          <p className="font-extrabold text-lg tracking-tight ">
            Upcoming events
            <MdEventAvailable size={20} className="inline-block ml-1" />
          </p>
          <p className="font-light text-sm text-gray-600">
            See all the details of upcoming events assigned to you
          </p>
        </div>
      </div>
      {/* for search bar */}
      <div>
        <input
          onChange={handleSearchChange}
          type="text"
          placeholder="Search equipments..."
          className="mt-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100"
        />
      </div>
      {/* main content */}
      <div className="mt-10">
        {results && results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-bold text-lg tracking-tight">
                  {item.product_name}
                </h3>
                <p className="text-gray-500 text-sm ">
                  Quantity -
                  <span className="font-semibold text-gray-800 text-lg">
                    {" "}
                    {item.product_qty}
                  </span>
                </p>
                <p className="">
                  {item.category} | {item.sub_category}
                </p>
                <p className=" text-gray-700 text-sm">{item.product_desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}

export default TechniciansDashboard;
