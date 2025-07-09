function AuthImagePattern({ title, subTile }) {
  return (
    <div className='hidden lg:flex items-center justify-center h-screen bg-base-200 p-12'>
      <div className="max-w-sm text-center mx-auto">
        <div className="grid grid-cols-3 gap-2 mb-8 max-w-xs mx-auto">
          {
            [...Array(9)].map((_, i) => (
              <div key={i} className={`aspect-square rounded-lg bg-primary opacity-10 ${i % 2 === 0 ? 'animate-pulse' : ''}`} />
            ))
          }
        </div>

        <h2 className='text-2xl font-bold mb-4'>{title}</h2>
        <p className='text-base-content/60'>{subTile}</p>
      </div>
    </div>
  )
}

export default AuthImagePattern;