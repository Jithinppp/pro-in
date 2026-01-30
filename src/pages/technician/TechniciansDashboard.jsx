import React from "react";

function TechniciansDashboard() {
  return (
    <div className=" min-h-screen flex flex-col">
      <div className="bg-white mt-7  m-4 p-4 rounded-[100px]">
        <ul className="flex justify-center items-center gap-8 font-light">
          <li className="bg-black px-4 py-2 cursor-pointer  text-white rounded-[100px]">
            Dashboard
          </li>
          <li>Events</li>
        </ul>
      </div>
      <div className="flex items-center justify-between m-4 p-4">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tighter">
            Hey, Jithin
          </h1>
          <p className="mt-2 caret-gray-900">welcome back!</p>
        </div>
        <div className="mx-8 ">
          <p className="text-2xl font-bold">15</p>
          <p className="italic">Tuesday</p>
          <p>October</p>
        </div>
      </div>
    </div>
  );
}

export default TechniciansDashboard;

// old code:
// import { useQuery } from "@tanstack/react-query";
// import supabase from "../../utils/supabase";
// import SearchItems from "../../components/SearchItems";

// async function getEquipments() {
//   const data = await supabase.from("equipments").select("*");
//   return data.data;
// }

// function TechniciansDashboard() {
//   const { data, isLoading } = useQuery({
//     queryKey: ["equipments"],
//     queryFn: getEquipments,
//   });
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
//   return (
//     <div>
//       <h1>TechniciansDashboard</h1>
//       <h2>these are the equipments we have</h2>
//       {data.map((equipment) => (
//         <div key={equipment.id}>
//           <p>{equipment.product_name}</p>
//         </div>
//       ))}
//       <div>
//         <SearchItems />
//       </div>
//     </div>
//   );
// }

// export default TechniciansDashboard;

// // to able to search equipments by product_name, model_number, serial_number
// // to able to filter equipments by status (available, in use, under maintenance)
// // to able to see events
