import { ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MobileCarouselProps {
  children: ReactNode[];
  className?: string;
  showControls?: boolean;
  itemClassName?: string;
}

const MobileCarousel = ({
  children,
  className = "",
  showControls = false,
  itemClassName = "basis-[85%] sm:basis-1/2",
}: MobileCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className={`w-full ${className}`}
    >
      <CarouselContent className="-ml-2">
        {children.map((child, index) => (
          <CarouselItem key={index} className={`pl-2 ${itemClassName}`}>
            {child}
          </CarouselItem>
        ))}
      </CarouselContent>
      {showControls && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}
    </Carousel>
  );
};

export default MobileCarousel;
