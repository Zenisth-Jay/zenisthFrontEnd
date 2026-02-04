const Stepper = ({ steps = [], activeStep = 0, onStepChange = () => {} }) => {
  return (
    <div className="flex items-center flex-wrap gap-6">
      {steps.map((label, index) => {
        const isActive = index == activeStep;
        const isCompleted = index < activeStep;
        const isDisabled = index > activeStep;

        return (
          <div key={label} className="flex items-center gap-3">
            {/* Numbers */}
            <button
              type="button"
              disabled={isDisabled}
              // onClick={() => {
              //   if (!isDisabled) onStepChange(index);
              // }}
              className={` w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition
              ${
                isCompleted
                  ? " bg-indigo-600 border-indigo-900 text-white hover:opacity-90"
                  : isActive
                    ? " bg-gray-50 border border-gray-800 text-gray-800 cursor-default"
                    : " bg-gray-300 border-gray-100 text-gray-500"
              }
              
              `}
            >
              {index + 1}
            </button>

            <div
              className={`
                flex items-center gap-2 text-lg font-semibold ${isCompleted ? " text-indigo-600" : isActive ? " text-black" : " text-gray-400"}
            `}
            >
              {/* Label */}
              <span> {label} </span>

              {/* Separator */}
              {index <= activeStep && <span className=" mx-1 text-4xl">›</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
