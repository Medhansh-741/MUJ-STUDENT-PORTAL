export default function MUJWordmark() {
  return (
    <div className="flex items-start gap-3 select-none">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqMizb-k0WJm7o8hscsacJDxtmnouJtgtzSg&s"
        alt="MUJ Crest"
        className="w-[90px] h-[90px] object-contain shrink-0"
        draggable={false}
      />
      <div className="leading-[0.95] text-black">
        <div style={{fontFamily:"Cinzel,serif", letterSpacing:"0.04em"}} className="text-[44px] font-black">MANIPAL</div>
        <div style={{fontFamily:"Cinzel,serif", letterSpacing:"0.06em"}} className="text-[30px] font-bold tracking-wider">UNIVERSITY JAIPUR</div>
        <div className="mt-1 h-[1px] w-full bg-black/70" />
        <div style={{fontFamily:"Cormorant Garamond,serif"}} className="mt-1 italic text-[13px] text-black/80">
          Established under the Manipal University Jaipur Act (No. 21 of 2011)
        </div>
      </div>
    </div>
  );
}

