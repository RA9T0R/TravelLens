const Description = () => {
  return (
    <div className="bg-bg dark:bg-Dark_bg min-h-screen py-12 px-6 md:px-20 text-text dark:text-Dark_text">
      <div className="h-screen mx-auto">
        {/* Title */}
        <h1 className="text-xl md:text-3xl lg:text-5xl font-extrabold text-center mb-12">
          Machine Learning Project Overview
        </h1>

        {/* Bento Grid */}
        <div className="flex items-center justify-center w-full h-full">
          <div className="grid h-full w-full grid-cols-6 grid-rows-5 gap-4 bg-surface dark:bg-Dark_surface p-5 rounded-lg shadow-md shadow-black/25 text-xl md:text-3xl lg:text-5xl font-bold">
            <div className="col-span-6 md:col-span-2 md:row-span-3 flex flex-col bg-pink-200/50 rounded-lg shadow-md p-4">
              <div className="border h-full">

              </div>
              <h1 className="">Datasets</h1>
            </div>

            <div className="col-span-6 md:col-span-2 md:row-span-3 flex flex-col bg-lime-200/50 rounded-lg shadow-md p-4">
              <div className="border h-full">

              </div>
              <h1 className="">Input/Output</h1>
            </div>

            <div className="col-span-6 md:col-span-2 md:row-span-3 flex flex-col bg-yellow-200/50 rounded-lg shadow-md p-4">
              <div className="border h-full">

              </div>
              <h1 className="">Technique ML</h1>
            </div>

            <div className="col-span-6 md:col-span-3 md:row-span-2 flex flex-col bg-amber-200/50 rounded-lg shadow-md p-4">
              <div className="border h-full">

              </div>
              <h1 className="">Evaluation</h1>
            </div>

            <div className="col-span-6 md:col-span-3 md:row-span-2 flex flex-col bg-green-200/50 rounded-lg shadow-md p-4">
              <div className="border h-full">
                
              </div>
              <h1 className="">??????</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Description
