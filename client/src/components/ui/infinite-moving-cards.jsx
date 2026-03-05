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
  const [start, setStart] = useState(false);

  const getDirection = React.useCallback(() => {
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
  }, [direction]);

  const getSpeed = React.useCallback(() => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  }, [speed]);

  const addAnimation = React.useCallback(() => {
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
  }, [getDirection, getSpeed]);

  useEffect(() => {
    addAnimation();
  }, [addAnimation]);

  return (
    <div
      ref={containerRef}
      style={{ maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)' }}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "imc-track flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap list-none m-0 p-0",
          start && "animate-scroll",
          pauseOnHover && "imc-track-hover-slow"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="imc-card w-72 md:w-80 max-w-full relative rounded-xl border border-border flex-shrink-0 bg-card/80 backdrop-blur-xl px-6 py-5 md:px-8 md:py-6 shadow-sm hover:shadow-md hover:border-foreground/20 transition-all duration-300 hover:scale-[1.02] hover:z-10"
            key={item.title + idx}
          >
            <div className="imc-content relative z-20 flex flex-row items-center justify-between gap-4">
              <span className="imc-meta flex gap-4 items-center">
                <div className="imc-icon relative w-10 h-10 flex items-center justify-center rounded-full bg-muted border border-border">
                  {typeof item.icon === 'string' ? (
                    <img src={item.icon} alt={item.title} className="w-6 h-6 object-contain" />
                  ) : (
                    <div className="text-muted-foreground">
                      {item.icon}
                    </div>
                  )}
                </div>
                <span className="imc-title text-sm leading-relaxed text-muted-foreground font-medium">
                  {item.title}
                </span>
              </span>
              <span className="imc-amount text-lg leading-relaxed text-foreground font-bold tracking-tight font-mono">
                {item.amount}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
