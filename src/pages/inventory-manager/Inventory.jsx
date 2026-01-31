function Inventory() {
  return (
    <div className="sm:px-10 px-2">
      <div className="flex justify-between items-center mt-20">
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold tracking-[-3px]">Hi there,</h1>
          <p className="font-thin text-2xl tracking-normal">
            {/* {currentUser.user.email} */}inv.manager@gmail.com
          </p>
        </div>
        <button
          // onClick={logout}
          className="cursor-pointer rounded-md hover:text-gray-600 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Inventory;
