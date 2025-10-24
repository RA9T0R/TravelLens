const Description = () => {
  return (
    <div className="py-12 px-1 md:px-10 xl:20 bg-bg dark:bg-Dark_bg text-text dark:text-Dark_text">
      <div className="mx-auto">
        {/* Title */}
        <h1 className="text-xl md:text-3xl lg:text-5xl font-extrabold text-center mb-12">
          Machine Learning Project Overview
        </h1>

        {/* Bento Grid */}
        <div className="flex items-center justify-center">
          <div className="grid h-full w-full grid-cols-6 grid-rows-5 gap-4 p-5 rounded-lg text-lg md:text-xl lg:text-2xl font-bold">
            
            {/* Datasets */}
            <div className="col-span-6 md:col-span-2 md:row-span-3 flex flex-col bg-surface dark:bg-Dark_surface rounded-xl shadow-lg p-5 border-t-4 border-primary dark:border-Dark_primary">
              <div className="h-full overflow-y-auto text-base font-normal space-y-3">
                <p className="mb-3 text-lg font-semibold">The Content-Based Image Retrieval (CBIR) system utilizes a proprietary, multi-split dataset for rigorous ML evaluation:</p>
                
                <ul className="list-none space-y-2">
                  <li className="flex items-start">
                    <span className="text-xl mr-2">📂</span>
                    <div>
                      <b>Source Structure:</b> <code className="bg-primary dark:bg-Dark_primary text-white px-2 py-0.5 rounded-md font-mono">Google_Images</code>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-2">🧠</span>
                    <div>
                      <b>Training Set (train):</b> Used to teach the ResNet50 model the image features, generating the initial <b>2048-dim image embeddings</b> (vectors).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-2">🔍</span>
                    <div>
                      <b>Validation Set (val):</b> Used for <b>internal performance assessment</b>, acting as a query pool to measure the model's per-label consistency.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-xl mr-2">🛡️</span>
                    <div>
                      <b>Test Set (test):</b> Reserved for the <b>final, blind evaluation</b> to confirm the model's true generalization ability on completely unseen data.
                    </div>
                  </li>
                </ul>

                <p className="mt-4 border-t pt-3 border-primary dark:border-Dark_primary">
                  <span className="font-extrabold">Ground Truth:</span> Each image is <b>labeled</b> implicitly by its category, serving as the required <b>Ground Truth</b> for calculating retrieval metrics (Precision, Recall, MAP).
                </p>
              </div>
              
              <h1 className="text-xl md:text-3xl lg:text-4xl mt-3">Datasets 📊</h1>
            </div>

            {/* Input/Output */}
            <div className="col-span-6 md:col-span-2 md:row-span-3 flex flex-col rounded-xl shadow-lg p-5 border-t-4 bg-surface dark:bg-Dark_surface border-primary dark:border-Dark_primary">
              <div className="h-full overflow-y-auto text-base font-normal space-y-3">
                <h2 className="text-lg font-semibold mb-3">Input (Query) 📤</h2>
                <ul className="list-none space-y-2 border-b pb-3 border-primary dark:border-Dark_primary">
                  
                  <li className="flex items-start ">
                    <span className="text-xl mr-2">🖼️</span>
                    <div>
                      <b>Raw Image File:</b> Uploaded by the user via the React web app (e.g., <code className="font-mono bg-primary dark:bg-Dark_primary px-1 rounded text-white">.jpg</code>, <code className="font-mono bg-primary dark:bg-Dark_primary px-1 rounded text-white">.png</code>).
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="text-xl mr-2">🔢</span>
                    <div>
                      <b>Image Vector (Embedding):</b> The FastAPI backend processes the image into the high-dimensional <b>2048-vector</b> for the database query.
                    </div>
                  </li>
                </ul>
                
                <h2 className="text-lg font-semibold pt-3 mb-3 ">Output (Result) 📥</h2>
                <ul className="list-none space-y-2">
                  
                  <li className="flex items-start">
                    <span className="text-xl mr-2">🔎</span>
                    <div>
                      <b>Similar Images:</b> A ranked list of image references (paths and labels) retrieved by the <b>vector search</b> query.
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="text-xl mr-2">📏</span>
                    <div>
                      <b>Similarity Score/Distance:</b> The numerical value from the SQL query indicating how close the image's vector is to the query's vector.
                    </div>
                  </li>
                </ul>
              </div>
              
              <h1 className="text-xl md:text-3xl lg:text-4xl mt-3">Input/Output 🖼️</h1>
            </div>

            {/* Technique ML */}
            <div className="col-span-6 md:col-span-2 md:row-span-3 flex flex-col rounded-xl shadow-lg p-5 border-t-4 bg-surface dark:bg-Dark_surface border-primary dark:border-Dark_primary">
              <div className="h-full overflow-y-auto text-base font-normal space-y-3">
                
                <h2 className="text-lg font-semibold mb-3">Model & Feature Extraction 🧠</h2>
                <ul className="list-none space-y-2 border-b pb-3 border-primary dark:border-Dark_primary">
                  
                  <li className="flex items-start">
                    <span className="text-xl mr-2">⚙️</span>
                    <div>
                      <b>Model:</b> We use a pre-trained <b>ResNet50</b> architecture, leveraged not for classification, but as a powerful <b>feature extractor</b>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="text-xl mr-2">📊</span>
                    <div>
                      <b>Process:</b> The image is converted into a <b>2048-dimensional vector</b> (the image embedding) by removing the model's final classification layer.
                    </div>
                  </li>
                </ul>
                
                <h2 className="text-lg font-semibold pt-3 mb-3">Retrieval Method 🔎</h2>
                <ul className="list-none space-y-2">
                  
                  <li className="flex items-start">
                    <span className="text-xl mr-2">💾</span>
                    <div>
                      <b>Vector Search:</b> This technique finds <b>Approximate Nearest Neighbors (ANN)</b>, allowing fast retrieval of images with semantically similar content.
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="text-xl mr-2">📝</span>
                    <div>
                      <b>Similarity Query:</b> Retrieval is executed via a PostgreSQL query that uses the <b>L2 distance operator</b> <code className="font-mono bg-primary dark:bg-Dark_primary text-white px-1 rounded">&lt;-&gt;</code> to measure vector distance and rank similarity. This constitutes the system's <b>semantic search</b> capability.
                    </div>
                  </li>
                </ul>
              </div>
              
              <h1 className="text-xl md:text-2xl lg:text-3xl mt-3">Technique (CBIR) ⚙️</h1>
            </div>

            {/* Evaluation */}
            <div className="col-span-6 md:col-span-3 md:row-span-2 flex flex-col rounded-xl shadow-lg p-5 border-t-4 bg-surface dark:bg-Dark_surface border-primary dark:border-Dark_primary">
              <div className="h-full overflow-y-auto text-base font-normal space-y-3">
                
                <div className="flex flex-col space-y-4 h-full">
                    
                    {/* Overall Performance Summary Box */}
                    <div className="p-4 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-Dark_border)] bg-[var(--color-surface)] dark:bg-[var(--color-Dark_surface)] text-center">
                        <p className="text-sm text-[var(--color-subtext)] dark:text-[var(--color-Dark_subtext)]">
                            Overall Performance (Validation Set @ <b>k=5</b>)
                        </p>
                        <h3 className="text-3xl font-extrabold text-[var(--color-primary)] dark:text-[var(--color-Dark_primary)] mt-1">
                            Avg P@5 : 0.9137
                        </h3>
                        <p className="text-sm mt-1">
                            A <b>Precision of 91.37%</b> means over 9 out of 10 images in the top 5 results are relevant
                        </p>
                    </div>
                    
                    {/* Detailed Per-Label Results Summary */}
                    <div className="flex-grow overflow-y-auto p-1">
                        <h4 className="text-base font-semibold mb-2">
                            Per-Label Consistency Check (Internal Validation) 🔍
                        </h4>
                        <ul className="list-disc list-inside ml-4 space-y-2 text-sm">
                            <li>
                                The <b>k=5</b> cutoff confirms the system prioritizes <b>highly accurate, tight clusters</b> of similar images.
                            </li>
                            <li>
                                <b>Best Precision (P@5) : Stonehenge</b> (0.9886) and <b>Roman Colosseum</b> (0.9850) demonstrate near-perfect top-5 result quality.
                            </li>
                            <li>
                                <b>Highest F1-Score (F1@5):</b> The best balance of Precision and Recall was achieved by <b>The Blue Grotto</b> (0.3414) and <b>Taj Mahal</b> (0.3178).
                            </li>
                        </ul>
                    </div>
                </div>
                
              </div>
              
              <h1 className="text-xl md:text-3xl lg:text-4xl mt-3">Evaluation 📈</h1>
            </div>

            {/* Architecture/Stack */}
            <div className="col-span-6 md:col-span-3 md:row-span-2 flex flex-col rounded-xl shadow-lg p-5 border-t-4 bg-surface dark:bg-Dark_surface border-primary dark:border-Dark_primary">
              <div className="h-full overflow-y-auto text-base font-normal space-y-3">
                
                <h2 className="text-lg font-semibold mb-3">
                  Full-Stack Components
                </h2>
                
                <ul className="list-none space-y-3">
                  <li className="flex items-start">
                    <span className="text-xl mr-2">💻</span>
                    <div>
                      <b>Frontend:</b> <b className="text-primary dark:text-Dark_primary">React</b> - Handles the user interface, image uploads, and result display in a seamless SPA.
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="text-xl mr-2">🚀</span>
                    <div>
                      <b>Backend/API:</b> <b className="text-primary dark:text-Dark_primary">FastAPI</b> - A high-performance Python server that hosts the ML model and processes all search requests.
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="text-xl mr-2">🗃️</span>
                    <div>
                      <b>Database:</b> <b className="text-primary dark:text-Dark_primary">Supabase</b> - Uses PostgreSQL integrated with the <code className="font-mono bg-primary dark:bg-Dark_primary text-white px-1 rounded">pgvector</code> extension for efficient vector storage and distance querying.
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="text-xl mr-2">🤖</span>
                    <div>
                      <b>Model Core:</b> <b className="text-primary dark:text-Dark_primary">ResNet50</b> - The deep learning model used for extracting high-dimensional image embeddings (features).
                    </div>
                  </li>
                </ul>
                <p className="mt-4 border-t pt-3  border-primary dark:border-Dark_primary">
                  <span className="font-medium ">Data Flow :</span> The user uploads an image → <b>FastAPI</b> generates the <b>ResNet50</b> embedding → <b>Supabase</b> performs the vector search → <b>React</b> displays the resulting image references
                </p>
              </div>
              
              <h1 className="text-xl md:text-3xl lg:text-4xl mt-3">Architecture/Stack 🏗️</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Description