import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[280px] md:w-[320px] max-w-full relative rounded-2xl border border-white/10 flex-shrink-0 bg-neutral-900/50 backdrop-blur-xl px-6 py-5 md:px-8 md:py-6 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:border-primary/30 transition-all duration-300"
            key={item.title + idx}
          >
            <div className="relative z-20 flex flex-row items-center justify-between gap-4">
              <span className="flex gap-4 items-center">
                <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800/50 border border-white/10">
                  {typeof item.icon === 'string' ? (
                    <img src={item.icon} alt={item.title} className="w-6 h-6 object-contain opacity-90" />
                  ) : (
                    <div className="text-neutral-400">
                      {item.icon}
                    </div>
                  )}
                </div>
                <span className="text-sm leading-[1.6] text-neutral-300 font-medium">
                  {item.title}
                </span>
              </span>
              <span className="text-lg leading-[1.6] text-white font-bold tracking-tight">
                {item.amount}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};