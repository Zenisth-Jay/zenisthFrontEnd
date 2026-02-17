const WorkspaceCard = ({ icon, title, value }) => {
  return (
    <div className=" w-full p-4 flex items-center rounded-lg bg-indigo-50 border border-gray-300 relative">
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 border border-[#CFD1DC] absolute left-4">
        {icon}
      </div>
      <div className="flex flex-col pl-18 ">
        <span className=" text-[16px] font-semibold text-gray-700">
          {title.toUpperCase()}
        </span>
        <span className=" text-lg font-bold text-gray-800">{value}</span>
      </div>
    </div>
  );
};

export default WorkspaceCard;
